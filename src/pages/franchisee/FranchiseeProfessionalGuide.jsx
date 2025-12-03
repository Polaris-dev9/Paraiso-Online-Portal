import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User2 as UserTie } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FranchiseeProfessionalGuide = () => {
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Franquia: Guia Profissional</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <UserTie className="mr-3 text-indigo-700" /> Guia Profissional (Franquia)
                        </h1>
                        <p className="text-gray-700 mt-1">Gerencie os profissionais da sua cidade.</p>
                    </div>
                </div>
                <Card className="border-gray-400 bg-white">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Gerenciamento do Guia Profissional</CardTitle>
                        <CardDescription className="text-gray-600">Esta área está em desenvolvimento.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-gray-500 p-8">
                            Em breve, você poderá adicionar, editar e gerenciar todos os profissionais do Guia Profissional da sua cidade diretamente por aqui.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default FranchiseeProfessionalGuide;