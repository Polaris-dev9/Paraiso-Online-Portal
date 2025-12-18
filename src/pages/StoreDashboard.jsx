import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, PackagePlus, ListOrdered, BarChart, Settings, FileText, ArrowRight, Star, Info, ShieldCheck, PlusCircle, Edit, Trash, Save, ArrowLeft, Upload, Loader2, X, Eye, Phone, Mail, MapPin, Calendar, CreditCard, User, Store, Globe, Facebook, Instagram, Truck, CreditCard as CreditCardIcon } from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { subscriberService } from '@/services/subscriberService';
import { productService } from '@/services/productService';
import orderService from '@/services/orderService';
import imageService from '@/services/imageService';
import storeSettingsService from '@/services/storeSettingsService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const StoreSettingsForm = ({ subscriber, storeSettings, onSettingsChange, onLoadSettings }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        store_name: subscriber?.name || '',
        store_description: '',
        contact_email: subscriber?.email || '',
        contact_phone: subscriber?.phone || '',
        contact_whatsapp: subscriber?.phone || '',
        delivery_enabled: true,
        delivery_fee: 0,
        free_delivery_threshold: null,
        show_reviews: true,
        show_related_products: true,
        products_per_page: 12,
        payment_methods: ['pix', 'credit_card'],
        delivery_policy: '',
        return_policy: '',
        terms_of_service: '',
        privacy_policy: '',
        facebook_url: '',
        instagram_url: '',
        website_url: ''
    });

    useEffect(() => {
        loadSettings();
    }, [subscriber?.id]);

    const loadSettings = async () => {
        if (!subscriber?.id) return;
        try {
            setLoading(true);
            const settings = await storeSettingsService.getStoreSettings(subscriber.id);
            // Se há configurações, carrega elas; senão, usa valores padrão do subscriber
            if (settings) {
                setFormData({
                    store_name: settings.store_name || subscriber?.name || '',
                    store_description: settings.store_description || '',
                    contact_email: settings.contact_email || subscriber?.email || '',
                    contact_phone: settings.contact_phone || subscriber?.phone || '',
                    contact_whatsapp: settings.contact_whatsapp || subscriber?.phone || '',
                    delivery_enabled: settings.delivery_enabled !== undefined ? settings.delivery_enabled : true,
                    delivery_fee: settings.delivery_fee || 0,
                    free_delivery_threshold: settings.free_delivery_threshold || null,
                    show_reviews: settings.show_reviews !== undefined ? settings.show_reviews : true,
                    show_related_products: settings.show_related_products !== undefined ? settings.show_related_products : true,
                    products_per_page: settings.products_per_page || 12,
                    payment_methods: settings.payment_methods || ['pix', 'credit_card'],
                    delivery_policy: settings.delivery_policy || '',
                    return_policy: settings.return_policy || '',
                    terms_of_service: settings.terms_of_service || '',
                    privacy_policy: settings.privacy_policy || '',
                    facebook_url: settings.facebook_url || '',
                    instagram_url: settings.instagram_url || '',
                    website_url: settings.website_url || ''
                });
                onSettingsChange(settings);
            } else {
                // Primeira vez - inicializa com valores padrão do subscriber
                setFormData(prev => ({
                    ...prev,
                    store_name: subscriber?.name || '',
                    contact_email: subscriber?.email || '',
                    contact_phone: subscriber?.phone || '',
                    contact_whatsapp: subscriber?.phone || ''
                }));
                onSettingsChange(null);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Erro ao carregar configurações da loja.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!subscriber?.id) return;

        try {
            setSaving(true);
            const saved = await storeSettingsService.saveStoreSettings(subscriber.id, formData);
            onSettingsChange(saved);
            toast({
                title: 'Sucesso!',
                description: 'Configurações da loja salvas com sucesso.'
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: error.message || 'Erro ao salvar configurações da loja.'
            });
        } finally {
            setSaving(false);
        }
    };

    const handlePaymentMethodToggle = (method) => {
        setFormData(prev => {
            const methods = prev.payment_methods || [];
            if (methods.includes(method)) {
                return { ...prev, payment_methods: methods.filter(m => m !== method) };
            } else {
                return { ...prev, payment_methods: [...methods, method] };
            }
        });
    };

    if (loading) {
        return (
            <Card className="bg-white border-gray-400">
                <CardContent className="pt-6">
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <form onSubmit={handleSave}>
            <div className="space-y-6">
                {/* Informações Básicas */}
                <Card className="bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="h-5 w-5" />
                            Informações Básicas da Loja
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="store_name">Nome da Loja *</Label>
                            <Input
                                id="store_name"
                                value={formData.store_name}
                                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                required
                                placeholder="Ex: Minha Loja Online"
                            />
                        </div>
                        <div>
                            <Label htmlFor="store_description">Descrição da Loja</Label>
                            <Textarea
                                id="store_description"
                                value={formData.store_description}
                                onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
                                placeholder="Descreva sua loja, produtos e serviços..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Informações de Contato */}
                <Card className="bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Informações de Contato
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="contact_email">Email de Contato</Label>
                            <Input
                                id="contact_email"
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                placeholder="contato@loja.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="contact_phone">Telefone</Label>
                            <Input
                                id="contact_phone"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                placeholder="(38) 99999-9999"
                            />
                        </div>
                        <div>
                            <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                            <Input
                                id="contact_whatsapp"
                                value={formData.contact_whatsapp}
                                onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                                placeholder="(38) 99999-9999"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Configurações de Entrega */}
                <Card className="bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Configurações de Entrega
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="delivery_enabled">Ativar Entrega</Label>
                                <p className="text-sm text-gray-500">Permitir que clientes solicitem entrega</p>
                            </div>
                            <Switch
                                id="delivery_enabled"
                                checked={formData.delivery_enabled}
                                onCheckedChange={(checked) => setFormData({ ...formData, delivery_enabled: checked })}
                            />
                        </div>
                        {formData.delivery_enabled && (
                            <>
                                <div>
                                    <Label htmlFor="delivery_fee">Taxa de Entrega (R$)</Label>
                                    <Input
                                        id="delivery_fee"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.delivery_fee}
                                        onChange={(e) => setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="free_delivery_threshold">Frete Grátis a partir de (R$)</Label>
                                    <Input
                                        id="free_delivery_threshold"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.free_delivery_threshold || ''}
                                        onChange={(e) => setFormData({ ...formData, free_delivery_threshold: e.target.value ? parseFloat(e.target.value) : null })}
                                        placeholder="Deixe em branco para desativar"
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Métodos de Pagamento */}
                <Card className="bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCardIcon className="h-5 w-5" />
                            Métodos de Pagamento Aceitos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['pix', 'credit_card', 'boleto', 'bank_transfer'].map((method) => {
                                const labels = {
                                    pix: 'PIX',
                                    credit_card: 'Cartão de Crédito',
                                    boleto: 'Boleto',
                                    bank_transfer: 'Transferência Bancária'
                                };
                                return (
                                    <div key={method} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`payment_${method}`}
                                            checked={formData.payment_methods?.includes(method)}
                                            onChange={() => handlePaymentMethodToggle(method)}
                                            className="rounded border-gray-300"
                                        />
                                        <Label htmlFor={`payment_${method}`} className="cursor-pointer">
                                            {labels[method]}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Redes Sociais */}
                <Card className="bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Redes Sociais e Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="facebook_url" className="flex items-center gap-2">
                                <Facebook className="h-4 w-4" />
                                Facebook
                            </Label>
                            <Input
                                id="facebook_url"
                                type="url"
                                value={formData.facebook_url}
                                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                                placeholder="https://facebook.com/sualoja"
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram_url" className="flex items-center gap-2">
                                <Instagram className="h-4 w-4" />
                                Instagram
                            </Label>
                            <Input
                                id="instagram_url"
                                type="url"
                                value={formData.instagram_url}
                                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                                placeholder="https://instagram.com/sualoja"
                            />
                        </div>
                        <div>
                            <Label htmlFor="website_url" className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Site/Website
                            </Label>
                            <Input
                                id="website_url"
                                type="url"
                                value={formData.website_url}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                placeholder="https://sualoja.com.br"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Políticas */}
                <Card className="bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Políticas e Termos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="delivery_policy">Política de Entrega</Label>
                            <Textarea
                                id="delivery_policy"
                                value={formData.delivery_policy}
                                onChange={(e) => setFormData({ ...formData, delivery_policy: e.target.value })}
                                placeholder="Informe prazos, condições e valores de entrega..."
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="return_policy">Política de Devolução</Label>
                            <Textarea
                                id="return_policy"
                                value={formData.return_policy}
                                onChange={(e) => setFormData({ ...formData, return_policy: e.target.value })}
                                placeholder="Informe condições e prazos para devoluções..."
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="terms_of_service">Termos de Serviço</Label>
                            <Textarea
                                id="terms_of_service"
                                value={formData.terms_of_service}
                                onChange={(e) => setFormData({ ...formData, terms_of_service: e.target.value })}
                                placeholder="Termos e condições de uso da loja..."
                                rows={4}
                            />
                        </div>
                        <div>
                            <Label htmlFor="privacy_policy">Política de Privacidade</Label>
                            <Textarea
                                id="privacy_policy"
                                value={formData.privacy_policy}
                                onChange={(e) => setFormData({ ...formData, privacy_policy: e.target.value })}
                                placeholder="Como você trata os dados dos clientes..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Configurações de Exibição */}
                <Card className="bg-white border-gray-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Configurações de Exibição
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="show_reviews">Exibir Avaliações</Label>
                                <p className="text-sm text-gray-500">Mostrar avaliações de clientes nos produtos</p>
                            </div>
                            <Switch
                                id="show_reviews"
                                checked={formData.show_reviews}
                                onCheckedChange={(checked) => setFormData({ ...formData, show_reviews: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="show_related_products">Exibir Produtos Relacionados</Label>
                                <p className="text-sm text-gray-500">Mostrar produtos similares na página do produto</p>
                            </div>
                            <Switch
                                id="show_related_products"
                                checked={formData.show_related_products}
                                onCheckedChange={(checked) => setFormData({ ...formData, show_related_products: checked })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="products_per_page">Produtos por Página</Label>
                            <Input
                                id="products_per_page"
                                type="number"
                                min="6"
                                max="48"
                                value={formData.products_per_page}
                                onChange={(e) => setFormData({ ...formData, products_per_page: parseInt(e.target.value) || 12 })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Botão Salvar */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Salvar Configurações
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
};

const StoreDashboard = () => {
    const { user, loading: authLoading } = useSupabaseAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    
    const [subscriber, setSubscriber] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [orderStats, setOrderStats] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [selectedTab, setSelectedTab] = useState('products');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
    const [updatingPaymentStatus, setUpdatingPaymentStatus] = useState(false);
    const [storeSettings, setStoreSettings] = useState(null);
    const [savingSettings, setSavingSettings] = useState(false);

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

                // Buscar pedidos e estatísticas
                await loadOrders(subData.id);
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

    const loadOrders = useCallback(async (subscriberId) => {
        try {
            const ordersData = await orderService.getOrdersBySubscriberId(
                subscriberId, 
                orderStatusFilter === 'all' ? null : orderStatusFilter
            );
            setOrders(ordersData);

            const stats = await orderService.getOrderStats(subscriberId);
            setOrderStats(stats);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao carregar pedidos."
            });
        }
    }, [orderStatusFilter, toast]);

    useEffect(() => {
        if (subscriber?.id) {
            loadOrders(subscriber.id);
        }
    }, [subscriber?.id, loadOrders]);

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            toast({
                title: "Sucesso!",
                description: "Status do pedido atualizado com sucesso."
            });
            await loadOrders(subscriber.id);
            // Atualizar pedido selecionado se for o mesmo
            if (selectedOrder && selectedOrder.id === orderId) {
                const updatedOrder = await orderService.getOrderById(orderId);
                setSelectedOrder(updatedOrder);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message || "Erro ao atualizar status do pedido."
            });
        }
    };

    const handleViewOrderDetails = async (orderId) => {
        try {
            const orderDetails = await orderService.getOrderById(orderId);
            setSelectedOrder(orderDetails);
            setIsOrderDetailOpen(true);
        } catch (error) {
            console.error('Error fetching order details:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Erro ao carregar detalhes do pedido."
            });
        }
    };

    const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
        try {
            setUpdatingPaymentStatus(true);
            await orderService.updatePaymentStatus(orderId, newPaymentStatus);
            toast({
                title: "Sucesso!",
                description: "Status de pagamento atualizado com sucesso."
            });
            await loadOrders(subscriber.id);
            // Atualizar pedido selecionado
            const updatedOrder = await orderService.getOrderById(orderId);
            setSelectedOrder(updatedOrder);
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast({
                variant: "destructive",
                title: "Erro",
                description: error.message || "Erro ao atualizar status de pagamento."
            });
        } finally {
            setUpdatingPaymentStatus(false);
        }
    };

    // Loja Virtual disponível para TODOS os planos (gratuito, essencial, premium, premium_vip)
    const hasStoreFeature = subscriber?.plan_type === 'gratuito' ||
                            subscriber?.plan_type === 'essencial' ||
                            subscriber?.plan_type === 'premium' ||
                            subscriber?.plan_type === 'premium_vip';
    const isFreePlan = subscriber?.plan_type === 'gratuito';
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
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                            <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
                                <TabsTrigger value="products" className="flex items-center gap-2">
                                    <PackagePlus className="h-4 w-4" />
                                    Produtos
                                </TabsTrigger>
                                <TabsTrigger value="orders" className="flex items-center gap-2">
                                    <ListOrdered className="h-4 w-4" />
                                    Pedidos
                                    {orderStats && orderStats.pending > 0 && (
                                        <Badge className="ml-2 bg-yellow-500 text-white">
                                            {orderStats.pending}
                                        </Badge>
                                    )}
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Configurações
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="products" className="space-y-6">
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
                            </TabsContent>

                            <TabsContent value="orders" className="space-y-6">
                                {/* Estatísticas de Pedidos */}
                                {orderStats && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <Card className="bg-white border-gray-400">
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-gray-900">{orderStats.total}</div>
                                                    <div className="text-sm text-gray-600 mt-1">Total de Pedidos</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-white border-gray-400">
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
                                                    <div className="text-sm text-gray-600 mt-1">Pendentes</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-white border-gray-400">
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">
                                                        R$ {orderStats.totalRevenue.toFixed(2).replace('.', ',')}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">Receita Total</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-white border-gray-400">
                                            <CardContent className="pt-6">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        R$ {orderStats.pendingRevenue.toFixed(2).replace('.', ',')}
                                                    </div>
                                                    <div className="text-sm text-gray-600 mt-1">Pendente</div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                <Card className="bg-white border-gray-400">
                                    <CardHeader className="flex-row justify-between items-center">
                                        <CardTitle className="text-gray-900">Meus Pedidos</CardTitle>
                                        <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Filtrar por status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos</SelectItem>
                                                <SelectItem value="pending">Pendentes</SelectItem>
                                                <SelectItem value="confirmed">Confirmados</SelectItem>
                                                <SelectItem value="processing">Em Processamento</SelectItem>
                                                <SelectItem value="shipped">Enviados</SelectItem>
                                                <SelectItem value="delivered">Entregues</SelectItem>
                                                <SelectItem value="cancelled">Cancelados</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </CardHeader>
                                    <CardContent>
                                        {orders.length === 0 ? (
                                            <div className="text-center py-12">
                                                <ListOrdered className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                                <p className="text-gray-600 mb-4">Você ainda não tem pedidos.</p>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto border rounded-lg border-gray-400">
                                                <Table>
                                                    <TableHeader className="bg-gray-200">
                                                        <TableRow>
                                                            <TableHead className="text-gray-800 font-semibold">ID</TableHead>
                                                            <TableHead className="text-gray-800 font-semibold">Cliente</TableHead>
                                                            <TableHead className="text-gray-800 font-semibold">Itens</TableHead>
                                                            <TableHead className="text-gray-800 font-semibold">Valor Total</TableHead>
                                                            <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                                            <TableHead className="text-gray-800 font-semibold">Pagamento</TableHead>
                                                            <TableHead className="text-gray-800 font-semibold">Data</TableHead>
                                                            <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {orders.map(order => {
                                                            const statusLabel = orderService.getStatusLabel(order.status);
                                                            const paymentLabel = orderService.getPaymentStatusLabel(order.payment_status);
                                                            const itemsCount = order.order_items?.length || 0;
                                                            
                                                            return (
                                                                <TableRow key={order.id}>
                                                                    <TableCell className="font-mono text-sm">
                                                                        {order.id.slice(0, 8)}...
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div>
                                                                            <div className="font-medium">{order.customer_name}</div>
                                                                            <div className="text-sm text-gray-500">{order.customer_email}</div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                                                                    </TableCell>
                                                                    <TableCell className="font-semibold">
                                                                        R$ {parseFloat(order.total_amount || 0).toFixed(2).replace('.', ',')}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge className={`${statusLabel.bgColor} ${statusLabel.textColor}`}>
                                                                            {statusLabel.label}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge className={`${paymentLabel.bgColor} ${paymentLabel.textColor}`}>
                                                                            {paymentLabel.label}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-sm text-gray-600">
                                                                        {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="flex justify-end gap-2">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => handleViewOrderDetails(order.id)}
                                                                                className="text-blue-600 hover:text-blue-800"
                                                                                title="Ver detalhes"
                                                                            >
                                                                                <Eye size={16} />
                                                                            </Button>
                                                                            <Select
                                                                                value={order.status}
                                                                                onValueChange={(newStatus) => handleUpdateOrderStatus(order.id, newStatus)}
                                                                            >
                                                                                <SelectTrigger className="w-[160px]">
                                                                                    <SelectValue />
                                                                                </SelectTrigger>
                                                                                <SelectContent>
                                                                                    <SelectItem value="pending">Pendente</SelectItem>
                                                                                    <SelectItem value="confirmed">Confirmado</SelectItem>
                                                                                    <SelectItem value="processing">Em Processamento</SelectItem>
                                                                                    <SelectItem value="shipped">Enviado</SelectItem>
                                                                                    <SelectItem value="delivered">Entregue</SelectItem>
                                                                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                                                                </SelectContent>
                                                                            </Select>
                                                                        </div>
                                            </TableCell>
                                        </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                </Table>
                            </div>
                                        )}
                        </CardContent>
                    </Card>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-6">
                                <StoreSettingsForm 
                                    subscriber={subscriber}
                                    storeSettings={storeSettings}
                                    onSettingsChange={setStoreSettings}
                                />
                            </TabsContent>
                        </Tabs>
                    </>
                )}

                {/* Modal de Detalhes do Pedido */}
                <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
                    <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-white shadow-2xl">
                        {selectedOrder && (
                            <>
                                <DialogHeader className="border-b-2 border-gray-200 pb-4 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 -mx-6 -mt-6 px-6 pt-6 rounded-t-lg">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                <ListOrdered className="h-6 w-6 text-blue-600" />
                                                Pedido #{selectedOrder.id.slice(0, 8).toUpperCase()}
                                            </DialogTitle>
                                            <DialogDescription className="flex items-center gap-2 text-gray-600 font-medium">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                Criado em {new Date(selectedOrder.created_at).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </DialogDescription>
                                        </div>
                                        <div className="flex flex-row sm:flex-col gap-2">
                                            <Badge className={`${orderService.getStatusLabel(selectedOrder.status).bgColor} ${orderService.getStatusLabel(selectedOrder.status).textColor} px-4 py-2 text-sm font-bold shadow-sm`}>
                                                {orderService.getStatusLabel(selectedOrder.status).label}
                                            </Badge>
                                            <Badge className={`${orderService.getPaymentStatusLabel(selectedOrder.payment_status).bgColor} ${orderService.getPaymentStatusLabel(selectedOrder.payment_status).textColor} px-4 py-2 text-sm font-bold shadow-sm`}>
                                                {orderService.getPaymentStatusLabel(selectedOrder.payment_status).label}
                                            </Badge>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <div className="space-y-6 mt-6">
                                    {/* Informações do Cliente */}
                                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                                                <div className="bg-blue-600 p-2.5 rounded-lg mr-3 shadow-md">
                                                    <User className="h-5 w-5 text-white" />
                                                </div>
                                                Informações do Cliente
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pt-4">
                                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="bg-blue-100 p-2 rounded-full">
                                                        <User className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Nome do Cliente</div>
                                                        <div className="font-bold text-xl text-gray-900 mt-1">{selectedOrder.customer_name}</div>
                                                    </div>
                                                </div>
                                                <div className="border-t pt-3 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-green-100 p-2 rounded-full">
                                                            <Mail className="h-4 w-4 text-green-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-xs text-gray-500 uppercase tracking-wide">Email</div>
                                                            <a href={`mailto:${selectedOrder.customer_email}`} className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                                                {selectedOrder.customer_email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    {selectedOrder.customer_phone && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-purple-100 p-2 rounded-full">
                                                                <Phone className="h-4 w-4 text-purple-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-xs text-gray-500 uppercase tracking-wide">Telefone</div>
                                                                <a href={`tel:${selectedOrder.customer_phone}`} className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                                                                    {selectedOrder.customer_phone}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {selectedOrder.customer_address && typeof selectedOrder.customer_address === 'object' && Object.keys(selectedOrder.customer_address).length > 0 && (
                                                        <div className="flex items-start gap-3 pt-2 border-t">
                                                            <div className="bg-orange-100 p-2 rounded-full mt-1">
                                                                <MapPin className="h-4 w-4 text-orange-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Endereço de Entrega</div>
                                                                <div className="text-gray-900 font-medium space-y-1">
                                                                    {selectedOrder.customer_address.rua && <div>{selectedOrder.customer_address.rua}</div>}
                                                                    {selectedOrder.customer_address.bairro && <div>{selectedOrder.customer_address.bairro}</div>}
                                                                    <div>
                                                                        {selectedOrder.customer_address.cidade && selectedOrder.customer_address.cidade}
                                                                        {selectedOrder.customer_address.estado && ', ' + selectedOrder.customer_address.estado}
                                                                        {selectedOrder.customer_address.cep && <span className="ml-2 font-semibold">CEP: {selectedOrder.customer_address.cep}</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Itens do Pedido */}
                                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-lg">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="bg-green-600 p-2.5 rounded-lg mr-3 shadow-md">
                                                        <PackagePlus className="h-5 w-5 text-white" />
                                                    </div>
                                                    Itens do Pedido
                                                </div>
                                                <Badge variant="outline" className="bg-white border-green-400 text-green-700 font-bold px-3 py-1">
                                                    {selectedOrder.order_items?.length || 0} {selectedOrder.order_items?.length === 1 ? 'item' : 'itens'}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                                                <Table>
                                                    <TableHeader className="bg-gray-50">
                                                        <TableRow>
                                                            <TableHead className="font-semibold text-gray-900">Produto</TableHead>
                                                            <TableHead className="text-center font-semibold text-gray-900">Quantidade</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-900">Preço Unitário</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-900">Subtotal</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedOrder.order_items?.map((item, index) => (
                                                            <TableRow key={item.id || index} className="hover:bg-gray-50">
                                                                <TableCell className="font-medium text-gray-900">{item.product_name}</TableCell>
                                                                <TableCell className="text-center">
                                                                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                                                        {item.quantity}x
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right text-gray-700">
                                                                    R$ {parseFloat(item.product_price || 0).toFixed(2).replace('.', ',')}
                                                                </TableCell>
                                                                <TableCell className="text-right font-semibold text-gray-900">
                                                                    R$ {parseFloat(item.subtotal || 0).toFixed(2).replace('.', ',')}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                                <div className="bg-gradient-to-r from-green-600 to-green-700 p-5 border-t-2 border-green-800 shadow-lg">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-white font-bold text-xl flex items-center gap-2">
                                                            <span className="bg-white/20 px-3 py-1 rounded-lg">Total do Pedido</span>
                                                        </span>
                                                        <span className="text-white font-bold text-3xl bg-white/20 px-4 py-2 rounded-lg">
                                                            R$ {parseFloat(selectedOrder.total_amount || 0).toFixed(2).replace('.', ',')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Informações Adicionais */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 shadow-lg">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                                    <div className="bg-purple-600 p-2.5 rounded-lg mr-3 shadow-md">
                                                        <CreditCard className="h-5 w-5 text-white" />
                                                    </div>
                                                    Informações de Pagamento
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4 pt-4">
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <div className="mb-4">
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Método de Pagamento</div>
                                                        <div className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                                            {selectedOrder.payment_method === 'PIX' && '💳'}
                                                            {selectedOrder.payment_method === 'Cartão de Crédito' && '💳'}
                                                            {selectedOrder.payment_method === 'Boleto' && '🧾'}
                                                            {selectedOrder.payment_method || 'Não informado'}
                                                        </div>
                                                    </div>
                                                    <div className="border-t pt-4">
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Status de Pagamento</div>
                                                        <Select
                                                            value={selectedOrder.payment_status}
                                                            onValueChange={(newStatus) => handleUpdatePaymentStatus(selectedOrder.id, newStatus)}
                                                            disabled={updatingPaymentStatus}
                                                        >
                                                            <SelectTrigger className="w-full bg-white border-gray-300">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="pending">Pendente</SelectItem>
                                                                <SelectItem value="paid">Pago</SelectItem>
                                                                <SelectItem value="failed">Falhou</SelectItem>
                                                                <SelectItem value="refunded">Reembolsado</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                                    <div className="bg-amber-600 p-2.5 rounded-lg mr-3 shadow-md">
                                                        <Calendar className="h-5 w-5 text-white" />
                                                    </div>
                                                    Histórico do Pedido
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4 pt-4">
                                                <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                                                    <div>
                                                        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Data de Criação</div>
                                                        <div className="font-semibold text-gray-900">
                                                            {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR', {
                                                                day: '2-digit',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {new Date(selectedOrder.created_at).toLocaleTimeString('pt-BR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                    {selectedOrder.updated_at && selectedOrder.updated_at !== selectedOrder.created_at && (
                                                        <div className="border-t pt-3">
                                                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Última Atualização</div>
                                                            <div className="font-semibold text-gray-900">
                                                                {new Date(selectedOrder.updated_at).toLocaleDateString('pt-BR', {
                                                                    day: '2-digit',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {new Date(selectedOrder.updated_at).toLocaleTimeString('pt-BR', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Observações */}
                                    {selectedOrder.notes && (
                                        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-300 shadow-lg">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                                    <div className="bg-indigo-600 p-2.5 rounded-lg mr-3 shadow-md">
                                                        <FileText className="h-5 w-5 text-white" />
                                                    </div>
                                                    Observações
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedOrder.notes}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Ações - Gerenciar Pedido */}
                                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-400 shadow-lg">
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                                                <div className="bg-gray-700 p-2.5 rounded-lg mr-3 shadow-md">
                                                    <Settings className="h-5 w-5 text-white" />
                                                </div>
                                                Gerenciar Pedido
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4 pt-4">
                                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">Alterar Status do Pedido</Label>
                                                <Select
                                                    value={selectedOrder.status}
                                                    onValueChange={(newStatus) => handleUpdateOrderStatus(selectedOrder.id, newStatus)}
                                                >
                                                    <SelectTrigger className="w-full bg-white border-gray-300">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pendente</SelectItem>
                                                        <SelectItem value="confirmed">Confirmado</SelectItem>
                                                        <SelectItem value="processing">Em Processamento</SelectItem>
                                                        <SelectItem value="shipped">Enviado</SelectItem>
                                                        <SelectItem value="delivered">Entregue</SelectItem>
                                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <p className="text-xs text-gray-500 mt-2">Ao alterar o status, o cliente será notificado automaticamente.</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <DialogFooter className="border-t pt-4 mt-6">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setIsOrderDetailOpen(false)}
                                        className="w-full sm:w-auto"
                                    >
                                        Fechar
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </motion.div>
        </div>
    );
};

export default StoreDashboard;