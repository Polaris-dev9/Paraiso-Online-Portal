import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BarChart3, Building2, User2 as UserTie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ProfessionalsRanking = () => {
    const topProfessionals = Array.from({ length: 20 }, (_, i) => ({
        rank: i + 1,
        name: `Profissional ${i + 1}`,
        logo: ['⚖️', '🩺', '🏗️', '🧮', '🧑‍🏫', '🏛️', '🧠'][i % 7],
        category: ['Direito', 'Saúde', 'Construção', 'Finanças', 'Educação', 'Arquitetura', 'Psicologia'][i % 7],
        clicks: Math.floor(Math.random() * (1200 - 300 + 1) + 300),
    })).sort((a,b) => b.clicks - a.clicks)
    .map((prof, index) => ({...prof, rank: index + 1}));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>Ranking de Profissionais - Portal Paraíso Online</title>
                <meta name="description" content="Confira o ranking dos profissionais mais acessados do Portal Paraíso Online." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <BarChart3 className="inline-block mr-3" />
                        Rankings de Popularidade
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Veja os profissionais que estão em alta! O ranking é baseado no total de cliques na página de perfil.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center gap-4 mb-8"
                >
                    <Link to="/rankings">
                        <Button size="lg" variant="outline" className="border-blue-800 text-blue-800 hover:bg-blue-50">
                            <Building2 className="mr-2" /> Ranking de Empresas
                        </Button>
                    </Link>
                    <Button size="lg" className="gradient-royal text-white shadow-lg">
                        <UserTie className="mr-2" /> Ranking de Profissionais
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px] text-center">#</TableHead>
                                <TableHead>Profissional</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead className="text-center font-bold">Total de Cliques</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topProfessionals.map((prof) => (
                                <TableRow key={prof.rank} className="hover:bg-gray-50">
                                    <TableCell className="font-bold text-center text-lg text-gray-700">{prof.rank}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{prof.logo}</span>
                                            <span className="font-medium text-gray-800">{prof.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{prof.category}</TableCell>
                                    <TableCell className="text-center font-bold text-blue-700 text-lg">{prof.clicks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfessionalsRanking;