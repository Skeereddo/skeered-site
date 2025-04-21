import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const LoginContainer = styled(motion.div)`
  max-width: 400px;
  margin: 120px auto 0;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #333;
  background: #2a2a2a;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem;
  border-radius: 4px;
  border: none;
  background: #4CAF50;
  color: white;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 0.5rem;
  text-align: center;
`;

const SwitchText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: #888;

  span {
    color: #4CAF50;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { clearCart, addToCart } = useCart();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://misty-frog-d87f.zucconichristian36.workers.dev/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(email, data.token);

      // Restore pending cart if it exists
      const pendingCart = localStorage.getItem('pendingCart');
      if (pendingCart) {
        clearCart(); // Clear existing cart first
        const cartItems = JSON.parse(pendingCart);
        cartItems.forEach(item => addToCart(item));
        localStorage.removeItem('pendingCart'); // Clean up
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
      <SwitchText>
        Don't have an account?{' '}
        <span onClick={() => navigate('/register')}>Register</span>
      </SwitchText>
    </LoginContainer>
  );
};

export default Login; 