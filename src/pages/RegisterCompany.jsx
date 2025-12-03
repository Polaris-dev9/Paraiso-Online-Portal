import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Building, Send, Loader2, FileUp, CheckCircle, Star, Crown, Zap, Gem, ArrowRight, User, Mail, Phone, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subscriberService } from '@/services/subscriberService';
import { cepService } from '@/services/cepService';
import { categoryService } from '@/services/categoryService';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const PlanCard = ({ plan, onSelect, isSelected }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => onSelect(plan.name)}
            className={`cursor-pointer rounded-xl shadow-md p-6 border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50 scale-105' : 'bg-white border-transparent hover:border-blue-400'}`}
        >
            <div className="flex items-center mb-4">
                <plan.icon className={`mr-4 h-10 w-10 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                <div>
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <p className="text-sm text-gray-500">{plan.subtitle}</p>
                </div>
            </div>
            <div className="text-left mb-4">
                <span className="text-3xl font-bold">{plan.price.monthly}</span>
                <span className="text-gray-500">/mês</span>
            </div>
            <ul className="space-y-2 text-sm">
                {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </motion.div>
    );
};

// Mapear nomes de planos para valores do banco
const planMap = {
    'Gratuito': 'gratuito',
    'Essencial': 'essencial',
    'Premium': 'premium',
    'Premium VIP': 'premium_vip'
};

const RegisterCompany = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user } = useSupabaseAuth();
    
    // Estados do formulário
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoName, setLogoName] = useState('');
    const [selectedPlan, setSelectedPlan] = useState('Essencial');
    
    // Estados dos campos
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
    
    // Estados para categorias
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    
    const plans = [
        { name: 'Gratuito', subtitle: 'Presença básica', price: { monthly: 'R$ 0,00' }, icon: Zap, features: ['Perfil básico no guia', 'Exibição de endereço', 'Visibilidade padrão'] },
        { name: 'Essencial', subtitle: 'Para mais destaque', price: { monthly: 'R$ 59,90' }, icon: Star, features: ['Página personalizada', 'Botão WhatsApp', 'Galeria de fotos', '1 banner lateral'] },
        { name: 'Premium', subtitle: 'Solução completa', price: { monthly: 'R$ 99,90' }, icon: Crown, features: ['Tudo do Essencial', 'Loja virtual', 'Vídeo institucional', 'Destaque máximo'] },
        { name: 'Premium VIP', subtitle: 'Automação e IA', price: { monthly: 'R$ 129,90' }, icon: Gem, features: ['Tudo do Premium', 'Agente de IA', 'Divulgação automática', 'Consultoria'] }
    ];

    // Carregar categorias ao montar componente
    useEffect(() => {
        loadCategories();
    }, []);

    // Preencher email se usuário estiver logado
    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, email: user.email }));
        }
    }, [user]);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await categoryService.getCategoriesByType('commercial');
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            toast({
                variant: "destructive",
                title: "Erro ao carregar categorias",
                description: "Não foi possível carregar as categorias. Recarregue a página."
            });
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCepSearch = async () => {
        if (!cepService.isValidCep(formData.cep)) {
            toast({
                variant: "destructive",
                title: "CEP inválido",
                description: "Por favor, digite um CEP válido (8 dígitos)."
            });
            return;
        }

        try {
            setLoadingCep(true);
            const addressData = await cepService.getAddressByCep(formData.cep);
            
            setFormData(prev => ({
                ...prev,
                street: addressData.street || '',
                neighborhood: addressData.neighborhood || '',
                city: addressData.city || '',
                state: addressData.state || '',
                // Complemento pode vir da API, mas geralmente está vazio
                complement: addressData.complement || prev.complement || ''
                // Nota: "Número" nunca é retornado pela ViaCEP, deve ser preenchido manualmente
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

    const formatPhone = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 10) {
            return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
        } else {
            return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
        }
    };

    const formatCep = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2').replace(/-$/, '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validações
        if (!selectedPlan) {
            toast({
                title: "Selecione um plano",
                description: "Por favor, escolha um dos planos para continuar.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.name.trim()) {
            toast({
                title: "Nome obrigatório",
                description: "Por favor, preencha o nome da empresa.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.category) {
            toast({
                title: "Categoria obrigatória",
                description: "Por favor, selecione uma categoria.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.email || !formData.email.includes('@')) {
            toast({
                title: "Email inválido",
                description: "Por favor, preencha um email válido.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.phone) {
            toast({
                title: "Telefone obrigatório",
                description: "Por favor, preencha o telefone.",
                variant: "destructive",
            });
            return;
        }

        if (!formData.cep || !formData.street || !formData.city) {
            toast({
                title: "Endereço incompleto",
                description: "Por favor, preencha o CEP e endereço completo.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            // Preparar dados do endereço
            const address = {
                cep: formData.cep.replace(/\D/g, ''),
                street: formData.street,
                number: formData.number,
                complement: formData.complement || '',
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state
            };

            // Preparar dados do assinante
            const subscriberData = {
                user_id: user?.id || null,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.replace(/\D/g, ''),
                cpf_cnpj: formData.cpfCnpj.replace(/\D/g, '') || null,
                profile_type: 'empresarial',
                plan_type: planMap[selectedPlan] || 'essencial',
                payment_status: selectedPlan === 'Gratuito' ? 'free' : 'pending',
                address: address,
                description: formData.description.trim() || null,
                status: true
            };

            // Criar assinante no Supabase
            const newSubscriber = await subscriberService.createSubscriber(subscriberData);

            toast({
                title: "✅ Cadastro realizado com sucesso!",
                description: `Sua empresa "${formData.name}" foi cadastrada. Bem-vindo ao Portal Paraíso Online!`,
            });

            // Redirecionar para área do assinante
            navigate('/area-do-assinante');
            
        } catch (error) {
            console.error('Error creating subscriber:', error);
            
            // Mensagem de erro mais amigável
            let errorMessage = "Não foi possível realizar o cadastro. Tente novamente.";
            
            if (error.message) {
                if (error.message.includes('email') && error.message.includes('existe')) {
                    errorMessage = error.message;
                } else if (error.message.includes('duplicate') || error.message.includes('23505')) {
                    errorMessage = `O email "${formData.email}" já está cadastrado. Por favor, use outro email ou faça login para acessar sua conta.`;
                } else {
                    errorMessage = error.message;
                }
            }
            
            toast({
                variant: "destructive",
                title: "Erro ao cadastrar",
                description: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <Helmet>
                <title>Cadastre sua Empresa - Portal Paraíso Online</title>
                <meta name="description" content="Cadastre sua empresa no guia comercial do Portal Paraíso Online e aumente sua visibilidade com nossos planos." />
            </Helmet>

            <div className="container mx-auto max-w-7xl">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4">Sua Empresa no Mapa Digital da Cidade</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Junte-se a centenas de negócios locais. Escolha seu plano, cadastre-se em minutos e comece a vender mais.</p>
                </motion.div>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-5 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7 }}
                            className="lg:col-span-3"
                        >
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-blue-800">1. Escolha seu Plano</CardTitle>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-4">
                                    {plans.map(plan => (
                                        <PlanCard 
                                            key={plan.name}
                                            plan={plan}
                                            onSelect={setSelectedPlan}
                                            isSelected={selectedPlan === plan.name}
                                        />
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <Card className="shadow-lg sticky top-28">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-blue-800">2. Preencha os Dados</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="company-name">Nome da Empresa *</Label>
                                        <Input 
                                            id="company-name" 
                                            required 
                                            placeholder="Ex: Supermercado Paraíso"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="category">Categoria *</Label>
                                        <Select 
                                            required
                                            value={formData.category}
                                            onValueChange={(value) => handleInputChange('category', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingCategories ? "Carregando..." : "Selecione o segmento..."} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.length === 0 && !loadingCategories ? (
                                                    <div className="p-4 text-center text-gray-500 text-sm">
                                                        Nenhuma categoria disponível
                                                    </div>
                                                ) : (
                                                    categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))
                                                )}
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
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">WhatsApp *</Label>
                                            <Input 
                                                id="phone" 
                                                required 
                                                placeholder="(38) 99999-9999"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="cpf-cnpj">CPF/CNPJ</Label>
                                        <Input 
                                            id="cpf-cnpj" 
                                            placeholder="00.000.000/0000-00"
                                            value={formData.cpfCnpj}
                                            onChange={(e) => handleInputChange('cpfCnpj', e.target.value)}
                                        />
                                    </div>

                                    {/* Campo CEP com busca automática */}
                                    <div>
                                        <Label htmlFor="cep">CEP *</Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                id="cep" 
                                                required 
                                                placeholder="00000-000"
                                                value={formData.cep}
                                                onChange={(e) => handleInputChange('cep', formatCep(e.target.value))}
                                                maxLength={9}
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleCepSearch}
                                                disabled={loadingCep || !cepService.isValidCep(formData.cep)}
                                                variant="outline"
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
                                            placeholder="Nome da rua"
                                            value={formData.street}
                                            onChange={(e) => handleInputChange('street', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="number">Número *</Label>
                                            <Input 
                                                id="number" 
                                                required 
                                                placeholder="123"
                                                value={formData.number}
                                                onChange={(e) => handleInputChange('number', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="complement">Complemento</Label>
                                            <Input 
                                                id="complement" 
                                                placeholder="Apto, Sala, etc"
                                                value={formData.complement}
                                                onChange={(e) => handleInputChange('complement', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="neighborhood">Bairro *</Label>
                                        <Input 
                                            id="neighborhood" 
                                            required 
                                            placeholder="Nome do bairro"
                                            value={formData.neighborhood}
                                            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">Cidade *</Label>
                                            <Input 
                                                id="city" 
                                                required 
                                                placeholder="Nome da cidade"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange('city', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">Estado *</Label>
                                            <Input 
                                                id="state" 
                                                required 
                                                placeholder="MG"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                                                maxLength={2}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descrição da Empresa</Label>
                                        <Textarea 
                                            id="description" 
                                            placeholder="Descreva sua empresa..."
                                            rows={3}
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="logo">Logotipo</Label>
                                        <div className="relative">
                                            <Input 
                                                type="file" 
                                                id="logo" 
                                                accept="image/*"
                                                className="absolute w-full h-full opacity-0 cursor-pointer" 
                                                onChange={handleLogoChange} 
                                            />
                                            <div className="flex items-center justify-center w-full h-11 px-3 py-2 text-sm border rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <FileUp className="mr-2 h-4 w-4 text-gray-500" />
                                                <span className="text-gray-600 truncate">{logoName || 'Clique para enviar o logotipo'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-2">
                                        <Checkbox id="terms" required />
                                        <Label htmlFor="terms" className="text-sm">Li e aceito os <a href="/termos" target="_blank" className="text-blue-600 hover:underline">termos de uso</a> e <a href="/privacidade" target="_blank" className="text-blue-600 hover:underline">política de privacidade</a>.</Label>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full gradient-button font-bold text-lg py-3 mt-2" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                                Cadastrando...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-5 w-5" />
                                                Finalizar Cadastro
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-gray-500 pt-2">
                                        Você será redirecionado para o painel do assinante para completar o pagamento e a configuração da sua página.
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterCompany;
