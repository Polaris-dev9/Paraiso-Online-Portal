import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Building, PlusCircle, Edit, Trash2, Search, Filter, BarChart, DollarSign, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminManageFranchises = () => {
    const { toast } = useToast();
    
    const [franchises, setFranchises] = useState([
        { id: 1, city: 'São João do Paraíso', responsible: 'Admin Master', status: 'Ativa', domain: 'sjparaiso.com', revenue: 12500.00, nextPayment: '2025-10-01' },
        { id: 2, city: 'Taiobeiras', responsible: 'João Silva', status: 'Pendente', domain: 'taiobeiras.sjparaiso.com', revenue: 0, nextPayment: null },
        { id: 3, city: 'Salinas', responsible: 'Maria Souza', status: 'Inativa', domain: 'salinas.sjparaiso.com', revenue: 1500.00, nextPayment: '2025-09-15' },
    ]);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentFranchise, setCurrentFranchise] = useState(null);

    const handleOpenForm = (franchise = null) => {
        setCurrentFranchise(franchise || { city: '', responsible: '', status: 'Pendente', domain: '', revenue: 0, nextPayment: '' });
        setIsFormOpen(true);
    };

    const handleSaveFranchise = (e) => {
        e.preventDefault();
        toast({ title: "✅ Franquia Salva", description: "Ação registrada. Integração com banco de dados em breve." });
        setIsFormOpen(false);
    };

    const handleReplicate = (franchise) => {
        toast({
            title: "Portal Replicado!",
            description: `A estrutura do portal foi replicada para a franquia "${franchise.city}". O novo franqueado já pode acessar e personalizar o conteúdo.`,
        });
    };
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Ativa': return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
            case 'Pendente': return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
            case 'Inativa': return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Gerenciar Franquias</title></Helmet>
            
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Gerenciar Franquias</h1>
                <p className="text-gray-700 mt-2">Administre, cadastre e replique portais para novas cidades.</p>
            </motion.div>
            
            <Card className="bg-white border-gray-400">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div className="space-y-1">
                        <CardTitle className="text-gray-900">Lista de Franquias</CardTitle>
                        <CardDescription className="text-gray-700">Visualize e gerencie todas as franquias ativas e pendentes.</CardDescription>
                    </div>
                    <Button onClick={() => handleOpenForm()} className="bg-blue-700 hover:bg-blue-800 text-white"><PlusCircle className="mr-2"/> Nova Franquia</Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto border rounded-lg border-gray-400">
                        <Table>
                            <TableHeader className="bg-gray-200">
                                <TableRow className="border-b border-gray-400">
                                    <TableHead className="text-gray-800 font-semibold">Cidade</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Responsável</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Domínio</TableHead>
                                    <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {franchises.map(f => (
                                    <TableRow key={f.id} className="border-b border-gray-300">
                                        <TableCell className="font-medium text-gray-900">{f.city}</TableCell>
                                        <TableCell className="text-gray-700">{f.responsible}</TableCell>
                                        <TableCell>{getStatusBadge(f.status)}</TableCell>
                                        <TableCell className="text-gray-700">{f.domain}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button onClick={() => handleReplicate(f)} variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                                                    <Copy size={14} className="mr-2" /> Replicar Portal
                                                </Button>
                                                <Button onClick={() => handleOpenForm(f)} variant="ghost" size="icon" title="Editar"><Edit size={16}/></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" title="Excluir" style={{color: '#dc3545'}}><Trash2 size={16} /></Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                                            <AlertDialogDescription>Tem certeza que deseja excluir a franquia "{f.city}"? Esta ação não pode ser desfeita.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => toast({title: "Ação registrada"})} style={{backgroundColor: '#dc3545', color: '#fff'}}>Excluir</AlertDialogAction>
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
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentFranchise?.id ? 'Editar' : 'Adicionar'} Franquia</DialogTitle></DialogHeader>
                    {currentFranchise && <form onSubmit={handleSaveFranchise} className="space-y-4 pt-4">
                        <Label htmlFor="city">Cidade</Label><Input id="city" defaultValue={currentFranchise.city} />
                        <Label htmlFor="responsible">Responsável</Label><Input id="responsible" defaultValue={currentFranchise.responsible} />
                        <Label htmlFor="domain">Domínio</Label><Input id="domain" defaultValue={currentFranchise.domain} />
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue={currentFranchise.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                            <SelectItem value="Ativa">Ativa</SelectItem><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Inativa">Inativa</SelectItem>
                        </SelectContent></Select>
                        <DialogFooter><Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancelar</Button><Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white">Salvar</Button></DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminManageFranchises;