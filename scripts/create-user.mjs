import { PrismaClient } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';

const prisma = new PrismaClient();

function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        if (!token.startsWith('--')) continue;
        const key = token.slice(2);
        const value = argv[i + 1];
        if (!value || value.startsWith('--')) {
            args[key] = 'true';
            continue;
        }
        args[key] = value;
        i += 1;
    }
    return args;
}

function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const key = scryptSync(password, salt, 64).toString('hex');
    return `scrypt$${salt}$${key}`;
}

function normalizeUsername(username) {
    return username.trim().toLowerCase();
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const username = (args.username || '').trim();
    const password = (args.password || '').trim();
    const displayName = (args.name || '').trim();

    if (!username || !password) {
        throw new Error(
            'Usage: npm run user:create -- --username <username> --password <password> [--name <displayName>]',
        );
    }

    const user = await prisma.user.upsert({
        where: { normalizedUsername: normalizeUsername(username) },
        update: {
            username,
            displayName,
            passwordHash: hashPassword(password),
            isActive: true,
        },
        create: {
            username,
            normalizedUsername: normalizeUsername(username),
            displayName,
            passwordHash: hashPassword(password),
            isActive: true,
        },
        select: {
            id: true,
            username: true,
            displayName: true,
        },
    });

    console.log(`User ready: id=${user.id}, username=${user.username}`);
}

main()
    .catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
