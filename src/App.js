import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Portfolio from './components/Portfolio/Portfolio';
import Prices from './components/Prices/Prices';
import Contact from './components/Contact/Contact';
import Shop from './components/Shop/Shop';
import GlobalStyle from './styles/GlobalStyle';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Hero />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Header />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;