import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { UserPlus, Send, Briefcase, PenSquare, Building, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { subscriberService } from '@/services/subscriberService';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.8 111.8 13.8 244 13.8c72.3 0 134.3 29.1 179.4 74.4l-66 66C314.6 118.3 282.7 103 244 103c-84.3 0-152.3 68.3-152.3 152.8s68 152.8 152.3 152.8c97.2 0 130.3-72.8 134-110.2H244v-76h244z"></path>
    </svg>
);

const FreeRegister = () => {
    const { toast } = useToast();
    const { user, signInWithGoogle, signUp, signInWithPassword, resendConfirmationEmail } = useSupabaseAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', bio: '', phone: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [registrationMethod, setRegistrationMethod] = useState('google'); // 'google' or 'email'
    const [emailData, setEmailData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
    const [emailLoading, setEmailLoading] = useState(false);

    useEffect(() => {
        if (user) {
            // Preencher nome do metadata se disponível
            if (!profileData.name) {
                const nameFromMetadata = user.user_metadata?.full_name || emailData.name;
                if (nameFromMetadata) {
                    setProfileData(prev => ({ ...prev, name: nameFromMetadata }));
                }
            }
        }
    }, [user, toast, profileData.name, emailData.name]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const { error } = await signInWithGoogle();
        if (error) {
            toast({
                variant: "destructive",
                title: "Erro no Cadastro",
                description: "Não foi possível conectar com o Google. Tente novamente.",
            });
        }
        setLoading(false);
    };

    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        
        // Validações
        if (!emailData.email || !emailData.password) {
            toast({
                variant: "destructive",
                title: "Campos obrigatórios",
                description: "Por favor, preencha email e senha.",
            });
            return;
        }

        if (emailData.password !== emailData.confirmPassword) {
            toast({
                variant: "destructive",
                title: "Senhas não coincidem",
                description: "As senhas devem ser iguais.",
            });
            return;
        }

        if (emailData.password.length < 6) {
            toast({
                variant: "destructive",
                title: "Senha muito curta",
                description: "A senha deve ter pelo menos 6 caracteres.",
            });
            return;
        }

        setEmailLoading(true);
        
        try {
            const { data, error } = await signUp(
                emailData.email.trim(),
                emailData.password,
                {
                    full_name: emailData.name || emailData.email.split('@')[0]
                }
            );

            if (error) {
                throw error;
            }

            // Se o usuário foi criado
            if (data?.user) {
                // Preencher dados básicos se fornecidos
                if (emailData.name) {
                    setProfileData(prev => ({ ...prev, name: emailData.name }));
                }

                // Verificar se há sessão ativa
                if (data.session) {
                    // Sessão criada automaticamente - usuário será atualizado pelo contexto em breve
                    toast({
                        variant: "success",
                        title: '✅ Conta criada!',
                        description: 'Agora complete seu perfil básico.',
                    });
                    console.log('[FreeRegister] Session created, user will be available shortly');
                } else {
                    // Não há sessão - precisa confirmar email
                    // Não tentar fazer login automaticamente - vai falhar se email não confirmado
                    toast({
                        variant: "success",
                        title: '✅ Conta criada!',
                        description: 'Enviamos um email de confirmação. Verifique sua caixa de entrada.',
                        duration: 6000
                    });

                    // Aguardar um pouco e então mostrar opções
                    setTimeout(() => {
                        toast({
                            variant: "default",
                            title: '📧 Confirme seu email',
                            description: 'Após confirmar o email, você poderá fazer login. Ou confirme manualmente no Supabase Dashboard.',
                            duration: 8000
                        });
                        // Redirecionar para página de login após mostrar as mensagens
                        setTimeout(() => {
                            navigate('/area-do-assinante');
                        }, 2000);
                    }, 3000);
                }
            }
        } catch (error) {
            console.error('Error signing up:', error);
            toast({
                variant: "destructive",
                title: 'Erro ao criar conta',
                description: error.message || 'Não foi possível criar sua conta. Tente novamente.',
            });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        
        try {
            // Verificar se já existe assinante para este usuário
            let subscriber = await subscriberService.getSubscriberByUserId(user.id);

            if (subscriber) {
                // Se já existe, atualizar dados
                subscriber = await subscriberService.updateSubscriber(subscriber.id, {
                    name: profileData.name,
                    description: profileData.bio,
                    phone: profileData.phone
                });
            } else {
                // Se não existe, criar novo assinante gratuito
                subscriber = await subscriberService.createSubscriber({
                    user_id: user.id,
                    name: profileData.name,
                    email: user.email,
                    phone: profileData.phone || null,
                    profile_type: 'empresarial',
                    plan_type: 'gratuito',
                    payment_status: 'free',
                    description: profileData.bio || null,
                    status: true
                });
            }

            toast({
                variant: "success",
                title: '🎉 Perfil Salvo!',
                description: 'Sua página básica foi criada com sucesso.',
            });
            
            // Aguardar um pouco antes de redirecionar para evitar conflitos de renderização
            setTimeout(() => {
                navigate('/subscriber-area', { replace: true });
            }, 500);
        } catch (error) {
            console.error('Error saving profile:', error);
            toast({ 
                variant: "destructive", 
                title: 'Erro ao salvar!', 
                description: error.message || 'Não foi possível salvar suas informações.' 
            });
        } finally {
            setFormLoading(false);
        }
    };

    if (user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <Helmet>
                    <title>Complete seu Perfil - Portal Paraíso Online</title>
                </Helmet>
                <div className="container mx-auto max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-blue-900 flex items-center"><CheckCircle className="mr-3 text-green-500" /> Bem-vindo(a)!</CardTitle>
                            <CardDescription>Complete as informações básicas da sua página. Você poderá editar depois.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nome do Negócio / Profissional</Label>
                                    <Input id="name" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} required />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                    <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="(XX) XXXXX-XXXX" />
                                </div>
                                <div>
                                    <Label htmlFor="bio">Breve Descrição (até 150 caracteres)</Label>
                                    <Textarea id="bio" value={profileData.bio} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} maxLength="150" required />
                                </div>
                                <Button type="submit" className="w-full gradient-gold text-white font-bold" disabled={formLoading}>
                                    {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Finalizar e Criar Página
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12">
            <Helmet>
                <title>Cadastro Gratuito - Portal Paraíso Online</title>
                <meta name="description" content="Faça seu cadastro gratuito no Portal Paraíso Online usando sua conta Google e comece a ser visto." />
            </Helmet>

            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
                        <UserPlus className="inline-block mr-3" />
                        Cadastro Gratuito
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Crie sua página básica em segundos e comece a ser encontrado por novos clientes.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
                    {/* Tabs para escolher método de cadastro */}
                    <div className="flex border-b mb-6">
                        <button
                            type="button"
                            onClick={() => setRegistrationMethod('google')}
                            className={`flex-1 py-2 text-center font-medium transition-colors ${
                                registrationMethod === 'google'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Google
                        </button>
                        <button
                            type="button"
                            onClick={() => setRegistrationMethod('email')}
                            className={`flex-1 py-2 text-center font-medium transition-colors ${
                                registrationMethod === 'email'
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Email e Senha
                        </button>
                    </div>

                    {registrationMethod === 'google' ? (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comece com um clique</h2>
                            <p className="text-gray-600 mb-6">Use sua conta Google para um cadastro rápido e seguro.</p>
                            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full text-lg py-6" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Aguarde...
                                    </>
                                ) : (
                                    <>
                                        <GoogleIcon />
                                        Cadastrar-se com Google
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailSignUp} className="space-y-4">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Criar conta com Email</h2>
                            
                            <div>
                                <Label htmlFor="signup-name">Nome (opcional)</Label>
                                <Input 
                                    id="signup-name"
                                    type="text"
                                    value={emailData.name}
                                    onChange={(e) => setEmailData({...emailData, name: e.target.value})}
                                    placeholder="Seu nome completo"
                                />
                            </div>

                            <div>
                                <Label htmlFor="signup-email">Email *</Label>
                                <Input 
                                    id="signup-email"
                                    type="email"
                                    value={emailData.email}
                                    onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="signup-password">Senha *</Label>
                                <Input 
                                    id="signup-password"
                                    type="password"
                                    value={emailData.password}
                                    onChange={(e) => setEmailData({...emailData, password: e.target.value})}
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div>
                                <Label htmlFor="signup-confirm-password">Confirmar Senha *</Label>
                                <Input 
                                    id="signup-confirm-password"
                                    type="password"
                                    value={emailData.confirmPassword}
                                    onChange={(e) => setEmailData({...emailData, confirmPassword: e.target.value})}
                                    placeholder="Digite a senha novamente"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button type="submit" className="w-full text-lg py-6" disabled={emailLoading}>
                                {emailLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Criando conta...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-5 w-5" />
                                        Criar Conta
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    <p className="text-xs text-gray-500 mt-6 text-center">Ao continuar, você concorda com nossos <a href="/termos" className="underline">Termos de Serviço</a> e <a href="/privacidade" className="underline">Política de Privacidade</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default FreeRegister;