// src/worker.js

import { gowerMatrix } from './gower.js';
// Import our new, reliable hungarian algorithm implementation.
import { hungarian } from './lib/hungarian.js';

self.onmessage = function (event) {
    console.log('Worker: Message received.');
    const { primaryData, reserveData, config } = event.data;

    self.postMessage({ type: 'progress', message: 'Calculating distance matrix...', percent: 0 });
    const costMatrix = gowerMatrix(primaryData, reserveData, config, (progress) => {
        self.postMessage({ type: 'progress', message: 'Calculating distance matrix...', percent: progress });
    });

    if (!costMatrix || !costMatrix.length || !costMatrix[0]?.length) {
        self.postMessage({ type: 'complete', assignments: [] });
        return;
    }

    self.postMessage({ type: 'progress', message: 'Finding optimal assignments...', percent: 98 });
    
    // The new library handles rectangular matrices correctly by design.
    const assignments = hungarian(costMatrix);
    
    self.postMessage({ type: 'complete', assignments: assignments });
};