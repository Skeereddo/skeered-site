import styled from 'styled-components';
import { motion } from 'framer-motion';

const ShowcaseContainer = styled(motion.div)`
  background: var(--secondary-color);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  background: #1a1a1a;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  display: block;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Title = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--accent-color);
`;

const Description = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
`;

const VideoShowcase = ({ title, description, videoUrl, variants }) => {
  return (
    <ShowcaseContainer variants={variants}>
      <VideoContainer>
        <StyledVideo
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/videos/dialogue-system.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </StyledVideo>
      </VideoContainer>
      <Content>
        <Title>Dialogue System</Title>
        <Description>
          A fully customizable dialogue system with support for multiple characters,
          branching conversations, and rich text formatting. Features smooth animations
          and seamless integration with any game.
        </Description>
      </Content>
    </ShowcaseContainer>
  );
};

export default VideoShowcase; 