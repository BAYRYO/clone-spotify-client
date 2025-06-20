import Header from './components/Header';
import SpotifyMiniPlayer from './components/SpotifyMiniPlayer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white pb-32">
        {children}
      </main>
      <SpotifyMiniPlayer />
    </>
  );
}
