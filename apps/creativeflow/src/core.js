export const stages = Object.freeze(['planning','production','review','published']);
export const channels = Object.freeze(['search','social','email','video','other']);
const required = (x,k) => { if(typeof x[k] !== 'string' || !x[k].trim()) throw new Error(`Missing ${k}`); };
export function validateBoard(board){
  if(!Array.isArray(board)) throw new Error('Board must be an array');
  const ids=new Set();
  for(const item of board){
    if(!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid item');
    for(const k of ['id','title','project','stage','channel']) required(item,k);
    if(ids.has(item.id)) throw new Error(`Duplicate ID ${item.id}`); ids.add(item.id);
    if(!stages.includes(item.stage)) throw new Error(`Invalid stage ${item.stage}`);
    if(!channels.includes(item.channel)) throw new Error(`Invalid channel ${item.channel}`);
    if(item.brief!==undefined && typeof item.brief!=='string') throw new Error('Brief must be a string');
  }
  return board;
}
export function move(board,id,stage){
  validateBoard(board); if(!stages.includes(stage)) throw new Error('Invalid stage');
  if(!board.some(i=>i.id===id)) throw new Error('Unknown item');
  return board.map(i=>i.id===id?{...i,stage}:i);
}
export function summarize(board){
  validateBoard(board); return Object.fromEntries(stages.map(stage=>[stage,board.filter(x=>x.stage===stage).length]));
}
export function trackingUrl(base, params){
  const u=new URL(base); if(!['http:','https:'].includes(u.protocol)||u.username||u.password) throw new Error('Use an HTTP(S) URL without credentials');
  for(const k of ['source','medium','campaign','content','term']) if(typeof params[k]==='string'&&params[k].trim()) u.searchParams.set(`utm_${k}`,params[k].trim());
  return u.href;
}
const csvCell=(value)=>{let s=String(value??'');if(/^[\s\u0000-\u001f]*[=+@-]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
export function toCSV(board){validateBoard(board);const fields=['id','title','project','stage','channel','brief'];return [fields.join(','),...board.map(x=>fields.map(k=>csvCell(x[k])).join(','))].join('\r\n')+'\r\n';}
