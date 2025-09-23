'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from './lib/authUtils';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  }, [router]);

  // Mostrar loading temporário em vez de null
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}