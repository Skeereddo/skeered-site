import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DownloadContainer = styled(motion.div)`
  max-width: 800px;
  margin: 120px auto 0;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2a2a2a;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
  }
`;

const FileInfo = styled.div`
  h3 {
    color: #fff;
    margin: 0;
    font-size: 1.1rem;
  }
`;

const DownloadButton = styled(motion.button)`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: #45a049;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  margin: 1rem 0;
  padding: 0.5rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #4CAF50;
  text-align: center;
  margin: 1rem 0;
  padding: 0.5rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 4px;
`;

const Download = () => {
  const [downloading, setDownloading] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');
  const items = JSON.parse(decodeURIComponent(searchParams.get('items') || '[]'));

  const handleDownload = async (title) => {
    setError(null);
    setSuccessMessage(null);
    setDownloading(prev => ({ ...prev, [title]: true }));

    try {
      const response = await fetch(
        `https://misty-frog-d87f.zucconichristian36.workers.dev/api/download?orderId=${orderId}&file=${encodeURIComponent(title)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(await response.text() || 'Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title.toLowerCase().replace(/ /g, '-') + '.rbxl';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setSuccessMessage(`Successfully downloaded ${title}!`);
    } catch (error) {
      console.error('Download error:', error);
      setError(error.message || 'Failed to download file. Please try again.');
    } finally {
      setDownloading(prev => ({ ...prev, [title]: false }));
    }
  };

  if (!orderId) {
    return <Navigate to="/shop" replace />;
  }

  return (
    <DownloadContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>Thank you for your purchase!</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      <FileList>
        {items.map((item, index) => (
          <FileItem key={index}>
            <FileInfo>
              <h3>{item.title}</h3>
            </FileInfo>
            <DownloadButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={downloading[item.title]}
              onClick={() => handleDownload(item.title)}
            >
              {downloading[item.title] ? 'Downloading...' : 'Download'}
            </DownloadButton>
          </FileItem>
        ))}
      </FileList>
    </DownloadContainer>
  );
};

export default Download; 