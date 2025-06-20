import { useSpotifyContext } from '../context/SpotifyContext';

export const useSpotify = () => {
    const { playTrack: playTrackContext } = useSpotifyContext();

    const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
        const res = await fetch(`http://127.0.0.1:3001/api/${endpoint}`, {
            ...options,
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
    };

    const likeTrack = async (trackId: string) => {
        await fetchWithAuth(`me/tracks?ids=${trackId}`, { method: 'PUT' });
    };

    const unlikeTrack = async (trackId: string) => {
        await fetchWithAuth(`me/tracks?ids=${trackId}`, { method: 'DELETE' });
    };

    const isTrackLiked = async (trackId: string): Promise<boolean> => {
        const res = await fetchWithAuth(`me/tracks/contains?ids=${trackId}`);
        return Array.isArray(res) ? res[0] : false;
    };

    return {
        fetchWithAuth,
        playTrack: playTrackContext,
        likeTrack,
        unlikeTrack,
        isTrackLiked,
    };
};
