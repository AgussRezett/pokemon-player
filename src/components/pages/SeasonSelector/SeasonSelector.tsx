import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SeasonSelector.module.scss';
import { useEpisodeStore } from '../../../store/episodeStore';
import {
  getSeasonColor,
  getSeasonName,
  seasonPokemon,
} from '../../../utils/pokemonSeasons';

// Configuración de Pokémon por temporada

export default function SeasonSelector() {
  const { episodes, loading, error, fetchEpisodes, isWatched } =
    useEpisodeStore();

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  useEffect(() => {
    document.title = 'Temporadas de Pokémon | Pokémon Tracker';
  }, []);

  const episodesBySeason = episodes.reduce(
    (acc, episode) => {
      if (!acc[episode.season]) {
        acc[episode.season] = [];
      }
      acc[episode.season].push(episode);
      return acc;
    },
    {} as Record<number, typeof episodes>
  );

  const seasons = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <h2>Cargando temporadas...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.seasonsGrid}>
        {seasons.map((season) => {
          const seasonEpisodes = episodesBySeason[season];
          const totalEpisodes = seasonEpisodes.length;
          const watchedCount = seasonEpisodes.filter((ep) =>
            isWatched(ep.code)
          ).length;
          const fillerCount = seasonEpisodes.filter((ep) => !ep.isCanon).length;
          const progress = Math.round((watchedCount / totalEpisodes) * 100);
          const pokemons = seasonPokemon[season] || [];

          return (
            <Link
              key={season}
              to={`/season/${season}`}
              className={styles.seasonCard}
              style={
                {
                  '--season-color': getSeasonColor(season),
                } as React.CSSProperties
              }
            >
              {/* Header con color de temporada */}
              <div
                className={styles.seasonHeader}
                style={{ background: getSeasonColor(season) }}
              >
                <h2>Temporada {season}</h2>
              </div>

              {/* Body con Pokémon */}
              <div className={styles.seasonBody}>
                <h3 className={styles.seasonName}>{getSeasonName(season)}</h3>

                {/* Pokémon Stickers */}
                {pokemons.length > 0 && (
                  <div className={styles.pokemonStickers}>
                    {pokemons.map((pokemon, index) => (
                      <div
                        key={pokemon.name}
                        className={styles.stickerWrapper}
                        style={
                          {
                            '--sticker-delay': `${index * 0.1}s`,
                            '--sticker-rotation': `${(index - 1) * 8}deg`,
                          } as React.CSSProperties
                        }
                      >
                        <img
                          src={pokemon.img}
                          alt={pokemon.name}
                          className={styles.pokemonSticker}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress */}
                <div className={styles.progressSection}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Progreso</span>
                    <span className={styles.progressPercent}>{progress}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${progress}%`,
                        background: getSeasonColor(season),
                      }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Episodios</span>
                    <span className={styles.statValue}>
                      {watchedCount} / {totalEpisodes}
                    </span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Relleno</span>
                    <span className={styles.statValue}>{fillerCount}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
