import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Shield, Tag, Trash2, Edit, Search, PlusCircle, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

const AdminForum = () => {
    const { toast } = useToast();
    const [reportedContent, setReportedContent] = useState([
        { id: 1, topic: 'Promoção imperdível - Clique aqui!', reason: 'Spam/Link suspeito', reportedBy: 'Maria Costa' },
        { id: 2, topic: 'Discussão sobre política local', reason: 'Discurso de ódio', reportedBy: 'Carlos Pereira' },
    ]);
    const [categories, setCategories] = useState([
        { id: 1, name: 'Notícias', topics: 152 }, { id: 2, name: 'Empregos', topics: 89 }, { id: 3, name: 'Negócios', topics: 210 },
    ]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAction = (action, description) => {
        toast({ title: action, description });
    };

    const handleManageReport = (id, action) => {
        setReportedContent(prev => prev.filter(item => item.id !== id));
        handleAction(`Denúncia ${action}`, `A denúncia para o item ID ${id} foi marcada como resolvida.`);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        const newCat = { id: Date.now(), name: newCategoryName, topics: 0 };
        setCategories(prev => [...prev, newCat]);
        setNewCategoryName('');
        handleAction('Categoria Adicionada', `A categoria "${newCategoryName}" foi criada.`);
    };
    
    const handleDeleteCategory = (id, name) => {
         setCategories(prev => prev.filter(item => item.id !== id));
         handleAction('Categoria Removida', `A categoria "${name}" foi removida.`);
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Moderação do Fórum</title></Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><MessageSquare className="mr-3 text-rose-600" /> Moderação do Fórum</h1>
                    <p className="text-gray-700 mt-1">Gerencie tópicos, categorias e denúncias da comunidade.</p>
                </div>

                <Tabs defaultValue="reports">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-gray-300">
                        <TabsTrigger value="reports">Conteúdo Denunciado</TabsTrigger>
                        <TabsTrigger value="topics">Gerenciar Tópicos</TabsTrigger>
                        <TabsTrigger value="categories">Gerenciar Categorias</TabsTrigger>
                    </TabsList>

                    <TabsContent value="reports" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader><CardTitle className="text-gray-900 flex items-center"><Shield className="mr-2 text-red-500" /> Conteúdo Denunciado</CardTitle></CardHeader>
                            <CardContent><Table>
                                <TableHeader><TableRow className="border-b border-gray-400"><TableHead className="text-gray-800 font-semibold">Conteúdo</TableHead><TableHead className="text-gray-800 font-semibold">Motivo</TableHead><TableHead className="text-gray-800 font-semibold text-right">Ações</TableHead></TableRow></TableHeader>
                                <TableBody>{reportedContent.map(item => (
                                    <TableRow key={item.id} className="border-b-gray-300">
                                        <TableCell><p className="font-medium">{item.topic}</p><span className="text-xs text-gray-500">Denunciado por: {item.reportedBy}</span></TableCell>
                                        <TableCell className="text-red-600">{item.reason}</TableCell>
                                        <TableCell className="text-right">
                                            <Button onClick={() => handleManageReport(item.id, 'removida')} variant="ghost" size="sm" style={{color: '#dc3545'}}><Trash2 className="mr-1 h-4 w-4"/>Remover</Button>
                                            <Button onClick={() => handleManageReport(item.id, 'ignorada')} variant="ghost" size="sm" style={{color: '#6c757d'}}><Ban className="mr-1 h-4 w-4"/>Ignorar</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}</TableBody>
                            </Table></CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="topics" className="mt-4"><Card className="border-gray-400 bg-white">
                        <CardHeader><CardTitle className="text-gray-900">Gerenciar Tópicos</CardTitle></CardHeader>
                        <CardContent><p className="text-center p-8 text-gray-600">Busca e gerenciamento de tópicos em desenvolvimento.</p></CardContent>
                    </Card></TabsContent>
                     <TabsContent value="categories" className="mt-4"><Card className="border-gray-400 bg-white">
                        <CardHeader><CardTitle className="text-gray-900 flex items-center"><Tag className="mr-2" /> Gerenciar Categorias</CardTitle><CardDescription>Crie, edite ou remova categorias do fórum.</CardDescription></CardHeader>
                        <CardContent>
                             <div className="flex gap-2 mb-4"><Input placeholder="Nome da nova categoria..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="border-gray-400 bg-white" /><Button onClick={handleAddCategory} style={{backgroundColor: '#007bff', color: '#fff'}}><PlusCircle size={16} className="mr-2"/>Adicionar</Button></div>
                            <div className="overflow-x-auto border rounded-lg border-gray-400">
                            <Table>
                                <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400"><TableHead className="text-gray-800 font-semibold">Nome da Categoria</TableHead><TableHead className="text-gray-800 font-semibold">Nº de Tópicos</TableHead><TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead></TableRow></TableHeader>
                                <TableBody>{categories.map(cat => (
                                    <TableRow key={cat.id} className="border-b-gray-300">
                                        <TableCell className="font-medium text-gray-900">{cat.name}</TableCell><TableCell className="text-gray-700">{cat.topics}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" style={{color: '#007bff'}} title="Editar"><Edit size={16}/></Button>
                                            <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon" style={{color: '#dc3545'}} title="Excluir"><Trash2 size={16}/></Button></AlertDialogTrigger>
                                            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remover "{cat.name}"?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita. Todos os tópicos nesta categoria serão movidos para "Geral".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCategory(cat.id, cat.name)}>Confirmar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}</TableBody>
                            </Table>
                            </div>
                        </CardContent>
                    </Card></TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default AdminForum;