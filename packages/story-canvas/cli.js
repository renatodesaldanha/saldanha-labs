import {readFileSync} from 'node:fs';
import {normalizeDeck,renderDeck,exportNotes} from './deck.js';
try {
  const [command,file]=process.argv.slice(2);
  if (!file || !['validate','html','notes'].includes(command)) throw new Error('Usage: node cli.js <validate|html|notes> <deck.json>');
  const deck=normalizeDeck(JSON.parse(readFileSync(file,'utf8')));
  process.stdout.write(command==='html'?renderDeck(deck):JSON.stringify(command==='notes'?exportNotes(deck):{valid:true,slides:deck.slides.length},null,2)+'\n');
} catch(error) {console.error(error.message);process.exitCode=1;}
