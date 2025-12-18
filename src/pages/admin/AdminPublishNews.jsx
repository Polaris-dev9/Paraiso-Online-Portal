import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Newspaper, PlusCircle, Edit, Trash, Search, MessageSquare, CheckCircle, XCircle, UserCircle, Tag, Loader2, Image as ImageIcon, Link as LinkIcon, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from '@/components/common/RichTextEditor';
import { newsService } from '@/services/newsService';
import { categoryService } from '@/services/categoryService';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '@/components/common/ImageUpload';
import MultiImageUpload from '@/components/common/MultiImageUpload';
import LinksManager from '@/components/common/LinksManager';

const AdminPublishNews = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadNews();
        loadCategories();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            const data = await newsService.getAllNews({ publishedOnly: false });
            setNews(data);
        } catch (error) {
            console.error('Error loading news:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao carregar notícias: " + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategoriesByType('news', true);
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            // Se não houver categorias, usar lista padrão
            setCategories([]);
        }
    };

    const handleOpenForm = (newsItem = null) => {
        if (newsItem) {
            setCurrentNews({
                id: newsItem.id,
                title: newsItem.title || '',
                content: newsItem.content || '',
                excerpt: newsItem.excerpt || '',
                featured_image_url: newsItem.featured_image_url || '',
                banner_url: newsItem.banner_url || '',
                gallery_urls: newsItem.gallery_urls || [],
                related_links: newsItem.related_links || [],
                category_id: newsItem.category_id || '',
                is_published: newsItem.is_published || false,
                published_at: newsItem.published_at ? new Date(newsItem.published_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
            });
        } else {
            setCurrentNews({
                title: '',
                content: '',
                excerpt: '',
                featured_image_url: '',
                banner_url: '',
                gallery_urls: [],
                related_links: [],
                category_id: '',
                is_published: false,
                published_at: new Date().toISOString().split('T')[0]
            });
        }
        setIsFormOpen(true);
    };

    const handleSaveNews = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);

            const newsData = {
                title: currentNews.title,
                content: currentNews.content,
                excerpt: currentNews.excerpt || null,
                featured_image_url: currentNews.featured_image_url || null,
                banner_url: currentNews.banner_url || null,
                gallery_urls: currentNews.gallery_urls || [],
                related_links: currentNews.related_links || [],
                author_id: user?.id || null,
                category_id: currentNews.category_id || null,
                is_published: currentNews.is_published || false,
                published_at: currentNews.is_published && currentNews.published_at 
                    ? new Date(currentNews.published_at).toISOString() 
                    : null
            };

            if (currentNews.id) {
                await newsService.updateNews(currentNews.id, newsData);
                toast({ title: "Sucesso!", description: "Notícia atualizada com sucesso." });
            } else {
                await newsService.createNews(newsData);
                toast({ title: "Sucesso!", description: "Notícia criada com sucesso." });
            }

        setIsFormOpen(false);
            await loadNews();
        } catch (error) {
            console.error('Error saving news:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao salvar notícia: " + error.message
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteNews = async (id) => {
        if (!confirm('Tem certeza que deseja excluir esta notícia?')) {
            return;
        }

        try {
            await newsService.deleteNews(id);
            toast({ title: "Sucesso!", description: "Notícia excluída com sucesso." });
            await loadNews();
        } catch (error) {
            console.error('Error deleting news:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao excluir notícia: " + error.message
            });
        }
    };
    
    const filteredNews = news.filter(n => 
        n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (isPublished) => {
        return isPublished 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-500 text-white';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    if (loading) {
        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center" style={{ backgroundColor: '#e0e0e0' }}>
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

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
                            <TableHeader className="bg-gray-200">
                                <TableRow className="border-b border-gray-400">
                                    <TableHead className="text-gray-800 font-semibold">Título</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Categoria</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Data</TableHead>
                                    <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredNews.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                            Nenhuma notícia encontrada
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredNews.map(item => {
                                        const category = categories.find(c => c.id === item.category_id);
                                        return (
                                            <TableRow key={item.id} className="border-b border-gray-300">
                                                <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                                                <TableCell className="text-gray-700">{category?.name || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge className={getStatusBadge(item.is_published)}>
                                                        {item.is_published ? 'Publicado' : 'Rascunho'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-700">{formatDate(item.published_at || item.created_at)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <Button onClick={() => handleOpenForm(item)} variant="ghost" size="icon" title="Editar" style={{ color: '#007bff' }}>
                                                            <Edit size={16} />
                                                        </Button>
                                                        <Button onClick={() => handleDeleteNews(item.id)} variant="ghost" size="icon" title="Excluir" style={{ color: '#dc3545' }}>
                                                            <Trash size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table></div>
                    </CardContent>
                </Card>
            </motion.div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-4xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentNews?.id ? 'Editar' : 'Criar'} Notícia</DialogTitle></DialogHeader>
                    {currentNews && <form onSubmit={handleSaveNews} className="max-h-[75vh] overflow-y-auto pr-4 space-y-4">
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                                <TabsTrigger value="media">Mídia & Galeria</TabsTrigger>
                                <TabsTrigger value="settings">Configurações</TabsTrigger>
                            </TabsList>

                            <TabsContent value="content" className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-gray-800">Título *</Label>
                                    <Input 
                                        id="title" 
                                        value={currentNews.title} 
                                        onChange={(e) => setCurrentNews({...currentNews, title: e.target.value})} 
                                        className="border-gray-400 bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="excerpt" className="text-gray-800">Resumo (opcional)</Label>
                                    <Input 
                                        id="excerpt" 
                                        value={currentNews.excerpt || ''} 
                                        onChange={(e) => setCurrentNews({...currentNews, excerpt: e.target.value})} 
                                        className="border-gray-400 bg-white"
                                        placeholder="Breve descrição da notícia"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="content" className="text-gray-800">Conteúdo Principal *</Label>
                                    <RichTextEditor 
                                        value={currentNews.content || ''} 
                                        onChange={(e) => setCurrentNews({...currentNews, content: e.target?.value || ''})} 
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-800 flex items-center gap-2 mb-2">
                                        <LinkIcon size={16} /> Links Relacionados
                                    </Label>
                                    <LinksManager 
                                        links={currentNews.related_links} 
                                        onChange={(links) => setCurrentNews({...currentNews, related_links: links})} 
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-3">
                                        <Label className="text-gray-800 font-bold flex items-center gap-2 text-base">
                                            <ImageIcon size={18} className="text-blue-600" /> Imagem Destacada (Card)
                                        </Label>
                                        <p className="text-sm text-gray-500">Esta imagem aparecerá nas listagens e cards de notícias.</p>
                                        <ImageUpload
                                            currentImageUrl={currentNews.featured_image_url}
                                            onImageUploaded={(url) => setCurrentNews({...currentNews, featured_image_url: url})}
                                            folder="news"
                                            bucket="subscriber-images"
                                            userId={user?.id}
                                            imageType="featured"
                                            maxSizeMB={5}
                                        />
                                    </div>

                                    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-3">
                                        <Label className="text-gray-800 font-bold flex items-center gap-2 text-base">
                                            <Layout size={18} className="text-blue-600" /> Banner Superior (Página de Detalhes)
                                        </Label>
                                        <p className="text-sm text-gray-500">Uma imagem larga que ficará no topo da página da notícia (opcional).</p>
                                        <ImageUpload
                                            currentImageUrl={currentNews.banner_url}
                                            onImageUploaded={(url) => setCurrentNews({...currentNews, banner_url: url})}
                                            folder="news/banners"
                                            bucket="subscriber-images"
                                            userId={user?.id}
                                            imageType="banner"
                                            maxSizeMB={5}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-6 border-t">
                                    <Label className="text-gray-800 flex items-center gap-2 mb-3">
                                        <ImageIcon size={16} /> Galeria de Fotos
                                    </Label>
                                    <MultiImageUpload 
                                        urls={currentNews.gallery_urls} 
                                        onImagesChange={(urls) => setCurrentNews({...currentNews, gallery_urls: urls})}
                                        folder="news/gallery"
                                        userId={user?.id}
                                        maxImages={12}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="category" className="text-gray-800 flex items-center">
                                            <Tag className="mr-2"/>Categoria
                                        </Label>
                                        <Select 
                                            value={currentNews.category_id || 'none'} 
                                            onValueChange={(v) => setCurrentNews({...currentNews, category_id: v === 'none' ? null : v})}
                                        >
                                            <SelectTrigger className="border-gray-400 bg-white">
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Nenhuma</SelectItem>
                                                {categories.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="status" className="text-gray-800">Status</Label>
                                        <Select 
                                            value={currentNews.is_published ? 'published' : 'draft'} 
                                            onValueChange={(v) => setCurrentNews({...currentNews, is_published: v === 'published'})}
                                        >
                                            <SelectTrigger className="border-gray-400 bg-white">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Rascunho</SelectItem>
                                                <SelectItem value="published">Publicado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                {currentNews.is_published && (
                                    <div>
                                        <Label htmlFor="publishDate" className="text-gray-800">Data da Publicação</Label>
                                        <Input 
                                            id="publishDate" 
                                            type="date" 
                                            value={currentNews.published_at ? new Date(currentNews.published_at).toISOString().split('T')[0] : ''} 
                                            onChange={(e) => setCurrentNews({...currentNews, published_at: e.target.value ? new Date(e.target.value).toISOString() : null})} 
                                            className="border-gray-400 bg-white"
                                        />
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>

                        <DialogFooter className="mt-6 pt-4 border-t border-gray-300">
                            <Button 
                                type="button" 
                                onClick={() => setIsFormOpen(false)} 
                                style={{backgroundColor: '#6c757d', color: '#fff'}}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                style={{backgroundColor: '#28a745', color: '#fff'}}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    'Salvar'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminPublishNews;