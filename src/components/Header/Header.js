import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import Cart from '../Cart/Cart';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: #1a1a1a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: #4CAF50;
    transition: width 0.3s;
  }

  &:hover {
    color: #4CAF50;
    &:after {
      width: 100%;
    }
  }
`;

const CartButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: -1rem;
    height: 24px;
    width: 1px;
    background: #333;
  }
`;

const UserInfo = styled.div`
  color: #4CAF50;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    transition: color 0.2s;

    &:hover {
      color: #ff4444;
    }
  }
`;

const Header = () => {
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('user_email');
  const isAuthenticated = !!userEmail;

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    window.location.reload();
  };

  return (
    <HeaderContainer>
      <Logo to="/">SKEERED</Logo>
      <Nav>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/prices">Prices</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/shop">Shop</NavLink>
        {isAuthenticated && <NavLink to="/dashboard">Dashboard</NavLink>}
        
        <CartButton
          onClick={() => setIsCartOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaShoppingCart size={20} />
          {cart.length > 0 && <CartCount>{cart.length}</CartCount>}
        </CartButton>

        <AuthSection>
          {isAuthenticated ? (
            <UserInfo>
              {userEmail}
              <button onClick={handleLogout}>Logout</button>
            </UserInfo>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </AuthSection>
      </Nav>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </HeaderContainer>
  );
};

export default Header;