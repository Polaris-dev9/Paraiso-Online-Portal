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
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  const loading = adminLoading || supabaseLoading || isCheckingSession;

  // Aguardar um pouco mais se o contexto ainda está carregando mas já passou do loading inicial
  // Isso resolve o problema de timing quando a sessão é recuperada mas o estado ainda não atualizou
  useEffect(() => {
    // Se acabou de carregar mas não tem usuário, aguardar um pouco para o contexto atualizar
    if (!adminLoading && !supabaseLoading && !adminUser && !supabaseUser && !isCheckingSession && !hasCheckedSession) {
      console.log('[RoleGuard] No user found after loading. Waiting for context to update...');
      setIsCheckingSession(true);
      
      // Aguardar um pouco mais para dar tempo do SupabaseAuthContext atualizar o estado
      // Reduzido para 1 segundo - suficiente para o contexto atualizar
      const timeout = setTimeout(() => {
        setHasCheckedSession(true);
        setIsCheckingSession(false);
        console.log('[RoleGuard] Finished waiting for context update');
      }, 1000); // Aguardar 1 segundo para o contexto atualizar
      
      return () => clearTimeout(timeout);
    }
    
    // Se o usuário apareceu enquanto estava verificando, cancelar a verificação
    if (isCheckingSession && (adminUser || supabaseUser)) {
      console.log('[RoleGuard] User found! Cancelling session check');
      setIsCheckingSession(false);
      setHasCheckedSession(false);
    }
  }, [adminLoading, supabaseLoading, adminUser, supabaseUser, isCheckingSession, hasCheckedSession]);

  // Reset hasCheckedSession quando o usuário mudar ou quando navegar para uma rota diferente
  useEffect(() => {
    if (adminUser || supabaseUser) {
      setHasCheckedSession(false);
    }
  }, [adminUser, supabaseUser, location.pathname]);

  // Debug logs
  useEffect(() => {
    console.log('[RoleGuard] Debug:', {
      pathname: location.pathname,
      adminLoading,
      supabaseLoading,
      isCheckingSession,
      loading,
      hasAdminUser: !!adminUser,
      hasSupabaseUser: !!supabaseUser,
      adminUserEmail: adminUser?.email,
      supabaseUserEmail: supabaseUser?.email,
      adminUserRole: adminUser?.role,
      requiredRoles
    });
  }, [location.pathname, adminLoading, supabaseLoading, isCheckingSession, loading, adminUser, supabaseUser, requiredRoles]);

  const user = adminUser || supabaseUser;
  const userRole = adminUser?.role || (supabaseUser ? 'subscriber' : null);

  console.log('[RoleGuard] Auth check:', {
    hasUser: !!user,
    userRole,
    requiredRoles,
    roleMatches: userRole && requiredRoles.includes(userRole),
    adminUser: adminUser ? { email: adminUser.email, role: adminUser.role } : null,
    supabaseUser: supabaseUser ? { id: supabaseUser.id, email: supabaseUser.email } : null,
    isCheckingSession,
    hasCheckedSession
  });

  // Aguardar enquanto está carregando OU verificando sessão
  if (loading || isCheckingSession) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium">
          {isCheckingSession ? 'Verificando sessão...' : 'Carregando...'}
        </div>
      </div>
    );
  }

  // Se não tem usuário mas ainda não verificou a sessão, aguardar
  if (!user && !hasCheckedSession) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-medium">Verificando autenticação...</div>
      </div>
    );
  }

  // Se não tem usuário E já verificou a sessão (não encontrou), redirecionar
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