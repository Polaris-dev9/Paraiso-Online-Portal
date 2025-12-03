import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryPage = () => {
    const { category } = useParams();
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    const createDummyData = (count, baseTitle, imageBaseUrl) => {
        return Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            title: `${baseTitle} em ${categoryName} ${i + 1}`,
            excerpt: `Este é um resumo da notícia sobre ${categoryName}. Clique para ler mais detalhes sobre este importante acontecimento.`,
            image: `${imageBaseUrl}?w=400&h=250&fit=crop&random=${i * count + Math.random()}`
        }));
    };

    const news = createDummyData(10, "Notícia", "https://images.unsplash.com/photo-1495020689067-958852a7765e");

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Notícias de {categoryName} - Portal Paraíso Online</title>
                <meta name="description" content={`Fique por dentro das últimas notícias sobre ${categoryName} em São João do Paraíso e região.`} />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-12"
                >
                    <Link to="/noticias" className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
                        <ArrowLeft size={16} className="mr-2" />
                        Voltar para Todas as Notícias
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center">
                        <Rss className="mr-3" /> Notícias de {categoryName}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl">
                        As últimas atualizações e reportagens sobre {categoryName} em nossa região.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white rounded-lg shadow-lg overflow-hidden group"
                        >
                            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors">{item.title}</h2>
                                <p className="text-gray-700 leading-relaxed mb-4">{item.excerpt}</p>
                                <Button as={Link} to="#" variant="outline" className="w-full">Ler Mais</Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;