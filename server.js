/**
 * server.js
 * 3D Engine, Chat Stream Router & Map Injector
 */
const { WebSocketServer } = require('ws');
// Load the map structure into the server memory
const ForestMap = require('./map/forest.js'); 

function initializeJergServer(serverInstance) {
    const wss = new WebSocketServer({ server: serverInstance });
    console.log("[JergServer Engine] 3D Chat & Map Engine Activated.");

    wss.on('connection', (ws, req) => {
        const ip = req.socket.remoteAddress;
        console.log(`[JergServer] Player entered 3D space from: ${ip}`);

        // Immediately send the Forest map structure to the player upon successful handshake
        const mapPayload = JSON.stringify({
            type: "MAP_INIT",
            data: ForestMap
        });
        ws.send(mapPayload);

        // Handle active structural movement, chat, and block updates
        ws.on('message', (data, isBinary) => {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === 1) {
                    client.send(data, { binary: isBinary });
                }
            });
        });

        ws.on('close', () => {
            console.log(`[JergServer] Player left the environment.`);
        });
    });

    return wss;
}

module.exports = { initializeJergServer };
