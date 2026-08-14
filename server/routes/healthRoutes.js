const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

router.get('/ready', (req, res) => {
  const dbState = mongoose.connection.readyState;
  if (dbState === 1) {
    res.status(200).json({ status: 'READY', database: 'CONNECTED' });
  } else {
    res.status(503).json({ status: 'DOWN', database: 'DISCONNECTED' });
  }
});

router.get('/metrics', (req, res) => {
  res.status(200).json({
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    cpuUsage: process.cpuUsage()
  });
});

module.exports = router;
