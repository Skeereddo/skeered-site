import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Register
      const registerResponse = await fetch('https://misty-frog-d87f.zucconichristian36.workers.dev/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        throw new Error(data.error || 'Registration failed');
      }

      // Login
      const loginResponse = await fetch('https://misty-frog-d87f.zucconichristian36.workers.dev/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });

      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        throw new Error(data.error || 'Login failed after registration');
      }

      const loginData = await loginResponse.json();
      
      // Use the login function from AuthContext instead of directly setting localStorage
      login(email, loginData.token);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration/Login error:', err);
      setError(err.message || 'Failed to complete registration process');
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
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register</h2>
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
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      <SwitchText>
        Already have an account?{' '}
        <span onClick={() => navigate('/login')}>Login</span>
      </SwitchText>
    </LoginContainer>
  );
};

export default Register; 