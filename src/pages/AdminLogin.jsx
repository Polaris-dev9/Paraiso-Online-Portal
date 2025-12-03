import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LogIn, ShieldAlert } from 'lucide-react';
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const user = login(email, password);
        
        if (user && (user.role === 'master' || user.role === 'admin')) {
            toast({ title: '✅ Acesso Concedido!', description: 'Bem-vindo(a) à Área Administrativa.' });
            navigate('/admin/dashboard', { replace: true });
        } else {
            toast({ 
                variant: 'destructive', 
                title: '🚫 Acesso Negado!', 
                description: 'Credenciais inválidas ou usuário não autorizado.' 
            });
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
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
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input 
                            id="email"
                            type="email" 
                            placeholder="seu@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Senha de Acesso</Label>
                        <Input 
                            id="password"
                            type="password" 
                            placeholder="Digite sua senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full gradient-royal text-white font-bold py-3" disabled={loading}>
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