# Prompt Engineering Framework — 0.1.0 preview

A minimal, provider-neutral prompt template and deterministic output-checking library. No network dependencies or model calls. Templates use `{{name}}` placeholders, with string variables and strict checking for missing or unknown names. Values are inserted literally, never executed or recursively expanded.

```js
import { renderPrompt, checkOutput } from './prompt.js';
const prompt = renderPrompt('Summarize the following topic: {{topic}}', {topic:'A fictional example'});
console.log(prompt);
console.log(checkOutput('Summary: example', {required:['Summary:'],maxChars:200}));
```

Output checks are case-sensitive substring and length checks, not semantic quality or safety assessments. This library does not prevent prompt injection: treat user text as untrusted and enforce authorization outside any model. Do not put credentials into templates. Run `npm test` from the repository root. MIT, independently implemented with AI assistance.
