import { useEffect, useState } from 'react';
import { useSpotify } from '../hooks/useSpotify';

export default function Profile() {
    const { fetchWithAuth } = useSpotify();
    const [profile, setProfile] = useState<any>(null);
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchWithAuth('me')
            .then(setProfile)
            .catch(console.error);

        fetchWithAuth('me/playlists')
            .then((res) => setPlaylists(res.items))
            .catch(console.error);
    }, []);

    const handleCopy = () => {
        if (!profile?.id) return;
        navigator.clipboard.writeText(profile.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!profile) {
        return (
            <div className="p-6 text-white">
                <h1 className="text-3xl font-bold">Profil Spotify</h1>
                <p className="mt-4 text-gray-400">Chargement du profil...</p>
            </div>
        );
    }

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">👤 Profil Spotify</h1>

            <div className="flex items-center gap-6 mb-6">
                {profile.images?.[0]?.url && (
                    <img
                        src={profile.images[0].url}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full border-4 border-green-500"
                    />
                )}
                <div>
                    <p className="text-2xl font-semibold">{profile.display_name}</p>
                    <p className="text-sm text-gray-400">{profile.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Pays : {profile.country} — Type : {profile.product}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-gray-500">ID : {profile.id}</p>
                        <button
                            onClick={handleCopy}
                            className="text-xs px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600"
                        >
                            {copied ? '✅ Copié !' : '📋 Copier'}
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">🎵 Mes playlists</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playlists.map((playlist) => (
                    <li key={playlist.id} className="bg-neutral-800 p-4 rounded shadow hover:bg-neutral-700 transition">
                        <div className="flex gap-4">
                            {playlist.images?.length > 0 && (
                                <img
                                    src={playlist.images[0].url}
                                    alt={playlist.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            )}
                            <div>
                                <p className="font-medium">{playlist.name}</p>
                                <p className="text-sm text-gray-400">{playlist.tracks.total} titres</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
