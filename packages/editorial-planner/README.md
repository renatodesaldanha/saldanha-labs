# Editorial Planner — 0.1.0 preview

A dependency-free JavaScript library for scheduling content and summarizing episode production stages. Dates are UTC calendar dates, not local-time timestamps. It does not generate content or connect to publishing platforms.

```js
import { planEpisodes, summarizeEpisodes } from './planner.js';
const schedule = planEpisodes([{id:'episode-1',title:'Introduction'},{id:'episode-2',title:'Interview'}], {start:'2026-12-01',intervalDays:7});
console.log(schedule, summarizeEpisodes(schedule));
```

Run `npm test` from the repository root. New AI-assisted implementation inspired by the general editorial planning concept; no private Creator Launchpad code or content was copied. MIT licensed.
