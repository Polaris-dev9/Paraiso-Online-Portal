import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, PlusCircle, Search, ThumbsUp, User, Clock, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import Breadcrumbs from '@/components/common/Breadcrumbs';

const Forum = () => {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');

    const handleAction = (feature) => {
        toast({
            title: '🚧 Em Desenvolvimento',
            description: `A funcionalidade '${feature}' está sendo preparada para você!`,
        });
    };

    const categories = [
        { id: 'geral', name: 'Geral' },
        { id: 'noticias', name: 'Notícias' },
        { id: 'empregos', name: 'Empregos' },
        { id: 'negocios', name: 'Negócios' },
        { id: 'cidade', name: 'A Cidade' },
        { id: 'tecnologia', name: 'Tecnologia' },
    ];

    const topics = [
        { id: 1, title: 'Qual a melhor pizzaria da cidade?', author: 'João Silva', replies: 12, likes: 34, lastReply: '2 horas atrás', category: 'negocios', authorLevel: 'Engajado' },
        { id: 2, title: 'Indicação de mecânico de confiança', author: 'Maria Costa', replies: 8, likes: 21, lastReply: '5 horas atrás', category: 'negocios', authorLevel: 'Colaborador' },
        { id: 3, title: 'Onde encontrar produtos orgânicos?', author: 'Carlos Pereira', replies: 5, likes: 15, lastReply: '1 dia atrás', category: 'cidade', authorLevel: 'Iniciante' },
        { id: 4, title: 'Vagas de emprego para freelancers', author: 'Ana Souza', replies: 23, likes: 55, lastReply: '1 dia atrás', category: 'empregos', authorLevel: 'Embaixador' },
    ];

    const filteredTopics = topics.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <Helmet>
                <title>Fórum da Comunidade - Portal Paraíso Online</title>
                <meta name="description" content="Participe das discussões, tire suas dúvidas e conecte-se com a comunidade de São João do Paraíso." />
            </Helmet>

            <div className="container mx-auto px-4">
                <Breadcrumbs />
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <MessageSquare className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">Fórum da Comunidade</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Um espaço para conectar, compartilhar ideias e tirar dúvidas sobre nossa cidade.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8"
                >
                    <div className="relative w-full md:flex-grow">
                        <Input type="text" placeholder="Buscar tópicos, autores ou categorias..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                    <Button onClick={() => handleAction('Novo Tópico')} className="gradient-royal text-white w-full md:w-auto flex-shrink-0">
                        <PlusCircle className="mr-2" size={20} />
                        Criar Novo Tópico
                    </Button>
                </motion.div>

                <Tabs defaultValue="geral" className="w-full">
                    <TabsList className="mb-6 flex-wrap h-auto">
                        {categories.map(cat => (
                            <TabsTrigger key={cat.id} value={cat.id}>{cat.name}</TabsTrigger>
                        ))}
                    </TabsList>

                    <motion.div
                        key={Math.random()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <ul className="divide-y divide-gray-200">
                                {filteredTopics.length > 0 ? filteredTopics.map((topic) => (
                                    <li 
                                        key={topic.id}
                                        className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                        onClick={() => handleAction(`Ver Tópico: ${topic.title}`)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 text-center w-16">
                                                <div className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-1"><ThumbsUp size={16}/>{topic.likes}</div>
                                                <div className="text-xs text-gray-500">Curtidas</div>
                                                <div className="text-2xl font-bold text-gray-700 mt-1">{topic.replies}</div>
                                                <div className="text-xs text-gray-500">Respostas</div>
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-lg font-semibold text-blue-800 hover:underline">{topic.title}</h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center"><User size={12} className="mr-1" /> {topic.author} <Badge variant="secondary" className="ml-2">{topic.authorLevel}</Badge></span>
                                                    <span className="flex items-center"><Clock size={12} className="mr-1" /> Última resposta: {topic.lastReply}</span>
                                                    <span className="flex items-center"><Tag size={12} className="mr-1" /> <Badge variant="outline">{topic.category}</Badge></span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="p-8 text-center text-gray-500">Nenhum tópico encontrado.</li>
                                )}
                            </ul>
                        </div>
                    </motion.div>
                </Tabs>
            </div>
        </div>
    );
};

export default Forum;