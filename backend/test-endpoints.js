import { routeRequest } from './agents/router.js';
import { handleNanoRequest } from './agents/nano.js';
import { handleSuperRequest } from './agents/super.js';

console.log('==================================================');
console.log('🔬 Starting DevAgentX Integration & Routing Tests');
console.log('==================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passCount++;
  } else {
    console.log(`❌ FAIL: ${message}`);
    failCount++;
  }
}

// Test Case 1: Simple task and short code -> Routed to Nano
console.log('Test Case 1: Short simple code explanation...');
const test1 = routeRequest('const x = 10;', 'explain');
assert(test1.agent === 'nano', `Expected route to 'nano', got '${test1.agent}'`);
assert(test1.codeLength <= 50, `Expected length <= 50, got ${test1.codeLength}`);

// Test Case 2: Debug request -> Always routed to Super
console.log('\nTest Case 2: Debug task...');
const test2 = routeRequest('const x = 10;', 'debug');
assert(test2.agent === 'super', `Expected route to 'super', got '${test2.agent}'`);

// Test Case 3: Long code (>50 chars) -> Routed to Super
console.log('\nTest Case 3: Long code segment...');
const longCode = `function longFunction() {
  const variableOne = 1;
  const variableTwo = 2;
  return variableOne + variableTwo;
}`;
const test3 = routeRequest(longCode, 'explain');
assert(test3.agent === 'super', `Expected route to 'super', got '${test3.agent}'`);

// Test Case 4: Contains error keywords -> Routed to Super
console.log('\nTest Case 4: Snippet with error keyword...');
const buggyCode = 'const data = null; // this throws error exception';
const test4 = routeRequest(buggyCode, 'explain');
assert(test4.agent === 'super', `Expected route to 'super', got '${test4.agent}'`);

// Test Case 5: Nano Agent output format
console.log('\nTest Case 5: Nano Agent execution output...');
const nanoExec = handleNanoRequest('const count = 5;', 'explain');
assert(nanoExec.success === true, 'Nano execution success status is false');
assert(nanoExec.agent === 'nano', 'Nano execution agent field is incorrect');
assert(nanoExec.output.includes('Nano Agent'), 'Nano explanation output missing branding');

// Test Case 6: Super Agent output format (simulated)
console.log('\nTest Case 6: Super Agent execution output (simulated)...');
handleSuperRequest('const x = 10;', 'optimize').then(superExec => {
  assert(superExec.success === true, 'Super execution success status is false');
  assert(superExec.agent === 'super', 'Super execution agent field is incorrect');
  assert(superExec.thinking.includes('[Step 1]'), 'Super execution CoT steps missing');
  assert(superExec.output.includes('Super Agent'), 'Super explanation output missing branding');

  console.log('\n==================================================');
  console.log(`📊 Test Summary: ${passCount} Passed, ${failCount} Failed`);
  console.log('==================================================');
  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}).catch(err => {
  console.error('Test execution failed with error:', err);
  process.exit(1);
});
