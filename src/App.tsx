import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import SeasonSelector from './components/pages/SeasonSelector/SeasonSelector';
import EpisodePlayer from './components/pages/EpisodePlayer/EpisodePlayer';
import SeasonDetail from './components/pages/SeasonDetail/SeasonDetail';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SeasonSelector />} />
            <Route path="season/:seasonNumber" element={<SeasonDetail />} />
            <Route path="season/:seasonNumber/episode/:episodeNumber" element={<EpisodePlayer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;