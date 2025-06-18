import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // 🔐 Efface les tokens du navigateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Redirige vers la page d'accueil ou login
        navigate('/');
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen text-white text-xl">
            Déconnexion en cours...
        </div>
    );
}
