import { useEffect, useRef, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import TrackCard from '../components/TrackCard';

export default function TopTracks() {
    const { fetchWithAuth, playTrack } = useSpotify();
    const [tracks, setTracks] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);

    const fetchTopTracks = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const res = await fetchWithAuth(`me/top/tracks?limit=20&offset=${offset}`);
            if (res.items.length === 0) {
                setHasMore(false);
            } else {
                setTracks((prev) => [...prev, ...res.items]);
                setOffset((prev) => prev + 20);
            }
        } catch (err) {
            console.error('[TopTracks] Failed to fetch top tracks', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTopTracks();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    fetchTopTracks();
                }
            },
            { threshold: 1.0 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasMore, loading]);

    return (
        <div className="p-6 text-white pb-32 bg-neutral-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">📈 Tes titres les plus écoutés</h1>

            <ul className="space-y-4">
                {tracks.map((track) => (
                    <TrackCard
                        key={track.id}
                        track={track}
                        onPlay={() => playTrack(track.uri)}
                    />
                ))}
                {loading && Array.from({ length: 3 }).map((_, index) => (
                    <li
                        key={`skeleton-${index}`}
                        className="animate-pulse bg-neutral-800 rounded-lg p-4 flex gap-4 items-center"
                    >
                        <div className="w-16 h-16 bg-neutral-700 rounded" />
                        <div className="flex-1 space-y-2">
                            <div className="w-3/4 h-4 bg-neutral-700 rounded" />
                            <div className="w-1/2 h-4 bg-neutral-700 rounded" />
                        </div>
                    </li>
                ))}
            </ul>

            <div ref={observerRef} className="h-10" />
        </div>
    );
}
