import { useEffect, useState, useRef } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { useSpotifyContext } from '../context/SpotifyContext';
import { Heart, Loader2 } from 'lucide-react';

export default function LikedTracksPage() {
    const { accessToken } = useSpotifyContext();
    const { fetchWithAuth, playTrack, unlikeTrack } = useSpotify();
    const [likedTracks, setLikedTracks] = useState<any[]>([]);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const fetchLikedTracks = async (url: string = 'me/tracks?limit=50') => {
        try {
            setLoading(true);
            const res = await fetchWithAuth(url);
            const newTracks = res.items.map((item: any) => item.track);
            setLikedTracks((prev) => [...prev, ...newTracks]);
            setNextUrl(res.next ? res.next.replace('https://api.spotify.com/v1/', '') : null);
        } catch (err) {
            console.error('[LikedTracksPage] Failed to fetch liked tracks', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnlike = async (trackId: string) => {
        try {
            await unlikeTrack(trackId);
            setLikedTracks((prev) => prev.filter((t) => t.id !== trackId));
        } catch (err) {
            console.error('Erreur lors du retrait des favoris', err);
        }
    };

    // Chargement initial après accessToken prêt
    useEffect(() => {
        if (!accessToken) return;
        fetchLikedTracks();
    }, [accessToken]);

    // Scroll infini
    useEffect(() => {
        const handleScroll = () => {
            const el = containerRef.current;
            if (!el || loading || !nextUrl) return;
            const { scrollTop, scrollHeight, clientHeight } = el;
            if (scrollTop + clientHeight >= scrollHeight - 200) {
                fetchLikedTracks(nextUrl);
            }
        };

        const el = containerRef.current;
        if (el) el.addEventListener('scroll', handleScroll);
        return () => {
            if (el) el.removeEventListener('scroll', handleScroll);
        };
    }, [loading, nextUrl]);

    return (
        <div ref={containerRef} className="p-6 text-white pb-32 bg-neutral-900 h-[calc(100vh-80px)] overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6">❤️ Mes titres favoris</h1>

            {likedTracks.length > 0 ? (
                <ul className="space-y-4">
                    {likedTracks.map((track) => (
                        <li
                            key={track.id}
                            className="flex items-center gap-4 hover:bg-neutral-800 p-2 rounded cursor-pointer transition"
                            onClick={() => playTrack(track.uri)}
                        >
                            <img
                                src={track.album.images[2]?.url}
                                alt={track.name}
                                className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1">
                                <p className="font-medium">{track.name}</p>
                                <p className="text-sm text-gray-400">
                                    {track.artists.map((a: any) => a.name).join(', ')}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnlike(track.id);
                                }}
                                className="p-1"
                                title="Retirer des favoris"
                            >
                                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">Aucun titre favori pour le moment.</p>
            )}

            {loading && (
                <div className="mt-6 text-center text-gray-400 animate-spin flex justify-center">
                    <Loader2 className="w-6 h-6" />
                </div>
            )}
        </div>
    );
}
