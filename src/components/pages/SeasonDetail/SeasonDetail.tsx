import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SeasonDetail.module.scss';
import { useEpisodeStore } from '../../../store/episodeStore';

type FilterWatched = 'all' | 'watched' | 'unwatched';
type FilterType = 'all' | 'canon' | 'filler' | 'censored';

export default function SeasonDetail() {
  const { seasonNumber } = useParams<{ seasonNumber: string }>();
  const { episodes, loading, fetchEpisodes, isWatched, toggleWatched } = useEpisodeStore();

  const [filterWatched, setFilterWatched] = useState<FilterWatched>('all');
  const [filterType, setFilterType] = useState<FilterType>('all');

  const season = seasonNumber ? parseInt(seasonNumber, 10) : null;

  useEffect(() => {
    if (episodes.length === 0) {
      fetchEpisodes();
    }
  }, [episodes.length, fetchEpisodes]);

  useEffect(() => {
    if (season) {
      document.title = `Temporada ${season} | Pokémon Tracker`;
    }
  }, [season]);

  if (!season) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>Temporada no válida</p>
        <Link to="/" className={styles.backButton}>Volver a temporadas</Link>
      </div>
    );
  }

  const seasonEpisodes = episodes.filter(ep => ep.season === season);

  if (loading || seasonEpisodes.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <h2>Cargando episodios...</h2>
      </div>
    );
  }

  // Estadísticas
  const totalEpisodes = seasonEpisodes.length;
  const watchedCount = seasonEpisodes.filter(ep => isWatched(ep.code)).length;
  const canonCount = seasonEpisodes.filter(ep => ep.isCanon).length;
  const fillerCount = seasonEpisodes.filter(ep => !ep.isCanon).length;
  const progress = Math.round((watchedCount / totalEpisodes) * 100);

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

  // Colores por temporada
  const seasonColors = [
    '#FF6B6B', '#FFB84D', '#FFD93D', '#6BCF7F',
    '#4ECDC4', '#5271FF', '#9B59B6', '#E91E63'
  ];
  const seasonColor = seasonColors[(season - 1) % seasonColors.length];

  // Filtrar episodios
  const filteredEpisodes = seasonEpisodes.filter(episode => {
    // Filtro de visto/no visto
    if (filterWatched === 'watched' && !isWatched(episode.code)) return false;
    if (filterWatched === 'unwatched' && isWatched(episode.code)) return false;

    // Filtro de tipo
    if (filterType === 'canon' && !episode.isCanon) return false;
    if (filterType === 'filler' && episode.isCanon) return false;
    if (filterType === 'censored' && !episode.isCensored) return false;

    return true;
  });

  const handleToggleEpisode = (code: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWatched(code);
  };

  return (
    <div className={styles.container}>
      {/* Header con botón de volver */}
      <div className={styles.backNav}>
        <Link to="/" className={styles.backLink}>
          ← Volver a Temporadas
        </Link>
      </div>

      {/* Card de información de temporada */}
      <div
        className={styles.seasonCard}
        style={{ '--season-color': seasonColor } as React.CSSProperties}
      >
        <div className={styles.seasonHeader}>
          <div>
            <h1>Temporada {season}</h1>
            <p>{getSeasonName(season)}</p>
          </div>
        </div>

        {/* Estadísticas */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Vistos</span>
            <span className={styles.statValue}>{watchedCount}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Faltantes</span>
            <span className={styles.statValue}>{totalEpisodes - watchedCount}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Historia</span>
            <span className={styles.statValue}>{canonCount}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Relleno</span>
            <span className={styles.statValue}>{fillerCount}</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progreso General</span>
            <span className={styles.progressPercent}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${progress}%`,
                background: seasonColor
              }}
            />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filtersCard}>
        <div className={styles.filterIcon}>🔍</div>
        <h3>Filtros</h3>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Estado de visualización</label>
          <div className={styles.filterButtons}>
            <button
              onClick={() => setFilterWatched('all')}
              className={`${styles.filterButton} ${filterWatched === 'all' ? styles.active : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterWatched('watched')}
              className={`${styles.filterButton} ${filterWatched === 'watched' ? styles.active : ''}`}
            >
              👁️ Vistos
            </button>
            <button
              onClick={() => setFilterWatched('unwatched')}
              className={`${styles.filterButton} ${filterWatched === 'unwatched' ? styles.active : ''}`}
            >
              🚫 No vistos
            </button>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tipo de episodio</label>
          <div className={styles.filterButtons}>
            <button
              onClick={() => setFilterType('canon')}
              className={`${styles.filterButton} ${styles.canon} ${filterType === 'canon' ? styles.active : ''}`}
            >
              Historia
            </button>
            <button
              onClick={() => setFilterType('filler')}
              className={`${styles.filterButton} ${styles.filler} ${filterType === 'filler' ? styles.active : ''}`}
            >
              Relleno
            </button>
            <button
              onClick={() => setFilterType('censored')}
              className={`${styles.filterButton} ${styles.censored} ${filterType === 'censored' ? styles.active : ''}`}
            >
              Censurado
            </button>
          </div>
        </div>

        {(filterWatched !== 'all' || filterType !== 'all') && (
          <button
            onClick={() => {
              setFilterWatched('all');
              setFilterType('all');
            }}
            className={styles.clearFilters}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Contador de resultados */}
      <div className={styles.resultsCount}>
        Mostrando {filteredEpisodes.length} de {totalEpisodes} episodios
      </div>

      {/* Lista de episodios */}
      <div className={styles.episodesList}>
        {filteredEpisodes.length === 0 ? (
          <div className={styles.noResults}>
            <p>No se encontraron episodios con los filtros seleccionados</p>
          </div>
        ) : (
          filteredEpisodes
            .sort((a, b) => a.episode - b.episode)
            .map((episode) => {
              const watched = isWatched(episode.code);

              return (
                <div
                  key={episode.code}
                  className={`${styles.episodeCard} ${watched ? styles.watched : ''}`}
                >
                  {/* Número del episodio en círculo */}
                  <div
                    className={styles.episodeNumber}
                    style={{ background: seasonColor }}
                  >
                    {episode.absoluteEpisode}
                  </div>

                  {/* Contenido del episodio */}
                  <div className={styles.episodeContent}>
                    <h4 className={styles.episodeTitle}>
                      Episodio {episode.episode}: {episode.name}
                    </h4>

                    <div className={styles.episodeMeta}>
                      <span
                        className={`${styles.badge} ${episode.isCanon ? styles.badgeCanon : styles.badgeFiller}`}
                      >
                        {episode.isCanon ? '📖 Historia' : '🔄 Relleno'}
                      </span>

                      {episode.isCensored && (
                        <span className={`${styles.badge} ${styles.badgeCensored}`}>
                          🚫 Censurado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón de marcar visto */}
                  <button
                    onClick={(e) => handleToggleEpisode(episode.code, e)}
                    className={`${styles.watchButton} ${watched ? styles.watched : ''}`}
                    title={watched ? 'Marcar como no visto' : 'Marcar como visto'}
                  >
                    {watched ? '✓' : '○'}
                  </button>

                  {/* Botón de ver */}
                  <Link
                    to={`/season/${season}/episode/${episode.episode}`}
                    className={styles.watchLink}
                  >
                    ▶ Ver
                  </Link>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}