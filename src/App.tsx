import { Hero } from './sections/Hero';
import { SelectedWorks } from './sections/SelectedWorks';
import { Journal } from './sections/Journal';
import { Contact } from './sections/Contact';
import { FloatingCTA } from './sections/FloatingCTA';
import { BackgroundAudio } from './sections/BackgroundAudio';
import { LoadingScreen } from './sections/LoadingScreen';

function App() {
  return (
    <>
      <main>
        <Hero />
        <SelectedWorks />
        <Journal />
        <Contact />
      </main>
      <FloatingCTA />
      <BackgroundAudio />
      <LoadingScreen />
    </>
  );
}

export default App;
