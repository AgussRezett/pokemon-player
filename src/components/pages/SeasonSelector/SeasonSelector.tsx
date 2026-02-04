import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SeasonSelector.module.scss';
import { useEpisodeStore } from '../../../store/episodeStore';

export default function SeasonSelector() {
    const { episodes, loading, error, fetchEpisodes, isWatched } = useEpisodeStore();

    useEffect(() => {
        fetchEpisodes();
    }, [fetchEpisodes]);

    useEffect(() => {
        document.title = 'Temporadas de Pokémon | Pokémon Tracker';
    }, []);

    // Agrupar por temporada
    const episodesBySeason = episodes.reduce((acc, episode) => {
        if (!acc[episode.season]) {
            acc[episode.season] = [];
        }
        acc[episode.season].push(episode);
        return acc;
    }, {} as Record<number, typeof episodes>);

    const seasons = Object.keys(episodesBySeason)
        .map(Number)
        .sort((a, b) => a - b);

    // Colores por temporada (inspirados en Pokémon)
    const seasonColors = [
        '#FF6B6B', // Rojo - Temporada 1
        '#FFB84D', // Naranja - Temporada 2
        '#FFD93D', // Amarillo - Temporada 3
        '#6BCF7F', // Verde - Temporada 4
        '#4ECDC4', // Cyan - Temporada 5
        '#5271FF', // Azul - Temporada 6
        '#9B59B6', // Morado - Temporada 7
        '#E91E63', // Rosa - Temporada 8
    ];

    const getSeasonColor = (season: number) => {
        return seasonColors[(season - 1) % seasonColors.length];
    };

    const getSeasonName = (season: number) => {
        const names: Record<number, string> = {
            1: 'Liga Índigo',
            2: 'Las Aventuras en las Islas Naranja',
            3: 'Liga Johto',
            4: 'Maestros Johto',
            5: 'Desafío Hoenn',
            6: 'Liga Hoenn',
            // Agrega más según sea necesario
        };
        return names[season] || `Temporada ${season}`;
    };

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
            <header className={styles.header}>
                <h1>Temporadas de Pokémon</h1>
                <p>Selecciona una temporada para comenzar tu aventura</p>
            </header>

            <div className={styles.seasonsGrid}>
                {seasons.map((season) => {
                    const seasonEpisodes = episodesBySeason[season];
                    const totalEpisodes = seasonEpisodes.length;
                    const watchedCount = seasonEpisodes.filter(ep => isWatched(ep.code)).length;
                    const fillerCount = seasonEpisodes.filter(ep => !ep.isCanon).length;
                    const progress = Math.round((watchedCount / totalEpisodes) * 100);

                    return (
                        <Link
                            key={season}
                            to={`/season/${season}`}
                            className={styles.seasonCard}
                            style={{ '--season-color': getSeasonColor(season) } as React.CSSProperties}
                        >
                            <div className={styles.seasonHeader} style={{ background: getSeasonColor(season) }}>
                                <h2>Temporada {season}</h2>
                            </div>

                            <div className={styles.seasonBody}>
                                <h3>{getSeasonName(season)}</h3>

                                <div className={styles.progressSection}>
                                    <span className={styles.progressLabel}>Progreso</span>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${progress}%`, background: getSeasonColor(season) }}
                                        />
                                    </div>
                                    <span className={styles.progressText}>{progress}%</span>
                                </div>

                                <div className={styles.stats}>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Episodios</span>
                                        <span className={styles.statValue}>{watchedCount} / {totalEpisodes}</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statLabel}>Relleno</span>
                                        <span className={styles.statValue}>{fillerCount}</span>
                                    </div>
                                </div>

                                <button className={styles.startButton}>
                                    {watchedCount > 0 ? 'Continuar' : 'Comenzar'}
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}