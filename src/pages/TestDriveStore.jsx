import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Store, Package, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TestDriveStore = () => {
    return (
        <div className="bg-gray-50">
            <Helmet>
                <title>Test Drive da Sua Loja Online</title>
                <meta name="description" content="Experimente nossa plataforma de e-commerce e crie uma loja virtual de demonstração. Cadastre produtos, gerencie estoque e simule vendas sem compromisso." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <header className="relative py-20 md:py-32 bg-gradient-to-r from-blue-700 to-indigo-900 text-white overflow-hidden">
                    <div className="container mx-auto px-6 text-center z-10 relative">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4"
                        >
                            Construa Sua Loja dos Sonhos, Sem Riscos.
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="text-lg md:text-xl max-w-3xl mx-auto text-blue-200 mb-8"
                        >
                            Experimente o poder da nossa plataforma de e-commerce. Crie uma loja de demonstração completa e veja seu negócio decolar.
                        </motion.p>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
                        >
                            <Button asChild size="lg" className="bg-amber-400 text-blue-900 font-bold hover:bg-amber-500 text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                                <Link to="/admin/loja">
                                    <Rocket className="mr-3" />
                                    Iniciar Test Drive Gratuito
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                </header>

                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Como Funciona o Test Drive?</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">Em poucos passos, você terá uma simulação completa da sua futura loja online.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="p-8 bg-white rounded-xl shadow-lg hover-lift">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-700 mx-auto mb-6">
                                    <Store size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Crie Sua Loja</h3>
                                <p className="text-gray-600">Use nosso construtor "arraste e solte" ou escolha um modelo pronto para dar a cara da sua marca à loja.</p>
                            </div>
                            <div className="p-8 bg-white rounded-xl shadow-lg hover-lift">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-700 mx-auto mb-6">
                                    <Package size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Cadastre Produtos</h3>
                                <p className="text-gray-600">Adicione seus produtos com fotos, descrições e preços. Simule o controle de estoque de forma intuitiva.</p>
                            </div>
                            <div className="p-8 bg-white rounded-xl shadow-lg hover-lift">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-amber-100 text-amber-700 mx-auto mb-6">
                                    <LineChart size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Simule Vendas</h3>
                                <p className="text-gray-600">Veja como seria a gestão de pedidos, acompanhe o desempenho e sinta a experiência de vender online.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white py-16 md:py-24">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Pronto para Transformar a Simulação em Realidade?</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto mb-8">
                            Gostou do que viu? Ao final do Test Drive, você pode converter sua loja de demonstração em uma loja real com um clique, contratando um de nossos planos. Todos os seus produtos e layouts serão mantidos!
                        </p>
                        <Button asChild size="lg" className="bg-green-600 text-white font-bold hover:bg-green-700 text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300">
                             <Link to="/upgrade">
                                Ver Planos e Preços
                            </Link>
                        </Button>
                    </div>
                </section>
            </motion.div>
        </div>
    );
};

export default TestDriveStore;