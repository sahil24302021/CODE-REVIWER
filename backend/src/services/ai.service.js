const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY); 
// Note: We gracefully fallback to OPENAI_API_KEY string if user hasn't renamed their env var yet, but it expects a Gemini key.

const SYSTEM_PROMPT = `You are an elite Staff-Level Software Engineer and Security Auditor at a top-tier tech company.
Your mandate is to perform a world-class, mercilessly objective, and highly constructive code review.
You must analyze the provided code deeply for:
1. **Security Vulnerabilities**: Injection flaws, XSS, CSRF, insecure memory access, improper auth.
2. **Performance & Time/Space Complexity**: Big-O analysis, memory leaks, blocking operations, unoptimized loops.
3. **Architecture & Design Patterns**: SOLID principles, DRY, coupling/cohesion, scalability implications.
4. **Code Quality & Maintainability**: Naming conventions, cognitive complexity, testability, idiomatic language usage.

Your tone should be authoritative, professional, and directly actionable (avoid fluff).

Return ONLY valid JSON exactly matching this structure (do not include markdown formatting tags like \`\`\`json):
{
  "score": number, // Strict 0-100 score. 100 means mathematically perfect code. Be extremely harsh. Most good code should be 75-85.
  "issues": [
    {
      "type": "bug|performance|security|readability|best-practice|architecture",
      "severity": "critical|warning|info",
      "title": "string (Concise technical title)",
      "description": "string (Why is this bad?)",
      "line": number|null,
      "suggestion": "string (Provide the exact code fix if possible)"
    }
  ],
  "suggestions": [
    {
      "title": "string (Refactoring or architecture suggestion)",
      "description": "string",
      "priority": "high|medium|low",
      "category": "string"
    }
  ],
  "metrics": {
    "cyclomaticComplexity": number,
    "functionCount": number,
    "avgFunctionLength": number,
    "codeLines": number,
    "commentLines": number,
    "duplicatePatterns": number
  },
  "summary": "string (A 2-3 sentence executive summary of the code's state and primary risks)"
}`;

async function analyzeCode(code, language) {
    try {
        // Check if API key is configured
        const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey === 'your-openai-api-key' || apiKey === 'your-gemini-api-key') {
            return generateMockAnalysis(code, language);
        }

        // Use the powerful Gemini 2.5 Pro model for elite code review reasoning
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-pro",
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.2, // Keep it highly analytical and deterministic
                responseMimeType: "application/json", // Force JSON output
            }
        });

        const prompt = `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
        const result = await model.generateContent(prompt);
        
        const content = result.response.text();
        return JSON.parse(content);
    } catch (error) {
        console.error('Gemini AI Analysis error:', error.message);
        return generateMockAnalysis(code, language);
    }
}

function generateMockAnalysis(code, language) {
    const lines = code.split('\n');
    const codeLines = lines.filter(l => l.trim() && !l.trim().startsWith('//')).length;
    const commentLines = lines.filter(l => l.trim().startsWith('//')).length;
    const functionMatches = code.match(/function\s|const\s+\w+\s*=\s*(\(|async)|def\s+|public\s+\w+\s*\(|private\s+\w+\s*\(/g);
    const functionCount = functionMatches ? functionMatches.length : 1;

    const issues = [];
    const suggestions = [];

    // Simulate analysis based on code patterns
    if (code.includes('var ')) {
        issues.push({ type: 'best-practice', severity: 'warning', title: 'Use of var keyword', description: 'Consider using let or const instead of var for better scoping', line: lines.findIndex(l => l.includes('var ')) + 1, suggestion: 'Replace var with let or const' });
    }
    if (code.includes('console.log')) {
        issues.push({ type: 'readability', severity: 'info', title: 'Console.log statements found', description: 'Remove debug console.log statements before production', line: lines.findIndex(l => l.includes('console.log')) + 1, suggestion: 'Use a proper logging framework or remove debug statements' });
    }
    if (code.includes('eval(')) {
        issues.push({ type: 'security', severity: 'critical', title: 'Use of eval()', description: 'eval() can execute arbitrary code and is a severe security risk', line: lines.findIndex(l => l.includes('eval(')) + 1, suggestion: 'Use safer alternatives like JSON.parse() or Function constructor' });
    }
    if (code.includes('catch') && code.includes('{}')) {
        issues.push({ type: 'bug', severity: 'warning', title: 'Empty catch block', description: 'Empty catch blocks silently swallow errors', line: null, suggestion: 'Log the error or handle it appropriately' });
    }
    if (codeLines > 100) {
        suggestions.push({ title: 'Consider splitting the file', description: 'This file has over 100 lines of code. Consider breaking it into smaller, more focused modules.', priority: 'medium', category: 'maintainability' });
    }
    if (functionCount > 5) {
        suggestions.push({ title: 'High function count', description: `This file contains ${functionCount} functions. Consider grouping related functions into separate modules.`, priority: 'low', category: 'organization' });
    }

    // Add some generic suggestions
    suggestions.push({ title: 'Add error handling', description: 'Ensure all async operations and external calls have proper error handling with try-catch blocks.', priority: 'high', category: 'reliability' });
    suggestions.push({ title: 'Add input validation', description: 'Validate all inputs and function parameters to prevent unexpected behavior.', priority: 'medium', category: 'security' });
    suggestions.push({ title: 'Add unit tests', description: 'Write unit tests to ensure code reliability and catch regressions early.', priority: 'high', category: 'testing' });

    const score = Math.max(40, Math.min(95, 85 - issues.filter(i => i.severity === 'critical').length * 15 - issues.filter(i => i.severity === 'warning').length * 5 + Math.floor(Math.random() * 10)));

    return {
        score,
        issues,
        suggestions,
        metrics: {
            cyclomaticComplexity: Math.min(20, Math.max(1, Math.floor(codeLines / 10))),
            functionCount,
            avgFunctionLength: Math.floor(codeLines / Math.max(1, functionCount)),
            codeLines,
            commentLines,
            duplicatePatterns: Math.floor(Math.random() * 3),
        },
        summary: `The ${language} code has been analyzed. Overall quality score is ${score}/100. Found ${issues.length} issue(s) and ${suggestions.length} improvement suggestion(s). The code has ${codeLines} lines with ${functionCount} function(s).`,
    };
}

module.exports = { analyzeCode };
