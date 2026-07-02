/**
 * map/forest.js
 * Preset map data for the Forest environment
 */
const ForestMap = {
    name: "Whispering Woods",
    spawn: { x: 0, y: 4, z: 0 },
    // Simple block layout grid: [x, y, z, blockTypeID]
    // 1 = Grass, 2 = Dirt, 3 = Wood Log, 4 = Leaves
    blocks: [
        // Flat Ground Layer (Y = 0)
        [-2, 0, -2, 1], [-1, 0, -2, 1], [0, 0, -2, 1], [1, 0, -2, 1], [2, 0, -2, 1],
        [-2, 0, -1, 1], [-1, 0, -1, 1], [0, 0, -1, 1], [1, 0, -1, 1], [2, 0, -1, 1],
        [-2, 0,  0, 1], [-1, 0,  0, 1], [0, 0,  0, 1], [1, 0,  0, 1], [2, 0,  0, 1],
        [-2, 0,  1, 1], [-1, 0,  1, 1], [0, 0,  1, 1], [1, 0,  1, 1], [2, 0,  1, 1],
        [-2, 0,  2, 1], [-1, 0,  2, 1], [0, 0,  2, 1], [1, 0,  2, 1], [2, 0,  2, 1],

        // Dirt Sub-layer (Y = -1)
        [0, -1, 0, 2], [1, -1, 0, 2], [-1, -1, 0, 2],

        // A Simple Tree Structure
        [1, 1, 1, 3], // Trunk base
        [1, 2, 1, 3], // Trunk middle
        [1, 3, 1, 3], // Trunk top
        [1, 4, 1, 4], // Leaves center
        [0, 4, 1, 4], // Leaves left
        [2, 4, 1, 4], // Leaves right
        [1, 4, 0, 4], // Leaves front
        [1, 4, 2, 4]  // Leaves back
    ]
};

// Export for both Node.js environment and browser script loading
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ForestMap;
} else {
    window.ForestMap = ForestMap;
}
