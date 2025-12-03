import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Briefcase, CheckCircle, Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash } from 'lucide-react';


const AdminModerateJobs = () => {
    const { toast } = useToast();
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);

    const initialJobs = [
        { id: 1, title: "Desenvolvedor Full Stack Sênior", company: "Tech Solutions Ltda", location: "Remoto", type: "CLT", salary: "R$ 12.000", category: "tecnologia", level: 'senior', description: "Buscamos desenvolvedor experiente em React, Node.js e bancos de dados para integrar nossa equipe de desenvolvimento de produtos inovadores.", requirements: ["React", "Node.js", "PostgreSQL", "AWS", "5+ anos de experiência"], benefits: ["Vale refeição", "Plano de saúde", "Home office", "Participação nos lucros"], postedDate: "2025-09-05", status: 'Aprovada' },
        { id: 2, title: "Analista de Marketing Digital Pleno", company: "Marketing Pro", location: "São João do Paraíso, MG", type: "CLT", salary: "R$ 6.500", category: "marketing", level: 'pleno', description: "Profissional para gerenciar campanhas digitais, análise de métricas e estratégias de crescimento em redes sociais.", requirements: ["Google Ads", "Facebook Ads", "Analytics", "2+ anos de experiência"], benefits: ["Vale refeição", "Plano de saúde", "Flexibilidade de horário"], postedDate: "2025-09-04", status: 'Aprovada' },
        { id: 3, title: "Vendedor Externo", company: "Vendas & Cia", location: "São João do Paraíso, MG", type: "PJ", salary: "R$ 2.500 + comissões", category: "vendas", level: 'junior', description: "Oportunidade para vendedor experiente com foco em B2B.", requirements: ["Experiência em vendas B2B", "CNH", "Disponibilidade para viagens"], benefits: ["Carro da empresa", "Combustível", "Comissões atrativas"], postedDate: "2025-09-03", status: 'Pendente' },
        { id: 4, title: 'Auxiliar de Escritório', company: 'Contabilidade Central', location: "São João do Paraíso, MG", type: "CLT", salary: "R$ 1.800", category: 'administrativo', level: 'junior', description: 'Realizar tarefas de escritório.', requirements:['Ensino Médio'], benefits:['VT'], postedDate: '2025-09-02', status: 'Recusada' },
    ];
    
    useEffect(() => {
        const storedJobs = JSON.parse(localStorage.getItem('ppo_jobs')) || initialJobs;
        if (!localStorage.getItem('ppo_jobs')) {
            localStorage.setItem('ppo_jobs', JSON.stringify(initialJobs));
        }
        setJobs(storedJobs);
    }, []);

    const saveJobs = (newJobs) => {
        setJobs(newJobs);
        localStorage.setItem('ppo_jobs', JSON.stringify(newJobs));
    };

    const handleStatusChange = (jobId, newStatus) => {
        const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j);
        saveJobs(updatedJobs);
        toast({ title: `Status da vaga alterado para ${newStatus}.` });
    };

    const handleDelete = (jobId) => {
        const updatedJobs = jobs.filter(j => j.id !== jobId);
        saveJobs(updatedJobs);
        toast({ title: 'Vaga excluída com sucesso.', variant: 'destructive' });
    };

    const handleSaveJob = (jobData) => {
        if (currentJob) {
            const updatedJobs = jobs.map(j => j.id === currentJob.id ? { ...j, ...jobData } : j);
            saveJobs(updatedJobs);
            toast({ title: "Vaga atualizada com sucesso!" });
        } else {
            const newJob = { ...jobData, id: Date.now(), postedDate: new Date().toISOString().split('T')[0] };
            saveJobs([...jobs, newJob]);
            toast({ title: "Nova vaga criada com sucesso!" });
        }
        setIsDialogOpen(false);
        setCurrentJob(null);
    };

    const openDialog = (job = null) => {
        setCurrentJob(job);
        setIsDialogOpen(true);
    };

    const filteredJobs = jobs.filter(j => {
        const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.company.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || j.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Aprovada': return 'default';
            case 'Pendente': return 'secondary';
            case 'Recusada': return 'destructive';
            case 'Encerrada': return 'outline';
            default: return 'outline';
        }
    };
    
    const JobForm = ({ job, onSave }) => {
        const [formData, setFormData] = useState({
            title: job?.title || '',
            company: job?.company || '',
            location: job?.location || '',
            type: job?.type || 'CLT',
            level: job?.level || 'junior',
            salary: job?.salary || '',
            category: job?.category || 'vendas',
            description: job?.description || '',
            requirements: job?.requirements?.join(', ') || '',
            benefits: job?.benefits?.join(', ') || '',
            status: job?.status || 'Pendente',
            publishDate: job?.publishDate || ''
        });

        const handleChange = (e) => {
            const { id, value } = e.target;
            setFormData(prev => ({...prev, [id]: value}));
        };

        const handleSelectChange = (id, value) => {
            setFormData(prev => ({...prev, [id]: value}));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            const finalData = {
                ...formData,
                requirements: formData.requirements.split(',').map(s => s.trim()),
                benefits: formData.benefits.split(',').map(s => s.trim())
            };
            onSave(finalData);
        };
        
        return (
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div><Label htmlFor="title" className="text-gray-800">Título do Cargo</Label><Input id="title" value={formData.title} onChange={handleChange} required className="border-gray-400 bg-white"/></div>
                   <div><Label htmlFor="company" className="text-gray-800">Empresa</Label><Input id="company" value={formData.company} onChange={handleChange} required className="border-gray-400 bg-white"/></div>
                   <div><Label htmlFor="location" className="text-gray-800">Localização</Label><Input id="location" value={formData.location} onChange={handleChange} className="border-gray-400 bg-white"/></div>
                   <div><Label htmlFor="salary" className="text-gray-800">Salário/Remuneração</Label><Input id="salary" value={formData.salary} onChange={handleChange} className="border-gray-400 bg-white"/></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label className="text-gray-800">Tipo de Contratação</Label><Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}><SelectTrigger className="border-gray-400 bg-white"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="CLT">CLT</SelectItem><SelectItem value="PJ">PJ</SelectItem><SelectItem value="Estágio">Estágio</SelectItem><SelectItem value="Temporário">Temporário</SelectItem></SelectContent></Select></div>
                    <div><Label className="text-gray-800">Nível</Label><Select value={formData.level} onValueChange={(v) => handleSelectChange('level', v)}><SelectTrigger className="border-gray-400 bg-white"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="junior">Júnior</SelectItem><SelectItem value="pleno">Pleno</SelectItem><SelectItem value="senior">Sênior</SelectItem></SelectContent></Select></div>
                    <div><Label className="text-gray-800">Categoria</Label><Select value={formData.category} onValueChange={(v) => handleSelectChange('category', v)}><SelectTrigger className="border-gray-400 bg-white"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="vendas">Vendas</SelectItem><SelectItem value="tecnologia">Tecnologia</SelectItem><SelectItem value="marketing">Marketing</SelectItem><SelectItem value="administrativo">Administrativo</SelectItem></SelectContent></Select></div>
                </div>
                <div><Label htmlFor="description" className="text-gray-800">Descrição</Label><Textarea id="description" value={formData.description} onChange={handleChange} className="border-gray-400 bg-white" /></div>
                <div><Label htmlFor="requirements" className="text-gray-800">Requisitos (separados por vírgula)</Label><Input id="requirements" value={formData.requirements} onChange={handleChange} className="border-gray-400 bg-white"/></div>
                <div><Label htmlFor="benefits" className="text-gray-800">Benefícios (separados por vírgula)</Label><Input id="benefits" value={formData.benefits} onChange={handleChange} className="border-gray-400 bg-white"/></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div><Label className="text-gray-800">Status da Vaga</Label><Select value={formData.status} onValueChange={(v) => handleSelectChange('status', v)}><SelectTrigger className="border-gray-400 bg-white"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Aprovada">Aprovada</SelectItem><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Recusada">Recusada</SelectItem><SelectItem value="Encerrada">Encerrada</SelectItem></SelectContent></Select></div>
                   <div><Label htmlFor="publishDate" className="text-gray-800">Agendar Publicação (opcional)</Label><Input id="publishDate" type="date" value={formData.publishDate} onChange={handleChange} className="border-gray-400 bg-white"/></div>
                </div>
                <DialogFooter className="mt-6 pt-4 border-t border-gray-300">
                    <DialogClose asChild><Button type="button" style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</Button></DialogClose>
                    <Button type="submit" style={{backgroundColor: '#28a745', color: '#fff'}}>Salvar Vaga</Button>
                </DialogFooter>
            </form>
        )
    }

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Admin: Moderar Vagas</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <Briefcase className="mr-3 text-indigo-600" /> Moderar Vagas de Emprego
                        </h1>
                        <p className="text-gray-700 mt-1">Aprove, edite e gerencie as vagas publicadas no portal.</p>
                    </div>
                    <Button onClick={() => openDialog()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle size={16} className="mr-2" /> Nova Vaga</Button>
                </div>
                <Card className="border-gray-400 bg-white">
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <Input 
                                    placeholder="Buscar por título ou empresa..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-gray-400 bg-white"
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-[180px] border-gray-400 bg-white">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                    <SelectItem value="Aprovada">Aprovada</SelectItem>
                                    <SelectItem value="Recusada">Recusada</SelectItem>
                                    <SelectItem value="Encerrada">Encerrada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto border rounded-lg border-gray-400">
                            <Table>
                                <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400">
                                    <TableHead className="text-gray-800 font-semibold">Vaga</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Empresa</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Data</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                    <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                </TableRow></TableHeader>
                                <TableBody>
                                    {filteredJobs.map(item => (
                                        <TableRow key={item.id} className="border-b border-gray-300">
                                            <TableCell className="font-medium text-gray-900">{item.title}</TableCell>
                                            <TableCell className="text-gray-700">{item.company}</TableCell>
                                            <TableCell className="text-gray-700">{new Date(item.postedDate).toLocaleDateString('pt-BR')}</TableCell>
                                            <TableCell><Badge variant={getStatusBadge(item.status)}>{item.status}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-1 justify-end">
                                                    {item.status === 'Pendente' && (
                                                        <Button onClick={() => handleStatusChange(item.id, 'Aprovada')} variant="ghost" size="icon" title="Aprovar" style={{color: '#28a745'}}><CheckCircle size={16} /></Button>
                                                    )}
                                                    <Button onClick={() => openDialog(item)} variant="ghost" size="icon" title="Editar" style={{color: '#007bff'}}><Edit size={16} /></Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Excluir" style={{color: '#dc3545'}}><Trash size={16} /></Button></AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Deseja realmente excluir a vaga "{item.title}"?</AlertDialogDescription></AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(item.id)} style={{backgroundColor: '#dc3545', color: '#fff'}}>Excluir</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-2xl lg:max-w-4xl border-gray-400 bg-gray-100">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 text-2xl">{currentJob ? 'Editar Vaga' : 'Criar Nova Vaga'}</DialogTitle>
                        <CardDescription>Preencha as informações abaixo.</CardDescription>
                    </DialogHeader>
                    <JobForm job={currentJob} onSave={handleSaveJob} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminModerateJobs;