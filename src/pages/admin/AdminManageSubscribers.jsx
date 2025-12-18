import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, PlusCircle, Edit, Trash, Search, Save, ArrowLeft, MoreVertical, X, Eye, EyeOff, CheckCircle, Clock, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { subscriberService } from '@/services/subscriberService';
import { categoryService } from '@/services/categoryService';
import ImageUpload from '@/components/common/ImageUpload';

const GoogleIcon = () => (
    <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 13.8 244 13.8c72.3 0 134.3 29.1 179.4 74.4l-66 66C314.6 118.3 282.7 103 244 103c-84.3 0-152.3 68.3-152.3 152.8s68 152.8 152.3 152.8c97.2 0 130.3-72.8 134-110.2H244v-76h244z"></path>
    </svg>
);

const SubscriberForm = ({ subscriber, onSave, onCancel, categories, saving = false }) => {
    const [data, setData] = useState(subscriber);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setData(subscriber);
    }, [subscriber]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
    };

    const handleSelectChange = (id, value) => {
        setData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(data);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-gray-100 p-8 z-10 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{data.id ? 'Editar' : 'Novo'} Assinante</h2>
                <div className="flex gap-2">
                    <Button onClick={onCancel} style={{ backgroundColor: '#6c757d', color: '#fff' }} disabled={saving}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                    </Button>
                    <Button onClick={handleSubmit} style={{ backgroundColor: '#28a745', color: '#fff' }} disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Salvar
                            </>
                        )}
                    </Button>
                </div>
            </div>
            
            <Tabs defaultValue="basic">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 bg-gray-300">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="media">Mídia</TabsTrigger>
                    <TabsTrigger value="details">Detalhes</TabsTrigger>
                    <TabsTrigger value="ai">IA & SEO</TabsTrigger>
                    <TabsTrigger value="metrics">Métricas</TabsTrigger>
                    <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>
                <TabsContent value="basic">
                    <Card className="bg-white border-gray-400">
                        <CardHeader><CardTitle>Informações Principais</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><Label htmlFor="name">Nome / Razão Social</Label><Input id="name" value={data.name} onChange={handleChange} className="bg-white border-gray-400" placeholder="Nome completo do assinante ou empresa"/></div>
                                <div><Label htmlFor="email">E-mail de Contato</Label><Input id="email" type="email" value={data.email} onChange={handleChange} className="bg-white border-gray-400" placeholder="exemplo@email.com"/></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><Label htmlFor="cpf_cnpj">CPF / CNPJ</Label><Input id="cpf_cnpj" value={data.cpf_cnpj} onChange={handleChange} className="bg-white border-gray-400" placeholder="00.000.000/0000-00"/></div>
                                <div><Label htmlFor="phone">Telefone / WhatsApp</Label><Input id="phone" value={data.phone} onChange={handleChange} className="bg-white border-gray-400" placeholder="(00) 90000-0000"/></div>
                                <div><Label htmlFor="plan_type">Plano</Label><Select value={data.plan_type} onValueChange={(v) => handleSelectChange('plan_type', v)}><SelectTrigger className="bg-white border-gray-400"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="gratuito">Gratuito</SelectItem><SelectItem value="essencial">Essencial</SelectItem><SelectItem value="premium">Premium</SelectItem><SelectItem value="premium_vip">Premium VIP</SelectItem></SelectContent></Select></div>
                            </div>
                            <div><Label htmlFor="address">Endereço Completo</Label><Textarea id="address" value={data.address} onChange={handleChange} className="bg-white border-gray-400" placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"/></div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch id="status" checked={data.status} onCheckedChange={(c) => setData(p => ({...p, status: c}))} />
                                <Label htmlFor="status">Assinatura Ativa</Label>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="media">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white border-gray-400"><CardHeader><CardTitle>Mídia</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="profile_image_url">Logo / Foto de Perfil</Label>
                                    <ImageUpload
                                        currentImageUrl={data.profile_image_url}
                                        onImageUploaded={(url) => setData(p => ({...p, profile_image_url: url}))}
                                        folder="subscribers"
                                        maxSizeMB={5}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="banner_image_url">Banner / Imagem de Capa</Label>
                                    <ImageUpload
                                        currentImageUrl={data.banner_image_url}
                                        onImageUploaded={(url) => setData(p => ({...p, banner_image_url: url}))}
                                        folder="subscribers"
                                        maxSizeMB={5}
                                    />
                                </div>
                                <div><Label htmlFor="video_url">URL do Vídeo (YouTube/Vimeo)</Label><Input id="video_url" value={data.video_url || ''} onChange={handleChange} className="bg-white border-gray-400" placeholder="https://youtube.com/watch?v=..."/></div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-gray-400"><CardHeader><CardTitle>Redes Sociais</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="social_instagram">Instagram</Label><Input id="social_instagram" value={data.social_links?.instagram || ''} onChange={(e) => setData(p => ({...p, social_links: {...p.social_links, instagram: e.target.value}}))} className="bg-white border-gray-400" placeholder="https://instagram.com/seu_perfil"/></div>
                                <div><Label htmlFor="social_facebook">Facebook</Label><Input id="social_facebook" value={data.social_links?.facebook || ''} onChange={(e) => setData(p => ({...p, social_links: {...p.social_links, facebook: e.target.value}}))} className="bg-white border-gray-400" placeholder="https://facebook.com/sua_pagina"/></div>
                                <div><Label htmlFor="social_website">Website</Label><Input id="social_website" value={data.social_links?.website || ''} onChange={(e) => setData(p => ({...p, social_links: {...p.social_links, website: e.target.value}}))} className="bg-white border-gray-400" placeholder="https://www.seu-site.com.br"/></div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="details">
                     <Card className="bg-white border-gray-400">
                        <CardHeader><CardTitle>Detalhes do Negócio</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div><Label htmlFor="category_id">Categoria Principal</Label><Select value={data.category_id || 'none'} onValueChange={(v) => handleSelectChange('category_id', v === 'none' ? null : v)}><SelectTrigger className="bg-white border-gray-400"><SelectValue placeholder="Selecione uma categoria..."/></SelectTrigger><SelectContent><SelectItem value="none">Nenhuma</SelectItem>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                            <div><Label htmlFor="description">Biografia / Sobre a Empresa</Label><Textarea id="description" value={data.description || ''} onChange={handleChange} className="bg-white border-gray-400" rows={6} placeholder="Descreva a empresa, seus serviços e diferenciais."/></div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="ai"><Card className="bg-white border-gray-400"><CardHeader><CardTitle>IA & SEO</CardTitle><CardDescription>Em desenvolvimento.</CardDescription></CardHeader></Card></TabsContent>
                <TabsContent value="metrics"><Card className="bg-white border-gray-400"><CardHeader><CardTitle>Métricas</CardTitle><CardDescription>Em desenvolvimento.</CardDescription></CardHeader></Card></TabsContent>
                <TabsContent value="reviews"><Card className="bg-white border-gray-400"><CardHeader><CardTitle>Avaliações</CardTitle><CardDescription>Em desenvolvimento.</CardDescription></CardHeader></Card></TabsContent>
            </Tabs>
        </motion.div>
    )
};


const AdminManageSubscribers = () => {
    const { toast } = useToast();
    const [subscribers, setSubscribers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentSubscriber, setCurrentSubscriber] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [openPopoverId, setOpenPopoverId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subscriberToDelete, setSubscriberToDelete] = useState(null);

    useEffect(() => {
        loadSubscribers();
        loadCategories();
    }, []);

    const loadSubscribers = async () => {
        try {
            setLoading(true);
            const data = await subscriberService.getAllSubscribers();
            setSubscribers(data);
        } catch (error) {
            console.error('Error loading subscribers:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao carregar assinantes: " + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategoriesByType('commercial', true);
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([]);
        }
    };

    const handleOpenForm = (subscriber = null) => {
        if (subscriber) {
            // Mapear dados do banco para o formulário
            setCurrentSubscriber({
                id: subscriber.id,
                name: subscriber.name || '',
                email: subscriber.email || '',
                plan_type: subscriber.plan_type || 'gratuito',
                status: subscriber.status !== undefined ? subscriber.status : true,
                cpf_cnpj: subscriber.cpf_cnpj || '',
                phone: subscriber.phone || '',
                address: (() => {
                    if (!subscriber.address) return '';
                    if (typeof subscriber.address === 'string') {
                        // Se for string, tentar parsear se for JSON, senão usar diretamente
                        try {
                            const parsed = JSON.parse(subscriber.address);
                            return parsed.full_address || subscriber.address;
                        } catch {
                            return subscriber.address;
                        }
                    }
                    // Se for objeto, extrair full_address se existir, senão fazer stringify
                    return subscriber.address.full_address || subscriber.address.street || JSON.stringify(subscriber.address);
                })(),
                category_id: subscriber.category_id || '',
                description: subscriber.description || '',
                profile_image_url: subscriber.profile_image_url || '',
                banner_image_url: subscriber.banner_image_url || '',
                gallery_images: subscriber.gallery_images || [],
                video_url: subscriber.video_url || '',
                social_links: subscriber.social_links || {},
                payment_status: subscriber.payment_status || 'pending'
            });
        } else {
            setCurrentSubscriber({
                name: '',
                email: '',
                plan_type: 'gratuito',
                status: true,
                cpf_cnpj: '',
                phone: '',
                address: '',
                category_id: '',
                description: '',
                profile_image_url: '',
                banner_image_url: '',
                gallery_images: [],
                video_url: '',
                social_links: {},
                payment_status: 'pending'
            });
        }
        setIsFormOpen(true);
    };
    
    const handleCloseForm = () => setIsFormOpen(false);

    const handleSaveSubscriber = async (data) => {
        try {
            setSaving(true);

            // Mapear dados do formulário para o banco
            // Processar address: pode ser string simples, string JSON, ou objeto
            let addressValue = {};
            if (data.address) {
                if (typeof data.address === 'string') {
                    // Tentar fazer parse se for JSON válido
                    try {
                        addressValue = JSON.parse(data.address);
                    } catch (e) {
                        // Se não for JSON válido, tratar como string simples e converter para objeto
                        addressValue = { full_address: data.address };
                    }
                } else if (typeof data.address === 'object') {
                    // Já é um objeto, usar diretamente
                    addressValue = data.address;
                }
            }

            const subscriberData = {
                name: data.name,
                email: data.email,
                plan_type: data.plan_type || 'gratuito',
                status: data.status !== undefined ? data.status : true,
                cpf_cnpj: data.cpf_cnpj || null,
                phone: data.phone || null,
                address: addressValue,
                category_id: data.category_id || null,
                description: data.description || null,
                profile_image_url: data.profile_image_url || null,
                banner_image_url: data.banner_image_url || null,
                gallery_images: data.gallery_images || [],
                video_url: data.video_url || null,
                social_links: data.social_links || {},
                payment_status: data.payment_status || 'pending'
            };

            if (data.id) {
                await subscriberService.updateSubscriber(data.id, subscriberData);
                toast({ title: "Sucesso!", description: "Assinante atualizado com sucesso." });
            } else {
                await subscriberService.createSubscriber(subscriberData);
                toast({ title: "Sucesso!", description: "Assinante criado com sucesso." });
            }

        setIsFormOpen(false);
            await loadSubscribers();
        } catch (error) {
            console.error('Error saving subscriber:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao salvar assinante: " + error.message
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSubscriber = async (id) => {
        try {
            console.log('[AdminManageSubscribers] Attempting to delete subscriber:', id);
            await subscriberService.deleteSubscriber(id);
            console.log('[AdminManageSubscribers] Subscriber deleted successfully');
            toast({ title: "Sucesso!", description: "Assinante deletado permanentemente." });
            await loadSubscribers();
        } catch (error) {
            console.error('[AdminManageSubscribers] Error deleting subscriber:', error);
            console.error('[AdminManageSubscribers] Error details:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint,
                error
            });
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao deletar assinante: " + (error.message || 'Erro desconhecido')
            });
        }
    };

    const getStatusBadge = (status) => {
        return status ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white';
    };

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3"/>Aprovado</Badge>;
            case 'pending': return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3"/>Pendente</Badge>;
            case 'cancelled': return <Badge className="bg-red-100 text-red-800"><XCircle className="mr-1 h-3 w-3"/>Cancelado</Badge>;
            default: return <Badge variant="outline">N/A</Badge>;
        }
    };

    const getPlanName = (planType) => {
        const plans = {
            'gratuito': 'Gratuito',
            'essencial': 'Essencial',
            'premium': 'Premium',
            'premium_vip': 'Premium VIP'
        };
        return plans[planType] || planType;
    };

    const filteredSubscribers = useMemo(() => subscribers.filter(s => 
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [subscribers, searchTerm]);

    if (loading) {
        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-8 flex items-center justify-center" style={{ backgroundColor: '#e0e0e0' }}>
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Gerenciar Assinantes</title></Helmet>
            <div className="relative">
                <motion.div initial={{ opacity: 1 }} animate={{ opacity: isFormOpen ? 0 : 1, y: isFormOpen ? -20 : 0 }} transition={{ duration: 0.3 }} className={isFormOpen ? 'pointer-events-none' : ''}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Users className="mr-3 text-blue-800" /> Gerenciar Assinantes</h1>
                            <p className="text-gray-700 mt-1">Adicione, edite e gerencie os assinantes do portal.</p>
                        </div>
                        <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Adicionar Assinante</Button>
                    </div>

                    <Card className="bg-white border-gray-400">
                        <CardHeader>
                            <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar por nome ou email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto border rounded-lg border-gray-400"><Table>
                                <TableHeader className="bg-gray-200">
                                    <TableRow className="border-b border-gray-400">
                                        <TableHead className="text-gray-800 font-semibold">Assinante</TableHead>
                                        <TableHead className="text-gray-800 font-semibold">Plano</TableHead>
                                        <TableHead className="text-gray-800 font-semibold">Status Assinatura</TableHead>
                                        <TableHead className="text-gray-800 font-semibold">Status Pagamento</TableHead>
                                        <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSubscribers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                                Nenhum assinante encontrado
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSubscribers.map(sub => (
                                    <TableRow key={sub.id} className="border-b border-gray-300">
                                                <TableCell className="font-medium text-gray-900 flex items-center gap-2">
                                                    {sub.name}
                                                </TableCell>
                                                <TableCell className="text-gray-700">{getPlanName(sub.plan_type)}</TableCell>
                                        <TableCell><Badge className={getStatusBadge(sub.status)}>{sub.status ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                                                <TableCell>{getPaymentStatusBadge(sub.payment_status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <Popover 
                                                            open={openPopoverId === sub.id}
                                                            onOpenChange={(open) => setOpenPopoverId(open ? sub.id : null)}
                                                        >
                                                            <PopoverTrigger asChild>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    className="h-8 w-8 hover:bg-gray-100 rounded-md transition-colors"
                                                                >
                                                                    <MoreVertical size={18} className="text-gray-600" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent 
                                                                className="w-48 p-1.5 shadow-lg border border-gray-200 rounded-lg bg-white"
                                                                align="end"
                                                            >
                                                                <div className="flex flex-col gap-0.5">
                                                                    <Button 
                                                                        onClick={() => {
                                                                            handleOpenForm(sub);
                                                                            setOpenPopoverId(null);
                                                                        }} 
                                                                        variant="ghost" 
                                                                        className="w-full justify-start px-3 py-2.5 h-auto font-normal text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors"
                                                                    >
                                                                        <Edit size={16} className="mr-2.5 text-blue-600"/> 
                                                                        <span>Editar</span>
                                                                    </Button>
                                                                    <div className="h-px bg-gray-200 my-1"></div>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        className="w-full justify-start px-3 py-2.5 h-auto font-normal text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                                                                        onClick={() => {
                                                                            setSubscriberToDelete(sub);
                                                                            setDeleteDialogOpen(true);
                                                                            setOpenPopoverId(null);
                                                                        }}
                                                                    >
                                                                        <Trash size={16} className="mr-2.5"/> 
                                                                        <span>Excluir</span>
                                                                    </Button>
                                                                </div>
                                                </PopoverContent>
                                            </Popover>
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
                
                {/* Dialog de confirmação de exclusão */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="bg-white border-2 border-gray-200 shadow-xl rounded-lg p-6 max-w-md">
                        <AlertDialogHeader className="text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <AlertDialogTitle className="text-xl font-bold text-gray-900">
                                    Confirmar Exclusão
                                </AlertDialogTitle>
                            </div>
                            <AlertDialogDescription className="text-base text-gray-600 mt-2">
                                Tem certeza que deseja deletar permanentemente <span className="font-semibold text-gray-900">"{subscriberToDelete?.name}"</span>?
                                <br />
                                <span className="text-sm text-red-600 font-medium mt-1 block">⚠️ Esta ação não pode ser desfeita!</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row justify-end gap-3 mt-6 sm:mt-4">
                            <AlertDialogCancel 
                                onClick={() => setSubscriberToDelete(null)}
                                className="bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-4 py-2 rounded-md font-medium transition-colors"
                            >
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={async () => {
                                    if (subscriberToDelete) {
                                        await handleDeleteSubscriber(subscriberToDelete.id);
                                        setSubscriberToDelete(null);
                                        setDeleteDialogOpen(false);
                                    }
                                }} 
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
                            >
                                Deletar Permanentemente
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                
                {isFormOpen && (
                    <SubscriberForm 
                        subscriber={currentSubscriber} 
                        onSave={handleSaveSubscriber} 
                        onCancel={handleCloseForm} 
                        categories={categories}
                        saving={saving}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminManageSubscribers;