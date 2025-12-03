import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Star, MapPin, Phone, Mail, Globe, MessageSquare, Youtube, Facebook, Instagram, Linkedin, ShoppingCart, Briefcase, Image as ImageIcon, Video, ThumbsUp, ChevronsRight, Camera, Building, AlertCircle, CheckCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const PartnerPage = () => {
    const { slug } = useParams();
    const { toast } = useToast();
    const [partnerData, setPartnerData] = useState(null);

    useEffect(() => {
        const storedCompanies = JSON.parse(localStorage.getItem('ppo_companies')) || [];
        const company = storedCompanies.find(c => c.slug === slug);

        if (company) {
            setPartnerData({
                ...company,
                rating: company.rating || 4.9,
                reviews: company.reviews || 128,
                coverImage: company.coverImage || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=400&fit=crop",
                address: company.address || "Rua Exemplo, 123, Centro, Paraíso do Tocantins",
                phone: company.phone || "(63) 99999-8888",
                email: company.email || "contato@saborearte.com",
                website: company.website || "saborearte.com.br",
                socials: company.socials || [
                    { name: 'Instagram', url: '#', icon: Instagram },
                    { name: 'Facebook', url: '#', icon: Facebook },
                    { name: 'YouTube', url: '#', icon: Youtube },
                ],
                products: company.products || [
                    { id: 1, name: 'Prato Executivo', description: 'Delicioso prato com opções de carne, frango ou peixe.', price: '25.90', icon: Briefcase },
                    { id: 2, name: 'Feijoada Completa', description: 'A melhor feijoada da cidade, servida aos sábados.', price: '35.00', icon: ShoppingCart },
                    { id: 3, name: 'Pizza Grande', description: 'Qualquer sabor do nosso cardápio especial.', price: '55.00', icon: ShoppingCart },
                ],
                gallery: company.gallery || [
                    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
                    "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&h=300&fit=crop",
                ],
                videoUrl: company.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ",
                differentials: company.differentials || [
                    'Ambiente Climatizado', 'Espaço Kids', 'Música ao Vivo', 'Delivery Rápido', 'Programa de Fidelidade'
                ],
                testimonials: company.testimonials || [
                    { name: 'Ana Clara', text: 'Atendimento impecável e a comida é maravilhosa! Recomendo a todos.', rating: 5 },
                    { name: 'Marcos Vinícius', text: 'O melhor lugar da cidade para reunir os amigos. Ambiente super agradável.', rating: 5 },
                ]
            });
        }
    }, [slug]);

    const handleAction = (message) => {
        toast({
            title: "🚧 Funcionalidade em Desenvolvimento",
            description: message,
        });
    };

    if (!partnerData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Empresa não encontrada</h1>
                    <p className="mt-6 text-base leading-7 text-gray-600">Desculpe, não conseguimos encontrar a empresa que você está procurando.</p>
                </div>
            </div>
        )
    }

    const keywords = `${partnerData.name}, ${partnerData.category}, ${partnerData.subcategory}, Guia Comercial, São João do Paraíso, ${partnerData.products.map(p => p.name).join(', ')}`;

    return (
        <div className="min-h-screen bg-gray-50">
            <Helmet>
                <title>{`${partnerData.name} | Guia Comercial | Portal Paraíso Online`}</title>
                <meta name="description" content={`Conheça ${partnerData.name}. ${partnerData.description}`} />
                <meta name="keywords" content={keywords} />
                <meta property="og:title" content={`${partnerData.name} | Guia Comercial`} />
                <meta property="og:description" content={partnerData.description} />
                <meta property="og:image" content={partnerData.coverImage} />
                <meta property="og:type" content="website" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="relative h-64 md:h-80 bg-cover bg-center" style={{ backgroundImage: `url(${partnerData.coverImage})` }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="container mx-auto px-4 relative h-full flex flex-col justify-end pb-8">
                    <div className="flex items-end space-x-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center text-5xl md:text-6xl shadow-lg border-4 border-white -mb-12 md:-mb-16">
                            {partnerData.logo}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{partnerData.name}</h1>
                            <p className="text-lg text-gray-200">{partnerData.category}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="bg-white shadow-md">
                <div className="container mx-auto px-4 pt-16 md:pt-20 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                         {partnerData.plan === 'Premium' && <Badge className="bg-yellow-400 text-yellow-900 text-sm flex items-center"><Award size={14} className="mr-1"/> Premium</Badge>}
                        <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} className={i < Math.round(partnerData.rating) ? 'fill-current' : 'text-gray-300'} />)}
                        </div>
                        <span className="text-gray-600">{partnerData.rating} ({partnerData.reviews} avaliações)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => handleAction("Sistema de avaliação em breve!")}><Star size={16} className="mr-2" /> Avaliar</Button>
                        <Button onClick={() => handleAction("Chat com a empresa em breve!")} variant="outline"><MessageSquare size={16} className="mr-2" /> Enviar Mensagem</Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <h2 className="text-3xl font-bold text-blue-900 mb-4 flex items-center"><Building size={28} className="mr-3 text-blue-600" />Sobre Nós</h2>
                            <p className="text-gray-700 leading-relaxed text-lg">{partnerData.description}</p>
                        </motion.section>

                        {partnerData.products && partnerData.products.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center"><ShoppingCart size={28} className="mr-3 text-blue-600" /> Produtos e Serviços</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {partnerData.products.map(product => {
                                        const Icon = product.icon || Briefcase;
                                        return (
                                            <Card key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                                                <CardHeader className="flex-row items-center gap-4">
                                                    <div className="bg-blue-100 p-3 rounded-lg"><Icon className="w-6 h-6 text-blue-700" /></div>
                                                    <CardTitle className="text-xl text-gray-800">{product.name}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                                                    <p className="text-2xl font-bold text-green-600">R$ {product.price}</p>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </motion.section>
                        )}

                        {partnerData.differentials && partnerData.differentials.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center"><ThumbsUp size={28} className="mr-3 text-blue-600" /> Nossos Diferenciais</h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                    {partnerData.differentials.map((item, index) => (
                                        <li key={index} className="flex items-center text-lg text-gray-700">
                                            <CheckCircle size={20} className="mr-3 text-green-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.section>
                        )}

                        {partnerData.gallery && partnerData.gallery.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center"><Camera size={28} className="mr-3 text-blue-600" /> Galeria de Fotos</h2>
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {partnerData.gallery.map((url, index) => (
                                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                            <div className="p-1">
                                                <img src={url} alt={`Galeria de fotos ${index + 1}`} className="w-full h-64 object-cover rounded-lg shadow-md" />
                                            </div>
                                        </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </motion.section>
                        )}

                        {partnerData.videoUrl && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center"><Video size={28} className="mr-3 text-blue-600" /> Vídeo Institucional</h2>
                                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
                                    <iframe src={partnerData.videoUrl} title="Vídeo Institucional" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                                </div>
                            </motion.section>
                        )}

                        {partnerData.testimonials && partnerData.testimonials.length > 0 && (
                            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                                <h2 className="text-3xl font-bold text-blue-900 mb-6 flex items-center"><MessageSquare size={28} className="mr-3 text-blue-600" /> O que nossos clientes dizem</h2>
                                <div className="space-y-6">
                                    {partnerData.testimonials.map((testimonial, index) => (
                                        <Card key={index} className="bg-blue-50 border-l-4 border-blue-500">
                                            <CardContent className="p-6">
                                                <p className="italic text-gray-700 mb-4">"{testimonial.text}"</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-gray-800">- {testimonial.name}</p>
                                                    <div className="flex text-yellow-500">
                                                        {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>

                    <aside className="lg:col-span-1 space-y-8 sticky top-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Informações de Contato</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start"><MapPin size={16} className="mr-3 mt-1 text-blue-600 flex-shrink-0" /> {partnerData.address}</li>
                                <li className="flex items-center"><Phone size={16} className="mr-3 text-blue-600" /> {partnerData.phone}</li>
                                <li className="flex items-center"><Mail size={16} className="mr-3 text-blue-600" /> {partnerData.email}</li>
                                <li className="flex items-center"><Globe size={16} className="mr-3 text-blue-600" /> <a href={`https://${partnerData.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-700 break-all">{partnerData.website}</a></li>
                            </ul>
                            <div className="flex justify-center space-x-4 mt-6">
                                {partnerData.socials.map(social => {
                                    const Icon = social.icon;
                                    return (
                                        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110">
                                            <Icon size={20} />
                                        </a>
                                    )
                                })}
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white p-6 rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold text-blue-900 mb-4">Localização</h3>
                            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3949.393724573213!2d-48.4109228852196!3d-10.178448992687004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x933b31585d555555%3A0x8f4f2d9c4c9bce2a!2sPara%C3%ADso%20do%20Tocantins%2C%20TO!5e0!3m2!1spt-BR!2sbr!4v1620312955215!5m2!1spt-BR!2sbr"
                                ></iframe>
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default PartnerPage;