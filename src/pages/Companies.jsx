import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Building2, Search, Filter, Award, ChevronDown, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { subscriberService } from '@/services/subscriberService';
import { categoryService } from '@/services/categoryService';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [categories, setCategories] = useState([]);
    const [plans, setPlans] = useState(['gratuito', 'essencial', 'premium']);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'all',
        plan: 'all',
        status: true,
    });
    
    useEffect(() => {
        loadCompanies();
        loadCategories();
    }, []);

    const loadCompanies = async () => {
        try {
            setLoading(true);
            // Buscar apenas empresas (profile_type='empresarial') e ativas (status=true)
            const data = await subscriberService.getAllSubscribers({
                profile_type: 'empresarial',
                status: true
            });
            setCompanies(data);
        } catch (error) {
            console.error('Error loading companies:', error);
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategoriesByType('commercial', true);
            setCategories(data);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([]);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({ category: 'all', plan: 'all', status: true });
        setSearchTerm('');
    };

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             company.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filters.category === 'all' || 
                               company.category_id === filters.category ||
                               (filters.category !== 'all' && categories.find(c => c.id === filters.category && c.id === company.category_id));
        const matchesPlan = filters.plan === 'all' || 
                           company.plan_type === filters.plan;
        const matchesStatus = filters.status ? company.status === true : true;
        return matchesSearch && matchesCategory && matchesPlan && matchesStatus;
    });

    const premiumCompanies = filteredCompanies.filter(c => c.plan_type === 'premium').sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    const otherCompanies = filteredCompanies.filter(c => c.plan_type !== 'premium').sort((a,b) => new Date(b.created_at) - new Date(a.created_at));

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>Guia Comercial - Portal Paraíso Online</title>
                <meta name="description" content="Encontre as melhores empresas, lojas e serviços da nossa cidade. O guia comercial completo do Portal Paraíso Online." />
                <meta name="keywords" content="guia comercial, empresas, lojas, serviços, são joão do paraíso, comércio local" />
            </Helmet>

            <div className="container mx-auto px-4">
                <Breadcrumbs />
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <Building2 className="inline-block mr-3" />
                        Guia Comercial
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        O guia completo para você encontrar os melhores produtos e serviços da cidade.
                    </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <Input placeholder="O que você procura?" className="pl-10 w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full md:w-auto">
                                    <Filter className="mr-2" size={16} />
                                    Filtros
                                    <ChevronDown size={16} className="ml-2" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Filtros</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Refine sua busca.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="category">Categoria</Label>
                                            <Select value={filters.category} onValueChange={(v) => handleFilterChange('category', v)}>
                                                <SelectTrigger id="category" className="col-span-2 h-8">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todas</SelectItem>
                                                    {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="plan">Plano</Label>
                                            <Select value={filters.plan} onValueChange={(v) => handleFilterChange('plan', v)}>
                                                <SelectTrigger id="plan" className="col-span-2 h-8">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos</SelectItem>
                                                    {plans.map(plan => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center space-x-2 pt-2">
                                            <Checkbox id="status" checked={filters.status} onCheckedChange={(c) => handleFilterChange('status', c)} />
                                            <label htmlFor="status" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Apenas empresas ativas
                                            </label>
                                        </div>
                                    </div>
                                    <Button onClick={resetFilters} variant="ghost" size="sm">Limpar Filtros</Button>
                                </div>
                            </PopoverContent>
                        </Popover>

                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                    {premiumCompanies.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-yellow-500 mb-6 border-b-2 border-yellow-200 pb-2 flex items-center"><Award className="mr-2"/> Empresas em Destaque</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {premiumCompanies.map((company) => {
                                        const category = categories.find(c => c.id === company.category_id);
                                        return (
                                    <motion.div key={company.id} whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.2), 0 4px 6px -2px rgba(251, 191, 36, 0.1)' }}>
                                                <Link to={`/empresa/${company.slug}`} className="block bg-white rounded-lg shadow-md h-full transition-shadow border-2 border-yellow-400 relative overflow-hidden">
                                            <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900">Premium</Badge>
                                            <CardContent className="p-6 flex items-center space-x-4">
                                                        {company.profile_image_url ? (
                                                            <img src={company.profile_image_url} alt={company.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                                                        ) : (
                                                            <div className="text-4xl flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                                {company.name?.charAt(0) || '?'}
                                                            </div>
                                                        )}
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
                                                            <p className="text-sm text-gray-500">{category?.name || 'Sem categoria'}</p>
                                                    <p className="text-sm text-blue-600 hover:underline mt-1">Ver perfil</p>
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </motion.div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                    {otherCompanies.length > 0 && (
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-2">Demais Empresas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {otherCompanies.map((company) => {
                                        const category = categories.find(c => c.id === company.category_id);
                                        return (
                                    <motion.div key={company.id} whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
                                                <Link to={`/empresa/${company.slug}`} className="block bg-white rounded-lg shadow-md h-full transition-shadow">
                                            <CardContent className="p-6 flex items-center space-x-4">
                                                        {company.profile_image_url ? (
                                                            <img src={company.profile_image_url} alt={company.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                                                        ) : (
                                                            <div className="text-4xl flex-shrink-0 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                                {company.name?.charAt(0) || '?'}
                                                            </div>
                                                        )}
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{company.name}</h3>
                                                            <p className="text-sm text-gray-500">{category?.name || 'Sem categoria'}</p>
                                                    <p className="text-sm text-blue-600 hover:underline mt-1">Ver perfil</p>
                                                </div>
                                            </CardContent>
                                        </Link>
                                    </motion.div>
                                        );
                                    })}
                            </div>
                        </div>
                    )}

                        {filteredCompanies.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma empresa encontrada</h3>
                                <p className="text-gray-600 mb-4">Tente ajustar os filtros ou volte mais tarde!</p>
                            <Button onClick={resetFilters} className="mt-4">Limpar busca e filtros</Button>
                        </div>
                     )}
                </motion.div>
                )}
            </div>
        </div>
    );
};

export default Companies;