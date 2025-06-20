import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';

interface SpotifyContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    isAuthenticated: boolean;
    deviceId: string | null;
    playTrack: (uri: string) => void;
    player: any;
    user: { display_name: string; email: string } | null;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessTokenState] = useState<string | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [user, setUser] = useState<{ display_name: string; email: string } | null>(null);
    const playerRef = useRef<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            console.log('[DEBUG] Message reçu', event);
            if (event.origin !== 'http://127.0.0.1:3001') return;

            const { type, accessToken, refreshToken } = event.data || {};
            if (type === 'spotify_tokens' && accessToken && refreshToken) {
                console.log('[SpotifyContext] Tokens reçus via postMessage');
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                setAccessTokenState(accessToken);
                navigate('/', { replace: true });
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) setAccessTokenState(token);
    }, []);

    const setAccessToken = (token: string | null) => {
        if (token) {
            localStorage.setItem('access_token', token);
        } else {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
        setAccessTokenState(token);
    };

    useEffect(() => {
        fetch('http://127.0.0.1:3001/me', { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                if (data?.display_name) {
                    setUser({ display_name: data.display_name, email: data.email });
                    setAccessTokenState('cookie'); // identifie que c’est en cookie
                }
            })
            .catch(() => setUser(null));
    }, []);

    useEffect(() => {
        if (!accessToken) return;

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb: any) => cb(accessToken),
                volume: 0.5,
            });

            playerRef.current = player;

            player.addListener('ready', ({ device_id }: any) => {
                console.log('✅ Player ready with device ID:', device_id);
                setDeviceId(device_id);
            });

            player.addListener('initialization_error', ({ message }: any) =>
                console.error('Init error', message)
            );
            player.addListener('authentication_error', ({ message }: any) =>
                console.error('Auth error', message)
            );
            player.addListener('account_error', ({ message }: any) =>
                console.error('Account error', message)
            );

            player.connect();
        };

        if (window.Spotify) {
            window.onSpotifyWebPlaybackSDKReady();
        } else {
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, [accessToken]);

    const playTrack = async (uri: string) => {
        if (!accessToken || !deviceId) return;

        try {
            await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: false,
                }),
            });

            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ uris: [uri] }),
            });
        } catch (error) {
            console.error('[playTrack] Error:', error);
        }
    };

    const isAuthenticated = !!accessToken;

    return (
        <SpotifyContext.Provider
            value={{
                accessToken,
                setAccessToken,
                isAuthenticated,
                deviceId,
                playTrack,
                player: playerRef,
                user,
            }}
        >
            {children}
        </SpotifyContext.Provider>
    );
};

export const useSpotifyContext = () => {
    const context = useContext(SpotifyContext);
    if (!context)
        throw new Error('useSpotifyContext must be used within a SpotifyProvider');
    return context;
};
