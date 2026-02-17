import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './EpisodePlayer.module.scss';
import { useEpisodeStore } from '../../../store/episodeStore';

export default function EpisodePlayer() {
  const { seasonNumber, episodeNumber } = useParams<{
    seasonNumber: string;
    episodeNumber: string;
  }>();
  const navigate = useNavigate();
  const {
    episodes,
    fetchEpisodes,
    getEpisodeBySeasonAndNumber,
    markAsWatched,
    isWatched,
  } = useEpisodeStore();

  const season = seasonNumber ? parseInt(seasonNumber, 10) : null;
  const episodeNum = episodeNumber ? parseInt(episodeNumber, 10) : null;

  const episode =
    season !== null && episodeNum !== null
      ? getEpisodeBySeasonAndNumber(season, episodeNum)
      : null;

  const watched = episode ? isWatched(episode.code) : false;

  useEffect(() => {
    if (episodes.length === 0) {
      fetchEpisodes();
    }
  }, [episodes.length, fetchEpisodes]);

  useEffect(() => {
    if (episode) {
      const capitalizedName = episode.name
        .split(' ')
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ');

      document.title = `Temporada ${episode.season} Episodio ${episode.episode}: ${capitalizedName} | Pokémon Tracker`;
    } else {
      document.title = 'Pokémon Tracker';
    }

    return () => {
      document.title = 'Pokémon Tracker';
    };
  }, [episode]);

  useEffect(() => {
    if (episode && !watched) {
      const timer = setTimeout(() => {
        markAsWatched(episode.code);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [episode, watched, markAsWatched]);

  // Encontrar episodios anterior y siguiente
  const seasonEpisodes = episodes.filter((ep) => ep.season === season);
  const currentIndex = episode
    ? seasonEpisodes.findIndex((ep) => ep.code === episode.code)
    : -1;
  const previousEpisode =
    currentIndex > 0 ? seasonEpisodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex >= 0 && currentIndex < seasonEpisodes.length - 1
      ? seasonEpisodes[currentIndex + 1]
      : null;

  // Colores por temporada
  const seasonColors = [
    '#FF6B6B',
    '#FFB84D',
    '#FFD93D',
    '#6BCF7F',
    '#4ECDC4',
    '#5271FF',
    '#9B59B6',
    '#E91E63',
  ];
  const seasonColor = season
    ? seasonColors[(season - 1) % seasonColors.length]
    : '#5271FF';

  // Nombres de temporadas
  const getSeasonName = (season: number) => {
    const names: Record<number, string> = {
      1: 'Liga Índigo',
      2: 'Las Aventuras en las Islas Naranja',
      3: 'Liga Johto',
      4: 'Maestros Johto',
      5: 'Desafío Hoenn',
      6: 'Liga Hoenn',
    };
    return names[season] || `Temporada ${season}`;
  };

  if (episodes.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>
          No se encontró el episodio (Temporada {season}, Episodio {episodeNum})
        </p>
        <Link
          to={season ? `/season/${season}` : '/'}
          className={styles.backButton}
        >
          Volver
        </Link>
      </div>
    );
  }

  const embedUrl = episode.url;

  return (
    <div className={styles.container}>
      {/* Breadcrumb / Volver */}
      <div className={styles.breadcrumb}>
        <Link to={`/season/${season}`} className={styles.backLink}>
          ← Volver a Temporada {season}
        </Link>
      </div>

      {/* Card principal del episodio */}
      <div
        className={styles.episodeCard}
        style={{ '--season-color': seasonColor } as React.CSSProperties}
      >
        {/* Header del episodio */}
        <div className={styles.episodeHeader}>
          <div className={styles.episodeInfo}>
            <span className={styles.seasonBadge}>
              Temporada {episode.season} · {getSeasonName(episode.season)}
            </span>
            <h1 className={styles.episodeTitle}>Episodio {episode.episode}</h1>
          </div>

          {/* Badges de estado */}
          <div className={styles.badges}>
            <span
              className={`${styles.badge} ${episode.isCanon ? styles.badgeCanon : styles.badgeFiller}`}
            >
              {episode.isCanon
                ? '⚡ Episodio de Historia'
                : '🔄 Episodio de Relleno'}
            </span>

            {episode.isCensored && (
              <span className={`${styles.badge} ${styles.badgeCensored}`}>
                🚫 Censurado
              </span>
            )}

            {watched && (
              <span className={`${styles.badge} ${styles.badgeWatched}`}>
                ✓ Marcar como visto
              </span>
            )}
          </div>
        </div>

        {/* Reproductor de video */}
        <div className={styles.videoWrapper}>
          <div className={styles.videoContainer}>
            <iframe
              src={embedUrl}
              allowFullScreen
              title={`${episode.season}x${episode.episode} - ${episode.name}`}
            />
          </div>
        </div>

        {/* Información del episodio */}
        <div className={styles.episodeDetails}>
          <div className={styles.episodeMeta}>
            <h2 className={styles.episodeName}>{episode.name}</h2>
            <p className={styles.episodeCode}>Código: {episode.code}</p>
          </div>
        </div>
      </div>

      {/* Navegación entre episodios */}
      <div className={styles.navigation}>
        <button
          onClick={() =>
            previousEpisode &&
            navigate(`/season/${season}/episode/${previousEpisode.episode}`)
          }
          disabled={!previousEpisode}
          className={`${styles.navButton} ${styles.navPrev}`}
        >
          <div className={styles.navIcon}>←</div>
          {previousEpisode ? (
            <div className={styles.navContent}>
              <span className={styles.navLabel}>Episodio Anterior</span>
              <span className={styles.navTitle}>
                Episodio {previousEpisode.episode}: {previousEpisode.name}
              </span>
            </div>
          ) : (
            <div className={styles.navContent}>
              <span className={styles.navLabel}>No hay episodio anterior</span>
            </div>
          )}
        </button>

        <div className={styles.navDivider}></div>

        <button
          onClick={() =>
            nextEpisode &&
            navigate(`/season/${season}/episode/${nextEpisode.episode}`)
          }
          disabled={!nextEpisode}
          className={`${styles.navButton} ${styles.navNext}`}
        >
          {nextEpisode ? (
            <div className={styles.navContent}>
              <span className={styles.navLabel}>Siguiente Episodio</span>
              <span className={styles.navTitle}>
                Episodio {nextEpisode.episode}: {nextEpisode.name}
              </span>
            </div>
          ) : (
            <div className={styles.navContent}>
              <span className={styles.navLabel}>No hay siguiente episodio</span>
            </div>
          )}
          <div className={styles.navIcon}>→</div>
        </button>
      </div>
    </div>
  );
}
