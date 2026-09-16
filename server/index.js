require('dotenv').config();
const express = require('express');
const db = require('./models');
const uploadRoutes = require('./routes/upload');
const reconcileRoutes = require('./routes/reconcile');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/upload', uploadRoutes);
app.use('/reconcile', reconcileRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});