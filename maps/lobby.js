// Example modification inside server.js to parse maps dynamically:
const fs = require('fs');
if (fs.existsSync(`./maps/${activeMode}.json`)) {
    const mapData = JSON.parse(fs.readFileSync(`./maps/${activeMode}.json`, 'utf8'));
    console.log(`[JergServer Map Loader] Successfully injected custom layout with blocks length: ${mapData.blocks.length}`);
}
