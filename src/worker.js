// src/worker.js

// Import the core matching function from the engine we built in Phase 1.
import { findOptimalAssignments } from './matcher.js';

// Listen for messages from the main UI thread.
self.onmessage = function (event) {
    console.log('Worker: Message received from main script.');
    
    // Extract the data and configuration from the event.
    const { primaryData, reserveData, config } = event.data;

    // Run the computationally intensive matching process.
    const assignments = findOptimalAssignments(primaryData, reserveData, config);

    console.log('Worker: Calculation complete. Posting results back to main script.');
    
    // Send the final assignments back to the main UI thread.
    self.postMessage({
        assignments: assignments
    });
};