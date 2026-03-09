import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;

/**
 * Función interna para obtener la llave de forma segura.
 * Solo se ejecuta cuando se llama a encrypt o decrypt, 
 * dando tiempo a que el entorno esté listo.
 */
function getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) {
        throw new Error("ENCRYPTION_KEY no está definida en las variables de entorno.");
    }
    // Verificamos que sea una llave de 32 bytes (64 caracteres hex) para aes-256
    const bufferKey = Buffer.from(key, 'hex');
    if (bufferKey.length !== 32) {
        throw new Error("ENCRYPTION_KEY debe ser de 32 bytes (64 caracteres hexadecimales).");
    }
    return bufferKey;
}

export function encrypt(text: string): string {
    const iv = randomBytes(IV_LENGTH);
    // Llamamos a la función aquí, no fuera
    const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !authTagHex || !encrypted) {
        throw new Error("Formato de texto encriptado inválido.");
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}