import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Plug, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

const AiIntegrationSettings = () => {
    const { toast } = useToast();

    const handleSave = () => {
        toast({
            title: "✅ Configurações Salvas!",
            description: "As configurações de integração foram atualizadas.",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Helmet>
                <title>IA: Configurações de Integração</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 flex items-center">
                    <Plug className="mr-3 h-8 w-8" /> Configurações de Integração
                </h1>
                <p className="text-gray-600 mt-2">Conecte a IA a ferramentas externas via APIs e webhooks.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 space-y-8"
            >
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Integração com WhatsApp</h2>
                    <div className="flex items-center space-x-2 mb-4">
                        <Switch id="whatsapp-active" defaultChecked />
                        <Label htmlFor="whatsapp-active">Ativar integração com WhatsApp</Label>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp-api">Chave da API do WhatsApp</Label>
                        <Input id="whatsapp-api" type="password" defaultValue="********" />
                    </div>
                </div>

                <div className="border-t pt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Webhooks</h2>
                    <p className="text-sm text-gray-500 mb-4">Envie eventos da IA para URLs externas.</p>
                    <div className="space-y-4">
                        <div className="flex items-end gap-4">
                            <div className="flex-grow">
                                <Label htmlFor="webhook-url">URL do Webhook</Label>
                                <Input id="webhook-url" placeholder="https://seu-servidor.com/webhook" />
                            </div>
                            <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
                        </div>
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

export default AiIntegrationSettings;