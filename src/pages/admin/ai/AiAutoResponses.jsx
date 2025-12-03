import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Plus, Edit, Trash2, Search } from 'lucide-react';
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

const AiAutoResponses = () => {
    const { toast } = useToast();

    const responses = [
        { id: 1, trigger: "horário de funcionamento", response: "Nosso horário de atendimento é de segunda a sexta, das 9h às 18h." },
        { id: 2, trigger: "planos", response: "Temos os planos Gratuito, Essencial e Premium. Você pode ver mais detalhes na página 'Anuncie Aqui'." },
        { id: 3, trigger: "contato", response: "Você pode entrar em contato conosco pelo telefone (38) 99808-5771 ou pelo e-mail contato@portalparaisoonline.com.br." },
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
                <title>IA: Respostas Automáticas</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 flex items-center">
                        <MessageSquare className="mr-3 h-8 w-8" /> Gerenciar Respostas Automáticas
                    </h1>
                    <p className="text-gray-600 mt-2">Crie, edite e gerencie respostas padrão para perguntas frequentes.</p>
                </div>
                <Button onClick={() => handleAction('Adicionar')} className="gradient-indigo text-white">
                    <Plus className="mr-2 h-5 w-5" /> Adicionar Resposta
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
                        <Input placeholder="Buscar por gatilho ou resposta..." className="pl-10" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Gatilho (Palavra-chave)</TableHead>
                                <TableHead>Resposta</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responses.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.trigger}</TableCell>
                                    <TableCell>{item.response}</TableCell>
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

export default AiAutoResponses;