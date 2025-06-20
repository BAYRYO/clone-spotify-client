import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:3001/logout', {
            method: 'POST',
            credentials: 'include',
        }).finally(() => {
            navigate('/');
        });
    }, [navigate]);

    return <p className="text-white p-4">Déconnexion...</p>;
}
