import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader.jsx';
import { AppNavigation } from './components/AppNavigation.jsx';
import { Modal } from './components/Modal.jsx';
import { ForgeScreen } from './screens/ForgeScreen.jsx';
import { FocusScreen } from './screens/FocusScreen.jsx';
import { ResearchScreen } from './screens/ResearchScreen.jsx';
import { ChronicleScreen } from './screens/ChronicleScreen.jsx';
import { useFocusForge } from './hooks/useFocusForge.js';
import './styles.css';

// Root application composes the responsive shell around the four product destinations.
export default function App() {
  const focusForge = useFocusForge();
  const [confirmation, setConfirmation] = useState(null);
  const { tab, toast, setToast } = focusForge;

  // Toasts self-dismiss while remaining available to assistive technology as a live region.
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3_200);
    return () => window.clearTimeout(timeout);
  }, [setToast, toast]);

  // Each destination opens at its own top-level context instead of inheriting prior scroll depth.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [tab]);

  const useChronicleDuration = (duration) => {
    const closest = [15, 25, 45, 60, 90].reduce((best, value) => (
      Math.abs(value - duration) < Math.abs(best - duration) ? value : best
    ), 25);
    focusForge.setSelectedDuration(closest);
    focusForge.setTab('forge');
  };

  return (
    <div className="app-shell">
      <AppHeader game={focusForge.game} timer={focusForge.timer} />
      <AppNavigation activeTab={focusForge.tab} onChange={focusForge.setTab} timerStatus={focusForge.timer.status} />
      <main className="app-main" id="main-content">
        {focusForge.tab === 'forge' ? (
          <ForgeScreen
            game={focusForge.game}
            timer={focusForge.timer}
            selectedDuration={focusForge.selectedDuration}
            intention={focusForge.intention}
            onDurationChange={focusForge.setSelectedDuration}
            onIntentionChange={focusForge.setIntention}
            onStart={focusForge.startFocus}
            onBuild={focusForge.purchaseBuilding}
            onOpenFocus={() => focusForge.setTab('focus')}
          />
        ) : null}
        {focusForge.tab === 'focus' ? (
          <FocusScreen
            game={focusForge.game}
            timer={focusForge.timer}
            onPause={focusForge.togglePause}
            onReset={focusForge.resetTimer}
            onGoForge={() => focusForge.setTab('forge')}
            onRequestAbandon={() => setConfirmation('abandon')}
          />
        ) : null}
        {focusForge.tab === 'research' ? <ResearchScreen game={focusForge.game} onResearch={focusForge.researchTechnology} /> : null}
        {focusForge.tab === 'chronicle' ? (
          <ChronicleScreen
            game={focusForge.game}
            onExport={focusForge.exportGame}
            onImport={focusForge.restoreGame}
            onRequestReset={() => setConfirmation('reset')}
            onUseDuration={useChronicleDuration}
          />
        ) : null}
      </main>

      {focusForge.toast ? <div className={`toast ${focusForge.toast.tone}`} role="status">{focusForge.toast.message}</div> : null}

      <Modal
        open={confirmation === 'abandon'}
        title="Abandon this session?"
        confirmLabel="Abandon session"
        onClose={() => setConfirmation(null)}
        onConfirm={() => { focusForge.abandonSession(); setConfirmation(null); }}
      >
        <p>The current countdown and uncommitted session resources will be lost. Your existing civilization remains intact.</p>
      </Modal>
      <Modal
        open={confirmation === 'reset'}
        title="Found a new Hamlet?"
        confirmLabel="Reset everything"
        onClose={() => setConfirmation(null)}
        onConfirm={() => { focusForge.resetGame(); setConfirmation(null); }}
      >
        <p>This permanently removes buildings, research, resources, focus history, and local backups stored in this browser.</p>
      </Modal>
    </div>
  );
}
