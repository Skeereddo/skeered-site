import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background: var(--secondary-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  color: var(--text-color);
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Visits = styled.div`
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: bold;
  padding: 0.8rem;
  background: var(--accent-color);
  border-radius: 6px;
  text-align: center;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

const ActivePlayers = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
`;

const Role = styled.p`
  color: var(--accent-color);
  font-weight: bold;
  font-size: 0.9rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const GameCard = ({ title, image, activePlayers, totalVisits, role, variants }) => {
  return (
    <Card variants={variants}>
      <Image src={image} alt={title} />
      <Content>
        <Title>{title}</Title>
        <Stats>
          <Visits>
            👀 {totalVisits} visits
          </Visits>
          <ActivePlayers>
            👥 {activePlayers} active players
          </ActivePlayers>
        </Stats>
        <Role>{role}</Role>
      </Content>
    </Card>
  );
};

export default GameCard; 