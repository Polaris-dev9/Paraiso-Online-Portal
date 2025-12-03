import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BookOpen, Film, Users, ShoppingCart, Megaphone, Download, FileText, Brush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Tutorial = () => {
    const { toast } = useToast();

    const handleDownload = (material) => {
        toast({
            title: `Download Iniciado`,
            description: `O download de "${material}" começará em breve. (Funcionalidade em desenvolvimento)`,
        });
    };

    const handleWatch = (tutorial) => {
        toast({
            title: "▶️ Assistindo Tutorial",
            description: `O vídeo sobre "${tutorial}" será carregado em breve.`,
        });
    }

    const tutorials = [
        { icon: Users, title: "Gerenciando sua Página", description: "Aprenda a atualizar suas informações de contato, galeria de fotos, vídeo e descrição do seu negócio para atrair mais clientes." },
        { icon: ShoppingCart, title: "Sua Loja no ParaísoShop", description: "Um guia completo para cadastrar produtos, gerenciar estoque, configurar preços e acompanhar seus pedidos no nosso marketplace." },
        { icon: Megaphone, title: "Criando Anúncios Eficazes", description: "Dicas de como criar banners e ofertas que chamam a atenção e geram mais cliques e vendas para sua empresa." },
    ];

    const materials = [
        { icon: Brush, title: "Artes Editáveis (Canva)", description: "Templates prontos para posts em redes sociais, stories e status. Personalize com sua marca e divulgue!", action: "Acessar Templates", actionType: "link" },
        { icon: FileText, title: "Scripts de Vendas", description: "Modelos de mensagens para abordar clientes via WhatsApp e fechar mais negócios.", action: "Baixar Scripts", actionType: "download" },
        { icon: BookOpen, title: "E-book: Marketing Local", description: "Um guia completo com estratégias de marketing digital focadas no comércio da nossa cidade.", action: "Baixar E-book", actionType: "download" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <Helmet>
                <title>Tutorial e Materiais - Portal Paraíso Online</title>
                <meta name="description" content="Aprenda a usar todas as ferramentas do portal e acesse materiais exclusivos para impulsionar seu negócio." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                        <BookOpen className="mr-3" /> Tutorial & Materiais
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Aprenda a extrair o máximo do nosso portal e acesse materiais exclusivos para assinantes.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Tutoriais em Vídeo</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {tutorials.map((tutorial, index) => {
                            const Icon = tutorial.icon;
                            return (
                                <div key={index} className="bg-white rounded-lg shadow-lg p-8 text-center hover-lift flex flex-col">
                                    <div className="w-16 h-16 gradient-royal rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Icon className="text-white" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{tutorial.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{tutorial.description}</p>
                                    <Button onClick={() => handleWatch(tutorial.title)} variant="outline" className="mt-auto">
                                        <Film className="mr-2" size={16} /> Assistir Tutorial
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 lg:p-12"
                >
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Materiais Exclusivos para Assinantes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {materials.map((material, index) => {
                            const Icon = material.icon;
                            return (
                                <div key={index} className="bg-white/20 backdrop-blur-sm p-6 rounded-lg text-white text-center flex flex-col">
                                    <Icon size={40} className="mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">{material.title}</h3>
                                    <p className="opacity-90 mb-6 flex-grow">{material.description}</p>
                                    <Button onClick={() => handleDownload(material.title)} className="bg-white text-orange-600 hover:bg-gray-100 font-semibold mt-auto">
                                        <Download className="mr-2" size={16} /> {material.action}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Tutorial;