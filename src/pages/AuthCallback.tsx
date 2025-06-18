import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();
    const alreadyHandled = useRef(false); // ✅ empêche double exécution

    useEffect(() => {
        if (alreadyHandled.current) return;
        alreadyHandled.current = true;

        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        console.log('[AuthCallback] URL params:', Object.fromEntries(params.entries()));

        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            console.log('[AuthCallback] Tokens saved, redirecting to /');
            navigate('/', { replace: true });
        } else {
            console.warn('[AuthCallback] Tokens missing');
            navigate('/error');
        }
    }, [navigate]);

    return (
        <div className="text-white text-center mt-10">
            Connexion en cours...
        </div>
    );
};

export default AuthCallback;
