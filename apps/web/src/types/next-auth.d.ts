import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: number;
    username: string;
    role: 'admin' | 'cashier';
    status: string;
    lastActive?: string;
  }

  interface Session {
    user: User;
    token: string;
  }
}