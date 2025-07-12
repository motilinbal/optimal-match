// src/matcher.js

import { gowerMatrix } from './gower.js';
import { hungarian } from './lib/hungarian.js'; // Import the new library

/**
 * Finds the optimal one-to-one assignments between two datasets.
 * @param {Object[]} dataX - The primary dataset.
 * @param {Object[]} dataY - The reserve dataset.
 * @param {Object} config - The Gower distance configuration.
 * @returns {number[][]} An array of optimal pairs, e.g., [[primaryIndex, reserveIndex], ...]
 */
export function findOptimalAssignments(dataX, dataY, config) {
    const costMatrix = gowerMatrix(dataX, dataY, config);

    if (!costMatrix || !costMatrix.length || !costMatrix[0]?.length) {
        return [];
    }

    // Pad the matrix to be square if it's not, as this implementation requires it.
    const R = costMatrix.length;
    const C = costMatrix[0].length;
    if (R !== C) {
        const dim = Math.max(R, C);
        let paddedMatrix = Array.from({ length: dim }, () => new Array(dim).fill(Infinity));
        for (let i = 0; i < R; i++) {
            for (let j = 0; j < C; j++) {
                paddedMatrix[i][j] = costMatrix[i][j];
            }
        }
        return hungarian(paddedMatrix).filter(a => a[0] < R && a[1] < C);
    }
    
    return hungarian(costMatrix);
}