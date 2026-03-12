import { useRef, useCallback, useEffect } from 'react';

import startSound from '../assets/sounds/ui/start.mp3';
import selectSound from '../assets/sounds/ui/select.mp3';
import backSound from '../assets/sounds/ui/go back.mp3';
import claimSound from '../assets/sounds/ui/claim.mp3';
import unlockSound from '../assets/sounds/ui/unlock.mp3';

type SoundName = 'start' | 'select' | 'claim' | 'back' | 'unlock';

const SOUND_PATHS: Record<SoundName, string> = {
  start: startSound,
  select: selectSound,
  claim: claimSound,
  back: backSound,
  unlock: unlockSound,
};

export function useSounds() {
  const audioCache = useRef<Map<SoundName, HTMLAudioElement>>(new Map());

  // Precargar sonidos
  useEffect(() => {
    Object.entries(SOUND_PATHS).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 0.3; // Volumen por defecto
      audioCache.current.set(name as SoundName, audio);
    });

    // Cleanup
    return () => {
      audioCache.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioCache.current.clear();
    };
  }, []);

  const play = useCallback((soundName: SoundName, volume?: number) => {
    const audio = audioCache.current.get(soundName);
    if (audio) {
      // Reiniciar si ya está sonando
      audio.currentTime = 0;

      if (volume !== undefined) {
        audio.volume = volume;
      }

      audio.play().catch((error) => {
        console.warn(`Error playing sound ${soundName}:`, error);
      });
    }
  }, []);

  return { play };
}
