import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styles from './EpisodePlayer.module.scss';
import { useEpisodeStore } from '../../../store/episodeStore';
import { getSeasonColor, getSeasonName } from '../../../utils/pokemonSeasons';

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
    toggleWatched,
  } = useEpisodeStore();

  const [showControls, setShowControls] = useState(true);

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

      document.title = `${capitalizedName} · T${episode.season}E${episode.episode} | Pokémon Tracker`;
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

  const handleToggleWatched = () => {
    if (episode) {
      toggleWatched(episode.code);
    }
  };

  const goToNext = () => {
    if (nextEpisode) {
      navigate(`/season/${season}/episode/${nextEpisode.episode}`);
    }
  };

  const goToPrevious = () => {
    if (previousEpisode) {
      navigate(`/season/${season}/episode/${previousEpisode.episode}`);
    }
  };

  const toggleControls = () => {
    setShowControls((prev) => !prev);
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
    <div className={styles.fullscreenPlayer}>
      {/* Controles superiores */}
      <div
        className={`${styles.topControls} ${showControls ? styles.visible : ''}`}
      >
        <div className={styles.topLeft}>
          <Link to={`/season/${season}`} className={styles.backButton}>
            <span className={styles.backIcon}>←</span>
            <span className={styles.backText}>Temporada {season}</span>
          </Link>
        </div>

        <div className={styles.topRight}>
          <button
            onClick={handleToggleWatched}
            className={`${styles.watchedButton} ${watched ? styles.active : ''}`}
            title={watched ? 'Marcar como no visto' : 'Marcar como visto'}
          >
            {watched ? '✓' : '○'}
          </button>
        </div>
      </div>

      {/* Switch neumórfico siempre visible */}
      <div className={styles.toggleSwitchContainer}>
        <div
          className={`${styles.toggleSwitch} ${showControls ? styles.on : styles.off}`}
          onClick={toggleControls}
        >
          <div className={styles.switchTrack}>
            <div className={styles.switchThumb}></div>
          </div>
        </div>
      </div>

      {/* Video container - TOTALMENTE LIBRE */}
      <div className={styles.videoWrapper}>
        <iframe
          src={embedUrl}
          allowFullScreen
          title={`${episode.season}x${episode.episode} - ${episode.name}`}
        />
      </div>

      {/* Controles inferiores */}
      <div
        className={`${styles.bottomControls} ${showControls ? styles.visible : ''}`}
      >
        <div className={styles.episodeInfo}>
          <div className={styles.episodeMetadata}>
            <span
              className={styles.seasonLabel}
              style={{ color: getSeasonColor(episode.season) }}
            >
              T{episode.season} · E{episode.episode}
            </span>
            <h1 className={styles.episodeTitle}>{episode.name}</h1>
            <div className={styles.episodeDetails}>
              <span>{getSeasonName(episode.season)}</span>
              <span className={styles.dot}>·</span>
              <span>Ep. absoluto #{episode.absoluteEpisode}</span>
              {episode.isCanon ? (
                <>
                  <span className={styles.dot}>·</span>
                  <span className={styles.badgeInline}>📖 Historia</span>
                </>
              ) : (
                <>
                  <span className={styles.dot}>·</span>
                  <span className={styles.badgeInline}>🔄 Relleno</span>
                </>
              )}
              {episode.isCensored && (
                <>
                  <span className={styles.dot}>·</span>
                  <span className={styles.badgeInline}>🚫 Censurado</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.navigation}>
          <button
            onClick={goToPrevious}
            disabled={!previousEpisode}
            className={styles.navButton}
          >
            <span className={styles.navIcon}>⏮</span>
            <div className={styles.navInfo}>
              <span className={styles.navLabel}>Anterior</span>
              {previousEpisode && (
                <span className={styles.navEpisode}>
                  E{previousEpisode.episode}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={goToNext}
            disabled={!nextEpisode}
            className={styles.navButton}
          >
            <div className={styles.navInfo}>
              <span className={styles.navLabel}>Siguiente</span>
              {nextEpisode && (
                <span className={styles.navEpisode}>
                  E{nextEpisode.episode}
                </span>
              )}
            </div>
            <span className={styles.navIcon}>⏭</span>
          </button>
        </div>
      </div>
    </div>
  );
}
