import { create } from 'zustand';
import EPISODES_JSON from '../data/urls.json';
import { CANON_EPISODES_STRING, NON_CANON_EPISODES_STRING, CENSORED_EPISODES, parseEpisodes } from '../utils/canon';

const WATCHED_EPISODES_KEY = 'pokemon_watched_episodes';

interface Episode {
  code: string;
  season: number;
  episode: number;
  absoluteEpisode: number;
  name: string;
  url: string;
  isCanon: boolean;
  isCensored: boolean; // NUEVO
}

interface EpisodeStore {
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  watchedEpisodes: Set<string>;
  fetchEpisodes: () => Promise<void>;
  getEpisodeByCode: (code: string) => Episode | undefined;
  getEpisodeBySeasonAndNumber: (season: number, episode: number) => Episode | undefined;
  markAsWatched: (code: string) => void;
  isWatched: (code: string) => boolean;
  clearCache: () => void;
}

const parseEpisodeUrl = (url: string, index: number, allUrls: string[]): Episode | null => {
  // Filtrar separadores de temporada (.mx)
  if (url.includes('.mx')) {
    return null;
  }
  
  // Extraer el código del episodio - puede estar después de /e/ o /d/
  const codeMatch = url.match(/\/[ed]\/([^/]+)/);
  if (!codeMatch) return null;
  const code = codeMatch[1];
  
  // Extraer la parte después del código
  const afterCode = url.split(`/${codeMatch[0].includes('/e/') ? 'e' : 'd'}/${code}/`)[1];
  if (!afterCode) return null;
  
  // CASO 1: Formato estándar ##x## o ##X##
  const standardMatch = afterCode.match(/^(\d+)[xX](\d+)[_\-\s]*(.+?)(?:-?(1080p|960p))?$/i);
  if (standardMatch) {
    const [, season, episode, name] = standardMatch;
    return {
      code,
      season: parseInt(season, 10),
      episode: parseInt(episode, 10),
      absoluteEpisode: 0,
      name: cleanName(name),
      url,
      isCanon: false,
      isCensored: false // NUEVO
    };
  }
  
  // CASO 2: Formato EP##
  const epMatch = afterCode.match(/^EP(\d+)[_\-\s]*(.+?)$/i);
  if (epMatch) {
    const [, episode] = epMatch;
    const name = cleanName(epMatch[2]);
    
    // Buscar hacia atrás para encontrar la temporada más reciente
    let season = 1;
    for (let i = index - 1; i >= 0; i--) {
      const prevUrl = allUrls[i];
      const prevMatch = prevUrl.match(/(\d+)[xX]\d+/);
      if (prevMatch) {
        season = parseInt(prevMatch[1], 10);
        break;
      }
    }
    
    return {
      code,
      season,
      episode: parseInt(episode, 10),
      absoluteEpisode: 0,
      name,
      url,
      isCanon: false,
      isCensored: false // NUEVO
    };
  }
  
  console.warn('Formato de URL no reconocido:', url);
  return null;
};

const cleanName = (name: string): string => {
  return name
    .replace(/^[_\-\s]+/, '')
    .replace(/[_\-\s]+$/, '')
    .replace(/[_]+/g, ' ')
    .replace(/[-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*!\s*/g, '!')
    .replace(/\s*\?\s*/g, '?')
    .trim();
};

const loadWatchedEpisodes = (): Set<string> => {
  try {
    const stored = localStorage.getItem(WATCHED_EPISODES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
};

const saveWatchedEpisodes = (watchedEpisodes: Set<string>) => {
  try {
    localStorage.setItem(WATCHED_EPISODES_KEY, JSON.stringify([...watchedEpisodes]));
  } catch (error) {
    console.error('Error guardando episodios vistos:', error);
  }
};

const assignAbsoluteNumbersAndCanon = (episodes: Episode[]): Episode[] => {
  const canonEpisodes = new Set(parseEpisodes(CANON_EPISODES_STRING));
  const nonCanonEpisodes = new Set(parseEpisodes(NON_CANON_EPISODES_STRING));
  const censoredEpisodes = new Set(parseEpisodes(CENSORED_EPISODES)); // NUEVO
  
  return episodes.map((episode, index) => {
    const absoluteEpisode = index + 1;
    
    let isCanon = true;
    
    if (canonEpisodes.has(absoluteEpisode)) {
      isCanon = true;
    } else if (nonCanonEpisodes.has(absoluteEpisode)) {
      isCanon = false;
    }
    
    // NUEVO: Verificar si está censurado
    const isCensored = censoredEpisodes.has(absoluteEpisode);
    
    return {
      ...episode,
      absoluteEpisode,
      isCanon,
      isCensored // NUEVO
    };
  });
};

export const useEpisodeStore = create<EpisodeStore>((set, get) => ({
  episodes: [],
  loading: false,
  error: null,
  watchedEpisodes: loadWatchedEpisodes(),
  
  fetchEpisodes: async () => {
    if (get().episodes.length > 0) {
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      const urls: string[] = EPISODES_JSON;
      let parsedEpisodes = urls
        .map((url, index) => parseEpisodeUrl(url, index, urls))
        .filter((ep): ep is Episode => ep !== null);
      
      parsedEpisodes = assignAbsoluteNumbersAndCanon(parsedEpisodes);
      
      console.log(`Total de episodios parseados: ${parsedEpisodes.length} de ${urls.length} URLs`);
      console.log(`Episodios canon: ${parsedEpisodes.filter(ep => ep.isCanon).length}`);
      console.log(`Episodios relleno: ${parsedEpisodes.filter(ep => !ep.isCanon).length}`);
      console.log(`Episodios censurados: ${parsedEpisodes.filter(ep => ep.isCensored).length}`); // NUEVO
      
      set({ episodes: parsedEpisodes, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Error desconocido', 
        loading: false 
      });
    }
  },
  
  getEpisodeByCode: (code: string) => {
    return get().episodes.find(ep => ep.code === code);
  },
  
  getEpisodeBySeasonAndNumber: (season: number, episode: number) => {
    return get().episodes.find(ep => ep.season === season && ep.episode === episode);
  },
  
  markAsWatched: (code: string) => {
    const { watchedEpisodes } = get();
    const newWatched = new Set(watchedEpisodes);
    newWatched.add(code);
    saveWatchedEpisodes(newWatched);
    set({ watchedEpisodes: newWatched });
  },
  
  isWatched: (code: string) => {
    return get().watchedEpisodes.has(code);
  },
  
  clearCache: () => {
    set({ episodes: [] });
  }
}));