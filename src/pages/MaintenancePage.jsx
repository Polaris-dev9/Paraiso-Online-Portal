import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HardHat, Clock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const MaintenancePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white flex flex-col items-center justify-center p-4">
            <Helmet>
                <title>Em Manutenção - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="text-center"
            >
                <div className="w-24 h-24 gradient-royal rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <HardHat className="w-12 h-12 text-yellow-400" />
                </div>
                
                <h1 className="mt-8 text-4xl md:text-6xl font-bold tracking-tight">
                    🚧 Em atualização...
                </h1>
                
                <p className="mt-6 text-lg md:text-xl leading-8 text-gray-300 max-w-2xl mx-auto">
                    Nosso portal está em atualização. Agradecemos sua visita! Retorne em breve para conhecer todas as novidades do Paraíso Online.
                </p>

                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="mt-10 h-1 bg-yellow-400 rounded-full max-w-sm mx-auto"
                />

                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link to="/login-admin">
                        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-900">
                            <LogIn size={16} className="mr-2" /> Login Administrativo
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default MaintenancePage;