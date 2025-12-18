import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Play, Image as ImageIcon, Search, Filter, MessageSquare, Send, Video, Radio, PlusCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventService } from '@/services/eventService';
import { categoryService } from '@/services/categoryService';

const EventCard = ({ event, category }) => {
    const startDate = event.start_date || event.date;
    const isLive = event.is_live || false;
    const location = event.location || event.address || 'Local a definir';
    
    return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover-lift flex flex-col group h-full"
    >
        <div className="relative aspect-video overflow-hidden">
                {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Sem imagem</span>
                    </div>
                )}
                {isLive && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center animate-pulse">
                    <Radio size={14} className="mr-1" /> AO VIVO
                </div>
            )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
                {category && (
                    <span className="text-sm text-blue-600 font-semibold mb-1">{category.name}</span>
                )}
            <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{event.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{event.description}</p>
            <div className="space-y-1 text-sm text-gray-600 mb-4">
                    {startDate && (
                        <div className="flex items-center">
                            <Calendar size={14} className="mr-2" /> 
                            {new Date(startDate).toLocaleDateString('pt-BR')}
                        </div>
                    )}
                    <div className="flex items-center">
                        <MapPin size={14} className="mr-2" /> {location}
                    </div>
            </div>
            <div className="mt-auto">
                <Link to={`/evento/${event.slug}`}>
                    <Button className="w-full gradient-royal text-white">
                            {isLive ? 'Acompanhar ao Vivo' : 'Ver Detalhes'}
                    </Button>
                </Link>
            </div>
        </div>
    </motion.div>
);
};

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents({ publishedOnly: true });
      console.log('[Events.jsx] Events loaded:', data);
      console.log('[Events.jsx] Events count:', data?.length || 0);
      setEvents(data || []);
    } catch (error) {
      console.error('[Events.jsx] Error loading events:', error);
      console.error('[Events.jsx] Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategoriesByType('event', true);
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([]);
    }
  };

  const handleAction = (type, payload) => {
    toast({ title: "🚧 Em Desenvolvimento", description: "Esta funcionalidade será implementada em breve." });
  };

  const filteredEvents = events
    .filter(event => {
        const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             event.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || 
                               event.category_id === selectedCategory ||
                               (selectedCategory !== 'all' && categories.find(c => c.id === selectedCategory && c.id === event.category_id));
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
                <div className="relative w-full md:w-auto">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full md:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">Todos</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <Button onClick={() => handleAction('create_event')} className="w-full md:w-auto gradient-gold text-white"><PlusCircle size={16} className="mr-2" /> Publicar Evento</Button>
            </div>
        </motion.div>

        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        ) : (
            <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEvents.map((event) => {
                        const category = categories.find(c => c.id === event.category_id);
                        return <EventCard key={event.id} event={event} category={category} />;
                    })}
        </div>
        
                {filteredEvents.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros ou volte mais tarde!</p>
          </motion.div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default Events;