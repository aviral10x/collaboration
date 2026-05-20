import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hls from 'hls.js';
import { projects } from '../data/content';

type CardProject = (typeof projects)[number];

function getMuxStream(playbackId: string) {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

function getMuxThumbnail(playbackId: string, width = 1920) {
  return `https://image.mux.com/${playbackId}/thumbnail.jpg?width=${width}&fit_mode=preserve&time=3`;
}

function getBestVideoSource(project: CardProject) {
  return project.muxPlaybackId ? getMuxStream(project.muxPlaybackId) : project.video;
}

function getBestPoster(project: CardProject) {
  return project.muxPlaybackId ? getMuxThumbnail(project.muxPlaybackId) : project.image;
}

function useVideoSource(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [readyKey, setReadyKey] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    hlsRef.current?.destroy();
    hlsRef.current = null;

    const markReady = () => setReadyKey((value) => value + 1);

    if (src.endsWith('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          capLevelToPlayerSize: false,
          startLevel: -1,
          maxBufferLength: 24,
        });

        hlsRef.current = hls;
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, markReady);

        return () => {
          hls.destroy();
        };
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', markReady, { once: true });

        return () => {
          video.removeEventListener('loadedmetadata', markReady);
          video.removeAttribute('src');
          video.load();
        };
      }
    }

    video.src = src;
    video.addEventListener('loadedmetadata', markReady, { once: true });
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', markReady);
      video.removeAttribute('src');
      video.load();
    };
  }, [src]);

  return { videoRef, readyKey };
}

/* ─────────────────────────────────────────────────────────────
 * LocalVideo lazily plays local MP4 previews on hover.
 * ───────────────────────────────────────────────────────────── */
function useLocalVideoPlayer(src: string) {
  const { videoRef } = useVideoSource(src);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [videoRef]);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setIsPlaying(false);
  }, [videoRef]);

  return { videoRef, isPlaying, play, pause };
}

/* ─────────────────────────────────────────────────────────────
 * VideoModal fullscreen local MP4 player with sound toggle
 * ───────────────────────────────────────────────────────────── */
function VideoModal({ project, onClose }: { project: CardProject; onClose: () => void }) {
  const videoSource = getBestVideoSource(project);
  const posterSource = getBestPoster(project);
  const { videoRef, readyKey } = useVideoSource(videoSource);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const video = videoRef.current;

    async function startPlayback() {
      if (!video) return;
      try {
        video.muted = false;
        await video.play();
        setMuted(false);
      } catch {
        video.muted = true;
        setMuted(true);
        await video.play().catch(() => {});
      }
    }
    void startPlayback();

    return () => {
      document.body.style.overflow = '';
    };
  }, [videoSource, readyKey, videoRef]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

      {/* Video Container */}
      <motion.div
        className="relative w-full max-w-6xl mx-4 aspect-video rounded-2xl overflow-hidden border border-white/10"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          poster={posterSource}
          muted={muted}
          loop
          playsInline
          preload="auto"
          controls
          controlsList="nodownload noplaybackrate"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-5 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <span className="text-xs uppercase tracking-[0.2em] font-medium mr-3" style={{ color: project.accent }}>
              {project.category}
            </span>
            <span className="text-white/90 text-lg font-display italic">{project.title}</span>
          </div>
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              type="button"
              onClick={toggleMute}
              className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors"
            >
              {muted ? 'Sound Off' : 'Sound On'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between z-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
          <p className="text-white/60 text-sm max-w-lg leading-relaxed">{project.description}</p>
          <span className="text-xs tabular-nums" style={{ color: project.accent }}>{project.year}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * FeatureWorkCard shows a high-resolution poster, then plays the best available stream on hover,
 * click-to-expand into modal.
 * ───────────────────────────────────────────────────────────── */
function FeatureWorkCard({
  project,
  index,
  featured = false,
  onOpen,
}: {
  project: CardProject;
  index: number;
  featured?: boolean;
  onOpen: (p: CardProject) => void;
}) {
  const videoSource = getBestVideoSource(project);
  const posterSource = getBestPoster(project);
  const { videoRef, isPlaying, play, pause } = useLocalVideoPlayer(videoSource);
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  function handleEnter() {
    if (isTouchDevice) return;
    play();
  }

  function handleLeave() {
    if (isTouchDevice) return;
    pause();
  }

  return (
    <motion.div
      className={`group relative cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-black ${
        featured ? 'min-h-[520px] md:min-h-[680px]' : 'min-h-[500px] md:min-h-[620px]'
      }`}
      style={{
        boxShadow: isPlaying
          ? `0 0 90px ${project.accent}26, 0 28px 90px rgba(0,0,0,0.72)`
          : '0 18px 70px rgba(0,0,0,0.52)',
        transition: 'box-shadow 0.6s ease',
      }}
      whileHover={{ scale: 1.012 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={() => onOpen(project)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      {/* High-resolution poster thumbnail */}
      <img
        src={posterSource}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: 'transform 0.8s cubic-bezier(0.25,1,0.5,1), opacity 0.8s ease',
          transform: isPlaying ? 'scale(1.04)' : 'scale(1)',
          opacity: isPlaying ? 0.1 : 1,
        }}
        loading="lazy"
      />

      {/* Streaming HLS video */}
      <video
        ref={videoRef}
        poster={posterSource}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transition: 'transform 0.8s cubic-bezier(0.25,1,0.5,1), opacity 0.6s ease',
          transform: isPlaying ? 'scale(1.04)' : 'scale(1)',
          opacity: isPlaying ? 1 : 0,
        }}
      />

      {/* Gradient scrim */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.26) 46%, rgba(0,0,0,0.04) 100%)',
          opacity: isPlaying ? 0.18 : 1,
          transition: 'opacity 0.6s ease',
        }}
      />

      <div className="absolute inset-x-0 top-0 z-[2] flex items-start justify-between p-5 md:p-7">
        <div>
          <span className="mb-3 block text-[10px] uppercase tracking-[0.28em] text-white/50 md:text-xs">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="text-[10px] font-medium uppercase tracking-[0.22em] md:text-xs"
            style={{ color: project.accent }}
          >
            {project.category}
          </span>
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/60 backdrop-blur-md">
          Play film
        </span>
      </div>

      {/* Play indicator center */}
      <div
        className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none"
        style={{ opacity: isPlaying ? 0 : 0.28, transition: 'opacity 0.4s ease' }}
      >
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 backdrop-blur-sm"
          style={{ borderColor: project.accent }}
        >
          <span
            className="block w-0 h-0 ml-1"
            style={{
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              borderLeft: `14px solid ${project.accent}`,
            }}
          />
        </div>
      </div>

      {/* "Click to expand" visible during playback */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 translate-y-14 text-[10px] uppercase tracking-[0.24em]"
        animate={{ opacity: isPlaying ? 0.68 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ color: project.accent }}
      >
        Click to expand
      </motion.div>

      {/* Bottom info title, role, year */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] p-5 md:p-7"
        style={{ opacity: isPlaying ? 0.92 : 1, transition: 'opacity 0.4s ease' }}
      >
        <div className="mb-5 h-px w-full bg-gradient-to-r from-white/40 via-white/10 to-transparent" />
        <div className="flex items-end justify-between gap-5">
          <div>
            <h3 className="text-4xl leading-none text-white md:text-6xl">
              {project.title}
            </h3>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-white/58 md:text-sm">
              {project.description.length > 120 ? project.description.slice(0, 120) + '...' : project.description}
            </p>
          </div>
          <span className="shrink-0 text-xs tabular-nums" style={{ color: project.accent }}>
            {project.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

const proofWorkIds = ['ferrari-concept', 'swiss-beauty'];

export function SelectedWorks() {
  const [activeProject, setActiveProject] = useState<CardProject | null>(null);
  const proofProjects = proofWorkIds
    .map((id) => projects.find((project) => project.id === id))
    .filter((project): project is CardProject => Boolean(project));

  return (
    <section id="work" className="relative overflow-hidden bg-[var(--color-bg)] pb-20 pt-10 md:pb-32 md:pt-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12 md:mb-16 grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-end"
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-[var(--color-stroke)]" />
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-[0.3em]">
                Selected Films
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl text-[var(--color-text-primary)] mb-5">
              Proof of <span className="font-display italic">Work</span>
            </h2>
          </div>

          <div className="md:justify-self-end md:max-w-xl">
            <p className="text-base leading-relaxed text-[var(--color-muted)] md:text-lg">
              Two signal pieces: one built on speed and scale, one on texture, light, and desire.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              <span>{String(proofProjects.length).padStart(2, '0')} films</span>
              <span className="h-px w-10 bg-white/15" />
              <span>Hover preview</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-6">
          {proofProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className={index === 1 ? 'lg:pt-20' : ''}
            >
              <FeatureWorkCard
                project={project}
                index={index}
                featured={index === 0}
                onOpen={setActiveProject}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {activeProject && (
          <VideoModal
            project={activeProject}
            onClose={() => setActiveProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
