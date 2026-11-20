import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const root=new URL('../',import.meta.url);
const readmes=['README.md','README.zh-CN.md','README.ja.md','README.ko.md','README.de.md','README.fr.md','README.es.md','README.pt.md'];
const casePages=['examples/synthetic-cable-clip.html','examples/synthetic-cable-clip-en.html'];
const caseBase='https://pdben-auto.github.io/patentlens-product-search-skill/';
const required=['SKILL.md','LICENSE','agents/openai.yaml','app/server.mjs','app/PatentLens.html','app/pdf-pages.py',...readmes,...casePages];
for(const file of required)assert.ok((await fs.stat(new URL(file,root))).isFile(),`Missing ${file}`);
const skill=await fs.readFile(new URL('SKILL.md',root),'utf8');
assert.match(skill,/^---\nname: patentlens-product-search\ndescription: /);
for(const heading of ['Implementation Basis and Dependencies','Inputs','Outputs','Workflow','Stop Conditions','Completion Check'])assert.ok(skill.includes(`## ${heading}`),`Missing ${heading}`);
const example=await fs.readFile(new URL('examples/synthetic-cable-clip.html',root),'utf8');
assert.match(example,/<html lang="zh-CN">/);
assert.match(example,/100% 虚构模拟数据/);
for(const id of ['SIM-D-001','SIM-U-002','SIM-D-003'])assert.ok(example.includes(id));
for (const file of readmes) {
  const readme=await fs.readFile(new URL(file,root),'utf8');
  for (const locale of readmes) {
    assert.ok(readme.includes(`](${locale})`), `Missing language link to ${locale} in ${file}`);
  }
  assert.ok(casePages.some(page=>readme.includes(`(${caseBase}${page.split('/').at(-1)})`)), `Missing public HTML case in ${file}`);
}
const englishCase=await fs.readFile(new URL(casePages[1],root),'utf8');
assert.match(englishCase,/<html lang="en">/);
assert.match(englishCase,/Entirely fictional simulation/);
assert.match(englishCase,/href="synthetic-cable-clip.html"/);
assert.match(example,/href="synthetic-cable-clip-en.html"/);
for (const id of ['SIM-D-001','SIM-U-002','SIM-D-003']) assert.ok(englishCase.includes(id));
for(const privateMarker of ['AZUTO','MHG-050','B0DGGCC','Seikosangyo','C:\\Users\\SYZ']){
  for(const file of required.filter(x=>!x.includes('LICENSE'))){
    const source=await fs.readFile(new URL(file,root),'utf8');
    assert.ok(!source.includes(privateMarker),`Original case marker in ${file}`);
  }
}
console.log('Package structure and synthetic boundary passed');
