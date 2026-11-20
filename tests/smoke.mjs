import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {parseProduct,searchPlan,parseSearch,publicURL,reportHTML,mergeCandidates} from '../app/engine.mjs';

const page='<meta property="og:title" content="ArcClip Desk Cable Holder"><meta property="og:image" content="/clip.jpg"><script type="application/ld+json">{"@type":"Product","name":"ArcClip Desk Cable Holder","brand":{"name":"Northline Studio"},"description":"One-piece J-shaped cable clip with adhesive base."}</script>';
const product=parseProduct(page,'https://example.com/products/arcclip');
assert.equal(product.title,'ArcClip Desk Cable Holder');
assert.equal(product.images[0],'https://example.com/clip.jpg');
assert.equal(product.seller,'');
assert.throws(()=>parseProduct('<title>Robot Check</title>','https://example.com'));

const plan=searchPlan(product,{country:'US'});
assert.ok(plan.routes.length>=2 && plan.routes.length<=6);
assert.ok(plan.routes.some(route=>route.type==='DESIGN'));
assert.ok(plan.routes.some(route=>route.type==='UTILITY'));
assert.ok(plan.routes.filter(route=>route.assignee).every(route=>route.label.includes('线索')));
assert.throws(()=>parseSearch({error:'blocked'},{}));

const candidate={id:'SIM-D-001',title:'Cable clip',abstract:'Curved arm',type:'外观',routes:['功能'],images:[]};
const merged=mergeCandidates([candidate],[{...candidate,routes:['外观']}],['cable clip']);
assert.equal(merged.length,1);
assert.deepEqual(merged[0].routes,['功能','外观']);

for(const target of ['http://127.0.0.1','http://[::1]','http://localhost','file:///tmp/x','http://user:pass@example.com']){
  await assert.rejects(()=>publicURL(target));
}

const html=reportHTML({startedAt:'2026-11-20',state:'search_blocked',input:{url:'javascript:alert(1)',country:'US'},product:{title:'<script>alert(1)</script>',images:[]},plan:null,coverage:{source:'blocked'},warnings:['blocked'],candidates:[],log:[]});
assert.ok(html.includes('&lt;script&gt;'));
assert.ok(!html.includes('<script>'));
assert.ok(!html.includes('href="javascript:'));
const ui=await fs.readFile(new URL('../app/PatentLens.html',import.meta.url),'utf8');
new Function(ui.split('<script>')[1].split('</script>')[0]);
console.log('PatentLens smoke checks passed');
