// src/utils/pokemonSeasons.ts

import {
  BulbasaurSticker,
  CharmanderSticker,
  SquirtleSticker,
  CharizardSticker,
  LaprasSticker,
  SnorlaxSticker,
  ChikoritaSticker,
  CyndaquilSticker,
  TotodileSticker,
  BayleefSticker,
  HeracrossSticker,
  NoctowlSticker,
  PhanpySticker,
  PikachuSticker,
  MudkipSticker,
  TorchicSticker,
  TreeckoSticker,
  GrovyleSticker,
  SwellowSticker,
  TorkoalSticker,
  CorphishSticker,
  CombuskenSticker,
  GlalieSticker,
  SceptileSticker,
  CharizardS9Sticker,
  SnorlaxS9Sticker,
  PiplupSticker,
  ChimcharSticker,
  TurtwigSticker,
  BuizelSticker,
  MonfernoSticker,
  GrotleSticker,
  InfernapeSticker,
  GliscorSticker,
  GibleSticker,
  TorterraSticker,
  StaraptorSticker,
  OshawottSticker,
  TepigSticker,
  SnivySticker,
  PigniteSticker,
  KrookodileSticker,
  LeavannySticker,
  UnfezantSticker,
  FroakieSticker,
  FennekinSticker,
  ChespinSticker,
  FrogadierSticker,
  TalonflameSticker,
  HawluchaSticker,
  GreninjaSticker,
  NoivernSticker,
  GoodraSticker,
  PopplioSticker,
  LittenSticker,
  RowletSticker,
  LycanrocSticker,
  TorracatSticker,
  IncineroarSticker,
  MelmetalSticker,
  DragoniteSticker,
  GengarSticker,
  LucarioSticker,
  DracovishSticker,
  SirfetchdSticker,
  QuaxlySticker,
  FuecocoSticker,
  SprigatitoSticker,
  QuaxwellSticker,
  FloragatoSticker,
  TerapagosSticker,
  LarvitarSticker,
  InfernapeSticker13,
  SnivySticker16,
  OshawottSticker16,
  RowletSticker21,
  LycanrocSticker22,
  LucarioSticker24,
  LucarioSticker25,
  DracovishSticker25,
  PikachuSticker25,
} from './pokemonStickers';

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

export interface PokemonSticker {
  name: string;
  img: string;
  isStarter: boolean;
}

export const seasonPokemon: Record<number, PokemonSticker[]> = {
  1: [
    { name: 'bulbasaur', img: BulbasaurSticker, isStarter: true },
    { name: 'charmander', img: CharmanderSticker, isStarter: true },
    { name: 'squirtle', img: SquirtleSticker, isStarter: true },
  ],
  2: [
    { name: 'lapras', img: LaprasSticker, isStarter: false },
    { name: 'charizard', img: CharizardSticker, isStarter: true },
    { name: 'snorlax', img: SnorlaxSticker, isStarter: false },
  ],
  3: [
    { name: 'chikorita', img: ChikoritaSticker, isStarter: true },
    { name: 'cyndaquil', img: CyndaquilSticker, isStarter: true },
    { name: 'totodile', img: TotodileSticker, isStarter: true },
  ],
  4: [
    { name: 'bayleef', img: BayleefSticker, isStarter: true },
    { name: 'heracross', img: HeracrossSticker, isStarter: false },
    { name: 'noctowl', img: NoctowlSticker, isStarter: false },
  ],
  5: [
    { name: 'phanpy', img: PhanpySticker, isStarter: false },
    { name: 'pikachu', img: PikachuSticker, isStarter: false },
    { name: 'larvitar', img: LarvitarSticker, isStarter: false },
  ],
  6: [
    { name: 'treecko', img: TreeckoSticker, isStarter: true },
    { name: 'torchic', img: TorchicSticker, isStarter: true },
    { name: 'mudkip', img: MudkipSticker, isStarter: true },
  ],
  7: [
    { name: 'grovyle', img: GrovyleSticker, isStarter: true },
    { name: 'swellow', img: SwellowSticker, isStarter: false },
    { name: 'torkoal', img: TorkoalSticker, isStarter: false },
  ],
  8: [
    { name: 'corphish', img: CorphishSticker, isStarter: false },
    { name: 'combusken', img: CombuskenSticker, isStarter: true },
    { name: 'glalie', img: GlalieSticker, isStarter: false },
  ],
  9: [
    { name: 'sceptile', img: SceptileSticker, isStarter: true },
    { name: 'charizard', img: CharizardS9Sticker, isStarter: true },
    { name: 'snorlax', img: SnorlaxS9Sticker, isStarter: false },
  ],
  10: [
    { name: 'turtwig', img: TurtwigSticker, isStarter: true },
    { name: 'chimchar', img: ChimcharSticker, isStarter: true },
    { name: 'piplup', img: PiplupSticker, isStarter: true },
  ],
  11: [
    { name: 'buizel', img: BuizelSticker, isStarter: false },
    { name: 'monferno', img: MonfernoSticker, isStarter: true },
    { name: 'grotle', img: GrotleSticker, isStarter: true },
  ],
  12: [
    { name: 'infernape', img: InfernapeSticker, isStarter: true },
    { name: 'gliscor', img: GliscorSticker, isStarter: false },
    { name: 'gible', img: GibleSticker, isStarter: false },
  ],
  13: [
    { name: 'torterra', img: TorterraSticker, isStarter: true },
    { name: 'staraptor', img: StaraptorSticker, isStarter: false },
    { name: 'infernape', img: InfernapeSticker13, isStarter: true },
  ],
  14: [
    { name: 'snivy', img: SnivySticker, isStarter: true },
    { name: 'tepig', img: TepigSticker, isStarter: true },
    { name: 'oshawott', img: OshawottSticker, isStarter: true },
  ],
  15: [
    { name: 'pignite', img: PigniteSticker, isStarter: true },
    { name: 'krookodile', img: KrookodileSticker, isStarter: false },
    { name: 'leavanny', img: LeavannySticker, isStarter: false },
  ],
  16: [
    { name: 'oshawott', img: OshawottSticker16, isStarter: true },
    { name: 'snivy', img: SnivySticker16, isStarter: true },
    { name: 'unfezant', img: UnfezantSticker, isStarter: false },
  ],
  17: [
    { name: 'chespin', img: ChespinSticker, isStarter: true },
    { name: 'fennekin', img: FennekinSticker, isStarter: true },
    { name: 'froakie', img: FroakieSticker, isStarter: true },
  ],
  18: [
    { name: 'frogadier', img: FrogadierSticker, isStarter: true },
    { name: 'talonflame', img: TalonflameSticker, isStarter: false },
    { name: 'hawlucha', img: HawluchaSticker, isStarter: false },
  ],
  19: [
    { name: 'greninja', img: GreninjaSticker, isStarter: true },
    { name: 'noivern', img: NoivernSticker, isStarter: false },
    { name: 'goodra', img: GoodraSticker, isStarter: false },
  ],
  20: [
    { name: 'popplio', img: PopplioSticker, isStarter: true },
    { name: 'litten', img: LittenSticker, isStarter: true },
    { name: 'rowlet', img: RowletSticker, isStarter: true },
  ],
  21: [
    { name: 'lycanroc', img: LycanrocSticker, isStarter: false },
    { name: 'torracat', img: TorracatSticker, isStarter: true },
    { name: 'rowlet', img: RowletSticker21, isStarter: true },
  ],
  22: [
    { name: 'incineroar', img: IncineroarSticker, isStarter: true },
    { name: 'melmetal', img: MelmetalSticker, isStarter: false },
    { name: 'lycanroc', img: LycanrocSticker22, isStarter: false },
  ],
  23: [
    { name: 'dragonite', img: DragoniteSticker, isStarter: false },
    { name: 'gengar', img: GengarSticker, isStarter: false },
    { name: 'lucario', img: LucarioSticker, isStarter: false },
  ],
  24: [
    { name: 'dracovish', img: DracovishSticker, isStarter: false },
    { name: 'sirfetchd', img: SirfetchdSticker, isStarter: false },
    { name: 'lucario', img: LucarioSticker24, isStarter: false },
  ],
  25: [
    { name: 'dracovish', img: DracovishSticker25, isStarter: false },
    { name: 'lucario', img: LucarioSticker25, isStarter: false },
    { name: 'pikachu', img: PikachuSticker25, isStarter: false },
  ],
  26: [
    { name: 'sprigatito', img: SprigatitoSticker, isStarter: true },
    { name: 'fuecoco', img: FuecocoSticker, isStarter: true },
    { name: 'quaxly', img: QuaxlySticker, isStarter: true },
  ],
  27: [
    { name: 'quaxwell', img: QuaxwellSticker, isStarter: true },
    { name: 'floragato', img: FloragatoSticker, isStarter: true },
    { name: 'terapagos', img: TerapagosSticker, isStarter: false },
  ],
};
