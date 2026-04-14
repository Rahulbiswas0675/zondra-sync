import { remoteConfig } from '../firebase';
import { fetchAndActivate, getString } from 'firebase/remote-config';

const DEFAULT_AES_KEY = "12345678901234567890123456789012";

export async function getDecryptionKey(): Promise<string> {
  // Option 1: Env Variable (Build time)
  const envKey = import.meta.env.VITE_AES_KEY;
  if (envKey) return envKey;

  // Option 2: Firebase Remote Config (Runtime)
  try {
    await fetchAndActivate(remoteConfig);
    const remoteKey = getString(remoteConfig, 'aes_decryption_key');
    return remoteKey || DEFAULT_AES_KEY;
  } catch (error) {
    console.error("Failed to fetch remote config", error);
    return DEFAULT_AES_KEY;
  }
}

export async function decryptData(encryptedData: string): Promise<string> {
  const key = await getDecryptionKey();
  // Simplified decryption logic (use a library like crypto-js in production)
  console.log("Decrypting with key:", key);
  return atob(encryptedData); // Placeholder for actual AES-256 decryption
}
