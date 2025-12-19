import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Building, Store, BarChart2, Shield, Settings, Newspaper, Briefcase, MessageSquare, Palette, Gamepad2, DollarSign, GraduationCap, Bot, Gem, User2 as UserTie, Calendar, Image as ImageIcon, Rss } from 'lucide-react';

const AdminButton = ({ to, icon, title, description, color, delay }) => {
    const Icon = icon;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            className="h-full"
        >
            <Link to={to} className="block h-full p-6 rounded-lg shadow-md transition-all duration-300" style={{ backgroundColor: '#fff', borderLeft: `5px solid ${color}` }}>
                <div className="flex items-center mb-3">
                    <Icon className="w-8 h-8 mr-4" style={{ color }} />
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                </div>
                <p className="text-gray-600">{description}</p>
            </Link>
        </motion.div>
    );
};

const AdminDashboard = () => {
    const { user } = useAuth();
    const userRole = user?.role;

    const sections = {
        publications: {
            title: '📑 Painel de Publicações',
            items: [
                { to: '/admin/noticias', icon: Newspaper, title: 'Notícias e Matérias', description: 'Publique e gerencie notícias.', color: '#0ea5e9', roles: ['master', 'general_admin', 'content_admin'] },
                { to: '/admin/blog', icon: Rss, title: 'Colunas e Artigos', description: 'Gerencie o blog e colunistas.', color: '#f97316', roles: ['master', 'general_admin', 'content_admin'] },
                { to: '/admin/eventos', icon: Calendar, title: 'Eventos', description: 'Adicione e atualize eventos.', color: '#8b5cf6', roles: ['master', 'general_admin', 'content_admin'] },
                { to: '/admin/comentarios', icon: MessageSquare, title: 'Moderar Comentários', description: 'Aprove, rejeite ou exclua comentários de notícias e eventos.', color: '#6366f1', roles: ['master', 'general_admin', 'content_admin'] },
                { to: '/admin/media', icon: ImageIcon, title: 'Galeria', description: 'Gerencie a galeria de mídia.', color: '#10b981', roles: ['master', 'general_admin', 'content_admin'] },
            ]
        },
        registrations: {
            title: '🧭 Painel de Cadastros',
            items: [
                { to: '/admin/guia-comercial', icon: Building, title: 'Empresas', description: 'Gerencie as empresas do guia.', color: '#16a34a', roles: ['master', 'general_admin', 'franchisee'] },
                { to: '/admin/guia-profissional', icon: UserTie, title: 'Profissionais', description: 'Gerencie os profissionais.', color: '#ca8a04', roles: ['master', 'general_admin', 'franchisee'] },
                { to: '/admin/paginas-premium', icon: Gem, title: 'Personalidades', description: 'Gerencie as páginas de destaque.', color: '#d946ef', roles: ['master', 'general_admin'] },
            ]
        },
        subscriptions: {
            title: '💎 Painel de Assinaturas',
            items: [
                { to: '/admin/assinantes', icon: Users, title: 'Planos e Status', description: 'Gerencie assinantes e seus planos.', color: '#3b82f6', roles: ['master', 'general_admin'] },
            ]
        },
        financial: {
            title: '💰 Painel Financeiro',
            items: [
                { to: '/admin/relatorios', icon: BarChart2, title: 'Relatórios de Pagamentos', description: 'Visualize dados e métricas.', color: '#f97316', roles: ['master', 'general_admin'] },
                { to: '/admin/loja', icon: Store, title: 'Controle de Vendas', description: 'Controle lojas e produtos.', color: '#10b981', roles: ['master', 'general_admin'] },
            ]
        },
        control: {
            title: '⚙️ Painel de Controle (Master)',
            roles: ['master'],
            items: [
                { to: '/admin/franquias', icon: Building, title: 'Franquias', description: 'Administre as franquias e licenças.', color: '#8b5cf6', roles: ['master'] },
                { to: '/admin/ia', icon: Bot, title: 'Agente IA ISA', description: 'Gerencie a inteligência artificial ISA.', color: '#a855f7', roles: ['master'] },
                { to: '/admin/equipe', icon: Shield, title: 'Equipe e Permissões', description: 'Controle o acesso da equipe.', color: '#ec4899', roles: ['master'] },
                { to: '/admin/configuracoes', icon: Settings, title: 'Configurações Gerais', description: 'Ajustes gerais do sistema.', color: '#84cc16', roles: ['master'] },
            ]
        }
    };
    
    const dashboardTitles = {
        master: 'Central Master Master',
        general_admin: 'Central Admin Geral',
        content_admin: 'Central Admin Conteúdo',
        franchisee: 'Central do Franqueado',
    };
    const dashboardTitle = dashboardTitles[userRole] || 'Dashboard Administrativo';

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>{dashboardTitle} - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">{dashboardTitle}</h1>
                    <p className="text-gray-700 mt-2">Visão geral e acesso rápido às áreas administrativas do portal.</p>
                </div>

                {Object.entries(sections).map(([key, section]) => {
                    const visibleItems = section.items.filter(item => item.roles.includes(userRole));
                    if (visibleItems.length === 0) return null;
                    if (section.roles && !section.roles.includes(userRole)) return null;

                    return (
                        <div key={key} className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {visibleItems.map((item, index) => (
                                    <AdminButton
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
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default AdminDashboard;