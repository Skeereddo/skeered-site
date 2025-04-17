import styled from 'styled-components';
import { motion } from 'framer-motion';

const PricesSection = styled(motion.section)`
  min-height: 100vh;
  padding: 100px 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--accent-color);
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-secondary);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const PackagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const Package = styled(motion.div)`
  background: var(--secondary-color);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  border: ${props => props.isPopular ? '2px solid var(--accent-color)' : 'none'};
`;

const Badge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background: ${props => props.type === 'popular' ? 'var(--accent-color)' : 
               props.type === 'basic' ? '#4CAF50' : '#ff9800'};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const PackageTitle = styled.h3`
  font-size: 1.8rem;
  margin: 1rem 0;
  color: var(--text-color);
`;

const Price = styled.div`
  font-size: 2.5rem;
  margin: 1.5rem 0;
  color: var(--accent-color);
  font-weight: bold;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
`;

const Feature = styled.li`
  margin: 1rem 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: "✓";
    color: var(--accent-color);
    font-weight: bold;
  }
`;

const LongTermBanner = styled(motion.div)`
  background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
  padding: 3rem 2rem;
  border-radius: 10px;
  text-align: center;
  margin-top: 4rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const BannerTitle = styled.h3`
  font-size: 2rem;
  color: white;
  margin-bottom: 1.5rem;
`;

const BannerDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
`;

const PaymentOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const PaymentOption = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  border-radius: 8px;
  backdrop-filter: blur(5px);
`;

const ContactBanner = styled(motion.div)`
  background: var(--secondary-color);
  padding: 2.5rem;
  border-radius: 10px;
  text-align: center;
  margin-top: 4rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const ContactTitle = styled.h3`
  font-size: 2rem;
  color: var(--text-color);
  margin-bottom: 1.5rem;
`;

const DiscordButton = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: var(--accent-color);
  color: white;
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

const Prices = () => {
  const packages = [
    {
      title: "Basic",
      price: "$25",
      badge: "Starter",
      features: [
        "Simple system modifications",
        "Bug fixes",
        "Basic functionality implementation",
        "24-48 hour delivery"
      ]
    },
    {
      title: "Standard",
      price: "$50",
      badge: "Most Popular",
      isPopular: true,
      features: [
        "Complete script systems",
        "Medium complexity features",
        "Code optimization",
        "Documentation included",
        "3-5 days delivery"
      ]
    },
    {
      title: "Advanced",
      price: "from $100",
      badge: "Enterprise",
      features: [
        "Complex custom systems",
        "Complete backend solutions",
        "Advanced optimization",
        "Priority support",
        "1-2 weeks delivery"
      ]
    }
  ];

  return (
    <PricesSection
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={itemVariants}>
        <Title>Prices</Title>
        <Description>
          Choose the package that best fits your project needs. All packages include direct communication and support throughout the development process.
        </Description>
      </motion.div>
      
      <PackagesGrid>
        {packages.map((pkg, index) => (
          <Package
            key={index}
            variants={itemVariants}
            isPopular={pkg.isPopular}
            whileHover={{ translateY: -10 }}
          >
            {pkg.badge && (
              <Badge type={pkg.isPopular ? 'popular' : pkg.title.toLowerCase()}>
                {pkg.badge}
              </Badge>
            )}
            <PackageTitle>{pkg.title}</PackageTitle>
            <Price>{pkg.price}</Price>
            <Features>
              {pkg.features.map((feature, i) => (
                <Feature key={i}>{feature}</Feature>
              ))}
            </Features>
          </Package>
        ))}
      </PackagesGrid>

      <LongTermBanner
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <BannerTitle>Long Term Collaboration</BannerTitle>
        <BannerDescription>
          For established games or long-term projects, I offer flexible payment options:
        </BannerDescription>
        <PaymentOptions>
          <PaymentOption>🎮 Revenue Share</PaymentOption>
          <PaymentOption>💎 Robux Payments</PaymentOption>
          <PaymentOption>🤝 Custom Arrangements</PaymentOption>
        </PaymentOptions>
        <BannerDescription style={{ marginTop: '2rem' }}>
          Let's discuss the best payment model for your project. Revenue share percentages 
          and Robux payments are negotiable based on project scope and potential.
        </BannerDescription>
      </LongTermBanner>

      <ContactBanner
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
      >
        <ContactTitle>Want to get started?</ContactTitle>
        <DiscordButton 
          href="discord://discord.com/users/skeered"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
            <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/>
          </svg>
          Contact me on Discord
        </DiscordButton>
      </ContactBanner>
    </PricesSection>
  );
};

export default Prices; 