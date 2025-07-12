// tests/matcher.test.js

import { findOptimalAssignments } from '../src/matcher.js';
import * as gower from '../src/gower.js';

console.log('Running Matcher tests...');

function testSimpleAssignment() {
    console.log('  - Test 1: Should find the optimal assignment');

    const simpleCostMatrix = [
        [1, 100],
        [100, 0]
    ];
    
    const originalGowerMatrix = gower.gowerMatrix;
    gower.gowerMatrix = () => simpleCostMatrix;
    
    const expected = [[0, 0], [1, 1]];
    const actual = findOptimalAssignments([], [], {});

    gower.gowerMatrix = originalGowerMatrix;
    
    actual.sort((a, b) => a[0] - b[0]);
    expected.sort((a, b) => a[0] - b[0]);

    const passed = JSON.stringify(actual) === JSON.stringify(expected);

    if (passed) {
        console.log('    ✅ PASSED');
    } else {
        console.error(`    ❌ FAILED: Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    }
}

testSimpleAssignment();