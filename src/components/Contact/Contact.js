import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaDiscord, FaEnvelope, FaClock, FaGlobe } from 'react-icons/fa';

const ContactSection = styled(motion.section)`
  min-height: 100vh;
  padding: 100px 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--accent-color);
`;

const Description = styled.p`
  text-align: center;
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const InfoCard = styled(motion.div)`
  background: var(--secondary-color);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 1rem;
`;

const CardContent = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const DiscordBanner = styled(motion.div)`
  background: linear-gradient(135deg, #5865F2, var(--accent-color));
  padding: 3rem 2rem;
  border-radius: 10px;
  text-align: center;
  margin-top: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const BannerTitle = styled.h3`
  font-size: 2rem;
  color: white;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ServerButton = styled(Button)`
  background: white;
  color: #5865F2;
`;

const DirectContactButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid white;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Contact = () => {
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

  return (
    <ContactSection
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <Title>Contact Me</Title>
        <Description>
          Looking to bring your Roblox game to the next level? I'm here to help!
          Feel free to reach out through Discord for any inquiries about custom development,
          collaboration opportunities, or questions about my services.
        </Description>
      </motion.div>

      <ContactGrid>
        <InfoCard variants={itemVariants} whileHover={{ y: -10 }}>
          <IconWrapper>
            <FaDiscord />
          </IconWrapper>
          <CardTitle>Discord Username</CardTitle>
          <CardContent>skeered</CardContent>
        </InfoCard>

        <InfoCard variants={itemVariants} whileHover={{ y: -10 }}>
          <IconWrapper>
            <FaClock />
          </IconWrapper>
          <CardTitle>Response Time</CardTitle>
          <CardContent>Usually within 24 hours</CardContent>
        </InfoCard>

        <InfoCard variants={itemVariants} whileHover={{ y: -10 }}>
          <IconWrapper>
            <FaGlobe />
          </IconWrapper>
          <CardTitle>Time Zone</CardTitle>
          <CardContent>UTC+1 (CET)</CardContent>
        </InfoCard>
      </ContactGrid>

      <DiscordBanner
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <BannerTitle>Let's Work Together!</BannerTitle>
        <ButtonGroup>
          <ServerButton 
            href="https://discord.gg/rVCFxVpf29"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaDiscord size={24} />
            Join Server
          </ServerButton>
          <DirectContactButton
            href="https://discord.com/users/skeered"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEnvelope size={24} />
            Direct Message
          </DirectContactButton>
        </ButtonGroup>
      </DiscordBanner>
    </ContactSection>
  );
};

export default Contact;