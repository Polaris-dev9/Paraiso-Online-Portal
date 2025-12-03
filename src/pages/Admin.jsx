import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    Newspaper, 
    Calendar, 
    Briefcase, 
    BarChart3, 
    Shield, 
    Settings,
    Store,
    HeartHandshake,
    Sparkles,
    Building2,
    User2 as UserTie,
    BookOpen,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminButton = ({ to, icon, title, description, color, delay }) => {
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
                        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100').replace('-600', '-100')}`}>
                            <Icon className={`w-7 h-7 ${color.replace('border-', 'text-').replace('-600', '-700').replace('-500', '-700')}`} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-snug">{description}</p>
                </Button>
            </Link>
        </motion.div>
    );
};

const Admin = () => {
    const adminLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, title: 'Dashboard Principal', description: 'Visão geral com métricas de tráfego, vendas e engajamento.', color: 'border-blue-600' },
        { to: '/admin/guia-comercial', icon: Building2, title: 'Guia Comercial', description: 'Gerencie empresas, categorias e planos.', color: 'border-cyan-600' },
        { to: '/admin/guia-profissional', icon: UserTie, title: 'Guia Profissional', description: 'Gerencie profissionais, categorias e planos.', color: 'border-teal-600' },
        { to: '/admin/assinantes', icon: Users, title: 'Gerenciar Assinantes', description: 'Administre contas, pagamentos e status.', color: 'border-green-600' },
        { to: '/admin/franquias', icon: HeartHandshake, title: 'Gerenciar Franquias', description: 'Controle unidades, permissões e royalties.', color: 'border-pink-600' },
        { to: '/admin/noticias', icon: Newspaper, title: 'Publicar Notícias', description: 'Crie, edite e agende publicações.', color: 'border-orange-600' },
        { to: '/admin/eventos', icon: Calendar, title: 'Gerenciar Eventos', description: 'Modere e aprove publicações de eventos.', color: 'border-red-600' },
        { to: '/admin/vagas', icon: Briefcase, title: 'Moderar Vagas', description: 'Aprove, edite e gerencie vagas de emprego.', color: 'border-indigo-600' },
        { to: '/admin/loja', icon: Store, title: 'Administrar Loja', description: 'Gerencie o marketplace e as lojas.', color: 'border-purple-600' },
        { to: '/admin/forum', icon: MessageSquare, title: 'Moderar Fórum', description: 'Gerencie tópicos, respostas e usuários do fórum.', color: 'border-rose-500' },
        { to: '/admin/relatorios', icon: BarChart3, title: 'Ver Relatórios', description: 'Acesse dados financeiros e de desempenho.', color: 'border-gray-600' },
        { to: '/admin/ai', icon: Sparkles, title: 'Admin do Super Agente IA', description: 'Treine e configure a inteligência artificial.', color: 'border-yellow-500' },
        { to: '/admin/treinamento', icon: BookOpen, title: 'Treinamento da Equipe', description: 'Acesse materiais e processos internos.', color: 'border-lime-600' },
        { to: '/admin/equipe', icon: Shield, title: 'Equipe e Permissões', description: 'Gerencie usuários e níveis de acesso.', color: 'border-fuchsia-600' },
        { to: '/admin/configuracoes', icon: Settings, title: 'Configurações Gerais', description: 'Ajuste as configurações globais do portal.', color: 'border-slate-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
            <Helmet>
                <title>Área Administrativa - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-blue-900">Área Administrativa</h1>
                    <p className="text-gray-600 mt-2">Gerencie todo o conteúdo e funcionalidades do Portal Paraíso Online.</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {adminLinks.map((link, index) => (
                        <AdminButton
                            key={link.to}
                            to={link.to}
                            icon={link.icon}
                            title={link.title}
                            description={link.description}
                            color={link.color}
                            delay={index * 0.05}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;