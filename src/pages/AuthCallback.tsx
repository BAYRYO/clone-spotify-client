import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== 'http://127.0.0.1:5173') return;

            const { type, accessToken, refreshToken } = event.data || {};
            if (type === 'spotify_tokens' && accessToken && refreshToken) {
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                navigate('/', { replace: true });
            }
        };

        window.addEventListener('message', handleMessage);
        // Fallback : redirige si la page est accédée seule
        setTimeout(() => navigate('/'), 3000);

        return () => window.removeEventListener('message', handleMessage);
    }, [navigate]);

    return (
        <div className="text-white text-center mt-10">
            Connexion en cours...
        </div>
    );
};

export default AuthCallback;
