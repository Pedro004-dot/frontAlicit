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

  return null;
}