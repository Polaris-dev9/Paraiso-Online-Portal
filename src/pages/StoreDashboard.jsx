import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, PackagePlus, ListOrdered, BarChart, Settings, FileText, ArrowRight, Star, Info, ShieldCheck, PlusCircle, Edit, Trash, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const ProductForm = ({ product, onSave, onCancel, isFreePlan, productCount }) => {
    const [data, setData] = useState(product);
    const { toast } = useToast();
    const navigate = useNavigate();
    const productLimit = isFreePlan ? 3 : 300;


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.id && productCount >= productLimit) {
            toast({
                variant: "destructive",
                title: "Limite Atingido!",
                description: `Seu plano permite até ${productLimit} produtos. Faça um upgrade para cadastrar mais.`,
                action: <Button onClick={() => navigate('/upgrade')}>Fazer Upgrade</Button>,
            });
            return;
        }
        onSave(data);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-white border-gray-400">
                <CardHeader>
                    <CardTitle className="text-gray-900">{data.id ? 'Editar' : 'Adicionar'} Produto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div><Label htmlFor="name">Nome do Produto</Label><Input id="name" value={data.name} onChange={e => setData({...data, name: e.target.value})} className="bg-white border-gray-400" required /></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><Label htmlFor="price">Preço (R$)</Label><Input id="price" type="number" step="0.01" value={data.price} onChange={e => setData({...data, price: parseFloat(e.target.value)})} className="bg-white border-gray-400" required /></div>
                            <div><Label htmlFor="image">URL da Imagem</Label><Input id="image" value={data.image} onChange={e => setData({...data, image: e.target.value})} className="bg-white border-gray-400" required placeholder="https://exemplo.com/imagem.jpg" /></div>
                        </div>
                        <div><Label htmlFor="description">Descrição</Label><Textarea id="description" value={data.description} onChange={e => setData({...data, description: e.target.value})} className="bg-white border-gray-400" /></div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch id="isPromotion" checked={data.isPromotion} onCheckedChange={c => setData({...data, isPromotion: c})} />
                            <Label htmlFor="isPromotion">Marcar como promoção</Label>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" onClick={onCancel} style={{ backgroundColor: '#6c757d', color: '#fff' }}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
                            <Button type="submit" style={{ backgroundColor: '#28a745', color: '#fff' }}><Save className="mr-2 h-4 w-4" /> Salvar Produto</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const StoreDashboard = () => {
    const { user } = useSupabaseAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    
    const [subscriber, setSubscriber] = useState(null);
    const [products, setProducts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    useEffect(() => {
        if (user) {
            const allSubscribers = JSON.parse(localStorage.getItem('ppo_subscribers')) || [];
            const currentSub = allSubscribers.find(s => s.email === user.email);
            setSubscriber(currentSub);

            if (currentSub) {
                const allProducts = JSON.parse(localStorage.getItem('ppo_products')) || [];
                const subProducts = allProducts.filter(p => p.store_id === currentSub.id);
                setProducts(subProducts);
            }
        }
    }, [user]);

    const isFreePlan = subscriber?.plan === 'Gratuito';
    const hasStoreFeature = subscriber?.plan === 'Premium VIP' || isFreePlan; 
    const productLimit = isFreePlan ? 3 : 300;

    const handleOpenForm = (product = null) => {
        const defaultProduct = { name: '', price: 0, description: '', image: '', isPromotion: false, store_id: subscriber.id };
        setCurrentProduct(product ? product : defaultProduct);
        setIsFormOpen(true);
    };

    const handleSaveProduct = (data) => {
        let allProducts = JSON.parse(localStorage.getItem('ppo_products')) || [];
        if (data.id) {
            allProducts = allProducts.map(p => p.id === data.id ? data : p);
        } else {
            allProducts.push({ ...data, id: Date.now() });
        }
        localStorage.setItem('ppo_products', JSON.stringify(allProducts));
        setProducts(allProducts.filter(p => p.store_id === subscriber.id));
        setIsFormOpen(false);
        toast({ title: "Sucesso!", description: `Produto ${data.id ? 'atualizado' : 'adicionado'}.` });
    };

    const handleDeleteProduct = (id) => {
        let allProducts = JSON.parse(localStorage.getItem('ppo_products')) || [];
        allProducts = allProducts.filter(p => p.id !== id);
        localStorage.setItem('ppo_products', JSON.stringify(allProducts));
        setProducts(allProducts.filter(p => p.store_id === subscriber.id));
        toast({ title: "Produto Removido" });
    };

    if (!subscriber) {
        return <div className="flex justify-center items-center h-screen bg-gray-100">Carregando...</div>;
    }

    if (!hasStoreFeature) {
        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
                <Helmet><title>Faça um Upgrade - Dashboard da Loja</title></Helmet>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                    <Card className="bg-white border-gray-400 text-center shadow-lg">
                        <CardHeader>
                            <div className="mx-auto bg-yellow-100 rounded-full p-4 w-fit mb-4"><Star className="h-10 w-10 text-yellow-500" /></div>
                            <CardTitle className="text-3xl font-bold text-gray-900">Desbloqueie o Poder do E-commerce!</CardTitle>
                            <CardDescription className="text-gray-700 max-w-lg mx-auto mt-2 text-lg">Seu plano atual não inclui a Loja Virtual. Faça um upgrade para o Premium VIP para começar a vender online.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Link to="/assine-agora"><Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xl px-10 py-7">Ver Planos e Fazer Upgrade <ArrowRight className="ml-2 h-6 w-6" /></Button></Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Dashboard da Loja - {subscriber.name}</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><ShoppingBag className="mr-3" /> Dashboard da Loja</h1>
                    <p className="text-gray-700 mt-2">Gerencie os produtos e serviços da sua loja: {subscriber.name}.</p>
                </div>

                {isFormOpen ? (
                    <ProductForm product={currentProduct} onSave={handleSaveProduct} onCancel={() => setIsFormOpen(false)} isFreePlan={isFreePlan} productCount={products.length} />
                ) : (
                    <Card className="bg-white border-gray-400">
                        <CardHeader className="flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-gray-900">Meus Produtos ({products.length}/{productLimit})</CardTitle>
                                {isFreePlan && <CardDescription>Seu plano gratuito permite até 3 produtos. <Link to="/assine-agora" className="text-blue-600 hover:underline">Faça um upgrade</Link> para cadastrar mais.</CardDescription>}
                            </div>
                            <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Adicionar Produto</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto border rounded-lg border-gray-400">
                                <Table>
                                    <TableHeader className="bg-gray-200"><TableRow><TableHead className="text-gray-800 font-semibold">Produto</TableHead><TableHead className="text-gray-800 font-semibold">Preço</TableHead><TableHead className="text-gray-800 font-semibold">Promoção</TableHead><TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead></TableRow></TableHeader>
                                    <TableBody>{products.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium flex items-center gap-3"><img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md" /> {p.name}</TableCell>
                                            <TableCell>R$ {p.price.toFixed(2).replace('.', ',')}</TableCell>
                                            <TableCell>{p.isPromotion ? <Badge className="bg-green-500 text-white">Sim</Badge> : 'Não'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button onClick={() => handleOpenForm(p)} variant="ghost" size="icon" style={{color: '#007bff'}}><Edit size={16} /></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><Button variant="ghost" size="icon" style={{color: '#dc3545'}}><Trash size={16} /></Button></AlertDialogTrigger>
                                                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir o produto "{p.name}"?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteProduct(p.id)} className="bg-red-600">Excluir</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                                </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}</TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </motion.div>
        </div>
    );
};

export default StoreDashboard;