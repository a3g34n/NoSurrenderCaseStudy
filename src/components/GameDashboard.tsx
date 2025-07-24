import { useGameStore } from '@/stores/gameStore';
import { GameCard } from './GameCard';
import { EnergyDisplay } from './EnergyDisplay';
import { UpgradeControls } from './UpgradeControls';
import { Button } from '@/components/ui/button';
import { Trophy, Settings, User } from 'lucide-react';

export const GameDashboard = () => {
  const { cards, user, setSelectedCard, selectedCard } = useGameStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Card Upgrade Arena</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Energy & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <EnergyDisplay />
            <UpgradeControls />
          </div>

          {/* Main Content - Cards Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Cards</h2>
              <p className="text-muted-foreground">
                Click a card to select it, then use upgrade controls
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cards.map(card => (
                <div
                  key={card.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCard === card.id 
                      ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' 
                      : ''
                  }`}
                  onClick={() => setSelectedCard(card.id)}
                >
                  <GameCard card={card} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Stats */}
      <footer className="border-t border-border bg-card/30 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-neon-cyan">
                {cards.reduce((sum, card) => sum + card.level, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Levels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-pink">
                {cards.length}
              </div>
              <div className="text-sm text-muted-foreground">Cards Owned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-yellow">
                {user.energy}
              </div>
              <div className="text-sm text-muted-foreground">Current Energy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neon-green">
                {cards.filter(card => card.progress > 90).length}
              </div>
              <div className="text-sm text-muted-foreground">Ready to Level</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};