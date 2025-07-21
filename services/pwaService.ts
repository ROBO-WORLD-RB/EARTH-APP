// PWA Service for handling service worker registration and updates
import { useState, useEffect } from 'react';

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAService {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private updateAvailable = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // Check if app is already installed
    this.checkInstallStatus();
    
    // Listen for install prompt
    this.setupInstallPrompt();
    
    // Register service worker
    await this.registerServiceWorker();
    
    // Setup update checking
    this.setupUpdateChecking();
  }

  private checkInstallStatus() {
    // Check if running in standalone mode (installed)
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone === true;
    
    // Listen for display mode changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      this.isInstalled = e.matches;
      this.notifyInstallStatusChange();
    });
  }

  private setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      this.deferredPrompt = e as any;
      this.notifyInstallPromptAvailable();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA: App installed');
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifyInstallStatusChange();
    });
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });
        
        console.log('PWA: Service Worker registered successfully');
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          console.log('PWA: Update found');
          this.handleServiceWorkerUpdate();
        });
        
        // Check for updates immediately
        this.registration.update();
        
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
      }
    }
  }

  private setupUpdateChecking() {
    // Check for updates every 30 minutes
    setInterval(() => {
      if (this.registration) {
        this.registration.update();
      }
    }, 30 * 60 * 1000);

    // Check for updates when app becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.registration) {
        this.registration.update();
      }
    });
  }

  private handleServiceWorkerUpdate() {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('PWA: Update available');
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      }
    });
  }

  // Public methods
  public async showInstallPrompt(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      console.log('PWA: Install prompt result:', choiceResult.outcome);
      
      this.deferredPrompt = null;
      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('PWA: Error showing install prompt:', error);
      return false;
    }
  }

  public async applyUpdate(): Promise<void> {
    if (!this.updateAvailable || !this.registration) {
      return;
    }

    const waitingWorker = this.registration.waiting;
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for controlling change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  public getInstallStatus(): boolean {
    return this.isInstalled;
  }

  public getUpdateStatus(): boolean {
    return this.updateAvailable;
  }

  public canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  // Event notification methods (to be used with React state)
  private notifyInstallPromptAvailable() {
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private notifyInstallStatusChange() {
    window.dispatchEvent(new CustomEvent('pwa-install-status-change', {
      detail: { installed: this.isInstalled }
    }));
  }

  private notifyUpdateAvailable() {
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  // Utility methods
  public async getAppVersion(): Promise<string> {
    if (!this.registration) return 'unknown';

    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || 'unknown');
      };

      if (this.registration.active) {
        this.registration.active.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );
      } else {
        resolve('unknown');
      }
    });
  }

  public async shareContent(shareData: ShareData): Promise<boolean> {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return true;
      } catch (error) {
        console.error('PWA: Error sharing content:', error);
        return false;
      }
    }
    return false;
  }

  public async requestPersistentStorage(): Promise<boolean> {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const granted = await navigator.storage.persist();
        console.log('PWA: Persistent storage granted:', granted);
        return granted;
      } catch (error) {
        console.error('PWA: Error requesting persistent storage:', error);
        return false;
      }
    }
    return false;
  }

  public async getStorageEstimate(): Promise<StorageEstimate | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        return await navigator.storage.estimate();
      } catch (error) {
        console.error('PWA: Error getting storage estimate:', error);
        return null;
      }
    }
    return null;
  }
}

// Create singleton instance
export const pwaService = new PWAService();

// React hook for PWA functionality

export const usePWA = () => {
  const [canInstall, setCanInstall] = useState(pwaService.canInstall());
  const [isInstalled, setIsInstalled] = useState(pwaService.getInstallStatus());
  const [updateAvailable, setUpdateAvailable] = useState(pwaService.getUpdateStatus());

  useEffect(() => {
    const handleInstallAvailable = () => setCanInstall(true);
    const handleInstallStatusChange = (e: CustomEvent) => setIsInstalled(e.detail.installed);
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-install-status-change', handleInstallStatusChange as EventListener);
    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-install-status-change', handleInstallStatusChange as EventListener);
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  return {
    canInstall,
    isInstalled,
    updateAvailable,
    showInstallPrompt: pwaService.showInstallPrompt.bind(pwaService),
    applyUpdate: pwaService.applyUpdate.bind(pwaService),
    shareContent: pwaService.shareContent.bind(pwaService),
    requestPersistentStorage: pwaService.requestPersistentStorage.bind(pwaService),
    getStorageEstimate: pwaService.getStorageEstimate.bind(pwaService),
    getAppVersion: pwaService.getAppVersion.bind(pwaService)
  };
};

export default pwaService;