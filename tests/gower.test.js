import { gowerMatrix } from '../src/gower.js';

console.log('Running Gower distance tests...');

// Test 1: Function should exist and be callable
function testGowerFunctionExists() {
    console.log('  - Test 1: gowerMatrix function should exist');
    const result = typeof gowerMatrix === 'function';
    if (result) {
        console.log('    ✅ PASSED');
    } else {
        console.error('    ❌ FAILED: gowerMatrix is not a function.');
    }
}

// Test 2: Distance between two identical records should be 0
function testIdenticalRecords() {
    console.log('  - Test 2: Distance between two identical records should be 0');

    const dataX = [{ name: 'A', age: 20 }];
    const dataY = [{ name: 'A', age: 20 }];

    const config = {
        features: ['name', 'age'],
        isCategorical: [true, false] // 'name' is categorical, 'age' is numerical
    };

    const expected = [[0]];
    const actual = gowerMatrix(dataX, dataY, config);

    // Simple array comparison for now
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log('    ✅ PASSED');
    } else {
        console.error(`    ❌ FAILED: Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    }
}


// Run all tests
testGowerFunctionExists();
testIdenticalRecords(); // Add this line