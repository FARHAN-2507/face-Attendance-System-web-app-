// File: server.js
const WebSocket = require('ws');
const http = require('http');

// Create HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({ status: 'ok' }));
  }
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection_established',
    message: 'Successfully connected to WebSocket server'
  }));

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    
    try {
      // Echo the message back to client
      ws.send(JSON.stringify({
        type: 'message_response',
        message: 'Server received: ' + message.toString()
      }));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
  console.log(`Health check endpoint available at http://localhost:${PORT}/health`);
});