import { useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Zap, ZapOff, Target, Infinity } from 'lucide-react';

export const UpgradeControls = () => {
  const { upgradeMode, setUpgradeMode, selectedCard, cards, upgradeCard } = useGameStore();
  const [customAmount, setCustomAmount] = useState([1]);
  const [autoUpgradeActive, setAutoUpgradeActive] = useState(false);
  
  const selectedCardData = selectedCard ? cards.find(c => c.id === selectedCard) : null;

  const handleCustomUpgrade = () => {
    if (selectedCard) {
      upgradeCard(selectedCard, customAmount[0]);
    }
  };

  const toggleAutoUpgrade = () => {
    setAutoUpgradeActive(!autoUpgradeActive);
    if (!autoUpgradeActive) {
      setUpgradeMode({ type: 'auto' });
      // In a real implementation, this would start background upgrading
    } else {
      setUpgradeMode({ type: 'single' });
    }
  };

  if (!selectedCardData) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="text-center text-muted-foreground">
          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Select a card to configure upgrade options</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6 bg-card border-border">
      <div>
        <h3 className="font-bold text-lg mb-2">Upgrade Controls</h3>
        <p className="text-sm text-muted-foreground">
          Selected: {selectedCardData.name}
        </p>
      </div>

      {/* Upgrade Mode Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant={upgradeMode.type === 'single' ? 'default' : 'outline'}
          onClick={() => setUpgradeMode({ type: 'single' })}
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Single
        </Button>
        
        <Button
          variant={upgradeMode.type === 'max' ? 'default' : 'outline'}
          onClick={() => setUpgradeMode({ type: 'max' })}
          className="flex items-center gap-2"
        >
          <ZapOff className="w-4 h-4" />
          Max
        </Button>
      </div>

      {/* Custom Amount Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Custom Amount</label>
          <span className="text-sm text-muted-foreground">{customAmount[0]} points</span>
        </div>
        
        <Slider
          value={customAmount}
          onValueChange={setCustomAmount}
          max={50}
          min={1}
          step={1}
          className="w-full"
        />
        
        <Button
          onClick={handleCustomUpgrade}
          variant="secondary"
          className="w-full"
        >
          Upgrade {customAmount[0]} Points
        </Button>
      </div>

      {/* Auto Upgrade Toggle */}
      <div className="border-t border-border pt-4">
        <Button
          onClick={toggleAutoUpgrade}
          variant={autoUpgradeActive ? "destructive" : "outline"}
          className="w-full flex items-center gap-2"
        >
          <Infinity className="w-4 h-4" />
          {autoUpgradeActive ? 'Stop Auto Upgrade' : 'Start Auto Upgrade'}
        </Button>
        
        {autoUpgradeActive && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Auto-upgrading every 2 seconds
          </p>
        )}
      </div>
    </Card>
  );
};