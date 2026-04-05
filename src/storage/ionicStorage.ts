import { Storage } from '@ionic/storage';

/**
 * Singleton wrapper around @ionic/storage.
 *
 * Why a singleton: @ionic/storage must call `create()` once before any
 * get/set operations. This module ensures that initialization happens
 * exactly once and every consumer shares the same Storage instance.
 */

let storageInstance: Storage | null = null;

/**
 * Returns the shared, initialized Storage instance.
 * Safe to call multiple times — only the first call triggers `create()`.
 */
export const getStorage = async (): Promise<Storage> => {
  if (!storageInstance) {
    const storage = new Storage();
    storageInstance = await storage.create();
  }
  return storageInstance;
};
