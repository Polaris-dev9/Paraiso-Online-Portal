import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { User, Loader2, Lock, Mail, Eye, EyeOff, HelpCircle, Edit, BarChart2, Star, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const GoogleIcon = () => (
    <svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 13.8 244 13.8c72.3 0 134.3 29.1 179.4 74.4l-66 66C314.6 118.3 282.7 103 244 103c-84.3 0-152.3 68.3-152.3 152.8s68 152.8 152.3 152.8c97.2 0 130.3-72.8 134-110.2H244v-76h244z"></path>
    </svg>
);

const UserLogin = () => {
    const { signInWithPassword, signInWithGoogle, user: supabaseUser, resendConfirmationEmail, resetPasswordForEmail } = useSupabaseAuth();
    const { login: adminLogin } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
    const [resendingEmail, setResendingEmail] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [sendingResetEmail, setSendingResetEmail] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    // Não redirecionar automaticamente - deixar o usuário fazer login manualmente
    // Se já estiver logado, o RoleGuard em outras rotas protegerá
    // Este componente deve SEMPRE mostrar a tela de login

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
        
        // Tentar login admin primeiro (é assíncrono)
        const adminUser = await adminLogin(email, password);
        if (adminUser) {
            toast({ 
                variant: "success",
                title: "Login administrativo bem-sucedido!", 
                description: "Redirecionando para o painel..." 
            });
            // Aguardar um pouco mais para garantir que o estado do contexto seja atualizado
            // e o RoleGuard possa detectar o usuário antes de redirecionar
            await new Promise(resolve => setTimeout(resolve, 300));
            setLoading(false);
            navigate('/admin/dashboard', { replace: true });
            return;
        }

        // Se não for admin, tentar login como assinante (Supabase)
        const { error: supabaseError } = await signInWithPassword(email, password);
        if (supabaseError) {
            handleLoginError(supabaseError);
        } else {
            toast({ 
                variant: "success",
                title: "Login bem-sucedido!", 
                description: "Bem-vindo(a) de volta!" 
            });
            // Aguardar um pouco para garantir que o estado seja atualizado
            await new Promise(resolve => setTimeout(resolve, 300));
            setLoading(false);
            navigate('/subscriber-area', { replace: true });
            return;
        }
        setLoading(false);
    };

    const handleLoginError = (e) => {
        console.error("Login Error:", e);
        
        // Verificar se é erro de email não confirmado
        let friendlyMessage = "Não foi possível autenticar. Verifique suas credenciais ou tente novamente.";
        let errorTitle = "Erro no Login";
        const isEmailNotConfirmedError = e?.message?.toLowerCase().includes('email_not_confirmed') || 
                                         e?.error_code === 'email_not_confirmed' ||
                                         e?.code === 'email_not_confirmed';
        
        if (isEmailNotConfirmedError) {
            friendlyMessage = "Seu email ainda não foi confirmado. Verifique sua caixa de entrada (e a pasta de spam) e clique no link de confirmação.";
            errorTitle = "Email Não Confirmado";
            setIsEmailNotConfirmed(true);
        } else if (e?.message?.toLowerCase().includes('invalid login') || 
                   e?.message?.toLowerCase().includes('invalid credentials')) {
            friendlyMessage = "Email ou senha incorretos. Verifique suas credenciais e tente novamente.";
            errorTitle = "Credenciais Inválidas";
            setIsEmailNotConfirmed(false);
        } else {
            setIsEmailNotConfirmed(false);
        }
        
        setError(friendlyMessage);
        toast({ 
            variant: "destructive", 
            title: errorTitle, 
            description: friendlyMessage,
            duration: 8000 // Mostrar por mais tempo para mensagens importantes
        });
        setLoading(false);
    };

    const handleResendConfirmation = async () => {
        if (!email) {
            toast({
                variant: "destructive",
                title: "Email necessário",
                description: "Por favor, preencha o campo de email primeiro.",
            });
            return;
        }

        setResendingEmail(true);
        try {
            const { error } = await resendConfirmationEmail(email);
            if (error) {
                throw error;
            }
            toast({
                variant: "success",
                title: "✅ Email reenviado!",
                description: "Verifique sua caixa de entrada e clique no link de confirmação.",
            });
        } catch (error) {
            console.error("Error resending confirmation:", error);
            toast({
                variant: "destructive",
                title: "Erro ao reenviar",
                description: error.message || "Não foi possível reenviar o email de confirmação.",
            });
        } finally {
            setResendingEmail(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!forgotPasswordEmail.trim()) {
            toast({
                variant: "destructive",
                title: "Email necessário",
                description: "Por favor, informe seu email.",
            });
            return;
        }

        setSendingResetEmail(true);
        try {
            console.log('[ForgotPassword] Sending reset email to:', forgotPasswordEmail.trim());
            const { error, data } = await resetPasswordForEmail(forgotPasswordEmail.trim());
            
            if (error) {
                console.error('[ForgotPassword] Error details:', {
                    message: error.message,
                    status: error.status,
                    code: error.code,
                    error
                });
                
                // Tratar erros específicos
                let errorMessage = "Não foi possível enviar o email de recuperação.";
                let errorTitle = "Erro ao enviar email";
                
                if (error.message?.includes('rate_limit')) {
                    errorMessage = "Muitas tentativas. Por favor, aguarde alguns minutos e tente novamente.";
                } else if (error.message?.includes('user_not_found') || error.message?.includes('not found')) {
                    errorMessage = "Este email não está cadastrado em nosso sistema.";
                    errorTitle = "Email não encontrado";
                } else if (error.message?.includes('email')) {
                    errorMessage = "Por favor, verifique se o email está correto e tente novamente.";
                } else {
                    errorMessage = error.message || errorMessage;
                }
                
                toast({
                    variant: "destructive",
                    title: errorTitle,
                    description: errorMessage,
                    duration: 8000,
                });
                return;
            }
            
            console.log('[ForgotPassword] Reset email sent successfully');
            setResetEmailSent(true);
            toast({
                variant: "success",
                title: "✅ Email enviado!",
                description: "Verifique sua caixa de entrada (e pasta de spam) para redefinir sua senha.",
                duration: 6000,
            });
        } catch (error) {
            console.error("[ForgotPassword] Unexpected error:", error);
            toast({
                variant: "destructive",
                title: "Erro inesperado",
                description: "Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte.",
                duration: 8000,
            });
        } finally {
            setSendingResetEmail(false);
        }
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
                                {error && (
                                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded" role="alert">
                                        <p className="mb-2">{error}</p>
                                        {isEmailNotConfirmed && (
                                            <Button 
                                                type="button"
                                                variant="outline" 
                                                size="sm" 
                                                onClick={handleResendConfirmation}
                                                disabled={resendingEmail}
                                                className="w-full mt-2"
                                            >
                                                {resendingEmail ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Reenviando...
                                                    </>
                                                ) : (
                                                    "📧 Reenviar Email de Confirmação"
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}
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
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setForgotPasswordEmail(email);
                                                setShowForgotPassword(true);
                                                setResetEmailSent(false);
                                            }}
                                            className="text-xs text-blue-600 hover:underline mt-1 block text-right"
                                        >
                                            Esqueci minha senha
                                        </button>
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

            {/* Modal de Recuperação de Senha */}
            <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                <DialogContent className="sm:max-w-[500px] bg-white border-2 border-gray-300 shadow-2xl p-8">
                    <DialogHeader className="text-center pb-4 bg-white rounded-t-lg">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 shadow-md">
                            <KeyRound className="h-8 w-8 text-blue-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-gray-900 bg-white">
                            {resetEmailSent ? "Email Enviado!" : "Recuperar Senha"}
                        </DialogTitle>
                        <DialogDescription className="text-base text-gray-600 pt-2 bg-white">
                            {resetEmailSent 
                                ? "Verifique sua caixa de entrada e clique no link para redefinir sua senha."
                                : "Digite o email associado à sua conta e enviaremos um link para redefinir sua senha."
                            }
                        </DialogDescription>
                    </DialogHeader>
                    {resetEmailSent ? (
                        <div className="space-y-6 py-4 bg-white">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                    <Mail className="h-8 w-8 text-green-600" />
                                </div>
                                <p className="text-green-900 font-semibold text-lg mb-2">Email enviado com sucesso!</p>
                                <p className="text-sm text-green-800 mb-4">
                                    Enviamos um link de recuperação para:
                                </p>
                                <p className="text-base font-medium text-green-900 bg-white px-4 py-2 rounded-lg border border-green-200">
                                    {forgotPasswordEmail}
                                </p>
                            </div>
                            <Button 
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setResetEmailSent(false);
                                }}
                                className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                                size="lg"
                            >
                                Fechar
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleForgotPassword} className="space-y-5 py-2 bg-white">
                            <div className="space-y-2 bg-white">
                                <Label htmlFor="forgot-email" className="text-base font-medium text-gray-700 bg-white">
                                    Endereço de E-mail
                                </Label>
                                <div className="relative bg-white">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        id="forgot-email"
                                        type="email"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        placeholder="digite.seu@email.com"
                                        required
                                        autoFocus
                                        className="pl-11 h-12 text-base border-2 bg-white focus:border-blue-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1 bg-white">
                                    Enviaremos um link seguro para redefinir sua senha
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2 bg-white">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForgotPassword(false);
                                        setForgotPasswordEmail('');
                                    }}
                                    className="flex-1 h-11 text-base font-medium border-2"
                                    size="lg"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={sendingResetEmail}
                                    className="flex-1 h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                >
                                    {sendingResetEmail ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Mail className="mr-2 h-5 w-5" />
                                            Enviar Link
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserLogin;