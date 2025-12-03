import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Award, Star, Zap, UserPlus, MessageCircle, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const AdminGamification = () => {

    const actions = [
        { id: 1, name: 'Cadastro de usuário', points: 50, enabled: true },
        { id: 2, name: 'Primeiro login', points: 10, enabled: true },
        { id: 3, name: 'Comentar em notícia', points: 5, enabled: true },
        { id: 4, name: 'Cadastrar vaga de emprego', points: 20, enabled: false },
        { id: 5, name: 'Avaliar uma empresa', points: 15, enabled: true },
    ];

    const levels = [
        { level: 1, name: 'Iniciante', points: 0 },
        { level: 2, name: 'Colaborador', points: 100 },
        { level: 3, name: 'Engajado', points: 500 },
        { level: 4, name: 'Embaixador', points: 2000 },
    ];
    
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Admin: Gamificação</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <Award className="mr-3 text-yellow-500" />
                            Gamificação e Engajamento
                        </h1>
                        <p className="text-gray-700 mt-1">Configure pontos, níveis e recompensas para os usuários.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="border-gray-400 bg-white">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Regras de Pontuação</CardTitle>
                            <CardDescription className="text-gray-600">Defina quantos pontos cada ação do usuário vale.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="overflow-x-auto border rounded-lg border-gray-400">
                                <Table>
                                    <TableHeader className="bg-gray-200"><TableRow>
                                        <TableHead className="text-gray-800 font-semibold">Ação</TableHead>
                                        <TableHead className="text-gray-800 font-semibold">Pontos</TableHead>
                                        <TableHead className="text-center text-gray-800 font-semibold">Status</TableHead>
                                        <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                    </TableRow></TableHeader>
                                    <TableBody>
                                        {actions.map(action => (
                                            <TableRow key={action.id}>
                                                <TableCell className="font-medium text-gray-900">{action.name}</TableCell>
                                                <TableCell className="text-blue-700 font-bold">{action.points}</TableCell>
                                                <TableCell className="text-center">
                                                    <Switch id={`switch-${action.id}`} checked={action.enabled} />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" title="Editar"><Edit size={16} /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </div>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-400 bg-white">
                        <CardHeader>
                            <CardTitle className="text-gray-900">Níveis de Usuário</CardTitle>
                             <CardDescription className="text-gray-600">Configure os níveis que os usuários alcançam com pontos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="overflow-x-auto border rounded-lg border-gray-400">
                                <Table>
                                     <TableHeader className="bg-gray-200"><TableRow>
                                        <TableHead className="text-gray-800 font-semibold">Nível</TableHead>
                                        <TableHead className="text-gray-800 font-semibold">Nome</TableHead>
                                        <TableHead className="text-gray-800 font-semibold">Pontos Necessários</TableHead>
                                    </TableRow></TableHeader>
                                    <TableBody>
                                        {levels.map(level => (
                                            <TableRow key={level.level}>
                                                <TableCell className="font-bold text-gray-900">{level.level}</TableCell>
                                                <TableCell className="font-medium text-gray-800">{level.name}</TableCell>
                                                <TableCell className="text-blue-700 font-bold">{level.points}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminGamification;