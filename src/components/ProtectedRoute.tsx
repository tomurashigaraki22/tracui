'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router, pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null;
}