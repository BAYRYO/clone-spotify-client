import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyContext } from '../context/SpotifyContext';

export default function Logout() {
    const navigate = useNavigate();
    const { setAccessToken } = useSpotifyContext();

    useEffect(() => {
        // Supprime tokens du localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Réinitialise accessToken dans le contexte
        setAccessToken(null);

        // Redirige vers la page d’accueil après un court délai
        setTimeout(() => {
            navigate('/');
        }, 100);
    }, [navigate, setAccessToken]);

    return (
        <div className="flex items-center justify-center h-screen text-white text-xl">
            Déconnexion en cours...
        </div>
    );
}
