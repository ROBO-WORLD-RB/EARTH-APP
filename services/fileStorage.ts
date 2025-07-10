import { FileMessage } from '../types';

const DB_NAME = 'EarthAppFileStorage';
const DB_VERSION = 1;
const STORE_NAME = 'files';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_STORAGE = 100 * 1024 * 1024; // 100MB
const MAX_FILES_PER_CONVERSATION = 50;

class FileStorageService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('conversationId', 'conversationId', { unique: false });
          store.createIndex('uploadDate', 'uploadDate', { unique: false });
        }
      };
    });
  }

  async saveFile(file: FileMessage): Promise<void> {
    if (!this.db) await this.init();

    // Check file size limit
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
    }

    // Check total storage limit
    const totalSize = await this.getTotalStorageSize();
    if (totalSize + file.size > MAX_TOTAL_STORAGE) {
      await this.cleanupOldFiles();
      const newTotalSize = await this.getTotalStorageSize();
      if (newTotalSize + file.size > MAX_TOTAL_STORAGE) {
        throw new Error('Storage limit exceeded. Please remove some files.');
      }
    }

    // Check files per conversation limit
    if (file.conversationId) {
      const conversationFiles = await this.getFilesByConversation(file.conversationId);
      if (conversationFiles.length >= MAX_FILES_PER_CONVERSATION) {
        throw new Error(`Maximum ${MAX_FILES_PER_CONVERSATION} files per conversation reached`);
      }
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getFile(id: string): Promise<FileMessage | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getFilesByConversation(conversationId: string): Promise<FileMessage[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('conversationId');
      const request = index.getAll(conversationId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async deleteFile(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async deleteFilesByConversation(conversationId: string): Promise<void> {
    if (!this.db) await this.init();

    const files = await this.getFilesByConversation(conversationId);
    await Promise.all(files.map(file => this.deleteFile(file.id)));
  }

  async getAllFiles(): Promise<FileMessage[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async getTotalStorageSize(): Promise<number> {
    const files = await this.getAllFiles();
    return files.reduce((total, file) => total + file.size, 0);
  }

  async cleanupOldFiles(): Promise<void> {
    if (!this.db) await this.init();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('uploadDate');
      const request = index.openCursor(IDBKeyRange.upperBound(twentyFourHoursAgo));

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
    });
  }

  async getStorageInfo(): Promise<{ totalSize: number; fileCount: number; maxSize: number }> {
    const files = await this.getAllFiles();
    const totalSize = files.reduce((total, file) => total + file.size, 0);
    
    return {
      totalSize,
      fileCount: files.length,
      maxSize: MAX_TOTAL_STORAGE
    };
  }
}

export const fileStorage = new FileStorageService();
export { MAX_FILE_SIZE, MAX_TOTAL_STORAGE, MAX_FILES_PER_CONVERSATION }; 