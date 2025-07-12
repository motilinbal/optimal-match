/**
 * Calculates the Gower distance matrix between two datasets.
 * @param {Object[]} dataX - The first dataset (e.g., primary items).
 * @param {Object[]} dataY - The second dataset (e.g., reserve items).
 * @param {Object} config - Configuration object.
 * @param {string[]} config.features - The list of feature keys to use for comparison.
 * @param {boolean[]} config.isCategorical - A boolean array indicating if the feature at the corresponding index is categorical.
 * @returns {number[][]} A 2D array (matrix) of Gower distances.
 */
export function gowerMatrix(dataX, dataY, config) {
    if (!dataX.length || !dataY.length) {
        return [[]];
    }

    const { features, isCategorical } = config;
    const allData = [...dataX, ...dataY];

    // Step 1: Pre-compute the ranges for all numerical features.
    const ranges = features.map((feature, i) => {
        if (isCategorical[i]) {
            return null; // No range for categorical features.
        }
        const values = allData.map(d => d[feature]);
        const max = Math.max(...values);
        const min = Math.min(...values);
        return max - min;
    });

    // Step 2: Iterate through each pair of records to build the cost matrix.
    const distanceMatrix = [];
    for (let i = 0; i < dataX.length; i++) {
        distanceMatrix[i] = [];
        for (let j = 0; j < dataY.length; j++) {
            let totalSimilarity = 0;
            const recordX = dataX[i];
            const recordY = dataY[j];

            // Step 3: Calculate per-feature similarity and aggregate.
            for (let k = 0; k < features.length; k++) {
                const feature = features[k];
                let similarity = 0;

                if (isCategorical[k]) {
                    // Categorical similarity is 1 if equal, 0 otherwise.
                    similarity = (recordX[feature] === recordY[feature]) ? 1 : 0;
                } else {
                    const range = ranges[k];
                    // Handle the case where the range is 0 (all values are the same).
                    if (range === 0) {
                        similarity = 1;
                    } else {
                        const diff = Math.abs(recordX[feature] - recordY[feature]);
                        similarity = 1 - (diff / range);
                    }
                }
                totalSimilarity += similarity;
            }

            // Step 4: Calculate final distance for the pair.
            const averageSimilarity = totalSimilarity / features.length;
            distanceMatrix[i][j] = 1 - averageSimilarity;
        }
    }

    return distanceMatrix;
}