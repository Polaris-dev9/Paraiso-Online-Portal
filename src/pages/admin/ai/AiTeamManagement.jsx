import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, PlusCircle, Edit, Trash2, Search, Filter, MessageCircle, CheckCircle, Clock } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

const AiTeamManagement = () => {
    const { toast } = useToast();
    
    const [team, setTeam] = useState([
        { id: 1, name: 'Ana Silva', sector: 'Vendas', color: '#3b82f6', expertise: ['Planos', 'Anúncios'] },
        { id: 2, name: 'Bruno Costa', sector: 'Suporte Técnico', color: '#f97316', expertise: ['Marketplace', 'Cadastro'] },
        { id: 3, name: 'Carlos Lima', sector: 'Jornalismo', color: '#16a34a', expertise: ['Notícias', 'Eventos'] },
    ]);
    
    const [conversations, setConversations] = useState([
        { id: 'WA-001', user: '+55 38 91234-5678', assigned: 'Ana Silva', status: 'Atendendo', lastMsg: 'Gostaria de saber mais sobre o plano Premium.' },
        { id: 'WA-002', user: '+55 38 98765-4321', assigned: null, status: 'A Resolver', lastMsg: 'Meu produto não aparece na loja.' },
        { id: 'WA-003', user: '+55 38 99999-0000', assigned: 'Carlos Lima', status: 'Atendido', lastMsg: 'Obrigado pela ajuda com a pauta!' },
    ]);
    
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);

    const handleOpenForm = (member = null) => {
        setCurrentMember(member || { name: '', sector: 'Vendas', color: '#000000', expertise: '' });
        setIsFormOpen(true);
    };

    const handleSaveMember = (e) => {
        e.preventDefault();
        toast({ title: "✅ Membro Salvo", description: "Ação registrada. Integração com banco de dados em breve." });
        setIsFormOpen(false);
    };
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Atendido': return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3"/>{status}</Badge>;
            case 'Atendendo': return <Badge className="bg-blue-100 text-blue-800"><MessageCircle className="mr-1 h-3 w-3"/>{status}</Badge>;
            case 'A Resolver': return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3"/>{status}</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
            <Helmet><title>IA: Gestão de Equipe e WhatsApp</title></Helmet>
            
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-green-800">Gestão de Equipe e WhatsApp</h1>
                <p className="text-gray-600 mt-2">Gerencie seus atendentes e visualize as conversas do WhatsApp em tempo real.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div className="space-y-1">
                            <CardTitle>Membros da Equipe</CardTitle>
                            <CardDescription>Adicione e gerencie os atendentes.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenForm()}><PlusCircle className="mr-2"/> Adicionar Membro</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Setor</TableHead><TableHead>Especialidades</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                            <TableBody>{team.map(m => (
                                <TableRow key={m.id}>
                                    <TableCell className="font-medium flex items-center"><span className="h-3 w-3 rounded-full mr-2" style={{backgroundColor: m.color}}></span>{m.name}</TableCell>
                                    <TableCell>{m.sector}</TableCell>
                                    <TableCell><div className="flex flex-wrap gap-1">{m.expertise.map(e => <Badge key={e} variant="secondary">{e}</Badge>)}</div></TableCell>
                                    <TableCell className="text-right"><Button onClick={() => handleOpenForm(m)} variant="ghost" size="icon"><Edit size={16}/></Button></TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardHeader>
                        <CardTitle>Conversas do WhatsApp</CardTitle>
                        <CardDescription>Atribua conversas e acompanhe o status dos atendimentos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Usuário</TableHead><TableHead>Atribuído a</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>{conversations.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell className="font-medium">{c.user}</TableCell>
                                    <TableCell>
                                        <Select defaultValue={c.assigned || 'none'}>
                                            <SelectTrigger className="h-8 w-[150px]">
                                                <SelectValue placeholder="Atribuir..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Ninguém</SelectItem>
                                                {team.map(member => <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{currentMember?.id ? 'Editar' : 'Adicionar'} Membro da Equipe</DialogTitle></DialogHeader>
                    {currentMember && <form onSubmit={handleSaveMember} className="space-y-4 pt-4">
                        <Label htmlFor="name">Nome</Label><Input id="name" defaultValue={currentMember.name} />
                        <Label htmlFor="sector">Setor</Label>
                        <Select defaultValue={currentMember.sector}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                            <SelectItem value="Vendas">Vendas</SelectItem><SelectItem value="Suporte Técnico">Suporte Técnico</SelectItem><SelectItem value="Jornalismo">Jornalismo</SelectItem><SelectItem value="Financeiro">Financeiro</SelectItem>
                        </SelectContent></Select>
                        <Label htmlFor="color">Cor do Setor</Label><Input id="color" type="color" defaultValue={currentMember.color} />
                        <Label htmlFor="expertise">Especialidades (separadas por vírgula)</Label><Input id="expertise" defaultValue={Array.isArray(currentMember.expertise) ? currentMember.expertise.join(', ') : currentMember.expertise} />
                        <DialogFooter><Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancelar</Button><Button type="submit">Salvar</Button></DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AiTeamManagement;