import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BrainCircuit, Bot, BookOpen, MessageSquare, BarChart2, Users, Settings, Shield, Sparkles, MessageCircle, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AiAdminButton = ({ to, icon, title, description, color, delay }) => {
    const Icon = icon;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
        >
            <Link to={to} className="block h-full">
                <Button variant="outline" className={`w-full h-full bg-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-between text-left border-l-4 ${color}`}>
                     <div className="flex items-center space-x-4 mb-4">
                        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
                            <Icon className={`w-7 h-7 ${color.replace('border-', 'text-').replace('-700', '-700')}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-snug">{description}</p>
                </Button>
            </Link>
        </motion.div>
    );
};

const AiAdmin = () => {
    const menuItems = [
        { to: '/admin/ai/treinamento', icon: BrainCircuit, title: 'Treinamento e Conhecimento', description: 'Faça upload de documentos e áudios para treinar a ISA.', color: 'border-purple-600' },
        { to: '/admin/ai/personalidade', icon: Bot, title: 'Personalidade e Voz', description: 'Ajuste o comportamento e o tom de voz da ISA.', color: 'border-indigo-600' },
        { to: '/admin/ai/gestao-equipe', icon: Users, title: 'Gestão de Equipe e WhatsApp', description: 'Gerencie atendentes, setores e a integração com o WhatsApp.', color: 'border-green-600' },
        { to: '/admin/ai/historico', icon: MessageSquare, title: 'Histórico de Conversas', description: 'Analise e filtre as interações dos usuários com a IA.', color: 'border-cyan-600' },
        { to: '/admin/ai/metricas', icon: BarChart2, title: 'Análise e Métricas', description: 'Visualize KPIs de desempenho e satisfação do usuário.', color: 'border-teal-600' },
        { to: '/admin/ai/respostas', icon: BookOpen, title: 'Gerenciar Respostas Rápidas', description: 'Crie e edite respostas padrão para perguntas comuns.', color: 'border-blue-600' },
        { to: '/admin/ai/replicas', icon: GitBranch, title: 'Gerenciar Agentes Replicados', description: 'Crie instâncias da IA para diferentes departamentos.', color: 'border-orange-600' },
        { to: '/admin/ai/integracoes', icon: Settings, title: 'Configurações de Integração', description: 'Conecte a IA com outras ferramentas via APIs e webhooks.', color: 'border-slate-600' },
        { to: '/admin/ai/seguranca', icon: Shield, title: 'Segurança e Filtros', description: 'Defina palavras bloqueadas e configure a moderação de conteúdo.', color: 'border-red-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Admin da Super Agente ISA - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-10 text-center">
                    <div className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full mb-4">
                        <Sparkles className="text-white" size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-700">
                        Administração da Super Agente ISA
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                        Gerencie, treine e monitore o cérebro digital do Portal Paraíso Online.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                        <AiAdminButton
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            color={item.color}
                            delay={index * 0.05}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AiAdmin;