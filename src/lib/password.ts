import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const ALGORITHM = 'scrypt';

export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
    return `${ALGORITHM}$${salt}$${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const [algorithm, salt, savedKeyHex] = hashedPassword.split('$');
    if (algorithm !== ALGORITHM || !salt || !savedKeyHex) return false;

    const savedKey = Buffer.from(savedKeyHex, 'hex');
    const derivedKey = (await scrypt(password, salt, savedKey.length)) as Buffer;

    if (savedKey.length !== derivedKey.length) return false;
    return timingSafeEqual(savedKey, derivedKey);
}
