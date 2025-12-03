import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { BrainCircuit, Upload, FileText, Trash2, PlusCircle, Mic } from 'lucide-react';
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
import { AI_CONFIG } from '@/config/ai-config.js';

const AiTrainingKnowledge = () => {
    const { toast } = useToast();

    const documents = [
        { id: 1, name: 'manual_de_boas_vindas.pdf', type: 'PDF', size: '2.3 MB', uploaded: '2025-08-15' },
        { id: 2, name: 'politicas_de_privacidade.docx', type: 'DOCX', size: '150 KB', uploaded: '2025-08-12' },
        { id: 3, name: 'faq_assinantes.txt', type: 'TXT', size: '35 KB', uploaded: '2025-08-10' },
        { id: 4, name: 'info_planos_2025.pdf', type: 'PDF', size: '1.1 MB', uploaded: '2025-08-09' },
        { id: 5, name: 'audio_saudacao_padrao.mp3', type: 'MP3', size: '850 KB', uploaded: '2025-09-01' },
    ];

    const handleAction = () => {
        toast({
            title: "🚧 Funcionalidade em desenvolvimento",
            description: "Esta ação ainda não foi implementada. Você pode solicitá-la no próximo prompt! 🚀",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Helmet>
                <title>IA: Treinamento e Base de Conhecimento</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-purple-900 flex items-center">
                    <BrainCircuit className="mr-3 h-8 w-8" /> Treinamento e Base de Conhecimento
                </h1>
                <p className="text-gray-600 mt-2">Faça upload e gerencie os documentos e áudios que alimentam a inteligência da {AI_CONFIG.name}.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Adicionar Novo Conhecimento</h2>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div className="flex-grow text-center sm:text-left">
                        <p className="font-semibold">Arraste e solte arquivos aqui ou clique para selecionar</p>
                        <p className="text-sm text-gray-500">Suporta PDF, DOCX, TXT, MP3, WAV, etc. (máx. 10MB)</p>
                    </div>
                    <Input type="file" className="hidden" id="file-upload" onChange={handleAction} />
                    <Button onClick={() => document.getElementById('file-upload').click()} className="gradient-purple text-white">
                        <PlusCircle className="mr-2 h-4 w-4" /> Selecionar Arquivo
                    </Button>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6"
            >
                <h2 className="text-xl font-bold text-gray-800 mb-4">Base de Conhecimento Carregada</h2>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Arquivo</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Tamanho</TableHead>
                                <TableHead>Data de Upload</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell className="font-medium flex items-center">
                                        {doc.type === 'MP3' || doc.type === 'WAV' ? <Mic className="mr-2 h-4 w-4 text-gray-500" /> : <FileText className="mr-2 h-4 w-4 text-gray-500" />}
                                        {doc.name}
                                    </TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{doc.size}</TableCell>
                                    <TableCell>{doc.uploaded}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={handleAction}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end mt-6">
                    <Button onClick={handleAction} className="gradient-green text-white">
                        <BrainCircuit className="mr-2 h-4 w-4" /> Re-treinar Agente com Novos Dados
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default AiTrainingKnowledge;