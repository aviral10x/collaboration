import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export function LoadingScreen({
  ready = false,
  onComplete,
}: {
  ready?: boolean;
  onComplete?: () => void;
}) {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const updateCounter = () => {
      if (!startTimeRef.current) startTimeRef.current = Date.now();
      const elapsed = Date.now() - startTimeRef.current;
      const minDuration = 900;
      const maxDuration = 1800;
      const shouldFinish = elapsed >= maxDuration || (ready && elapsed >= minDuration);

      if (shouldFinish) {
        setCount(100);
        if (!completedRef.current) {
          completedRef.current = true;
          setFinished(true);
          onComplete?.();
        }
        return;
      }

      const progress = Math.min(elapsed / maxDuration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const softCap = ready ? 96 : 84;
      setCount(Math.min(Math.floor(easedProgress * softCap), softCap));
    };

    updateCounter();
    const counterInterval = setInterval(updateCounter, 32);

    return () => {
      clearInterval(counterInterval);
    };
  }, [ready, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[var(--color-bg)] p-6 md:p-8"
      style={{
        opacity: finished ? 0 : 1,
        pointerEvents: finished ? 'none' : 'auto',
        visibility: finished ? 'hidden' : 'visible',
        transition: 'opacity 350ms cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
      aria-hidden={finished}
    >
      <div className="flex-1 flex items-center justify-center">
        <motion.h1
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-6xl italic leading-[0.88] text-[var(--color-text-primary)] md:text-8xl lg:text-9xl"
        >
          Neural Studios
        </motion.h1>
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
    </div>
  );
}
