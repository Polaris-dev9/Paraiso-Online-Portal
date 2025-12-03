import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Store, LayoutTemplate, ShoppingBag, PlusCircle, CheckCircle, Trash2, Rocket, Database, Edit, Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const AdminManageStore = () => {
    const { toast } = useToast();
    const [products, setProducts] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem('ppo_products')) || [
            { id: 1, store_id: 1, name: 'Prato Executivo', price: 25.90, image: 'https://placehold.co/100x100', isPromotion: true },
            { id: 2, store_id: 2, name: 'T-shirt Básica', price: 79.90, image: 'https://placehold.co/100x100', isPromotion: false },
        ];
        const storedSubscribers = JSON.parse(localStorage.getItem('ppo_subscribers')) || [
            { id: 1, name: 'Restaurante Sabor Divino' },
            { id: 2, name: 'Moda & Estilo Boutique' },
        ];
        setProducts(storedProducts);
        setSubscribers(storedSubscribers);
    }, []);

    const getSubscriberName = (storeId) => {
        const sub = subscribers.find(s => s.id === storeId);
        return sub ? sub.name : 'Assinante Desconhecido';
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const subName = getSubscriberName(p.store_id).toLowerCase();
            return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || subName.includes(searchTerm.toLowerCase());
        });
    }, [products, subscribers, searchTerm]);

    const handleToast = (message) => {
        toast({
            title: "Funcionalidade em Desenvolvimento",
            description: `🚧 ${message} Esta feature não está implementada ainda, mas você pode solicitá-la no próximo prompt! 🚀`,
        });
    };

    const handleDeleteProduct = (productId) => {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
        localStorage.setItem('ppo_products', JSON.stringify(updatedProducts));
        toast({ title: "Produto Removido", description: "O produto foi removido do marketplace." });
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Admin: Gerenciar Marketplace</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <Store className="mr-3 text-blue-800" /> Gerenciar Marketplace
                        </h1>
                        <p className="text-gray-700 mt-1">Supervisione todos os produtos e lojas do portal.</p>
                    </div>
                </div>

                <Tabs defaultValue="products">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 bg-gray-300">
                        <TabsTrigger value="products"><ShoppingBag className="mr-2 h-4 w-4" />Produtos do Marketplace</TabsTrigger>
                        <TabsTrigger value="test-drive"><Rocket className="mr-2 h-4 w-4" />Lojas em Test Drive</TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="mt-4">
                        <Card className="bg-white border-gray-400">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Todos os Produtos</CardTitle>
                                <CardDescription className="text-gray-600">Visualize, edite ou remova produtos de todos os assinantes.</CardDescription>
                                <div className="relative flex-grow pt-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                    <Input placeholder="Buscar por produto ou loja..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto border rounded-lg border-gray-400">
                                    <Table>
                                        <TableHeader className="bg-gray-200"><TableRow>
                                            <TableHead className="text-gray-800 font-semibold">Produto</TableHead>
                                            <TableHead className="text-gray-800 font-semibold">Loja</TableHead>
                                            <TableHead className="text-gray-800 font-semibold">Preço</TableHead>
                                            <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                            <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                        </TableRow></TableHeader>
                                        <TableBody>{filteredProducts.map(p => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium flex items-center gap-3"><img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-md" /> {p.name}</TableCell>
                                                <TableCell>{getSubscriberName(p.store_id)}</TableCell>
                                                <TableCell>R$ {p.price.toFixed(2).replace('.', ',')}</TableCell>
                                                <TableCell>{p.isPromotion ? <Badge className="bg-red-500 text-white">Promoção</Badge> : <Badge variant="secondary">Normal</Badge>}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button onClick={() => handleToast('Editar produto globalmente.')} variant="ghost" size="icon" style={{color: '#007bff'}}><Edit size={16}/></Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" style={{color: '#dc3545'}}><Trash2 size={16}/></Button></AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja excluir o produto "{p.name}" da loja "{getSubscriberName(p.store_id)}"?</AlertDialogDescription></AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteProduct(p.id)} className="bg-red-600">Excluir</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))}</TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="test-drive" className="mt-4">
                         <Card className="bg-white border-gray-400">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Supervisão de Lojas em Test Drive</CardTitle>
                                <CardDescription className="text-gray-600">Funcionalidade em desenvolvimento.</CardDescription>
                            </CardHeader>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default AdminManageStore;