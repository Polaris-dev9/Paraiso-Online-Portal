import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Image as ImageIcon, PlusCircle, Edit, Trash, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const FranchiseeManageBanners = () => {
    const { toast } = useToast();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [banners, setBanners] = useState([
        { id: 1, name: 'Banner Lateral - Minha Cidade', type: 'Imagem', position: 'Guia Comercial - Lateral', status: 'Ativo' },
    ]);

    const handleUpload = (e) => {
        e.preventDefault();
        toast({
            title: "✔️ Upload Simulado com Sucesso!",
            description: `Seu banner foi recebido e aguarda aprovação da matriz.`,
        });
        setIsUploadOpen(false);
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Franquia: Gerenciar Banners</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <ImageIcon className="mr-3 text-teal-600" /> Gerenciar Banners (Franquia)
                        </h1>
                        <p className="text-gray-700 mt-1">Administre os banners de publicidade da sua cidade.</p>
                    </div>
                     <Button onClick={() => setIsUploadOpen(true)} style={{backgroundColor: '#007bff', color: '#fff'}}>
                        <PlusCircle size={16} className="mr-2"/> Adicionar Banner
                    </Button>
                </div>

                <Card className="border-gray-400 bg-white">
                    <CardHeader>
                        <CardTitle className="text-gray-900">Banners da sua Franquia</CardTitle>
                        <CardDescription className="text-gray-600">Gerencie os banners de imagem da sua cidade.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="overflow-x-auto border rounded-lg border-gray-400">
                            <Table>
                                <TableHeader className="bg-gray-200"><TableRow className="border-b border-gray-400">
                                    <TableHead className="text-gray-800 font-semibold">Nome</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Posição</TableHead>
                                    <TableHead className="text-gray-800 font-semibold">Status</TableHead>
                                    <TableHead className="text-right text-gray-800 font-semibold">Ações</TableHead>
                                </TableRow></TableHeader>
                                <TableBody>
                                    {banners.map(b => (
                                    <TableRow key={b.id} className="border-b border-gray-300">
                                        <TableCell className="text-gray-800">{b.name}</TableCell>
                                        <TableCell className="text-gray-600">{b.position}</TableCell>
                                        <TableCell><Badge className={b.status === 'Ativo' ? 'bg-green-600 text-white' : 'bg-gray-500 text-white'}>{b.status}</Badge></TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" title="Editar" style={{ color: '#007bff' }}><Edit size={16} /></Button>
                                            <Button variant="ghost" size="icon" title="Excluir" style={{ color: '#dc3545' }}><Trash size={16} /></Button>
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="border-gray-400 bg-gray-100">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Adicionar Novo Banner</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4 pt-4">
                         <div>
                            <Label htmlFor="media-name" className="text-gray-800">Nome Identificador</Label>
                            <Input id="media-name" placeholder="Ex: Banner Lateral Direito" className="border-gray-400 bg-white" required/>
                        </div>
                        <div>
                            <Label htmlFor="media-position" className="text-gray-800">Posição de Exibição</Label>
                             <Select required>
                                <SelectTrigger className="border-gray-400 bg-white"><SelectValue placeholder="Selecione um local..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sidebar-guide">Lateral - Guias</SelectItem>
                                    <SelectItem value="top-guide">Topo - Guias</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                             <Label htmlFor="media-file" className="text-gray-800">Arquivo de Imagem</Label>
                             <Input id="media-file" type="file" accept="image/*" className="border-gray-400 bg-white" required/>
                        </div>
                        <div>
                            <Label htmlFor="media-link" className="text-gray-800">Link de Destino (opcional)</Label>
                            <Input id="media-link" type="url" placeholder="https://..." className="border-gray-400 bg-white"/>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" onClick={() => setIsUploadOpen(false)} style={{ backgroundColor: '#6c757d', color: '#fff' }}>Cancelar</Button>
                            <Button type="submit" style={{ backgroundColor: '#28a745', color: '#fff' }}>
                                <Upload size={16} className="mr-2"/> Enviar para Aprovação
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FranchiseeManageBanners;