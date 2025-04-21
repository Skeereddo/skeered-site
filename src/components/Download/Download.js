import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const DownloadContainer = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 8px;
  color: white;
  text-align: center;
`;

const DownloadButton = styled(motion.a)`
  display: inline-block;
  background: #4CAF50;
  color: white;
  padding: 1rem 2rem;
  border-radius: 4px;
  text-decoration: none;
  margin: 1rem;
  cursor: pointer;
  border: none;
  font-size: 1.1rem;

  &:hover {
    background: #45a049;
  }
`;

const DownloadGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
`;

const DownloadItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DownloadPage = () => {
  const [isValid, setIsValid] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('orderId');
    const items = params.get('items');
    
    if (orderId && items) {
      try {
        const decodedItems = JSON.parse(decodeURIComponent(items));
        setPurchasedItems(decodedItems);
        setOrderDetails({
          orderId,
          purchaseDate: new Date().toLocaleString(),
          status: 'completed'
        });
        setIsValid(true);
      } catch (error) {
        console.error('Error parsing items:', error);
        setIsValid(false);
      }
    }
  }, [location]);

  const handleDownload = (downloadPath, title) => {
    try {
      const link = document.createElement('a');
      link.href = downloadPath;
      link.download = title.toLowerCase().replace(/\s+/g, '-') + '.rbxl';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download the file. Please try again or contact support.');
    }
  };

  return (
    <DownloadContainer>
      {isValid ? (
        <>
          <h1>Thank you for your purchase!</h1>
          {orderDetails && (
            <div>
              <p>Order ID: {orderDetails.orderId}</p>
              <p>Purchase Date: {orderDetails.purchaseDate}</p>
              <p>Status: {orderDetails.status}</p>
            </div>
          )}
          
          <DownloadGrid>
            {purchasedItems.map((item, index) => (
              <DownloadItem key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>Click the button to download</p>
                </div>
                <DownloadButton
                  onClick={() => handleDownload(item.downloadPath, item.title)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download
                </DownloadButton>
              </DownloadItem>
            ))}
          </DownloadGrid>

          <p>
            <small>
              If you have any issues with the downloads, please contact support
            </small>
          </p>
        </>
      ) : (
        <h1>Invalid download link</h1>
      )}
    </DownloadContainer>
  );
};

export default DownloadPage; 