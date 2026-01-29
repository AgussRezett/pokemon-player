import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpisodeStore } from '../../../store/episodeStore';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import styles from './EpisodeList.module.scss';

export default function EpisodeList() {
  const { episodes, loading, error, fetchEpisodes, isWatched, toggleWatched } =
    useEpisodeStore();

  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  useEffect(() => {
    document.title = 'Listado de Episodios | Pokémon';
    return () => {
      document.title = 'Pokémon';
    };
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

  useEffect(() => {
    if (selectedSeason === null && seasons.length > 0) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons, selectedSeason]);

  const displaySeasons = selectedSeason !== null ? [selectedSeason] : seasons;

  // Manejar toggle individual de episodio
  const handleToggleEpisode = (code: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    toggleWatched(code);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h1>Cargando episodios...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Pokémon - Todos los Episodios</h1>
          <p className={styles.totalEpisodes}>
            Total de episodios: {episodes.length}
          </p>
        </div>
        <ThemeToggle />
      </header>

      <div className={styles.seasonSelector}>
        <h3>Selecciona una temporada:</h3>
        <div className={styles.seasonsGrid}>
          {seasons.map((season) => {
            const seasonEpisodes = episodesBySeason[season];
            const watchedCount = seasonEpisodes.filter((ep) =>
              isWatched(ep.code)
            ).length;
            const totalCount = seasonEpisodes.length;
            const isComplete = watchedCount === totalCount && totalCount > 0;

            return (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`${styles.seasonButton} ${selectedSeason === season ? styles.selected : ''}`}
              >
                Temporada {season}
                <div className={styles.seasonProgress}>
                  {watchedCount}/{totalCount} vistos
                </div>
                {isComplete && <div className={styles.completeBadge}>✓</div>}
              </button>
            );
          })}
        </div>
      </div>

      {displaySeasons.map((season) => {
        const seasonEpisodes = episodesBySeason[season];

        return (
          <section key={season} className={styles.seasonSection}>
            <h2>Temporada {season}</h2>

            <div className={styles.episodesGrid}>
              {seasonEpisodes
                .sort((a, b) => a.episode - b.episode)
                .map((episode) => {
                  const watched = isWatched(episode.code);

                  return (
                    <div
                      key={episode.code}
                      className={`${styles.episodeCard} ${watched ? styles.watched : ''}`}
                    >
                      <Link
                        to={`/episode/${episode.season}/${episode.episode}`}
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          textDecoration: 'none',
                          color: 'inherit',
                          minWidth: 0,
                        }}
                      >
                        {/* {watched && (
                          <div className={styles.watchedIcon}>✓</div>
                        )} */}

                        <div className={styles.episodeContent}>
                          <div className={styles.episodeInfo}>
                            <span className={styles.episodeNumber}>
                              {String(episode.season).padStart(2, '0')}x
                              {String(episode.episode).padStart(2, '0')}
                            </span>

                            <span
                              className={`${styles.badge} ${styles.absoluteBadge}`}
                            >
                              #{episode.absoluteEpisode}
                            </span>

                            <span
                              className={`${styles.badge} ${episode.isCanon ? styles.canonBadge : styles.fillerBadge}`}
                            >
                              {episode.isCanon ? '📖 Historia' : '🔄 Relleno'}
                            </span>

                            {episode.isCensored && (
                              <span
                                className={`${styles.badge} ${styles.censoredBadge}`}
                              >
                                🚫 Censurado
                              </span>
                            )}

                            <span className={styles.separator}>-</span>

                            <span className={styles.episodeName}>
                              {episode.name}
                            </span>
                          </div>

                          <div className={styles.episodeCode}>
                            Código: {episode.code}
                          </div>
                        </div>
                      </Link>

                      {/* Botón de toggle individual */}
                      <div className={styles.episodeActions}>
                        <button
                          onClick={(e) => handleToggleEpisode(episode.code, e)}
                          className={`${styles.toggleButton} ${watched ? styles.watched : ''}`}
                          title={
                            watched
                              ? 'Marcar como no visto'
                              : 'Marcar como visto'
                          }
                          aria-label={
                            watched
                              ? 'Marcar como no visto'
                              : 'Marcar como visto'
                          }
                        >
                          {watched ? '✓' : '○'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
