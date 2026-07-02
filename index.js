/**
 * index.js
 * Main Execution Entry Point
 */
const http = require('http');
const { initializeJergServer } = require('./server');

const PORT = process.env.PORT || 8080;

// Create HTTP server to satisfy Render health checks
const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('3D JergServer Engine: Active and Operational');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the 3D Chat server layer
initializeJergServer(server);

server.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`[JergServer Boot] 3D World / Chat Live on port: ${PORT}`);
    console.log(`===================================================`);
});
