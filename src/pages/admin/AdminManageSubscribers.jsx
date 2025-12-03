import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, PlusCircle, Edit, Trash, Search, Save, ArrowLeft, MoreVertical, X, Eye, EyeOff, CheckCircle, Clock, XCircle } from 'lucide-react';
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

const GoogleIcon = () => (
    <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 13.8 244 13.8c72.3 0 134.3 29.1 179.4 74.4l-66 66C314.6 118.3 282.7 103 244 103c-84.3 0-152.3 68.3-152.3 152.8s68 152.8 152.3 152.8c97.2 0 130.3-72.8 134-110.2H244v-76h244z"></path>
    </svg>
);

const SubscriberForm = ({ subscriber, onSave, onCancel, categories }) => {
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
                    <Button onClick={onCancel} style={{ backgroundColor: '#6c757d', color: '#fff' }}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
                    <Button onClick={handleSubmit} style={{ backgroundColor: '#28a745', color: '#fff' }}><Save className="mr-2 h-4 w-4" /> Salvar</Button>
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
                                <div><Label htmlFor="cpfCnpj">CPF / CNPJ</Label><Input id="cpfCnpj" value={data.cpfCnpj} onChange={handleChange} className="bg-white border-gray-400" placeholder="00.000.000/0000-00"/></div>
                                <div><Label htmlFor="phone">Telefone / WhatsApp</Label><Input id="phone" value={data.phone} onChange={handleChange} className="bg-white border-gray-400" placeholder="(00) 90000-0000"/></div>
                                <div><Label htmlFor="plan">Plano</Label><Select value={data.plan} onValueChange={(v) => handleSelectChange('plan', v)}><SelectTrigger className="bg-white border-gray-400"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Gratuito">Gratuito</SelectItem><SelectItem value="Mensal">Mensal</SelectItem><SelectItem value="Trimestral">Trimestral</SelectItem><SelectItem value="Anual">Anual</SelectItem></SelectContent></Select></div>
                            </div>
                            <div><Label htmlFor="address">Endereço Completo</Label><Textarea id="address" value={data.address} onChange={handleChange} className="bg-white border-gray-400" placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"/></div>
                            <div className="relative">
                                <Label htmlFor="password">Senha de Acesso (para o assinante)</Label>
                                <Input id="password" type={showPassword ? "text" : "password"} value={data.password || ''} onChange={handleChange} className="bg-white border-gray-400 pr-10" placeholder="Crie uma senha segura para o assinante"/>
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-6 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</Button>
                            </div>
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
                                <div><Label htmlFor="logoUrl">URL do Logo</Label><Input id="logoUrl" value={data.logoUrl || ''} onChange={handleChange} className="bg-white border-gray-400" placeholder="https://exemplo.com/logo.png"/></div>
                                <div><Label htmlFor="coverUrl">URL da Imagem de Capa</Label><Input id="coverUrl" value={data.coverUrl || ''} onChange={handleChange} className="bg-white border-gray-400" placeholder="https://exemplo.com/capa.jpg"/></div>
                                <div><Label htmlFor="gallery">URLs da Galeria (separadas por vírgula)</Label><Textarea id="gallery" value={Array.isArray(data.gallery) ? data.gallery.join(',') : ''} onChange={e => setData(p=>({...p, gallery: e.target.value.split(',')}))} className="bg-white border-gray-400" placeholder="https://.../foto1.jpg, https://.../foto2.jpg"/></div>
                                <div><Label htmlFor="videoUrl">URL do Vídeo (YouTube)</Label><Input id="videoUrl" value={data.videoUrl || ''} onChange={handleChange} className="bg-white border-gray-400" placeholder="https://youtube.com/watch?v=..."/></div>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-gray-400"><CardHeader><CardTitle>Redes Sociais</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div><Label htmlFor="social_instagram">Instagram</Label><Input id="social_instagram" value={data.social_instagram || ''} onChange={handleChange} className="bg-white border-gray-400" placeholder="https://instagram.com/seu_perfil"/></div>
                                <div><Label htmlFor="social_facebook">Facebook</Label><Input id="social_facebook" value={data.social_facebook || ''} onChange={handleChange} className="bg-white border-gray-400" placeholder="https://facebook.com/sua_pagina"/></div>
                                <div><Label htmlFor="social_linkedin">LinkedIn</Label><Input id="social_linkedin" value={data.social_linkedin || ''} onChange={handleChange} className="bg-white border-gray-400" placeholder="https://linkedin.com/in/seu_perfil"/></div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="details">
                     <Card className="bg-white border-gray-400">
                        <CardHeader><CardTitle>Detalhes do Negócio</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <div><Label htmlFor="category">Categoria Principal</Label><Select value={data.category} onValueChange={(v) => handleSelectChange('category', v)}><SelectTrigger className="bg-white border-gray-400"><SelectValue placeholder="Selecione uma categoria..."/></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                            <div><Label htmlFor="bio">Biografia / Sobre a Empresa</Label><Textarea id="bio" value={data.bio || ''} onChange={handleChange} className="bg-white border-gray-400" rows={6} placeholder="Descreva a empresa, seus serviços e diferenciais."/></div>
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

    useEffect(() => {
        const storedSubscribers = JSON.parse(localStorage.getItem('ppo_subscribers')) || [
            { id: 1, name: 'Restaurante Sabor Divino', plan: 'Anual', status: true, joinDate: '2025-01-15', email: 'contato@sabordivino.com', method: 'manual', password: '123', paymentStatus: 'Aprovado' },
            { id: 2, name: 'Moda & Estilo Boutique', plan: 'Mensal', status: true, joinDate: '2025-03-20', email: 'vendas@modaeestilo.com', method: 'manual', password: '123', paymentStatus: 'Aprovado' },
            { id: 3, name: 'Supermercado Preço Bom', plan: 'Gratuito', status: false, joinDate: '2025-09-01', email: 'gerencia@precobom.com', method: 'google', password: '', paymentStatus: 'N/A' },
            { id: 4, name: 'Oficina do Zé', plan: 'Trimestral', status: true, joinDate: '2025-08-10', email: 'ze@oficina.com', method: 'manual', password: '123', paymentStatus: 'Pendente' },
        ];
        setSubscribers(storedSubscribers);
        const storedCategories = JSON.parse(localStorage.getItem('ppo_categories')) || [{ id: 1, name: 'Alimentação' }];
        setCategories(storedCategories);
    }, []);

    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    const handleOpenForm = (subscriber = null) => {
        const defaultSub = { name: '', email: '', plan: 'Gratuito', status: false, cpfCnpj: '', phone: '', address: '', method: 'manual', password: '', paymentStatus: 'Pendente' };
        setCurrentSubscriber(subscriber ? { ...defaultSub, ...subscriber } : defaultSub);
        setIsFormOpen(true);
    };
    
    const handleCloseForm = () => setIsFormOpen(false);

    const handleSaveSubscriber = (data) => {
        const updatedSubscribers = data.id ? subscribers.map(s => s.id === data.id ? data : s) : [...subscribers, { ...data, id: Date.now(), joinDate: new Date().toISOString().split('T')[0] }];
        setSubscribers(updatedSubscribers);
        saveData('ppo_subscribers', updatedSubscribers);
        setIsFormOpen(false);
        toast({ title: "Sucesso!", description: `Assinante ${data.id ? 'atualizado' : 'criado'}.` });
    };

    const handleDeleteSubscriber = (id) => {
        const updatedSubscribers = subscribers.filter(s => s.id !== id);
        setSubscribers(updatedSubscribers);
        saveData('ppo_subscribers', updatedSubscribers);
        toast({ title: "Assinante Removido" });
    };

    const getStatusBadge = (status) => {
        return status ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white';
    };

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'Aprovado': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3"/>Aprovado</Badge>;
            case 'Pendente': return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3"/>Pendente</Badge>;
            case 'Cancelado': return <Badge className="bg-red-100 text-red-800"><XCircle className="mr-1 h-3 w-3"/>Cancelado</Badge>;
            default: return <Badge variant="outline">N/A</Badge>;
        }
    };

    const filteredSubscribers = useMemo(() => subscribers.filter(s => 
        (s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [subscribers, searchTerm]);

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
                                <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400">
                                    <TableHead className="text-gray-800 font-semibold">Assinante</TableHead><TableHead className="text-gray-800 font-semibold">Plano</TableHead><TableHead className="text-gray-800 font-semibold">Status Assinatura</TableHead><TableHead className="text-gray-800 font-semibold">Status Pagamento</TableHead><TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                </TableRow></TableHeader>
                                <TableBody>{filteredSubscribers.map(sub => (
                                    <TableRow key={sub.id} className="border-b border-gray-300">
                                        <TableCell className="font-medium text-gray-900 flex items-center gap-2">{sub.method === 'google' && <GoogleIcon />} {sub.name}</TableCell>
                                        <TableCell className="text-gray-700">{sub.plan}</TableCell>
                                        <TableCell><Badge className={getStatusBadge(sub.status)}>{sub.status ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                                        <TableCell>{getPaymentStatusBadge(sub.paymentStatus)}</TableCell>
                                        <TableCell className="text-right"><div className="flex gap-1 justify-end">
                                            <Popover>
                                                <PopoverTrigger asChild><Button variant="ghost" size="icon"><MoreVertical size={16} /></Button></PopoverTrigger>
                                                <PopoverContent className="w-40">
                                                    <Button onClick={() => handleOpenForm(sub)} variant="ghost" className="w-full justify-start"><Edit size={14} className="mr-2"/> Editar</Button>
                                                    <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700"><Trash size={14} className="mr-2"/> Excluir</Button></AlertDialogTrigger>
                                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir "{sub.name}"?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteSubscriber(sub.id)} className="bg-red-600 hover:bg-red-700">Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                                    </AlertDialog>
                                                </PopoverContent>
                                            </Popover>
                                        </div></TableCell>
                                    </TableRow>
                                ))}</TableBody>
                            </Table></div>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {isFormOpen && <SubscriberForm subscriber={currentSubscriber} onSave={handleSaveSubscriber} onCancel={handleCloseForm} categories={categories} />}
            </div>
        </div>
    );
};

export default AdminManageSubscribers;