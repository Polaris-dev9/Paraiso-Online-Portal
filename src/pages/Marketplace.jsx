import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Store, Search, Filter, ShoppingCart, ArrowRight, Tag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const ProductCard = ({ product, store }) => {
    const whatsappMessage = `Olá, tenho interesse no produto: ${product.name} - R$ ${product.price.toFixed(2).replace('.', ',')}`;
    const whatsappLink = `https://wa.me/${store.phone}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
            <Card className="overflow-hidden group bg-white hover:shadow-xl transition-shadow flex-grow">
                {product.isPromotion && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center">
                        <Tag size={12} className="mr-1" /> PROMO
                    </div>
                )}
                <Link to={`/marketplace/${store.slug}/${product.id}`}>
                    <img class="w-full h-40 object-cover group-hover:scale-105 transition-transform" alt={product.name} src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
                </Link>
                <CardContent className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg truncate text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                        Vendido por <Link to={`/marketplace/${store.slug}`} className="text-blue-600 hover:underline">{store.name}</Link>
                    </p>
                    <p className="text-xl font-extrabold text-blue-700 mb-4">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </p>
                    <div className="mt-auto">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full">
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                <ShoppingCart className="mr-2 h-4 w-4" /> Comprar via WhatsApp
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [stores, setStores] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const mockStores = [
            { id: 1, name: 'TecnoLoja', slug: 'tecnoloja', category: 'Tecnologia', phone: '5538999999999' },
            { id: 2, name: 'Moda & Estilo', slug: 'moda-estilo', category: 'Moda', phone: '5538988888888' },
            { id: 3, name: 'Sabor Divino', slug: 'sabor-divino', category: 'Alimentação', phone: '5538977777777' },
            { id: 4, name: 'Casa & Conforto', slug: 'casa-conforto', category: 'Casa e Decoração', phone: '5538966666666' },
            { id: 5, name: 'Saúde & Bem-Estar', slug: 'saude-bem-estar', category: 'Saúde', phone: '5538955555555' },
        ];
        const mockProducts = [
            // TecnoLoja
            { id: 1, store_id: 1, name: 'Smartphone Pro Max', price: 7499.90, isPromotion: true },
            { id: 2, store_id: 1, name: 'Notebook Gamer', price: 9999.00, isPromotion: false },
            { id: 3, store_id: 1, name: 'Smartwatch Series 8', price: 2599.00, isPromotion: false },
            // Moda & Estilo
            { id: 4, store_id: 2, name: 'Vestido Floral', price: 299.90, isPromotion: false },
            { id: 5, store_id: 2, name: 'Camisa Social Slim', price: 189.90, isPromotion: true },
            // Sabor Divino
            { id: 6, store_id: 3, name: 'Pizza Grande (Qualquer Sabor)', price: 69.90, isPromotion: true },
            { id: 7, store_id: 3, name: 'Combo Família (Lanche + Batata + Refri)', price: 89.90, isPromotion: false },
            // Casa & Conforto
            { id: 8, store_id: 4, name: 'Kit Almofadas Decorativas', price: 129.90, isPromotion: false },
            // Saúde & Bem-Estar
            { id: 9, store_id: 5, name: 'Consulta Nutricional Online', price: 150.00, isPromotion: false },
            { id: 10, store_id: 5, name: 'Plano de Treino Personalizado', price: 200.00, isPromotion: false },
        ];
        const mockCategories = [
            { id: 1, name: 'Tecnologia' },
            { id: 2, name: 'Moda' },
            { id: 3, name: 'Alimentação' },
            { id: 4, name: 'Casa e Decoração' },
            { id: 5, name: 'Saúde' },
            { id: 6, name: 'Serviços' },
        ];

        setProducts(mockProducts);
        setStores(mockStores);
        setCategories(mockCategories);
    }, []);

    const getStoreById = (id) => stores.find(s => s.id === id);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const store = getStoreById(p.store_id);
            if (!store) return false;

            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || store.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || store.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });
    }, [products, stores, searchTerm, selectedCategory]);

    const promotions = useMemo(() => products.filter(p => p.isPromotion), [products]);
    const mostViewed = useMemo(() => [...products].sort(() => 0.5 - Math.random()).slice(0, 10), [products]);

    return (
        <div className="min-h-screen bg-gray-100">
            <Helmet>
                <title>Marketplace - Portal Paraíso Online</title>
                <meta name="description" content="Encontre os melhores produtos e serviços da nossa cidade, tudo em um só lugar." />
            </Helmet>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-800 text-white py-12 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold">Marketplace Paraíso Online</h1>
                <p className="mt-4 text-lg max-w-2xl mx-auto">Compre dos melhores negócios da cidade com um clique.</p>
            </motion.div>

            <div className="container mx-auto p-4 sm:p-6 md:p-8">
                <Card className="mb-8 bg-white shadow-sm">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input placeholder="Buscar por produto ou loja..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-full md:w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Categorias" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Categorias</SelectItem>
                                    {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {promotions.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Tag className="mr-2 text-red-500"/> Vitrine de Promoções</h2>
                        <Carousel opts={{ align: "start", loop: true }} className="w-full">
                            <CarouselContent>{promotions.map(product => {
                                const store = getStoreById(product.store_id);
                                return store ? <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4"><ProductCard product={product} store={store} /></CarouselItem> : null;
                            })}</CarouselContent>
                            <CarouselPrevious /><CarouselNext />
                        </Carousel>
                    </section>
                )}
                
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Star className="mr-2 text-yellow-500"/> Mais Vistos</h2>
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>{mostViewed.map(product => {
                            const store = getStoreById(product.store_id);
                            return store ? <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/4"><ProductCard product={product} store={store} /></CarouselItem> : null;
                        })}</CarouselContent>
                        <CarouselPrevious /><CarouselNext />
                    </Carousel>
                </section>

                <h2 className="text-2xl font-bold text-gray-800 mb-6">Todos os Produtos</h2>
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProducts.map(product => {
                        const store = getStoreById(product.store_id);
                        return store ? <ProductCard key={product.id} product={product} store={store} /> : null;
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default Marketplace;