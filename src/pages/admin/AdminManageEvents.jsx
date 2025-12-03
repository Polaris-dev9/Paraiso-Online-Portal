import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Calendar, PlusCircle, Edit, Trash, Search, CheckCircle, XCircle, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminManageEvents = () => {
    const { toast } = useToast();
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('ppo_events')) || [
            { id: 1, name: 'Festival de Inverno', type: 'Show', status: 'Aprovado', date: '2025-07-20', registered: 1200 },
            { id: 2, name: 'Feira de Artesanato Local', type: 'Feira', status: 'Pendente', date: '2025-09-15', registered: 0 },
            { id: 3, name: 'Palestra de Empreendedorismo', type: 'Palestra', status: 'Encerrado', date: '2025-08-10', registered: 150 },
        ];
        setEvents(storedEvents);
    }, []);

    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    const handleOpenForm = (event = null) => {
        const defaultEvent = { name: '', type: 'Show', status: 'Pendente', date: '', description: '', location: '', price: 'Gratuito' };
        setCurrentEvent(event ? { ...defaultEvent, ...event } : defaultEvent);
        setIsFormOpen(true);
    };

    const handleSaveEvent = (e) => {
        e.preventDefault();
        const updatedEvents = currentEvent.id ? events.map(ev => ev.id === currentEvent.id ? currentEvent : ev) : [...events, { ...currentEvent, id: Date.now(), registered: 0 }];
        setEvents(updatedEvents);
        saveData('ppo_events', updatedEvents);
        setIsFormOpen(false);
        toast({ title: "Sucesso!", description: `Evento ${currentEvent.id ? 'atualizado' : 'criado'}.` });
    };

    const handleDeleteEvent = (id) => {
        const updatedEvents = events.filter(ev => ev.id !== id);
        setEvents(updatedEvents);
        saveData('ppo_events', updatedEvents);
        toast({ title: 'Evento Removido' });
    };

    const filteredEvents = events.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Aprovado': return 'bg-green-600 text-white';
            case 'Pendente': return 'bg-yellow-500 text-black';
            case 'Encerrado': return 'bg-gray-500 text-white';
            default: return 'bg-red-600 text-white';
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet><title>Admin: Gerenciar Eventos</title></Helmet>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center"><Calendar className="mr-3 text-purple-600" /> Gerenciar Eventos</h1>
                        <p className="text-gray-700 mt-1">Crie, modere e gerencie os eventos do portal.</p>
                    </div>
                    <Button onClick={() => handleOpenForm()} style={{ backgroundColor: '#007bff', color: '#fff' }}><PlusCircle className="mr-2" size={16} /> Criar Evento</Button>
                </div>
                <Card className="border-gray-400 bg-white">
                    <CardHeader><CardTitle className="text-gray-900">Todos os Eventos</CardTitle></CardHeader>
                    <CardContent>
                        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} /><Input placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 border-gray-400 bg-white" /></div>
                        <div className="overflow-x-auto border rounded-lg border-gray-400"><Table>
                            <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400">
                                <TableHead className="text-gray-800 font-semibold">Evento</TableHead><TableHead className="text-gray-800 font-semibold">Data</TableHead><TableHead className="text-gray-800 font-semibold">Status</TableHead><TableHead className="text-gray-800 font-semibold">Inscritos</TableHead><TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>{filteredEvents.map(item => (
                                <TableRow key={item.id} className="border-b border-gray-300">
                                    <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                                    <TableCell className="text-gray-700">{item.date}</TableCell>
                                    <TableCell><Badge className={getStatusBadge(item.status)}>{item.status}</Badge></TableCell>
                                    <TableCell className="text-gray-700">{item.registered}</TableCell>
                                    <TableCell className="text-right"><div className="flex gap-1 justify-end">
                                        <Button variant="ghost" size="icon" title="Relatório" style={{color: '#6c757d'}}><BarChart2 size={16}/></Button>
                                        <Button onClick={() => handleOpenForm(item)} variant="ghost" size="icon" title="Editar" style={{color: '#007bff'}}><Edit size={16}/></Button>
                                        <Button onClick={() => handleDeleteEvent(item.id)} variant="ghost" size="icon" title="Excluir" style={{color: '#dc3545'}}><Trash size={16}/></Button>
                                    </div></TableCell>
                                </TableRow>
                            ))}</TableBody>
                        </Table></div>
                    </CardContent>
                </Card>
            </motion.div>

             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-[90vw] md:max-w-2xl border-gray-400 bg-gray-100">
                    <DialogHeader><DialogTitle className="text-gray-900 text-2xl">{currentEvent?.id ? 'Editar' : 'Criar'} Evento</DialogTitle></DialogHeader>
                    {currentEvent && <form onSubmit={handleSaveEvent} className="max-h-[75vh] overflow-y-auto pr-4 space-y-4">
                        <div><Label htmlFor="name" className="text-gray-800">Nome do Evento</Label><Input id="name" value={currentEvent.name} onChange={(e) => setCurrentEvent({...currentEvent, name: e.target.value})} className="border-gray-400 bg-white" /></div>
                        <div><Label htmlFor="description" className="text-gray-800">Descrição</Label><Textarea id="description" value={currentEvent.description} onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} className="border-gray-400 bg-white" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="date" className="text-gray-800">Data</Label><Input type="date" id="date" value={currentEvent.date} onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})} className="border-gray-400 bg-white" /></div>
                            <div><Label htmlFor="location" className="text-gray-800">Local</Label><Input id="location" value={currentEvent.location} onChange={(e) => setCurrentEvent({...currentEvent, location: e.target.value})} className="border-gray-400 bg-white" /></div>
                            <div><Label htmlFor="type" className="text-gray-800">Tipo</Label><Input id="type" value={currentEvent.type} onChange={(e) => setCurrentEvent({...currentEvent, type: e.target.value})} className="border-gray-400 bg-white" /></div>
                            <div><Label htmlFor="status" className="text-gray-800">Status</Label><Select value={currentEvent.status} onValueChange={(v) => setCurrentEvent({...currentEvent, status: v})}><SelectTrigger className="border-gray-400 bg-white"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pendente">Pendente</SelectItem><SelectItem value="Aprovado">Aprovado</SelectItem><SelectItem value="Encerrado">Encerrado</SelectItem></SelectContent></Select></div>
                        </div>
                        <DialogFooter className="mt-6 pt-4 border-t border-gray-300"><Button type="button" onClick={() => setIsFormOpen(false)} style={{backgroundColor: '#6c757d', color: '#fff'}}>Cancelar</Button><Button type="submit" style={{backgroundColor: '#28a745', color: '#fff'}}>Salvar</Button></DialogFooter>
                    </form>}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminManageEvents;