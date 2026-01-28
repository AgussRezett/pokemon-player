import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import EpisodeList from './components/pages/EpisodeList/EpisodeList';
import EpisodePlayer from './components/pages/EpisodePlayer/EpisodePlayer';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EpisodeList />} />
          <Route path="/episode/:season/:episode" element={<EpisodePlayer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
