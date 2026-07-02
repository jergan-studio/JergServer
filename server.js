/**
 * server.js
 * 3D Engine & Chat Stream Router
 */
const { WebSocketServer } = require('ws');

function initializeJergServer(serverInstance) {
    const wss = new WebSocketServer({ server: serverInstance });
    
    // Store connected players globally to manage chat routing
    const players = new Set();

    console.log("[JergServer Engine] 3D Chat Layer activated.");

    wss.on('connection', (ws, req) => {
        players.add(ws);
        const ip = req.socket.remoteAddress;
        console.log(`[JergServer] Player entered the 3D space from: ${ip}`);

        // Handle game packets and chat streams
        ws.on('message', (data, isBinary) => {
            
            // Broadcast world data, 3D coordinates, and chat messages to everyone else
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === 1) {
                    client.send(data, { binary: isBinary });
                }
            });
        });

        ws.on('close', () => {
            players.delete(ws);
            console.log(`[JergServer] Player left the environment.`);
        });

        ws.on('error', (err) => {
            console.error(`[Network Error] ${err.message}`);
        });
    });

    return wss;
}

module.exports = { initializeJergServer };
