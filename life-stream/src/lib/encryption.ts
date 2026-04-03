/**
 * ZUNIOS NEURAL ENCRYPTION CORE (V1)
 * 
 * Implements Field-Level Encryption (FLE) using AES-GCM 256-bit.
 * This ensures "Zero-Knowledge" privacy where the server only sees 
 * encrypted cyphertext.
 * 
 * LEARN: AES-GCM is "Authenticated Encryption." It provides both 
 * confidentiality AND integrity, meaning if a single bit is tampered 
 * with in the database, decryption will fail completely.
 */

const ALGO = "AES-GCM";
const KEY_LEN = 256;

/**
 * Encrypts a string using a master secret.
 * In a real production app, this secret would be derived from the user's
 * password on the client, and never stored on the server.
 */
export async function encryptData(plaintext: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // 1. Generate a random Initialization Vector (IV) 
    // LEARN: The IV ensures that the same text encrypted twice results in 
    // different cyphertext, preventing pattern analysis.
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // 2. Import the secret key
    const rawKey = encoder.encode(secret.padEnd(32, '0').slice(0, 32));
    const key = await crypto.subtle.importKey(
        "raw",
        rawKey,
        { name: ALGO },
        false,
        ["encrypt"]
    );

    // 3. Encrypt the data
    const ciphertext = await crypto.subtle.encrypt(
        { name: ALGO, iv },
        key,
        data
    );

    // 4. Bundle IV + Ciphertext into a single Base64 string
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypts a Zunios-encoded cyphertext string.
 */
export async function decryptData(encryptedBase64: string, secret: string): Promise<string> {
    try {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        
        // 1. Convert Base64 back to bytes
        const combined = new Uint8Array(
            atob(encryptedBase64).split("").map((c) => c.charCodeAt(0))
        );

        // 2. Extract IV (first 12 bytes) and Ciphertext
        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        // 3. Import the secret key
        const rawKey = encoder.encode(secret.padEnd(32, '0').slice(0, 32));
        const key = await crypto.subtle.importKey(
            "raw",
            rawKey,
            { name: ALGO },
            false,
            ["decrypt"]
        );

        // 4. Decrypt
        const decrypted = await crypto.subtle.decrypt(
            { name: ALGO, iv },
            key,
            ciphertext
        );

        return decoder.decode(decrypted);
    } catch (error) {
        console.error("Decryption failed. Data may be tampered or key is incorrect:", error);
        return "[ENCRYPTED_DATA_UNAVAILABLE]";
    }
}
