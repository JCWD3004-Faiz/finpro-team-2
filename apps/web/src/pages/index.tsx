import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/redux/store';

export default function HomePage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/cashier');
    }
  }, [user, router]);

  return null;
}