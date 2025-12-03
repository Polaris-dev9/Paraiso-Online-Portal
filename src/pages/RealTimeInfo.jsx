import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Cloud, TrendingUp, Rss, Sun, Wind, Droplets, DollarSign, Euro, Bitcoin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useLocation } from 'react-router-dom';

const RealTimeInfo = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const defaultTab = params.get('tab') || 'weather';

    const weatherData = { 
        city: 'São João do Paraíso', 
        temp: '24°C', 
        condition: 'Parcialmente Nublado', 
        icon: <Cloud className="h-24 w-24 text-blue-400" />,
        details: [
            { icon: Sun, label: 'Índice UV', value: 'Alto' },
            { icon: Wind, label: 'Vento', value: '12 km/h' },
            { icon: Droplets, label: 'Umidade', value: '65%' },
        ]
    };
    
    const quotes = [
        { name: 'Dólar (USD)', value: 'R$ 5,25', change: '+0.5%', status: 'up', icon: DollarSign },
        { name: 'Euro (EUR)', value: 'R$ 5,70', change: '-0.2%', status: 'down', icon: Euro },
        { name: 'Bitcoin (BTC)', value: 'R$ 350.000', change: '+2.1%', status: 'up', icon: Bitcoin },
    ];

    const urgentNews = [
        { id: 1, title: 'Bolsa de Valores abre em alta com novos investimentos.', time: '5 min atrás' },
        { id: 2, title: 'Previsão de chuva forte para a região nas próximas horas.', time: '12 min atrás' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>Informações em Tempo Real - Portal Paraíso Online</title>
                <meta name="description" content="Acompanhe o clima, cotações de moedas e notícias urgentes em tempo real." />
            </Helmet>

            <div className="container mx-auto px-4">
                <Breadcrumbs />
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        Informações em Tempo Real
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Dados atualizados para você ficar sempre bem informado.
                    </p>
                </motion.div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-gray-300 hover:shadow-xl transition-shadow">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl flex items-center justify-center gap-2"><Cloud className="text-blue-500"/>Clima</CardTitle>
                                <CardDescription>Em {weatherData.city}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                {weatherData.icon}
                                <p className="text-6xl font-bold text-gray-800">{weatherData.temp}</p>
                                <p className="text-xl text-gray-600">{weatherData.condition}</p>
                                <div className="w-full border-t pt-4 mt-4 flex justify-around">
                                    {weatherData.details.map(detail => {
                                        const Icon = detail.icon;
                                        return (
                                            <div key={detail.label} className="text-center">
                                                <Icon className="h-6 w-6 mx-auto text-gray-500 mb-1"/>
                                                <p className="text-sm font-bold">{detail.value}</p>
                                                <p className="text-xs text-gray-500">{detail.label}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-gray-300 hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2"><TrendingUp className="text-green-500"/>Cotações</CardTitle>
                                <CardDescription>Moedas e Ativos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {quotes.map(quote => {
                                        const Icon = quote.icon;
                                        return (
                                        <li key={quote.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className="h-6 w-6 text-gray-600"/>
                                                <span className="font-medium">{quote.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{quote.value}</p>
                                                <Badge className={quote.status === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                    {quote.change}
                                                </Badge>
                                            </div>
                                        </li>
                                    )})}
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                        <Card className="h-full border-gray-300 hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-2xl flex items-center gap-2"><Rss className="text-orange-500"/>Plantão de Notícias</CardTitle>
                                <CardDescription>Últimas Atualizações</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <ul className="space-y-4">
                                    {urgentNews.map(item => (
                                        <li key={item.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                            <p className="font-semibold text-yellow-900 text-sm">{item.title}</p>
                                            <p className="text-xs text-yellow-700 mt-1">{item.time}</p>
                                        </li>
                                    ))}
                               </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default RealTimeInfo;