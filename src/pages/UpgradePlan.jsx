import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, Gem, Zap, Star, Crown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import planService, { PLAN_DEFINITIONS } from '@/services/planService';
import subscriberService from '@/services/subscriberService';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const UpgradePlan = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useSupabaseAuth();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        const loadCurrentPlan = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const subscriber = await subscriberService.getSubscriberByUserId(user.id);
                if (subscriber) {
                    setCurrentPlan(subscriber.plan_type || 'gratuito');
                }
            } catch (error) {
                console.error('Error loading current plan:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCurrentPlan();
    }, [user]);

    const handleUpgrade = async (targetPlanId) => {
        if (!user) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'Você precisa estar logado para fazer upgrade.'
            });
            navigate('/area-do-assinante');
            return;
        }

        try {
            setUpgrading(true);

            // Buscar assinante
            const subscriber = await subscriberService.getSubscriberByUserId(user.id);
            if (!subscriber) {
                throw new Error('Assinante não encontrado');
            }

            // Validar upgrade
            const validation = planService.validateUpgrade(
                currentPlan || 'gratuito',
                targetPlanId
            );

            if (!validation.valid) {
                toast({
                    variant: 'destructive',
                    title: 'Upgrade não disponível',
                    description: validation.reason
                });
                return;
            }

            // Executar upgrade
            const result = await planService.upgradePlan(
                subscriber.id,
                targetPlanId,
                billingCycle
            );

            toast({
                title: 'Upgrade realizado!',
                description: 'Seu plano foi atualizado com sucesso. Aguarde confirmação do pagamento para ativação.',
            });

            // Redirecionar para página de contratos
            navigate('/contrato-assinante');

        } catch (error) {
            console.error('Error upgrading plan:', error);
            toast({
                variant: 'destructive',
                title: 'Erro ao fazer upgrade',
                description: error.message || 'Não foi possível realizar o upgrade. Tente novamente.'
            });
        } finally {
            setUpgrading(false);
        }
    };

    const plans = planService.getAllPlans();
    const planIcons = {
        gratuito: Zap,
        essencial: Star,
        premium: Crown,
        premium_vip: Gem
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando planos...</p>
                </div>
            </div>
        );
    }

    const getPlanIcon = (planId) => {
        const IconComponent = planIcons[planId] || Star;
        return IconComponent;
    };

    const isCurrentPlan = (planId) => {
        return currentPlan === planId;
    };

    const canUpgrade = (planId) => {
        if (!currentPlan) return true;
        return planService.isUpgrade(currentPlan, planId);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Upgrade de Plano - Portal Paraíso Online</title>
                <meta name="description" content="Escolha o plano ideal para o seu negócio e alcance mais clientes no Portal Paraíso Online." />
            </Helmet>

            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-8"
                >
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/subscriber-area')}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2" /> Voltar ao Painel
                    </Button>
                    <div className="text-center">
                        <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                            <Sparkles className="mr-3 text-yellow-500" />
                            Upgrade de Plano
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Escolha o plano ideal para o seu negócio e alcance milhares de novos clientes.
                        </p>
                    </div>
                </motion.div>

                {/* Plano Atual */}
                {currentPlan && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Plano Atual</p>
                                        <h3 className="text-2xl font-bold text-blue-900">
                                            {PLAN_DEFINITIONS[currentPlan]?.name || currentPlan}
                                        </h3>
                                    </div>
                                    <Badge className="bg-blue-600 text-white px-4 py-2">
                                        Ativo
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Seleção de Ciclo de Cobrança */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex justify-center items-center">
                        <div className="bg-white border-2 border-gray-300 rounded-full px-8 py-5 shadow-lg">
                            <Tabs value={billingCycle} onValueChange={setBillingCycle} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-auto">
                                    <TabsTrigger 
                                        value="monthly" 
                                        className="text-base font-semibold py-3 px-6 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-bold data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 transition-all"
                                    >
                                        Mensal
                                    </TabsTrigger>
                                    <TabsTrigger 
                                        value="annual" 
                                        className="text-base font-semibold py-3 px-6 data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-bold data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 transition-all"
                                    >
                                        Anual
                                        <span className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">ECONOMIZE</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </motion.div>

                {/* Cards de Planos */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {plans.map((plan) => {
                        const IconComponent = getPlanIcon(plan.id);
                        const price = planService.getPrice(plan.id, billingCycle);
                        const isCurrent = isCurrentPlan(plan.id);
                        const canUpgradeToThis = canUpgrade(plan.id);
                        const isFeatured = plan.id === 'premium';

                        return (
                            <Card 
                                key={plan.id}
                                className={`flex flex-col h-full transition-all hover:shadow-xl ${
                                    isFeatured ? 'border-yellow-400 border-2 scale-105' : ''
                                } ${isCurrent ? 'border-blue-600 border-2' : ''}`}
                            >
                                {isFeatured && (
                                    <div className="bg-yellow-400 text-center py-2">
                                        <span className="text-xs font-bold text-gray-900 flex items-center justify-center gap-1">
                                            <Gem size={14} /> MAIS POPULAR
                                        </span>
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-center justify-center mb-2">
                                        <IconComponent className="w-8 h-8 text-blue-600 mr-2" />
                                        <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    </div>
                                    <CardDescription className="text-center">
                                        {plan.subtitle}
                                    </CardDescription>
                                    {isCurrent && (
                                        <Badge className="mx-auto mt-2 bg-blue-600">
                                            Seu Plano Atual
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <div className="text-center mb-6">
                                        <p className="text-4xl font-bold text-blue-900">
                                            {planService.formatPrice(price)}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {billingCycle === 'monthly' ? 'por mês' : 'por ano'}
                                        </p>
                                        {billingCycle === 'annual' && plan.prices.annual > 0 && (
                                            <p className="text-green-600 text-sm mt-1 font-semibold">
                                                Economize {planService.formatPrice(
                                                    (plan.prices.monthly * 12) - plan.prices.annual
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-6 flex-grow">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start">
                                                <Check className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                                                <span className="text-gray-700 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => handleUpgrade(plan.id)}
                                        disabled={isCurrent || !canUpgradeToThis || upgrading}
                                        className={`w-full font-bold ${
                                            isCurrent
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : isFeatured
                                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        {upgrading ? (
                                            <>Processando...</>
                                        ) : isCurrent ? (
                                            <>Plano Atual</>
                                        ) : !canUpgradeToThis ? (
                                            <>Downgrade não disponível</>
                                        ) : (
                                            <>Escolher {plan.name}</>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </motion.div>

                {/* Informações Adicionais */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-12 text-center text-gray-600"
                >
                    <p className="text-sm">
                        💡 <strong>Dica:</strong> O plano anual oferece o melhor custo-benefício com economia de até 2 meses!
                    </p>
                    <p className="text-sm mt-2">
                        Após o upgrade, um novo contrato será criado e você será redirecionado para a página de contratos.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default UpgradePlan;