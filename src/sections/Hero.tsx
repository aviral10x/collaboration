import { useEffect } from 'react';
import gsap from 'gsap';
import { useHlsVideo } from '../hooks/useHlsVideo';
import { useSmoothScroll } from '../hooks/useSmoothScroll';

export function Hero() {
  const { videoRef } = useHlsVideo('https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8');
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(".name-reveal", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
    )
    .fromTo(".blur-in",
      { opacity: 0, filter: "blur(10px)", y: 20 },
      { opacity: 1, filter: "blur(0px)", y: 0, duration: 1, stagger: 0.1 },
      0.3
    );

  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0 bg-[var(--color-bg)]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[var(--color-bg)] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1500px] flex-col items-center justify-center px-6 pb-28 pt-20 text-center md:pb-32 md:pt-24">
        <h1 className="name-reveal mb-10 font-display text-6xl italic leading-[0.88] text-[var(--color-text-primary)] md:mb-12 md:text-8xl lg:text-9xl">
          Neural Studios
        </h1>
        <p className="blur-in mb-12 max-w-xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
          Cinematic films with atmosphere, taste, and momentum, crafted to make launches, products, and moments feel unforgettable.
        </p>

        <div className="blur-in flex items-center">
          <button
            id="hero-cta"
            onClick={() => scrollToSection('contact')}
            className="hero-cta group relative flex cursor-pointer items-center gap-3 rounded-full overflow-hidden border border-white/20 px-2 py-2 transition-transform duration-500 hover:scale-[1.04] active:scale-[0.98]"
          >
            <span className="hero-cta-glow" aria-hidden="true" />
            <span className="hero-cta-sheen" aria-hidden="true" />
            <span className="relative text-sm md:text-base font-semibold text-[var(--color-text-primary)] pl-6 pr-2 py-3.5">
              Get in touch
            </span>
            <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] transition-transform duration-500 group-hover:translate-x-1 group-hover:rotate-45">
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                className="text-current"
              >
                <path d="M2 12L12 2M12 2H4.5M12 2V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-12">
        <span className="text-[10px] text-[var(--color-muted)] uppercase tracking-[0.2em]">SCROLL</span>
        <div className="w-px h-10 bg-[var(--color-stroke)] overflow-hidden relative">
          <div className="w-full h-full bg-[var(--color-text-primary)]/50 absolute top-0 left-0 animate-[var(--animate-scroll-down)]" />
        </div>
      </div>
    </section>
  );
}
