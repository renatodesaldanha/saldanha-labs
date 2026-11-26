import {buildProductionKit} from '../examples/production-kit.js';

export function parseEpisodeLines(text) {
  if (typeof text !== 'string') throw Error('Expected episode titles');
  const titles=text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
  if (titles.length<1 || titles.length>100) throw Error('Enter 1–100 episode titles, one per line.');
  if (titles.some(s=>s.length>160)) throw Error('Episode titles must be at most 160 characters.');
  return titles.map((title,i)=>({id:`episode-${i+1}`,title}));
}
export async function prepareDownloads({project,start,intervalDays,titles}) {
  const kit=await buildProductionKit({project,start,intervalDays,episodes:parseEpisodeLines(titles)});
  const json=(name,data)=>({name,type:'application/json',data:JSON.stringify(data,null,2)+'\n'});
  return [json('schedule.json',kit.schedule),json('briefs.json',kit.briefs),json('board.json',kit.board),
    {name:'board.csv',type:'text/csv',data:kit.csv},{name:'presentation.html',type:'text/html',data:kit.presentation},json('speaker-notes.json',kit.notes)];
}
export function bindProductionKit(doc) {
  const form=doc.getElementById('production-kit'), status=doc.getElementById('kit-status'), output=doc.getElementById('kit-downloads');
  if(!form || !status || !output) return;
  let generation=0;
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const current=++generation;
    output.replaceChildren(); status.textContent='Preparing files…';
    const data=new FormData(form);
    try {
      const files=await prepareDownloads({project:data.get('project'),start:data.get('start'),intervalDays:Number(data.get('intervalDays')),titles:data.get('titles')});
      if(current!==generation)return;
      for(const file of files){
        const button=doc.createElement('button'); button.type='button'; button.textContent=`Download ${file.name}`;
        button.addEventListener('click',()=>{
          const url=URL.createObjectURL(new Blob([file.data],{type:file.type+';charset=utf-8'}));
          const a=doc.createElement('a'); a.href=url; a.download=file.name; doc.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
        });
        output.append(button);
      }
      status.textContent='Six files ready. Download individually; no data was sent to a server.';
    } catch(error){if(current===generation) status.textContent=String(error.message??error);}
  });
}
if(typeof document!=='undefined')bindProductionKit(document);
