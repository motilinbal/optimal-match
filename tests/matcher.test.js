// tests/matcher.test.js
import { findOptimalAssignments } from '../src/matcher.js';

console.log('Running Matcher tests...');

function testMatcherFunctionExists() {
    console.log('  - Test 1: findOptimalAssignments function should exist');
    const passed = typeof findOptimalAssignments === 'function';
    if (passed) {
        console.log('    ✅ PASSED');
    } else {
        console.error('    ❌ FAILED');
    }
}

testMatcherFunctionExists();