import { create } from 'zustand';
import { GameState, Card, UpgradeMode } from '@/types/game';

const ENERGY_REGEN_RATE = 10; // energy per 30 seconds
const ENERGY_REGEN_INTERVAL = 30000; // 30 seconds

// Initial mock data - Fixed upgrade costs for 2% per 1 energy
const initialCards: Card[] = [
  {
    id: '1',
    name: 'Fire Dragon',
    type: 'fire',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 0.5, // 1 energy = 2 progress points = 2% increase
  },
  {
    id: '2',
    name: 'Ice Wizard',
    type: 'ice',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 0.5, // 1 energy = 2 progress points = 2% increase
  },
  {
    id: '3',
    name: 'Lightning Bolt',
    type: 'lightning',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 0.5, // 1 energy = 2 progress points = 2% increase
  },
  {
    id: '4',
    name: 'Nature Spirit',
    type: 'nature',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 0.5, // 1 energy = 2 progress points = 2% increase
  },
];

interface GameStore extends GameState {
  // Actions
  upgradeCard: (cardId: string, amount?: number) => void;
  upgradeCardToMax: (cardId: string) => void;
  levelUpCard: (cardId: string) => void;
  setUpgradeMode: (mode: UpgradeMode) => void;
  setSelectedCard: (cardId: string | null) => void;
  regenerateEnergy: () => void;
  // Utils
  canAffordUpgrade: (cardId: string, amount: number) => boolean;
  getMaxUpgradeAmount: (cardId: string) => number;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  user: {
    id: '1',
    username: 'Player',
    energy: 100,
    maxEnergy: 100,
    lastEnergyUpdate: Date.now(),
  },
  cards: initialCards,
  selectedCard: null,
  upgradeMode: { type: 'single' },
  isUpgrading: false,

  // Actions
  upgradeCard: (cardId: string, amount: number) => {
    set(state => {
      const card = state.cards.find(c => c.id === cardId);
      if (!card || card.level >= 3) return state;
      
      // For 2% per 1 energy: 1 energy = 2 progress points
      const progressIncrease = amount * 2; // 2% per energy
      const totalCost = amount; // 1 energy per upgrade action
      
      // Check if we have enough energy
      if (state.user.energy < totalCost) return state;
      
      // Deduct energy and update card progress
      return {
        ...state,
        user: {
          ...state.user,
          energy: state.user.energy - totalCost,
        },
        cards: state.cards.map(c => {
          if (c.id === cardId) {
            const newProgress = Math.min(c.maxProgress, c.progress + progressIncrease);
            
            return {
              ...c,
              progress: newProgress,
            };
          }
          return c;
        }),
      };
    });
  },

  upgradeCardToMax: (cardId: string) => {
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.level >= 3) return;
    
    const remainingProgress = card.maxProgress - card.progress;
    // Calculate how many energy points needed (each energy gives 2 progress)
    const energyNeeded = Math.ceil(remainingProgress / 2);
    
    // Check if we have enough energy for max upgrade
    if (state.user.energy >= energyNeeded && remainingProgress > 0) {
      state.upgradeCard(cardId, energyNeeded);
    }
  },

  levelUpCard: (cardId: string) => {
    set(state => ({
      cards: state.cards.map(c => {
        if (c.id === cardId && c.progress >= c.maxProgress && c.level < 3) {
          return {
            ...c,
            level: c.level + 1,
            progress: 0,
          };
        }
        return c;
      }),
    }));
  },

  setUpgradeMode: (mode: UpgradeMode) => set({ upgradeMode: mode }),

  setSelectedCard: (cardId: string | null) => set({ selectedCard: cardId }),

  regenerateEnergy: () => {
    set(state => {
      const now = Date.now();
      const timeDiff = now - state.user.lastEnergyUpdate;
      const intervals = Math.floor(timeDiff / ENERGY_REGEN_INTERVAL);
      
      if (intervals > 0 && state.user.energy < state.user.maxEnergy) {
        const newEnergy = Math.min(
          state.user.maxEnergy,
          state.user.energy + (intervals * ENERGY_REGEN_RATE)
        );
        
        return {
          user: {
            ...state.user,
            energy: newEnergy,
            lastEnergyUpdate: now,
          },
        };
      }
      
      return state;
    });
  },

  // Utility functions
  canAffordUpgrade: (cardId: string, amount: number) => {
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.level >= 3) return false;
    
    // 1 energy per upgrade action
    return state.user.energy >= amount;
  },

  getMaxUpgradeAmount: (cardId: string) => {
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.level >= 3) return 0;
    
    const remainingProgress = card.maxProgress - card.progress;
    // Calculate max energy we can use (each energy gives 2 progress)
    const maxEnergyNeeded = Math.ceil(remainingProgress / 2);
    
    return Math.min(maxEnergyNeeded, state.user.energy);
  },
}));

// Auto-regenerate energy every second
setInterval(() => {
  useGameStore.getState().regenerateEnergy();
}, 1000);