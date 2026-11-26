import { runWorkflow } from '../packages/workflow-toolkit/workflow.js';
import { renderPrompt, checkOutput } from '../packages/prompt-framework/prompt.js';
import { planEpisodes } from '../packages/editorial-planner/planner.js';
const results = await runWorkflow([
  {id:'schedule',handler:'schedule'},
  {id:'brief',handler:'brief',dependsOn:['schedule']},
  {id:'verify',handler:'verify',dependsOn:['brief']}
],{
  schedule:()=>planEpisodes([{id:'demo',title:'A fictional studio tour'}],{start:'2026-12-01'}),
  brief:({inputs})=>renderPrompt('Prepare an episode outline for {{title}} on {{date}}.',inputs.schedule.map(({title,date})=>({title,date}))[0]),
  verify:({inputs})=>checkOutput(inputs.brief,{required:['2026-12-01'],maxChars:200})
});
if([...results.values()].some(x=>x.status!=='ok')||!results.get('verify').value.passed)throw Error('Demo failed');
console.log(JSON.stringify(Object.fromEntries(results),null,2));
