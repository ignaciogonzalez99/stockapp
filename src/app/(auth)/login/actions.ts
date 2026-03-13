'use server';

import { validateCredentials } from '@/lib/auth.config';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getSessionUser(): Promise<{ username: string; displayName: string } | null> {
    const cookieStore = await cookies();
    const rawSession = cookieStore.get('session')?.value ?? '';
    const userId = Number(rawSession);
    if (!Number.isFinite(userId) || userId <= 0) return null;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            username: true,
            displayName: true,
            isActive: true,
        },
    });

    if (!user || !user.isActive) return null;
    return {
        username: user.username,
        displayName: user.displayName,
    };
}

export async function authenticate(prevState: string | undefined, formData: FormData) {
    const username = (formData.get('username') as string | null)?.trim() ?? '';
    const password = (formData.get('password') as string | null) ?? '';

    if (!username || !password) {
        return 'Please enter both username and password.';
    }

    const user = await validateCredentials(username, password);

    if (!user) {
        return 'Invalid credentials.';
    }

    const cookieStore = await cookies();
    cookieStore.set('session', String(user.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    redirect('/');
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
    redirect('/login');
}
