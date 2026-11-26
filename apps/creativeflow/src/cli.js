import { readFileSync } from 'node:fs';
import { validateBoard,summarize,toCSV } from './core.js';
try {
 const [command,path]=process.argv.slice(2);
 if(!['validate','summary','csv'].includes(command)||!path) throw new Error('Usage: node src/cli.js <validate|summary|csv> <board.json>');
 const board=validateBoard(JSON.parse(readFileSync(path,'utf8')));
 process.stdout.write(command==='csv'?toCSV(board):JSON.stringify(command==='summary'?summarize(board):{valid:true,items:board.length},null,2)+'\n');
} catch(e){console.error(e.message);process.exitCode=1;}
