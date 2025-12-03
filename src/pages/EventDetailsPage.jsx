import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Share2, ChevronLeft, Check, Ticket, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const EventDetailsPage = () => {
    const { slug } = useParams();
    const { toast } = useToast();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const allEvents = [
            { id: 1, slug: 'festival-de-inverno-2025', title: "Festival de Inverno 2025", description: "O maior festival de inverno da região, com shows, comidas típicas e muito mais.", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=500&fit=crop", category: 'Cultura', date: "2025-07-20", time: "19:00", location: "Praça Central", city: "São João do Paraíso", lat: -15.313, lng: -42.015, registered: 1234, capacity: 3000, price: 'Gratuito', gallery: [], videos: [] },
        ];
        const foundEvent = allEvents.find(e => e.slug === slug);
        setTimeout(() => {
            if (foundEvent) setEvent(foundEvent);
            setLoading(false);
        }, 500);
    }, [slug]);

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

    if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    if (!event) return <div className="text-center py-20"><h1 className="text-2xl font-bold">Evento não encontrado</h1><Link to="/eventos"><Button className="mt-4">Voltar para Eventos</Button></Link></div>;

    const keywords = `${event.title}, ${event.category}, evento em ${event.city}, ${event.location}`;

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
                        <img src={event.image} alt={event.title} className="w-full h-48 md:h-72 object-cover" />
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">{event.category}</span>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">{event.title}</h1>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 mb-6">
                                        <span className="flex items-center"><Calendar size={16} className="mr-1.5" /> {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
                                        <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {event.location}, {event.city}</span>
                                        <span className="flex items-center"><Users size={16} className="mr-1.5" /> {event.registered} de {event.capacity}</span>
                                    </div>
                                    <div className="prose max-w-none text-lg text-gray-800 leading-relaxed">
                                        <p>{event.description}</p>
                                    </div>
                                    {(event.gallery.length > 0 || event.videos.length > 0) &&
                                        <div className="mt-8">
                                            <h2 className="text-2xl font-bold mb-4">Galeria e Vídeos</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {/* Placeholder for media */}
                                                <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center"><ImageIcon className="text-gray-500" /></div>
                                                <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center"><Video className="text-gray-500" /></div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader><CardTitle className="text-xl">Sua Participação</CardTitle></CardHeader>
                                        <CardContent>
                                            <p className="text-lg font-bold text-green-600 mb-4">{event.price}</p>
                                            <Button onClick={handleRegister} disabled={isRegistered} className={`w-full ${isRegistered ? 'bg-green-600' : 'gradient-royal text-white'}`}>
                                                {isRegistered ? <><Check className="mr-2"/> Presença Confirmada</> : <><Ticket className="mr-2"/> Confirmar Presença</>}
                                            </Button>
                                            <Button onClick={handleShare} variant="outline" className="w-full mt-2"><Share2 className="mr-2" /> Compartilhar</Button>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader><CardTitle className="text-xl">Localização</CardTitle></CardHeader>
                                        <CardContent className="h-64 rounded-lg overflow-hidden border border-gray-300">
                                            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 150000, center: [event.lng, event.lat] }}>
                                                <Geographies geography="/maps/brazil-states.json">
                                                    {({ geographies }) => geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />)}
                                                </Geographies>
                                                <Marker coordinates={[event.lng, event.lat]}>
                                                    <circle r={8} fill="#F53" />
                                                </Marker>
                                            </ComposableMap>
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