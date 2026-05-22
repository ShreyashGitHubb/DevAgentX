/**
 * Router Agent - Decision Engine
 * Determines the complexity of a task and routes it to the appropriate agent (Nano vs. Super).
 */

const ERROR_KEYWORDS = [
  'error', 'exception', 'crash', 'bug', 'fail', 'undefined',
  'nullpointer', 'unhandled', 'stacktrace', 'nan', 'infinite loop',
  'segfault', 'broken', 'wrong', 'not working', 'fix'
];

export function routeRequest(input = '', task = '') {
  const codeLength = input.length;
  const lowercaseInput = input.toLowerCase();

  // Check if any error keyword is present
  const containsErrorKeywords = ERROR_KEYWORDS.some(keyword => lowercaseInput.includes(keyword));

  // Determine routing path
  let agent = 'nano';
  let reason = '';

  if (task === 'debug') {
    agent = 'super';
    reason = 'Task is debug request, which always requires deep logic analysis by the Super Agent.';
  } else if (codeLength > 50) {
    agent = 'super';
    reason = `Input code length (${codeLength} characters) is greater than 50 characters, indicating a complex code structure requiring the Super Agent.`;
  } else if (containsErrorKeywords) {
    agent = 'super';
    reason = 'Input contains error-related keywords indicating a potential bug or failure state, requiring the Super Agent.';
  } else {
    agent = 'nano';
    reason = `Input is simple (length ${codeLength} characters <= 50) and does not involve debug requests or error keywords. Fast-tracked via lightweight Nano Agent.`;
  }

  return {
    agent,
    reason,
    codeLength,
    task
  };
}
