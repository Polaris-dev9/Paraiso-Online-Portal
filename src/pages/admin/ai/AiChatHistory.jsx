import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { History, Search, Filter, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AiChatHistory = () => {
    const conversations = [
        { id: 1, user: "Visitante 123", date: "04/09/2025 14:30", preview: "Olá, qual o telefone da prefeitura?", status: "Resolvido" },
        { id: 2, user: "Visitante 456", date: "04/09/2025 14:25", preview: "Gostaria de saber sobre os planos de assinatura.", status: "Resolvido" },
        { id: 3, user: "Visitante 789", date: "04/09/2025 14:20", preview: "Não consigo encontrar a farmácia de plantão.", status: "Escalado" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Helmet>
                <title>IA: Histórico de Conversas</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 flex items-center">
                    <History className="mr-3 h-8 w-8" /> Histórico de Conversas
                </h1>
                <p className="text-gray-600 mt-2">Visualize, filtre e analise as interações dos usuários com a IA.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-6"
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <Input placeholder="Buscar por usuário ou mensagem..." className="pl-10" />
                    </div>
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" /> Filtros Avançados
                    </Button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg h-full"
                    >
                        <div className="p-4 border-b">
                            <h2 className="font-semibold text-lg">Conversas Recentes</h2>
                        </div>
                        <ul className="divide-y divide-gray-200">
                            {conversations.map(convo => (
                                <li key={convo.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                                    <div className="flex justify-between">
                                        <p className="font-bold text-gray-800">{convo.user}</p>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${convo.status === 'Resolvido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{convo.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{convo.preview}</p>
                                    <p className="text-xs text-gray-400 mt-1">{convo.date}</p>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
                <div className="lg:col-span-2">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-lg h-full flex flex-col"
                    >
                        <div className="p-4 border-b">
                            <h2 className="font-semibold text-lg">Conversa com Visitante 123</h2>
                        </div>
                        <div className="flex-grow p-6 space-y-4 overflow-y-auto">
                            <div className="flex items-start gap-3 justify-end">
                                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                                    <p>Olá, qual o telefone da prefeitura?</p>
                                </div>
                                <User className="h-8 w-8 text-gray-600" />
                            </div>
                            <div className="flex items-start gap-3">
                                <Bot className="h-8 w-8 text-indigo-600" />
                                <div className="bg-gray-200 p-3 rounded-lg max-w-xs">
                                    <p>Olá! O telefone da Prefeitura de São João do Paraíso é (XX) XXXX-XXXX. Posso ajudar com mais alguma informação?</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50">
                            <Input placeholder="Digite uma mensagem para intervir..." disabled />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AiChatHistory;