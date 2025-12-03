import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Bot, SlidersHorizontal, Save, UserCircle, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { AI_CONFIG } from '@/config/ai-config.js';

const AiPersonality = () => {
    const { toast } = useToast();
    const [creativity, setCreativity] = useState([0.7]);
    const [formality, setFormality] = useState([0.4]);

    const handleSave = () => {
        toast({
            title: "✅ Personalidade Salva!",
            description: `As novas configurações de personalidade da ${AI_CONFIG.name} foram aplicadas.`,
        });
    };

    const getSliderLabel = (value) => {
        if (value < 0.2) return 'Muito Direto';
        if (value < 0.4) return 'Direto';
        if (value < 0.6) return 'Balanceado';
        if (value < 0.8) return 'Criativo';
        return 'Muito Criativo';
    };
    
    const getFormalityLabel = (value) => {
        if (value < 0.2) return 'Muito Informal';
        if (value < 0.4) return 'Informal';
        if (value < 0.6) return 'Neutro';
        if (value < 0.8) return 'Formal';
        return 'Muito Formal';
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
            <Helmet>
                <title>IA: Personalidade e Voz da {AI_CONFIG.name}</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 flex items-center">
                    <Bot className="mr-3 h-8 w-8" /> Personalidade e Voz da {AI_CONFIG.name}
                </h1>
                <p className="text-gray-600 mt-2">Ajuste o comportamento, o estilo de comunicação e a voz da sua agente de IA.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                <div className="space-y-8">
                    <div>
                        <Label htmlFor="agent-name" className="text-lg font-semibold text-gray-700 flex items-center"><UserCircle className="mr-2 h-5 w-5"/> Nome do Agente</Label>
                        <p className="text-sm text-gray-500 mb-3">Dê um nome humano ao seu agente para criar mais conexão.</p>
                        <Input id="agent-name" placeholder="Ex: Aura, Léo" defaultValue={AI_CONFIG.name} />
                    </div>
                    <div>
                        <Label htmlFor="voice" className="text-lg font-semibold text-gray-700 flex items-center"><Mic className="mr-2 h-5 w-5"/> Voz (ElevenLabs)</Label>
                        <p className="text-sm text-gray-500 mb-3">Escolha a voz que dará vida à {AI_CONFIG.name}.</p>
                        <Select defaultValue="rachel">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a voz" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rachel">Rachel (Padrão)</SelectItem>
                                <SelectItem value="bella">Bella</SelectItem>
                                <SelectItem value="antoni">Antoni</SelectItem>
                                <SelectItem value="custom-voice-id">Voz Clonada (Custom)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="creativity" className="text-lg font-semibold text-gray-700">Nível de Criatividade</Label>
                        <p className="text-sm text-gray-500 mb-3">Controla o quão criativas e inesperadas serão as respostas.</p>
                        <div className="flex items-center gap-4">
                            <Slider
                                id="creativity"
                                defaultValue={creativity}
                                max={1}
                                step={0.1}
                                onValueChange={setCreativity}
                            />
                            <span className="font-semibold text-indigo-700 w-32 text-center">{getSliderLabel(creativity[0])}</span>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="formality" className="text-lg font-semibold text-gray-700">Nível de Formalidade</Label>
                        <p className="text-sm text-gray-500 mb-3">Define se a comunicação será mais casual ou profissional.</p>
                        <div className="flex items-center gap-4">
                            <Slider
                                id="formality"
                                defaultValue={formality}
                                max={1}
                                step={0.1}
                                onValueChange={setFormality}
                            />
                            <span className="font-semibold text-indigo-700 w-32 text-center">{getFormalityLabel(formality[0])}</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="language" className="text-lg font-semibold text-gray-700">Idioma Principal</Label>
                        <p className="text-sm text-gray-500 mb-3">Define o idioma padrão para as interações.</p>
                        <Select defaultValue={AI_CONFIG.language.toLowerCase()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o idioma" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                                <SelectItem value="en-us">Inglês (EUA)</SelectItem>
                                <SelectItem value="es-es">Espanhol (Espanha)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="persona" className="text-lg font-semibold text-gray-700">Instruções de Persona</Label>
                        <p className="text-sm text-gray-500 mb-3">Descreva a personalidade da IA. Ex: "Você é um assistente amigável e prestativo..."</p>
                        <Textarea 
                            id="persona"
                            placeholder="Seja um guia turístico entusiasmado pela cidade de São João do Paraíso..."
                            rows={8}
                            defaultValue={`Você é ${AI_CONFIG.name}, a Inteligência do Portal Paraíso Online. Sua missão é ajudar usuários a encontrar informações sobre empresas, eventos e notícias da cidade. Você é empática, proativa e possui um conhecimento superior em marketing e atendimento. Sempre se comunique de forma natural e evite respostas robóticas.`}
                        />
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

export default AiPersonality;