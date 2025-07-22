// Personality Service for managing saved AI personalities

import { useState, useEffect } from 'react';

export interface SavedPersonality {
  id: string;
  name: string;
  instruction: string;
  createdAt: number;
  lastUsed?: number;
  favorite?: boolean;
  category?: string;
  icon?: string;
}

class PersonalityService {
  private readonly STORAGE_KEY = 'earth-saved-personalities';
  
  // Get all saved personalities
  public getSavedPersonalities(): SavedPersonality[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved personalities:', error);
      return [];
    }
  }
  
  // Save a new personality
  public savePersonality(personality: Omit<SavedPersonality, 'id' | 'createdAt'>): SavedPersonality {
    try {
      const personalities = this.getSavedPersonalities();
      
      // Create new personality with ID and timestamp
      const newPersonality: SavedPersonality = {
        ...personality,
        id: `personality-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      
      // Add to list and save
      personalities.push(newPersonality);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(personalities));
      
      return newPersonality;
    } catch (error) {
      console.error('Error saving personality:', error);
      throw error;
    }
  }
  
  // Update an existing personality
  public updatePersonality(id: string, updates: Partial<SavedPersonality>): SavedPersonality | null {
    try {
      const personalities = this.getSavedPersonalities();
      const index = personalities.findIndex(p => p.id === id);
      
      if (index === -1) {
        return null;
      }
      
      // Update the personality
      personalities[index] = {
        ...personalities[index],
        ...updates,
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(personalities));
      return personalities[index];
    } catch (error) {
      console.error('Error updating personality:', error);
      return null;
    }
  }
  
  // Delete a personality
  public deletePersonality(id: string): boolean {
    try {
      const personalities = this.getSavedPersonalities();
      const filtered = personalities.filter(p => p.id !== id);
      
      if (filtered.length === personalities.length) {
        return false; // Nothing was deleted
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting personality:', error);
      return false;
    }
  }
  
  // Mark a personality as used (updates lastUsed timestamp)
  public markPersonalityAsUsed(id: string): void {
    this.updatePersonality(id, { lastUsed: Date.now() });
  }
  
  // Toggle favorite status
  public toggleFavorite(id: string): boolean {
    try {
      const personalities = this.getSavedPersonalities();
      const personality = personalities.find(p => p.id === id);
      
      if (!personality) {
        return false;
      }
      
      const isFavorite = !personality.favorite;
      this.updatePersonality(id, { favorite: isFavorite });
      return isFavorite;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }
  
  // Get recently used personalities
  public getRecentPersonalities(limit: number = 5): SavedPersonality[] {
    const personalities = this.getSavedPersonalities();
    return personalities
      .filter(p => p.lastUsed)
      .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))
      .slice(0, limit);
  }
  
  // Get favorite personalities
  public getFavoritePersonalities(): SavedPersonality[] {
    const personalities = this.getSavedPersonalities();
    return personalities.filter(p => p.favorite);
  }
}

// Create singleton instance
export const personalityService = new PersonalityService();

// React hook for personality management
export const usePersonalities = () => {
  const [savedPersonalities, setSavedPersonalities] = useState<SavedPersonality[]>([]);
  const [recentPersonalities, setRecentPersonalities] = useState<SavedPersonality[]>([]);
  const [favoritePersonalities, setFavoritePersonalities] = useState<SavedPersonality[]>([]);
  
  // Load personalities on mount
  useEffect(() => {
    refreshPersonalities();
  }, []);
  
  // Refresh all personality lists
  const refreshPersonalities = () => {
    setSavedPersonalities(personalityService.getSavedPersonalities());
    setRecentPersonalities(personalityService.getRecentPersonalities());
    setFavoritePersonalities(personalityService.getFavoritePersonalities());
  };
  
  // Save a new personality
  const savePersonality = (personality: Omit<SavedPersonality, 'id' | 'createdAt'>) => {
    const result = personalityService.savePersonality(personality);
    refreshPersonalities();
    return result;
  };
  
  // Update an existing personality
  const updatePersonality = (id: string, updates: Partial<SavedPersonality>) => {
    const result = personalityService.updatePersonality(id, updates);
    refreshPersonalities();
    return result;
  };
  
  // Delete a personality
  const deletePersonality = (id: string) => {
    const result = personalityService.deletePersonality(id);
    refreshPersonalities();
    return result;
  };
  
  // Mark a personality as used
  const usePersonality = (id: string) => {
    personalityService.markPersonalityAsUsed(id);
    refreshPersonalities();
  };
  
  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const result = personalityService.toggleFavorite(id);
    refreshPersonalities();
    return result;
  };
  
  return {
    savedPersonalities,
    recentPersonalities,
    favoritePersonalities,
    savePersonality,
    updatePersonality,
    deletePersonality,
    usePersonality,
    toggleFavorite,
    refreshPersonalities
  };
};

export default personalityService;