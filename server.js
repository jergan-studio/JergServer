/**
 * JergServer Template - Render Test Environment (v1.2.0)
 * Dual-Mode Engine Setup: Survival & Creative
 */
const WebSocket = require('ws');
const Config = require('./Config.js'); 

const PORT = process.env.PORT || 8080;

// Validate that a supported mode is active
const validModes = ['survival', 'creative'];
const activeMode = validModes.includes(Config.mode.toLowerCase()) ? Config.mode.toLowerCase() : 'survival';

const server = new WebSocket.Server({ port: PORT }, () => {
    console.log(`\n==================================================`);
    console.log(`  [JergServer] Core Engine Online!`);
    console.log(`  Active Framework Mode: ${activeMode.toUpperCase()}`);
    console.log(`  Anti-Knockoff Protection: ${Config.allowKnockoffs ? 'DISABLED' : 'ENABLED'}`);
    console.log(`  Listening on port: ${PORT}`);
    console.log(`==================================================\n`);
});

const activeSessions = new Map();

server.on('connection', (socket, req) => {
    const clientIP = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const origin = req.headers['origin'] || '';
    
    // --- ANTI-KNOCKOFF SECURITY FEATURE ---
    const isKnockoff = origin.includes('knockoff-arcade') || userAgent.includes('MalformedClient');

    if (!Config.allowKnockoffs && isKnockoff) {
        console.log(`[SECURITY] Terminated connection attempt from a knockoff client layout. IP: ${clientIP}`);
        socket.close(4003, "JergServer Error: Knockoff client configurations are not permitted.");
        return;
    }
    // --------------------------------------

    const sessionID = Math.random().toString(36).substring(2, 9);
    // Dynamic username prefix mapping matching the running config environment
    const prefix = activeMode === 'creative' ? 'JergCreative' : 'JergSurvival';
    const mockUsername = `${prefix}_${Math.floor(1000 + Math.random() * 9000)}`;

    console.log(`[Handshake] Verified client connection to ${activeMode} from ${clientIP} (${mockUsername})`);

    // Basic inventory/ability adjustments based on the active mode configuration
    const playerPermissions = {
        username: mockUsername,
        canFly: activeMode === 'creative',
        invulnerable: activeMode === 'creative'
    };

    activeSessions.set(sessionID, {
        socket: socket,
        profile: playerPermissions
    });

    // Core network event packet processing loop
    socket.on('message', (message) => {
        console.log(`[${mockUsername} Input Stream]: ${message.length} bytes processed under ${activeMode} rules.`);
    });

    socket.on('close', () => {
        console.log(`[Disconnect] ${mockUsername} disconnected from the ${activeMode} stream.`);
        activeSessions.delete(sessionID);
    });

    socket.on('error', (err) => {
        console.error(`[Session Error - ${mockUsername}]:`, err.message);
    });
});
