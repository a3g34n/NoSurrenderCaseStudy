import { useGameStore } from '@/stores/gameStore';
import { Progress } from '@/components/ui/progress';
import { Battery } from 'lucide-react';

export const EnergyDisplay = () => {
  const { user } = useGameStore();
  const energyPercentage = (user.energy / user.maxEnergy) * 100;
  
  return (
    <div className="bg-card rounded-xl p-4 border border-border shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <Battery className="w-5 h-5 text-energy" />
        <span className="font-bold text-lg">Energy</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{user.energy}</span>
          <span className="text-muted-foreground">/ {user.maxEnergy}</span>
        </div>
        
        <Progress 
          value={energyPercentage} 
          className="h-3 bg-energy-bg"
        />
        
        <div className="text-xs text-muted-foreground">
          Regenerates 10 energy every 30 seconds
        </div>
      </div>
    </div>
  );
};