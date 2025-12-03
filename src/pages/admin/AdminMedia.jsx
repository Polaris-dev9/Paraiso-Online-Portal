import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Film, Image as ImageIcon, PlusCircle, Edit, Trash, Search, Link as LinkIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const AdminMedia = () => {
    const { toast } = useToast();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadType, setUploadType] = useState('banner');

    const handleUpload = (e) => {
        e.preventDefault();
        toast({
            title: "✔️ Upload Simulado com Sucesso!",
            description: `Seu arquivo do tipo '${uploadType}' foi recebido.`,
        });
        setIsUploadOpen(false);
    };
    
    const handleOpenUpload = (type) => {
        setUploadType(type);
        setIsUploadOpen(true);
    };

    const banners = [
        { id: 1, name: 'Banner Topo Home', type: 'Imagem', position: 'Home - Topo', status: 'Ativo' },
        { id: 2, name: 'Vídeo Institucional', type: 'Vídeo', position: 'Home - Seção Sobre', status: 'Ativo' },
        { id: 3, name: 'Banner Guia Comercial', type: 'Imagem', position: 'Guia Comercial - Lateral', status: 'Inativo' },
    ];
    
    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Admin: Gerenciar Mídia</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <Film className="mr-3 text-blue-800" /> Gerenciar Mídia
                        </h1>
                        <p className="text-gray-700 mt-1">Administre banners e vídeos de publicidade do portal.</p>
                    </div>
                </div>

                <Tabs defaultValue="banners">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-300">
                        <TabsTrigger value="banners" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Banners</TabsTrigger>
                        <TabsTrigger value="videos" className="data-[state=active]:bg-white data-[state=active]:text-gray-900">Vídeos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="banners" className="mt-4">
                        <Card className="border-gray-400 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-gray-900">Banners Publicitários</CardTitle>
                                    <CardDescription className="text-gray-600">Gerencie os banners de imagem do site.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenUpload('banner')} style={{backgroundColor: '#007bff', color: '#fff'}}>
                                    <PlusCircle size={16} className="mr-2"/> Adicionar Banner
                                </Button>
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
                                            {banners.filter(b => b.type === 'Imagem').map(b => (
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
                    </TabsContent>
                    <TabsContent value="videos" className="mt-4">
                         <Card className="border-gray-400 bg-white">
                            <CardHeader className="flex flex-row items-center justify-between">
                                 <div>
                                    <CardTitle className="text-gray-900">Vídeos Publicitários</CardTitle>
                                    <CardDescription className="text-gray-600">Gerencie os vídeos de publicidade do site.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenUpload('video')} style={{backgroundColor: '#007bff', color: '#fff'}}>
                                    <PlusCircle size={16} className="mr-2"/> Adicionar Vídeo
                                </Button>
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
                                             {banners.filter(b => b.type === 'Vídeo').map(b => (
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
                    </TabsContent>
                </Tabs>
            </motion.div>

            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="border-gray-400 bg-gray-100">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Adicionar Novo {uploadType === 'banner' ? 'Banner' : 'Vídeo'}</DialogTitle>
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
                                    <SelectItem value="home-top">Home - Topo</SelectItem>
                                    <SelectItem value="home-middle">Home - Meio</SelectItem>
                                    <SelectItem value="sidebar-all">Lateral - Todas as Páginas</SelectItem>
                                    <SelectItem value="guide-top">Topo - Guias</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                             <Label htmlFor="media-file" className="text-gray-800">
                                {uploadType === 'banner' ? 'Arquivo de Imagem' : 'URL do Vídeo (Youtube/Vimeo)'}
                            </Label>
                            {uploadType === 'banner' ?
                             <Input id="media-file" type="file" accept="image/*" className="border-gray-400 bg-white" required/>
                             : <Input id="media-file" type="url" placeholder="https://..." className="border-gray-400 bg-white" required/>
                            }
                        </div>
                        <div>
                            <Label htmlFor="media-link" className="text-gray-800">Link de Destino (opcional)</Label>
                            <Input id="media-link" type="url" placeholder="https://..." className="border-gray-400 bg-white"/>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" onClick={() => setIsUploadOpen(false)} style={{ backgroundColor: '#6c757d', color: '#fff' }}>Cancelar</Button>
                            <Button type="submit" style={{ backgroundColor: '#28a745', color: '#fff' }}>
                                <Upload size={16} className="mr-2"/> Enviar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminMedia;