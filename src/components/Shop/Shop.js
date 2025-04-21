import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaBox, FaList, FaGift, FaTicketAlt, FaBell, FaStore, FaChevronDown, FaInfoCircle, FaMagic, FaCogs, FaArchway, FaRecycle, FaLink, FaCode, FaUser, FaDatabase, FaBook, FaChevronUp, FaChevronLeft, FaChevronRight, FaDiscord } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import Cart from '../Cart/Cart';

const ShopSection = styled.section`
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
  color: var(--text-secondary);
  max-width: 800px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
`;

const ProductCard = styled.div`
  background: var(--secondary-color);
  border-radius: 15px;
  position: relative;
  transition: transform 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
`;

const MediaSection = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 15px 15px 0 0;
  width: 100%;
  padding-top: 56.25%;
`;

const ProductContent = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DocsControls = styled.div`
  position: absolute;
  bottom: 2px;
  left: 2rem;
  z-index: 10;
`;

const Badge = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background: ${props => props.isMainProduct ? 'white' : props.backgroundColor};
  color: ${props => props.isMainProduct ? 'var(--accent-color)' : 'white'};
  z-index: 2;
`;

const DocsButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: ${props => props.isMainProduct ? 'white' : 'var(--accent-color)'};
  color: ${props => props.isMainProduct ? 'var(--accent-color)' : 'white'};
  border: none;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: ${props => props.isMainProduct ? 'white' : 'var(--accent-color)'};
`;

const ProductPrice = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--accent-color);
  margin-bottom: 1.5rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  color: var(--text-secondary);

  svg {
  color: var(--accent-color);
  }
`;

const BuyButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const DocsSection = styled.div`
  margin-top: 4rem;
  padding: 2rem;
  background: var(--secondary-color);
  border-radius: 15px;
`;

const DocsHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const DocsTitle = styled.h3`
  font-size: 2rem;
  color: var(--accent-color);
  margin-bottom: 1rem;
`;

const DocsNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  background: var(--background);
  padding: 1rem;
  border-radius: 10px;
`;

const TabGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TabGroupLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--secondary-color);
`;

const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DocTab = styled(motion.button)`
  padding: 0.6rem 1rem;
  background: ${props => props.active ? 'var(--accent-color)' : 'var(--secondary-color)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : 'var(--accent-color-light)'};
    color: white;
  }
`;

const DocContent = styled(motion.div)`
  background: var(--background);
  padding: 2rem;
  border-radius: 10px;
  overflow-x: auto;
`;

const CodeBlock = styled.pre`
  background: #1e1e1e;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  
  code {
    color: #d4d4d4;
    font-family: 'Consolas', monospace;
  }
`;

const ModuleTitle = styled.h4`
  font-size: 1.3rem;
  color: var(--accent-color);
  margin: 2rem 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FunctionName = styled.h5`
  font-size: 1.1rem;
  color: var(--text-color);
  margin: 1.5rem 0 0.5rem;
  font-family: 'Consolas', monospace;
`;

const ShowDocsButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem auto;
  padding: 0.8rem 1.5rem;
  background: transparent;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--accent-color);
    color: white;
  }

  svg {
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const ModuleSection = styled.div`
  margin-bottom: 3rem;
`;

const FunctionList = styled.div`
  margin-left: 1.5rem;
`;

const FunctionBlock = styled.div`
  margin-bottom: 2rem;
`;

const Tag = styled.span`
  background: var(--accent-color);
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 0.5rem;
`;

const ArchitectureBox = styled.div`
  background: var(--accent-color);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 2rem 0;
  color: white;
`;

const ArchitectureTitle = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ArchitectureList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.8rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ImageGallery = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--secondary-color);
`;

const GalleryImage = styled(motion.img)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const GalleryNav = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.4rem;
  z-index: 2;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px 8px;
  border-radius: 12px;
`;

const GalleryDot = styled.button`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const GalleryButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'prev' ? 'left: 1rem;' : 'right: 1rem;'}
  background: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
  opacity: 0.7;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    opacity: 1;
  }

  svg {
    font-size: 14px;
  }
`;

const AddToCartButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CartIcon = styled(motion.div)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #333;
  padding: 1rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  
  span {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
`;

const SupportBanner = styled.div`
  background: var(--accent-color);
  padding: 1rem 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const SupportText = styled.div`
  color: white;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const DiscordButton = styled.a`
  background: white;
  color: var(--accent-color);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Shop = () => {
  const [activeDoc, setActiveDoc] = useState('overview');
  const [showDocs, setShowDocs] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cart } = useCart();

  const shopImages = [
    {
      url: '/images/shop/promotional.png',
      alt: 'Promotional Image'
    },
  ];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % shopImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + shopImages.length) % shopImages.length);
  };

  const products = [
    {
      id: 'shop_gifting_system',
      title: "Shop & Gifting System",
      description: "Complete shop system with gifting functionality, code redemption, and notifications.",
      price: 2499, // Price in cents (0.50)
      displayPrice: 24.99, // Price in dollars for display
      downloadPath: "/downloads/shop-&-gifting-system.rbxl", // Updated path to match actual file location
      features: [
        "SSA (Single Script Architecture)",
        "Gifting System",
        "Code Redemption",
        "Notification System",
        "UI Animations",
        "Data Saving"
      ],
      badge: "Best Seller",
      badgeColor: "#FFD700",
      media: {
        type: "gallery",
        images: shopImages
      }
    }
  ];

  const renderDocContent = () => {
    switch(activeDoc) {
      case 'overview':
        return (
          <DocContent>

            <ArchitectureBox>
              <ArchitectureTitle>
                <FaArchway /> Architecture Highlights
              </ArchitectureTitle>
              <ArchitectureList>
                <li>
                  <FaCheck /> Built with SSA (Single Script Architecture)
                </li>
                <li>
                  <FaRecycle /> Uses Trove for efficient connection management and cleanup
                </li>
                <li>
                  <FaLink /> Modules are connected through the shared table for seamless integration
                </li>
              </ArchitectureList>
            </ArchitectureBox>

            <ModuleTitle>
              <FaBox /> System Overview
            </ModuleTitle>
            <p>This system includes a Shop UI, Code Redemption, Product/Gifting system, and Notification system, designed for Roblox games. All modules are client-side and plug into each other to create a complete in-game store experience.</p>
            
            <ModuleTitle>
              <FaList /> Module Integration
            </ModuleTitle>
            <ul>
              <li>ShopManager loads your products and assigns actions for Buy/Gift buttons</li>
              <li>GiftingManager opens a UI to choose a player and confirm the gift</li>
              <li>CodesManager handles redeeming codes in the shop</li>
              <li>NotificationsManager displays messages after buying or redeeming</li>
              <li>UIAnims makes the entire UI feel alive and smooth</li>
              <li>UIController manages and connects UI elements to their behaviors</li>
            </ul>

    
          </DocContent>
        );
      
      case 'gifting':
        return (
          <DocContent>
            <ModuleTitle>
              <FaGift /> GiftingManager <Tag>Client > Objects > GiftingManager</Tag>
            </ModuleTitle>
            <p>Handles the gifting system UI, loading friends into the list, and sending selected gift info to the server.</p>
            
            <FunctionList>
              <FunctionBlock>
                <FunctionName>:Initialize()</FunctionName>
                <p>Reserved for future initialization logic.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:Start()</FunctionName>
                <p>Gets access to the Gifting and Shop UI from PlayerGui.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:OpenGiftUI(productId, productName, productPrice)</FunctionName>
                <ul>
                  <li>Opens the gifting UI when the player clicks the "Gift" button</li>
                  <li>Disables the Shop UI while gifting UI is open</li>
                  <li>Adds click listeners to Buy and Cancel buttons</li>
                </ul>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:CleanUI()</FunctionName>
                <ul>
                  <li>Clears the UI and previous listeners</li>
                  <li>Resets the gift target and button visuals</li>
                </ul>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:LoadPlayers(productName, productPrice)</FunctionName>
                <ul>
                  <li>Loads all available players into the gift target list</li>
                  <li>Skips the local player</li>
                  <li>Dynamically adds player buttons using a template</li>
                </ul>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'codes':
        return (
          <DocContent>
            <ModuleTitle>
              <FaTicketAlt /> CodesManager <Tag>Client > Objects > CodesManager</Tag>
            </ModuleTitle>
            <p>Manages code redemption from the shop interface.</p>
            
            <FunctionList>
              <FunctionBlock>
                <FunctionName>:Start()</FunctionName>
                <ul>
                  <li>Listens for the "Redeem" button</li>
                  <li>Sends the code to the server</li>
                  <li>Displays a notification depending on the result (success, wrong code, or already redeemed)</li>
                </ul>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'notifications':
        return (
          <DocContent>
            <ModuleTitle>
              <FaBell /> NotificationsManager <Tag>Client > Objects > NotificationsManager</Tag>
            </ModuleTitle>
            <p>Handles showing short pop-up messages to the player (like code redemption results).</p>
            
            <FunctionList>
              <FunctionBlock>
                <FunctionName>:Start()</FunctionName>
                <p>Gets access to the Notification UI.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:AddNotification(message, color)</FunctionName>
                <ul>
                  <li>Shows a temporary notification with given text and color</li>
                  <li>Stays for 2 seconds, then fades out</li>
                </ul>
                <CodeBlock>
                  <code>
                    {`shared.NotificationsManager:AddNotification("Code Redeemed!", Color3.fromRGB(0,255,0))`}
                  </code>
                </CodeBlock>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'shop':
        return (
          <DocContent>
            <ModuleTitle>
              <FaStore /> ShopManager <Tag>Client > Objects > ShopManager</Tag>
            </ModuleTitle>
            <p>Handles loading all shop items (gamepasses and dev products), UI category switching, and managing "Buy"/"Gift" buttons.</p>
            
            <FunctionList>
              <FunctionBlock>
                <FunctionName>:LoadAllProducts(shopUI)</FunctionName>
                <p>Loads all gamepasses and products into the shop.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:LoadGamepass(gamepassFrame)</FunctionName>
                <ul>
                  <li>Loads price and actions for a gamepass</li>
                  <li>Handles "Buy" and "Gift" button interactions</li>
                </ul>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:InitializeCategories(shopUI)</FunctionName>
                <p>Sets up tab navigation (e.g., Products, Gamepasses, Codes)</p>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'animations':
        return (
          <DocContent>
            <ModuleTitle>
              <FaMagic /> UIAnims <Tag>Client > Objects > UIAnims</Tag>
            </ModuleTitle>
            <p>Creates smooth animations for buttons and frames.</p>
            
            <FunctionList>
              <FunctionBlock>
                <FunctionName>:Hover(btn, size, enterMulti)</FunctionName>
                <p>Grows the button when hovered.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:ClickDown(btn, size, downMulti)</FunctionName>
                <p>Shrinks button when clicked.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:Toggle(frame, extra)</FunctionName>
                <p>Toggles a UI frame (on/off) with blur and position animation.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:FullAnimate(button)</FunctionName>
                <p>Automatically hooks up hover, click, and unhover for a button.</p>
                <CodeBlock>
                  <code>
                    {`shared.UIAnims.FullAnimate(button)`}
                  </code>
                </CodeBlock>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'ui-controller':
        return (
          <DocContent>
            <ModuleTitle>
              <FaCogs /> UIController <Tag>Client > Classes > UIController</Tag>
            </ModuleTitle>
            <p>Manages UI elements that have been tagged with "UI" using Roblox's CollectionService. It connects them to behavior scripts and adds animated effects and functionality like button clicks and mouse events.</p>

            <ModuleTitle>
              <FaList /> Key Features
            </ModuleTitle>
            <ul>
              <li>Auto-detect UI elements with the "UI" tag</li>
              <li>Auto-assign behavior scripts</li>
              <li>Support for buttons (hover, click, activate)</li>
              <li>Uses Trove to manage cleanup of connections</li>
              <li>Supports hot-adding/removing UI elements</li>
            </ul>

            <FunctionList>
              <FunctionBlock>
                <FunctionName>class:Initialize()</FunctionName>
                <ul>
                  <li>Loads all modules under UIBehaviours and stores them in class.Behaviours</li>
                  <li>Must be called before Start</li>
                </ul>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>class:Start()</FunctionName>
                <ul>
                  <li>Sets up listeners for all existing and future instances tagged with "UI"</li>
                  <li>Calls class.new() on each UI instance</li>
                </ul>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>class.new(instance)</FunctionName>
                <ul>
                  <li>Links the instance to its behavior module</li>
                  <li>Attaches events (like mouse enter, click) if it's a GuiButton</li>
                  <li>Starts any logic defined in Start() method of the behavior</li>
                </ul>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>class:Destroy(instance)</FunctionName>
                <p>Removes event connections and cleans up memory using Trove.</p>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'codes-server':
        return (
          <DocContent>
            <ModuleTitle>
              <FaTicketAlt /> CodesManager <Tag>Server > Classes > CodesManager</Tag>
            </ModuleTitle>
            <p>Handles code redemption logic and validation on the server side.</p>

            <FunctionList>
              <FunctionBlock>
                <FunctionName>:Start()</FunctionName>
                <p>Sets up the RedeemCode RemoteFunction handler.</p>
                <CodeBlock>
                  <code>
                    {`ReplicatedStorage.Remotes.RedeemCode.OnServerInvoke = function(player,code)
    return class.RedeemCode(player,code)
end`}
                  </code>
                </CodeBlock>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>.RedeemCode(player, code)</FunctionName>
                <ul>
                  <li>Checks if code exists in shared.Codes</li>
                  <li>Verifies if player hasn't already redeemed it</li>
                  <li>Returns status: "Wrong Code", "Already Redeemed", or "Success"</li>
                </ul>
                <CodeBlock>
                  <code>
                    {`if not shared.Codes[code] then
    return "Wrong Code"
end

if player.Data.Codes:FindFirstChild(code) then
    return "Already Redeemed"
end`}
                  </code>
                </CodeBlock>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>.AddCodeInstance(player, code)</FunctionName>
                <p>Creates a BoolValue under player.Data.Codes to mark code as redeemed.</p>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'marketplace-server':
        return (
          <DocContent>
            <ModuleTitle>
              <FaStore /> Marketplace <Tag>Server > Classes > Marketplace</Tag>
            </ModuleTitle>
            <p>Handles all marketplace transactions including gamepass purchases, developer products, and the gifting system.</p>

            <FunctionList>
              <FunctionBlock>
                <FunctionName>:Initialize()</FunctionName>
                <ul>
                  <li>Sets up ProcessReceipt handler</li>
                  <li>Handles gamepass purchase completion</li>
                  <li>Sets up gift target selection</li>
                </ul>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:ProcessReceipt(receiptInfo)</FunctionName>
                <ul>
                  <li>Validates purchase and player</li>
                  <li>Handles gifting logic if player is gifting</li>
                  <li>Grants product to correct player</li>
                </ul>
                <CodeBlock>
                  <code>
                    {`local targetPlayer = player
local giftingAttribute = player:GetAttribute("Gifting")
if giftingAttribute then
    if not Players:FindFirstChild(giftingAttribute) then
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end
    targetPlayer = Players:FindFirstChild(giftingAttribute)
end`}
                  </code>
                </CodeBlock>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>.FindDeveloperProductWithID(id)</FunctionName>
                <p>Searches for products and gifting IDs in MarketplaceData.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:BoughtProduct(player, product)</FunctionName>
                <p>Executes the product-specific module when purchased.</p>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'player-server':
        return (
          <DocContent>
            <ModuleTitle>
              <FaUser /> Player <Tag>Server > Classes > Player</Tag>
            </ModuleTitle>
            <p>Manages player data using ProfileService with separate stores for testing and production.</p>

            <FunctionList>
              <FunctionBlock>
                <FunctionName>:Initialize()</FunctionName>
                <p>Sets up PlayerAdded and PlayerRemoving handlers.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:LoadData(player)</FunctionName>
                <ul>
                  <li>Creates a ProfileService session for the player</li>
                  <li>Handles data reconciliation and error cases</li>
                  <li>Sets up automatic data cleanup</li>
                </ul>
                <CodeBlock>
                  <code>
                    {`local profile = PlayerStore:StartSessionAsync("Player_" .. player.UserId, {
    Cancel = function()
        return player.Parent ~= Players
    end,
})`}
                  </code>
                </CodeBlock>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:ReleaseData()</FunctionName>
                <p>Safely ends the ProfileService session when player leaves.</p>
              </FunctionBlock>

              <FunctionBlock>
                <FunctionName>:GetStoreName()</FunctionName>
                <p>Returns "Test" in Studio, "Live" in production.</p>
              </FunctionBlock>
            </FunctionList>
          </DocContent>
        );

      case 'codes-data':
        return (
          <DocContent>
            <ModuleTitle>
              <FaDatabase /> Codes <Tag>Server > Data > Codes</Tag>
            </ModuleTitle>
            <p>Stores all redeemable codes and their reward functions. This is where you can add new codes for players to redeem.</p>

            <ModuleTitle>
              <FaCode /> Code Structure
            </ModuleTitle>
            <CodeBlock>
              <code>
                {`local Codes = {
    Test = function(player)
        warn(player.Name .. " has redeem this code")
    end,
    -- Add more codes here:
    WELCOME2024 = function(player)
        -- Give welcome bonus
    end,
    FREECOINS = function(player)
        -- Give free coins
    end,
}

return Codes`}
              </code>
            </CodeBlock>

            <ModuleTitle>
              <FaInfoCircle /> How to Add Codes
            </ModuleTitle>
            <ul>
              <li>Each code is a key in the Codes table</li>
              <li>The value is a function that runs when the code is redeemed</li>
              <li>The function receives the player who redeemed the code</li>
              <li>You can add any reward logic inside the function</li>
            </ul>
          </DocContent>
        );
    }
  };

  const renderMedia = (product) => {
    if (product.media?.type === "gallery") {
      return (
        <ImageGallery>
          <AnimatePresence mode="wait">
            <GalleryImage
              key={currentImage}
              src={product.media.images[currentImage].url}
              alt={product.media.images[currentImage].alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              loading="lazy"
            />
          </AnimatePresence>

          {product.media.images.length > 1 && (
            <>
              <GalleryButton direction="prev" onClick={prevImage}>
                <FaChevronLeft />
              </GalleryButton>
              <GalleryButton direction="next" onClick={nextImage}>
                <FaChevronRight />
              </GalleryButton>

              <GalleryNav>
                {product.media.images.map((_, index) => (
                  <GalleryDot
                    key={index}
                    active={currentImage === index}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </GalleryNav>
            </>
          )}
        </ImageGallery>
      );
    } else if (product.media?.type === "video") {
      return (
        <ProductVideo
          autoPlay
          loop
          muted
          playsInline
          poster={product.media.thumbnail}
        >
          <source src={product.media.url} type="video/mp4" />
        </ProductVideo>
      );
    } else if (product.media?.type === "image") {
      return (
        <ProductImage 
          src={product.media.url} 
          alt={product.title} 
        />
      );
    }
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <ShopSection>
      <CartIcon
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsCartOpen(true)}
      >
        🛒
        {cartItemsCount > 0 && <span>{cartItemsCount}</span>}
      </CartIcon>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <Title>Shop</Title>
      <Description>
        All Products are complete with full source code, detailed documentation, and support.
      </Description>

      <ProductsGrid>
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductCard>
              <MediaSection>
                {renderMedia(product)}

                <Badge 
                  isMainProduct={product.id === 'shop_gifting_system'}
                  backgroundColor={product.badgeColor}
                >
                  {product.badge}
                </Badge>

                {product.id === 'shop_gifting_system' && (
                  <DocsControls>
                    {showDocs ? (
                      <DocsButton
                        isMainProduct={true}
                        onClick={() => setShowDocs(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaChevronUp /> Hide Documentation
                      </DocsButton>
                    ) : (
                      <DocsButton
                        isMainProduct={true}
                        onClick={() => setShowDocs(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaBook /> View Documentation
                      </DocsButton>
                    )}
                  </DocsControls>
                )}
              </MediaSection>

              <ProductContent>
                <ProductTitle isMainProduct={false}>
                  {product.title}
                </ProductTitle>
                
                <ProductPrice>${product.displayPrice.toFixed(2)}</ProductPrice>
                
                <FeaturesList>
                  {product.features.map((feature, index) => (
                    <Feature key={index}>
                      <FaCheck /> {feature}
                    </Feature>
                  ))}
                </FeaturesList>
                
                <AddToCartButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </AddToCartButton>
              </ProductContent>
            </ProductCard>
          </motion.div>
        ))}
      </ProductsGrid>

      {showDocs && (
        <motion.div>
          <DocsSection>
            <DocsHeader>
              <DocsTitle>Documentation</DocsTitle>
              <p>Complete documentation for the Shop & Gifting System</p>
            </DocsHeader>

            <DocsNav>
              <TabGroup>
                <TabGroupLabel>Overview</TabGroupLabel>
                <TabList>
                  <DocTab
                    active={activeDoc === 'overview'}
                    onClick={() => setActiveDoc('overview')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    System Overview
                  </DocTab>
                </TabList>
              </TabGroup>

              <TabGroup>
                <TabGroupLabel>Client Modules</TabGroupLabel>
                <TabList>
                  <DocTab
                    active={activeDoc === 'gifting'}
                    onClick={() => setActiveDoc('gifting')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Gifting System
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'codes'}
                    onClick={() => setActiveDoc('codes')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Codes System
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'notifications'}
                    onClick={() => setActiveDoc('notifications')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Notifications
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'shop'}
                    onClick={() => setActiveDoc('shop')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Shop System
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'animations'}
                    onClick={() => setActiveDoc('animations')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    UI Animations
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'ui-controller'}
                    onClick={() => setActiveDoc('ui-controller')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    UI Controller
                  </DocTab>
                </TabList>
              </TabGroup>

              <TabGroup>
                <TabGroupLabel>Server Modules</TabGroupLabel>
                <TabList>
                  <DocTab
                    active={activeDoc === 'codes-server'}
                    onClick={() => setActiveDoc('codes-server')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Codes System
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'marketplace-server'}
                    onClick={() => setActiveDoc('marketplace-server')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Marketplace
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'player-server'}
                    onClick={() => setActiveDoc('player-server')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Player Data
                  </DocTab>
                  <DocTab
                    active={activeDoc === 'codes-data'}
                    onClick={() => setActiveDoc('codes-data')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Codes Data
                  </DocTab>
                </TabList>
              </TabGroup>
            </DocsNav>

            {renderDocContent()}
          </DocsSection>
        </motion.div>
      )}

      <SupportBanner>
        <SupportText>
          <h3>Need Help? Join Our Discord Community!</h3>
          <p>Get instant support, updates, and connect with other developers</p>
        </SupportText>
        <DiscordButton 
          href="https://discord.gg/rVCFxVpf29" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <FaDiscord /> Join Discord Server
        </DiscordButton>
      </SupportBanner>
    </ShopSection>
  );
};

export default Shop; 