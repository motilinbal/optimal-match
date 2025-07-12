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


// Test 3: Distance between two completely different records should be 1
function testDifferentRecords() {
    console.log('  - Test 3: Distance between two completely different records should be 1');

    const dataX = [{ name: 'A', age: 20 }];
    const dataY = [{ name: 'B', age: 30 }];

    const config = {
        features: ['name', 'age'],
        isCategorical: [true, false]
    };

    // Calculation:
    // name similarity = 0 (since 'A' !== 'B')
    // age similarity = 1 - (|20-30| / (30-20)) = 1 - (10/10) = 0
    // average similarity = (0 + 0) / 2 = 0
    // distance = 1 - 0 = 1
    const expected = [[1]];
    const actual = gowerMatrix(dataX, dataY, config);

    if (JSON.stringify(actual) === JSON.stringify(expected)) {
        console.log('    ✅ PASSED');
    } else {
        console.error(`    ❌ FAILED: Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
    }
}


// Test 4: Should correctly compute a 1x2 matrix with mixed similarities
function testNonSquareMatrix() {
    console.log('  - Test 4: Should correctly compute a 1x2 matrix');

    const dataX = [{ item: 'A', value: 10, group: 'X' }];
    const dataY = [
        { item: 'B', value: 20, group: 'X' }, // Partially similar
        { item: 'A', value: 10, group: 'X' }  // Identical
    ];

    const config = {
        features: ['item', 'value', 'group'],
        isCategorical: [true, false, true]
    };

    const actual = gowerMatrix(dataX, dataY, config);

    // Expected distance to first record:
    // item sim = 0; value sim = 1 - (|10-20|/10) = 0; group sim = 1
    // avg sim = (0+0+1)/3 = 1/3. Distance = 1 - 1/3 = 2/3
    const expectedDist1 = 2 / 3;

    // Expected distance to second record:
    // item sim = 1; value sim = 1; group sim = 1
    // avg sim = 3/3 = 1. Distance = 1 - 1 = 0
    const expectedDist2 = 0;
    
    // Check values with a tolerance for floating point math
    const passed = 
        Math.abs(actual[0][0] - expectedDist1) < 0.00001 &&
        Math.abs(actual[0][1] - expectedDist2) < 0.00001;

    if (passed) {
        console.log('    ✅ PASSED');
    } else {
        console.error(`    ❌ FAILED: Expected [[${expectedDist1}, ${expectedDist2}]] but got ${JSON.stringify(actual)}`);
    }
}


// Run all tests
testGowerFunctionExists();
testIdenticalRecords();
testDifferentRecords();
testNonSquareMatrix(); // Add this line