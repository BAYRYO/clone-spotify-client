import { Link } from 'react-router-dom';
import { useSpotifyContext } from '../context/SpotifyContext';
import { useState } from 'react';

export default function Header() {
    const { isAuthenticated, user } = useSpotifyContext();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogin = () => {
        const width = 500;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
            'http://127.0.0.1:3001/login',
            'Spotify Login',
            `width=${width},height=${height},top=${top},left=${left}`
        );
    };

    return (
        <header className="w-full p-4 bg-neutral-900 border-b border-neutral-700 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
            <h1 className="text-xl font-bold">🎵 Spotify Clone</h1>

            <nav className="flex flex-wrap gap-2">
                <Link
                    to="/"
                    className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition"
                >
                    Accueil
                </Link>
                <Link
                    to="/search"
                    className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition"
                >
                    Rechercher
                </Link>
            </nav>

            {isAuthenticated && user ? (
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition"
                    >
                        {user.display_name || user.email} ▾
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-50">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700"
                                onClick={() => setMenuOpen(false)}
                            >
                                Voir le profil
                            </Link>
                            <Link
                                to="/top"
                                className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700"
                                onClick={() => setMenuOpen(false)}
                            >
                                Top des titres
                            </Link>
                            <Link
                                to="/liked"
                                className="block px-4 py-2 text-sm text-gray-200 hover:bg-neutral-700"
                                onClick={() => setMenuOpen(false)}
                            >
                                Favoris
                            </Link>
                            <Link
                                to="/logout"
                                className="block px-4 py-2 text-sm text-red-400 hover:bg-neutral-700"
                                onClick={() => setMenuOpen(false)}
                            >
                                Se déconnecter
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <button
                    onClick={handleLogin}
                    className="text-sm text-gray-300 hover:text-white px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition"
                >
                    Connexion
                </button>
            )}
        </header>
    );
}
