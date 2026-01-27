import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpisodeStore } from '../../store/episodeStore';

export default function EpisodeList() {
    const { episodes, loading, error, fetchEpisodes, isWatched } = useEpisodeStore();
    const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

    useEffect(() => {
        fetchEpisodes();
    }, [fetchEpisodes]);

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

    // Si no hay temporada seleccionada, mostrar la primera
    useEffect(() => {
        if (selectedSeason === null && seasons.length > 0) {
            setSelectedSeason(seasons[0]);
        }
    }, [seasons, selectedSeason]);

    const displaySeasons = selectedSeason !== null
        ? [selectedSeason]
        : seasons;

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Cargando episodios...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px' }}>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Pokémon - Todos los Episodios</h1>
            <p>Total de episodios: {episodes.length}</p>

            {/* Selector de temporada */}
            <div style={{
                marginBottom: '30px',
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px'
            }}>
                <h3 style={{ marginTop: 0 }}>Selecciona una temporada:</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '10px'
                }}>
                    {seasons.map(season => {
                        const seasonEpisodes = episodesBySeason[season];
                        const watchedCount = seasonEpisodes.filter(ep => isWatched(ep.code)).length;
                        const totalCount = seasonEpisodes.length;
                        const isComplete = watchedCount === totalCount && totalCount > 0;

                        return (
                            <button
                                key={season}
                                onClick={() => setSelectedSeason(season)}
                                style={{
                                    padding: '10px',
                                    backgroundColor: selectedSeason === season ? '#007bff' : 'white',
                                    color: selectedSeason === season ? 'white' : '#333',
                                    border: `2px solid ${selectedSeason === season ? '#007bff' : '#ddd'}`,
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: selectedSeason === season ? 'bold' : 'normal',
                                    position: 'relative',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Temporada {season}
                                <div style={{ fontSize: '11px', marginTop: '5px', opacity: 0.8 }}>
                                    {watchedCount}/{totalCount} vistos
                                </div>
                                {isComplete && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        backgroundColor: '#28a745',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px'
                                    }}>
                                        ✓
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {displaySeasons.map(season => (
                <div key={season} style={{ marginBottom: '40px' }}>
                    <h2>Temporada {season}</h2>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {episodesBySeason[season]
                            .sort((a, b) => a.episode - b.episode)
                            .map(episode => {
                                const watched = isWatched(episode.code);

                                return (
                                    <Link
                                        key={episode.code}
                                        to={`/episode/${episode.season}/${episode.episode}`}
                                        style={{
                                            padding: '15px',
                                            border: watched ? '2px solid #28a745' : '1px solid #ccc',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            transition: 'background-color 0.2s',
                                            backgroundColor: watched ? '#f0fff4' : 'transparent',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = watched ? '#e6f9ed' : '#f5f5f5'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = watched ? '#f0fff4' : 'transparent'}
                                    >
                                        {watched && (
                                            <div style={{
                                                backgroundColor: '#28a745',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '24px',
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '14px',
                                                flexShrink: 0
                                            }}>
                                                ✓
                                            </div>
                                        )}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                <strong>
                                                    {String(episode.season).padStart(2, '0')}x{String(episode.episode).padStart(2, '0')}
                                                </strong>
                                                <span style={{
                                                    fontSize: '11px',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#e0e0e0',
                                                    color: '#666',
                                                    fontWeight: 'bold'
                                                }}>
                                                    #{episode.absoluteEpisode}
                                                </span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: episode.isCanon ? '#d4edda' : '#fff3cd',
                                                    color: episode.isCanon ? '#155724' : '#856404',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {episode.isCanon ? '📖 Historia' : '🔄 Relleno'}
                                                </span>
                                                {' - '}
                                                <span style={{ textTransform: 'capitalize' }}>{episode.name}</span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                                Código: {episode.code}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </div>
            ))}
        </div>
    );
}