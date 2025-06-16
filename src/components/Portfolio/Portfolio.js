import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import GameCard from './GameCard';
import GroupCard from './GroupCard';
import VideoShowcase from './VideoShowcase';

const PortfolioSection = styled(motion.section)`
  min-height: 100vh;
  padding: 100px 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
  color: var(--accent-color);
`;

const SubTitle = styled.h3`
  font-size: 2rem;
  margin: 4rem 0 2rem;
  color: var(--text-color);
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const LoadingText = styled.div`
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.2rem;
  grid-column: 1 / -1;
  padding: 2rem;
`;

const DiscordBanner = styled(motion.div)`
  background: linear-gradient(135deg, var(--accent-color), #5865F2);
  margin: 3rem 0;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const BannerText = styled.h3`
  color: white;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const DiscordButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: white;
  color: #5865F2;
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

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ShowcaseNavigation = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const NavItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  color: var(--text-secondary);

  &:hover {
    color: var(--accent-color);
  }
`;

const Arrow = styled(motion.div)`
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid currentColor;
`;

const Label = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
`;

const AnimationShowcase = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const VideoWrapper = styled.div`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
    
    &::-webkit-media-controls {
      display: none !important;
    }
    
    &::-webkit-media-controls-panel {
      display: none !important;
    }
    
    &::-webkit-media-controls-play-button {
      display: none !important;
    }
    
    &::-webkit-media-controls-picture-in-picture-button {
      display: none !important;
    }
  }
`;

const VideoTitle = styled.h3`
  font-size: 1.1rem;
  margin-top: 1rem;
  color: var(--text-color);
  text-align: center;
`;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 4rem;
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

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const Portfolio = () => {
  const [gamesData, setGamesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showingContent, setShowingContent] = useState('main'); // 'main', 'animations', 'vfx'

  const groups = [
    {
      name: "Golden Games",
      games: [
        {
          title: "Multiverse KO",
          role: "Scripter"
        },
        {
          title: "Monarch",
          role: "Scripter"
        },
        {
          title: "Friday Night Devs",
          role: "Scripter"
        },
        {
          title: "Conqueror's Battleground",
          role: "Scripter"
        }
      ]
    }
  ];

  const games = [
    {
      title: "Boat Empire Tycoon",
      universeId: "4875171195",
      role: "Bug Fixes"
    },
    {
      title: "Dodge Stars",
      universeId: "3723094046",
      role: "Bug Fixes"
    },
    {
      title: "Murder Drones Tower Defense",
      universeId: "5837175781",
      role: "Bug Fixes"
    },
    {
      title: "City Go",
      universeId: "6879247920",
      role: "Updates"
    },
  ];

  const videos = [
    {
      title: "Dialogue System",
      description: "A fully customizable dialogue system with support for multiple characters, branching conversations, and rich text formatting. Features smooth animations and seamless integration with any game.",
      videoUrl: "/videos/dialogue-system.mp4"
    },
  ];

  const animationVideos = [
    {
      title: 'Idle Animation',
      src: '/videos/idle-animation.mp4'
    },
    {
      title: 'Sit Emote',
      src: '/videos/sit-emote.mp4'
    },
    {
      title: 'Fall Emote',
      src: '/videos/fall-emote.mp4'
    },
    {
      title: 'Ground Smash Animation',
      src: '/videos/ground-smash-animation.mp4'
    }
  ];

  useEffect(() => {
    const fetchGamesData = async () => {
      try {
        // Fetch game stats
        const universeIds = games.map(game => game.universeId).join(',');
        const statsResponse = await fetch(`https://misty-frog-d87f.zucconichristian36.workers.dev/api/games?universeIds=${universeIds}`);
        
        if (!statsResponse.ok) {
          throw new Error(`HTTP error! status: ${statsResponse.status}`);
        }

        const statsData = await statsResponse.json();

        // Fetch thumbnails
        const thumbnailsResponse = await fetch(`https://misty-frog-d87f.zucconichristian36.workers.dev/api/thumbnails?universeIds=${universeIds}`);
        
        if (!thumbnailsResponse.ok) {
          throw new Error(`HTTP error! status: ${thumbnailsResponse.status}`);
        }

        const thumbnailsData = await thumbnailsResponse.json();
        
        const combinedData = games.map(game => {
          const statsApiData = statsData.data.find(d => d.id.toString() === game.universeId);
          const thumbnailApiData = thumbnailsData.data.find(d => d.universeId.toString() === game.universeId);
          
          return {
            ...game,
            image: thumbnailApiData?.thumbnails[0]?.imageUrl || '',
            activePlayers: statsApiData ? statsApiData.playing : 0,
            totalVisits: statsApiData ? formatNumber(statsApiData.visits) : '0',
          };
        });

        setGamesData(combinedData);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setGamesData(games.map(game => ({
          ...game,
          image: '',
          activePlayers: 0,
          totalVisits: '0'
        })));
        setLoading(false);
      }
    };

    fetchGamesData();
    const interval = setInterval(fetchGamesData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PortfolioSection
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <Title>Portfolio</Title>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubTitle>🕹️ Games Contributed</SubTitle>
        <GamesGrid>
          {loading ? (
            <LoadingText>Loading games data...</LoadingText>
          ) : (
            gamesData.map((game, index) => (
              <GameCard 
                key={index} 
                {...game} 
                variants={itemVariants}
              />
            ))
          )}
        </GamesGrid>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubTitle>👥 Groups Contributed</SubTitle>
        <GroupsGrid>
          {groups.map((group, index) => (
            <GroupCard 
              key={index} 
              group={group} 
              variants={itemVariants}
            />
          ))}
        </GroupsGrid>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubTitle>🎥 Showcases</SubTitle>
        
        {/* Primo video showcase */}
        <VideoShowcase 
          {...videos[0]} 
          variants={itemVariants}
        />

        <ShowcaseNavigation>
          <NavItem
            whileHover={{ y: -2 }}
            onClick={() => setShowingContent(showingContent === 'animations' ? 'main' : 'animations')}
          >
            <Arrow 
              animate={{ rotate: showingContent === 'animations' ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            />
            <Label>Show Animation</Label>
          </NavItem>
          <NavItem
            whileHover={{ y: -2 }}
            onClick={() => setShowingContent(showingContent === 'vfx' ? 'main' : 'vfx')}
          >
            <Arrow 
              animate={{ rotate: showingContent === 'vfx' ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            />
            <Label>Show VFXs</Label>
          </NavItem>
        </ShowcaseNavigation>

        {showingContent === 'animations' && (
          <AnimationShowcase
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {animationVideos.map((video, index) => (
              <motion.div
                key={video.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VideoWrapper>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noplaybackrate"
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </VideoWrapper>
                <VideoTitle>{video.title}</VideoTitle>
              </motion.div>
            ))}
          </AnimationShowcase>
        )}

        {/* Banner Discord */}
        <DiscordBanner
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <BannerText>Want to see more?</BannerText>
          <DiscordButton 
            href="https://discord.gg/rVCFxVpf29"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
              <path fill="currentColor" d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
            </svg>
            Join Discord
          </DiscordButton>
        </DiscordBanner>

        {/* Altri video showcase */}
        {videos.slice(1).map((video, index) => (
          <VideoShowcase 
            key={index + 1}
            {...video} 
            variants={itemVariants}
          />
        ))}
      </motion.div>
    </PortfolioSection>
  );
};

export default Portfolio; 