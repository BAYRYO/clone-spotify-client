import React from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from './AppLayout';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthCallback from './pages/AuthCallback';
import { SpotifyProvider } from './context/SpotifyContext';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import LikedTracksPage from './pages/LikedTrack';
import TopTracks from './pages/TopTracks';
import Home from './pages/Home';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SpotifyProvider>
        <AppLayout>
          <Routes>
            <Route path="/top" element={<TopTracks />} />
            <Route path="/liked" element={<LikedTracksPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </AppLayout>
      </SpotifyProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
