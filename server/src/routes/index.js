const express = require('express');
const logRoutes = require('./logRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy', timestamp: new Date() });
});

router.use('/logs', logRoutes);

module.exports = router;
