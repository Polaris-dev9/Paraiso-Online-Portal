import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { LogIn, Crown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';

const MasterLogin = () => {
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
        
        if (user && user.role === 'master') {
            toast({ title: '👑 Acesso Master Concedido!', description: 'Bem-vindo(a), Comandante!' });
            navigate('/admin/dashboard', { replace: true });
        } else {
            toast({ 
                variant: 'destructive', 
                title: '🚫 Acesso Negado!', 
                description: 'Esta área é restrita ao Administrador Master.' 
            });
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <Helmet>
                <title>Acesso Master - Portal Paraíso Online</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8 border-t-4 border-yellow-400"
            >
                <div className="text-center mb-4">
                    <Crown className="mx-auto text-yellow-500" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Acesso Master</h1>
                <p className="text-gray-600 mb-6 text-center">Área de controle total do sistema.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">E-mail Master</Label>
                        <Input 
                            id="email"
                            type="email" 
                            placeholder="master@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">Senha Master</Label>
                        <Input 
                            id="password"
                            type="password" 
                            placeholder="Digite sua senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3" disabled={loading}>
                        {loading ? 'Verificando...' : (
                            <>
                                <LogIn className="mr-2" size={18} />
                                Acessar
                            </>
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

export default MasterLogin;