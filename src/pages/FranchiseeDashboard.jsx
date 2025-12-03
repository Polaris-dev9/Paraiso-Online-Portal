import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, User2 as UserTie, Palette, BarChart2 } from 'lucide-react';

const FranchiseeButton = ({ to, icon, title, description, color, delay }) => {
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

const FranchiseeDashboard = () => {
    const { user } = useAuth();

    const menuItems = [
        { to: '/franquia/guia-comercial', icon: Building2, title: 'Guia Comercial', description: 'Gerencie as empresas da sua cidade.', color: '#3b82f6' },
        { to: '/franquia/guia-profissional', icon: UserTie, title: 'Guia Profissional', description: 'Gerencie os profissionais da sua cidade.', color: '#8b5cf6' },
        { to: '/franquia/banners', icon: Palette, title: 'Banners Locais', description: 'Administre os banners da sua região.', color: '#10b981' },
        { to: '/franquia/relatorios', icon: BarChart2, title: 'Relatórios Regionais', description: 'Visualize dados e métricas da sua franquia.', color: '#f97316' },
    ];

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Central do Franqueado - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Central do Franqueado
                    </h1>
                    <p className="text-gray-700 mt-2">
                        Bem-vindo(a), {user?.email}. Gerencie sua franquia regional.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item, index) => (
                        <FranchiseeButton
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

export default FranchiseeDashboard;