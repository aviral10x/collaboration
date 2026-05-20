import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Hero } from './sections/Hero';
import { SelectedWorks } from './sections/SelectedWorks';
import { Journal } from './sections/Journal';
import { Contact } from './sections/Contact';
import { FloatingCTA } from './sections/FloatingCTA';
import { BackgroundAudio } from './sections/BackgroundAudio';
import { LoadingScreen } from './sections/LoadingScreen';

function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [heroReady, setHeroReady] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setShowLoading(false);
  }, []);

  const handleHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  return (
    <>
      <main>
        <Hero playIntro={!showLoading} onReady={handleHeroReady} />
        <SelectedWorks />
        <Journal />
        <Contact />
      </main>
      <FloatingCTA />
      <BackgroundAudio />
      <AnimatePresence>
        {showLoading && (
          <LoadingScreen
            ready={heroReady}
            onComplete={handleLoadingComplete}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
