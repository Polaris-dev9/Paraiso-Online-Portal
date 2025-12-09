import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, PackagePlus, ListOrdered, BarChart, Settings, FileText, ArrowRight, Star, Info, ShieldCheck, PlusCircle, Edit, Trash, Save, ArrowLeft, Upload, Loader2, X } from 'lucide-react';
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
import { subscriberService } from '@/services/subscriberService';
import { productService } from '@/services/productService';
import imageService from '@/services/imageService';

const ProductForm = ({ product, onSave, onCancel, isFreePlan, productCount, subscriberId, userId }) => {
    const [data, setData] = useState({
        name: product?.name || '',
        price: product?.price || 0,
        description: product?.description || '',
        image_url: product?.image_url || '',
        is_promotion: product?.is_promotion || false,
        is_active: product?.is_active !== undefined ? product.is_active : true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(product?.image_url || null);
    const [uploading, setUploading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const productLimit = isFreePlan ? 3 : 300;

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar imagem
        const validation = imageService.validateImage(file);
        if (!validation.valid) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: validation.error
            });
            return;
        }

        setImageFile(file);

        // Criar preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setData({ ...data, image_url: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!data.id && productCount >= productLimit) {
            toast({
                variant: "destructive",
                title: "Limite Atingido!",
                description: `Seu plano permite até ${productLimit} produtos. Faça um upgrade para cadastrar mais.`,
            });
            navigate('/upgrade');
            return;
        }

        try {
            setUploading(true);

            let imageUrl = data.image_url;
            let imagePath = null;

            // Se há nova imagem para fazer upload
            if (imageFile) {
                const uploadResult = await imageService.uploadImage(
                    imageFile,
                    'products',
                    userId || subscriberId,
                    'product'
                );
                imageUrl = uploadResult.url;
                imagePath = uploadResult.path;

                // Se editando e havia imagem anterior, deletar a antiga
                if (product?.image_path && product.image_path !== imagePath) {
                    await imageService.deleteImage(product.image_path);
                }
            }

            const productData = {
                ...data,
                image_url: imageUrl,
                image_path: imagePath || product?.image_path || null,
                subscriber_id: subscriberId
            };

            onSave(productData);
        } catch (error) {
            console.error('Error in form submit:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message || 'Erro ao salvar produto'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-white border-gray-400">
                <CardHeader>
                    <CardTitle className="text-gray-900">{product?.id ? 'Editar' : 'Adicionar'} Produto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome do Produto *</Label>
                            <Input 
                                id="name" 
                                value={data.name} 
                                onChange={e => setData({...data, name: e.target.value})} 
                                className="bg-white border-gray-400" 
                                required 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Preço (R$) *</Label>
                                <Input 
                                    id="price" 
                                    type="number" 
                                    step="0.01" 
                                    min="0"
                                    value={data.price} 
                                    onChange={e => setData({...data, price: parseFloat(e.target.value) || 0})} 
                                    className="bg-white border-gray-400" 
                                    required 
                                />
                            </div>
                            <div>
                                <Label htmlFor="image">Imagem do Produto</Label>
                                <div className="space-y-2">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img 
                                                src={imagePreview} 
                                                alt="Preview" 
                                                className="w-full h-32 object-cover rounded-md border border-gray-300"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                            <Label htmlFor="image-upload" className="cursor-pointer">
                                                <span className="text-sm text-gray-600">Clique para fazer upload</span>
                                                <Input
                                                    id="image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </Label>
                                        </div>
                                    )}
                                    {!imagePreview && (
                                        <Input 
                                            id="image-url" 
                                            value={data.image_url} 
                                            onChange={e => setData({...data, image_url: e.target.value})} 
                                            className="bg-white border-gray-400" 
                                            placeholder="Ou cole uma URL de imagem"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea 
                                id="description" 
                                value={data.description} 
                                onChange={e => setData({...data, description: e.target.value})} 
                                className="bg-white border-gray-400" 
                                rows={4}
                            />
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between space-x-4 py-2">
                                <div className="flex items-center space-x-3 flex-grow">
                                    <Switch 
                                        id="isPromotion" 
                                        checked={data.is_promotion} 
                                        onCheckedChange={c => setData({...data, is_promotion: c})} 
                                        className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-300"
                                    />
                                    <div className="flex-1">
                                        <Label htmlFor="isPromotion" className="text-base font-medium text-gray-900 cursor-pointer">
                                            Marcar como promoção
                                        </Label>
                                        <p className="text-sm text-gray-600 mt-0.5">
                                            Produtos em promoção aparecem destacados na loja
                                        </p>
                                    </div>
                                </div>
                                {data.is_promotion && (
                                    <Badge className="bg-orange-500 text-white">
                                        Promoção
                                    </Badge>
                                )}
                            </div>

                            {product?.id && (
                                <div className="flex items-center justify-between space-x-4 pt-4 border-t border-gray-200 mt-4">
                                    <div className="flex items-center space-x-3 flex-grow">
                                        <Switch 
                                            id="isActive" 
                                            checked={data.is_active} 
                                            onCheckedChange={c => setData({...data, is_active: c})} 
                                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                                        />
                                        <div className="flex-1">
                                            <Label htmlFor="isActive" className="text-base font-medium text-gray-900 cursor-pointer">
                                                Produto ativo
                                            </Label>
                                            <p className="text-sm text-gray-600 mt-0.5">
                                                {data.is_active 
                                                    ? 'Este produto está visível na sua loja pública' 
                                                    : 'Este produto não será exibido na sua loja pública'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    {data.is_active ? (
                                        <Badge className="bg-green-500 text-white">
                                            Ativo
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="border-gray-300 text-gray-600">
                                            Inativo
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button 
                                type="button" 
                                onClick={onCancel} 
                                disabled={uploading}
                                style={{ backgroundColor: '#6c757d', color: '#fff' }}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={uploading}
                                style={{ backgroundColor: '#28a745', color: '#fff' }}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Salvar Produto
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const StoreDashboard = () => {
    const { user, loading: authLoading } = useSupabaseAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    
    const [subscriber, setSubscriber] = useState(null);
    const [products, setProducts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            if (!user || authLoading) return;

            try {
                setLoading(true);

                // Buscar assinante pelo user_id
                const subData = await subscriberService.getSubscriberByUserId(user.id);
                if (!subData) {
                    toast({
                        variant: "destructive",
                        title: "Erro",
                        description: "Assinante não encontrado. Por favor, complete seu cadastro."
                    });
                    navigate('/subscriber-area');
                    return;
                }

                setSubscriber(subData);

                // Buscar produtos
                const productsData = await productService.getProductsBySubscriberId(subData.id);
                setProducts(productsData);
            } catch (error) {
                console.error('Error loading store data:', error);
                toast({
                    variant: "destructive",
                    title: "Erro",
                    description: error.message || "Erro ao carregar dados da loja."
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user, authLoading, navigate, toast]);

    const isFreePlan = subscriber?.plan_type === 'gratuito';
    const hasStoreFeature = subscriber?.plan_type === 'premium_vip' || isFreePlan;
    const productLimit = productService.getProductLimit(subscriber?.plan_type || 'gratuito');

    const handleOpenForm = (product = null) => {
        setCurrentProduct(product);
        setIsFormOpen(true);
    };

    const handleSaveProduct = async (productData) => {
        try {
            let savedProduct;

            if (currentProduct?.id) {
                // Atualizar produto existente
                savedProduct = await productService.updateProduct(currentProduct.id, productData);
                toast({ 
                    title: "Sucesso!", 
                    description: "Produto atualizado com sucesso." 
                });
            } else {
                // Criar novo produto
                savedProduct = await productService.createProduct(productData);
                toast({ 
                    title: "Sucesso!", 
                    description: "Produto adicionado com sucesso." 
                });
            }

            // Recarregar lista de produtos
            const updatedProducts = await productService.getProductsBySubscriberId(subscriber.id);
            setProducts(updatedProducts);

            setIsFormOpen(false);
            setCurrentProduct(null);
        } catch (error) {
            console.error('Error saving product:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message || "Erro ao salvar produto."
            });
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            setDeleting(productId);
            await productService.deleteProduct(productId);
            
            // Recarregar lista
            const updatedProducts = await productService.getProductsBySubscriberId(subscriber.id);
            setProducts(updatedProducts);

            toast({ 
                title: "Sucesso!", 
                description: "Produto removido com sucesso." 
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message || "Erro ao remover produto."
            });
        } finally {
            setDeleting(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
            </div>
        );
    }

    if (!subscriber) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Assinante não encontrado.</p>
                    <Button onClick={() => navigate('/subscriber-area')}>Voltar ao Dashboard</Button>
                </div>
            </div>
        );
    }

    if (!hasStoreFeature) {
        return (
            <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
                <Helmet><title>Faça um Upgrade - Dashboard da Loja</title></Helmet>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/subscriber-area')}
                            className="mb-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para Área do Assinante
                        </Button>
                    </div>
                    <Card className="bg-white border-gray-400 text-center shadow-lg">
                        <CardHeader>
                            <div className="mx-auto bg-yellow-100 rounded-full p-4 w-fit mb-4">
                                <Star className="h-10 w-10 text-yellow-500" />
                            </div>
                            <CardTitle className="text-3xl font-bold text-gray-900">Desbloqueie o Poder do E-commerce!</CardTitle>
                            <CardDescription className="text-gray-700 max-w-lg mx-auto mt-2 text-lg">
                                Seu plano atual não inclui a Loja Virtual. Faça um upgrade para o Premium VIP para começar a vender online.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <Link to="/upgrade">
                                <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xl px-10 py-7">
                                    Ver Planos e Fazer Upgrade <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            </Link>
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
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/subscriber-area')}
                        className="mb-4 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para Área do Assinante
                    </Button>
                </div>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><ShoppingBag className="mr-3" /> Dashboard da Loja</h1>
                    <p className="text-gray-700 mt-2">Gerencie os produtos e serviços da sua loja: {subscriber.name}.</p>
                </div>

                {isFormOpen ? (
                    <ProductForm 
                        product={currentProduct} 
                        onSave={handleSaveProduct} 
                        onCancel={() => {
                            setIsFormOpen(false);
                            setCurrentProduct(null);
                        }} 
                        isFreePlan={isFreePlan} 
                        productCount={products.length}
                        subscriberId={subscriber.id}
                        userId={user?.id}
                    />
                ) : (
                    <>
                        <Card className="bg-white border-gray-400 mb-6">
                            <CardHeader className="flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="text-gray-900">
                                        Meus Produtos ({products.length}/{productLimit})
                                    </CardTitle>
                                    {isFreePlan && (
                                        <CardDescription>
                                            Seu plano gratuito permite até 3 produtos. 
                                            <Link to="/upgrade" className="text-blue-600 hover:underline ml-1">
                                                Faça um upgrade
                                            </Link> para cadastrar mais.
                                        </CardDescription>
                                    )}
                                    {products.length >= productLimit && !isFreePlan && (
                                        <CardDescription className="text-yellow-600">
                                            Você atingiu o limite de produtos do seu plano. 
                                            <Link to="/upgrade" className="text-blue-600 hover:underline ml-1">
                                                Faça upgrade
                                            </Link> para adicionar mais produtos.
                                        </CardDescription>
                                    )}
                                </div>
                                <Button 
                                    onClick={() => handleOpenForm()} 
                                    disabled={products.length >= productLimit}
                                    style={{ backgroundColor: '#007bff', color: '#fff' }}
                                >
                                    <PlusCircle className="mr-2" size={16} /> Adicionar Produto
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {products.length === 0 ? (
                                    <div className="text-center py-12">
                                        <PackagePlus className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600 mb-4">Você ainda não tem produtos cadastrados.</p>
                                        <Button 
                                            onClick={() => handleOpenForm()} 
                                            style={{ backgroundColor: '#007bff', color: '#fff' }}
                                        >
                                            <PlusCircle className="mr-2" size={16} /> Adicionar Primeiro Produto
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto border rounded-lg border-gray-400">
                                        <Table>
                                            <TableHeader className="bg-gray-200">
                                                <TableRow>
                                                    <TableHead className="text-gray-800 font-semibold">Produto</TableHead>
                                                    <TableHead className="text-gray-800 font-semibold">Preço</TableHead>
                                                    <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                                    <TableHead className="text-gray-800 font-semibold">Promoção</TableHead>
                                                    <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {products.map(p => (
                                                    <TableRow key={p.id}>
                                                        <TableCell className="font-medium flex items-center gap-3">
                                                            {p.image_url ? (
                                                                <img 
                                                                    src={p.image_url} 
                                                                    alt={p.name} 
                                                                    className="w-12 h-12 object-cover rounded-md"
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://via.placeholder.com/48?text=No+Image';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                                                    <PackagePlus className="h-6 w-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="font-medium">{p.name}</div>
                                                                {p.description && (
                                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                                        {p.description}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            R$ {parseFloat(p.price || 0).toFixed(2).replace('.', ',')}
                                                        </TableCell>
                                                        <TableCell>
                                                            {p.is_active ? (
                                                                <Badge className="bg-green-500 text-white">Ativo</Badge>
                                                            ) : (
                                                                <Badge variant="outline">Inativo</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {p.is_promotion ? (
                                                                <Badge className="bg-orange-500 text-white">Sim</Badge>
                                                            ) : (
                                                                <span className="text-gray-500">Não</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button 
                                                                    onClick={() => handleOpenForm(p)} 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    style={{color: '#007bff'}}
                                                                >
                                                                    <Edit size={16} />
                                                                </Button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <Button 
                                                                            variant="ghost" 
                                                                            size="icon"
                                                                            disabled={deleting === p.id}
                                                                            style={{color: '#dc3545'}}
                                                                        >
                                                                            {deleting === p.id ? (
                                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                            ) : (
                                                                                <Trash size={16} />
                                                                            )}
                                                                        </Button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                Tem certeza que deseja excluir o produto "{p.name}"? 
                                                                                Esta ação não pode ser desfeita.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                            <AlertDialogAction 
                                                                                onClick={() => handleDeleteProduct(p.id)} 
                                                                                className="bg-red-600 hover:bg-red-700"
                                                                            >
                                                                                Excluir
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {subscriber.slug && (
                            <Card className="bg-white border-gray-400">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Link da sua Loja</CardTitle>
                                    <CardDescription>
                                        Compartilhe este link para que seus clientes vejam seus produtos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            value={`${window.location.origin}/loja/${subscriber.slug}`}
                                            readOnly
                                            className="bg-gray-50"
                                        />
                                        <Button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/loja/${subscriber.slug}`);
                                                toast({
                                                    title: "Link copiado!",
                                                    description: "Link da loja copiado para a área de transferência."
                                                });
                                            }}
                                        >
                                            Copiar
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default StoreDashboard;