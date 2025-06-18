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
import Login from './pages/Login.tsx';
import Header from './components/Header.tsx';
import SpotifyMiniPlayer from './components/SpotifyMiniPlayer.tsx';
import LikedTracksPage from './pages/LikedTrack.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SpotifyProvider>
      <BrowserRouter>
        <Header />
        <main className="min-h-screen bg-black text-white pb-32">
          <Routes>
            <Route path="/liked" element={<LikedTracksPage />} />
            <Route path="/" element={<App />} />
            <Route path="/logout" element={<Logout />} />
            <Route path='/login' element={<Login />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
          <SpotifyMiniPlayer />
        </main>
      </BrowserRouter>
    </SpotifyProvider>
  </React.StrictMode>,
);
