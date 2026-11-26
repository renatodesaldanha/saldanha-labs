// Compose all five modules into a portable editorial production kit.
import { planEpisodes } from '../packages/editorial-planner/planner.js';
import { renderPrompt, checkOutput } from '../packages/prompt-framework/prompt.js';
import { runWorkflow } from '../packages/workflow-toolkit/workflow.js';
import { renderDeck, exportNotes } from '../packages/story-canvas/deck.js';
import { validateBoard, toCSV } from '../apps/creativeflow/src/core.js';

export async function buildProductionKit(input) {
  if (!input || typeof input !== 'object' || !Array.isArray(input.episodes) || input.episodes.length < 1 || input.episodes.length > 100) throw Error('Expected 1–100 episodes');
  if (typeof input.project !== 'string' || !input.project.trim() || input.project.length > 100) throw Error('Invalid project');
  const episodes = Array.from(input.episodes);
  for (const episode of episodes) {
    if (!episode || typeof episode.title !== 'string' || !episode.title.trim() || episode.title.length > 160 || typeof episode.id !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(episode.id)) throw Error('Invalid episode title or ID');
  }
  const project = input.project.trim();
  const result = await runWorkflow([
    {id:'schedule',handler:'schedule'},
    {id:'briefs',handler:'briefs',dependsOn:['schedule']},
    {id:'board',handler:'board',dependsOn:['schedule','briefs']},
    {id:'deck',handler:'deck',dependsOn:['schedule','briefs']}
  ], {
    schedule:()=>planEpisodes(episodes.map(({id,title})=>({id,title})),{start:input.start,intervalDays:input.intervalDays??7}),
    briefs:({inputs})=>inputs.schedule.map(({id,title,date})=>{
      const prompt = renderPrompt('Prepare a production outline for {{title}}. Publication date: {{date}}. Include audience, key points, and a call to action.',{title,date});
      if (!checkOutput(prompt,{required:[title,date],maxChars:500}).passed) throw Error('Brief validation failed');
      return {id,prompt};
    }),
    board:({inputs})=>validateBoard(inputs.schedule.map(({id,title},i)=>({id,title,project,stage:'planning',channel:'video',brief:inputs.briefs[i].prompt}))),
    deck:({inputs})=>({version:1,title:project,slides:inputs.schedule.map(({id,title,date},i)=>({id,heading:title,bullets:[`Publication date: ${date}`,'Prepare outline, record, edit, and review.'],notes:inputs.briefs[i].prompt}))})
  });
  const failure=[...result.values()].find(x=>x.status==='failed');
  if(failure) throw Error(failure.error);
  const get=id=>result.get(id).value;
  const board=get('board'), deck=get('deck');
  return {schedule:get('schedule'), briefs:get('briefs'), board, csv:toCSV(board), presentation:renderDeck(deck), notes:exportNotes(deck)};
}
