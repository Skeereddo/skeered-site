import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(42, 42, 42, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 2rem;
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(NavLink)`
  font-size: 1.5rem;
  font-weight: bold;
`;

const MenuItems = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary-color);
    padding: 1rem;
  }
`;

const MenuItem = styled(NavLink)`
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;

  &.active {
    color: var(--accent-color);
  }

  &:hover {
    color: var(--accent-color);
  }
`;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">Skeered</Logo>
        <MenuItems isOpen={isOpen}>
          <MenuItem to="/" end>Home</MenuItem>
          <MenuItem to="/about">About Me</MenuItem>
          <MenuItem to="/portfolio">Portfolio</MenuItem>
          <MenuItem to="/prices">Prices</MenuItem>
          <MenuItem to="/contact">Contact</MenuItem>
          <MenuItem to="/shop">Shop</MenuItem>
        </MenuItems>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;