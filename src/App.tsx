import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EpisodeList from './components/pages/EpisodeList';
import EpisodePlayer from './components/pages/EpisodePlayer';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EpisodeList />} />
        <Route path="/episode/:season/:episode" element={<EpisodePlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;