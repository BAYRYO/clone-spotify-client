import { useSpotifyContext } from '../context/SpotifyContext';

export const useSpotify = () => {
    const { accessToken, deviceId, playTrack: playTrackContext } = useSpotifyContext();

    const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
        const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                ...options.headers,
            },
        });

        if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);

        const contentLength = res.headers.get('content-length');
        if (!contentLength || parseInt(contentLength) === 0) return null;

        return res.json();
    };

    const playTrack = (uri: string) => {
        if (!playTrackContext) {
            console.warn('[useSpotify] playTrack not available');
            return;
        }
        playTrackContext(uri);
    };

    const likeTrack = async (trackId: string) => {
        await fetchWithAuth(`me/tracks?ids=${trackId}`, {
            method: 'PUT',
        });
    };

    const unlikeTrack = async (trackId: string) => {
        await fetchWithAuth(`me/tracks?ids=${trackId}`, {
            method: 'DELETE',
        });
    };

    const isTrackLiked = async (trackId: string): Promise<boolean> => {
        const res = await fetchWithAuth(`me/tracks/contains?ids=${trackId}`);
        return Array.isArray(res) ? res[0] : false;
    };

    return {
        fetchWithAuth,
        playTrack,
        likeTrack,
        unlikeTrack,
        isTrackLiked,
    };
};