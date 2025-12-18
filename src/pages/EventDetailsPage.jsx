import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Share2, ChevronLeft, Check, Ticket, Image as ImageIcon, Video, Loader2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { eventService } from '@/services/eventService';
import { categoryService } from '@/services/categoryService';

const EventDetailsPage = () => {
    const { slug } = useParams();
    const { toast } = useToast();
    const [event, setEvent] = useState(null);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        loadEvent();
    }, [slug]);

    const loadEvent = async () => {
        try {
            setLoading(true);
            const eventData = await eventService.getEventBySlug(slug);
            
            if (eventData) {
                setEvent(eventData);
                
                // Carregar categoria se existir
                if (eventData.category_id) {
                    try {
                        const catData = await categoryService.getCategoryById(eventData.category_id);
                        setCategory(catData);
                    } catch (err) {
                        console.error('Error loading category:', err);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading event:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: '🔗 Link Copiado!', description: 'O link do evento foi copiado.' });
    };

    const handleRegister = () => {
        setIsRegistered(true);
        toast({
            title: '✅ Presença Confirmada!',
            description: `Você confirmou presença no evento "${event.title}".`,
            className: 'bg-green-500 text-white',
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }
    
    if (!event) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold">Evento não encontrada</h1>
                <Link to="/eventos">
                    <Button className="mt-4">Voltar para Eventos</Button>
                </Link>
            </div>
        );
    }

    const startDate = event.start_date || event.date;
    const startTime = event.start_time || event.time || '';
    const location = event.location || event.address || 'Local a definir';
    const city = event.city || 'São João do Paraíso';
    const price = event.price || 'Gratuito';
    const registered = event.registered_count || 0;
    const capacity = event.capacity || 0;
    const keywords = `${event.title}, ${category?.name || ''}, evento em ${city}, ${location}`;

    return (
        <div className="min-h-screen bg-white py-12">
            <Helmet>
                <title>{`${event.title} | Portal Paraíso Online`}</title>
                <meta name="description" content={event.description} />
                <meta name="keywords" content={keywords} />
                <meta property="og:title" content={event.title} />
                <meta property="og:description" content={event.description} />
                <meta property="og:image" content={event.image} />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="container mx-auto px-4">
                <Breadcrumbs />
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="overflow-hidden">
                        {event.image_url ? (
                            <img src={event.image_url} alt={event.title} className="w-full h-48 md:h-72 object-cover" />
                        ) : (
                            <div className="w-full h-48 md:h-72 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Sem imagem</span>
                            </div>
                        )}
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    {category && (
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            {category.name}
                                        </span>
                                    )}
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">{event.title}</h1>
                                    
                                    {/* Banner de Destaque se existir */}
                                    {event.banner_url && (
                                        <div className="mb-8 rounded-xl overflow-hidden shadow-lg border">
                                            <img 
                                                src={event.banner_url} 
                                                alt="Banner do Evento" 
                                                className="w-full h-auto object-cover max-h-[400px]" 
                                            />
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mb-6">
                                        {startDate && (
                                            <span className="flex items-center">
                                                <Calendar size={16} className="mr-1.5" /> 
                                                {new Date(startDate).toLocaleDateString('pt-BR')}
                                                {startTime && ` às ${startTime}`}
                                            </span>
                                        )}
                                        <span className="flex items-center">
                                            <MapPin size={16} className="mr-1.5" /> {location}, {city}
                                        </span>
                                        {capacity > 0 && (
                                            <span className="flex items-center">
                                                <Users size={16} className="mr-1.5" /> {registered} de {capacity}
                                            </span>
                                        )}
                                    </div>
                                    <div className="prose max-w-none text-lg text-gray-800 leading-relaxed">
                                        <p className="whitespace-pre-wrap font-medium text-gray-600 border-l-4 border-purple-600 pl-4 mb-6">{event.description}</p>
                                        {event.content && (
                                            <div 
                                                className="whitespace-pre-wrap"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: event.content.replace(/\n/g, '<br />') 
                                                }} 
                                            />
                                        )}
                                    </div>

                                    {/* Galeria de Fotos / Álbum */}
                                    {event.gallery_urls && event.gallery_urls.length > 0 && (
                                        <div className="mt-12 space-y-4">
                                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                                <ImageIcon className="text-purple-600" /> Álbum do Evento
                                            </h3>
                                            <Separator className="bg-gray-200" />
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {event.gallery_urls.map((url, index) => (
                                                    <motion.div 
                                                        key={index} 
                                                        whileHover={{ scale: 1.02 }}
                                                        className="aspect-square rounded-lg overflow-hidden border shadow-sm cursor-pointer"
                                                        onClick={() => window.open(url, '_blank')}
                                                    >
                                                        <img src={url} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover" />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Links Úteis */}
                                    {event.related_links && event.related_links.length > 0 && (
                                        <div className="mt-12 p-6 bg-purple-50/50 rounded-xl border border-purple-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <LinkIcon className="text-purple-600" /> Links Úteis & Ingressos
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {event.related_links.map((link, index) => (
                                                    <a 
                                                        key={index} 
                                                        href={link.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex items-center p-3 bg-white border border-purple-200 rounded-lg hover:border-purple-400 hover:text-purple-700 transition-all shadow-sm group"
                                                    >
                                                        <LinkIcon size={16} className="mr-3 text-purple-400 group-hover:text-purple-600" />
                                                        <span className="font-medium">{link.title || 'Link Externo'}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader><CardTitle className="text-xl">Sua Participação</CardTitle></CardHeader>
                                        <CardContent>
                                            <p className="text-lg font-bold text-green-600 mb-4">{price}</p>
                                            <Button onClick={handleRegister} disabled={isRegistered} className={`w-full ${isRegistered ? 'bg-green-600' : 'gradient-royal text-white'}`}>
                                                {isRegistered ? <><Check className="mr-2"/> Presença Confirmada</> : <><Ticket className="mr-2"/> Confirmar Presença</>}
                                            </Button>
                                            <Button onClick={handleShare} variant="outline" className="w-full mt-2"><Share2 className="mr-2" /> Compartilhar</Button>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle className="text-xl">Localização</CardTitle></CardHeader>
                                        <CardContent className="h-64 rounded-lg overflow-hidden border border-gray-300 flex flex-col items-start justify-center space-y-2">
                                            <div className="flex items-center text-gray-700">
                                                <MapPin className="mr-2" />
                                                <span>{location}, {city}</span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Mapa interativo indisponível no momento. Use o endereço acima para encontrar o local no seu app de mapas favorito.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetailsPage;
