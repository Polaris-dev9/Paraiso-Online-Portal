import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, PlusCircle, Edit, Trash, Search, CheckCircle, XCircle, BarChart2, Loader2, Image as ImageIcon, Link as LinkIcon, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from '@/components/common/RichTextEditor';
import { eventService } from '@/services/eventService';
import { categoryService } from '@/services/categoryService';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from '@/components/common/ImageUpload';
import MultiImageUpload from '@/components/common/MultiImageUpload';
import LinksManager from '@/components/common/LinksManager';

const AdminManageEvents = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadEvents();
        loadCategories();
    }, []);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const data = await eventService.getAllEvents({ publishedOnly: false });
            setEvents(data);
        } catch (error) {
            console.error('Error loading events:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao carregar eventos: " + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategoriesByType('event', true);
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([]);
        }
    };

    const handleOpenForm = (event = null) => {
        if (event) {
            setCurrentEvent({
                id: event.id,
                title: event.title || '',
                description: event.description || '',
                content: event.content || '',
                start_date: event.start_date ? new Date(event.start_date).toISOString().split('T')[0] : '',
                end_date: event.end_date ? new Date(event.end_date).toISOString().split('T')[0] : '',
                location: event.location || '',
                image_url: event.image_url || '',
                banner_url: event.banner_url || '',
                gallery_urls: event.gallery_urls || [],
                related_links: event.related_links || [],
                category_id: event.category_id || '',
                is_featured: event.is_featured || false,
                is_published: event.is_published || false
            });
        } else {
            setCurrentEvent({
                title: '',
                description: '',
                content: '',
                start_date: '',
                end_date: '',
                location: '',
                image_url: '',
                banner_url: '',
                gallery_urls: [],
                related_links: [],
                category_id: '',
                is_featured: false,
                is_published: false
            });
        }
        setIsFormOpen(true);
    };

    const handleSaveEvent = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);

            const eventData = {
                title: currentEvent.title,
                description: currentEvent.description,
                content: currentEvent.content || null,
                start_date: currentEvent.start_date ? new Date(currentEvent.start_date).toISOString() : null,
                end_date: currentEvent.end_date ? new Date(currentEvent.end_date).toISOString() : null,
                location: currentEvent.location || null,
                image_url: currentEvent.image_url || null,
                banner_url: currentEvent.banner_url || null,
                gallery_urls: currentEvent.gallery_urls || [],
                related_links: currentEvent.related_links || [],
                category_id: currentEvent.category_id || null,
                is_featured: currentEvent.is_featured || false,
                is_published: currentEvent.is_published || false
            };

            if (currentEvent.id) {
                await eventService.updateEvent(currentEvent.id, eventData);
                toast({ title: "Sucesso!", description: "Evento atualizado com sucesso." });
            } else {
                await eventService.createEvent(eventData);
                toast({ title: "Sucesso!", description: "Evento criado com sucesso." });
            }

            setIsFormOpen(false);
            await loadEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao salvar evento: " + error.message
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm('Tem certeza que deseja excluir este evento?')) {
            return;
        }

        try {
            await eventService.deleteEvent(id);
            toast({ title: "Sucesso!", description: "Evento excluído com sucesso." });
            await loadEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao excluir evento: " + error.message
            });
        }
    };

    const filteredEvents = events.filter(e => 
        e.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
        }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Gerenciar Eventos</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Calendar className="mr-3 text-purple-600" /> Gerenciar Eventos</h1>
                        <p className="text-gray-700 mt-1">Crie, modere e gerencie os eventos do portal.</p>
                    </div>
                    <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Criar Evento</Button>
                </div>
                <Card className="border-gray-400 bg-white">
                    <CardHeader><CardTitle className="text-gray-900">Todos os Eventos</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                        <div className="overflow-x-auto border rounded-lg border-gray-400"><Table>
                            <TableHeader className="bg-gray-200">
                                <TableRow className="border-b border-gray-400">
                                    <TableHead className="text-gray-800 font-semibold">Evento</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Data</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Local</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                    <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEvents.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                            Nenhum evento encontrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredEvents.map(item => (
                                        <TableRow key={item.id} className="border-b border-gray-300">
                                            <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                                            <TableCell className="text-gray-700">{formatDate(item.start_date)}</TableCell>
                                            <TableCell className="text-gray-700">{item.location || '-'}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusBadge(item.is_published)}>
                                                    {item.is_published ? 'Publicado' : 'Rascunho'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    <Button onClick={() => handleOpenForm(item)} variant="ghost" size="icon" title="Editar" style={{color: '#007bff'}}>
                                                        <Edit size={16}/>
                                                    </Button>
                                                    <Button onClick={() => handleDeleteEvent(item.id)} variant="ghost" size="icon" title="Excluir" style={{color: '#dc3545'}}>
                                                        <Trash size={16}/>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table></div>
                    </CardContent>
                </Card>
            </motion.div>

             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-4xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentEvent?.id ? 'Editar' : 'Criar'} Evento</DialogTitle></DialogHeader>
                    {currentEvent && <form onSubmit={handleSaveEvent} className="max-h-[75vh] overflow-y-auto pr-4 space-y-4">
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-4">
                                <TabsTrigger value="content">Informações</TabsTrigger>
                                <TabsTrigger value="media">Mídia & Galeria</TabsTrigger>
                                <TabsTrigger value="settings">Configurações</TabsTrigger>
                            </TabsList>

                            <TabsContent value="content" className="space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-gray-800">Nome do Evento *</Label>
                                    <Input 
                                        id="title" 
                                        value={currentEvent.title} 
                                        onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} 
                                        className="border-gray-400 bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="description" className="text-gray-800">Resumo (opcional)</Label>
                                    <Textarea 
                                        id="description" 
                                        value={currentEvent.description} 
                                        onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} 
                                        className="border-gray-400 bg-white"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="content" className="text-gray-800">Descrição Detalhada</Label>
                                    <RichTextEditor 
                                        value={currentEvent.content || ''} 
                                        onChange={(e) => setCurrentEvent({...currentEvent, content: e.target?.value || ''})} 
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="start_date" className="text-gray-800">Data de Início *</Label>
                                        <Input 
                                            type="datetime-local" 
                                            id="start_date" 
                                            value={currentEvent.start_date ? new Date(currentEvent.start_date).toISOString().slice(0, 16) : ''} 
                                            onChange={(e) => setCurrentEvent({...currentEvent, start_date: e.target.value ? new Date(e.target.value).toISOString() : ''})} 
                                            className="border-gray-400 bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="end_date" className="text-gray-800">Data de Término</Label>
                                        <Input 
                                            type="datetime-local" 
                                            id="end_date" 
                                            value={currentEvent.end_date ? new Date(currentEvent.end_date).toISOString().slice(0, 16) : ''} 
                                            onChange={(e) => setCurrentEvent({...currentEvent, end_date: e.target.value ? new Date(e.target.value).toISOString() : null})} 
                                            className="border-gray-400 bg-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="location" className="text-gray-800">Local</Label>
                                    <Input 
                                        id="location" 
                                        value={currentEvent.location} 
                                        onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} 
                                        className="border-gray-400 bg-white"
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-800 flex items-center gap-2 mb-2">
                                        <LinkIcon size={16} /> Links Úteis (Site, Ingressos, etc)
                                    </Label>
                                    <LinksManager 
                                        links={currentEvent.related_links} 
                                        onChange={(links) => setCurrentEvent({...currentEvent, related_links: links})} 
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="media" className="space-y-8">
                                <div className="space-y-6">
                                    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-3">
                                        <Label className="text-gray-800 font-bold flex items-center gap-2 text-base">
                                            <ImageIcon size={18} className="text-purple-600" /> Imagem do Evento (Card)
                                        </Label>
                                        <p className="text-sm text-gray-500">Esta imagem aparecerá nas listagens e cards de eventos.</p>
                                        <ImageUpload
                                            currentImageUrl={currentEvent.image_url}
                                            onImageUploaded={(url) => setCurrentEvent({...currentEvent, image_url: url})}
                                            folder="events"
                                            bucket="subscriber-images"
                                            userId={user?.id}
                                            imageType="event"
                                            maxSizeMB={5}
                                        />
                                    </div>

                                    <div className="p-4 bg-white border rounded-lg shadow-sm space-y-3">
                                        <Label className="text-gray-800 font-bold flex items-center gap-2 text-base">
                                            <Layout size={18} className="text-purple-600" /> Banner de Destaque
                                        </Label>
                                        <p className="text-sm text-gray-500">Uma imagem larga que ficará no topo da página do evento (opcional).</p>
                                        <ImageUpload
                                            currentImageUrl={currentEvent.banner_url}
                                            onImageUploaded={(url) => setCurrentEvent({...currentEvent, banner_url: url})}
                                            folder="events/banners"
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
                                        <ImageIcon size={16} /> Álbum de Fotos
                                    </Label>
                                    <MultiImageUpload 
                                        urls={currentEvent.gallery_urls} 
                                        onImagesChange={(urls) => setCurrentEvent({...currentEvent, gallery_urls: urls})}
                                        folder="events/gallery"
                                        userId={user?.id}
                                        maxImages={15}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="category" className="text-gray-800">Categoria</Label>
                                        <Select 
                                            value={currentEvent.category_id || 'none'} 
                                            onValueChange={(v) => setCurrentEvent({...currentEvent, category_id: v === 'none' ? null : v})}
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
                                            value={currentEvent.is_published ? 'published' : 'draft'} 
                                            onValueChange={(v) => setCurrentEvent({...currentEvent, is_published: v === 'published'})}
                                        >
                                            <SelectTrigger className="border-gray-400 bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Rascunho</SelectItem>
                                                <SelectItem value="published">Publicado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={currentEvent.is_featured}
                                        onChange={(e) => setCurrentEvent({...currentEvent, is_featured: e.target.checked})}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor="is_featured" className="text-gray-800">Evento em Destaque (Home)</Label>
                                </div>
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

export default AdminManageEvents;