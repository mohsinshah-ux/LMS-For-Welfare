'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('lms_access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    setOk(true);
  }, [router]);

  if (!ok) return null;
  return <>{children}</>;
}
