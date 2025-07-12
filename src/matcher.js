// src/matcher.js

import { gowerMatrix } from './gower.js';
import { munkres } from './lib/munkres.js';

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

    // The correctly bundled library handles non-square matrices automatically.
    return munkres(costMatrix);
}