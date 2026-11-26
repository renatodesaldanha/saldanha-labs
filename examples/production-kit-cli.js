import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { buildProductionKit } from './production-kit.js';
try {
  const [source, output, ...extra] = process.argv.slice(2);
  if (!source || !output || extra.length) throw Error('Usage: node examples/production-kit-cli.js <input.json> <new-output-directory>');
  const kit = await buildProductionKit(JSON.parse(await readFile(source,'utf8')));
  await mkdir(output); // Existing directories are rejected; never overwrite user files.
  const files = {'schedule.json':kit.schedule,'briefs.json':kit.briefs,'board.json':kit.board,'speaker-notes.json':kit.notes};
  for (const [name,value] of Object.entries(files)) await writeFile(join(output,name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
  await writeFile(join(output,'board.csv'),kit.csv,{flag:'wx'});
  await writeFile(join(output,'presentation.html'),kit.presentation,{flag:'wx'});
  console.log('Created six production kit files. No external service was called.');
} catch(error) { console.error(error.message); process.exitCode=1; }
