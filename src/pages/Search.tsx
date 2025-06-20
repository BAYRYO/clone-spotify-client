import { useState, useEffect } from 'react';
import { useSpotify } from '../hooks/useSpotify';
import { Heart, HeartOff } from 'lucide-react';

export default function Search() {
    const {
        fetchWithAuth,
        playTrack,
        likeTrack,
        unlikeTrack,
    } = useSpotify();

    const [query, setQuery] = useState('');
    const [tracks, setTracks] = useState<any[]>([]);
    const [likes, setLikes] = useState<Record<string, boolean>>({});
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        let controller: AbortController;

        const delayDebounce = setTimeout(async () => {
            if (!query.trim()) return;
            try {
                controller?.abort();
                controller = new AbortController();

                const data = await fetchWithAuth(
                    `search?q=${encodeURIComponent(query)}&type=track&limit=10`,
                    { signal: controller.signal }
                );
                setTracks(data.tracks.items);

                const ids = data.tracks.items.map((t: any) => t.id).join(',');
                const results = await fetchWithAuth(`me/tracks/contains?ids=${ids}`);
                const likedMap: Record<string, boolean> = {};
                data.tracks.items.forEach((track: any, index: number) => {
                    likedMap[track.id] = results[index];
                });
                setLikes(likedMap);
            } catch (err) {
                console.error('Erreur recherche Spotify', err);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const toggleLike = async (trackId: string) => {
        try {
            if (likes[trackId]) {
                await unlikeTrack(trackId);
                setLikes((prev) => ({ ...prev, [trackId]: false }));
            } else {
                await likeTrack(trackId);
                setLikes((prev) => ({ ...prev, [trackId]: true }));
            }
        } catch (err) {
            console.error('Erreur toggle like', err);
        }
    };

    const filteredTracks = showFavorites
        ? tracks.filter((track) => likes[track.id])
        : tracks;

    return (
        <div className="p-6 text-white pb-32 bg-neutral-900">
            <h1 className="text-3xl font-bold mb-6">🔍 Recherche Spotify</h1>

            <div className="mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
                    placeholder="Rechercher un morceau, un artiste, un album..."
                />
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowFavorites((prev) => !prev)}
                    className="text-sm px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 transition"
                >
                    {showFavorites ? 'Voir tous les résultats' : 'Voir mes favoris'}
                </button>
            </div>

            {filteredTracks.length > 0 && (
                <ul className="space-y-4">
                    {filteredTracks.map((track) => (
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
                                    toggleLike(track.id);
                                }}
                                className="p-1"
                                title="Ajouter aux favoris"
                            >
                                {likes[track.id] ? (
                                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500 transition-transform duration-150 scale-110" />
                                ) : (
                                    <HeartOff className="w-5 h-5 text-gray-400 hover:text-pink-400 transition-transform duration-150 hover:scale-110" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
