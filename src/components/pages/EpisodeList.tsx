import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useEpisodeStore } from '../../store/episodeStore';

export default function EpisodeList() {
    const { episodes, loading, error, fetchEpisodes } = useEpisodeStore();

    useEffect(() => {
        fetchEpisodes();
    }, [fetchEpisodes]);

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

    return (
        <div style={{ padding: '20px' }}>
            <h1>Pokémon - Todos los Episodios</h1>
            <p>Total de episodios: {episodes.length}</p>

            {seasons.map(season => (
                <div key={season} style={{ marginBottom: '40px' }}>
                    <h2>Temporada {season}</h2>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {episodesBySeason[season]
                            .sort((a, b) => a.episode - b.episode)
                            .map(episode => (
                                <Link
                                    key={episode.code}
                                    to={`/episode/${episode.code}`}
                                    style={{
                                        padding: '15px',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        display: 'block',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <strong>
                                        {String(episode.season).padStart(2, '0')}x{String(episode.episode).padStart(2, '0')}
                                    </strong>
                                    {' - '}
                                    <span style={{ textTransform: 'capitalize' }}>{episode.name}</span>
                                    <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                                        Código: {episode.code}
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}