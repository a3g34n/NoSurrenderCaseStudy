export interface Card {
  id: string;
  name: string;
  type: 'fire' | 'ice' | 'lightning' | 'nature';
  level: number;
  progress: number; // 0-100
  maxProgress: number;
  upgradeCost: number;
}

export interface User {
  id: string;
  username: string;
  energy: number;
  maxEnergy: number;
  lastEnergyUpdate: number;
}

export interface UpgradeMode {
  type: 'single' | 'max' | 'custom' | 'auto';
  amount?: number;
}

export interface GameState {
  user: User;
  cards: Card[];
  selectedCard: string | null;
  upgradeMode: UpgradeMode;
  isUpgrading: boolean;
}