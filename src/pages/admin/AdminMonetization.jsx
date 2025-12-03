import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { DollarSign, BarChart, PlusCircle, Edit, Trash, Save, MessageCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PlanForm = ({ plan, onSave, onCancel }) => {
    const [data, setData] = useState(plan);
    const [features, setFeatures] = useState(plan.features || '');

    useEffect(() => {
        setData(plan);
        setFeatures(plan.features || '');
    }, [plan]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...data, features });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label htmlFor="plan-name">Nome do Plano</Label><Input id="plan-name" value={data.name} onChange={e => setData({...data, name: e.target.value})} required/></div>
            <div><Label htmlFor="plan-price">Preço Mensal (R$)</Label><Input id="plan-price" type="number" step="0.01" value={data.price} onChange={e => setData({...data, price: e.target.value})} required/></div>
            <div><Label htmlFor="plan-installments">Preço Anual Parcelado</Label><Input id="plan-installments" placeholder="Ex: 10x de R$ 69,00" value={data.installments} onChange={e => setData({...data, installments: e.target.value})} required/></div>
            <div><Label htmlFor="plan-features">Recursos (separados por vírgula)</Label><Textarea id="plan-features" value={features} onChange={e => setFeatures(e.target.value)} placeholder="Recurso 1, Recurso 2, Recurso 3" /></div>
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button type="submit"><Save className="mr-2 h-4 w-4" />Salvar Plano</Button>
            </DialogFooter>
        </form>
    );
}

const AdminMonetization = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const isMaster = user?.role === 'master';

    const [adSpots, setAdSpots] = useState([
        { id: 1, name: 'Banner Topo (Home)', plan: 'Premium', clicks: 1250, revenue: 250.00 },
        { id: 2, name: 'Banner Lateral (Notícias)', plan: 'Premium', clicks: 830, revenue: 120.00 },
        { id: 3, name: 'Rodapé (Todas as páginas)', plan: 'Essencial', clicks: 2100, revenue: 150.00 },
    ]);

    const [plans, setPlans] = useState([
        { id: 1, name: 'Gratuito', price: 0.00, installments: 'R$ 0,00', features: 'Perfil básico,Logo e endereço,Telefone não clicável' },
        { id: 2, name: 'Essencial', price: 59.90, installments: '10x de R$ 69,00', features: 'Página personalizada,Galeria (10 fotos),Botão WhatsApp' },
        { id: 3, name: 'Premium', price: 99.90, installments: '10x de R$ 119,00', features: 'Tudo do Essencial,Divulgação social,Banners (topo, rodapé, lateral)' },
        { id: 4, name: 'Premium VIP', price: 129.90, installments: '10x de R$ 139,00', features: 'Tudo do Premium,Loja Virtual,Banner Vídeo,Treinamento IA' },
    ]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);

    const chartOptions = {
      responsive: true,
      plugins: { legend: { position: 'top' }, title: { display: true, text: 'Receita por Espaço Publicitário (Últimos 30 dias)' } },
    };

    const chartData = {
      labels: adSpots.map(ad => ad.name),
      datasets: [{ label: 'Receita (R$)', data: adSpots.map(ad => ad.revenue), backgroundColor: 'rgba(0, 123, 255, 0.7)' }],
    };
    
    const handleOpenPlanForm = (plan = null) => {
        setCurrentPlan(plan || { id: null, name: '', price: '', installments: '', features: '' });
        setIsPlanFormOpen(true);
    };
    
    const handleSavePlan = (planData) => {
        const updatedPlans = planData.id ? plans.map(p => p.id === planData.id ? planData : p) : [...plans, {...planData, id: Date.now()}];
        setPlans(updatedPlans);
        setIsPlanFormOpen(false);
        toast({ title: `Plano ${planData.id ? 'Atualizado' : 'Criado'}!`, description: `O plano "${planData.name}" foi salvo.` });
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Monetização</title></Helmet>

             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><DollarSign className="mr-3 text-green-600" /> Monetização</h1>
                    <p className="text-gray-700 mt-1">Gerencie anúncios, planos e relatórios de receita.</p>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList className="grid w-full bg-gray-300 grid-cols-3">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="ad_spots">Espaços Publicitários</TabsTrigger>
                        <TabsTrigger value="plans">Planos de Assinatura</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4">
                         <Card className="border-gray-400 bg-white"><CardHeader><CardTitle className="text-gray-900">Relatório de Performance</CardTitle></CardHeader><CardContent><div className="h-96"><Bar options={chartOptions} data={chartData} /></div></CardContent></Card>
                    </TabsContent>

                    <TabsContent value="ad_spots" className="mt-4">
                        <Card className="border-gray-400 bg-white"><CardHeader><CardTitle className="text-gray-900">Gerenciar Espaços Publicitários</CardTitle></CardHeader><CardContent>
                            <div className="overflow-x-auto border rounded-lg border-gray-400"><Table><TableHeader className="bg-gray-200"><TableRow><TableHead className="text-gray-800">Nome</TableHead><TableHead className="text-gray-800">Plano Atribuído</TableHead><TableHead className="text-gray-800">Cliques (30d)</TableHead><TableHead className="text-gray-800">Receita (30d)</TableHead></TableRow></TableHeader><TableBody>{adSpots.map(spot => (<TableRow key={spot.id}><TableCell>{spot.name}</TableCell><TableCell><Badge>{spot.plan}</Badge></TableCell><TableCell>{spot.clicks}</TableCell><TableCell className="text-green-700 font-semibold">R$ {spot.revenue.toFixed(2)}</TableCell></TableRow>))}</TableBody></Table></div>
                        </CardContent></Card>
                    </TabsContent>

                    <TabsContent value="plans" className="mt-4">
                        <Card className="border-gray-400 bg-white"><CardHeader className="flex flex-row justify-between items-center"><div><CardTitle className="text-gray-900">Planos de Assinatura</CardTitle><CardDescription className="text-gray-600">Crie e gerencie os pacotes de assinatura do portal.</CardDescription></div>{isMaster && <Button onClick={() => handleOpenPlanForm()} style={{backgroundColor: '#007bff', color: '#fff'}}><PlusCircle size={16} className="mr-2"/> Novo Plano</Button>}</CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto border rounded-lg border-gray-400"><Table><TableHeader className="bg-gray-200"><TableRow><TableHead className="text-gray-800">Nome</TableHead><TableHead className="text-gray-800">Preço (Mês)</TableHead><TableHead className="text-gray-800">Parcelado (Ano)</TableHead><TableHead className="text-gray-800">Recursos</TableHead>{isMaster && <TableHead className="text-right text-gray-800">Ações</TableHead>}</TableRow></TableHeader>
                                    <TableBody>{plans.map(plan => (<TableRow key={plan.id}><TableCell className="font-medium">{plan.name}</TableCell><TableCell>R$ {plan.price.toFixed(2)}</TableCell><TableCell>{plan.installments}</TableCell><TableCell className="text-sm text-gray-600">{plan.features.split(',').join(', ')}</TableCell>{isMaster && <TableCell className="text-right"><Button onClick={() => handleOpenPlanForm(plan)} variant="ghost" size="icon" title="Editar"><Edit size={16}/></Button></TableCell>}</TableRow>))}</TableBody>
                                </Table></div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
             </motion.div>
             <Dialog open={isPlanFormOpen} onOpenChange={setIsPlanFormOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentPlan?.id ? 'Editar' : 'Novo'} Plano</DialogTitle></DialogHeader>
                    <PlanForm plan={currentPlan} onSave={handleSavePlan} onCancel={() => setIsPlanFormOpen(false)} />
                </DialogContent>
             </Dialog>
        </div>
    );
};

export default AdminMonetization;