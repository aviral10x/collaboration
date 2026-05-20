import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

export function useHlsVideo(src: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    hlsRef.current?.destroy();
    hlsRef.current = null;

    let ready = false;
    const markReady = () => {
      if (ready) return;
      ready = true;
      setIsReady(true);
    };

    const playVideo = () => {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => console.error("Video autoplay failed completely"));
      });
    };

    video.addEventListener('loadeddata', markReady, { once: true });
    video.addEventListener('canplay', markReady, { once: true });

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true, // Optimizes bandwidth based on player size
        startLevel: -1 // auto
      });
      hlsRef.current = hls;
      
      hls.loadSource(src);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        playVideo();
      });

      return () => {
        video.removeEventListener('loadeddata', markReady);
        video.removeEventListener('canplay', markReady);
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', playVideo, { once: true });

      return () => {
        video.removeEventListener('loadeddata', markReady);
        video.removeEventListener('canplay', markReady);
        video.removeEventListener('loadedmetadata', playVideo);
        video.removeAttribute('src');
        video.load();
      };
    }

    return () => {
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
    };
  }, [src]);

  return { videoRef, isReady };
}
