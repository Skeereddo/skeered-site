import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDiscord, FaEnvelope } from 'react-icons/fa';

const AboutSection = styled(motion.section)`
  min-height: 100vh;
  padding: 100px 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ImageContainer = styled(motion.div)`
  flex: 1;
`;

const Avatar = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const Content = styled(motion.div)`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--accent-color);
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Button = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ServerButton = styled(Button)`
  background: #5865F2;
  color: white;
  box-shadow: 0 4px 15px rgba(88, 101, 242, 0.4);
`;

const DirectContactButton = styled(Button)`
  background: transparent;
  color: var(--text-color);
  border: 2px solid var(--accent-color);

  &:hover {
    background: var(--accent-color);
    color: white;
  }
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

const About = () => {
  return (
    <AboutSection
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ImageContainer variants={itemVariants}>
        <Avatar src="/placeholder-avatar.jpg" alt="Skeered" />
      </ImageContainer>
      <Content>
        <motion.div variants={itemVariants}>
          <Title>About Me</Title>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Description>
            I'm Skeered, a Roblox scripter with over 4 years of experience in game development.
          </Description>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Description>
            Specialized in backend scripting (systems, logic, performance), but I also work on frontend development.
          </Description>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Description>
            I work passionately on high-quality projects and often collaborate with other creators to bring unique experiences to players.
          </Description>
        </motion.div>
        <ButtonGroup>
          <ServerButton 
            href="https://discord.gg/rVCFxVpf29"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDiscord size={20} />
            Join Server
          </ServerButton>
          <DirectContactButton
            href="https://discord.com/users/skeered"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEnvelope size={20} />
            Direct Message
          </DirectContactButton>
        </ButtonGroup>
      </Content>
    </AboutSection>
  );
};

export default About; 