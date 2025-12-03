import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Play, Image as ImageIcon, Search, Filter, MessageSquare, Send, Video, Radio, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift flex flex-col group"
    >
        <div className="relative">
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
            {event.isLive && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center animate-pulse">
                    <Radio size={14} className="mr-1" /> AO VIVO
                </div>
            )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <span className="text-sm text-blue-600 font-semibold mb-1">{event.categoryName}</span>
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
                <div className="flex items-center"><Calendar size={14} className="mr-2" /> {new Date(event.date).toLocaleDateString('pt-BR')}</div>
                <div className="flex items-center"><MapPin size={14} className="mr-2" /> {event.location}</div>
            </div>
            <div className="mt-auto">
                <Link to={`/evento/${event.slug}`}>
                    <Button className="w-full gradient-royal text-white">
                        {event.isLive ? 'Acompanhar ao Vivo' : 'Ver Detalhes'}
                    </Button>
                </Link>
            </div>
        </div>
    </motion.div>
);

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: 'Todos' }, { id: 'business', name: 'Negócios' }, { id: 'culture', name: 'Cultura' },
    { id: 'sports', name: 'Esportes' }, { id: 'education', name: 'Educação' }, { id: 'technology', name: 'Tecnologia' }
  ];

  const eventsData = [
    { id: 1, slug: 'festival-de-inverno-2025', title: "Festival de Inverno 2025", description: "O maior festival de inverno da região, com shows, comidas típicas e muito mais.", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop", date: "2025-07-20", time: "19:00", location: "Praça Central", category: 'culture', capacity: 3000, registered: 1234, isLive: true, comments: [{id: 1, author: 'Visitante 1', text: 'Ótimo evento!'}], liveMedia: [{id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=300&fit=crop'}] },
    { id: 2, slug: 'feira-de-empregos-2024', title: "Feira de Empregos 2024", description: "Grande feira com mais de 100 empresas oferecendo oportunidades de trabalho em diversas áreas.", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop", date: "2025-09-15", time: "08:00 - 18:00", location: "Centro de Convenções", category: 'business', capacity: 5000, registered: 2340, isLive: false, comments: [], liveMedia: [] },
    { id: 3, slug: 'festival-de-musica-local', title: "Festival de Música Local", description: "Celebração da música regional com artistas locais e nacionais.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop", date: "2025-10-01", time: "18:00", location: "Praça Central", category: 'culture', capacity: 3000, registered: 1850, isLive: false, comments: [], liveMedia: [] },
  ];

  const handleAction = (type, payload) => {
    toast({ title: "🚧 Em Desenvolvimento", description: "Esta funcionalidade será implementada em breve." });
  };

  const filteredEvents = eventsData
    .map(e => ({ ...e, categoryName: categories.find(c => c.id === e.category)?.name }))
    .filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Eventos - Portal Paraíso Online</title>
        <meta name="description" content="Descubra e participe dos melhores eventos da região. Festivais, workshops, feiras e coberturas ao vivo." />
      </Helmet>

      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">🎉 Eventos & Coberturas</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Descubra, participe e reviva os melhores momentos da cidade.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-lg shadow-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><Input placeholder="Buscar eventos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" /></div>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><Filter size={16} className="inline mr-2" />{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <Button onClick={() => handleAction('create_event')} className="w-full md:w-auto gradient-gold text-white"><PlusCircle size={16} className="mr-2" /> Publicar Evento</Button>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
        
        {filteredEvents.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou volte mais tarde!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Events;