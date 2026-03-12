import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './SeasonDetail.module.scss';
import { useEpisodeStore } from '../../../store/episodeStore';
import {
  getSeasonColor,
  getSeasonName,
  seasonPokemon,
} from '../../../utils/pokemonSeasons';
import Pokeball from '../../Pokeball/Pokeball';
import PageTransition from '../../PageTransition/PageTransition';
import {
  BookOpenTextIcon,
  CheckIcon,
  CircleIcon,
  LightningIcon,
  LockKeyIcon,
  PlayIcon,
  ProhibitIcon,
  RepeatIcon,
  StarIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useSounds } from '../../../hooks/useSounds';

interface CapturedPokemon {
  name: string;
  img: string;
  debutEpisode: number;
}

export default function SeasonDetail() {
  const { seasonNumber } = useParams<{ seasonNumber: string }>();
  const { episodes, loading, fetchEpisodes, isWatched, toggleWatched } =
    useEpisodeStore();
  const { play } = useSounds();

  const [filterWatched, setFilterWatched] = useState<
    ('watched' | 'unwatched')[]
  >([]);
  const [filterType, setFilterType] = useState<
    ('canon' | 'filler' | 'censored')[]
  >([]);
  const [capturedPokemon, setCapturedPokemon] =
    useState<CapturedPokemon | null>(null);
  const [showCaptureAnimation, setShowCaptureAnimation] = useState(false);

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

  const totalEpisodes = seasonEpisodes.length;
  const watchedCount = seasonEpisodes.filter((ep) => isWatched(ep.code)).length;
  const canonCount = seasonEpisodes.filter((ep) => ep.isCanon).length;
  const fillerCount = seasonEpisodes.filter((ep) => !ep.isCanon).length;
  const progress = Math.round((watchedCount / totalEpisodes) * 100);

  const seasonColor = getSeasonColor(season);
  const pokemons = seasonPokemon[season] || [];

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

  const clearAllFilters = () => {
    setFilterWatched([]);
    setFilterType([]);
  };

  const filteredEpisodes = seasonEpisodes.filter((episode) => {
    let passesWatchedFilter = true;
    if (filterWatched.length > 0) {
      passesWatchedFilter = filterWatched.some((filter) => {
        if (filter === 'watched') return isWatched(episode.code);
        if (filter === 'unwatched') return !isWatched(episode.code);
        return false;
      });
    }

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

    const episode = episodes.find((ep) => ep.code === code);
    if (!episode) return;

    const wasWatched = isWatched(code);

    // Solo mostrar captura si estamos MARCANDO como visto (no desmarcando)
    if (!wasWatched) {
      play('claim');
      // Verificar si este episodio es debut de algún Pokémon
      const debutPokemon = pokemons.find(
        (p) => p.debutEpisode === episode.absoluteEpisode
      );

      if (debutPokemon) {
        play('unlock');
        // Mostrar modal de captura
        setCapturedPokemon({
          name: debutPokemon.name,
          img: debutPokemon.img,
          debutEpisode: debutPokemon.debutEpisode,
        });
      }
    } else {
      play('back');
    }

    toggleWatched(code);
  };

  const handleCapturePokemon = () => {
    play('claim');
    setShowCaptureAnimation(true);

    // Después de la animación, cerrar el modal
    setTimeout(() => {
      setShowCaptureAnimation(false);
      setCapturedPokemon(null);
    }, 2000);
  };

  const areFiltersActive = filterWatched.length > 0 || filterType.length > 0;

  const seasonAbsoluteStart = seasonEpisodes[0]?.absoluteEpisode || 0;
  const seasonAbsoluteEnd =
    seasonEpisodes[seasonEpisodes.length - 1]?.absoluteEpisode || 0;
  const seasonTotalRange = seasonAbsoluteEnd - seasonAbsoluteStart + 1;

  return (
    <PageTransition>
      <div className={styles.container}>
        <div className={styles.backNav}>
          <Link to="/" className={styles.backLink} onClick={() => play('back')}>
            <XIcon size={16} weight="bold" /> Volver a Temporadas
          </Link>
        </div>

        <div
          className={styles.seasonCard}
          style={{ '--season-color': seasonColor } as React.CSSProperties}
          id="pokemon-header"
        >
          <div className={styles.seasonHeader}>
            <div className={styles.headerContent}>
              <h1>Temporada {season}</h1>
              <p>{getSeasonName(season)}</p>
            </div>

            {pokemons.length > 0 && (
              <div className={styles.pokemonStickers}>
                {pokemons.map((pokemon, index) => {
                  const debutEpisode = episodes.find(
                    (ep) => ep.absoluteEpisode === pokemon.debutEpisode
                  );
                  const isUnlocked = debutEpisode
                    ? isWatched(debutEpisode.code)
                    : false;

                  return (
                    <div
                      key={pokemon.name}
                      className={`${styles.stickerWrapper} ${!isUnlocked ? styles.locked : ''}`}
                      style={
                        {
                          '--sticker-delay': `${index * 0.1}s`,
                          '--sticker-rotation': `${(index - 1) * 12}deg`,
                        } as React.CSSProperties
                      }
                      id={`pokemon-${pokemon.name}`}
                    >
                      <img
                        src={pokemon.img}
                        alt={isUnlocked ? pokemon.name : '???'}
                        className={styles.pokemonSticker}
                      />
                      {!isUnlocked && (
                        <div className={styles.lockIcon}>
                          <LockKeyIcon size={14} weight="fill" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Progreso General</span>
              <span className={styles.progressPercent}>{progress}%</span>
            </div>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${progress}%`,
                    background: seasonColor,
                  }}
                />
              </div>

              {pokemons.map((pokemon) => {
                const debutPosition =
                  ((pokemon.debutEpisode - seasonAbsoluteStart) /
                    seasonTotalRange) *
                  100;

                const isInThisSeason =
                  pokemon.debutEpisode >= seasonAbsoluteStart &&
                  pokemon.debutEpisode <= seasonAbsoluteEnd;

                if (!isInThisSeason) return null;

                const debutEpisode = episodes.find(
                  (ep) => ep.absoluteEpisode === pokemon.debutEpisode
                );
                const isUnlocked = debutEpisode
                  ? isWatched(debutEpisode.code)
                  : false;

                return (
                  <div
                    key={pokemon.name}
                    className={`${styles.pokemonMarker} ${isUnlocked ? styles.unlocked : ''}`}
                    style={{
                      left: `${Math.max(0, Math.min(100, debutPosition))}%`,
                    }}
                    title={`${pokemon.name} - Ep. ${pokemon.debutEpisode}`}
                  >
                    <div className={styles.markerLine} />
                    <div className={styles.markerIcon}>
                      {isUnlocked ? (
                        <StarIcon size={12} weight="fill" color="yellow" />
                      ) : (
                        <LockKeyIcon size={12} weight="fill" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.filtersCard}>
          <div className={styles.filtersContainer}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                Estado de visualización
                {filterWatched.length > 0 && (
                  <span className={styles.filterCount}>
                    {filterWatched.length}
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
                  Vistos
                </button>
                <button
                  onClick={() => toggleFilterWatched('unwatched')}
                  className={`${styles.filterButton} ${filterWatched.includes('unwatched') ? styles.active : ''}`}
                >
                  {filterWatched.includes('unwatched') && (
                    <span className={styles.checkmark}>✓</span>
                  )}
                  No vistos
                </button>
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>
                Tipo de episodio
                {filterType.length > 0 && (
                  <span className={styles.filterCount}>
                    {filterType.length}
                  </span>
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

        <div className={styles.resultsCount}>
          Mostrando {filteredEpisodes.length} de {totalEpisodes} episodios
          {areFiltersActive && (
            <button
              onClick={clearAllFilters}
              className={styles.clearFiltersText}
            >
              · Limpiar filtros
            </button>
          )}
        </div>

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
                const debutPokemon = pokemons.find(
                  (p) => p.debutEpisode === episode.absoluteEpisode
                );

                return (
                  <div
                    key={episode.code}
                    className={`${styles.episodeCard} ${watched ? styles.watched : ''} ${debutPokemon ? styles.hasDebut : ''}`}
                  >
                    <div
                      className={styles.episodeNumber}
                      style={{ background: seasonColor }}
                    >
                      {episode.absoluteEpisode}
                    </div>

                    {/* Silueta de Pokémon debut */}
                    {debutPokemon && (
                      <div
                        className={`${styles.debutPokemon} ${watched ? styles.unlocked : ''}`}
                      >
                        <img
                          src={debutPokemon.img}
                          alt={watched ? debutPokemon.name : '???'}
                          className={styles.debutSticker}
                        />
                        {!watched && (
                          <div className={styles.debutLock}>
                            <LockKeyIcon size={14} weight="fill" />
                          </div>
                        )}
                      </div>
                    )}

                    <div className={styles.episodeContent}>
                      <h4 className={styles.episodeTitle}>
                        Episodio {episode.episode}: {episode.name}
                      </h4>

                      <div className={styles.episodeMeta}>
                        <span
                          className={`${styles.badge} ${episode.isCanon ? styles.badgeCanon : styles.badgeFiller}`}
                        >
                          {episode.isCanon ? (
                            <>
                              <BookOpenTextIcon size={14} weight="fill" />{' '}
                              Historia
                            </>
                          ) : (
                            <>
                              <RepeatIcon size={14} weight="fill" /> Relleno
                            </>
                          )}
                        </span>

                        {episode.isCensored && (
                          <span
                            className={`${styles.badge} ${styles.badgeCensored}`}
                          >
                            <ProhibitIcon size={14} weight="fill" /> Censurado
                          </span>
                        )}

                        {debutPokemon && (
                          <span
                            className={`${styles.badge} ${styles.badgeDebut}`}
                          >
                            <StarIcon size={14} weight="fill" /> Debut
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.watchContainer}>
                      <Link
                        to={`/season/${season}/episode/${episode.episode}`}
                        className={styles.watchLink}
                        onClick={() => play('select')}
                      >
                        <PlayIcon size={14} weight="fill" /> Ver
                      </Link>

                      <button
                        onClick={(e) => handleToggleEpisode(episode.code, e)}
                        className={`${styles.watchButton} ${watched ? styles.watched : ''}`}
                        title={
                          watched ? 'Marcar como no visto' : 'Marcar como visto'
                        }
                      >
                        {watched ? (
                          <CheckIcon size={24} weight="bold" />
                        ) : (
                          <CircleIcon size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Modal de captura de Pokémon */}
        {capturedPokemon && (
          <div
            className={`${styles.captureModal} ${showCaptureAnimation ? styles.animating : ''}`}
          >
            <div
              className={styles.captureOverlay}
              onClick={() => !showCaptureAnimation && setCapturedPokemon(null)}
            />

            <div className={styles.captureContent}>
              <div className={styles.pokeballContainer}>
                <div className={styles.pokeballContent}>
                  <Pokeball size="small" />
                </div>
              </div>

              <h2 className={styles.captureTitle}>¡Pokémon Capturado!</h2>

              <div
                className={`${styles.capturePokemon} ${showCaptureAnimation ? styles.flyingToHeader : ''}`}
                id="captured-pokemon-img"
              >
                <img
                  src={capturedPokemon.img}
                  alt={capturedPokemon.name}
                  className={styles.capturedSticker}
                />
              </div>

              <p className={styles.captureName}>{capturedPokemon.name}</p>
              <p className={styles.captureDebut}>
                Episodio debut #{capturedPokemon.debutEpisode}
              </p>

              {!showCaptureAnimation && (
                <button
                  onClick={handleCapturePokemon}
                  className={styles.captureButton}
                >
                  <LightningIcon size={24} weight="duotone" /> Capturar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
