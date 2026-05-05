require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const cropRoutes = require('./routes/cropRoutes');
const extractRoutes = require('./routes/extractRoutes');

const app  = express();
const PORT = 5001;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/api', cropRoutes);
app.use('/api', extractRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});