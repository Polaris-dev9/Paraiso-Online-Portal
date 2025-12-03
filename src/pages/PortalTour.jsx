import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Map, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const tourSteps = [
    {
        title: "Bem-vindo ao Portal Paraíso Online!",
        description: "Vamos fazer um tour rápido pelas nossas principais funcionalidades para você aproveitar ao máximo tudo o que oferecemos.",
        image: "https://images.unsplash.com/photo-1529181931838-f3b1451bba09?w=800&h=500&fit=crop",
        targetElement: "body"
    },
    {
        title: "Guias Comercial e Profissional",
        description: "Aqui você encontra todas as empresas e profissionais da cidade. Use a busca e os filtros para achar exatamente o que precisa.",
        image: "https://images.unsplash.com/photo-1556742212-0b2804f6a62f?w=800&h=500&fit=crop",
        link: "/guia-comercial"
    },
    {
        title: "Notícias e Eventos",
        description: "Fique por dentro de tudo que acontece na região. Notícias atualizadas e uma agenda completa de eventos.",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=500&fit=crop",
        link: "/noticias"
    },
    {
        title: "ParaísoShop: Nosso Marketplace",
        description: "Compre produtos e serviços diretamente das lojas locais. Apoie o comércio da nossa cidade sem sair de casa.",
        image: "https://images.unsplash.com/photo-1570857502809-0818b874388e?w=800&h=500&fit=crop",
        link: "/loja"
    },
    {
        title: "Vagas e Currículos",
        description: "Empresas podem anunciar vagas e profissionais podem cadastrar seus currículos. Conectamos talentos e oportunidades.",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=500&fit=crop",
        link: "/vagas"
    },
    {
        title: "Anuncie e Cresça!",
        description: "Pronto para explorar? Clique no botão abaixo para começar a navegar ou anuncie sua empresa para ter acesso a todos os benefícios.",
        image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&h=500&fit=crop",
        link: "/anuncie"
    }
];

const PortalTour = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const nextStep = () => {
        setCurrentStep(prev => (prev + 1) % tourSteps.length);
    };

    const prevStep = () => {
        setCurrentStep(prev => (prev - 1 + tourSteps.length) % tourSteps.length);
    };

    const step = tourSteps[currentStep];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
            <Helmet>
                <title>Tour pelo Portal - Portal Paraíso Online</title>
                <meta name="description" content="Faça um tour guiado pelo Portal Paraíso Online e descubra todas as nossas funcionalidades." />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
            >
                <div className="md:w-1/2 relative">
                    <AnimatePresence initial={false}>
                        <motion.img
                            key={currentStep}
                            src={step.image}
                            alt={step.title}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-64 md:h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute top-4 right-4">
                        <Link to="/">
                            <Button size="icon" variant="ghost" className="bg-white/50 hover:bg-white/80 rounded-full">
                                <X size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                        <p className="text-sm font-bold text-blue-600 mb-2">PASSO {currentStep + 1} DE {tourSteps.length}</p>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h2>
                        <p className="text-gray-600 leading-relaxed mb-8">{step.description}</p>
                    </div>
                    
                    <div className="space-y-4">
                        {currentStep === tourSteps.length - 1 ? (
                            <Link to="/anuncie" className="w-full">
                                <Button size="lg" className="w-full gradient-gold text-white">Quero Anunciar!</Button>
                            </Link>
                        ) : (
                            <Link to={step.link} className="w-full">
                                <Button size="lg" className="w-full gradient-royal text-white">Explorar Seção</Button>
                            </Link>
                        )}
                        <div className="flex justify-between items-center">
                            <Button onClick={prevStep} variant="outline" disabled={currentStep === 0}>
                                <ArrowLeft className="mr-2" size={16} /> Anterior
                            </Button>
                            <div className="flex gap-2">
                                {tourSteps.map((_, index) => (
                                    <div key={index} className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                ))}
                            </div>
                            <Button onClick={nextStep} variant="outline" disabled={currentStep === tourSteps.length - 1}>
                                Próximo <ArrowRight className="ml-2" size={16} />
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PortalTour;