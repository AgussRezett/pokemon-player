// src/utils/pokemonSeasons.ts

// 🎨 Color representativo por temporada (1–27)
export const SEASON_COLORS: Record<number, string> = {
  1: '#E53935', // Liga Índigo (Rojo Kanto)
  2: '#FB8C00', // Islas Naranja
  3: '#FDD835', // Liga Johto (Dorado)
  4: '#C0A000', // Campeones Johto (Oro más intenso)
  5: '#43A047', // Búsqueda del Maestro (Johto verde)
  6: '#00897B', // Fuerza Máxima (Hoenn tropical)
  7: '#00ACC1', // Reto Máximo
  8: '#1E88E5', // Batalla Avanzada
  9: '#1565C0', // Batalla de la Frontera (Azul profundo)
  10: '#5E35B1', // Diamante y Perla (Sinnoh violeta frío)
  11: '#3949AB', // Batalla Dimensión
  12: '#283593', // Galactic Battles (Oscuro galáctico)
  13: '#64B5F6', // Liga Sinnoh (Azul hielo)
  14: '#424242', // Blanco y Negro
  15: '#000000', // Rivales del Destino
  16: '#B71C1C', // Aventuras en Teselia
  17: '#EC407A', // XY (Rosa energético)
  18: '#D81B60', // Desafío en Kalos
  19: '#8E24AA', // XYZ
  20: '#F4511E', // Sol y Luna (Naranja solar)
  21: '#FFB300', // Ultraaventuras
  22: '#6D4C41', // Ultraleyendas
  23: '#26A69A', // Viajes Pokémon
  24: '#2E7D32', // Viajes Maestros
  25: '#1B5E20', // Viajes Definitivos
  26: '#7E57C2', // Horizontes
  27: '#512DA8', // Horizontes – La Serie (más profundo)
};

export const getSeasonColor = (season: number): string => {
  return SEASON_COLORS[season] ?? '#999999';
};

// 🏷️ Nombres oficiales en español (1–27)
export const SEASON_NAMES: Record<number, string> = {
  1: 'Liga Índigo',
  2: 'Las Aventuras en las Islas Naranja',
  3: 'Liga Johto',
  4: 'Campeones de la Liga Johto',
  5: 'Búsqueda del Maestro',
  6: 'Fuerza Máxima',
  7: 'Reto Máximo',
  8: 'Batalla Avanzada',
  9: 'Batalla de la Frontera',
  10: 'Diamante y Perla',
  11: 'Batalla Dimensión',
  12: 'Galactic Battles',
  13: 'Los Vencedores de la Liga Sinnoh',
  14: 'Blanco y Negro',
  15: 'Rivales del Destino',
  16: 'Aventuras en Teselia',
  17: 'XY',
  18: 'XY: Desafío en Kalos',
  19: 'XYZ',
  20: 'Sol y Luna',
  21: 'Ultraaventuras',
  22: 'Ultraleyendas',
  23: 'Viajes Pokémon',
  24: 'Viajes Maestros',
  25: 'Viajes Definitivos',
  26: 'Horizontes',
  27: 'Horizontes – La Serie',
};

// 🏷️ Devuelve nombre oficial
export const getSeasonName = (season: number): string => {
  return SEASON_NAMES[season] ?? `Temporada ${season}`;
};
