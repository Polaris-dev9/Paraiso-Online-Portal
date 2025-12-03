import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Megaphone, CheckCircle, LayoutTemplate, Video, Star, Crown, Zap, Gem, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AdPlanCard = ({ plan }) => {
    return (
        <Card className="text-center p-6 rounded-lg shadow-lg bg-white overflow-hidden">
            <div className="relative h-40 mb-4">
                <img class="absolute inset-0 w-full h-full object-cover" alt={plan.alt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
            </div>
            <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
            <div className="my-4">
                <p className="text-gray-500 text-sm">Mensal</p>
                <span className="text-3xl font-bold text-blue-800">{plan.price.monthly}</span>
                <span className="text-gray-500">/mês</span>
            </div>
            <div className="my-4">
                <p className="text-gray-500 text-sm">Anual</p>
                <span className="text-2xl font-bold text-blue-800">{plan.price.annual}</span>
            </div>
            <Button asChild className="mt-4 w-full gradient-button">
                <a href="https://wa.me/5538998085771" target="_blank" rel="noopener noreferrer">Contratar</a>
            </Button>
        </Card>
    );
};

const SubscriptionPlanCard = ({ plan, billingCycle, isFeatured }) => {
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
            <Link to="/assine-agora" state={{ planName: plan.name }} className="mt-auto">
                <Button className={`w-full font-bold text-lg py-3 rounded-lg transition-all duration-300 ${isFeatured ? 'bg-yellow-400 text-blue-900 hover:bg-yellow-500' : 'gradient-button'}`}>
                    {plan.buttonText} <ArrowRight className="ml-2" size={20} />
                </Button>
            </Link>
        </motion.div>
    );
};

const Advertise = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const adPlans = [
        { title: "Banner Lateral", price: { monthly: "R$ 49,00", annual: "R$ 369,00"}, icon: LayoutTemplate, imgDesc: "Banner vertical na lateral da página de notícias", alt: "Banner lateral" },
        { title: "Banner Superior", price: { monthly: "R$ 69,90", annual: "R$ 599,00"}, icon: LayoutTemplate, imgDesc: "Banner horizontal no topo de uma seção", alt: "Banner superior" },
        { title: "Banner Rodapé", price: { monthly: "R$ 49,00", annual: "R$ 369,00"}, icon: LayoutTemplate, imgDesc: "Banner horizontal na parte inferior da página", alt: "Banner rodapé" },
        { title: "Anuncie Aqui", price: { monthly: "", annual: "" }, icon: Megaphone, imgDesc: `Imagem com texto 'ANUNCIE AQUI - PORTAL PARAISO ONLINE'`, alt: "Anuncie Aqui" },
    ];

    const subscriptionPlans = [
        { name: 'Gratuito', subtitle: 'Comece sua presença online.', price: { monthly: 'R$ 0,00', annual: 'R$ 0,00', installments: 'R$ 0,00' }, icon: Zap, buttonText: 'Cadastrar Grátis', features: ['Perfil básico no guia', 'Logo e endereço', 'Telefone (não clicável)'] },
        { name: 'Essencial', subtitle: 'Destaque-se da concorrência.', price: { monthly: 'R$ 59,90', annual: 'R$ 590,00', installments: '10x de R$ 69,00' }, icon: Star, buttonText: 'Assinar Agora', features: ['Página personalizada', 'Galeria (até 10 fotos)', 'Botão WhatsApp clicável', 'Destaque sobre gratuitos'] },
        { name: 'Premium', subtitle: 'A solução para maior alcance.', price: { monthly: 'R$ 99,90', annual: 'R$ 990,00', installments: '10x de R$ 119,00' }, icon: Crown, buttonText: 'Assinar Agora', features: ['Tudo do Essencial', 'Divulgação em redes sociais', '1 Banner Topo', '1 Banner Rodapé', '1 Banner Lateral'] },
        { name: 'Premium VIP', subtitle: 'Domine o digital.', price: { monthly: 'R$ 129,90', annual: 'R$ 1.250,00', installments: '10x de R$ 139,00' }, icon: Gem, buttonText: 'Assinar Premium VIP', features: ['Tudo do Premium', 'Loja Virtual/Catálogo', 'Banner em Vídeo VIP', 'Todos os Banners Inclusos', 'Treinamento de IA (ISA)'] }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Anuncie Aqui - Portal Paraíso Online</title>
                <meta name="description" content="Conecte sua marca com milhares de pessoas. Planos de assinatura e banners individuais." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <div className="relative h-64 rounded-lg overflow-hidden flex items-center justify-center text-white bg-blue-900">
                        <img class="absolute inset-0 w-full h-full object-cover opacity-30" alt="Fundo abstrato com formas geométricas e gradientes" src="https://images.unsplash.com/photo-1697862040431-f149c8e1ac9d" />
                        <div className="relative z-10 p-4">
                            <Megaphone className="h-12 w-12 mx-auto mb-4" />
                            <h1 className="text-4xl lg:text-5xl font-extrabold drop-shadow-lg">ANUNCIE AQUI</h1>
                            <p className="text-xl mt-2 drop-shadow-md">PORTAL PARAÍSO ONLINE</p>
                        </div>
                    </div>
                </motion.div>

                <div className="bg-white p-6 rounded-lg shadow-lg mb-12">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Nossos Planos de Assinatura</h2>
                    <div className="flex justify-center items-center mb-10 space-x-4">
                        <Label htmlFor="billing-cycle" className={`${billingCycle === 'monthly' ? 'font-bold text-blue-800' : 'text-gray-500'} transition-all`}>Pagamento Mensal</Label>
                        <Switch id="billing-cycle" checked={billingCycle === 'annual'} onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')} className="data-[state=checked]:bg-green-600"/>
                        <Label htmlFor="billing-cycle" className={`${billingCycle === 'annual' ? 'font-bold text-green-700' : 'text-gray-500'} transition-all`}>Pagamento Anual <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full ml-1">ECONOMIZE</span></Label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {subscriptionPlans.map((plan) => (
                            <SubscriptionPlanCard key={plan.name} plan={plan} billingCycle={billingCycle} isFeatured={plan.name === 'Premium VIP'} />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Banners Individuais de Alto Impacto</h2>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
                        {adPlans.map((plan, index) => (
                           <AdPlanCard key={index} plan={plan} />
                        ))}
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Advertise;