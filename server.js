const express = require('express');
const cors = require('cors');
const net = require('net');

const app = express();
app.use(cors());

app.get('/check-port', (req, res) => {
  const { ip, port } = req.query;
  const portNum = parseInt(port, 10);

  if (!ip || !portNum || portNum < 1 || portNum > 65535) {
    return res.status(400).json({ error: 'Invalid IP or port' });
  }

  const socket = new net.Socket();
  socket.setTimeout(3000);

  socket.on('connect', () => {
    socket.destroy();
    res.json({ open: true, ip, port: portNum });
  });

  socket.on('timeout', () => {
    socket.destroy();
    res.json({ open: false, ip, port: portNum, reason: 'timeout' });
  });

  socket.on('error', () => {
    socket.destroy();
    res.json({ open: false, ip, port: portNum, reason: 'closed' });
  });

  socket.connect(portNum, ip);
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Port checker running on port ${PORT}`);
});
