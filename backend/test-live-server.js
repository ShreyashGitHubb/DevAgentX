const BACKEND_URL = 'http://localhost:5000';

console.log('==================================================');
console.log('🌐 Starting Live Express Server HTTP Integration Tests');
console.log('==================================================\n');

async function runTests() {
  try {
    // 1. Health check test
    console.log('Testing GET /health ...');
    const healthRes = await fetch(`${BACKEND_URL}/health`);
    const healthData = await healthRes.json();
    console.log('GET /health Response Status:', healthRes.status);
    console.log('GET /health Response Payload:', JSON.stringify(healthData, null, 2));
    if (healthRes.status !== 200 || healthData.status !== 'healthy') {
      throw new Error('Health check test failed.');
    }
    console.log('✅ Health Check: PASS\n');

    // 2. Nano Routing Test
    console.log('Testing POST /api/analyze (Nano Router) ...');
    const nanoRes = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: 'function add(a,b) { return a+b; }',
        task: 'explain'
      })
    });
    const nanoData = await nanoRes.json();
    console.log('Nano Router Response Status:', nanoRes.status);
    console.log('Nano Router Agent Selection:', nanoData.agent);
    console.log('Nano Router Output Excerpt:', nanoData.output.slice(0, 80) + '...');
    if (nanoRes.status !== 200 || nanoData.agent !== 'nano') {
      throw new Error('Nano routing integration test failed.');
    }
    console.log('✅ Nano Routing: PASS\n');

    // 3. Super Routing Test
    console.log('Testing POST /api/analyze (Super Router) ...');
    const superRes = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: `function complexLogicCalculator(arr) {
          // A longer snippet to trigger Super Agent (> 50 chars)
          let sum = 0;
          for (let i = 0; i < arr.length; i++) {
            sum += arr[i] * 2;
          }
          return sum;
        }`,
        task: 'explain'
      })
    });
    const superData = await superRes.json();
    console.log('Super Router Response Status:', superRes.status);
    console.log('Super Router Agent Selection:', superData.agent);
    console.log('Super Router CoT Thinking Excerpt:', superData.thinking.slice(0, 100) + '...');
    console.log('Super Router Output Excerpt:', superData.output.slice(0, 80) + '...');
    if (superRes.status !== 200 || superData.agent !== 'super') {
      throw new Error('Super routing integration test failed.');
    }
    console.log('✅ Super Routing: PASS\n');

    console.log('==================================================');
    console.log('🎉 ALL LIVE INTEGRATION TESTS PASSED!');
    console.log('==================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Integration test suite failed with error:', error.message);
    process.exit(1);
  }
}

runTests();
