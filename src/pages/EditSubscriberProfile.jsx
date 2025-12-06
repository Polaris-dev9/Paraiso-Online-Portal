import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Save, Loader2, FileUp, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subscriberService } from '@/services/subscriberService';
import { cepService } from '@/services/cepService';
import { categoryService } from '@/services/categoryService';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const EditSubscriberProfile = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useSupabaseAuth();
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [logoFile, setLogoFile] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [categories, setCategories] = useState([]);
    const [subscriber, setSubscriber] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cpfCnpj: '',
        category: '',
        cep: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        description: ''
    });

    // Carregar dados do assinante
    // Nota: RoleGuard já protege esta rota, então user sempre existirá quando este componente renderizar
    useEffect(() => {
        // Não fazer nada se ainda está carregando autenticação
        if (authLoading) {
            console.log('[EditProfile] Aguardando autenticação carregar...');
            return;
        }

        // Se não tiver user após auth carregar, RoleGuard já redirecionou
        if (!user) {
            console.log('[EditProfile] Sem usuário - RoleGuard deve ter redirecionado');
            return;
        }

        console.log('[EditProfile] Carregando dados para usuário:', user.email);

        const loadSubscriberData = async () => {

            try {
                setLoadingData(true);
                
                // Buscar assinante
                let subscriberData = await subscriberService.getSubscriberByUserId(user.id);
                
                if (!subscriberData && user.email) {
                    const { data } = await supabase
                        .from('subscribers')
                        .select('*')
                        .ilike('email', user.email)
                        .maybeSingle();
                    subscriberData = data;
                }

                if (!subscriberData) {
                    // Se não encontrou, criar um assinante básico automaticamente
                    try {
                        subscriberData = await subscriberService.createSubscriber({
                            user_id: user.id,
                            name: user.user_metadata?.full_name || 'Novo Assinante',
                            email: user.email,
                            profile_type: 'empresarial',
                            plan_type: 'gratuito',
                            payment_status: 'free',
                            status: true
                        });
                    } catch (createError) {
                        console.error('Error creating subscriber:', createError);
                        // Se falhar ao criar, tentar buscar novamente por email
                        if (user.email) {
                            const { data: retrySubscriber } = await supabase
                                .from('subscribers')
                                .select('*')
                                .ilike('email', user.email)
                                .maybeSingle();
                            if (retrySubscriber) {
                                subscriberData = retrySubscriber;
                            } else {
                                toast({
                                    variant: "destructive",
                                    title: "Erro",
                                    description: "Não foi possível criar seu perfil. Redirecionando...",
                                });
                                navigate('/painel-assinante');
                                return;
                            }
                        } else {
                            navigate('/painel-assinante');
                            return;
                        }
                    }
                }

                setSubscriber(subscriberData);

                // Preencher formulário com dados existentes
                const address = subscriberData.address || {};
                setFormData({
                    name: subscriberData.name || '',
                    email: subscriberData.email || user.email || '',
                    phone: subscriberData.phone || '',
                    cpfCnpj: subscriberData.cpf_cnpj || '',
                    category: subscriberData.category_id || '',
                    cep: address.cep ? cepService.formatCep(address.cep) : '',
                    street: address.street || '',
                    number: address.number || '',
                    complement: address.complement || '',
                    neighborhood: address.neighborhood || '',
                    city: address.city || '',
                    state: address.state || '',
                    description: subscriberData.description || ''
                });

                // Carregar categorias
                const cats = await categoryService.getCategoriesByType('commercial');
                setCategories(cats);

            } catch (error) {
                console.error('Error loading subscriber data:', error);
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar suas informações.",
                });
                navigate('/area-do-assinante');
            } finally {
                setLoadingData(false);
            }
        };

        loadSubscriberData();
    }, [user, navigate, toast, authLoading]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSelectChange = (value) => {
        setFormData(prev => ({ ...prev, category: value }));
    };

    const handleCepSearch = async () => {
        if (!formData.cep || !cepService.isValidCep(formData.cep)) {
            toast({
                title: "CEP inválido",
                description: "Por favor, insira um CEP válido com 8 dígitos.",
                variant: "destructive",
            });
            return;
        }

        setLoadingCep(true);
        try {
            const addressData = await cepService.getAddressByCep(formData.cep);
            setFormData(prev => ({
                ...prev,
                street: addressData.street || '',
                neighborhood: addressData.neighborhood || '',
                city: addressData.city || '',
                state: addressData.state || '',
                complement: addressData.complement || prev.complement || ''
            }));

            toast({
                title: "✅ Endereço encontrado!",
                description: `CEP encontrado: ${addressData.city}/${addressData.state}`
            });
        } catch (error) {
            console.error('Error fetching CEP:', error);
            toast({
                variant: "destructive",
                title: "CEP não encontrado",
                description: error.message || "Verifique o CEP e tente novamente."
            });
        } finally {
            setLoadingCep(false);
        }
    };

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
            setLogoName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!subscriber) {
            toast({
                variant: "destructive",
                title: "Erro",
                description: "Dados do assinante não carregados.",
            });
            return;
        }

        setLoading(true);

        try {
            const address = {
                cep: formData.cep.replace(/\D/g, ''),
                street: formData.street,
                number: formData.number,
                complement: formData.complement || '',
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state
            };

            const updateData = {
                name: formData.name.trim(),
                phone: formData.phone.replace(/\D/g, ''),
                cpf_cnpj: formData.cpfCnpj.replace(/\D/g, '') || null,
                address: address,
                description: formData.description.trim() || null,
                // category_id: formData.category // Se a tabela tiver essa coluna
            };

            await subscriberService.updateSubscriber(subscriber.id, updateData);

            toast({
                variant: "success",
                title: "✅ Perfil atualizado com sucesso!",
                description: "Suas informações foram salvas.",
            });

            // Após salvar o perfil, levar o usuário para a área do assinante
            // Rota em inglês para compatibilidade com requisitos do cliente
            navigate('/subscriber-area', { replace: true });

        } catch (error) {
            console.error('Error updating subscriber:', error);
            toast({
                variant: "destructive",
                title: "Erro ao atualizar",
                description: error.message || "Não foi possível atualizar suas informações.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loadingData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">
                        {authLoading ? 'Verificando autenticação...' : 'Carregando dados...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <Helmet>
                <title>Editar Perfil - Portal Paraíso Online</title>
                <meta name="description" content="Edite suas informações e mantenha seu perfil atualizado no Portal Paraíso Online." />
            </Helmet>

            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/area-do-assinante')}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o Painel
                    </Button>
                    
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-2">
                        Editar Perfil e Página
                    </h1>
                    <p className="text-xl text-gray-600">
                        Atualize suas informações de contato, endereço e descrição.
                    </p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl text-blue-800">Informações Básicas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nome da Empresa / Profissional *</Label>
                                <Input 
                                    id="name" 
                                    required 
                                    placeholder="Ex: Supermercado Paraíso" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                />
                            </div>

                            <div>
                                <Label htmlFor="category">Categoria *</Label>
                                <Select value={formData.category} onValueChange={handleSelectChange} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o segmento..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">E-mail *</Label>
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        required 
                                        placeholder="contato@suaempresa.com" 
                                        value={formData.email} 
                                        onChange={handleInputChange}
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado</p>
                                </div>
                                <div>
                                    <Label htmlFor="phone">WhatsApp *</Label>
                                    <Input 
                                        id="phone" 
                                        required 
                                        placeholder="(38) 99999-9999" 
                                        value={formData.phone} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                                <Input 
                                    id="cpfCnpj" 
                                    placeholder="00.000.000/0000-00 ou 000.000.000-00" 
                                    value={formData.cpfCnpj} 
                                    onChange={handleInputChange} 
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Descrição da Empresa</Label>
                                <Textarea 
                                    id="description" 
                                    placeholder="Descreva sua empresa, produtos e serviços..." 
                                    value={formData.description} 
                                    onChange={handleInputChange}
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg mt-6">
                        <CardHeader>
                            <CardTitle className="text-2xl text-blue-800 flex items-center">
                                <MapPin className="mr-2" />
                                Endereço
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="cep">CEP *</Label>
                                <div className="flex space-x-2">
                                    <Input 
                                        id="cep" 
                                        required 
                                        placeholder="00000-000" 
                                        value={cepService.formatCep(formData.cep)} 
                                        onChange={handleInputChange} 
                                        maxLength={9} 
                                    />
                                    <Button 
                                        type="button" 
                                        onClick={handleCepSearch} 
                                        disabled={loadingCep}
                                    >
                                        {loadingCep ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Search className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="street">Rua *</Label>
                                <Input 
                                    id="street" 
                                    required 
                                    placeholder="Rua, Avenida, etc." 
                                    value={formData.street} 
                                    onChange={handleInputChange} 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="number">Número *</Label>
                                    <Input 
                                        id="number" 
                                        required 
                                        placeholder="123" 
                                        value={formData.number} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="complement">Complemento</Label>
                                    <Input 
                                        id="complement" 
                                        placeholder="Apto, Sala, Bloco" 
                                        value={formData.complement} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="neighborhood">Bairro *</Label>
                                <Input 
                                    id="neighborhood" 
                                    required 
                                    placeholder="Centro" 
                                    value={formData.neighborhood} 
                                    onChange={handleInputChange} 
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="city">Cidade *</Label>
                                    <Input 
                                        id="city" 
                                        required 
                                        placeholder="Sua Cidade" 
                                        value={formData.city} 
                                        onChange={handleInputChange} 
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="state">Estado *</Label>
                                    <Input 
                                        id="state" 
                                        required 
                                        placeholder="UF" 
                                        value={formData.state} 
                                        onChange={handleInputChange} 
                                        maxLength={2}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg mt-6">
                        <CardHeader>
                            <CardTitle className="text-2xl text-blue-800">Imagens</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="logo">Logotipo</Label>
                                <div className="relative mt-2">
                                    <Input 
                                        type="file" 
                                        id="logo" 
                                        accept="image/*"
                                        className="absolute w-full h-full opacity-0 cursor-pointer" 
                                        onChange={handleLogoChange} 
                                    />
                                    <div className="flex items-center justify-center w-full h-11 px-3 py-2 text-sm border rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <FileUp className="mr-2 h-4 w-4 text-gray-500" />
                                        <span className="text-gray-600 truncate">
                                            {logoName || 'Clique para enviar o logotipo'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Upload de imagens será implementado em breve
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4 mt-6">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate('/area-do-assinante')}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            size="lg" 
                            className="gradient-button font-bold text-lg py-3" 
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Salvar Alterações
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSubscriberProfile;
