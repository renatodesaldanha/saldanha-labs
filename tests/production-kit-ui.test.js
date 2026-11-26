import test from 'node:test';
import assert from 'node:assert/strict';
import {parseEpisodeLines,prepareDownloads} from '../demos/production-kit-ui.js';
const input={project:'Studio',start:'2026-12-01',intervalDays:7,titles:'First\nSecond'};
test('normalizes CRLF and skips blank lines',()=>assert.deepEqual(parseEpisodeLines(' A\r\n\r\n B '),[{id:'episode-1',title:'A'},{id:'episode-2',title:'B'}]));
test('rejects empty and oversized input',()=>{assert.throws(()=>parseEpisodeLines(' \n '));assert.throws(()=>parseEpisodeLines('a'.repeat(161)));assert.throws(()=>parseEpisodeLines(Array(101).fill('a').join('\n')))});
test('prepares all six portable downloads',async()=>{const f=await prepareDownloads(input);assert.deepEqual(f.map(x=>x.name),['schedule.json','briefs.json','board.json','board.csv','presentation.html','speaker-notes.json']);assert.equal(JSON.parse(f[0].data)[1].date,'2026-12-08');assert.equal(JSON.parse(f[2].data).length,2);});
test('keeps notes separate and escapes HTML',async()=>{const f=await prepareDownloads({...input,titles:'<script>alert(1)</script>'});assert.ok(f[4].data.includes('&lt;script&gt;'));assert.ok(!f[4].data.includes('<script>'));assert.ok(!f[4].data.includes('Prepare a production outline'));});
test('rejects invalid dates or cadence',async()=>{await assert.rejects(prepareDownloads({...input,start:'2026-02-30'}));await assert.rejects(prepareDownloads({...input,intervalDays:0}));});
