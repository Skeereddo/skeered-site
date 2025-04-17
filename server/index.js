const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Enable CORS for our React app
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Route to fetch Roblox game data
app.get('/api/games', async (req, res) => {
  try {
    const { universeIds } = req.query;
    const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

// New route to fetch thumbnails
app.get('/api/thumbnails', async (req, res) => {
  try {
    const { universeIds } = req.query;
    const response = await fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds}&size=768x432&format=Png&isCircular=false`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
