import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import type { ReactNode } from 'react';

interface SpotifyContextType {
    isAuthenticated: boolean;
    user: { display_name: string; email: string; id: string } | null;
    player: any;
    deviceId: string | null;
    playTrack: (uri: string) => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<SpotifyContextType['user']>(null);
    const [deviceId] = useState<string | null>(null);
    const playerRef = useRef<any>(null);

    // Auth : récupère les infos utilisateur
    useEffect(() => {
        fetch('http://127.0.0.1:3001/me', { credentials: 'include' })
            .then((res) => {
                if (!res.ok) throw new Error('Not authenticated');
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => setUser(null));
    }, []);

    const isAuthenticated = !!user;

    // Lecture d’un titre via le backend (proxy)
    const playTrack = async (uri: string) => {
        try {
            const res = await fetch('http://127.0.0.1:3001/api/play', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ uri }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }
        } catch (err) {
            console.error('[playTrack] Erreur backend:', err);
        }
    };

    return (
        <SpotifyContext.Provider
            value={{
                user,
                isAuthenticated,
                playTrack,
                player: playerRef,
                deviceId,
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
