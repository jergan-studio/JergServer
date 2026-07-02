/**
 * server.js
 * Core WebSocket Network Router Logic
 */
const { WebSocketServer } = require('ws');

function initializeJergServer(serverInstance) {
    // Attach the WebSocket server to the existing HTTP instance
    const wss = new WebSocketServer({ server: serverInstance });

    console.log("[JergServer Engine] WebSocket layer attached successfully.");

    wss.on('connection', (ws, req) => {
        const ip = req.socket.remoteAddress;
        console.log(`[JergServer Network] New player handshake established from: ${ip}`);

        // Handle incoming game packets from the Eaglercraft/Pocket client
        ws.on('message', (message) => {
            // Relay packets to other connected users or handle game loop logic here
            // This is a standard pass-through structure for proxy configurations
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === 1) {
                    client.send(message);
                }
            });
        });

        ws.on('close', () => {
            console.log(`[JergServer Network] Player disconnected from: ${ip}`);
        });

        ws.on('error', (error) => {
            console.error(`[JergServer Error] Socket fault tracked: ${error.message}`);
        });
    });

    return wss;
}

module.exports = { initializeJergServer };
