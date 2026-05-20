import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_WORDS = ['Frame', 'Motion', 'Story'];

export function LoadingScreen({
  ready = false,
  onComplete,
}: {
  ready?: boolean;
  onComplete: () => void;
}) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCounter = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const minDuration = 900;
      const maxDuration = 1800;
      const shouldFinish = elapsed >= maxDuration || (ready && elapsed >= minDuration);

      if (shouldFinish) {
        setCount(100);
        setFinished(true);
        return;
      }

      const progress = Math.min(elapsed / maxDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const softCap = ready ? 96 : 84;
      setCount(Math.min(Math.floor(easedProgress * softCap), softCap));
      frameRef.current = requestAnimationFrame(updateCounter);
    };

    frameRef.current = requestAnimationFrame(updateCounter);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [ready]);

  useEffect(() => {
    if (!finished) return;
    const completeTimer = window.setTimeout(onComplete, 260);
    return () => window.clearTimeout(completeTimer);
  }, [finished, onComplete]);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % LOADING_WORDS.length);
    }, 430);

    return () => {
      clearInterval(wordInterval);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[var(--color-bg)] p-6 md:p-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Top Left Label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-xs text-[var(--color-muted)] uppercase tracking-[0.3em]"
      >
        Neural Studios
      </motion.div>

      {/* Center Rotating Words */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="font-display text-5xl italic text-[var(--color-text-primary)]/85 md:text-7xl lg:text-8xl"
          >
            {LOADING_WORDS[wordIndex]}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Bottom Area */}
      <div>
        <div className="flex justify-end mb-4">
          <div className="font-display text-5xl text-[var(--color-text-primary)] tabular-nums md:text-7xl lg:text-8xl">
            {String(count).padStart(3, "0")}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-[3px] bg-[var(--color-stroke)]/50 w-full overflow-hidden">
          <div 
            className="h-full accent-gradient origin-left"
            style={{ 
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
              transition: 'transform 0.08s linear'
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
