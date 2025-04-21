import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

const EmptyCart = styled.div`
  text-align: center;
  padding: 2rem;
  color: #888;
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 2rem;

  p {
    margin-bottom: 1rem;
    color: #888;
  }
`;

const LoginButton = styled(motion.button)`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);

  const cartTotal = getCartTotal() / 100;

  useEffect(() => {
    setShowPayPal(!!user);
  }, [user]);

  const handleLogin = () => {
    localStorage.setItem('pendingCart', JSON.stringify(cart));
    onClose();
    navigate('/login');
  };

  return (
    <CartContainer
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'tween' }}
    >
      <CartHeader>
        <h2>Your Cart</h2>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </CartHeader>

      {cart.length === 0 ? (
        <EmptyCart>Your cart is empty</EmptyCart>
      ) : (
        <>
          {cart.map((item) => (
            <CartItemContainer key={item.id}>
              <div>
                <h3>{item.title}</h3>
                <p>${item.price / 100}</p>
                {item.quantity > 1 && <p>Quantity: {item.quantity}</p>}
              </div>
              <RemoveButton
                onClick={() => removeFromCart(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Remove
              </RemoveButton>
            </CartItemContainer>
          ))}

          <TotalSection>
            <h3>Total: ${cartTotal.toFixed(2)}</h3>
          </TotalSection>

          {!showPayPal ? (
            <LoginPrompt>
              <p>Please log in to complete your purchase</p>
              <LoginButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
              >
                Log In to Purchase
              </LoginButton>
            </LoginPrompt>
          ) : isProcessing ? (
            <ProcessingMessage>
              Processing your payment...
            </ProcessingMessage>
          ) : (
            <PaymentSection>
              <PayPalButtons
                createOrder={async () => {
                  try {
                    const response = await fetch(
                      'https://misty-frog-d87f.zucconichristian36.workers.dev/api/create-paypal-order',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${user.token}`
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                          items: cart,
                        }),
                      }
                    );

                    const data = await response.json();
                    if (data.error) throw new Error(data.error);
                    return data.id;
                  } catch (error) {
                    console.error('Error creating order:', error);
                    return null; // Return null instead of throwing error
                  }
                }}
                onApprove={async (data) => {
                  setIsProcessing(true);
                  try {
                    const response = await fetch(
                      'https://misty-frog-d87f.zucconichristian36.workers.dev/api/capture-paypal-payment',
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${user.token}`
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                          orderID: data.orderID
                        }),
                      }
                    );

                    if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(errorData.error || 'Payment capture failed');
                    }

                    const captureData = await response.json();
                    if (captureData.status === 'COMPLETED') {
                      clearCart();
                      onClose();
                      navigate('/dashboard');
                    } else {
                      throw new Error('Payment not completed');
                    }
                  } catch (error) {
                    console.error('Payment error:', error);
                    alert('There was an error processing your payment. Please try again.');
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                onCancel={() => {
                  // Handle PayPal popup being closed
                  console.log('Payment cancelled');
                  setIsProcessing(false);
                }}
                onError={(err) => {
                  // Handle PayPal errors
                  console.error('PayPal error:', err);
                  setIsProcessing(false);
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