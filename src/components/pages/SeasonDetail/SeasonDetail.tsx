import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SeasonDetail.module.scss';
import { useEpisodeStore } from '../../../store/episodeStore';
import { getSeasonColor, getSeasonName } from '../../../utils/pokemonSeasons';

export default function SeasonDetail() {
  const { seasonNumber } = useParams<{ seasonNumber: string }>();
  const { episodes, loading, fetchEpisodes, isWatched, toggleWatched } =
    useEpisodeStore();

  // Cambiar a arrays para permitir múltiples selecciones
  const [filterWatched, setFilterWatched] = useState<
    ('watched' | 'unwatched')[]
  >([]);
  const [filterType, setFilterType] = useState<
    ('canon' | 'filler' | 'censored')[]
  >([]);

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
        <Link to="/" className={styles.backButton}>
          Volver a temporadas
        </Link>
      </div>
    );
  }

  const seasonEpisodes = episodes.filter((ep) => ep.season === season);

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
  const watchedCount = seasonEpisodes.filter((ep) => isWatched(ep.code)).length;
  const canonCount = seasonEpisodes.filter((ep) => ep.isCanon).length;
  const fillerCount = seasonEpisodes.filter((ep) => !ep.isCanon).length;
  const progress = Math.round((watchedCount / totalEpisodes) * 100);

  // Funciones de toggle para filtros tipo checkbox
  const toggleFilterWatched = (filter: 'watched' | 'unwatched') => {
    setFilterWatched((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleFilterType = (filter: 'canon' | 'filler' | 'censored') => {
    setFilterType((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setFilterWatched([]);
    setFilterType([]);
  };

  // Filtrar episodios con lógica OR (mostrar si cumple CUALQUIERA de los filtros activos)
  const filteredEpisodes = seasonEpisodes.filter((episode) => {
    // Si no hay filtros de visto/no visto activos, mostrar todos
    let passesWatchedFilter = true;
    if (filterWatched.length > 0) {
      passesWatchedFilter = filterWatched.some((filter) => {
        if (filter === 'watched') return isWatched(episode.code);
        if (filter === 'unwatched') return !isWatched(episode.code);
        return false;
      });
    }

    // Si no hay filtros de tipo activos, mostrar todos
    let passesTypeFilter = true;
    if (filterType.length > 0) {
      passesTypeFilter = filterType.some((filter) => {
        if (filter === 'canon') return episode.isCanon;
        if (filter === 'filler') return !episode.isCanon;
        if (filter === 'censored') return episode.isCensored;
        return false;
      });
    }

    return passesWatchedFilter && passesTypeFilter;
  });

  const handleToggleEpisode = (code: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWatched(code);
  };

  const areFiltersActive = filterWatched.length > 0 || filterType.length > 0;

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
        style={
          { '--season-color': getSeasonColor(season) } as React.CSSProperties
        }
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
            <span className={styles.statValue}>
              {totalEpisodes - watchedCount}
            </span>
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
                background: getSeasonColor(season),
              }}
            />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Estado de visualización
              {filterWatched.length > 0 && (
                <span className={styles.filterCount}>
                  ({filterWatched.length})
                </span>
              )}
            </label>
            <div className={styles.filterButtons}>
              <button
                onClick={() => toggleFilterWatched('watched')}
                className={`${styles.filterButton} ${filterWatched.includes('watched') ? styles.active : ''}`}
              >
                {filterWatched.includes('watched') && (
                  <span className={styles.checkmark}>✓</span>
                )}
                👁️ Vistos
              </button>
              <button
                onClick={() => toggleFilterWatched('unwatched')}
                className={`${styles.filterButton} ${filterWatched.includes('unwatched') ? styles.active : ''}`}
              >
                {filterWatched.includes('unwatched') && (
                  <span className={styles.checkmark}>✓</span>
                )}
                🚫 No vistos
              </button>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>
              Tipo de episodio
              {filterType.length > 0 && (
                <span className={styles.filterCount}>{filterType.length}</span>
              )}
            </label>
            <div className={styles.filterButtons}>
              <button
                onClick={() => toggleFilterType('canon')}
                className={`${styles.filterButton} ${styles.canon} ${filterType.includes('canon') ? styles.active : ''}`}
              >
                {filterType.includes('canon') && (
                  <span className={styles.checkmark}>✓</span>
                )}
                Historia
              </button>
              <button
                onClick={() => toggleFilterType('filler')}
                className={`${styles.filterButton} ${styles.filler} ${filterType.includes('filler') ? styles.active : ''}`}
              >
                {filterType.includes('filler') && (
                  <span className={styles.checkmark}>✓</span>
                )}
                Relleno
              </button>
              <button
                onClick={() => toggleFilterType('censored')}
                className={`${styles.filterButton} ${styles.censored} ${filterType.includes('censored') ? styles.active : ''}`}
              >
                {filterType.includes('censored') && (
                  <span className={styles.checkmark}>✓</span>
                )}
                Censurado
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className={styles.resultsCount}>
        Mostrando {filteredEpisodes.length} de {totalEpisodes} episodios
        {areFiltersActive && (
          <button onClick={clearAllFilters} className={styles.clearFiltersText}>
            · Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista de episodios */}
      <div className={styles.episodesList}>
        {filteredEpisodes.length === 0 ? (
          <div className={styles.noResults}>
            <p>No se encontraron episodios con los filtros seleccionados</p>
            <button
              onClick={clearAllFilters}
              className={styles.clearFiltersButton}
            >
              Limpiar filtros
            </button>
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
                    style={{ background: getSeasonColor(season) }}
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
                        <span
                          className={`${styles.badge} ${styles.badgeCensored}`}
                        >
                          🚫 Censurado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botón de marcar visto */}
                  <button
                    onClick={(e) => handleToggleEpisode(episode.code, e)}
                    className={`${styles.watchButton} ${watched ? styles.watched : ''}`}
                    title={
                      watched ? 'Marcar como no visto' : 'Marcar como visto'
                    }
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
