import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';

export interface AuthUser {
    id: number;
    username: string;
    displayName: string;
}

function normalizeUsername(username: string): string {
    return username.trim().toLowerCase();
}

export async function validateCredentials(
    username: string,
    password: string,
): Promise<AuthUser | null> {
    const normalizedUsername = normalizeUsername(username);
    if (!normalizedUsername || !password) return null;

    const user = await prisma.user.findUnique({
        where: { normalizedUsername },
        select: {
            id: true,
            username: true,
            displayName: true,
            passwordHash: true,
            isActive: true,
        },
    });

    if (!user || !user.isActive) return null;

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) return null;

    return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
    };
}

export async function upsertUser(input: {
    username: string;
    password: string;
    displayName?: string;
    isActive?: boolean;
}): Promise<AuthUser> {
    const username = input.username.trim();
    const password = input.password.trim();
    if (!username) throw new Error('Username is required.');
    if (!password) throw new Error('Password is required.');

    const normalizedUsername = normalizeUsername(username);
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.upsert({
        where: { normalizedUsername },
        update: {
            username,
            displayName: input.displayName?.trim() ?? '',
            isActive: input.isActive ?? true,
            passwordHash,
        },
        create: {
            username,
            normalizedUsername,
            displayName: input.displayName?.trim() ?? '',
            isActive: input.isActive ?? true,
            passwordHash,
        },
        select: {
            id: true,
            username: true,
            displayName: true,
        },
    });

    return user;
}
