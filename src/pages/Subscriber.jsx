import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { User, Edit, BarChart2, Star, Info, ShieldCheck, LogOut, ShoppingBag, ArrowRight, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { subscriberService } from '@/services/subscriberService';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const SubscriberPage = () => {
    const { user, signOut } = useSupabaseAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [subscriber, setSubscriber] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubscriber = async () => {
            if (!user) {
                setSubscriber(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Buscar assinante por user_id primeiro
                let subscriber = await subscriberService.getSubscriberByUserId(user.id);

                // Se não encontrou por user_id, tentar por email
                if (!subscriber && user.email) {
                    const { data: emailSubscriber, error: emailError } = await supabase
                        .from('subscribers')
                        .select('*')
                        .ilike('email', user.email)
                        .maybeSingle();
                    
                    if (!emailError && emailSubscriber) {
                        subscriber = emailSubscriber;
                        // Se encontrou por email mas não tem user_id, atualizar para vincular
                        if (!subscriber.user_id && user.id) {
                            await subscriberService.updateSubscriber(subscriber.id, {
                                user_id: user.id
                            });
                            subscriber.user_id = user.id;
                        }
                    }
                }

                if (subscriber) {
                    setSubscriber(subscriber);
                } else {
                    // Se não encontrou, criar um assinante básico (plano gratuito)
                    try {
                        subscriber = await subscriberService.createSubscriber({
                            user_id: user.id,
                            name: user.user_metadata?.full_name || 'Novo Assinante',
                            email: user.email,
                            profile_type: 'empresarial',
                            plan_type: 'gratuito',
                            payment_status: 'free',
                            status: true
                        });
                        setSubscriber(subscriber);
                    } catch (createError) {
                        console.error('Error creating subscriber:', createError);
                        // Se falhar ao criar (ex: email duplicado), tentar buscar novamente
                        if (user.email) {
                            const { data: retrySubscriber } = await supabase
                                .from('subscribers')
                                .select('*')
                                .ilike('email', user.email)
                                .maybeSingle();
                            if (retrySubscriber) {
                                // Atualizar user_id se necessário
                                if (!retrySubscriber.user_id && user.id) {
                                    await subscriberService.updateSubscriber(retrySubscriber.id, {
                                        user_id: user.id
                                    });
                                    retrySubscriber.user_id = user.id;
                                }
                                setSubscriber(retrySubscriber);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading subscriber:', error);
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar suas informações. Tente recarregar a página.",
                });
            } finally {
                setLoading(false);
            }
        };

        loadSubscriber();
    }, [user, toast]);

    const handleSignOut = async () => {
        await signOut();
        toast({ 
            variant: "success",
            title: 'Logout efetuado com sucesso!' 
        });
        navigate('/');
    };

    const handleToast = (feature) => {
        toast({
            title: `🚧 ${feature}`,
            description: "Este recurso está em desenvolvimento. Volte em breve!",
        });
    };

    if (!user || loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">{!user ? 'Carregando...' : 'Carregando seus dados...'}</p>
                </div>
            </div>
        );
    }

    if (!subscriber && !loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Criando seu perfil...</p>
                </div>
            </div>
        );
    }

    // Mapear plan_type para exibição
    const planDisplayMap = {
        'gratuito': 'Gratuito',
        'essencial': 'Essencial',
        'premium': 'Premium',
        'premium_vip': 'Premium VIP'
    };

    const planDisplay = planDisplayMap[subscriber.plan_type] || subscriber.plan_type || 'Gratuito';
    // Loja Virtual disponível para TODOS os planos (gratuito, essencial, premium, premium_vip)
    const hasStoreFeature = subscriber.plan_type === 'gratuito' ||
                            subscriber.plan_type === 'essencial' ||
                            subscriber.plan_type === 'premium' ||
                            subscriber.plan_type === 'premium_vip';

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Painel do Assinante - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Painel do Assinante</h1>
                        <p className="text-gray-700 mt-2">Olá, <span className="font-semibold">{subscriber.name}</span>! Gerencie sua presença no portal aqui.</p>
                    </div>
                    <Button onClick={handleSignOut} variant="destructive" className="bg-red-600"><LogOut className="mr-2" size={16} /> Sair</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="md:col-span-2 bg-white border-gray-400">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-gray-900">Minha Assinatura</CardTitle>
                            <Badge className={`${subscriber.plan_type === 'premium_vip' ? 'bg-yellow-400 text-black' : 'bg-blue-600 text-white'}`}>{planDisplay}</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">Explore os recursos do seu plano e gerencie suas informações.</p>
                            {subscriber.plan_type !== 'premium_vip' && (
                                <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-md">
                                    <h4 className="font-bold text-yellow-800">Dê um upgrade na sua conta!</h4>
                                    <p className="text-yellow-700 text-sm">Desbloqueie a Loja Virtual e outros recursos exclusivos com o plano Premium VIP.</p>
                                    <Button 
                                        size="sm" 
                                        className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                                        onClick={() => navigate('/upgrade')}
                                    >
                                        Ver Planos <ArrowRight className="ml-2" size={14} />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-gray-400">
                        <CardHeader><CardTitle className="text-gray-900">Status da Conta</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-gray-700 flex items-center gap-2">
                                <span className={`h-3 w-3 rounded-full ${subscriber.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {subscriber.status ? 'Ativo' : 'Inativo'}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hasStoreFeature && (
                         <motion.div whileHover={{ scale: 1.05 }}>
                            <Link to="/dashboard/loja">
                                <Card className="bg-blue-600 text-white hover:bg-blue-700 transition-colors h-full flex flex-col">
                                    <CardHeader><CardTitle className="flex items-center"><ShoppingBag className="mr-3" /> Minha Loja Virtual</CardTitle></CardHeader>
                                    <CardContent className="flex-grow">
                                        <p>Gerencie seus produtos, visualize pedidos e configure sua loja no marketplace.</p>
                                    </CardContent>
                                    <CardContent><p className="font-bold flex items-center">Acessar Dashboard da Loja <ArrowRight className="ml-2"/></p></CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/editar-perfil')}>
                        <Card className="cursor-pointer bg-white border-gray-400 h-full flex flex-col">
                            <CardHeader><CardTitle className="flex items-center text-gray-900"><Edit className="mr-3" /> Editar Perfil e Página</CardTitle></CardHeader>
                            <CardContent className="flex-grow"><p className="text-gray-700">Atualize suas informações de contato, fotos, descrição e horário de funcionamento.</p></CardContent>
                        </Card>
                    </motion.div>
                     <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/relatorios-desempenho')}>
                        <Card className="cursor-pointer bg-white border-gray-400 h-full flex flex-col">
                            <CardHeader><CardTitle className="flex items-center text-gray-900"><BarChart2 className="mr-3" /> Relatórios de Desempenho</CardTitle></CardHeader>
                            <CardContent className="flex-grow"><p className="text-gray-700">Veja quantas pessoas visualizaram sua página, seus produtos e entraram em contato.</p></CardContent>
                        </Card>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/contrato-assinante')}>
                        <Card className="cursor-pointer bg-white border-gray-400 h-full flex flex-col">
                            <CardHeader><CardTitle className="flex items-center text-gray-900"><FileText className="mr-3" /> Meus Contratos</CardTitle></CardHeader>
                            <CardContent className="flex-grow"><p className="text-gray-700">Visualize, renove e gerencie seus contratos de assinatura.</p></CardContent>
                        </Card>
                    </motion.div>
                    {subscriber.plan_type !== 'premium_vip' && (
                        <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/upgrade')}>
                            <Card className="cursor-pointer bg-gradient-to-br from-yellow-400 to-yellow-600 text-white h-full flex flex-col border-yellow-500">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Sparkles className="mr-3" /> Upgrade de Plano
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-yellow-50">Desbloqueie mais recursos e alcance mais clientes. Escolha o plano ideal para o seu negócio!</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                    {subscriber.slug ? (
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <a 
                                href={subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free' ? '#' : `/empresa/${subscriber.slug}`}
                                target={subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free' ? undefined : '_blank'}
                                rel={subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free' ? undefined : 'noopener noreferrer'}
                                onClick={(e) => {
                                    if (subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free') {
                                        e.preventDefault();
                                        toast({
                                            title: "Acesso Restrito",
                                            description: "O plano gratuito não permite visualizar sua página pública. Faça upgrade para um plano pago.",
                                            variant: "default"
                                        });
                                    }
                                }}
                                className={`block h-full ${(subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free') ? 'cursor-not-allowed' : ''}`}
                            >
                                <Card className={`cursor-pointer bg-green-600 text-white hover:bg-green-700 transition-colors h-full flex flex-col ${(subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free') ? 'opacity-50' : ''}`}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <ExternalLink className="mr-3" /> Ver Minha Página Pública
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p>Veja como sua página aparece para os visitantes. Compartilhe seu link com clientes!</p>
                                        {(subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free') && (
                                            <p className="text-yellow-200 text-sm mt-2 font-semibold">⚠️ Disponível apenas em planos pagos</p>
                                        )}
                                    </CardContent>
                                    {!(subscriber.plan_type?.toLowerCase() === 'gratuito' || subscriber.plan_type?.toLowerCase() === 'free') && (
                                        <CardContent>
                                            <p className="text-sm opacity-90 mt-2">Abre em nova aba</p>
                                        </CardContent>
                                    )}
                                </Card>
                            </a>
                        </motion.div>
                    ) : (
                        <motion.div whileHover={{ scale: 1.05 }} onClick={() => navigate('/editar-perfil')}>
                            <Card className="cursor-pointer bg-gray-100 border-gray-300 h-full flex flex-col opacity-75">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-gray-600">
                                        <ExternalLink className="mr-3" /> Página Pública
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-gray-600">
                                        Salve seu perfil primeiro para gerar sua página pública e compartilhar com clientes.
                                    </p>
                                </CardContent>
                                <CardContent>
                                    <p className="text-sm text-gray-500">Clique para editar perfil</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default SubscriberPage;