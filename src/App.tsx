import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Hero } from './sections/Hero';
import { SelectedWorks } from './sections/SelectedWorks';
import { Journal } from './sections/Journal';
import { Contact } from './sections/Contact';
import { FloatingCTA } from './sections/FloatingCTA';
import { LoadingScreen } from './sections/LoadingScreen';

function App() {
  useEffect(() => {
    if (window.location.hash) return;

    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  return (
    <>
      <main>
        <Hero />
        <SelectedWorks />
        <Journal />
        <Contact />
      </main>
      <FloatingCTA />
      <LoadingScreen />
      <Analytics />
    </>
  );
}

export default App;
