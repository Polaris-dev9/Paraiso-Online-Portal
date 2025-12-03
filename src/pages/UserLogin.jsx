import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, Loader2, Lock, Mail, Eye, EyeOff, HelpCircle, Edit, BarChart2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 13.8 244 13.8c72.3 0 134.3 29.1 179.4 74.4l-66 66C314.6 118.3 282.7 103 244 103c-84.3 0-152.3 68.3-152.3 152.8s68 152.8 152.3 152.8c97.2 0 130.3-72.8 134-110.2H244v-76h244z"></path>
    </svg>
);

const UserLogin = () => {
    const { signInWithPassword, signInWithGoogle, user: supabaseUser } = useSupabaseAuth();
    const { login: adminLogin } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (supabaseUser) {
            navigate('/painel-assinante');
        }
    }, [supabaseUser, navigate]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            await signInWithGoogle();
        } catch (e) {
            handleLoginError(e);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        const adminUser = adminLogin(email, password);
        if (adminUser) {
            toast({ title: "Login administrativo bem-sucedido!", description: "Redirecionando para o painel..." });
            navigate('/admin/dashboard');
            return;
        }

        const { error: supabaseError } = await signInWithPassword(email, password);
        if (supabaseError) {
            handleLoginError(supabaseError);
        } else {
            toast({ title: "Login bem-sucedido!", description: "Bem-vindo(a) de volta!" });
            navigate('/painel-assinante');
        }
        setLoading(false);
    };

    const handleLoginError = (e) => {
        console.error("Login Error:", e);
        const friendlyMessage = "Não foi possível autenticar. Verifique suas credenciais ou tente novamente.";
        setError(friendlyMessage);
        toast({ variant: "destructive", title: "Erro no Login", description: friendlyMessage });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <Helmet>
                <title>Área do Assinante - Portal Paraíso Online</title>
            </Helmet>
            <div className="container mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-blue-900">Bem-vindo à sua Central Exclusiva de Assinante</h1>
                    <p className="text-lg text-gray-600 mt-2 max-w-3xl mx-auto">Aqui você tem acesso a todas as ferramentas do Portal Paraíso Online: gerencie sua página, envie conteúdos, acompanhe seu desempenho e explore novas oportunidades para seu negócio.</p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="shadow-xl border-t-4 border-blue-600">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-blue-900">Acesse sua Conta</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm" role="alert"><p>{error}</p></div>}
                                <form onSubmit={handleEmailLogin} className="space-y-4">
                                    <div>
                                        <Label htmlFor="email">E-mail</Label>
                                        <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} /><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required className="pl-10" /></div>
                                    </div>
                                    <div>
                                        <Label htmlFor="password">Senha</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" required className="pl-10 pr-10" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                        </div>
                                        <Link to="#" className="text-xs text-blue-600 hover:underline mt-1 block text-right">Esqueci minha senha</Link>
                                    </div>
                                    <Button type="submit" className="w-full gradient-button font-bold" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Entrar</Button>
                                </form>
                                <div className="relative my-4"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">ou</span></div></div>
                                <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}Entrar com Google</Button>
                                <p className="text-center text-sm text-gray-600 mt-4">Ainda não tem conta? <Link to="/cadastro-gratis" className="font-medium text-blue-600 hover:underline">Cadastre-se agora</Link></p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Sua comunidade Paraíso Online!</h2>
                        <p className="text-gray-600">Como assinante, você tem acesso a uma central completa para atualizar seus dados, gerenciar anúncios, participar do marketplace e acompanhar relatórios de desempenho.</p>
                        <div className="space-y-2">
                            <h3 className="font-semibold">Perguntas Frequentes:</h3>
                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                <li>Como funciona a assinatura?</li>
                                <li>Como alterar meu plano?</li>
                                <li>Como falar com o suporte?</li>
                            </ul>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button asChild variant="outline"><Link to="/assine-agora"><Star className="mr-2 h-4 w-4"/>Ver Planos</Link></Button>
                            <Button asChild variant="outline"><Link to="/contato"><HelpCircle className="mr-2 h-4 w-4"/>Fale com Suporte</Link></Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;