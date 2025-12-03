import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Newspaper, PlusCircle, Edit, Trash, Search, MessageSquare, CheckCircle, XCircle, UserCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/common/RichTextEditor';

const AdminPublishNews = () => {
    const { toast } = useToast();
    const [news, setNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [categories, setCategories] = useState([]);
    const [journalists, setJournalists] = useState([]);

    useEffect(() => {
        setNews(JSON.parse(localStorage.getItem('ppo_news')) || [{ id: 1, title: 'Festival de Inverno', category: 'Cultura', status: 'Publicado', author: 'Ana Paula' }]);
        setCategories(JSON.parse(localStorage.getItem('ppo_news_categories')) || ['Cultura', 'Cidade', 'Comércio', 'Política', 'Esportes', 'Tecnologia']);
        setJournalists(JSON.parse(localStorage.getItem('ppo_journalists')) || ['Ana Paula', 'Carlos Mendes', 'Admin']);
    }, []);

    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    const handleOpenForm = (newsItem = null) => {
        const defaultNews = { title: '', category: 'Geral', author: 'Admin', status: 'Rascunho', content: '', publishDate: new Date().toISOString().split('T')[0] };
        setCurrentNews(newsItem ? { ...defaultNews, ...newsItem } : defaultNews);
        setIsFormOpen(true);
    };

    const handleSaveNews = (e) => {
        e.preventDefault();
        const updatedNews = currentNews.id ? news.map(n => n.id === currentNews.id ? currentNews : n) : [...news, { ...currentNews, id: Date.now(), views: 0 }];
        setNews(updatedNews);
        saveData('ppo_news', updatedNews);
        setIsFormOpen(false);
        toast({ title: "Sucesso!", description: `Notícia salva.` });
    };
    
    const filteredNews = news.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Publicado': return 'bg-green-600 text-white';
            case 'Agendado': return 'bg-yellow-500 text-black';
            case 'Rascunho': return 'bg-gray-500 text-white';
            default: return 'bg-red-600 text-white';
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Gerenciar Notícias</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Newspaper className="mr-3 text-blue-800" /> Gerenciar Notícias</h1>
                    <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Criar Notícia</Button>
                </div>
                <Card className="border-gray-400 bg-white">
                    <CardHeader><CardTitle className="text-gray-900">Todas as Notícias</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                        <div className="overflow-x-auto border rounded-lg border-gray-400"><Table>
                            <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400"><TableHead className="text-gray-800 font-semibold">Título</TableHead><TableHead className="text-gray-800 font-semibold">Status</TableHead><TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead></TableRow></TableHeader>
                            <TableBody>{filteredNews.map(item => (<TableRow key={item.id} className="border-b border-gray-300"><TableCell className="font-medium text-gray-900">{item.title}</TableCell><TableCell><Badge className={getStatusBadge(item.status)}>{item.status}</Badge></TableCell><TableCell className="text-right"><Button onClick={() => handleOpenForm(item)} variant="ghost" size="icon" title="Editar" style={{ color: '#007bff' }}><Edit size={16} /></Button></TableCell></TableRow>))}</TableBody>
                        </Table></div>
                    </CardContent>
                </Card>
            </motion.div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-4xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentNews?.id ? 'Editar' : 'Criar'} Notícia</DialogTitle></DialogHeader>
                    {currentNews && <form onSubmit={handleSaveNews} className="max-h-[75vh] overflow-y-auto pr-4 space-y-4">
                        <div><Label htmlFor="title" className="text-gray-800">Título</Label><Input id="title" value={currentNews.title} onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})} className="border-gray-400 bg-white"/></div>
                        <div><Label htmlFor="content" className="text-gray-800">Conteúdo</Label><RichTextEditor value={currentNews.content || ''} onChange={(e) => setCurrentNews({...currentNews, content: e.target.value})} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="author" className="text-gray-800 flex items-center"><UserCircle className="mr-2"/>Jornalista/Colunista</Label><Select value={currentNews.author} onValueChange={(v) => setCurrentNews({...currentNews, author: v})}><SelectTrigger className="border-gray-400 bg-white"><SelectValue /></SelectTrigger><SelectContent>{journalists.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent></Select></div>
                            <div><Label htmlFor="category" className="text-gray-800 flex items-center"><Tag className="mr-2"/>Categoria</Label><Select value={currentNews.category} onValueChange={(v) => setCurrentNews({...currentNews, category: v})}><SelectTrigger className="border-gray-400 bg-white"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}<Button size="sm" variant="ghost" className="w-full mt-1">Criar nova</Button></SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="status" className="text-gray-800">Status</Label><Select value={currentNews.status} onValueChange={(v) => setCurrentNews({...currentNews, status: v})}><SelectTrigger className="border-gray-400 bg-white"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Rascunho">Rascunho</SelectItem><SelectItem value="Agendado">Agendado</SelectItem><SelectItem value="Publicado">Publicado</SelectItem></SelectContent></Select></div>
                             <div><Label htmlFor="publishDate" className="text-gray-800">Data da Publicação</Label><Input id="publishDate" type="date" value={currentNews.publishDate} onChange={(e) => setCurrentNews({...currentNews, publishDate: e.target.value})} className="border-gray-400 bg-white"/></div>
                        </div>
                        <DialogFooter className="mt-6 pt-4 border-t border-gray-300"><Button type="button" onClick={() => setIsFormOpen(false)} style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</Button><Button type="submit" style={{backgroundColor: '#28a745', color: '#fff'}}>Salvar</Button></DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPublishNews;