import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyContext } from '../context/SpotifyContext';

export default function Logout() {
    const { setAccessToken } = useSpotifyContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://127.0.0.1:3001/logout', {
            method: 'POST',
            credentials: 'include',
        }).then(() => {
            setAccessToken(null);
            navigate('/');
        });
    }, [navigate, setAccessToken]);

    return <p className="text-white p-4">Déconnexion...</p>;
}
