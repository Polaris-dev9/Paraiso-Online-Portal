import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CreditCard, User, MapPin, Lock, QrCode, Barcode, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Checkout = () => {
    const { toast } = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const { planName, planPrice } = location.state || { planName: 'Plano Padrão', planPrice: '49.90' };
    const [paymentMethod, setPaymentMethod] = useState('pix');

    const handlePayment = () => {
        toast({
            title: "🎉 Pagamento Recebido!",
            description: "Seu plano foi ativado. Você receberá um e-mail de confirmação em breve.",
        });
        setTimeout(() => navigate('/area-do-assinante'), 2000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copiado!", description: "Código PIX copiado para a área de transferência." });
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#e0e0e0' }}>
            <Helmet>
                <title>Checkout - {planName}</title>
            </Helmet>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Finalizar Assinatura</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-8">
                        <Card className="bg-white border-gray-400">
                            <CardHeader><CardTitle className="flex items-center gap-2 text-gray-900"><User /> Suas Informações</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><Label htmlFor="name">Nome Completo / Razão Social</Label><Input id="name" placeholder="Seu nome ou da sua empresa" className="bg-white border-gray-400"/></div>
                                <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" placeholder="seu@email.com" className="bg-white border-gray-400"/></div>
                                <div><Label htmlFor="cpf">CPF / CNPJ</Label><Input id="cpf" placeholder="000.000.000-00" className="bg-white border-gray-400"/></div>
                                <div><Label htmlFor="phone">Telefone</Label><Input id="phone" placeholder="(00) 90000-0000" className="bg-white border-gray-400"/></div>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-gray-400">
                            <CardHeader><CardTitle className="flex items-center gap-2 text-gray-900"><CreditCard /> Forma de Pagamento</CardTitle></CardHeader>
                            <CardContent>
                                <Tabs defaultValue="pix" onValueChange={setPaymentMethod} className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-gray-200">
                                        <TabsTrigger value="pix"><QrCode className="mr-2 h-4 w-4"/>PIX</TabsTrigger>
                                        <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4"/>Cartão</TabsTrigger>
                                        <TabsTrigger value="boleto"><Barcode className="mr-2 h-4 w-4"/>Boleto</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="pix" className="mt-6 text-center">
                                        <p className="text-gray-700 mb-4">Escaneie o QR Code ou use o código abaixo para pagar.</p>
                                        <div className="flex justify-center mb-4">
                                            <img alt="QR Code para pagamento PIX" src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf" />
                                        </div>
                                        <div className="relative">
                                            <Input readOnly value="00020126330014br.gov.bcb.pix011112345678901..." className="pr-10 bg-gray-100 border-gray-400"/>
                                            <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => copyToClipboard('00020126330014br.gov.bcb.pix011112345678901...')}>
                                                <Copy size={16}/>
                                            </Button>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="card" className="mt-6 space-y-4">
                                        <div><Label htmlFor="card-name">Nome no Cartão</Label><Input id="card-name" className="bg-white border-gray-400"/></div>
                                        <div><Label htmlFor="card-number">Número do Cartão</Label><Input id="card-number" className="bg-white border-gray-400"/></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><Label htmlFor="card-expiry">Validade</Label><Input id="card-expiry" placeholder="MM/AA" className="bg-white border-gray-400"/></div>
                                            <div><Label htmlFor="card-cvc">CVC</Label><Input id="card-cvc" className="bg-white border-gray-400"/></div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="boleto" className="mt-6 text-center">
                                        <p className="text-gray-700 mb-4">O boleto será gerado e enviado para o seu e-mail após a confirmação.</p>
                                        <p className="text-sm text-gray-500">(A confirmação pode levar até 3 dias úteis)</p>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card className="bg-white border-gray-400 sticky top-8">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Resumo da Assinatura</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between font-semibold text-gray-800"><p>Plano Selecionado:</p><p>{planName}</p></div>
                                    <hr className="my-4 border-gray-300" />
                                    <div className="flex justify-between font-bold text-2xl text-gray-900"><p>Total a Pagar:</p><p>R$ {planPrice}</p></div>
                                </div>
                                <hr className="my-4 border-gray-300" />
                                <Button onClick={handlePayment} size="lg" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg">
                                    <Lock className="mr-2 h-5 w-5" /> Pagar e Ativar Plano
                                </Button>
                                <p className="text-xs text-gray-500 mt-4 text-center">Seus dados estão seguros. Pagamento processado em ambiente criptografado.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Checkout;