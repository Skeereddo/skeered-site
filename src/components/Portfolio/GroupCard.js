import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGamepad, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

const Card = styled(motion.div)`
  background: var(--secondary-color);
  border-radius: 15px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: 100%;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
`;

const GroupIcon = styled.div`
  width: 80px;
  height: 80px;
  background: var(--accent-color);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  video {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const GroupInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
`;

const GroupTitle = styled.h3`
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
`;

const ToggleButton = styled(motion.div)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--background);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const GamesList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  overflow: hidden;
`;

const GameItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem;
  background: var(--background);
  border-radius: 12px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const GameIcon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--accent-color);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const GameInfo = styled.div`
  flex: 1;
`;

const GameTitle = styled.h4`
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0 0 0.3rem 0;
`;

const GameRole = styled.p`
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
`;

const GroupCard = ({ group }) => {
  const [showDefaultIcon, setShowDefaultIcon] = useState(false);
  const [showGameDefaultIcons, setShowGameDefaultIcons] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatFileName = (name) => {
    return name
      .toLowerCase()
      .replace(/[']/g, '')
      .replace(/\s+/g, '-');
  };

  const groupIconPath = `/icons/groups/${formatFileName(group.name)}.png`;
  const groupVideoPath = `/icons/groups/${formatFileName(group.name)}.mp4`;

  const handleImageError = (gameIndex) => {
    if (gameIndex === undefined) {
      setShowDefaultIcon(true);
    } else {
      setShowGameDefaultIcons(prev => ({
        ...prev,
        [gameIndex]: true
      }));
    }
  };

  return (
    <Card
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <GroupHeader onClick={() => setIsExpanded(!isExpanded)}>
        <GroupIcon>
          {group.name === "Golden Games" ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noplaybackrate"
            >
              <source src={groupVideoPath} type="video/mp4" />
            </video>
          ) : showDefaultIcon ? (
            <FaGamepad />
          ) : (
            <img 
              src={groupIconPath} 
              alt={`${group.name} icon`}
              onError={() => handleImageError()}
            />
          )}
        </GroupIcon>
        <GroupInfo>
          <GroupTitle>{group.name}</GroupTitle>
          <ToggleButton
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown />
          </ToggleButton>
        </GroupInfo>
      </GroupHeader>

      <AnimatePresence>
        {isExpanded && (
          <GamesList
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {group.games.map((game, index) => {
              const gameIconPath = `/icons/games/${formatFileName(game.title)}.png`;
              return (
                <GameItem key={index}>
                  <GameIcon>
                    {showGameDefaultIcons[index] ? (
                      <FaGamepad />
                    ) : (
                      <img 
                        src={gameIconPath} 
                        alt={`${game.title} icon`}
                        onError={() => handleImageError(index)}
                      />
                    )}
                  </GameIcon>
                  <GameInfo>
                    <GameTitle>{game.title}</GameTitle>
                    <GameRole>{game.role}</GameRole>
                  </GameInfo>
                </GameItem>
              );
            })}
          </GamesList>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default GroupCard; 