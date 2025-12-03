import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const ProtectedRoute = ({ children, requiredRole, planRequired = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const { toast } = useToast();

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100">Carregando...</div>;
    }

    if (!user) {
        const targetPath = location.pathname.startsWith('/admin') ? "/login-admin" : "/area-do-assinante";
        return <Navigate to={targetPath} state={{ from: location }} replace />;
    }
    
    const userRole = user.role;

    if (userRole === 'master') {
        return children;
    }

    if (userRole === 'admin') {
        const adminAllowed = (requiredRole === 'admin' || requiredRole === 'subscriber' || requiredRole === 'franchisee');
        if (adminAllowed) {
             const isMasterOnlyRoute = location.pathname.includes('/franquias') 
                                   || location.pathname.includes('/equipe')
                                   || location.pathname.startsWith('/admin/ai')
                                   || location.pathname.includes('/assinantes');
            if (isMasterOnlyRoute) {
                toast({ variant: "destructive", title: "🚫 Acesso Negado", description: "Você não tem permissão para acessar esta página." });
                return <Navigate to="/admin/dashboard" replace />;
            }
            return children;
        }
    }
    
    const hasRequiredRole = (userRole === requiredRole);

    if (!hasRequiredRole) {
        toast({ variant: "destructive", title: "🚫 Acesso Negado", description: "Usuário não autorizado para esta área." });
        if (location.pathname.startsWith('/admin')) {
            return <Navigate to="/area-do-assinante" replace />;
        }
        return <Navigate to="/" replace />;
    }

    if (planRequired) {
        const hasActivePlan = user.plan_status === 'active';
        if (!hasActivePlan) {
            toast({ variant: "destructive", title: "Plano Inativo", description: "Seu plano não permite acesso a esta funcionalidade. Faça um upgrade!" });
            return <Navigate to="/upgrade" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;