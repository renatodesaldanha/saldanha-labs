# AI Workflow Toolkit — 0.1.0 preview

A dependency-free, deterministic workflow planner and async runner. Connect your own trusted model adapters or ordinary local functions; this module does not call models, execute supplied code strings, implement retries, or isolate untrusted handlers.

```js
import { runWorkflow } from './workflow.js';
const steps = [
  {id:'draft',handler:'draft',config:'Example topic'},
  {id:'review',handler:'review',dependsOn:['draft']}
];
const outcomes = await runWorkflow(steps, {
  draft: ({config}) => `Draft: ${config}`,
  review: ({inputs}) => inputs.draft.length
});
console.log(outcomes.get('review'));
```

Unknown handlers, missing dependencies and cycles are rejected before execution. A failed step skips dependent steps while independent branches continue. Abort signals stop subsequent steps; handlers must implement their own cooperative cancellation. Outcomes are a Map; do not log confidential inputs or errors in production. Run `npm test` at the repository root. MIT, independently implemented with AI assistance.
