import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirige simplement après quelques secondes
        const timeout = setTimeout(() => {
            navigate('/', { replace: true });
        }, 1500);

        return () => clearTimeout(timeout);
    }, [navigate]);

    return (
        <div className="text-white text-center mt-10">
            Connexion en cours... Tu vas être redirigé.
        </div>
    );
};

export default AuthCallback;
