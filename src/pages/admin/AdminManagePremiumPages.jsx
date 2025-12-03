import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Gem, PlusCircle, Edit, Search, Lock, Unlock, PauseCircle, PlayCircle, Star, Building, User, UserSquare2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const AdminManagePremiumPages = () => {
    const { toast } = useToast();
    
    const [pages, setPages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);

    useEffect(() => {
        const companies = JSON.parse(localStorage.getItem('ppo_companies')) || [];
        const professionals = JSON.parse(localStorage.getItem('ppo_professionals')) || [];
        
        const allPages = [
            ...companies.map(c => ({ ...c, type: 'Empresa', status: c.status ? 'Ativo' : 'Inativo' })),
            ...professionals.map(p => ({ ...p, type: 'Profissional', status: p.status ? 'Ativo' : 'Inativo' })),
            // Mock for public figures
            { id: 100, name: 'Júlia Martins', type: 'Personalidade', status: 'Ativo', plan: 'Premium', password: 'julia', hasPaidAd: false },
        ];
        setPages(allPages);
    }, []);

    const saveData = () => {
        const companies = pages.filter(p => p.type === 'Empresa').map(({ type, ...rest }) => ({ ...rest, status: rest.status === 'Ativo' }));
        const professionals = pages.filter(p => p.type === 'Profissional').map(({ type, ...rest }) => ({ ...rest, status: rest.status === 'Ativo' }));
        localStorage.setItem('ppo_companies', JSON.stringify(companies));
        localStorage.setItem('ppo_professionals', JSON.stringify(professionals));
    };

    const filteredPages = useMemo(() => 
        pages.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.type.toLowerCase().includes(searchTerm.toLowerCase())
        ), [pages, searchTerm]);

    const handleOpenForm = (page = null) => {
        const defaultPage = { name: '', type: 'Empresa', plan: 'Premium', status: 'Ativo', password: '', hasPaidAd: false };
        setCurrentPage(page ? { ...defaultPage, ...page } : defaultPage);
        setIsFormOpen(true);
    };

    const handleSavePage = (e) => {
        e.preventDefault();
        const updatedPages = currentPage.id ? pages.map(p => p.id === currentPage.id ? currentPage : p) : [...pages, { ...currentPage, id: Date.now() }];
        setPages(updatedPages);
        saveData();
        setIsFormOpen(false);
        toast({ title: "Sucesso!", description: `Página ${currentPage.id ? 'atualizada' : 'criada'} com sucesso.` });
    };

    const handleStatusChange = (id, newStatus) => {
        const updatedPages = pages.map(p => p.id === id ? { ...p, status: newStatus } : p);
        setPages(updatedPages);
        saveData();
        toast({ title: "Status Alterado!", description: `A página agora está ${newStatus.toLowerCase()}.` });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Ativo': return 'bg-green-600 text-white';
            case 'Pausado': return 'bg-yellow-500 text-black';
            case 'Bloqueado': return 'bg-red-600 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Empresa': return <Building size={16} className="mr-2" />;
            case 'Profissional': return <User size={16} className="mr-2" />;
            case 'Personalidade': return <UserSquare2 size={16} className="mr-2" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Gerenciar Páginas Premium</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Gem className="mr-3 text-green-600" /> Gerenciar Páginas Premium</h1>
                        <p className="text-gray-700 mt-1">Crie e gerencie as páginas de assinantes Premium.</p>
                    </div>
                    <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Criar Página</Button>
                </div>
                
                <Card className="border border-gray-400 bg-white">
                    <CardHeader><CardTitle className="text-gray-900">Lista de Páginas</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative w-full max-w-sm mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar por nome ou tipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                        <div className="overflow-x-auto border border-gray-400 rounded-lg"><Table>
                            <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400">
                                <TableHead className="text-gray-800 font-semibold">Nome</TableHead>
                                <TableHead className="text-gray-800 font-semibold">Tipo</TableHead>
                                <TableHead className="text-center text-gray-800 font-semibold">Status</TableHead>
                                <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {filteredPages.map(page => (
                                    <TableRow key={page.id} className="border-b border-gray-300">
                                        <TableCell className="font-medium text-gray-900 flex items-center">{page.name} {page.hasPaidAd && <Star size={14} className="ml-2 text-yellow-500 fill-current"/>}</TableCell>
                                        <TableCell className="text-gray-700 flex items-center">{getTypeIcon(page.type)} {page.type}</TableCell>
                                        <TableCell className="text-center"><Badge className={getStatusBadge(page.status)}>{page.status}</Badge></TableCell>
                                        <TableCell className="text-right"><div className="flex gap-1 justify-end">
                                            {page.status === 'Ativo' && <Button onClick={() => handleStatusChange(page.id, 'Pausado')} variant="ghost" size="icon" title="Pausar" style={{ color: '#ffc107' }}><PauseCircle size={16} /></Button>}
                                            {page.status === 'Pausado' && <Button onClick={() => handleStatusChange(page.id, 'Ativo')} variant="ghost" size="icon" title="Ativar" style={{ color: '#28a745' }}><PlayCircle size={16} /></Button>}
                                            {page.status !== 'Bloqueado' && <Button onClick={() => handleStatusChange(page.id, 'Bloqueado')} variant="ghost" size="icon" title="Bloquear" style={{ color: '#dc3545' }}><Lock size={16} /></Button>}
                                            {page.status === 'Bloqueado' && <Button onClick={() => handleStatusChange(page.id, 'Ativo')} variant="ghost" size="icon" title="Desbloquear" style={{ color: '#28a745' }}><Unlock size={16} /></Button>}
                                            <Button onClick={() => handleOpenForm(page)} variant="ghost" size="icon" title="Editar" style={{ color: '#007bff' }}><Edit size={16} /></Button>
                                        </div></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table></div>
                    </CardContent>
                </Card>
            </motion.div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-2xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentPage?.id ? 'Editar' : 'Criar'} Página Premium</DialogTitle></DialogHeader>
                    {currentPage && <form onSubmit={handleSavePage} className="max-h-[75vh] overflow-y-auto pr-4 space-y-4">
                        <Label htmlFor="name" className="text-gray-800">Nome do Assinante</Label><Input id="name" value={currentPage.name} onChange={(e) => setCurrentPage({...currentPage, name: e.target.value})} className="border-gray-400 bg-white"/>
                        <Label htmlFor="type" className="text-gray-800">Tipo de Página</Label><Select onValueChange={(v) => setCurrentPage({...currentPage, type: v})} value={currentPage.type}><SelectTrigger className="border-gray-400 bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Empresa">Empresa</SelectItem><SelectItem value="Profissional">Profissional</SelectItem><SelectItem value="Personalidade">Personalidade</SelectItem></SelectContent></Select>
                        <Label htmlFor="password" className="text-gray-800">Senha de Acesso do Assinante</Label><Input id="password" value={currentPage.password} onChange={(e) => setCurrentPage({...currentPage, password: e.target.value})} placeholder="Senha para o assinante editar" className="border-gray-400 bg-white"/>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="paidAd" checked={currentPage.hasPaidAd} onCheckedChange={(c) => setCurrentPage({...currentPage, hasPaidAd: c})} />
                            <Label htmlFor="paidAd" className="flex items-center gap-2"><Star size={16} className="text-yellow-500"/> Adicionar Destaque Pago</Label>
                        </div>
                        <DialogFooter className="mt-6 pt-4 border-t border-gray-300"><Button type="button" onClick={() => setIsFormOpen(false)} style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</Button><Button type="submit" style={{backgroundColor: '#28a745', color: '#fff'}}>Salvar</Button></DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminManagePremiumPages;