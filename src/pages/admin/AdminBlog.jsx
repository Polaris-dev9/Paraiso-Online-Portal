import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Rss, PlusCircle, Edit, Trash, Search, MessageSquare, CheckCircle, XCircle, UserCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/common/RichTextEditor';

const AdminBlog = () => {
    const { toast } = useToast();
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        setPosts(JSON.parse(localStorage.getItem('ppo_blog_posts')) || [{ id: 1, title: '5 Dicas de Marketing', category: 'Marketing', status: 'Publicado', author: 'Equipe PPO' }]);
        setComments(JSON.parse(localStorage.getItem('ppo_blog_comments')) || [{ id: 1, author: 'Leitor', content: 'Adorei as dicas!', post_title: '5 Dicas', status: 'Pendente' }]);
        setCategories(JSON.parse(localStorage.getItem('ppo_blog_categories')) || ['Marketing', 'E-commerce', 'Vendas', 'Gestão', 'Finanças']);
        setAuthors(JSON.parse(localStorage.getItem('ppo_journalists')) || ['Equipe PPO', 'Consultor Externo']);
    }, []);

    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    const handleOpenForm = (postItem = null) => {
        const defaultPost = { title: '', category: 'Marketing', author: 'Equipe PPO', status: 'Rascunho', content: '' };
        setCurrentPost(postItem ? { ...defaultPost, ...postItem } : defaultPost);
        setIsFormOpen(true);
    };

    const handleSavePost = (e) => {
        e.preventDefault();
        const updatedPosts = currentPost.id ? posts.map(p => p.id === currentPost.id ? currentPost : p) : [...posts, { ...currentPost, id: Date.now() }];
        setPosts(updatedPosts);
        saveData('ppo_blog_posts', updatedPosts);
        setIsFormOpen(false);
        toast({ title: "Sucesso!", description: `Artigo do blog salvo.` });
    };

    const handleCommentStatus = (id, status) => {
        const updatedComments = comments.map(c => c.id === id ? { ...c, status } : c);
        setComments(updatedComments);
        saveData('ppo_blog_comments', updatedComments);
        toast({ title: `Comentário ${status.toLowerCase()}` });
    };
    
    const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
            <Helmet><title>Admin: Blog do Empreendedor</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Rss className="mr-3 text-orange-600" /> Blog do Empreendedor</h1>
                    <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Criar Artigo</Button>
                </div>
                <Tabs defaultValue="posts">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-300">
                        <TabsTrigger value="posts">Artigos</TabsTrigger>
                        <TabsTrigger value="comments">Moderar Comentários</TabsTrigger>
                    </TabsList>
                    <TabsContent value="posts" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader><CardTitle className="text-gray-900">Todos os Artigos</CardTitle></CardHeader>
                            <CardContent>
                                <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                                <div className="overflow-x-auto border rounded-lg border-gray-400"><Table>
                                    <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400"><TableHead className="text-gray-800 font-semibold">Título</TableHead><TableHead className="text-gray-800 font-semibold">Status</TableHead><TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead></TableRow></TableHeader>
                                    <TableBody>{filteredPosts.map(item => (<TableRow key={item.id} className="border-b border-gray-300"><TableCell className="font-medium text-gray-900">{item.title}</TableCell><TableCell><Badge className={getStatusBadge(item.status)}>{item.status}</Badge></TableCell><TableCell className="text-right"><Button onClick={() => handleOpenForm(item)} variant="ghost" size="icon" title="Editar" style={{ color: '#007bff' }}><Edit size={16} /></Button></TableCell></TableRow>))}</TableBody>
                                </Table></div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="comments" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader><CardTitle className="text-gray-900">Comentários Pendentes</CardTitle></CardHeader>
                            <CardContent><div className="space-y-4">{comments.filter(c => c.status === 'Pendente').map(comment => (<div key={comment.id} className="flex items-start gap-4 p-4 border rounded-lg border-gray-400 bg-gray-50"><Avatar><AvatarFallback>{comment.author.charAt(0)}</AvatarFallback></Avatar><div className="flex-grow"><p className="font-semibold text-gray-900">{comment.author}</p><p className="text-gray-800 mt-1">{comment.content}</p></div><div className="flex gap-2"><Button onClick={() => handleCommentStatus(comment.id, 'Aprovado')} variant="ghost" size="icon" title="Aprovar" style={{ color: '#28a745' }}><CheckCircle size={20} /></Button><Button onClick={() => handleCommentStatus(comment.id, 'Recusado')} variant="ghost" size="icon" title="Recusar" style={{ color: '#dc3545' }}><XCircle size={20} /></Button></div></div>))}{comments.filter(c => c.status === 'Pendente').length === 0 && <p className="text-center text-gray-600 p-4">Nenhum comentário pendente.</p>}</div></CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-4xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentPost?.id ? 'Editar' : 'Criar'} Artigo</DialogTitle></DialogHeader>
                    {currentPost && <form onSubmit={handleSavePost} className="max-h-[75vh] overflow-y-auto pr-4 space-y-4">
                        <div><Label htmlFor="title" className="text-gray-800">Título</Label><Input id="title" value={currentPost.title} onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})} className="border-gray-400 bg-white"/></div>
                        <div><Label htmlFor="content" className="text-gray-800">Conteúdo</Label><RichTextEditor value={currentPost.content || ''} onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="author" className="text-gray-800 flex items-center"><UserCircle className="mr-2"/>Autor</Label><Select value={currentPost.author} onValueChange={(v) => setCurrentPost({...currentPost, author: v})}><SelectTrigger className="border-gray-400 bg-white"><SelectValue /></SelectTrigger><SelectContent>{authors.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}</SelectContent></Select></div>
                            <div><Label htmlFor="category" className="text-gray-800 flex items-center"><Tag className="mr-2"/>Categoria</Label><Select value={currentPost.category} onValueChange={(v) => setCurrentPost({...currentPost, category: v})}><SelectTrigger className="border-gray-400 bg-white"><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}<Button size="sm" variant="ghost" className="w-full mt-1">Criar nova</Button></SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="status" className="text-gray-800">Status</Label><Select value={currentPost.status} onValueChange={(v) => setCurrentPost({...currentPost, status: v})}><SelectTrigger className="border-gray-400 bg-white"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Rascunho">Rascunho</SelectItem><SelectItem value="Agendado">Agendado</SelectItem><SelectItem value="Publicado">Publicado</SelectItem></SelectContent></Select></div>
                             <div><Label htmlFor="publishDate" className="text-gray-800">Agendar Publicação</Label><Input id="publishDate" type="date" value={currentPost.publishDate} onChange={(e) => setCurrentPost({...currentPost, publishDate: e.target.value})} className="border-gray-400 bg-white"/></div>
                        </div>
                        <DialogFooter className="mt-6 pt-4 border-t border-gray-300"><Button type="button" onClick={() => setIsFormOpen(false)} style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</Button><Button type="submit" style={{backgroundColor: '#28a745', color: '#fff'}}>Salvar</Button></DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBlog;