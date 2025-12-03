import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BarChart3, DollarSign, Users, ShoppingCart, Download, HeartHandshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminViewReports = () => {
    const financialData = [
        { name: 'Jan', receita: 4000, despesas: 2400 },
        { name: 'Fev', receita: 3000, despesas: 1398 },
        { name: 'Mar', receita: 5000, despesas: 3800 },
        { name: 'Abr', receita: 4780, despesas: 3908 },
        { name: 'Mai', receita: 6890, despesas: 4800 },
        { name: 'Jun', receita: 5390, despesas: 3800 },
    ];

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Admin: Relatórios</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <BarChart3 className="mr-3 text-blue-800" /> Relatórios e Métricas
                        </h1>
                        <p className="text-gray-700 mt-1">Analise o desempenho do portal em detalhes.</p>
                    </div>
                    <Button variant="outline" className="border-gray-400 bg-white"><Download className="mr-2" size={16} /> Exportar Relatório Geral</Button>
                </div>

                <Tabs defaultValue="financial">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-300">
                        <TabsTrigger value="financial"><DollarSign className="mr-2 h-4 w-4" />Financeiro</TabsTrigger>
                        <TabsTrigger value="engagement"><Users className="mr-2 h-4 w-4" />Engajamento</TabsTrigger>
                        <TabsTrigger value="sales"><ShoppingCart className="mr-2 h-4 w-4" />Vendas (Loja)</TabsTrigger>
                        <TabsTrigger value="franchises"><HeartHandshake className="mr-2 h-4 w-4" />Franquias</TabsTrigger>
                    </TabsList>
                    <TabsContent value="financial" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Relatório Financeiro</CardTitle>
                                <CardDescription className="text-gray-600">Receitas de assinaturas e royalties vs. despesas.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div style={{ width: '100%', height: 350 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={financialData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" stroke="#374151" />
                                            <YAxis stroke="#374151" />
                                            <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }} />
                                            <Legend />
                                            <Bar dataKey="receita" fill="#28a745" name="Receita" />
                                            <Bar dataKey="despesas" fill="#dc3545" name="Despesas" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="engagement" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Relatório de Engajamento</CardTitle>
                                <CardDescription className="text-gray-600">Métricas de interação dos usuários com o conteúdo.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-center p-8">Gráficos de engajamento em construção.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="sales" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Relatório de Vendas (Marketplace)</CardTitle>
                                <CardDescription className="text-gray-600">Desempenho das lojas e produtos.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-center p-8">Gráficos de vendas em construção.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                     <TabsContent value="franchises" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Relatório de Franquias</CardTitle>
                                <CardDescription className="text-gray-600">Desempenho e crescimento da rede de franquias.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-center p-8">Gráficos de franquias em construção.</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default AdminViewReports;