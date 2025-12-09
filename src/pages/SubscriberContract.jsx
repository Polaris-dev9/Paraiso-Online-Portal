import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { 
    FileText, Download, Printer, RefreshCw, AlertCircle, 
    CheckCircle2, Clock, XCircle, ArrowLeft, Calendar,
    DollarSign, CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import contractService from '@/services/contractService';
import subscriberService from '@/services/subscriberService';

const SubscriberContract = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user } = useSupabaseAuth();
    const [loading, setLoading] = useState(true);
    const [subscriber, setSubscriber] = useState(null);
    const [activeContract, setActiveContract] = useState(null);
    const [contractHistory, setContractHistory] = useState([]);
    const [renewing, setRenewing] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!user) {
                navigate('/subscriber-area');
                return;
            }

            try {
                setLoading(true);
                
                // Buscar dados do assinante
                const subscriberData = await subscriberService.getSubscriberByUserId(user.id);
                if (!subscriberData) {
                    toast({
                        variant: 'destructive',
                        title: 'Erro',
                        description: 'Dados do assinante não encontrados.'
                    });
                    navigate('/subscriber-area');
                    return;
                }

                setSubscriber(subscriberData);

                // Buscar contratos
                const contracts = await contractService.getContractsBySubscriberId(subscriberData.id);
                
                // Separar contrato ativo e histórico
                const active = await contractService.getActiveContract(subscriberData.id);
                setActiveContract(active);
                
                setContractHistory(contracts.filter(c => c.id !== active?.id));

            } catch (error) {
                console.error('Error loading contracts:', error);
                toast({
                    variant: 'destructive',
                    title: 'Erro',
                    description: 'Erro ao carregar contratos.'
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user, navigate, toast]);

    const handleRenew = async () => {
        if (!activeContract) return;

        try {
            setRenewing(true);
            const newContract = await contractService.renewContract(activeContract.id);
            
            toast({
                title: 'Sucesso',
                description: 'Contrato renovado com sucesso!'
            });

            // Recarregar dados
            const contracts = await contractService.getContractsBySubscriberId(subscriber.id);
            const active = await contractService.getActiveContract(subscriber.id);
            setActiveContract(active);
            setContractHistory(contracts.filter(c => c.id !== active?.id));

        } catch (error) {
            console.error('Error renewing contract:', error);
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: error.message || 'Erro ao renovar contrato.'
            });
        } finally {
            setRenewing(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        // TODO: Implementar geração de PDF
        toast({
            title: 'Em breve',
            description: 'Download em PDF será implementado em breve.'
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const formatCurrency = (value) => {
        if (!value) return 'Gratuito';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusBadge = (status, contract) => {
        const isExpired = contract ? contractService.isContractExpired(contract) : false;
        const isExpiringSoon = contract ? contractService.isContractExpiringSoon(contract) : false;

        if (isExpired) {
            return <Badge className="bg-red-600 text-white">Expirado</Badge>;
        }
        if (isExpiringSoon) {
            return <Badge className="bg-yellow-600 text-white">Vencendo em breve</Badge>;
        }

        switch (status) {
            case 'paid':
                return <Badge className="bg-green-600 text-white">Pago</Badge>;
            case 'pending':
                return <Badge variant="secondary">Pendente</Badge>;
            case 'expired':
                return <Badge className="bg-red-600 text-white">Expirado</Badge>;
            case 'cancelled':
                return <Badge variant="outline">Cancelado</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPlanTypeLabel = (planType) => {
        const plans = {
            'gratuito': 'Gratuito',
            'essencial': 'Essencial',
            'premium': 'Premium'
        };
        return plans[planType] || planType;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando contratos...</p>
                </div>
            </div>
        );
    }

    const daysUntilExpiry = activeContract ? contractService.getDaysUntilExpiry(activeContract) : null;
    const isExpiringSoon = activeContract ? contractService.isContractExpiringSoon(activeContract) : false;
    const isExpired = activeContract ? contractService.isContractExpired(activeContract) : false;

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <Helmet>
                <title>Meus Contratos - Portal Paraíso Online</title>
                <meta name="description" content="Gerencie seus contratos de assinatura do Portal Paraíso Online." />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="mb-8"
                >
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/subscriber-area')}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2" /> Voltar ao Painel
                    </Button>
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4 flex items-center">
                        <FileText className="mr-3" /> Meus Contratos
                    </h1>
                    <p className="text-xl text-gray-600">
                        Gerencie seus contratos e renovações
                    </p>
                </motion.div>

                {/* Alertas */}
                {isExpiringSoon && activeContract && (
                    <Alert variant="warning" className="mb-6 border-yellow-500/50 bg-yellow-50 text-yellow-900">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertTitle className="text-yellow-900">Atenção: Contrato vencendo</AlertTitle>
                        <AlertDescription className="text-yellow-800">
                            Seu contrato vence em {daysUntilExpiry} {daysUntilExpiry === 1 ? 'dia' : 'dias'}. 
                            Renove agora para evitar a suspensão dos serviços.
                        </AlertDescription>
                    </Alert>
                )}

                {isExpired && activeContract && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Contrato Expirado</AlertTitle>
                        <AlertDescription>
                            Seu contrato expirou. Renove agora para restaurar seus serviços.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Contrato Ativo */}
                {activeContract && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <Card className="border-2 border-blue-600">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center text-blue-900">
                                            <CheckCircle2 className="mr-2 text-green-600" />
                                            Contrato Ativo
                                        </CardTitle>
                                        <CardDescription className="mt-2">
                                            Plano: <strong>{getPlanTypeLabel(activeContract.plan_type)}</strong>
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(activeContract.payment_status, activeContract)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center">
                                        <Calendar className="mr-3 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Início</p>
                                            <p className="font-semibold">{formatDate(activeContract.start_date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-3 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Término</p>
                                            <p className="font-semibold">{formatDate(activeContract.end_date)}</p>
                                            {daysUntilExpiry !== null && (
                                                <p className="text-xs text-gray-400">
                                                    {daysUntilExpiry > 0 
                                                        ? `${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'dia restante' : 'dias restantes'}`
                                                        : daysUntilExpiry === 0 
                                                        ? 'Vence hoje'
                                                        : `Expirado há ${Math.abs(daysUntilExpiry)} ${Math.abs(daysUntilExpiry) === 1 ? 'dia' : 'dias'}`
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <DollarSign className="mr-3 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Valor</p>
                                            <p className="font-semibold">{formatCurrency(activeContract.amount)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <CreditCard className="mr-3 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Cobrança</p>
                                            <p className="font-semibold">
                                                {activeContract.billing_cycle === 'annual' ? 'Anual' : 'Mensal'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button 
                                        onClick={handleRenew} 
                                        disabled={renewing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <RefreshCw className={`mr-2 ${renewing ? 'animate-spin' : ''}`} />
                                        {renewing ? 'Renovando...' : 'Renovar Contrato'}
                                    </Button>
                                    <Button onClick={handleDownload} variant="outline">
                                        <Download className="mr-2" /> Baixar PDF
                                    </Button>
                                    <Button onClick={handlePrint} variant="outline">
                                        <Printer className="mr-2" /> Imprimir
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Sem contrato ativo */}
                {!activeContract && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Nenhum contrato ativo</AlertTitle>
                            <AlertDescription>
                                Você não possui um contrato ativo no momento. Entre em contato conosco para criar um novo contrato.
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {/* Histórico de Contratos */}
                {contractHistory.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Histórico de Contratos</h2>
                        <div className="space-y-4">
                            {contractHistory.map((contract) => (
                                <Card key={contract.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {getPlanTypeLabel(contract.plan_type)}
                                                </CardTitle>
                                                <CardDescription>
                                                    {formatDate(contract.start_date)} - {formatDate(contract.end_date)}
                                                </CardDescription>
                                            </div>
                                            {getStatusBadge(contract.payment_status, contract)}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Valor</p>
                                                <p className="font-semibold">{formatCurrency(contract.amount)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Cobrança</p>
                                                <p className="font-semibold">
                                                    {contract.billing_cycle === 'annual' ? 'Anual' : 'Mensal'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Criado em</p>
                                                <p className="font-semibold">{formatDate(contract.created_at)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Termos do Contrato */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.3 }}
                    className="mt-8 bg-white rounded-lg shadow-lg p-8"
                >
                    <h2 className="text-2xl font-bold text-blue-900 mb-6">Termos e Condições</h2>
                    <div className="prose prose-lg max-w-none">
                        <h3 className="text-blue-800">CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PUBLICIDADE</h3>
                        <p><strong>CONTRATANTE:</strong> {subscriber?.name || '[Nome da Empresa/Profissional]'}, doravante denominado(a) ASSINANTE.</p>
                        <p><strong>CONTRATADA:</strong> Paraiso Online Digital LTDA, CNPJ: 21.130.723/0001-85, doravante denominada PORTAL.</p>
                        
                        <h4>Cláusula 1ª - Do Objeto</h4>
                        <p>O presente contrato tem por objeto a prestação de serviços de publicidade e divulgação do ASSINANTE no site Portal Paraíso Online, conforme o plano de assinatura escolhido.</p>

                        <h4>Cláusula 2ª - Dos Planos e Serviços</h4>
                        <p>Os serviços variam conforme o plano (Gratuito, Essencial, Premium) e incluem, mas não se limitam a: criação de página personalizada, destaque em buscas, inclusão no Guia Comercial/Profissional, e, para o plano Premium, criação de loja virtual no ParaísoShop.</p>

                        <h4>Cláusula 3ª - Das Obrigações do Portal</h4>
                        <p>Manter o portal no ar, oferecer suporte técnico, garantir a visibilidade contratada e fornecer acesso ao painel do assinante para gerenciamento das informações.</p>

                        <h4>Cláusula 4ª - Das Obrigações do Assinante</h4>
                        <p>Fornecer informações verídicas e atualizadas, efetuar os pagamentos em dia e utilizar a plataforma de acordo com os Termos de Uso.</p>

                        <h4>Cláusula 5ª - Do Pagamento</h4>
                        <p>O pagamento será recorrente (mensal ou anual) de acordo com o plano escolhido. A falta de pagamento poderá acarretar na suspensão dos serviços após 10 dias de vencimento.</p>

                        <h4>Cláusula 6ª - Da Vigência e Rescisão</h4>
                        <p>O contrato tem vigência enquanto a assinatura estiver ativa. Pode ser rescindido por qualquer uma das partes mediante aviso prévio de 30 dias. Não haverá reembolso por períodos já pagos.</p>

                        <p className="mt-8 text-center italic">E por estarem justos e contratados, assinam o presente instrumento em duas vias de igual teor e forma.</p>
                        <p className="text-center">São João do Paraíso, {new Date().toLocaleDateString('pt-BR')}.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SubscriberContract;