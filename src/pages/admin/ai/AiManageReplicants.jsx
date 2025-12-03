import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Copy, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const AiManageReplicants = () => {
    const { toast } = useToast();

    const replicants = [
        { id: 1, name: "Agente de Vendas (Franquia BH)", department: "Vendas", status: "Ativo" },
        { id: 2, name: "Suporte Técnico (Assinantes Premium)", department: "Suporte", status: "Ativo" },
        { id: 3, name: "Agente de Eventos (Equipe Interna)", department: "Eventos", status: "Inativo" },
    ];

    const handleAction = (action) => {
        toast({
            title: `🚧 Ação '${action}' em desenvolvimento`,
            description: "Esta funcionalidade será implementada em breve! 🚀",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Helmet>
                <title>IA: Gerenciar Agentes Replicados</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 flex items-center">
                        <Copy className="mr-3 h-8 w-8" /> Gerenciar Agentes Replicados
                    </h1>
                    <p className="text-gray-600 mt-2">Crie e administre instâncias da IA para diferentes departamentos ou clientes.</p>
                </div>
                <Button onClick={() => handleAction('Replicar')} className="gradient-indigo text-white">
                    <Plus className="mr-2 h-5 w-5" /> Replicar Agente
                </Button>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <div className="flex items-center mb-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <Input placeholder="Buscar por nome ou departamento..." className="pl-10" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Agente</TableHead>
                                <TableHead>Departamento/Cliente</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {replicants.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{item.department}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === 'Ativo' ? 'default' : 'destructive'}>{item.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleAction('Editar')}>
                                            <Edit className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleAction('Excluir')}>
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </div>
    );
};

export default AiManageReplicants;