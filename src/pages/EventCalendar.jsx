import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Calendar } from 'lucide-react';

const EventCalendar = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <Helmet>
                <title>Calendário de Eventos - Portal Paraíso Online</title>
                <meta name="description" content="Confira o calendário completo de eventos da região. Fique por dentro de tudo que acontece!" />
            </Helmet>
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <Calendar className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">Calendário de Eventos</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Fique por dentro de todos os eventos da cidade e região.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 rounded-lg shadow-xl"
                >
                    <div className="aspect-w-16 aspect-h-9">
                         <iframe 
                            src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FSao_Paulo&bgcolor=%23ffffff&src=cHQuYnJhemlsaWFuI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%2309d67a" 
                            style={{border: "solid 1px #777"}} 
                            width="100%" 
                            height="600" 
                            frameBorder="0" 
                            scrolling="no"
                            title="Calendário de Eventos"
                        ></iframe>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Este é um calendário de exemplo. A integração com os eventos do portal está em desenvolvimento.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default EventCalendar;