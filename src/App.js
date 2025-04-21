import React, { useState, useEffect } from 'react';
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
import { CartProvider } from './context/CartContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import DownloadPage from './components/Download/Download';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('https://misty-frog-d87f.zucconichristian36.workers.dev/api/paypal-config');
        const config = await response.json();
        setPaypalConfig(config);
      } catch (error) {
        console.error('Failed to fetch PayPal config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  if (!paypalConfig) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ff4444'
      }}>
        Failed to load PayPal configuration. Please refresh the page.
      </div>
    );
  }

  return (
    <AuthProvider>
      <PayPalScriptProvider options={{ 
        "client-id": paypalConfig.clientId,
        currency: "USD",
        components: "buttons",
        intent: "capture"
      }}>
        <CartProvider>
          <Router>
            <GlobalStyle />
            <Header />
            <AnimatedRoutes />
          </Router>
        </CartProvider>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}

export default App;