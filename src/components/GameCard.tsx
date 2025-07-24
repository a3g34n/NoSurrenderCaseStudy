import { Card } from '@/types/game';
import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Zap, Flame, Snowflake, Bolt, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import card artworks
import fireDragonImg from '@/assets/fire-dragon.jpg';
import iceWizardImg from '@/assets/ice-wizard.jpg';
import lightningBoltImg from '@/assets/lightning-bolt.jpg';
import natureSpiritImg from '@/assets/nature-spirit.jpg';

interface GameCardProps {
  card: Card;
}

const cardIcons = {
  fire: Flame,
  ice: Snowflake,
  lightning: Bolt,
  nature: Leaf,
};

const cardStyles = {
  fire: 'card-fire border-fire/50',
  ice: 'card-ice border-ice/50',
  lightning: 'card-lightning border-lightning/50',
  nature: 'card-nature border-nature/50',
};

const cardImages = {
  fire: fireDragonImg,
  ice: iceWizardImg,
  lightning: lightningBoltImg,
  nature: natureSpiritImg,
};

export const GameCard = ({ card }: GameCardProps) => {
  const { upgradeCard, upgradeCardToMax, levelUpCard, canAffordUpgrade, getMaxUpgradeAmount } = useGameStore();
  const Icon = cardIcons[card.type];
  const cardImage = cardImages[card.type];
  const progressPercentage = (card.progress / card.maxProgress) * 100;
  const maxUpgrades = getMaxUpgradeAmount(card.id);
  const canLevelUp = card.progress >= card.maxProgress && card.level < 3;
  const isMaxLevel = card.level >= 3;
  
  const handleSingleUpgrade = () => {
    if (canAffordUpgrade(card.id, 1)) {
      upgradeCard(card.id, 1);
    }
  };
  
  const handleMaxUpgrade = () => {
    upgradeCardToMax(card.id);
  };

  const handleLevelUp = () => {
    levelUpCard(card.id);
  };

  return (
    <div className={cn(
      "relative p-6 rounded-xl border-2 backdrop-blur-sm",
      "transition-all duration-300 hover:scale-105",
      cardStyles[card.type],
      canLevelUp && "animate-pulse ring-2 ring-neon-yellow"
    )}>
      {/* Card Artwork */}
      <div className="relative mb-4 rounded-lg overflow-hidden">
        <img 
          src={cardImage} 
          alt={card.name}
          className="w-full h-32 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2">
          <h3 className="font-bold text-white text-lg">{card.name}</h3>
          <p className="text-white/80 text-sm">Level {card.level}</p>
        </div>
        <div className="absolute top-2 right-2 p-1 rounded bg-black/40">
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm text-white/90">
          <span>Progress</span>
          <span>{card.progress} / {card.maxProgress}</span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-black/30"
        />
        
        <div className="text-xs text-white/70">
          Upgrade cost: {card.upgradeCost} energy per point
        </div>
      </div>

      {/* Upgrade Controls */}
      <div className="space-y-2">
        {canLevelUp ? (
          <Button
            onClick={handleLevelUp}
            variant="gaming"
            className="w-full animate-scale-in"
          >
            <Zap className="w-4 h-4 mr-2" />
            Level Up! ({card.level} → {card.level + 1})
          </Button>
        ) : isMaxLevel ? (
          <div className="text-center text-neon-yellow font-bold">
            MAX LEVEL REACHED
          </div>
        ) : (
          <>
            <Button
              onClick={handleSingleUpgrade}
              disabled={!canAffordUpgrade(card.id, 1)}
              variant="upgrade"
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade (+1)
            </Button>
            
            {maxUpgrades > 1 && (
              <Button
                onClick={handleMaxUpgrade}
                disabled={maxUpgrades === 0}
                variant="gaming"
                className="w-full"
              >
                Max Upgrade (+{maxUpgrades})
              </Button>
            )}
          </>
        )}
      </div>

      {/* Level up indicator */}
      {canLevelUp && (
        <div className="absolute -top-2 -right-2 bg-neon-yellow text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">
          Level Up Ready!
        </div>
      )}
      
      {progressPercentage >= 90 && !canLevelUp && !isMaxLevel && (
        <div className="absolute -top-2 -right-2 bg-neon-yellow text-black px-2 py-1 rounded-full text-xs font-bold animate-pulse">
          Almost Ready!
        </div>
      )}
    </div>
  );
};