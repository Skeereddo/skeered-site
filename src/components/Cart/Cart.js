import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

const CartContainer = styled(motion.div)`
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: #1a1a1a;
  padding: 2rem;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  z-index: 1001;
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const CartItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #333;
`;

const RemoveButton = styled(motion.button)`
  background: #ff4444;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  cursor: pointer;
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  background: #4CAF50;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  margin-top: 2rem;
  cursor: pointer;
  font-size: 1.1rem;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const TotalSection = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 2px solid #333;
`;

const PaymentSection = styled.div`
  margin-top: 2rem;
`;

const PaymentInfo = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  
  h4 {
    margin: 0 0 0.5rem 0;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
    color: #888;
  }
`;

const ProcessingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #888;
`;

const CartItem = ({ item, onRemove }) => {
  const itemTotal = (item.price * item.quantity) / 100; // Convert cents to dollars

  return (
    <CartItemContainer>
      <div>
        <h3>{item.title}</h3>
        <p>${(item.price / 100).toFixed(2)} each</p>
        <p>Quantity: {item.quantity}</p>
      </div>
      <div>
        <p>${itemTotal.toFixed(2)}</p>
        <RemoveButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(item.id)}
        >
          Remove
        </RemoveButton>
      </div>
    </CartItemContainer>
  );
};

const Cart = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const cartTotal = getCartTotal() / 100;

  const handlePaymentSuccess = async (orderId) => {
    try {
      const response = await fetch('https://misty-frog-d87f.zucconichristian36.workers.dev/api/capture-paypal-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID: orderId }),
      });

      if (response.ok) {
        // Include purchased items in the URL
        const items = cart.map(item => ({
          title: item.title,
          downloadPath: item.downloadPath
        }));
        const encodedItems = encodeURIComponent(JSON.stringify(items));
        clearCart();
        onClose();
        navigate(`/download?orderId=${orderId}&items=${encodedItems}`);
      } else {
        console.error('Payment capture failed');
        alert('The payment could not be completed. Please try again or use a different payment method.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('There was an error processing your payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <CartContainer
      initial={{ x: 400 }}
      animate={{ x: isOpen ? 0 : 400 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <CartHeader>
        <h2>Your Cart</h2>
        <CloseButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          ×
        </CloseButton>
      </CartHeader>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onRemove={removeFromCart}
            />
          ))}
          
          <TotalSection>
            <h3>Total: ${cartTotal.toFixed(2)}</h3>
          </TotalSection>

          {isProcessing ? (
            <ProcessingMessage>
              Processing your payment...
            </ProcessingMessage>
          ) : (
            <PaymentSection>
              <PaymentInfo>
                <h4>Secure Payment with PayPal</h4>
                <p>You can pay with PayPal or credit/debit card</p>
              </PaymentInfo>
              
              <PayPalButtons
                fundingSource={undefined}
                createOrder={async () => {
                  try {
                    const response = await fetch('https://misty-frog-d87f.zucconichristian36.workers.dev/api/create-paypal-order', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        items: cart,
                      }),
                    });

                    const data = await response.json();
                    if (data.error) {
                      throw new Error(data.error);
                    }
                    return data.id;
                  } catch (error) {
                    console.error('Error creating order:', error);
                    alert('Could not create order. Please try again.');
                    throw error;
                  }
                }}
                onApprove={async (data, actions) => {
                  setIsProcessing(true);
                  await handlePaymentSuccess(data.orderID);
                }}
                onCancel={() => {
                  setIsProcessing(false);
                  alert('Payment cancelled. You can try again when ready.');
                }}
                onError={(err) => {
                  console.error('PayPal error:', err);
                  setIsProcessing(false);
                  alert('There was an error with PayPal. Please try again.');
                }}
                style={{
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "paypal"
                }}
              />
            </PaymentSection>
          )}
        </>
      )}
    </CartContainer>
  );
};

export default Cart; 