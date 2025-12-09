import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Store, ShoppingCart, Star, MessageSquare, Phone, Mail, MapPin, Loader2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriberService } from '@/services/subscriberService';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';

const StorePage = () => {
    const params = useParams();
    // Suporta tanto /loja/:slug quanto /marketplace/:storeSlug
    const slug = params.slug || params.storeSlug;
    const [subscriber, setSubscriber] = useState(null);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadStoreData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Buscar assinante pelo slug
                const subData = await subscriberService.getSubscriberBySlug(slug);
                
                if (!subData) {
                    setError('Loja não encontrada');
                    setLoading(false);
                    return;
                }

                setSubscriber(subData);

                // Buscar categoria se houver
                if (subData.category_id) {
                    try {
                        const catData = await categoryService.getCategoryById(subData.category_id);
                        setCategory(catData);
                    } catch (catError) {
                        console.warn('Erro ao buscar categoria:', catError);
                    }
                }

                // Buscar produtos públicos
                const productsData = await productService.getPublicProducts(subData.id);
                setProducts(productsData);
            } catch (err) {
                console.error('Error loading store data:', err);
                setError(err.message || 'Erro ao carregar dados da loja');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadStoreData();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando loja...</p>
                </div>
            </div>
        );
    }

    if (error || !subscriber) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="p-8 text-center">
                        <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Loja não encontrada</h2>
                        <p className="text-gray-600">
                            {error || 'A loja que você está procurando não existe ou não está mais disponível.'}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Construir endereço completo
    const address = subscriber.address || {};
    const fullAddress = [
        address.street,
        address.number,
        address.neighborhood,
        address.city,
        address.state
    ].filter(Boolean).join(', ');

    // Construir link WhatsApp
    const phone = subscriber.phone?.replace(/\D/g, '') || '';
    const whatsappLink = phone ? `https://wa.me/55${phone}` : null;

    return (
        <div className="min-h-screen bg-gray-100">
            <Helmet>
                <title>{subscriber.name} - Loja Virtual - Portal Paraíso Online</title>
                <meta name="description" content={subscriber.description || `Produtos e serviços de ${subscriber.name}`} />
            </Helmet>

            {/* Banner da loja */}
            {subscriber.banner_image_url && (
                <div className="w-full h-48 md:h-64 overflow-hidden bg-gray-200">
                    <img 
                        src={subscriber.banner_image_url} 
                        alt={`Banner de ${subscriber.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Header da loja */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            {subscriber.logo_url ? (
                                <img 
                                    src={subscriber.logo_url} 
                                    alt={`Logo de ${subscriber.name}`}
                                    className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/96?text=' + encodeURIComponent(subscriber.name.charAt(0));
                                    }}
                                />
                            ) : subscriber.profile_image_url ? (
                                <img 
                                    src={subscriber.profile_image_url} 
                                    alt={`Logo de ${subscriber.name}`}
                                    className="w-24 h-24 rounded-full border-4 border-blue-200 object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/96?text=' + encodeURIComponent(subscriber.name.charAt(0));
                                    }}
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full border-4 border-blue-200 bg-blue-100 flex items-center justify-center">
                                    <Store className="h-12 w-12 text-blue-600" />
                                </div>
                            )}
                        </div>

                        {/* Informações */}
                        <div className="flex-grow">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{subscriber.name}</h1>
                            {category && (
                                <Badge className="mt-2 bg-blue-600 text-white">
                                    {category.name}
                                </Badge>
                            )}
                            {subscriber.description && (
                                <p className="text-gray-600 mt-2 max-w-2xl">{subscriber.description}</p>
                            )}

                            {/* Informações de contato e endereço */}
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                                {subscriber.phone && (
                                    <a 
                                        href={whatsappLink || `tel:${subscriber.phone}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 hover:text-blue-600"
                                    >
                                        <Phone className="h-4 w-4" />
                                        <span>{subscriber.phone}</span>
                                    </a>
                                )}
                                {subscriber.email && (
                                    <a 
                                        href={`mailto:${subscriber.email}`}
                                        className="flex items-center gap-2 hover:text-blue-600"
                                    >
                                        <Mail className="h-4 w-4" />
                                        <span>{subscriber.email}</span>
                                    </a>
                                )}
                                {fullAddress && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{fullAddress}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Produtos */}
            <main className="container mx-auto p-4 sm:p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Produtos</h2>
                    <p className="text-gray-600">
                        {products.length === 0 
                            ? 'Esta loja ainda não possui produtos cadastrados.'
                            : `${products.length} ${products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`
                        }
                    </p>
                </div>

                {products.length === 0 ? (
                    <Card className="bg-white">
                        <CardContent className="p-12 text-center">
                            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Esta loja ainda não possui produtos disponíveis.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map(product => (
                            <motion.div 
                                key={product.id} 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="overflow-hidden group bg-white hover:shadow-lg transition-shadow h-full flex flex-col">
                                    {/* Imagem do produto */}
                                    <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                                        {product.image_url ? (
                                            <img 
                                                src={product.image_url} 
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                <Package className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                        {product.is_promotion && (
                                            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                                                Promoção
                                            </Badge>
                                        )}
                                    </div>

                                    <CardContent className="p-4 flex-grow flex flex-col">
                                        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3rem]">
                                            {product.name}
                                        </h3>
                                        
                                        {product.description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                                                {product.description}
                                            </p>
                                        )}

                                        <div className="mt-auto">
                                            <p className="text-2xl font-bold text-blue-700 mb-3">
                                                R$ {parseFloat(product.price || 0).toFixed(2).replace('.', ',')}
                                            </p>
                                            <Button 
                                                className="w-full bg-blue-700 hover:bg-blue-800"
                                                onClick={() => {
                                                    if (whatsappLink) {
                                                        const message = `Olá! Tenho interesse no produto: ${product.name} - R$ ${parseFloat(product.price || 0).toFixed(2).replace('.', ',')}`;
                                                        window.open(`${whatsappLink}?text=${encodeURIComponent(message)}`, '_blank');
                                                    } else if (subscriber.email) {
                                                        const subject = `Interesse no produto: ${product.name}`;
                                                        const body = `Olá!\n\nTenho interesse no produto: ${product.name}\nPreço: R$ ${parseFloat(product.price || 0).toFixed(2).replace('.', ',')}\n\nAguardo retorno.`;
                                                        window.location.href = `mailto:${subscriber.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                                                    }
                                                }}
                                            >
                                                <ShoppingCart className="mr-2 h-4 w-4" /> 
                                                {whatsappLink ? 'Entrar em Contato' : 'Enviar E-mail'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StorePage;