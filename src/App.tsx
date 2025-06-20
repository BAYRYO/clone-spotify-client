import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpotifyContext } from './context/SpotifyContext';

export default function App() {
  const { isAuthenticated, accessToken } = useSpotifyContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      console.log('[App] Utilisateur non connecté');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated || !accessToken) {
    return (
      <div className="p-6 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">🎶 Bienvenue sur ton clone Spotify</h1>
        <p className="text-lg mb-6">Tu n'es pas connecté. Clique sur le bouton <strong>Connexion</strong> en haut à droite.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🎶 Bienvenue sur ton clone Spotify</h1>
      <p className="text-lg mb-6">Tu es connecté. Tu peux maintenant rechercher et écouter de la musique.</p>

      <button
        onClick={() => navigate('/search')}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
      >
        Rechercher des titres
      </button>
    </div>
  );
}
