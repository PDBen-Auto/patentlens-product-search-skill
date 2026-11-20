import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const required=['SKILL.md','README.md','LICENSE','agents/openai.yaml','app/server.mjs','app/PatentLens.html','app/pdf-pages.py','examples/synthetic-cable-clip.html'];
for(const file of required)assert.ok((await fs.stat(new URL(file,root))).isFile(),`Missing ${file}`);
const skill=await fs.readFile(new URL('SKILL.md',root),'utf8');
assert.match(skill,/^---\nname: patentlens-product-search\ndescription: /);
for(const heading of ['Implementation Basis and Dependencies','Inputs','Outputs','Workflow','Stop Conditions','Completion Check'])assert.ok(skill.includes(`## ${heading}`),`Missing ${heading}`);
const example=await fs.readFile(new URL('examples/synthetic-cable-clip.html',root),'utf8');
assert.match(example,/<html lang="zh-CN">/);
assert.match(example,/100% 虚构模拟数据/);
for(const id of ['SIM-D-001','SIM-U-002','SIM-D-003'])assert.ok(example.includes(id));
for(const privateMarker of ['AZUTO','MHG-050','B0DGGCC','Seikosangyo','C:\\Users\\SYZ']){
  for(const file of required.filter(x=>!x.includes('LICENSE'))){
    const source=await fs.readFile(new URL(file,root),'utf8');
    assert.ok(!source.includes(privateMarker),`Original case marker in ${file}`);
  }
}
console.log('Package structure and synthetic boundary passed');
