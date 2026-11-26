// Deterministic, dependency-free editorial scheduling and production metrics.
const DAY = 86400000;
export const stages = Object.freeze(['idea','outline','script','recording','editing','review','scheduled','published']);
function isoDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw Error('Expected YYYY-MM-DD');
  const ms = Date.parse(value+'T00:00:00Z');
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0,10)!==value) throw Error('Invalid calendar date');
  return ms;
}
export function planEpisodes(episodes, {start, intervalDays=7}={}) {
  const first = isoDate(start);
  if (!Array.isArray(episodes)) throw Error('Episodes must be an array');
  if (!Number.isSafeInteger(intervalDays) || intervalDays<1 || intervalDays>365) throw Error('Invalid interval');
  const ids = new Set();
  return episodes.map((episode,i)=>{
    if (!episode || typeof episode.id!=='string' || !episode.id.trim() || typeof episode.title!=='string' || !episode.title.trim()) throw Error('Each episode needs an ID and title');
    if(ids.has(episode.id)) throw Error('Duplicate episode ID');
    ids.add(episode.id);
    const stage=episode.stage??'idea';
    if(!stages.includes(stage)) throw Error('Invalid stage');
    const date=new Date(first+i*intervalDays*DAY);
    if(!Number.isFinite(date.getTime()) || date.getUTCFullYear()>9999) throw Error('Schedule exceeds supported range');
    return {id:episode.id,title:episode.title.trim(),stage,date:date.toISOString().slice(0,10)};
  });
}
export function summarizeEpisodes(episodes) {
  if (!Array.isArray(episodes)) throw Error('Episodes must be an array');
  const counts=Object.fromEntries(stages.map(s=>[s,0]));
  for(const episode of episodes){if(!episode||!stages.includes(episode.stage)) throw Error('Invalid stage');counts[episode.stage]++;}
  return {total:episodes.length,counts,published:counts.published};
}
