import http from 'http';
import { computeRateLimitState } from './src/routes/auth.js';

console.log('\n🧪 ========================================================');
console.log('   CYBERGOAT LMS BACKEND LOCAL TEST SUITE');
console.log('========================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(` ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(` ❌ FAIL: ${message}`);
    failedTests++;
  }
}

// 1. Test pure rate limiting state decision logic
console.log('--- 1. Testing Rate Limiter Logic ---');
const now = Date.now();
const fresh = computeRateLimitState(null, now);
assert(fresh.limited === false && fresh.newRecord.count === 1, 'Fresh IP returns limited=false and count=1');

const tenth = computeRateLimitState({ count: 9, startTime: now }, now);
assert(tenth.limited === false && tenth.newRecord.count === 10, '10th attempt returns limited=false');

const eleventh = computeRateLimitState({ count: 10, startTime: now }, now);
assert(eleventh.limited === true && eleventh.newRecord.count === 11, '11th attempt returns limited=true');

const expired = computeRateLimitState({ count: 15, startTime: now - (16 * 60 * 1000) }, now);
assert(expired.limited === false && expired.newRecord.count === 1, 'Expired window resets count to 1');

// 2. Test Server imports & routes
console.log('\n--- 2. Testing Express Server Import & Syntax ---');
try {
  process.env.JWT_SECRET = 'test_jwt_secret_2026';
  process.env.PORT = '8089';
  const { default: app } = await import('./src/server.js');
  assert(typeof app === 'function', 'Express server app exported correctly');
} catch (err) {
  assert(false, `Server import failed: ${err.message}`);
}

console.log('\n========================================================');
console.log(`📊 TEST RESULTS SUMMARY: ${passedTests} Passed, ${failedTests} Failed`);
console.log('========================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
