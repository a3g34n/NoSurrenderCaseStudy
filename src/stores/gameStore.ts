import { create } from 'zustand';
import { GameState, Card, UpgradeMode } from '@/types/game';

const ENERGY_REGEN_RATE = 10; // energy per 30 seconds
const ENERGY_REGEN_INTERVAL = 30000; // 30 seconds

// Initial mock data
const initialCards: Card[] = [
  {
    id: '1',
    name: 'Fire Dragon',
    type: 'fire',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 2,
  },
  {
    id: '2',
    name: 'Ice Wizard',
    type: 'ice',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 2,
  },
  {
    id: '3',
    name: 'Lightning Bolt',
    type: 'lightning',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 2,
  },
  {
    id: '4',
    name: 'Nature Spirit',
    type: 'nature',
    level: 1,
    progress: 0,
    maxProgress: 100,
    upgradeCost: 2,
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
  upgradeCard: (cardId: string, amount = 1) => {
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.level >= 3) return;

    const energyGain = 2 * amount;
    
    set(state => ({
      user: {
        ...state.user,
        energy: Math.min(state.user.maxEnergy, state.user.energy + energyGain),
      },
      cards: state.cards.map(c => {
        if (c.id === cardId) {
          const newProgress = Math.min(c.maxProgress, c.progress + amount);
          
          return {
            ...c,
            progress: newProgress,
          };
        }
        return c;
      }),
    }));
  },

  upgradeCardToMax: (cardId: string) => {
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.level >= 3) return;
    
    const remainingProgress = card.maxProgress - card.progress;
    if (remainingProgress > 0) {
      state.upgradeCard(cardId, remainingProgress);
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
      
      if (intervals > 0) {
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
    return card ? card.level < 3 : false;
  },

  getMaxUpgradeAmount: (cardId: string) => {
    const state = get();
    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.level >= 3) return 0;
    
    return card.maxProgress - card.progress;
  },
}));

// Auto-regenerate energy
setInterval(() => {
  useGameStore.getState().regenerateEnergy();
}, 1000);