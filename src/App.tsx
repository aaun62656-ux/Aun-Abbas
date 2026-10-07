import { useState, useEffect } from 'react';
import { GameType, GameStats, AppSettings } from './types';
import { 
  loadStats, saveSettings, loadSettings, 
  addStars, resetAllProgress, getSessionDurationMinutes 
} from './utils/storage';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { NumberMatchingGame } from './components/games/NumberMatchingGame';
import { AlphabetLearningGame } from './components/games/AlphabetLearningGame';
import { MemoryCardGame } from './components/games/MemoryCardGame';
import { SimplePuzzleGame } from './components/games/SimplePuzzleGame';
import { CountingGame } from './components/games/CountingGame';
import { ParentGateModal } from './components/ParentGateModal';
import { ParentDashboard } from './components/ParentDashboard';
import { ScreenTimeAlert } from './components/ScreenTimeAlert';
import { DeviceFrame } from './components/DeviceFrame';

export default function App() {
  const [stats, setStats] = useState<GameStats>(loadStats);
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [currentGame, setCurrentGame] = useState<GameType>('home');
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [screenTimeAlertOpen, setScreenTimeAlertOpen] = useState(false);
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'full'>('full');

  // Screen time monitoring
  useEffect(() => {
    if (settings.screenTimeLimitMinutes <= 0) return;

    const interval = setInterval(() => {
      const minutes = getSessionDurationMinutes();
      if (minutes >= settings.screenTimeLimitMinutes) {
        setScreenTimeAlertOpen(true);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [settings.screenTimeLimitMinutes]);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetProgress = () => {
    const fresh = resetAllProgress();
    setStats(fresh);
  };

  const handleWinGame = (gameKey: keyof GameStats, starCount: number) => {
    const updated = addStars(gameKey, starCount);
    setStats(updated);
  };

  const totalStars = 
    stats.numberMatchingStars + 
    stats.alphabetLearningStars + 
    stats.memoryCardStars + 
    stats.simplePuzzleStars + 
    stats.countingGameStars;

  return (
    <DeviceFrame mode={viewportMode}>
      <div className="min-h-screen flex flex-col bg-amber-50/20 text-gray-900 font-sans selection:bg-amber-200">
        {/* Navigation & Controls Header */}
        <Header
          currentGame={currentGame}
          onNavigateHome={() => setCurrentGame('home')}
          onOpenParentGate={() => setParentGateOpen(true)}
          soundEnabled={settings.soundEnabled}
          onToggleSound={() =>
            handleUpdateSettings({
              ...settings,
              soundEnabled: !settings.soundEnabled,
            })
          }
          totalStars={totalStars}
          viewportMode={viewportMode}
          onChangeViewport={setViewportMode}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col justify-center">
          {currentGame === 'home' && (
            <HomeScreen
              stats={stats}
              soundEnabled={settings.soundEnabled}
              onSelectGame={(gameId) => setCurrentGame(gameId)}
            />
          )}

          {currentGame === 'number_matching' && (
            <NumberMatchingGame
              soundEnabled={settings.soundEnabled}
              speechEnabled={settings.speechEnabled}
              onWin={(stars) => handleWinGame('numberMatchingStars', stars)}
              onHome={() => setCurrentGame('home')}
            />
          )}

          {currentGame === 'alphabet_learning' && (
            <AlphabetLearningGame
              soundEnabled={settings.soundEnabled}
              speechEnabled={settings.speechEnabled}
              onWin={(stars) => handleWinGame('alphabetLearningStars', stars)}
              onHome={() => setCurrentGame('home')}
            />
          )}

          {currentGame === 'memory_card' && (
            <MemoryCardGame
              soundEnabled={settings.soundEnabled}
              speechEnabled={settings.speechEnabled}
              onWin={(stars) => handleWinGame('memoryCardStars', stars)}
              onHome={() => setCurrentGame('home')}
            />
          )}

          {currentGame === 'simple_puzzle' && (
            <SimplePuzzleGame
              soundEnabled={settings.soundEnabled}
              speechEnabled={settings.speechEnabled}
              onWin={(stars) => handleWinGame('simplePuzzleStars', stars)}
              onHome={() => setCurrentGame('home')}
            />
          )}

          {currentGame === 'counting_game' && (
            <CountingGame
              soundEnabled={settings.soundEnabled}
              speechEnabled={settings.speechEnabled}
              onWin={(stars) => handleWinGame('countingGameStars', stars)}
              onHome={() => setCurrentGame('home')}
            />
          )}

          {currentGame === 'parent_zone' && (
            <ParentDashboard
              stats={stats}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetProgress={handleResetProgress}
              onBack={() => setCurrentGame('home')}
            />
          )}
        </main>

        {/* Parental Gate Modal */}
        <ParentGateModal
          isOpen={parentGateOpen}
          soundEnabled={settings.soundEnabled}
          onSuccess={() => {
            setParentGateOpen(false);
            setCurrentGame('parent_zone');
          }}
          onClose={() => setParentGateOpen(false)}
        />

        {/* Screen Time Rest Alert */}
        <ScreenTimeAlert
          isOpen={screenTimeAlertOpen}
          soundEnabled={settings.soundEnabled}
          onDismiss={() => setScreenTimeAlertOpen(false)}
        />
      </div>
    </DeviceFrame>
  );
}
