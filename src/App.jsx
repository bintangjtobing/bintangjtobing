import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Links from './pages/Links';

export default function App() {
  return (
    <AppProvider>
      <ParticleBackground />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/links" element={<Links />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
