import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HeroSection = styled(motion.section)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: 0 2rem;
`;

const HeroContent = styled(motion.div)`
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Tagline = styled.p`
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
`;

const CTAButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  background: var(--accent-color);
  color: white;
  border-radius: 5px;
  transition: transform 0.2s;
`;

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <HeroSection
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <HeroContent>
        <motion.div variants={itemVariants}>
          <Title>Skeered</Title>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Tagline>Roblox Scripter & Game Developer</Tagline>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CTAButton
            onClick={() => navigate('/portfolio')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Discover My Work
          </CTAButton>
        </motion.div>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;