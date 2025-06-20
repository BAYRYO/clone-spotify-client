import { useEffect, useState, useRef } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { Loader2 } from 'lucide-react';
import TrackCard from '../components/TrackCard';

export default function LikedTracksPage() {
    const { fetchWithAuth, playTrack, unlikeTrack } = useSpotify();
    const [likedTracks, setLikedTracks] = useState<any[]>([]);
    const [nextUrl, setNextUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const isFetchingRef = useRef(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const fetchLikedTracks = async (url: string = 'me/tracks?limit=50') => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            setLoading(true);
            const res = await fetchWithAuth(url);
            const newTracks = res.items.map((item: any) => item.track);
            setLikedTracks((prev) => {
                const existingIds = new Set(prev.map((t) => t.id));
                const filtered = newTracks.filter((t) => !existingIds.has(t.id));
                return [...prev, ...filtered];
            });
            setNextUrl(res.next ? res.next.replace('https://api.spotify.com/v1/', '') : null);
        } catch (err) {
            console.error('[LikedTracksPage] Échec du chargement des titres favoris', err);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    const handleUnlike = async (trackId: string) => {
        try {
            await unlikeTrack(trackId);
            setLikedTracks((prev) => prev.filter((t) => t.id !== trackId));
        } catch (err) {
            console.error('[handleUnlike] Erreur de suppression du favori', err);
            alert("Impossible de retirer ce titre des favoris");
        }
    };

    useEffect(() => {
        fetchLikedTracks();
    }, []);

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

            {likedTracks.length > 0 && (
                <ul className="space-y-4">
                    {likedTracks.map((track) => (
                        <TrackCard
                            key={track.id}
                            track={track}
                            onPlay={() => playTrack(track.uri)}
                            onUnlike={() => handleUnlike(track.id)}
                            showUnlike
                        />
                    ))}
                </ul>
            )}

            {!loading && likedTracks.length === 0 && (
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
