import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const AiSecurityFilters = () => {
    const { toast } = useToast();

    const blockedWords = ["palavra1", "palavra2", "palavra3"];

    const handleSave = () => {
        toast({
            title: "✅ Configurações Salvas!",
            description: "As configurações de segurança e filtros foram atualizadas.",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Helmet>
                <title>IA: Segurança e Filtros</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 flex items-center">
                    <Shield className="mr-3 h-8 w-8" /> Segurança e Filtros de Conteúdo
                </h1>
                <p className="text-gray-600 mt-2">Defina palavras bloqueadas, configure filtros e moderação.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 space-y-8"
            >
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Filtros de Conteúdo</h2>
                    <div className="flex items-center space-x-2 mb-4">
                        <Switch id="profanity-filter" defaultChecked />
                        <Label htmlFor="profanity-filter">Ativar filtro de profanidade automático</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="pii-filter" />
                        <Label htmlFor="pii-filter">Ativar filtro de informações de identificação pessoal (PII)</Label>
                    </div>
                </div>

                <div className="border-t pt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Palavras Bloqueadas</h2>
                    <p className="text-sm text-gray-500 mb-4">A IA evitará usar ou responder a estas palavras.</p>
                    <div className="flex items-end gap-4 mb-4">
                        <div className="flex-grow">
                            <Label htmlFor="add-word">Adicionar palavra</Label>
                            <Input id="add-word" placeholder="Digite uma palavra para bloquear" />
                        </div>
                        <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {blockedWords.map(word => (
                            <Badge key={word} variant="secondary" className="text-lg">
                                {word}
                                <Button variant="ghost" size="icon" className="h-4 w-4 ml-2">
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="mt-8 flex justify-end"
            >
                <Button onClick={handleSave} className="gradient-indigo text-white text-lg px-8 py-6">
                    <Save className="mr-2 h-5 w-5" /> Salvar Alterações
                </Button>
            </motion.div>
        </div>
    );
};

export default AiSecurityFilters;