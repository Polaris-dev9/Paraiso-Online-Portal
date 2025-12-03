import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Building2, PlusCircle, Edit, Trash, Search, Lock, Settings, Tag, ScrollText as Tooltip, PanelTop as TooltipContent, LayoutDashboard as TooltipProvider, Timer as TooltipTrigger, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { categoryService } from '@/services/categoryService';

const AdminCommercialGuide = () => {
    const { toast } = useToast();
    
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [isDeletingCategory, setIsDeletingCategory] = useState(null);

    // Carregar categorias do Supabase
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setCategoriesLoading(true);
            const data = await categoryService.getCategoriesWithSubcategories('commercial');
            
            // Transformar para o formato esperado pelo componente
            const formattedCategories = data.map(cat => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                subcategories: cat.subcategories || []
            }));
            
            setCategories(formattedCategories);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar categorias",
                description: error.message || "Não foi possível carregar as categorias."
            });
        } finally {
            setCategoriesLoading(false);
            setLoading(false);
        }
    };

    // Manter empresas em localStorage por enquanto (será migrado depois)
    useEffect(() => {
        const storedCompanies = JSON.parse(localStorage.getItem('ppo_companies')) || [];
        setCompanies(storedCompanies);
    }, []);

    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    const filteredCompanies = useMemo(() => 
        companies.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.category.toLowerCase().includes(searchTerm.toLowerCase())
        ), [companies, searchTerm]);

    const handleOpenForm = (company = null) => {
        const defaultCompany = { name: '', category: '', plan: 'Gratuito', status: true, password: '', description: '' };
        setCurrentCompany(company ? { ...defaultCompany, ...company } : defaultCompany);
        setIsFormOpen(true);
    };

    const handleSaveCompany = (e) => {
        e.preventDefault();
        const updatedCompanies = currentCompany.id ? companies.map(c => c.id === currentCompany.id ? currentCompany : c) : [...companies, { ...currentCompany, id: Date.now() }];
        setCompanies(updatedCompanies);
        saveData('ppo_companies', updatedCompanies);
        setIsFormOpen(false);
        toast({ title: "Cadastro salvo com sucesso!", description: `Empresa ${currentCompany.id ? 'atualizada' : 'criada'}.` });
    };

    const handleDeleteCompany = (id) => {
        const updatedCompanies = companies.filter(c => c.id !== id);
        setCompanies(updatedCompanies);
        saveData('ppo_companies', updatedCompanies);
        toast({ title: "Registro desativado!", description: "A empresa foi removida." });
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast({
                variant: "destructive",
                title: "Campo vazio",
                description: "Por favor, digite o nome da categoria."
            });
            return;
        }

        try {
            setCategoriesLoading(true);
            const newCategory = await categoryService.createCategory({
                name: newCategoryName,
                type: 'commercial',
                order_index: categories.length
            });

            // Recarregar categorias do Supabase
            await loadCategories();
            
            setNewCategoryName('');
            toast({ 
                title: 'Categoria Adicionada!', 
                description: `A categoria "${newCategoryName}" foi criada com sucesso.`
            });
        } catch (error) {
            console.error('Error adding category:', error);
            toast({
                variant: "destructive",
                title: "Erro ao adicionar categoria",
                description: error.message || "Não foi possível criar a categoria."
            });
        } finally {
            setCategoriesLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId, categoryName) => {
        try {
            setIsDeletingCategory(categoryId);
            await categoryService.deleteCategory(categoryId);
            
            // Recarregar categorias
            await loadCategories();
            
            toast({ 
                title: 'Categoria Removida!', 
                description: `A categoria "${categoryName}" foi removida.`
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            toast({
                variant: "destructive",
                title: "Erro ao remover categoria",
                description: error.message || "Não foi possível remover a categoria."
            });
        } finally {
            setIsDeletingCategory(null);
        }
    };

    const toggleCompanyStatus = (companyId) => {
        const updatedCompanies = companies.map(c => 
            c.id === companyId ? { ...c, status: !c.status } : c
        );
        setCompanies(updatedCompanies);
        saveData('ppo_companies', updatedCompanies);
        const company = companies.find(c => c.id === companyId);
        toast({ title: "Alteração aplicada!", description: `Status de "${company.name}" alterado para ${!company.status ? 'Ativo' : 'Inativo'}.` });
    };
    
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Guia Comercial</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Building2 className="mr-3 text-blue-800" /> Guia Comercial</h1>
                        <p className="text-gray-700 mt-1">Gerencie as empresas e categorias do guia.</p>
                    </div>
                    <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Adicionar Empresa</Button>
                </div>
                <Tabs defaultValue="companies">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-300">
                        <TabsTrigger value="companies">Empresas</TabsTrigger>
                        <TabsTrigger value="settings">Configurações do Guia</TabsTrigger>
                    </TabsList>
                    <TabsContent value="companies" className="mt-4">
                        <Card className="border border-gray-400 bg-white">
                            <CardHeader><CardTitle className="text-gray-900">Lista de Empresas</CardTitle></CardHeader>
                            <CardContent>
                                <div className="relative w-full max-w-sm mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar por nome ou categoria..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                                <div className="overflow-x-auto border border-gray-400 rounded-lg"><Table>
                                    <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400">
                                        <TableHead className="text-gray-800 font-semibold">Empresa</TableHead>
                                        <TableHead className="text-gray-800 font-semibold">Categoria</TableHead>
                                        <TableHead className="text-center text-gray-800 font-semibold">Status</TableHead>
                                        <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                    </TableRow></TableHeader>
                                    <TableBody>
                                        {filteredCompanies.map(company => (
                                            <TableRow key={company.id} className="border-b border-gray-300">
                                                <TableCell className="font-medium text-gray-900">{company.name}</TableCell>
                                                <TableCell className="text-gray-700">{company.category}</TableCell>
                                                <TableCell className="text-center">
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Switch
                                                                    checked={company.status}
                                                                    onCheckedChange={() => toggleCompanyStatus(company.id)}
                                                                    className="data-[state=checked]:bg-[#00C853] data-[state=unchecked]:bg-[#D32F2F]"
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>{company.status ? 'Desativar' : 'Ativar'}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell className="text-right"><div className="flex gap-1 justify-end">
                                                    <Button onClick={() => handleOpenForm(company)} variant="ghost" size="icon" title="Editar" style={{ color: '#007bff' }}><Edit size={16} /></Button>
                                                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Excluir" style={{ color: '#dc3545' }}><Trash size={16} /></Button></AlertDialogTrigger>
                                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle></AlertDialogHeader>
                                                        <AlertDialogDescription>Tem certeza que deseja excluir "{company.name}"?</AlertDialogDescription>
                                                        <AlertDialogFooter><AlertDialogCancel style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCompany(company.id)} style={{backgroundColor: '#dc3545', color: '#fff'}}>Excluir</AlertDialogAction></AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table></div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="settings" className="mt-4">
                        <Card className="border border-gray-400 bg-white">
                            <CardHeader><CardTitle className="text-gray-900 flex items-center"><Tag className="mr-2"/> Gerenciar Categorias</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex gap-2 mb-4">
                                    <Input 
                                        placeholder="Nome da nova categoria..." 
                                        value={newCategoryName} 
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        className="border-gray-400 bg-white"
                                        disabled={categoriesLoading}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddCategory();
                                            }
                                        }}
                                    />
                                    <Button 
                                        onClick={handleAddCategory}
                                        disabled={categoriesLoading || !newCategoryName.trim()}
                                    >
                                        {categoriesLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Adicionando...
                                            </>
                                        ) : (
                                            'Adicionar'
                                        )}
                                    </Button>
                                </div>
                                {categoriesLoading && categories.length === 0 ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                        <span className="ml-2 text-gray-600">Carregando categorias...</span>
                                    </div>
                                ) : (
                                    <div className="border rounded-lg overflow-hidden border-gray-400">
                                        {categories.length === 0 ? (
                                            <div className="p-6 text-center text-gray-500">
                                                Nenhuma categoria cadastrada. Adicione uma categoria acima.
                                            </div>
                                        ) : (
                                            categories.map(cat => (
                                                <div 
                                                    key={cat.id} 
                                                    className="p-3 border-b border-gray-300 last:border-b-0 flex justify-between items-center"
                                                >
                                                    <div className="flex-1">
                                                        <span className="font-medium">{cat.name}</span>
                                                        {cat.subcategories && cat.subcategories.length > 0 && (
                                                            <span className="ml-2 text-sm text-gray-500">
                                                                ({cat.subcategories.length} subcategoria{cat.subcategories.length > 1 ? 's' : ''})
                                                            </span>
                                                        )}
                                                    </div>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon"
                                                                disabled={isDeletingCategory === cat.id}
                                                                title="Excluir categoria"
                                                            >
                                                                {isDeletingCategory === cat.id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Trash size={16} className="text-red-600" />
                                                                )}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Tem certeza que deseja excluir a categoria "{cat.name}"?
                                                                    {cat.subcategories && cat.subcategories.length > 0 && (
                                                                        <span className="block mt-2 text-amber-600">
                                                                            Atenção: Esta categoria possui {cat.subcategories.length} subcategoria(s) que também serão removidas.
                                                                        </span>
                                                                    )}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                                                    style={{backgroundColor: '#dc3545', color: '#fff'}}
                                                                >
                                                                    Excluir
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-4xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentCompany?.id ? 'Editar' : 'Adicionar'} Empresa</DialogTitle></DialogHeader>
                    {currentCompany && <form onSubmit={handleSaveCompany} className="max-h-[75vh] overflow-y-auto pr-4 space-y-4">
                        <Label htmlFor="name" className="text-gray-800">Nome da Empresa</Label><Input id="name" value={currentCompany.name} onChange={(e) => setCurrentCompany({...currentCompany, name: e.target.value})} className="border-gray-400 bg-white" placeholder="Ex: Restaurante Sabor Divino"/>
                        <Label htmlFor="category" className="text-gray-800">Categoria</Label>
                        <Select 
                            onValueChange={(v) => setCurrentCompany({...currentCompany, category: v})} 
                            value={currentCompany.category}
                        >
                            <SelectTrigger className="border-gray-400 bg-white">
                                <SelectValue placeholder="Selecione uma categoria..." />
                            </SelectTrigger>
                            <SelectContent>
                                {categoriesLoading ? (
                                    <div className="p-4 text-center">
                                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                                        <p className="text-sm text-gray-500 mt-2">Carregando...</p>
                                    </div>
                                ) : categories.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        Nenhuma categoria disponível
                                    </div>
                                ) : (
                                    categories.map(c => (
                                        <SelectItem key={c.id} value={c.name || c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Label htmlFor="password" className="text-gray-800">Senha de Admin</Label><Input id="password" value={currentCompany.password} onChange={(e) => setCurrentCompany({...currentCompany, password: e.target.value})} placeholder="Senha para o assinante editar sua página" className="border-gray-400 bg-white"/>
                        <div className="flex items-center space-x-2"><Checkbox id="status" checked={currentCompany.status} onCheckedChange={(c) => setCurrentCompany({...currentCompany, status: c})} /><Label htmlFor="status">Ativa</Label></div>
                        <DialogFooter className="mt-6 pt-4 border-t border-gray-300"><Button type="button" onClick={() => setIsFormOpen(false)} style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</Button><Button type="submit" style={{backgroundColor: '#28a745', color: '#fff'}}>Salvar</Button></DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCommercialGuide;