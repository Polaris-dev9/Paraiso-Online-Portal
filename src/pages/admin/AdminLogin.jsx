import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Helmet } from 'react-helmet-async';
    import { LogIn, ShieldAlert, AlertCircle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/AuthContext';
    import { Label } from '@/components/ui/label';

    const AdminLogin = () => {
        const { toast } = useToast();
        const navigate = useNavigate();
        const { login } = useAuth();
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        const handleLogin = async (e) => {
            e.preventDefault();
            setLoading(true);
            setError('');
            
            const user = await login(email, password);
            
            if (user && (user.role === 'master' || user.role === 'general_admin' || user.role === 'content_admin' || user.role === 'franchisee')) {
                toast({ title: '✅ Acesso Concedido!', description: 'Bem-vindo(a) à Área Administrativa.' });
                if (user.role === 'franchisee') {
                    navigate('/franquia/dashboard', { replace: true });
                } else {
                    navigate('/admin/dashboard', { replace: true });
                }
            } else {
                const errorMessage = 'Credenciais inválidas ou usuário não autorizado para esta área.';
                setError(errorMessage);
                toast({ 
                    variant: 'destructive', 
                    title: '🚫 Acesso Negado!', 
                    description: errorMessage
                });
            }
            
            setLoading(false);
        };

        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#e0e0e0' }}>
                <Helmet>
                    <title>Login Administrativo - Portal Paraíso Online</title>
                    <meta name="robots" content="noindex, nofollow" />
                </Helmet>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8"
                >
                    <div className="text-center mb-4">
                        <ShieldAlert className="mx-auto text-blue-800" size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">Acesso Restrito</h1>
                    <p className="text-gray-600 mb-6 text-center">Esta área é exclusiva para administradores.</p>
                    
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                            <p className="font-bold flex items-center"><AlertCircle className="mr-2"/>Falha na autenticação</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-blue-900">E-mail</Label>
                            <Input 
                                id="email"
                                type="email" 
                                placeholder="seu@email.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                className="border-gray-400 bg-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-blue-900">Senha de Acesso</Label>
                            <Input 
                                id="password"
                                type="password" 
                                placeholder="Digite sua senha" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                className="border-gray-400 bg-white"
                            />
                        </div>
                        <Button type="submit" style={{backgroundColor: '#007bff', color: '#fff'}} className="w-full font-bold py-3" disabled={loading}>
                            {loading ? 'Entrando...' : (
                                <>
                                    <LogIn className="mr-2" size={18} />
                                    Entrar
                                </>
                            )}
                        </Button>
                    </form>
                </motion.div>
            </div>
        );
    };

    export default AdminLogin;