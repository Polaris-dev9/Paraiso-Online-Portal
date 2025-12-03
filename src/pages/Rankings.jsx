import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { BarChart3, Building2, User2 as UserTie, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Rankings = () => {
    const [activeRanking, setActiveRanking] = useState('empresas');

    const topCompanies = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Empresa Parceira ${i + 1}`,
        logo: ['💻', '🛒', '🍽️', '🏋️', '🔧', '👗', '🧱'][i % 7],
        page_clicks: Math.floor(Math.random() * (1500 - 500 + 1) + 500),
        banner_clicks: Math.floor(Math.random() * (800 - 100 + 1) + 100),
    })).sort((a,b) => (b.page_clicks + b.banner_clicks) - (a.page_clicks + a.banner_clicks))
    .map((company, index) => ({...company, rank: index + 1}));
    
    const topProfessionals = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        name: `Profissional ${i + 1}`,
        category: ['Advocacia', 'Saúde', 'Contabilidade', 'Engenharia', 'Design'][i % 5],
        avatar: `https://i.pravatar.cc/150?u=professional${i}`,
        profile_views: Math.floor(Math.random() * (2000 - 400 + 1) + 400),
        contact_clicks: Math.floor(Math.random() * (300 - 50 + 1) + 50),
    })).sort((a,b) => (b.profile_views + b.contact_clicks) - (a.profile_views + a.contact_clicks))
    .map((prof, index) => ({...prof, rank: index + 1}));

    const topPersonalities = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        name: `Personalidade Pública ${i+1}`,
        image: `https://i.pravatar.cc/150?u=personality${i}`,
        profile_views: Math.floor(Math.random() * (50000 - 10000 + 1) + 10000),
        category: ['Influenciador', 'Artista Local', 'Político', 'Empresário'][i % 4]
    })).sort((a,b) => b.profile_views - a.profile_views)
    .map((person, index) => ({...person, rank: index + 1}));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>Rankings de Popularidade - Portal Paraíso Online</title>
                <meta name="description" content="Confira o ranking das empresas, profissionais e personalidades mais acessados e bem avaliados do Portal Paraíso Online." />
                 <meta property="og:title" content="Rankings de Popularidade - Portal Paraíso Online" />
                <meta property="og:description" content="Veja quem está em alta! O ranking é baseado no total de cliques, engajamento e votações." />
            </Helmet>

            <div className="container mx-auto px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <BarChart3 className="inline-block mr-3 h-10 w-10" />
                        Rankings de Popularidade
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        Veja quem está em alta! O ranking é baseado no total de cliques, engajamento e visualizações.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-4 mb-12"
                >
                    <Button 
                        size="lg" 
                        onClick={() => setActiveRanking('empresas')}
                        className={activeRanking === 'empresas' ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700' : ''}
                        variant={activeRanking !== 'empresas' ? 'outline' : 'default'}
                    >
                        <Building2 className="mr-2" /> Empresas
                    </Button>
                    <Button 
                        size="lg"
                        onClick={() => setActiveRanking('profissionais')}
                        className={activeRanking === 'profissionais' ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700' : ''}
                        variant={activeRanking !== 'profissionais' ? 'outline' : 'default'}
                    >
                        <UserTie className="mr-2" /> Profissionais
                    </Button>
                     <Button 
                        size="lg"
                        onClick={() => setActiveRanking('personalidades')}
                        className={activeRanking === 'personalidades' ? 'bg-yellow-500 text-white shadow-lg hover:bg-yellow-600' : ''}
                        variant={activeRanking !== 'personalidades' ? 'outline' : 'default'}
                    >
                        <Star className="mr-2" /> Personalidades
                    </Button>
                </motion.div>

                {activeRanking === 'empresas' && (
                    <motion.div
                        key="empresas"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <h2 className="text-2xl font-bold text-blue-900 p-6 flex items-center"><Building2 className="mr-2 text-blue-600"/> Ranking de Empresas</h2>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">#</TableHead>
                                        <TableHead>Empresa</TableHead>
                                        <TableHead className="text-center">Cliques na Página</TableHead>
                                        <TableHead className="text-center">Cliques nos Banners</TableHead>
                                        <TableHead className="text-center font-bold">Total de Cliques</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topCompanies.map((company) => (
                                        <TableRow key={company.id} className="hover:bg-gray-50">
                                            <TableCell className="font-bold text-center text-lg text-gray-700">{company.rank}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{company.logo}</span>
                                                    <span className="font-medium text-gray-800">{company.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-gray-600">{company.page_clicks}</TableCell>
                                            <TableCell className="text-center text-gray-600">{company.banner_clicks}</TableCell>
                                            <TableCell className="text-center font-bold text-blue-700 text-lg">{company.page_clicks + company.banner_clicks}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </motion.div>
                )}

                {activeRanking === 'profissionais' && (
                     <motion.div
                        key="profissionais"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <h2 className="text-2xl font-bold text-blue-900 p-6 flex items-center"><UserTie className="mr-2 text-indigo-600"/> Ranking de Profissionais</h2>
                        <div className="overflow-x-auto">
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">#</TableHead>
                                        <TableHead>Profissional</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead className="text-center">Visualizações</TableHead>
                                        <TableHead className="text-center">Cliques Contato</TableHead>
                                        <TableHead className="text-center font-bold">Total de Interações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topProfessionals.map((prof) => (
                                        <TableRow key={prof.id}>
                                            <TableCell className="font-bold text-center text-lg text-gray-700">{prof.rank}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={prof.avatar} alt={prof.name} />
                                                        <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-gray-800">{prof.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="secondary">{prof.category}</Badge></TableCell>
                                            <TableCell className="text-center text-gray-600">{prof.profile_views}</TableCell>
                                            <TableCell className="text-center text-gray-600">{prof.contact_clicks}</TableCell>
                                            <TableCell className="text-center font-bold text-indigo-700 text-lg">{prof.profile_views + prof.contact_clicks}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </motion.div>
                )}

                 {activeRanking === 'personalidades' && (
                     <motion.div 
                        key="personalidades"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <h2 className="text-2xl font-bold text-blue-900 p-6 flex items-center"><Star className="mr-2 text-yellow-500"/> Ranking de Personalidades</h2>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px] text-center">#</TableHead>
                                        <TableHead>Personalidade</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead className="text-center font-bold">Visualizações do Perfil</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topPersonalities.map((person) => (
                                        <TableRow key={person.id}>
                                            <TableCell className="font-bold text-center text-lg text-gray-700">{person.rank}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={person.image} alt={person.name} />
                                                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-gray-800">{person.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline">{person.category}</Badge></TableCell>
                                            <TableCell className="text-center font-bold text-yellow-700 text-lg">{person.profile_views.toLocaleString('pt-BR')}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Rankings;