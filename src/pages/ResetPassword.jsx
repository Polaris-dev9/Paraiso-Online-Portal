import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const ResetPassword = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [validSession, setValidSession] = useState(false);

    useEffect(() => {
        // Verificar se há um hash de recuperação de senha na URL
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setValidSession(true);
            } else {
                // Se não há sessão, verificar se há hash de recuperação na URL
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                if (accessToken) {
                    // O Supabase vai processar automaticamente o token
                    setValidSession(true);
                } else {
                    toast({
                        variant: "destructive",
                        title: "Link inválido",
                        description: "O link de recuperação de senha é inválido ou expirou. Por favor, solicite um novo link.",
                    });
                    setTimeout(() => {
                        navigate('/area-do-assinante');
                    }, 3000);
                }
            }
        };

        checkSession();
    }, [navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Por favor, preencha todos os campos.",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                variant: "destructive",
                title: "Senha muito curta",
                description: "A senha deve ter pelo menos 6 caracteres.",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                variant: "destructive",
                title: "Senhas não coincidem",
                description: "As senhas digitadas não são iguais. Por favor, verifique.",
            });
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                throw error;
            }

            setSuccess(true);
            toast({
                variant: "success",
                title: "✅ Senha redefinida com sucesso!",
                description: "Você pode fazer login com sua nova senha.",
            });

            setTimeout(() => {
                navigate('/area-do-assinante');
            }, 2000);
        } catch (error) {
            console.error("Error resetting password:", error);
            toast({
                variant: "destructive",
                title: "Erro ao redefinir senha",
                description: error.message || "Não foi possível redefinir sua senha. Tente novamente.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!validSession && !success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Verificando link de recuperação...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <Helmet>
                <title>Redefinir Senha - Portal Paraíso Online</title>
            </Helmet>
            <div className="container mx-auto max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-blue-900">Redefinir Senha</h1>
                    <p className="text-gray-600 mt-2">
                        {success
                            ? "Sua senha foi redefinida com sucesso!"
                            : "Digite sua nova senha abaixo"
                        }
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="shadow-xl border-t-4 border-blue-600">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-blue-900">
                                {success ? "Senha Redefinida!" : "Nova Senha"}
                            </CardTitle>
                            <CardDescription>
                                {success
                                    ? "Você será redirecionado para a página de login em instantes."
                                    : "Escolha uma senha segura para sua conta."
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {success ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">
                                        Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
                                    </p>
                                    <Button onClick={() => navigate('/area-do-assinante')}>
                                        Ir para Login
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="password">Nova Senha</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Mínimo 6 caracteres"
                                                required
                                                className="pl-10 pr-10"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Digite a senha novamente"
                                                required
                                                className="pl-10 pr-10"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full gradient-button font-bold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Redefinindo...
                                            </>
                                        ) : (
                                            "Redefinir Senha"
                                        )}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;

