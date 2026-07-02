/**
 * JergServer Framework Engine (v1.3.0)
 * Integrated Core Components: Multiplayer Synchronization, Global Chat, and Custom Configuration Mapping
 */
const WebSocket = require('ws');
const Config = require('./Config.js'); 

const PORT = process.env.PORT || 8080;

// Validate state mode parameters from Config
const activeMode = ['survival', 'creative'].includes(Config.mode.toLowerCase()) ? Config.mode.toLowerCase() : 'survival';

const server = new WebSocket.Server({ port: PORT }, () => {
    console.log(`\n==================================================`);
    console.log(`  [JergServer] Multiplayer Cluster Initialized`);
    console.log(`  Active Environment Rule: ${activeMode.toUpperCase()}`);
    console.log(`  Listening on active secure channel port: ${PORT}`);
    console.log(`==================================================\n`);
});

// Primary collection of in-memory active player metadata structures
const activePlayers = new Map();

server.on('connection', (socket, req) => {
    const clientIP = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const origin = req.headers['origin'] || '';
    
    // --- ANTI-KNOCKOFF FILTER LAYER ---
    const isKnockoff = origin.includes('knockoff-arcade') || userAgent.includes('MalformedClient');
    if (!Config.allowKnockoffs && isKnockoff) {
        console.log(`[SECURITY] Blocked non-compliant knockoff pipeline from: ${clientIP}`);
        socket.close(4003, "JergServer Error: Target client layout not supported.");
        return;
    }

    // Unique runtime parameters initialization
    const playerId = Math.random().toString(36).substring(2, 9);
    const prefix = activeMode === 'creative' ? 'JergCreative' : 'JergSurvival';
    const username = `${prefix}_${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(`[Join Event] ${username} successfully connected to the multiplayer matrix.`);

    // Define player state tracking variables
    const playerState = {
        id: playerId,
        username: username,
        socket: socket,
        position: { x: 0.0, y: 64.0, z: 0.0 },
        yaw: 0.0,
        pitch: 0.0
    };

    // Store state internally in-memory
    activePlayers.set(playerId, playerState);

    // --- PACKET PIPELINE BROADCAST SYSTEM ---
    // Welcome message to the connecting user
    sendSystemPacket(socket, {
        type: 'system_welcome',
        message: `Welcome to JergServer! You are running mode: ${activeMode}.`,
        yourId: playerId
    });

    // Notify all other online users that a new peer has initialized
    broadcastToNetwork({
        type: 'player_spawn',
        id: playerId,
        username: username,
        position: playerState.position
    }, playerId);

    // Sync all existing maps/players over to the joining player's view screen
    activePlayers.forEach((otherPlayer, otherId) => {
        if (otherId !== playerId) {
            sendSystemPacket(socket, {
                type: 'player_spawn',
                id: otherId,
                username: otherPlayer.username,
                position: otherPlayer.position
            });
        }
    });

    // Handle real-time user packets
    socket.on('message', (rawData) => {
        try {
            let dataString = rawData.toString();
            
            // Assume the test structure receives JSON telemetry frames
            if (dataString.startsWith('{')) {
                const packet = JSON.parse(dataString);
                handleClientPacket(playerState, packet);
            } else {
                // Raw binary data placeholder log for custom engine maps
                console.log(`[Binary Telemetry] Received raw map frame chunk of size: ${rawData.length} bytes`);
            }
        } catch (err) {
            // Error safety catch to keep the application loop alive
        }
    });

    socket.on('close', () => {
        console.log(`[Quit Event] User ${username} terminated connection string.`);
        activePlayers.delete(playerId);
        
        broadcastToNetwork({
            type: 'player_quit',
            id: playerId,
            username: username
        });
    });

    socket.on('error', (err) => {
        console.error(`[Socket Error - ${username}]:`, err.message);
    });
});

/**
 * Handles decoded structural server packets (Chat and Position updates)
 */
function handleClientPacket(player, packet) {
    switch (packet.type) {
        case 'chat':
            console.log(`[CHAT] <${player.username}>: ${packet.text}`);
            // Broadcast the message globally to implement functional chat mechanics
            broadcastToNetwork({
                type: 'chat_message',
                sender: player.username,
                text: packet.text
            });
            break;

        case 'position_update':
            // Continuously synchronize positioning frames across client engines
            player.position.x = packet.x || player.position.x;
            player.position.y = packet.y || player.position.y;
            player.position.z = packet.z || player.position.z;
            
            broadcastToNetwork({
                type: 'player_move',
                id: player.id,
                position: player.position
            }, player.id);
            break;
            
        default:
            break;
    }
}

/**
 * Dispatches an event payload string down a single socket connection
 */
function sendSystemPacket(socket, payload) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
    }
}

/**
 * Distributes structural updates across all active connections on the server
 */
function broadcastToNetwork(payload, ignoreId = null) {
    const serializedData = JSON.stringify(payload);
    activePlayers.forEach((player, id) => {
        if (id !== ignoreId && player.socket.readyState === WebSocket.OPEN) {
            player.socket.send(serializedData);
        }
    });
}
