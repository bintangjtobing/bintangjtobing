import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import RippleBackground from './components/RippleBackground';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Links from './pages/Links';
import CaseStudyIndex from './pages/CaseStudyIndex';
import CaseStudyDetail from './pages/CaseStudyDetail';

export default function App() {
  return (
    <AppProvider>
      <RippleBackground />
      <ChatWidget />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/links" element={<Links />} />
          <Route path="/case-study" element={<CaseStudyIndex />} />
          <Route path="/case-study/:slug" element={<CaseStudyDetail />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
