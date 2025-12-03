import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User2 as UserTie, Search, Filter, Award, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Professionals = () => {
    const [professionals, setProfessionals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ category: 'all', plan: 'all' });

    useEffect(() => {
        const storedProfessionals = JSON.parse(localStorage.getItem('ppo_professionals')) || [
            { id: 1, slug: 'dr-carlos-andrade', name: 'Dr. Carlos Andrade', category: 'Saúde', specialty: 'Clínico Geral', plan: 'Premium', status: true, description: 'Atendimento humanizado para toda a família.', avatar: 'https://i.pravatar.cc/150?u=doc_carlos' },
            { id: 2, slug: 'ana-beatriz-advocacia', name: 'Ana Beatriz Advocacia', category: 'Direito', specialty: 'Direito Civil', plan: 'Premium', status: true, description: 'Assessoria jurídica completa para pessoas e empresas.', avatar: 'https://i.pravatar.cc/150?u=adv_ana' },
            { id: 3, slug: 'marcos-lima-contabilidade', name: 'Marcos Lima', category: 'Finanças', specialty: 'Contabilidade', plan: 'Gratuito', status: true, description: 'Soluções contábeis para MEIs e pequenas empresas.', avatar: 'https://i.pravatar.cc/150?u=contador_marcos' },
            { id: 4, slug: 'sofia-rocha-arquitetura', name: 'Sofia Rocha', category: 'Construção', specialty: 'Arquitetura', plan: 'Essencial', status: true, description: 'Projetos que unem estética e funcionalidade.', avatar: 'https://i.pravatar.cc/150?u=arq_sofia' },
        ];
        const storedCategories = JSON.parse(localStorage.getItem('ppo_pro_categories')) || [
            { id: 1, name: 'Saúde' }, { id: 2, name: 'Direito' }, { id: 3, name: 'Finanças' }, { id: 4, name: 'Construção' }, { id: 5, name: 'Tecnologia' }
        ];
        setProfessionals(storedProfessionals);
        setCategories(storedCategories);
    }, []);

    const resetFilters = () => {
        setFilters({ category: 'all', plan: 'all' });
        setSearchTerm('');
    };

    const filteredProfessionals = professionals.filter(prof => {
        const matchesSearch = prof.name.toLowerCase().includes(searchTerm.toLowerCase()) || prof.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filters.category === 'all' || prof.category === filters.category;
        const matchesPlan = filters.plan === 'all' || prof.plan === filters.plan;
        return prof.status && matchesSearch && matchesCategory && matchesPlan;
    });

    const premiumProfessionals = filteredProfessionals.filter(p => p.plan === 'Premium');
    const otherProfessionals = filteredProfessionals.filter(p => p.plan !== 'Premium');

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>Guia Profissional - Portal Paraíso Online</title>
                <meta name="description" content="Encontre os melhores profissionais liberais da nossa cidade: médicos, advogados, contadores e muito mais." />
                <meta name="keywords" content="guia profissional, profissionais liberais, médicos, advogados, contadores, são joão do paraíso" />
            </Helmet>

            <div className="container mx-auto px-4">
                <Breadcrumbs />
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <UserTie className="inline-block mr-3" /> Guia Profissional
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">Encontre advogados, médicos, contadores e outros profissionais liberais da região.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-lg shadow-lg p-6 mb-8">
                     <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <Input placeholder="Qual profissional você procura?" className="pl-10 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full md:w-auto"><Filter className="mr-2" size={16} />Filtros<ChevronDown size={16} className="ml-2" /></Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2"><h4 className="font-medium leading-none">Filtros</h4><p className="text-sm text-muted-foreground">Refine sua busca.</p></div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Categoria</Label>
                                        <Select value={filters.category} onValueChange={(v) => setFilters(p => ({...p, category: v}))}><SelectTrigger id="category"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="all">Todas</SelectItem>{categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}</SelectContent></Select>
                                        <Label htmlFor="plan">Plano</Label>
                                        <Select value={filters.plan} onValueChange={(v) => setFilters(p => ({...p, plan: v}))}><SelectTrigger id="plan"><SelectValue placeholder="Selecione" /></SelectTrigger><SelectContent><SelectItem value="all">Todos</SelectItem><SelectItem value="Premium">Premium</SelectItem><SelectItem value="Essencial">Essencial</SelectItem><SelectItem value="Gratuito">Gratuito</SelectItem></SelectContent></Select>
                                    </div>
                                    <Button onClick={resetFilters} variant="ghost" size="sm">Limpar Filtros</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    {premiumProfessionals.length > 0 && (
                         <div className="mb-12">
                            <h2 className="text-2xl font-bold text-yellow-500 mb-6 border-b-2 border-yellow-200 pb-2 flex items-center"><Award className="mr-2"/> Profissionais em Destaque</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {premiumProfessionals.map((prof) => (
                                    <motion.div key={prof.id} whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.2), 0 4px 6px -2px rgba(251, 191, 36, 0.1)' }}>
                                        <Link to={`/guia-profissional/${prof.slug}`} className="block bg-white rounded-lg shadow-md h-full transition-shadow border-2 border-yellow-400 relative overflow-hidden">
                                             <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">Premium</Badge>
                                             <CardContent className="p-6 flex items-center space-x-4">
                                                <Avatar className="w-16 h-16"><AvatarImage src={prof.avatar} /><AvatarFallback>{prof.name.charAt(0)}</AvatarFallback></Avatar>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{prof.name}</h3>
                                                    <p className="text-sm text-gray-500">{prof.specialty}</p>
                                                    <p className="text-sm text-blue-600 hover:underline mt-1">Ver perfil</p>
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-2">Demais Profissionais</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {otherProfessionals.map((prof) => (
                            <motion.div key={prof.id} whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                                <Link to={`/guia-profissional/${prof.slug}`} className="block bg-white rounded-lg shadow-md h-full transition-shadow">
                                    <CardContent className="p-6 flex items-center space-x-4">
                                        <Avatar className="w-16 h-16"><AvatarImage src={prof.avatar} /><AvatarFallback>{prof.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{prof.name}</h3>
                                            <p className="text-sm text-gray-500">{prof.specialty}</p>
                                            <p className="text-sm text-blue-600 hover:underline mt-1">Ver perfil</p>
                                        </div>
                                    </CardContent>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                     {filteredProfessionals.length === 0 && (
                        <div className="text-center py-16"><p className="text-xl text-gray-500">Nenhum profissional encontrado.</p><Button onClick={resetFilters} className="mt-4">Limpar busca</Button></div>
                     )}
                </motion.div>
            </div>
        </div>
    );
};

export default Professionals;