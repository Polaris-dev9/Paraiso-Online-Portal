import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Check, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const UpgradePlan = () => {

    const plans = [
        {
            name: 'Mensal',
            price: '49,90',
            period: '/mês',
            description: 'Presença online completa com flexibilidade.',
            features: [
                'Página Personalizada Completa',
                'Botão de WhatsApp Clicável',
                'Galeria de Fotos (até 10)',
                'Destaque sobre os gratuitos',
            ],
            featured: false,
        },
        {
            name: 'Anual',
            price: '499,90',
            period: '/ano',
            description: 'A solução definitiva com o melhor custo-benefício.',
            features: [
                'Tudo do Mensal, e mais:',
                'Loja Virtual Completa no Marketplace',
                'Geração de Catálogos em PDF',
                'Vídeo Institucional na Página',
                'Destaque máximo nas buscas',
                '2 meses de desconto!',
            ],
            featured: true,
        },
        {
            name: 'Trimestral',
            price: '134,90',
            period: '/trimestre',
            description: 'Mais tempo de visibilidade com desconto.',
            features: [
                'Todos os benefícios do plano Mensal',
                'Desconto por contratar 3 meses',
                'Ideal para campanhas sazonais',
            ],
            featured: false,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Faça um Upgrade - Portal Paraíso Online</title>
                <meta name="description" content="Turbine sua visibilidade! Conheça os planos de assinatura do Portal Paraíso Online e escolha a melhor opção para o seu negócio." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <Sparkles className="inline-block mr-3 text-yellow-500" />
                        Turbine sua Visibilidade!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Seu negócio merece mais. Escolha o plano que mais combina com seus objetivos e alcance milhares de novos clientes.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
                >
                    {plans.map((plan) => (
                        <div 
                            key={plan.name} 
                            className={`bg-white rounded-lg shadow-lg p-8 flex flex-col border-t-4 transition-transform hover:-translate-y-2 ${plan.featured ? 'border-yellow-400 scale-105 shadow-2xl' : 'border-blue-600'}`}
                        >
                            {plan.featured && <div className="text-center mb-4"><span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full flex items-center justify-center gap-2"><Gem size={14}/> MAIS POPULAR</span></div>}
                            
                            <h3 className="text-2xl font-bold text-center text-blue-900 mb-2">{plan.name}</h3>
                            <p className="text-center text-gray-500 mb-6 flex-grow">{plan.description}</p>
                            
                            <p className="text-center mb-6">
                                <span className="text-4xl font-bold">R$ {plan.price}</span>
                                <span className="text-gray-600">{plan.period}</span>
                            </p>
                            
                            <ul className="space-y-4 mb-8">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <Check className="text-green-500 mr-3 mt-1 flex-shrink-0" size={18} />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link to={'/checkout'} state={{ planName: plan.name, planPrice: plan.price }}>
                                    <Button className={`w-full font-bold ${plan.featured ? 'gradient-gold text-white' : 'gradient-royal text-white'}`}>
                                        Contratar {plan.name}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default UpgradePlan;