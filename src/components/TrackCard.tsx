import { Heart } from 'lucide-react';

interface TrackCardProps {
    track: any;
    onPlay?: () => void;
    onUnlike?: () => void;
    showUnlike?: boolean;
}

export default function TrackCard({ track, onPlay, onUnlike, showUnlike = false }: TrackCardProps) {
    return (
        <li
            className="flex items-center gap-4 hover:bg-neutral-800 p-2 rounded cursor-pointer transition"
            onClick={onPlay}
        >
            <img
                src={track.album.images?.at(-1)?.url || '/default-cover.jpg'}
                alt={track.name}
                className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{track.name}</p>
                <p className="text-sm text-gray-400 truncate">
                    {track.artists.map((a: any) => a.name).join(', ')}
                </p>
            </div>
            {showUnlike && onUnlike && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnlike();
                    }}
                    className="p-1"
                    title="Retirer des favoris"
                >
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                </button>
            )}
        </li>
    );
}
