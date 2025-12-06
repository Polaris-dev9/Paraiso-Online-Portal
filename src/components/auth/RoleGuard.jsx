import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export function RoleGuard({ children, requiredRoles }) {
  const { user: adminUser, loading: adminLoading } = useAuth();
  const { user: supabaseUser, loading: supabaseLoading } = useSupabaseAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const loading = adminLoading || supabaseLoading;

  // Quando o loading terminar e não houver usuário, marcar como verificado após um pequeno delay
  // Isso permite que o contexto tenha tempo de atualizar caso esteja fazendo uma verificação assíncrona
  useEffect(() => {
    // Se acabou de carregar e não tem usuário, aguardar um momento e então marcar como verificado
    if (!loading && !adminUser && !supabaseUser && !hasCheckedSession) {
      console.log('[RoleGuard] Loading finished, no user found. Will check session...');
      const timeout = setTimeout(() => {
        setHasCheckedSession(true);
        console.log('[RoleGuard] Session check completed - no user found');
      }, 500); // Pequeno delay para permitir atualização do contexto
      
      return () => clearTimeout(timeout);
    }
    
    // Se o usuário apareceu, resetar o flag
    if ((adminUser || supabaseUser) && hasCheckedSession) {
      console.log('[RoleGuard] User found - resetting session check flag');
      setHasCheckedSession(false);
    }
  }, [loading, adminUser, supabaseUser, hasCheckedSession]);

  // Reset quando navegar para uma rota diferente
  useEffect(() => {
    setHasCheckedSession(false);
  }, [location.pathname]);

  // Debug logs
  useEffect(() => {
    console.log('[RoleGuard] Debug:', {
      pathname: location.pathname,
      adminLoading,
      supabaseLoading,
      loading,
      hasAdminUser: !!adminUser,
      hasSupabaseUser: !!supabaseUser,
      adminUserEmail: adminUser?.email,
      supabaseUserEmail: supabaseUser?.email,
      adminUserRole: adminUser?.role,
      requiredRoles,
      hasCheckedSession
    });
  }, [location.pathname, adminLoading, supabaseLoading, loading, adminUser, supabaseUser, requiredRoles, hasCheckedSession]);

  const user = adminUser || supabaseUser;
  const userRole = adminUser?.role || (supabaseUser ? 'subscriber' : null);

  console.log('[RoleGuard] Auth check:', {
    hasUser: !!user,
    userRole,
    requiredRoles,
    roleMatches: userRole && requiredRoles.includes(userRole),
    adminUser: adminUser ? { email: adminUser.email, role: adminUser.role } : null,
    supabaseUser: supabaseUser ? { id: supabaseUser.id, email: supabaseUser.email } : null,
    hasCheckedSession
  });

  // Aguardar enquanto está carregando
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium">Carregando...</div>
      </div>
    );
  }

  // Se não tem usuário mas ainda não verificou a sessão, aguardar
  if (!user && !hasCheckedSession) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium">Verificando sessão...</div>
      </div>
    );
  }

  // Se não tem usuário E já verificou a sessão (não encontrou), redirecionar IMEDIATAMENTE
  if (!user && hasCheckedSession) {
    console.log('[RoleGuard] No user found after session check - redirecting to login');
    let targetPath = "/area-do-assinante";
    if (location.pathname.startsWith('/admin')) targetPath = "/login-admin";
    if (location.pathname.startsWith('/franquia')) targetPath = "/login-admin";
    
    return <Navigate to={targetPath} state={{ from: location }} replace />;
  }

  if (!userRole || !requiredRoles.includes(userRole)) {
    console.log('[RoleGuard] Role mismatch - redirecting to unauthorized', {
      userRole,
      requiredRoles,
      hasUserRole: !!userRole,
      roleInRequired: userRole && requiredRoles.includes(userRole)
    });
    toast({
      variant: "destructive",
      title: "🚫 Acesso Negado",
      description: "Você não tem permissão para acessar esta página.",
    });
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('[RoleGuard] Access granted');
  return children;
}