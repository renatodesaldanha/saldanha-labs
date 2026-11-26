// Explicit dependency graphs for local workflows. No dynamic code evaluation.
const validId = x => typeof x === 'string' && /^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(x);
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
export function planWorkflow(steps) {
  if (!Array.isArray(steps) || steps.length > 1000) throw Error('Expected up to 1000 steps');
  const nodes = new Map();
  for (const step of steps) {
    if (!step || !validId(step.id) || !validId(step.handler)) throw Error('Invalid step ID or handler');
    if (nodes.has(step.id)) throw Error(`Duplicate step: ${step.id}`);
    const deps = step.dependsOn ?? [];
    if (!Array.isArray(deps) || deps.some(d => !validId(d)) || new Set(deps).size !== deps.length) throw Error('Invalid dependencies');
    nodes.set(step.id, {...step, dependsOn: [...deps]});
  }
  for (const step of nodes.values()) for (const dep of step.dependsOn) if (!nodes.has(dep)) throw Error(`Unknown dependency: ${dep}`);
  const done = new Set(), ordered = [];
  while (ordered.length < nodes.size) {
    const ready = [...nodes.values()].filter(s => !done.has(s.id) && s.dependsOn.every(d => done.has(d)));
    if (!ready.length) throw Error('Dependency cycle');
    for (const step of ready) { done.add(step.id); ordered.push(step); }
  }
  return ordered;
}
export async function runWorkflow(steps, handlers, { signal } = {}) {
  const ordered = planWorkflow(steps);
  if (!handlers || typeof handlers !== 'object') throw Error('Handlers must be an object');
  for (const s of ordered) if (!own(handlers,s.handler) || typeof handlers[s.handler] !== 'function') throw Error(`Missing handler: ${s.handler}`);
  const outcomes = new Map();
  for (const step of ordered) {
    if (signal?.aborted || step.dependsOn.some(d => outcomes.get(d).status !== 'ok')) {
      outcomes.set(step.id, {status:'skipped', reason:signal?.aborted?'aborted':'dependency failed'}); continue;
    }
    const inputs = Object.freeze(Object.fromEntries(step.dependsOn.map(d => [d,outcomes.get(d).value])));
    try { const value = await handlers[step.handler]({inputs, config:step.config, signal}); outcomes.set(step.id,{status:'ok',value}); }
    catch (error) { outcomes.set(step.id,{status:'failed',error:error instanceof Error?error.message:String(error)}); }
  }
  return outcomes;
}
