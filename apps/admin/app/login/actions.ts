'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  // Placeholder: accept any non-empty email/password. Replace with NextAuth soon.
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '').trim();
  const to = String(formData.get('redirect') || '/') || '/';

  if (!email || !password) {
    // Redirect back to login with error
    redirect(`/login?error=Missing%20credentials&redirect=${encodeURIComponent(to)}`);
  }

  const cookieStore = await cookies();
  // Temporary auth cookie gate; httpOnly to avoid client JS access
  cookieStore.set('admin-auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  redirect(to);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-auth');
  redirect('/login');
}
