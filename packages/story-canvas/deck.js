// Independent, dependency-free slide document format and static HTML renderer.
const MAX_SLIDES = 200;
function string(value, name, max, optional=false) {
  if (optional && value === undefined) return '';
  if (typeof value !== 'string' || (!optional && !value.trim()) || value.length > max) throw new Error(`Invalid ${name}`);
  return value;
}
export function normalizeDeck(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || input.version !== 1) throw new Error('Expected deck version 1');
  const title=string(input.title,'deck title',200);
  if (!Array.isArray(input.slides) || input.slides.length<1 || input.slides.length>MAX_SLIDES) throw new Error('Expected 1–200 slides');
  const ids=new Set();
  const slides=input.slides.map(slide=>{
    if(!slide || typeof slide !== 'object' || Array.isArray(slide)) throw new Error('Invalid slide');
    const id=string(slide.id,'slide ID',80);
    if(!/^[a-zA-Z0-9_-]+$/.test(id) || ids.has(id)) throw new Error('Invalid or duplicate slide ID');
    ids.add(id);
    const heading=string(slide.heading,'heading',200);
    const bullets=slide.bullets??[];
    if(!Array.isArray(bullets)||bullets.length>12) throw new Error('Expected at most 12 bullets');
    return {id,heading,bullets:bullets.map(b=>string(b,'bullet',500)),notes:string(slide.notes,'speaker notes',10000,true)};
  });
  return {version:1,title,slides};
}
const escapeHtml=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
export function renderDeck(input) {
  const deck=normalizeDeck(input);
  const slides=deck.slides.map((s,i)=>`<section id="slide-${escapeHtml(s.id)}" class="slide" aria-labelledby="heading-${escapeHtml(s.id)}"><p class="number">${i+1} / ${deck.slides.length}</p><h2 id="heading-${escapeHtml(s.id)}">${escapeHtml(s.heading)}</h2>${s.bullets.length?`<ul>${s.bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join('')}</ul>`:''}</section>`).join('\n');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(deck.title)}</title><style>body{margin:0;background:#101722;color:#eff4fb;font:1.1rem system-ui}main{max-width:960px;margin:auto;padding:1rem}h1{font-size:2rem}.slide{background:#202c3e;margin:1rem 0;padding:clamp(1rem,5vw,4rem);min-height:40vh;border-radius:12px;overflow-wrap:anywhere}.number{color:#b4c7df;font-size:.9rem}h2{font-size:clamp(1.5rem,4vw,3rem)}li{margin:.65em 0}@media print{body{background:white;color:black}.slide{background:white;break-after:page;min-height:0;border-radius:0}.slide:last-child{break-after:auto}.number{color:#333}h1{font-size:1rem}}</style></head><body><main><h1>${escapeHtml(deck.title)}</h1>${slides}</main></body></html>\n`;
}
// Notes are explicitly separate from the public HTML output.
export function exportNotes(input) {
  const deck=normalizeDeck(input);
  return {title:deck.title,slides:deck.slides.map(({id,heading,notes})=>({id,heading,notes}))};
}
