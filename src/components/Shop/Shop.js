import styled from 'styled-components';
import { motion } from 'framer-motion';

const ShopSection = styled.section`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const ComingSoonWrapper = styled(motion.div)`
  text-align: center;
`;

const ComingSoonText = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

const SubText = styled.p`
  font-size: 1.5rem;
  color: var(--text-secondary);
`;

const Shop = () => {
  return (
    <ShopSection>
      <ComingSoonWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ComingSoonText>Coming Soon</ComingSoonText>
        <SubText>New products are on the way!</SubText>
      </ComingSoonWrapper>
    </ShopSection>
  );
};

export default Shop; 