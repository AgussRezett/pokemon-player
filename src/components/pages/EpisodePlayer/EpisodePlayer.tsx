import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEpisodeStore } from '../../../store/episodeStore';
import ThemeToggle from '../../../components/ThemeToggle/ThemeToggle';
import styles from './EpisodePlayer.module.scss';

export default function EpisodePlayer() {
  const { season: seasonParam, episode: episodeParam } = useParams<{ season: string; episode: string }>();
  const navigate = useNavigate();
  const { episodes, fetchEpisodes, getEpisodeBySeasonAndNumber, markAsWatched, isWatched } = useEpisodeStore();

  const season = seasonParam ? parseInt(seasonParam, 10) : null;
  const episodeNum = episodeParam ? parseInt(episodeParam, 10) : null;

  const episode = season !== null && episodeNum !== null
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
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

      document.title = `Temporada ${episode.season} Capítulo ${episode.episode}: ${capitalizedName} | Pokémon`;
    } else {
      document.title = 'Pokémon';
    }

    return () => {
      document.title = 'Pokémon';
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

  const currentIndex = episode ? episodes.findIndex(ep => ep.code === episode.code) : -1;
  const previousEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex >= 0 && currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  if (episodes.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <Link to="/">← Volver al listado</Link>
        <h1>Cargando...</h1>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className={styles.errorContainer}>
        <Link to="/">← Volver al listado</Link>
        <h1>Error</h1>
        <p>No se encontró el episodio (Temporada {season}, Episodio {episodeNum})</p>
      </div>
    );
  }

  const embedUrl = episode.url;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.backLink}>
          ← Volver al listado
        </Link>

        <div className={styles.badges}>
          <ThemeToggle />

          <div className={`${styles.badge} ${episode.isCanon ? styles.canonBadge : styles.fillerBadge}`}>
            {episode.isCanon ? '📖 Historia' : '🔄 Relleno'}
          </div>

          {episode.isCensored && (
            <div className={`${styles.badge} ${styles.censoredBadge}`}>
              🚫 Censurado
            </div>
          )}

          {watched && (
            <div className={`${styles.badge} ${styles.watchedBadge}`}>
              <span>✓</span>
              Ya visto
            </div>
          )}
        </div>
      </header>

      <h1 className={styles.title}>
        {String(episode.season).padStart(2, '0')}X{String(episode.episode).padStart(2, '0')} -{' '}
        <span className={styles.episodeName}>{episode.name}</span>
      </h1>

      <div className={styles.metadata}>
        <span>Temporada {episode.season}, Episodio {episode.episode}</span>
        <span className={styles.absoluteBadge}>
          Episodio Absoluto #{episode.absoluteEpisode}
        </span>
      </div>

      <div className={styles.videoContainer}>
        <iframe
          src={embedUrl}
          allowFullScreen
          title={`${episode.season}x${episode.episode} - ${episode.name}`}
        />
      </div>

      <div className={styles.detailsCard}>
        <h3>Detalles del Episodio</h3>
        <p><strong>Código:</strong> {episode.code}</p>
        <p><strong>Temporada:</strong> {episode.season}</p>
        <p><strong>Episodio:</strong> {episode.episode}</p>
        <p><strong>Episodio Absoluto:</strong> #{episode.absoluteEpisode}</p>
        <p>
          <strong>Nombre:</strong>
          <span style={{ textTransform: 'capitalize' }}> {episode.name}</span>
        </p>
        <p>
          <strong>Tipo:</strong>{' '}
          <span className={`${styles.detailBadge} ${episode.isCanon ? styles.canonBadge : styles.fillerBadge}`}>
            {episode.isCanon ? '📖 Historia (Canon)' : '🔄 Relleno (Filler)'}
          </span>
          {episode.isCensored && (
            <>
              {' '}
              <span className={`${styles.detailBadge} ${styles.censoredBadge}`}>
                🚫 Censurado
              </span>
            </>
          )}
        </p>
        <p>
          <strong>Estado:</strong>{' '}
          {watched ? (
            <span style={{ color: 'var(--success-text)', fontWeight: 'bold' }}>✓ Visto</span>
          ) : (
            <span style={{ color: 'var(--text-tertiary)' }}>Se marcará como visto en 10 segundos...</span>
          )}
        </p>
      </div>

      <nav className={styles.navigation}>
        <button
          onClick={() => previousEpisode && navigate(`/episode/${previousEpisode.season}/${previousEpisode.episode}`)}
          disabled={!previousEpisode}
          className={styles.navButton}
        >
          {previousEpisode ? (
            <>
              <span className={styles.navLabel}>← Episodio Anterior</span>
              <span className={styles.navInfo}>
                {String(previousEpisode.season).padStart(2, '0')}x{String(previousEpisode.episode).padStart(2, '0')} -{' '}
                <span className={styles.navEpisodeName}>{previousEpisode.name}</span>
              </span>
            </>
          ) : (
            <span className={styles.navLabel}>No hay episodio anterior</span>
          )}
        </button>

        <button
          onClick={() => nextEpisode && navigate(`/episode/${nextEpisode.season}/${nextEpisode.episode}`)}
          disabled={!nextEpisode}
          className={styles.navButton}
        >
          {nextEpisode ? (
            <>
              <span className={styles.navLabel}>Siguiente Episodio →</span>
              <span className={styles.navInfo}>
                {String(nextEpisode.season).padStart(2, '0')}x{String(nextEpisode.episode).padStart(2, '0')} -{' '}
                <span className={styles.navEpisodeName}>{nextEpisode.name}</span>
              </span>
            </>
          ) : (
            <span className={styles.navLabel}>No hay siguiente episodio</span>
          )}
        </button>
      </nav>
    </div>
  );
}