import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback.tsx';
import { SpotifyProvider } from './context/SpotifyContext.tsx';
import Search from './pages/Search.tsx';
import Profile from './pages/Profile.tsx';
import Logout from './pages/Logout.tsx';
import Header from './components/Header.tsx';
import SpotifyMiniPlayer from './components/SpotifyMiniPlayer.tsx';
import LikedTracksPage from './pages/LikedTrack.tsx';
import TopTracks from './pages/TopTracks.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SpotifyProvider>
        <Header />
        <main className="min-h-screen bg-black text-white pb-32">
          <Routes>
            <Route path="/top" element={<TopTracks />} />
            <Route path="/liked" element={<LikedTracksPage />} />
            <Route path="/" element={<App />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
          <SpotifyMiniPlayer />
        </main>
      </SpotifyProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
