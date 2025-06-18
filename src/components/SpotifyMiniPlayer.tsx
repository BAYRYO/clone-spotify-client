import { useEffect, useRef, useState } from 'react';
import { useSpotifyContext } from '../context/SpotifyContext';
import { Repeat, Repeat1, Shuffle, Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const SpotifyMiniPlayer = () => {
    const { player, accessToken } = useSpotifyContext();
    const sdkplayer = player.current;
    const [track, setTrack] = useState<any>(null);
    const [isPaused, setIsPaused] = useState(true);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [repeatState, setRepeatState] = useState<'off' | 'track' | 'context'>('off');
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    const fetchRepeatState = async () => {
        try {
            const res = await fetch('https://api.spotify.com/v1/me/player', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!res.ok) {
                console.error('[SpotifyMiniPlayer] Failed to fetch repeat state, status:', res.status);
                return;
            }

            const text = await res.text();
            if (!text) {
                console.warn('[SpotifyMiniPlayer] Empty response body for repeat state');
                return;
            }

            const data = JSON.parse(text);
            setRepeatState(data.repeat_state);
        } catch (err) {
            console.error('[SpotifyMiniPlayer] Failed to fetch repeat state', err);
        }
    };

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!sdkplayer) return;

        const handleStateChange = (state: any) => {
            if (!state) return;
            setIsPlayerReady(true);
            setIsPaused(state.paused);
            setTrack(state.track_window.current_track);
            setPosition(state.position);
            setDuration(state.duration);
        };

        sdkplayer.addListener('player_state_changed', handleStateChange);
        return () => {
            sdkplayer.removeListener('player_state_changed', handleStateChange);
        };
    }, [sdkplayer]);

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setPosition((prev) => (prev + 1000 > duration ? duration : prev + 1000));
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPaused, duration]);

    useEffect(() => {
        if (sdkplayer && isPlayerReady) {
            sdkplayer.setVolume(volume).catch((err: any) =>
                console.error('[setVolume] Player non prêt ou erreur', err)
            );
        }
    }, [volume, sdkplayer, isPlayerReady]);

    const togglePlay = () => {
        if (!sdkplayer || !isPlayerReady) {
            console.warn('[togglePlay] Player non prêt');
            return;
        }
        sdkplayer.togglePlay().catch((err: any) =>
            console.error('[togglePlay] Erreur togglePlay', err)
        );
    };

    const skipNext = () => {
        if (!sdkplayer || !isPlayerReady) return;
        sdkplayer.nextTrack().catch(console.error);
    };

    const skipPrev = () => {
        if (!sdkplayer || !isPlayerReady) return;
        sdkplayer.previousTrack().catch(console.error);
    };

    const seekTo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPos = parseInt(e.target.value, 10);
        if (!sdkplayer || !isPlayerReady) return;
        sdkplayer.seek(newPos).then(() => setPosition(newPos));
    };

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000)
            .toString()
            .padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    const toggleRepeat = async () => {
        if (!accessToken) return;

        const nextState = repeatState === 'off' ? 'track' : repeatState === 'track' ? 'context' : 'off';

        try {
            const res = await fetch(
                `https://api.spotify.com/v1/me/player/repeat?state=${nextState}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (res.ok) {
                setRepeatState(nextState);
            } else {
                const err = await res.json();
                console.error('[toggleRepeat] Spotify API error:', err);
            }
        } catch (err) {
            console.error('[toggleRepeat] Exception:', err);
        }
    };

    useEffect(() => {
        if (accessToken) fetchRepeatState();
    }, [accessToken]);

    if (!track) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 px-4 py-3 flex flex-col gap-2 text-white z-50">
            <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                    <img src={track.album.images[2]?.url} alt={track.name} className="w-12 h-12 rounded" />
                    <div className="truncate">
                        <p className="font-medium truncate">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">
                            {track.artists.map((a: any) => a.name).join(', ')}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center w-full max-w-[300px]">
                    <div className="flex gap-4 text-lg mb-1">
                        <button onClick={skipPrev} title="Précédent"><SkipBack className="w-5 h-5" /></button>
                        <button onClick={togglePlay} title="Lecture/Pause">
                            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                        </button>
                        <button onClick={skipNext} title="Suivant"><SkipForward className="w-5 h-5" /></button>
                        <button
                            onClick={toggleRepeat}
                            className="p-2 rounded hover:bg-neutral-800 transition"
                            title={`Mode boucle : ${repeatState}`}
                        >
                            {repeatState === 'track' && <Repeat1 className="w-5 h-5 text-green-500" />}
                            {repeatState === 'context' && <Repeat className="w-5 h-5 text-blue-500" />}
                            {repeatState === 'off' && <Repeat className="w-5 h-5 text-gray-400" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[160px]">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-[100px]"
                    />
                    <span className="text-sm text-gray-400">{Math.round(volume * 100)}%</span>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full px-2">
                <span className="text-xs text-gray-400 w-10 text-right">{formatTime(position)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={position}
                    onChange={seekTo}
                    className="w-full"
                />
                <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
        </div>
    );
};

export default SpotifyMiniPlayer;
