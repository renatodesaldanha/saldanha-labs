// Small, strict templates. No eval, expressions, or model API calls.
const keyPattern = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
export function parseTemplate(template) {
  if (typeof template !== 'string' || template.length > 100000) throw Error('Expected a template up to 100000 characters');
  const tokens = [];
  let i=0;
  while(i<template.length){
    const start=template.indexOf('{{',i), close=template.indexOf('}}',i);
    if(close!==-1 && (start===-1 || close<start)) throw Error('Unexpected closing delimiter');
    if(start===-1){tokens.push({text:template.slice(i)});break;}
    if(start>i) tokens.push({text:template.slice(i,start)});
    const end=template.indexOf('}}',start+2);
    if(end===-1) throw Error('Unclosed placeholder');
    const key=template.slice(start+2,end).trim();
    if(!keyPattern.test(key)) throw Error('Invalid placeholder');
    tokens.push({key});i=end+2;
  }
  return tokens;
}
export function templateKeys(template) {return [...new Set(parseTemplate(template).filter(t=>t.key).map(t=>t.key))];}
export function renderPrompt(template, variables, { strict = true } = {}) {
  if (!variables || typeof variables !== 'object' || Array.isArray(variables)) throw Error('Expected a variables object');
  const tokens = parseTemplate(template), keys=new Set(tokens.filter(t=>t.key).map(t=>t.key));
  for(const key of keys) if(!own(variables,key) || typeof variables[key]!=='string') throw Error(`Missing string variable: ${key}`);
  if(strict) for(const key of Object.keys(variables)) if(!keys.has(key)) throw Error(`Unknown variable: ${key}`);
  let out='';
  for(const token of tokens){out+=token.key?variables[token.key]:token.text;if(out.length>1000000) throw Error('Rendered prompt exceeds size limit');}
  return out;
}
export function checkOutput(output,{required=[],forbidden=[],maxChars=100000}={}){
  if(typeof output!=='string'||!Number.isSafeInteger(maxChars)||maxChars<0)throw Error('Invalid output or limit');
  for(const terms of [required,forbidden]) if(!Array.isArray(terms)||terms.some(t=>typeof t!=='string'||!t.length))throw Error('Expected nonempty string terms');
  const failures=[];
  if(output.length>maxChars)failures.push({rule:'maxChars',limit:maxChars});
  for(const term of required)if(!output.includes(term))failures.push({rule:'required',term});
  for(const term of forbidden)if(output.includes(term))failures.push({rule:'forbidden',term});
  return {passed:failures.length===0,failures};
}
