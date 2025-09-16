'use client';

import { useEffect, ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/app/lib/authUtils';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Verificar autenticação apenas no cliente
    if (typeof window !== 'undefined') {
      const authenticated = authUtils.isAuthenticated();
      const admin = authUtils.isAdmin();
      
      setIsAuthenticated(authenticated);
      setIsAdmin(admin);

      if (!authenticated) {
        router.push('/login');
        return;
      }

      if (adminOnly && !admin) {
        router.push('/home');
        return;
      }
    }
  }, [router, adminOnly]);

  // Mostrar loading durante a verificação
  if (isAuthenticated === null || (adminOnly && isAdmin === null)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;

  return <>{children}</>;
}