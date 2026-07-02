/**
 * index.js
 * Production Entry Point & Render Runtime Configuration
 */
const http = require('http');
const { initializeJergServer } = require('./server');

// Render passes a dynamic port via process.env.PORT. Fallback to 8080 for local testing.
const PORT = process.env.PORT || 8080;

// Create standard HTTP server layer to satisfy Render's web service health checks
const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('JergServer Status: Operational');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Initialize the WebSocket engine on top of our HTTP server context
initializeJergServer(server);

// Boot the network listener
server.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`[JergServer Boot] Online and listening on port: ${PORT}`);
    console.log(`===================================================`);
});
