import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Star, Crown, Zap, Gem, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PlanCard = ({ plan, billingCycle, isFeatured }) => {
    const price = billingCycle === 'annual' ? plan.price.annual : plan.price.monthly;
    const period = billingCycle === 'annual' ? `/ano ou ${plan.price.installments}` : '/mês';

    return (
        <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            className={`relative flex flex-col rounded-xl shadow-lg p-6 border-t-4 ${isFeatured ? 'bg-blue-900 text-white border-yellow-400' : 'bg-white text-gray-800 border-blue-600'}`}
        >
            {isFeatured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-yellow-400 text-blue-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">Mais Popular</span>
                </div>
            )}
            <div className="text-center mb-6">
                <plan.icon className={`mx-auto mb-4 h-12 w-12 ${isFeatured ? 'text-yellow-400' : 'text-blue-600'}`} />
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className={`text-sm mt-1 ${isFeatured ? 'text-gray-300' : 'text-gray-500'}`}>{plan.subtitle}</p>
            </div>
            <div className="text-center mb-6">
                <span className="text-4xl font-bold">{price}</span>
                <span className={`text-lg ${isFeatured ? 'text-gray-300' : 'text-gray-500'}`}>{period}</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <CheckCircle className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <Link to="/area-do-assinante" state={{ planName: plan.name }} className="mt-auto">
                <Button className={`w-full font-bold text-lg py-3 rounded-lg transition-all duration-300 ${isFeatured ? 'bg-yellow-400 text-blue-900 hover:bg-yellow-500' : 'gradient-button'}`}>
                    {plan.buttonText} <ArrowRight className="ml-2" size={20} />
                </Button>
            </Link>
        </motion.div>
    );
};

const SubscribeNow = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const plans = [
        { name: 'Gratuito', subtitle: 'Comece sua presença online.', price: { monthly: 'R$ 0,00', annual: 'R$ 0,00', installments: 'R$ 0,00' }, icon: Zap, buttonText: 'Cadastrar Grátis', features: ['Perfil básico no guia', 'Logo e endereço', 'Telefone (não clicável)'] },
        { name: 'Essencial', subtitle: 'Destaque-se da concorrência.', price: { monthly: 'R$ 59,90', annual: 'R$ 590,00', installments: '10x de R$ 69,00' }, icon: Star, buttonText: 'Assinar Agora', features: ['Página personalizada', 'Galeria (até 10 fotos)', 'Botão WhatsApp clicável', 'Destaque sobre gratuitos'] },
        { name: 'Premium', subtitle: 'A solução para maior alcance.', price: { monthly: 'R$ 99,90', annual: 'R$ 990,00', installments: '10x de R$ 119,00' }, icon: Crown, buttonText: 'Assinar Agora', features: ['Tudo do Essencial', 'Divulgação em redes sociais', '1 Banner Topo', '1 Banner Rodapé', '1 Banner Lateral'] },
        { name: 'Premium VIP', subtitle: 'Domine o digital.', price: { monthly: 'R$ 129,90', annual: 'R$ 1.250,00', installments: '10x de R$ 139,00' }, icon: Gem, buttonText: 'Assinar Premium VIP', features: ['Tudo do Premium', 'Loja Virtual/Catálogo', 'Banner em Vídeo VIP', 'Todos os Banners Inclusos', 'Treinamento de IA (ISA)'] }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Assine Agora - Portal Paraíso Online</title>
                <meta name="description" content="Escolha o plano de assinatura ideal para sua empresa. Planos Gratuito, Essencial, Premium e Premium VIP." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">💡 Impulsione seu Negócio Agora!</h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto">Escolha o plano perfeito para você e conecte-se com milhares de clientes.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                     <div className="flex justify-center items-center mb-10 space-x-4">
                        <Label htmlFor="billing-cycle" className={`${billingCycle === 'monthly' ? 'font-bold text-blue-800' : 'text-gray-500'} transition-all`}>Pagamento Mensal</Label>
                        <Switch id="billing-cycle" checked={billingCycle === 'annual'} onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')} className="data-[state=checked]:bg-green-600"/>
                        <Label htmlFor="billing-cycle" className={`${billingCycle === 'annual' ? 'font-bold text-green-700' : 'text-gray-500'} transition-all`}>Pagamento Anual <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full ml-1">ECONOMIZE</span></Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {plans.map((plan) => (
                            <PlanCard key={plan.name} plan={plan} billingCycle={billingCycle} isFeatured={plan.name === 'Premium VIP'} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SubscribeNow;