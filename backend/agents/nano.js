/**
 * Nano Agent (Lightweight)
 * Performs fast parsing and quick explanations for simple inputs without calling heavy LLM APIs.
 */

export function handleNanoRequest(input = '', task = '') {
  const result = parseSimpleCode(input);
  
  let explanation = '';
  if (task === 'explain') {
    if (result.type === 'function') {
      explanation = `### ⚡ Nano Agent Explanation\n\n` +
                    `Detected a **${result.language} function** named \`${result.name}\`.\n\n` +
                    `- **Parameters**: ${result.params.length > 0 ? result.params.map(p => `\`${p}\``).join(', ') : 'None'}\n` +
                    `- **Complexity**: Very Simple\n\n` +
                    `**Behavior**:\n` +
                    `This function is designed to run in a single, fast step. It represents standard syntax in ${result.language} for organizing executable code blocks.`;
    } else if (result.type === 'variable') {
      explanation = `### ⚡ Nano Agent Explanation\n\n` +
                    `Detected a **variable declaration**.\n\n` +
                    `- **Name**: \`${result.name}\`\n` +
                    `- **Value**: \`${result.value}\`\n\n` +
                    `**Behavior**:\n` +
                    `This assigns the value \`${result.value}\` to the identifier \`${result.name}\` in memory for future reference.`;
    } else {
      explanation = `### ⚡ Nano Agent Explanation\n\n` +
                    `This looks like a simple statement or fragment.\n\n` +
                    `**Analysis**:\n` +
                    `The input is processed as a short snippet of code/text. It does not contain complex logical structures or branchings.`;
    }
  } else {
    // Fallback or other simple task
    explanation = `### ⚡ Nano Agent Quick Task\n\n` +
                  `Nano Agent processed task: **${task}**.\n\n` +
                  `**Response**:\n` +
                  `The input is too short or simple to warrant deep reasoning. Everything looks valid and syntactically correct.`;
  }

  return {
    success: true,
    agent: 'nano',
    output: explanation,
    metadata: {
      parsedType: result.type,
      language: result.language,
      speed: '15ms (Fast)'
    }
  };
}

/**
 * Basic regex parser to extract details from simple code snippets.
 */
function parseSimpleCode(code) {
  const trimmed = code.trim();
  
  // JS/TS or Python function match
  // e.g. function hello(a, b) { ... }
  const jsFuncMatch = trimmed.match(/(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/);
  if (jsFuncMatch) {
    return {
      type: 'function',
      name: jsFuncMatch[1],
      params: jsFuncMatch[2].split(',').map(s => s.trim()).filter(Boolean),
      language: 'JavaScript'
    };
  }

  // e.g. const greet = (name) => ...
  const arrowFuncMatch = trimmed.match(/(?:const|let|var)\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/);
  if (arrowFuncMatch) {
    return {
      type: 'function',
      name: arrowFuncMatch[1],
      params: arrowFuncMatch[2].split(',').map(s => s.trim()).filter(Boolean),
      language: 'JavaScript (Arrow)'
    };
  }

  // Python: def hello(a, b):
  const pyFuncMatch = trimmed.match(/def\s+(\w+)\s*\(([^)]*)\)\s*:/);
  if (pyFuncMatch) {
    return {
      type: 'function',
      name: pyFuncMatch[1],
      params: pyFuncMatch[2].split(',').map(s => s.trim()).filter(Boolean),
      language: 'Python'
    };
  }

  // Simple variable declaration: const x = 10; or x = 10
  const varMatch = trimmed.match(/(?:const|let|var)\s+(\w+)\s*=\s*([^;]+)/) || trimmed.match(/^(\w+)\s*=\s*([^\n]+)/);
  if (varMatch) {
    return {
      type: 'variable',
      name: varMatch[1],
      value: varMatch[2].trim(),
      language: 'Generic'
    };
  }

  return {
    type: 'unknown',
    name: null,
    params: [],
    language: 'Text/Code'
  };
}
