import { useEffect, useRef, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import TrackCard from '../components/TrackCard';

export default function SearchPage() {
    const { fetchWithAuth, playTrack } = useSpotify();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const timeout = setTimeout(() => {
            fetchWithAuth(`search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
                signal: controller.signal,
            })
                .then((res) => setResults(res.tracks.items))
                .catch((err) => {
                    if (err.name !== 'AbortError') console.error('Search error:', err);
                })
                .finally(() => setLoading(false));
        }, 500);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query]);

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">🔍 Recherche</h1>
            <input
                type="text"
                placeholder="Tape un titre, artiste..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 text-black rounded"
            />
            {loading && <p className="mt-4 text-gray-400">Recherche en cours...</p>}

            <ul className="mt-6 space-y-4">
                {results.map((track) => (
                    <TrackCard
                        key={track.id}
                        track={track}
                        onPlay={() => playTrack(track.uri)}
                    />
                ))}
            </ul>
        </div>
    );
}
