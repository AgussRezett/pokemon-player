import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEpisodeStore } from '../../store/episodeStore';

export default function EpisodePlayer() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const { episodes, fetchEpisodes, getEpisodeByCode, markAsWatched, isWatched } = useEpisodeStore();

    const episode = code ? getEpisodeByCode(code) : null;
    const watched = code ? isWatched(code) : false;

    useEffect(() => {
        // Asegurarnos de que los episodios estén cargados
        if (episodes.length === 0) {
            fetchEpisodes();
        }
    }, [episodes.length, fetchEpisodes]);

    // Marcar como visto después de 10 segundos
    useEffect(() => {
        if (code && !watched) {
            const timer = setTimeout(() => {
                markAsWatched(code);
            }, 10000); // 10 segundos

            return () => clearTimeout(timer);
        }
    }, [code, watched, markAsWatched]);

    // Encontrar episodio anterior y siguiente
    const currentIndex = episodes.findIndex(ep => ep.code === code);
    const previousEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
    const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

    if (episodes.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <Link to="/">← Volver al listado</Link>
                <h1>Cargando...</h1>
            </div>
        );
    }

    if (!episode) {
        return (
            <div style={{ padding: '20px' }}>
                <Link to="/">← Volver al listado</Link>
                <h1>Error</h1>
                <p>No se encontró el episodio</p>
            </div>
        );
    }

    // Construir la URL del embed usando el código del episodio
    const embedUrl = episode.url;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
                    ← Volver al listado
                </Link>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{
                        backgroundColor: episode.isCanon ? '#d4edda' : '#fff3cd',
                        color: episode.isCanon ? '#155724' : '#856404',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        {episode.isCanon ? '📖 Historia' : '🔄 Relleno'}
                    </div>

                    {watched && (
                        <div style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '16px' }}>✓</span>
                            Ya visto
                        </div>
                    )}
                </div>
            </div>

            <h1 style={{ color: "#ffffff", marginBottom: '10px' }}>
                {String(episode.season).padStart(2, '0')}X{String(episode.episode).padStart(2, '0')} - {' '}
                <span style={{ textTransform: 'capitalize' }}>{episode.name}</span>
            </h1>

            <div style={{ marginBottom: '20px', color: '#999', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <span>Temporada {episode.season}, Episodio {episode.episode}</span>
                <span style={{
                    backgroundColor: '#333',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 'bold'
                }}>
                    Episodio Absoluto #{episode.absoluteEpisode}
                </span>
            </div>

            {/* Reproductor de video */}
            <div style={{
                marginBottom: '20px',
                backgroundColor: '#000',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <iframe
                    src={embedUrl}
                    width="100%"
                    height="500px"
                    frameBorder="0"
                    allowFullScreen
                    title={`${episode.season}x${episode.episode} - ${episode.name}`}
                    style={{ border: 'none' }}
                />
            </div>

            {/* Información del episodio */}
            <div style={{
                padding: '20px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <h3>Detalles</h3>
                <p><strong>Código:</strong> {episode.code}</p>
                <p><strong>Temporada:</strong> {episode.season}</p>
                <p><strong>Episodio:</strong> {episode.episode}</p>
                <p><strong>Episodio Absoluto:</strong> #{episode.absoluteEpisode}</p>
                <p><strong>Nombre:</strong> <span style={{ textTransform: 'capitalize' }}>{episode.name}</span></p>
                <p>
                    <strong>Tipo:</strong> {' '}
                    <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: episode.isCanon ? '#d4edda' : '#fff3cd',
                        color: episode.isCanon ? '#155724' : '#856404',
                        fontWeight: 'bold'
                    }}>
                        {episode.isCanon ? '📖 Historia (Canon)' : '🔄 Relleno (Filler)'}
                    </span>
                </p>
                <p>
                    <strong>Estado:</strong> {' '}
                    {watched ? (
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Visto</span>
                    ) : (
                        <span style={{ color: '#6c757d' }}>Se marcará como visto en 10 segundos...</span>
                    )}
                </p>
            </div>

            {/* Navegación entre episodios */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '20px'
            }}>
                <button
                    onClick={() => previousEpisode && navigate(`/episode/${previousEpisode.code}`)}
                    disabled={!previousEpisode}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: previousEpisode ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: previousEpisode ? 'pointer' : 'not-allowed',
                        flex: 1
                    }}
                >
                    {previousEpisode ? (
                        <>
                            ← Episodio Anterior
                            <div style={{ fontSize: '12px', marginTop: '5px' }}>
                                {String(previousEpisode.season).padStart(2, '0')}x{String(previousEpisode.episode).padStart(2, '0')} - {' '}
                                <span style={{ textTransform: 'capitalize' }}>{previousEpisode.name}</span>
                            </div>
                        </>
                    ) : (
                        'No hay episodio anterior'
                    )}
                </button>

                <button
                    onClick={() => nextEpisode && navigate(`/episode/${nextEpisode.code}`)}
                    disabled={!nextEpisode}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: nextEpisode ? '#007bff' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: nextEpisode ? 'pointer' : 'not-allowed',
                        flex: 1
                    }}
                >
                    {nextEpisode ? (
                        <>
                            Siguiente Episodio →
                            <div style={{ fontSize: '12px', marginTop: '5px' }}>
                                {String(nextEpisode.season).padStart(2, '0')}x{String(nextEpisode.episode).padStart(2, '0')} - {' '}
                                <span style={{ textTransform: 'capitalize' }}>{nextEpisode.name}</span>
                            </div>
                        </>
                    ) : (
                        'No hay siguiente episodio'
                    )}
                </button>
            </div>
        </div>
    );
}