import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define item data structure with PNG paths and level information
const itemData = [
  {
    key: 'uzun_kilic',
    levels: [
      { title: 'Gümüş Diş', desc: 'Sade, keskin bir savaş kılıcı.', image: 'uzun_kilic_1.png' },
      { title: 'Zümrüt Yürek', desc: 'Can alıcı darbeler için güçlendirildi.', image: 'uzun_kilic_2.png' },
      { title: 'Altın Pençe', desc: 'Kralların kanını döken efsanevi keskinlik.', image: 'uzun_kilic_3.png' }
    ]
  },
  {
    key: 'savas_baltasi',
    levels: [
      { title: 'Ay Parçası', desc: 'Hafif ve hızlı bir balta.', image: 'savas_baltasi_1.png' },
      { title: 'Zümrüt Kesik', desc: 'Derin yaralar açan büyülü çelik.', image: 'savas_baltasi_2.png' },
      { title: 'Efsane Yarma', desc: 'Tek vuruşta kale kapısı deler.', image: 'savas_baltasi_3.png' }
    ]
  },
  {
    key: 'kalkan',
    levels: [
      { title: 'Gümüş Siperi', desc: 'Basit bir koruma aracı.', image: 'kalkan_1.png' },
      { title: 'Zümrüt Zırh', desc: 'Gelen saldırıyı yansıtır.', image: 'kalkan_2.png' },
      { title: 'Altın Duvar', desc: 'Tanrılar bile geçemez.', image: 'kalkan_3.png' }
    ]
  },
  {
    key: 'buyu_kitabi',
    levels: [
      { title: 'Gümüş Sayfalar', desc: 'Temel büyüleri içerir.', image: 'buyu_kitabi_1.png' },
      { title: 'Zümrüt Kehanet', desc: 'Geleceği okur, kaderi değiştirir.', image: 'buyu_kitabi_2.png' },
      { title: 'Altın Kitabe', desc: 'Evrenin sırlarını fısıldar, gerçekliği ezer.', image: 'buyu_kitabi_3.png' }
    ]
  },
  {
    key: 'savas_cekici',
    levels: [
      { title: 'Taş Parçalayıcı', desc: 'Ağır ve yıkıcı.', image: 'savas_cekici_1.png' },
      { title: 'Zümrüt Ezici', desc: 'Zırhları paramparça eder.', image: 'savas_cekici_2.png' },
      { title: 'Altın Hüküm', desc: 'Dünyayı çatlatır, düşmanları ezer.', image: 'savas_cekici_3.png' }
    ]
  },
  {
    key: 'buyu_asasi',
    levels: [
      { title: 'Gölge Dalı', desc: 'Temel büyü asası.', image: 'buyu_asasi_1.png' },
      { title: 'Zümrüt Kök', desc: 'Doğanın gücüyle titreşir.', image: 'buyu_asasi_2.png' },
      { title: 'Altın Kök', desc: 'Yıldızları yere indirir, zamanı büker.', image: 'buyu_asasi_3.png' }
    ]
  },
  {
    key: 'kisa_kilic',
    levels: [
      { title: 'Gölge Kesik', desc: 'Hızlı saldırılar için ideal.', image: 'kisa_kilic_1.png' },
      { title: 'Zümrüt Fısıltı', desc: 'Sessiz ama ölümcül.', image: 'kisa_kilic_2.png' },
      { title: 'Altın Dilim', desc: 'Zamanda bile iz bırakır.', image: 'kisa_kilic_3.png' }
    ]
  },
  {
    key: 'egri_kilic',
    levels: [
      { title: 'Gümüş Pençe', desc: 'Hafif ve çevik bir bıçak.', image: 'egri_kilic_1.png' },
      { title: 'Zümrüt Çengel', desc: 'Derin kesikler için eğildi.', image: 'egri_kilic_2.png' },
      { title: 'Altın Yılan', desc: 'Gölge gibi kayar, kaderi biçer.', image: 'egri_kilic_3.png' }
    ]
  }
];

// CSS styles for the component (existing styles + animation styles)
const styles = {
  container: {
    minHeight: '100vh',
    background: '#2A2D3A',
    padding: '24px',
    color: 'white',
  },
  energyBarContainer: {
    marginBottom: '32px',
  },
  energyBarWrapper: {
    width: '100%',
    height: '17px',
    backgroundColor: '#23222F',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '5px solid #F4BC79',
  },
  energyBarFill: {
    height: '100%',
    background: '#EE39A8',
    transition: 'width 0.3s ease-in-out',
  },
  tabContainer: {
    marginBottom: '40px',
    backgroundColor: '#1A1D29',
    borderRadius: '150px',
    padding: '8px',
  },
  tabButton: {
    flex: 1,
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '150px',
    transition: 'all 0.3s ease',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(166px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1A1D29',
    borderRadius: '12px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '350px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'transform 0.3s ease',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.3,
    transition: 'opacity 0.5s ease-in-out',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
  },
  cardContent: {
    position: 'relative',
    zIndex: 10,
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  upgradeButton: {
    width: '100%',
    height: '40px',
    background: 'linear-gradient(145deg, #D4A574, #B8956A)', // Eskitilmiş bronz gradient
    color: '#2D1810',
    fontWeight: 'bold',
    fontSize: '14px',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '2px solid #8B7355', // Koyu kenarlık
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)', // 3D efekt
    textShadow: '0 1px 2px rgba(255,255,255,0.3)', // Metin gölgesi
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  upgradeButtonHover: {
    background: 'linear-gradient(145deg, #E2B382, #C6A578)',
    transform: 'translateY(-1px)',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.5)',
  },
  maxUpgradeButton: {
    width: '100%',
    height: '40px',
    background: 'linear-gradient(145deg, #7C5BA6, #6B4C87)', // Eskitilmiş mor gradient
    color: '#E8E1F0',
    fontWeight: 'bold',
    fontSize: '14px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '2px solid #4A3B5C', // Koyu mor kenarlık
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.4)',
    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  maxUpgradeButtonHover: {
    background: 'linear-gradient(145deg, #8A68B4, #7955A0)',
    transform: 'translateY(-1px)',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.5)',
  },
  disabledButton: {
    background: 'linear-gradient(145deg, #5A5A5A, #454545)', // Eskitilmiş gri
    color: '#888888',
    border: '2px solid #3A3A3A',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.2)',
    textShadow: 'none',
    transform: 'none',
    cursor: 'not-allowed',
  },
  levelUpButton: {
    background: 'linear-gradient(145deg, #2B8A6B, #1F6B4F)', // Eskitilmiş yeşil
    color: '#E8F5F0',
    height: '48px',
    border: '2px solid #1A5A44',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)',
    textShadow: '0 1px 2px rgba(0,0,0,0.4)',
  },
  levelUpButtonHover: {
    background: 'linear-gradient(145deg, #339973, #2B8A6B)',
    transform: 'translateY(-1px)',
    boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.5)',
  },
  // Eskitilmiş doku efekti için
  buttonTexture: {
    position: 'absolute',
    inset: 0,
    background: `
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.1) 1px, transparent 1px),
      radial-gradient(circle at 80% 70%, rgba(0,0,0,0.1) 1px, transparent 1px),
      radial-gradient(circle at 60% 20%, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
    backgroundSize: '8px 8px, 12px 12px, 6px 6px',
    pointerEvents: 'none',
    opacity: 0.7,
  },
  // Animation styles
  levelUpCard: {
    transform: 'scale(1.05)',
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4)',
    border: '3px solid #FFD700',
    animation: 'levelUpPulse 2s ease-in-out',
  },
  
  levelUpOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
    animation: 'levelUpGlow 2s ease-in-out',
    pointerEvents: 'none',
    zIndex: 20,
  },
  
  levelUpText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FFD700',
    textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6)',
    animation: 'levelUpTextFloat 2s ease-in-out',
    zIndex: 30,
    pointerEvents: 'none',
  },
  
  sparkle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    background: '#FFD700',
    borderRadius: '50%',
    animation: 'sparkleFloat 1.5s ease-out forwards',
    zIndex: 25,
  },
  
  imageTransition: {
    animation: 'imageTransition 1s ease-in-out',
  },
  
  progressBarLevelUp: {
    background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
    backgroundSize: '200% 100%',
    animation: 'progressShine 1s ease-in-out',
  },
};

// GameDashboard component
export const GameDashboard = () => {
  const { 
    user, 
    cards: storeCards, 
    upgradeCard, 
    upgradeCardToMax,
    levelUpCard, 
    canAffordUpgrade, 
    getMaxUpgradeAmount,
    regenerateEnergy 
  } = useGameStore();
  const [activeTab, setActiveTab] = useState('Tüm Seviyeler');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [levelingUpCards, setLevelingUpCards] = useState<Set<string>>(new Set());
  const [sparkles, setSparkles] = useState<Array<{id: string, x: number, y: number, delay: number}>>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Constants from gameStore
  const ENERGY_REGEN_INTERVAL = 30000; // 30 seconds
  const ENERGY_REGEN_RATE = 10; // energy per 30 seconds

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-regenerate energy
  useEffect(() => {
    const interval = setInterval(() => {
      regenerateEnergy();
    }, 1000);
    return () => clearInterval(interval);
  }, [regenerateEnergy]);

  // Calculate energy regeneration countdown
  const calculateEnergyCountdown = () => {
    if (user.energy >= user.maxEnergy) {
      return "FULL";
    }

    const timeSinceLastUpdate = currentTime - user.lastEnergyUpdate;
    const timeUntilNextRegen = ENERGY_REGEN_INTERVAL - (timeSinceLastUpdate % ENERGY_REGEN_INTERVAL);
    
    const minutes = Math.floor(timeUntilNextRegen / 60000);
    const seconds = Math.floor((timeUntilNextRegen % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate energy percentage increase per regeneration
  const energyPercentagePerRegen = (ENERGY_REGEN_RATE / user.maxEnergy) * 100;

  // Map store cards with itemData for display
  const displayCards = storeCards.map((storeCard, index) => {
    const item = itemData[index];
    return {
      ...storeCard,
      itemKey: item?.key || 'default',
      itemData: item
    };
  });

  // Create sparkle effects
  const createSparkles = (cardId: string) => {
    const newSparkles = [];
    for (let i = 0; i < 12; i++) {
      newSparkles.push({
        id: `${cardId}-${i}-${Date.now()}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
      });
    }
    setSparkles(prev => [...prev, ...newSparkles]);
    
    // Clear sparkles after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !s.id.startsWith(cardId)));
    }, 2000);
  };

  // Handle upgrade button click
  const handleUpgrade = (cardId: string) => {
    if (canAffordUpgrade(cardId, 1)) {
      upgradeCard(cardId, 1);
    }
  };

  // Handle max upgrade button click
  const handleMaxUpgrade = (cardId: string) => {
    upgradeCardToMax(cardId);
  };

  // Handle level up with animation
  const handleLevelUp = (cardId: string) => {
    // Start level up animation
    setLevelingUpCards(prev => new Set([...prev, cardId]));
    createSparkles(cardId);
    
    // Execute level up after a short delay for animation effect
    setTimeout(() => {
      levelUpCard(cardId);
    }, 500);
    
    // Remove animation state after animation completes
    setTimeout(() => {
      setLevelingUpCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
    }, 2500);
  };

  // Filter cards based on active tab
  const filteredCards = displayCards.filter(card => {
    if (activeTab === 'Tüm Seviyeler') return true;
    if (activeTab === 'Sv1') return card.level === 1;
    if (activeTab === 'Sv2') return card.level === 2;
    if (activeTab === 'Max Sv') return card.level === 3;
    return true;
  });

  return (
    <div style={styles.container}>
      {/* Energy Bar */}
      <div style={styles.energyBarContainer}>
        <div className="flex justify-between items-center mb-3">
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#F4BC79' }}>
            Enerji
          </span>
          <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
            {user.energy >= user.maxEnergy 
              ? "Energy Full!" 
              : `+${Math.round(energyPercentagePerRegen)}% in: ${calculateEnergyCountdown()}`
            }
          </span>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#F4BC79' }}>
            {user.energy}/{user.maxEnergy} (%{Math.round((user.energy / user.maxEnergy) * 100)})
          </span>
        </div>
        <div style={styles.energyBarWrapper}>
          <div style={{ 
            ...styles.energyBarFill, 
            width: `${(user.energy / user.maxEnergy) * 100}%` 
          }} />
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabContainer}>
        <div className="flex">
          {['Tüm Seviyeler', 'Sv1', 'Sv2', 'Max Sv'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tabButton,
                backgroundColor: activeTab === tab ? '#F4BC79' : 'transparent',
                color: activeTab === tab ? '#000000' : '#9CA3AF',
              }}
              className="focus:outline-none"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div style={styles.cardGrid}>
        {filteredCards.map(card => {
          const levelData = card.itemData?.levels[card.level - 1];
          const progressPercentage = (card.progress / card.maxProgress) * 100;
          const canLevelUp = card.progress >= card.maxProgress && card.level < 3;
          const canUpgrade = canAffordUpgrade(card.id, 1);
          const maxUpgradeAmount = getMaxUpgradeAmount(card.id);
          const canMaxUpgrade = maxUpgradeAmount > 1;
          const isMaxLevel = card.level >= 3;
          const isLevelingUp = levelingUpCards.has(card.id);

          return (
            <Card
              key={card.id}
              style={{
                ...styles.card,
                ...(isLevelingUp ? styles.levelUpCard : {}),
              }}
              className="hover:scale-105 focus:outline-none"
            >
              {/* Level Up Animation Overlay */}
              {isLevelingUp && (
                <>
                  <div style={styles.levelUpOverlay} />
                  <div style={styles.levelUpText}>
                    LEVEL UP!
                  </div>
                  {/* Sparkle Effects */}
                  {sparkles
                    .filter(s => s.id.startsWith(card.id))
                    .map(sparkle => (
                    <div
                      key={sparkle.id}
                      style={{
                        ...styles.sparkle,
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        animationDelay: `${sparkle.delay}s`,
                      }}
                    />
                  ))}
                </>
              )}

              {/* Card Image with Cross-Fade Animation */}
              <img
                src={`src/assets/${levelData?.image}`}
                alt={levelData?.title}
                style={{
                  ...styles.cardImage,
                  ...(isLevelingUp ? styles.imageTransition : {}),
                }}
                className="animate-[fadeIn_0.5s_ease-in-out]"
              />
              <div style={styles.cardOverlay} />

              {/* Card Content */}
              <div style={styles.cardContent}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
                    {levelData?.title}
                  </h3>
                  <p style={{ color: '#D1D5DB', fontSize: '16px', marginBottom: '24px' }}>
                    {levelData?.desc}
                  </p>
                  
                  {/* Progress Bar */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ 
                      backgroundColor: '#2A2D3A', 
                      borderRadius: '9999px', 
                      overflow: 'hidden',
                      border: '2px solid #4A5568'
                    }}>
                      <div
                        style={{
                          width: `${progressPercentage}%`,
                          height: '12px',
                          background: canLevelUp ? 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)' : '#EE39A8',
                          backgroundSize: canLevelUp ? '200% 100%' : 'auto',
                          animation: canLevelUp ? 'progressShine 2s ease-in-out infinite' : 'none',
                          transition: 'width 0.5s ease-in-out',
                        }}
                      />
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: canLevelUp ? '#FFD700' : '#9CA3AF', 
                      marginTop: '4px',
                      textAlign: 'center',
                      fontWeight: canLevelUp ? 'bold' : 'normal',
                      textShadow: canLevelUp ? '0 0 5px rgba(255, 215, 0, 0.5)' : 'none',
                    }}>
                      {card.progress} / {card.maxProgress} ({Math.round(progressPercentage)}%)
                      {canLevelUp && ' - READY TO LEVEL UP!'}
                    </div>
                  </div>
                </div>

                {/* Upgrade/Level Up Buttons */}
                <div>
                  {canLevelUp ? (
                    <button
                      onClick={() => handleLevelUp(card.id)}
                      disabled={isLevelingUp}
                      onMouseEnter={() => setHoveredButton(`levelup-${card.id}`)}
                      onMouseLeave={() => setHoveredButton(null)}
                      style={{
                        ...styles.upgradeButton,
                        ...styles.levelUpButton,
                        background: isLevelingUp 
                          ? 'linear-gradient(145deg, #FFD700, #FFA500)' 
                          : 'linear-gradient(145deg, #2B8A6B, #1F6B4F)',
                        boxShadow: canLevelUp 
                          ? '0 0 20px rgba(255, 215, 0, 0.5), inset 0 2px 4px rgba(255,255,255,0.2)' 
                          : styles.levelUpButton.boxShadow,
                        animation: canLevelUp && !isLevelingUp ? 'buttonPulse 1.5s ease-in-out infinite' : 'none',
                        ...(hoveredButton === `levelup-${card.id}` && !isLevelingUp ? styles.levelUpButtonHover : {}),
                      }}
                      className="focus:outline-none border-0"
                    >
                      <div style={styles.buttonTexture} />
                      <span style={{ position: 'relative', zIndex: 1 }}>
                        {isLevelingUp 
                          ? 'Leveling Up...' 
                          : `Seviye Atla! (${card.level} → ${card.level + 1})`
                        }
                      </span>
                    </button>
                  ) : isMaxLevel ? (
                    <button
                      disabled
                      style={{
                        ...styles.upgradeButton,
                        ...styles.disabledButton,
                        height: '48px',
                      }}
                      className="focus:outline-none border-0"
                    >
                      <div style={styles.buttonTexture} />
                      <span style={{ position: 'relative', zIndex: 1 }}>
                        Maksimum Seviye
                      </span>
                    </button>
                  ) : (
                    <>
                      {/* Regular Upgrade Button */}
                      <button
                        onClick={() => handleUpgrade(card.id)}
                        disabled={!canUpgrade}
                        onMouseEnter={() => setHoveredButton(`upgrade-${card.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        style={{
                          ...styles.upgradeButton,
                          ...(!canUpgrade ? styles.disabledButton : {}),
                          ...(hoveredButton === `upgrade-${card.id}` && canUpgrade ? styles.upgradeButtonHover : {}),
                        }}
                        className="focus:outline-none border-0"
                      >
                        <div style={styles.buttonTexture} />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          Geliştir (+2%) - 1 Enerji
                        </span>
                      </button>
                      
                      {/* Max Upgrade Button */}
                      <button
                        onClick={() => handleMaxUpgrade(card.id)}
                        disabled={!canMaxUpgrade}
                        onMouseEnter={() => setHoveredButton(`maxupgrade-${card.id}`)}
                        onMouseLeave={() => setHoveredButton(null)}
                        style={{
                          ...styles.maxUpgradeButton,
                          ...(!canMaxUpgrade ? styles.disabledButton : {}),
                          ...(hoveredButton === `maxupgrade-${card.id}` && canMaxUpgrade ? styles.maxUpgradeButtonHover : {}),
                        }}
                        className="focus:outline-none border-0"
                      >
                        <div style={styles.buttonTexture} />
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          Max Geliştir (+{maxUpgradeAmount * 2}%) - {maxUpgradeAmount} Enerji
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Card Dimensions */}
              <span style={{ 
                fontSize: '12px', 
                color: '#60A5FA', 
                backgroundColor: 'rgba(29, 78, 216, 0.3)', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                marginTop: '8px' 
              }}>
                166 x 350
              </span>
            </Card>
          );
        })}
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.3; }
        }
        
        @keyframes levelUpPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes levelUpGlow {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        
        @keyframes levelUpTextFloat {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.5); 
          }
          20% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.2); 
          }
          80% { 
            opacity: 1; 
            transform: translate(-50%, -60%) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -70%) scale(0.8); 
          }
        }
        
        @keyframes sparkleFloat {
          0% { 
            opacity: 0; 
            transform: scale(0) translateY(0px); 
          }
          20% { 
            opacity: 1; 
            transform: scale(1) translateY(-10px); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0) translateY(-50px); 
          }
        }
        
        @keyframes imageTransition {
          0% { opacity: 0.3; filter: brightness(1); }
          50% { opacity: 0.8; filter: brightness(1.5); }
          100% { opacity: 0.3; filter: brightness(1); }
        }
        
        @keyframes progressShine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes buttonPulse {
          0% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
          50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.7); }
          100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.3); }
        }
        
        /* Eskitilmiş metal efektleri */
        .vintage-button {
          position: relative;
        }
        
        .vintage-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            rgba(255,255,255,0.1) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0,0,0,0.1) 100%
          );
          pointer-events: none;
        }
        
        .vintage-button::after {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          bottom: 2px;
          background: radial-gradient(
            ellipse at center,
            rgba(255,255,255,0.05) 0%,
            transparent 70%
          );
          border-radius: 6px;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};
