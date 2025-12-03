import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Store, ShoppingCart, Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Dados de exemplo
const sampleStores = {
    'tecnoloja': {
        name: 'TecnoLoja',
        description: 'Sua loja de tecnologia e inovação em São João do Paraíso.',
        logo: 'https://placehold.co/100x100/3b82f6/white?text=T',
        rating: 4.8,
        products: [
            { id: 1, name: 'Smartphone X', price: 2999.90, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop' },
            { id: 7, name: 'Notebook Pro', price: 7999.00, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop' },
            { id: 8, name: 'Smartwatch 2', price: 1299.00, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop' },
        ]
    },
    'esporte-total': {
        name: 'Esporte Total',
        description: 'Tudo para o seu esporte favorito.',
        logo: 'https://placehold.co/100x100/ef4444/white?text=E',
        rating: 4.5,
        products: [
            { id: 2, name: 'Tênis de Corrida', price: 349.90, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
        ]
    }
};

const StorePage = () => {
    const { slug } = useParams();
    const store = sampleStores[slug];

    if (!store) {
        return <div>Loja não encontrada.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Helmet>
                <title>{store.name} - Marketplace Paraíso Online</title>
            </Helmet>

            <header className="bg-white shadow-sm">
                <div className="container mx-auto p-6 flex flex-col md:flex-row items-center gap-6">
                    <img src={store.logo} alt={`Logo da ${store.name}`} className="w-24 h-24 rounded-full border-4 border-blue-200" />
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">{store.name}</h1>
                        <p className="text-gray-600 mt-1">{store.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star size={16} />
                                <span className="font-bold">{store.rating}</span>
                            </div>
                            <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                                <MessageSquare size={14} className="mr-2" /> Contatar Vendedor
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos da Loja</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {store.products.map(product => (
                        <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <Card className="overflow-hidden group bg-white hover:shadow-lg transition-shadow">
                                <Link to={`/marketplace/${slug}/${product.id}`}>
                                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                                </Link>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-md truncate text-gray-800">{product.name}</h3>
                                    <p className="text-lg font-bold text-blue-700 my-2">
                                        R$ {product.price.toFixed(2).replace('.', ',')}
                                    </p>
                                    <Button className="w-full bg-blue-700 hover:bg-blue-800">
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default StorePage;