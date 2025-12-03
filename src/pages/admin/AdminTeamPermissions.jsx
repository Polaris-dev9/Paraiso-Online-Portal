import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield, Edit, Trash, Search, UserPlus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const AdminTeamPermissions = () => {
    const { toast } = useToast();
    const [team, setTeam] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    useEffect(() => {
        const storedTeam = JSON.parse(localStorage.getItem('ppo_team')) || [
            { id: 1, name: 'EdiCarlos Pereira', email: 'edi.carlos@example.com', role: 'master', photo: 'https://i.pravatar.cc/150?u=1', bio: 'Fundador e CEO. Visionário por trás do portal.' },
            { id: 2, name: 'Welber Ferreira', email: 'welber.f@example.com', role: 'general_admin', photo: 'https://i.pravatar.cc/150?u=2', bio: 'Gerente geral, garantindo que tudo funcione perfeitamente.' },
            { id: 3, name: 'Giselle Sousa', email: 'giselle.s@example.com', role: 'content_admin', photo: 'https://i.pravatar.cc/150?u=3', bio: 'Nossa principal jornalista, cobrindo os eventos mais importantes da cidade.' },
            { id: 4, name: 'Consultor de Vendas 1', email: 'consultor1@example.com', role: 'franchisee', photo: null, bio: '' },
        ];
        setTeam(storedTeam);
    }, []);

    const saveData = (data) => localStorage.setItem('ppo_team', JSON.stringify(data));

    const handleOpenForm = (member = null) => {
        const defaultMember = { name: '', email: '', role: 'franchisee', photo: null, bio: '' };
        const memberData = member ? { ...defaultMember, ...member } : defaultMember;
        setCurrentMember(memberData);
        setPhotoPreview(memberData.photo);
        setIsFormOpen(true);
    };
    
    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
                setCurrentMember({ ...currentMember, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveMember = (e) => {
        e.preventDefault();
        if (!currentMember.name || !currentMember.email) {
            toast({ title: "Erro", description: "Nome e e-mail são obrigatórios.", variant: 'destructive' });
            return;
        }
        const updatedTeam = currentMember.id ? team.map(m => m.id === currentMember.id ? currentMember : m) : [...team, { ...currentMember, id: Date.now() }];
        setTeam(updatedTeam);
        saveData(updatedTeam);
        setIsFormOpen(false);
        toast({ title: "Sucesso!", description: `Membro da equipe ${currentMember.id ? 'atualizado' : 'adicionado'}.` });
    };

    const handleDeleteMember = (id) => {
        const updatedTeam = team.filter(m => m.id !== id);
        setTeam(updatedTeam);
        saveData(updatedTeam);
        toast({ title: "Membro Removido" });
    };

    const handleRoleChange = (memberId, newRole) => {
        const updatedTeam = team.map(m => m.id === memberId ? { ...m, role: newRole } : m);
        setTeam(updatedTeam);
        saveData(updatedTeam);
        toast({ title: "Permissão Alterada", description: `O nível de acesso foi atualizado para ${newRole}.` });
    };

    const filteredTeam = useMemo(() => team.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [team, searchTerm]);

    const getInitials = (name) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return `${names[0][0]}`.toUpperCase();
    };


    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Equipe e Permissões</title></Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Shield className="mr-3 text-blue-800" /> Equipe e Permissões</h1>
                        <p className="text-gray-700 mt-1">Gerencie os membros da equipe e seus níveis de acesso.</p>
                    </div>
                    <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><UserPlus className="mr-2" size={16} /> Adicionar Membro</Button>
                </div>

                <Card className="bg-white border-gray-400">
                    <CardHeader><CardTitle className="text-gray-900">Membros da Equipe</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative w-full max-w-sm mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar por nome ou e-mail..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                        <div className="overflow-x-auto border rounded-lg border-gray-400">
                            <Table><TableHeader className="bg-gray-200">
                                <TableRow className="border-b border-gray-400">
                                    <TableHead className="text-gray-800 font-semibold w-[300px]">Nome</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Email</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Nível de Acesso</TableHead>
                                    <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                </TableRow>
                            </TableHeader><TableBody>
                                {filteredTeam.map(member => (
                                    <TableRow key={member.id} className="border-b border-gray-300">
                                        <TableCell className="font-medium text-gray-900">
                                            <div className="flex items-center gap-3">
                                                <Avatar><AvatarImage src={member.photo} /><AvatarFallback>{getInitials(member.name)}</AvatarFallback></Avatar>
                                                {member.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-700">{member.email}</TableCell>
                                        <TableCell><Select value={member.role} onValueChange={(value) => handleRoleChange(member.id, value)}>
                                            <SelectTrigger className="w-[200px] border-gray-400 bg-white"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="master">Master (Acesso Total)</SelectItem>
                                                <SelectItem value="general_admin">Admin Geral</SelectItem>
                                                <SelectItem value="content_admin">Admin Conteúdo</SelectItem>
                                                <SelectItem value="franchisee">Franqueado</SelectItem>
                                            </SelectContent>
                                        </Select></TableCell>
                                        <TableCell className="text-right"><div className="flex gap-1 justify-end">
                                            <Button onClick={() => handleOpenForm(member)} variant="ghost" size="icon" title="Editar" style={{color: '#007bff'}}><Edit size={16} /></Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="ghost" size="icon" title="Excluir" style={{color: '#dc3545'}}><Trash size={16} /></Button></AlertDialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle><AlertDialogDescription>Tem certeza que deseja remover "{member.name}" da equipe?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter>
                                                    <AlertDialogCancel style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteMember(member.id)} style={{backgroundColor: '#dc3545', color: '#fff'}}>Excluir</AlertDialogAction>
                                                </AlertDialogFooter></AlertDialogContent>
                                            </AlertDialog>
                                        </div></TableCell>
                                    </TableRow>
                                ))}</TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-2xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentMember?.id ? 'Editar' : 'Adicionar'} Membro</DialogTitle></DialogHeader>
                    {currentMember && <form onSubmit={handleSaveMember} className="max-h-[80vh] overflow-y-auto pr-4 space-y-4 pt-4">
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="w-24 h-24"><AvatarImage src={photoPreview} /><AvatarFallback className="text-3xl">{getInitials(currentMember.name)}</AvatarFallback></Avatar>
                            <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            <Button type="button" onClick={() => document.getElementById('photo-upload').click()} variant="outline" className="bg-white border-gray-400"><Upload className="mr-2 h-4 w-4" />Alterar Foto</Button>
                        </div>
                        <div><Label htmlFor="name" className="text-gray-800">Nome Completo</Label><Input id="name" value={currentMember.name} onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })} className="border-gray-400 bg-white" required /></div>
                        <div><Label htmlFor="email" className="text-gray-800">E-mail</Label><Input id="email" type="email" value={currentMember.email} onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })} className="border-gray-400 bg-white" required /></div>
                        <div><Label htmlFor="bio" className="text-gray-800">Biografia Curta</Label><Textarea id="bio" value={currentMember.bio} onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })} className="border-gray-400 bg-white" placeholder="Uma breve descrição sobre o membro da equipe..." /></div>
                        <div><Label htmlFor="role" className="text-gray-800">Nível de Permissão</Label><Select value={currentMember.role} onValueChange={(v) => setCurrentMember({ ...currentMember, role: v })}>
                            <SelectTrigger className="border-gray-400 bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="master">Master (Acesso Total)</SelectItem>
                                <SelectItem value="general_admin">Admin Geral</SelectItem>
                                <SelectItem value="content_admin">Admin Conteúdo</SelectItem>
                                <SelectItem value="franchisee">Franqueado</SelectItem>
                            </SelectContent>
                        </Select></div>
                        <DialogFooter className="mt-6 pt-4 border-t border-gray-300">
                            <Button type="button" onClick={() => setIsFormOpen(false)} style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</Button>
                            <Button type="submit" style={{backgroundColor: '#28a745', color: '#fff'}}>Salvar</Button>
                        </DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminTeamPermissions;