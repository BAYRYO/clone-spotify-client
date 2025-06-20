import { useEffect, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';

export default function TopTracks() {
    const { fetchWithAuth, playTrack } = useSpotify();
    const [tracks, setTracks] = useState<any[]>([]);

    useEffect(() => {
        fetchWithAuth('me/top/tracks?limit=20').then(res => setTracks(res.items)).catch(console.error);
    }, []);

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">🔥 Tes titres préférés</h1>
            <ul className="space-y-4">
                {tracks.map((track) => (
                    <li key={track.id} className="flex items-center gap-4 hover:bg-neutral-800 p-2 rounded cursor-pointer transition"
                        onClick={() => playTrack(track.uri)}>
                        <img src={track.album.images[2]?.url} alt={track.name} className="w-12 h-12 rounded" />
                        <div>
                            <p className="font-medium">{track.name}</p>
                            <p className="text-sm text-gray-400">{track.artists.map((a: any) => a.name).join(', ')}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
