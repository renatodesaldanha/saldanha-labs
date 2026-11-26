import {planEpisodes} from '../packages/editorial-planner/planner.js';
import {runWorkflow} from '../packages/workflow-toolkit/workflow.js';
import {renderPrompt,checkOutput} from '../packages/prompt-framework/prompt.js';
const form=document.getElementById('playground'), result=document.getElementById('result');
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const title=document.getElementById('episode-title').value, date=document.getElementById('publication-date').value;
  try {
    const outcomes=await runWorkflow([{id:'schedule',handler:'schedule'},{id:'brief',handler:'brief',dependsOn:['schedule']},{id:'verify',handler:'verify',dependsOn:['brief']}],{
      schedule:()=>planEpisodes([{id:'demo',title}],{start:date}),
      brief:({inputs})=>{const [episode]=inputs.schedule;return renderPrompt('Prepare an episode outline for {{title}} on {{date}}.',{title:episode.title,date:episode.date});},
      verify:({inputs})=>checkOutput(inputs.brief,{required:[date],maxChars:250})
    });
    result.textContent=JSON.stringify(Object.fromEntries(outcomes),null,2);
  }catch(error){result.textContent=String(error.message??error);}
});
