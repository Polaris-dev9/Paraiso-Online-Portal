import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Settings, Save, Palette, Bell, Link as LinkIcon, ShoppingCart, HardHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const GoogleIcon = () => (
    <svg className="h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 13.8 244 13.8c72.3 0 134.3 29.1 179.4 74.4l-66 66C314.6 118.3 282.7 103 244 103c-84.3 0-152.3 68.3-152.3 152.8s68 152.8 152.3 152.8c97.2 0 130.3-72.8 134-110.2H244v-76h244z"></path>
    </svg>
);

const AdminGeneralSettings = () => {
    const { toast } = useToast();
    const { settings, updateSettings } = useAuth();
    const [localSettings, setLocalSettings] = useState(settings);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const handleSwitchChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        updateSettings(localSettings);
        toast({
            title: "✅ Configurações Salvas!",
            description: "As configurações gerais do portal foram atualizadas.",
        });
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-[#f1f1f1]">
            <Helmet>
                <title>Admin: Configurações Gerais</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
                            <Settings className="mr-3 text-[#0d47a1]" /> Configurações Gerais
                        </h1>
                        <p className="text-gray-700 mt-1">Ajustes globais, identidade visual e integrações do portal.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Identidade do Portal</CardTitle>
                                <CardDescription className="text-gray-600">Informações básicas e logo do portal.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="portal-name" className="text-gray-800">Nome do Portal</Label>
                                    <Input id="portal-name" defaultValue="Portal Paraíso Online" />
                                </div>
                                <div>
                                    <Label htmlFor="portal-logo" className="text-gray-800">Logo Principal (URL)</Label>
                                    <Input id="portal-logo" placeholder="https://..." />
                                </div>
                                <div>
                                    <Label htmlFor="portal-favicon" className="text-gray-800">Favicon (URL)</Label>
                                    <Input id="portal-favicon" placeholder="https://..." />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Integrações de Pagamento</CardTitle>
                                <CardDescription className="text-gray-600">Configure as chaves de API para o gateway de pagamento.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="mercado-pago-key" className="text-gray-800">Chave Pública Mercado Pago</Label>
                                    <Input id="mercado-pago-key" placeholder="APP_USR-..." />
                                </div>
                                <div>
                                    <Label htmlFor="pix-key" className="text-gray-800">Chave PIX (Aleatória)</Label>
                                    <Input id="pix-key" placeholder="Chave aleatória gerada pelo seu banco" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Controles do Portal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <Label htmlFor="google-login-switch" className="flex items-center gap-2 text-gray-800">
                                        <GoogleIcon /> Login com Google
                                    </Label>
                                    <Switch id="google-login-switch" checked={localSettings.googleLoginEnabled} onCheckedChange={(v) => handleSwitchChange('googleLoginEnabled', v)} />
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border">
                                    <Label htmlFor="maintenance-mode" className="flex items-center gap-2 text-gray-800">
                                        <HardHat /> Modo Manutenção
                                    </Label>
                                    <Switch id="maintenance-mode" checked={localSettings.maintenanceMode} onCheckedChange={(v) => handleSwitchChange('maintenanceMode', v)} />
                                </div>
                                <p className="text-xs text-gray-600 mt-2">Apenas usuários administrativos poderão acessar o site em modo manutenção.</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Redes Sociais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="facebook-url" className="text-gray-800">Facebook</Label>
                                    <Input id="facebook-url" placeholder="https://facebook.com/seuportal" />
                                </div>
                                <div>
                                    <Label htmlFor="instagram-url" className="text-gray-800">Instagram</Label>
                                    <Input id="instagram-url" placeholder="https://instagram.com/seuportal" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSave} className="gradient-button text-lg px-8 py-6">
                        <Save className="mr-2 h-5 w-5" /> Salvar Configurações
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminGeneralSettings;