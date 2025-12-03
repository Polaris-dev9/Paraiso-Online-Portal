import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Newspaper, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PressRoom = () => {
    const releases = [
        { id: 1, title: "Portal Paraíso Online Lança Nova Plataforma", date: "04 de Outubro, 2025", file: "/releases/release-01.pdf" },
        { id: 2, title: "Parceria com Comércio Local Impulsiona Economia", date: "15 de Setembro, 2025", file: "/releases/release-02.pdf" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Sala de Imprensa - Portal Paraíso Online</title>
                <meta name="description" content="Acesse releases oficiais, comunicados e materiais de imprensa do Portal Paraíso Online." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <Newspaper className="inline-block mr-3" />
                        Sala de Imprensa
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Informações oficiais, releases e kit de imprensa para jornalistas e parceiros.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Comunicados de Imprensa</h2>
                        <div className="space-y-4">
                            {releases.map((release, index) => (
                                <motion.div
                                    key={release.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="bg-white">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-800">{release.title}</p>
                                                <p className="text-sm text-gray-500">{release.date}</p>
                                            </div>
                                            <Button asChild>
                                                <a href={release.file} download>
                                                    <Download className="mr-2 h-4 w-4" /> Baixar
                                                </a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contato</h2>
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Assessoria de Imprensa</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-gray-700"><strong>E-mail:</strong> imprensa@portalparaisoonline.com.br</p>
                                <p className="text-gray-700"><strong>Telefone:</strong> (38) 99808-5771</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PressRoom;