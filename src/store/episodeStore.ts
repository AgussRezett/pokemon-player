import { create } from 'zustand';
import EPISODES_JSON from '../data/urls.json';

interface Episode {
  code: string;
  season: number;
  episode: number;
  name: string;
  url: string;
}

interface EpisodeStore {
  episodes: Episode[];
  loading: boolean;
  error: string | null;
  fetchEpisodes: () => Promise<void>;
  getEpisodeByCode: (code: string) => Episode | undefined;
  clearCache: () => void;
}

// Función para parsear la URL y extraer información del episodio
const parseEpisodeUrl = (url: string): Episode | null => {
  // Ejemplo: https://pokemonlaserielatino.com/e/cjf5ris0pb15/01x01-pokemón-yo-te-elijo-1080p
  const regex = /\/e\/([^/]+)\/(\d+)x(\d+)-(.+)-1080p/;
  const match = url.match(regex);
  
  if (!match) return null;
  
  const [, code, season, episode, name] = match;
  
  return {
    code,
    season: parseInt(season, 10),
    episode: parseInt(episode, 10),
    name: name.replace(/-/g, ' '),
    url
  };
};

export const useEpisodeStore = create<EpisodeStore>((set, get) => ({
  // Estado
  episodes: [],
  loading: false,
  error: null,
  
  // Acciones
  fetchEpisodes: async () => {
    // Si ya tenemos episodios cacheados, no volver a buscar
    if (get().episodes.length > 0) {
      return;
    }
    
    set({ loading: true, error: null });
    
    try {
      const urls: string[] = EPISODES_JSON;
      const parsedEpisodes = urls
        .map(parseEpisodeUrl)
        .filter((ep): ep is Episode => ep !== null);
      
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
  
  clearCache: () => {
    set({ episodes: [] });
  }
}));