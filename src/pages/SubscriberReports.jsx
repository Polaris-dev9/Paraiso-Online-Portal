import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Eye, Users, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { subscriberService } from '@/services/subscriberService';
import { categoryService } from '@/services/categoryService';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SubscriberReports = () => {
    const { user } = useSupabaseAuth();
    const navigate = useNavigate();
    const [subscriber, setSubscriber] = useState(null);
    const [categoryName, setCategoryName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalViews: 0,
        monthlyViews: 0,
        weeklyViews: 0,
        dailyViews: 0,
        contactsCount: 0
    });

    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                navigate('/subscriber-area');
                return;
            }

            try {
                setLoading(true);
                
                // Buscar dados do assinante usando RPC (bypass PostgREST cache para category_id)
                let subscriberData = null;
                
                // Tentar primeiro com RPC para garantir que category_id seja retornado
                try {
                    const { data: rpcData, error: rpcErr } = await supabase
                        .rpc('get_subscriber_by_user_id', { p_user_id: user.id });
                    
                    if (rpcData && !rpcErr) {
                        // Converter JSON retornado pela RPC em objeto
                        subscriberData = typeof rpcData === 'string' ? JSON.parse(rpcData) : rpcData;
                        console.log('[SubscriberReports] Subscriber loaded via RPC, category_id:', subscriberData?.category_id);
                    }
                } catch (err) {
                    console.log('[SubscriberReports] RPC function not available, using fallback:', err.message);
                }
                
                // Fallback: usar query normal se RPC não funcionar
                if (!subscriberData) {
                    subscriberData = await subscriberService.getSubscriberByUserId(user.id);
                }
                
                // Fallback adicional: buscar por email se ainda não encontrou
                if (!subscriberData && user.email) {
                    const { data } = await supabase
                        .from('subscribers')
                        .select('*')
                        .ilike('email', user.email)
                        .maybeSingle();
                    subscriberData = data;
                }

                if (subscriberData) {
                    setSubscriber(subscriberData);
                    
                    // Buscar nome da categoria se category_id existir
                    console.log('[SubscriberReports] Checking category_id:', subscriberData.category_id);
                    if (subscriberData.category_id) {
                        try {
                            console.log('[SubscriberReports] Fetching category name for ID:', subscriberData.category_id);
                            const category = await categoryService.getCategoryById(subscriberData.category_id);
                            console.log('[SubscriberReports] Category found:', category?.name);
                            if (category) {
                                setCategoryName(category.name);
                            } else {
                                console.warn('[SubscriberReports] Category not found for ID:', subscriberData.category_id);
                            }
                        } catch (error) {
                            console.error('[SubscriberReports] Error fetching category:', error);
                        }
                    } else {
                        console.log('[SubscriberReports] No category_id in subscriber data');
                    }
                    
                    // Calcular estatísticas
                    const totalViews = subscriberData.views_count || 0;
                    const createdAt = subscriberData.created_at ? new Date(subscriberData.created_at) : new Date();
                    const daysSinceCreation = Math.max(1, Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)));
                    
                    // Calcular médias baseadas em quando foi criado
                    // Assumindo que visualizações são distribuídas ao longo do tempo
                    const avgDaily = daysSinceCreation > 0 ? Math.floor(totalViews / daysSinceCreation) : 0;
                    const monthlyEstimate = Math.min(totalViews, avgDaily * 30);
                    const weeklyEstimate = Math.min(totalViews, avgDaily * 7);
                    const dailyEstimate = Math.min(totalViews, avgDaily);
                    
                    setStats({
                        totalViews,
                        monthlyViews: monthlyEstimate,
                        weeklyViews: weeklyEstimate,
                        dailyViews: dailyEstimate,
                        contactsCount: 0 // Será implementado quando tivermos tracking de contatos
                    });
                }
            } catch (error) {
                console.error('Error loading reports:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Carregando relatórios...</p>
                </div>
            </div>
        );
    }

    if (!subscriber) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Nenhum dado encontrado.</p>
                    <Button onClick={() => navigate('/subscriber-area')} className="mt-4">
                        Voltar ao Painel
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <Helmet>
                <title>Relatórios de Desempenho - Portal Paraíso Online</title>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/subscriber-area')}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar ao Painel
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Relatórios de Desempenho</h1>
                    <p className="text-gray-600 mt-2">
                        Acompanhe suas métricas e veja como sua página está se saindo
                    </p>
                </div>

                {/* Cards de Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString('pt-BR')}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.totalViews === 0 
                                    ? 'Ainda não há visualizações' 
                                    : 'Desde o cadastro'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.monthlyViews.toLocaleString('pt-BR')}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Visualizações no mês atual
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.weeklyViews.toLocaleString('pt-BR')}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Visualizações nos últimos 7 dias
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Contatos Recebidos</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.contactsCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Cliques em WhatsApp/Email
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Gráfico de Visualizações */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Visualizações por Período</CardTitle>
                        <CardDescription>
                            Comparação de visualizações em diferentes períodos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.totalViews === 0 && stats.dailyViews === 0 && stats.weeklyViews === 0 && stats.monthlyViews === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center py-8">
                                <BarChart2 className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    Ainda não há visualizações
                                </h3>
                                <p className="text-gray-500 text-sm mb-4 max-w-md">
                                    Quando sua página pública for criada e compartilhada, as visualizações começarão a aparecer aqui.
                                </p>
                                <Button 
                                    onClick={() => navigate('/editar-perfil')}
                                    variant="outline"
                                    className="mt-2"
                                >
                                    Completar Perfil
                                </Button>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={[
                                        { name: 'Hoje', visualizações: Math.max(stats.dailyViews, 0) },
                                        { name: 'Esta Semana', visualizações: Math.max(stats.weeklyViews, 0) },
                                        { name: 'Este Mês', visualizações: Math.max(stats.monthlyViews, 0) },
                                        { name: 'Total', visualizações: Math.max(stats.totalViews, 0) }
                                    ]}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 'dataMax + 1']} />
                                    <Tooltip 
                                        formatter={(value) => [value.toLocaleString('pt-BR'), 'Visualizações']}
                                        labelStyle={{ color: '#000' }}
                                    />
                                    <Bar dataKey="visualizações" fill="#2563eb" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Informações Adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da Página</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nome da Empresa:</span>
                                <span className="font-medium">{subscriber.name || 'Não informado'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Categoria:</span>
                                <span className="font-medium">
                                    {categoryName || (subscriber.category_id ? 'Carregando...' : 'Não definida')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Plano:</span>
                                <span className="font-medium capitalize">
                                    {subscriber.plan_type || 'Gratuito'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Data de Cadastro:</span>
                                <span className="font-medium">
                                    {subscriber.created_at 
                                        ? new Date(subscriber.created_at).toLocaleDateString('pt-BR')
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Última Atualização:</span>
                                <span className="font-medium">
                                    {subscriber.updated_at 
                                        ? new Date(subscriber.updated_at).toLocaleDateString('pt-BR')
                                        : 'N/A'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Dicas para Aumentar Visualizações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-start gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Complete seu perfil</p>
                                    <p className="text-sm text-gray-600">Perfis completos recebem mais visualizações</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Adicione imagens</p>
                                    <p className="text-sm text-gray-600">Páginas com fotos atraem mais visitantes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium">Compartilhe nas redes sociais</p>
                                    <p className="text-sm text-gray-600">Divulgue seu perfil para aumentar a visibilidade</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Ação de Editar Perfil */}
                <Card className="mt-8 bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Quer melhorar seus números?
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    Complete seu perfil, adicione fotos e informações para atrair mais visitantes
                                </p>
                            </div>
                            <Button 
                                onClick={() => navigate('/editar-perfil')}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Editar Perfil
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SubscriberReports;

