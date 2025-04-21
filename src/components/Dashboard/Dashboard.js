import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const DashboardContainer = styled(motion.div)`
  max-width: 800px;
  margin: 120px auto 0;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 10px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProductCard = styled(motion.div)`
  background: #2a2a2a;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DownloadButton = styled(motion.button)`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const Dashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPurchases();
  }, [user, navigate]);

  const fetchPurchases = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(
        'https://misty-frog-d87f.zucconichristian36.workers.dev/api/user/purchases',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch purchases');
      }

      const data = await response.json();
      console.log('Purchases data:', data); // Debug log
      setPurchases(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (productId) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await fetch(
        `https://misty-frog-d87f.zucconichristian36.workers.dev/api/download?file=${encodeURIComponent(productId)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `${productId}.rbxl`;

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <h2>Loading your purchases...</h2>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Your Purchases</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {loading ? (
        <p>Loading your purchases...</p>
      ) : purchases.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>You haven't made any purchases yet.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/shop')}
            style={{
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Browse Shop
          </motion.button>
        </div>
      ) : (
        <ProductGrid>
          {purchases.map((purchase) => (
            <ProductCard
              key={purchase.id}
              whileHover={{ scale: 1.02 }}
            >
              <h3>{purchase.product_id}</h3>
              <p>Purchased: {new Date(purchase.purchase_date).toLocaleDateString()}</p>
              <DownloadButton
                onClick={() => handleDownload(purchase.product_id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download
              </DownloadButton>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 