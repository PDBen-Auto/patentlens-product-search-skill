import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {PATENT_ASSETS} from './pdf-support.mjs';
import {RECORDS} from './data-dir.mjs';
import {VERSION,runSearch,detailPatent,readPublic,reportHTML} from './engine.mjs';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PATENTLENS_PORT||48972);
if(!Number.isInteger(PORT)||PORT<1024||PORT>65535)throw new Error('PATENTLENS_PORT must be an integer between 1024 and 65535.');
const ORIGIN='http://127.0.0.1:'+PORT;
const jobs=new Map();
await fs.mkdir(RECORDS,{recursive:true});
for(const dir of await fs.readdir(RECORDS,{withFileTypes:true})){
 if(!dir.isDirectory()||!/^\d{4}-[\w.-]+$/.test(dir.name))continue;
 try{const result=JSON.parse(await fs.readFile(path.join(RECORDS,dir.name,'检索数据.json'),'utf8'));jobs.set(dir.name,{id:dir.name,status:'done',message:'读取已保存检索',result})}catch{}
}
let active=false;
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function body(req){let b='';for await(const c of req){b+=c;if(Buffer.byteLength(b)>1500000)throw new Error('请求过大')}return JSON.parse(b||'{}')}
async function save(job){const dir=path.join(RECORDS,job.id);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'检索数据.json'),JSON.stringify(job.result,null,2));}
function jobView(j){return {id:j.id,status:j.status,message:j.message,result:j.result,error:j.error}}
const imageCache=new Map();
async function imageData(url){if(url.startsWith('/api/patents/')){const m=url.match(/^\/api\/patents\/(US(?:D)?\d+(?:[ABS]\d?)?)\/(page-\d{3}\.png)$/);if(!m)throw new Error('原文页路径无效');const b=await fs.readFile(path.join(PATENT_ASSETS,m[1],m[2]));return 'data:image/png;base64,'+b.toString('base64')}if(imageCache.has(url))return imageCache.get(url);const r=await readPublic(url,{binary:true,max:4500000,timeout:12000});if(!/^image\/(png|jpeg|webp|gif)/.test(r.type))throw new Error('图片类型不支持');const data='data:'+r.type.split(';')[0]+';base64,'+r.data.toString('base64');if(imageCache.size>120)imageCache.clear();imageCache.set(url,data);return data;}
const server=http.createServer(async(req,res)=>{try{const host=req.headers.host;if(host!=='127.0.0.1:'+PORT&&host!=='localhost:'+PORT)return json(res,403,{error:'仅允许本机访问。'});if(req.headers.origin&&![ORIGIN,'http://localhost:'+PORT].includes(req.headers.origin))return json(res,403,{error:'来源不允许。请从本地工具入口操作。'});res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');const u=new URL(req.url,ORIGIN);
if(req.method==='GET'&&u.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(await fs.readFile(path.join(ROOT,'PatentLens.html')))}
if(req.method==='GET'&&u.pathname==='/examples/synthetic-cable-clip.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(await fs.readFile(path.join(ROOT,'..','examples','synthetic-cable-clip.html')))}
if(req.method==='GET'&&u.pathname.startsWith('/api/patents/')){const m=u.pathname.match(/^\/api\/patents\/(US(?:D)?\d+(?:[ABS]\d?)?)\/(page-\d{3}\.png|original\.pdf)$/);if(!m)return json(res,404,{error:'原文文件不存在'});try{const b=await fs.readFile(path.join(PATENT_ASSETS,m[1],m[2]));res.writeHead(200,{'Content-Type':m[2].endsWith('.pdf')?'application/pdf':'image/png','Cache-Control':'public,max-age=3600'});return res.end(b)}catch{return json(res,404,{error:'原文页尚未取得'})}}
if(req.method==='GET'&&u.pathname==='/api/health')return json(res,200,{ok:true,version:VERSION,active});
if(req.method==='GET'&&u.pathname==='/favicon.ico'){res.writeHead(204);return res.end()}
if(req.method==='GET'&&u.pathname.startsWith('/reports/')){const relative=decodeURIComponent(u.pathname.slice('/reports/'.length));const parts=relative.split('/');if(parts.some(p=>!p||p==='.'||p==='..'||p.includes('\\'))||!relative.match(/\.(?:html|pdf)$/i))return json(res,404,{error:'报告路径无效'});const destination=path.resolve(RECORDS,...parts);if(!destination.startsWith(RECORDS+path.sep))return json(res,404,{error:'报告路径无效'});try{const data=await fs.readFile(destination);res.writeHead(200,{'Content-Type':relative.endsWith('.pdf')?'application/pdf':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(data)}catch{return json(res,404,{error:'报告尚未生成'})}}
if(req.method==='GET'&&u.pathname==='/api/jobs'){return json(res,200,[...jobs.values()].map(j=>({id:j.id,status:j.status,title:j.result?.product?.title||j.result?.input?.url||'',at:j.result?.startedAt})).reverse())}
if(req.method==='POST'&&u.pathname==='/api/jobs'){if(active)return json(res,409,{error:'已有检索正在执行，请等本次结束。'});const input=await body(req);if(typeof input.url!=='string'||input.url.length>3000||!/^https?:\/\//i.test(input.url))return json(res,400,{error:'请粘贴完整产品链接。'});for(const k of ['keywords','assignee'])if(input[k]&&(typeof input[k]!=='string'||input[k].length>300))return json(res,400,{error:'补充字段最多300字符。'});const id=new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,6);const job={id,status:'running',message:'正在读取产品网页',result:null};jobs.set(id,job);active=true;json(res,202,{id});runSearch(input,(msg,r)=>{job.message=msg;job.result=r}).then(async r=>{job.result=r;job.status='done';await save(job)}).catch(e=>{job.status='failed';job.error=e.message}).finally(()=>{active=false});return}
const match=u.pathname.match(/^\/api\/jobs\/([\w.-]+)(?:\/(detail|export))?$/);if(match){let job=jobs.get(match[1]);if(!job){try{const result=JSON.parse(await fs.readFile(path.join(RECORDS,match[1],'检索数据.json'),'utf8'));job={id:match[1],result,status:'done',message:'读取已保存检索'};jobs.set(job.id,job)}catch{return json(res,404,{error:'找不到这次检索。'})}}if(!match[2]&&req.method==='GET')return json(res,200,jobView(job));
if(match[2]==='detail'&&req.method==='POST'){if(job.status==='running')return json(res,409,{error:'请等待检索结束。'});const data=await body(req);const i=job.result.candidates.findIndex(p=>p.id===data.id);if(i<0)return json(res,404,{error:'候选不存在。'});try{job.result.candidates[i]=await detailPatent(job.result.candidates[i]);job.result.documentCount=job.result.candidates.filter(p=>p.officialDocumentAvailable&&p.images.length).length;await save(job);return json(res,200,job.result.candidates[i])}catch(e){return json(res,502,{error:e.message})}}
if(match[2]==='export'&&req.method==='POST'){if(!job.result)return json(res,409,{error:'暂无检索结果。'});const b=await body(req);const reviews=b.reviews&&typeof b.reviews==='object'?b.reviews:{};const selected=(Array.isArray(b.selected)?b.selected:[]).slice(0,3);const imgs=[...(job.result.product?.images||[]).slice(0,2),...job.result.candidates.filter(p=>selected.length?selected.includes(p.id):p.detailState.startsWith('已')).slice(0,8).flatMap(p=>p.images.slice(0,3).concat(p.images.length>3?p.images.slice(-1):[]))];const assets={};const failed=[];for(let i=0;i<imgs.length;i+=3)await Promise.all(imgs.slice(i,i+3).map(async url=>{try{assets[url]=await imageData(url)}catch{failed.push(url)}}));const report=reportHTML(job.result,reviews,assets);const dir=path.join(RECORDS,job.id);await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,'人工复核报告.html'),report);await fs.writeFile(path.join(dir,'人工判断.json'),JSON.stringify({reviews,selected,exportedAt:new Date().toISOString()},null,2));return json(res,200,{html:report,embedded:Object.keys(assets).length,failed:failed.length,path:path.join(dir,'人工复核报告.html')})}}
if(req.method==='POST'&&u.pathname==='/api/image'){const b=await body(req);return json(res,200,{data:await imageData(b.url)})}
return json(res,404,{error:'接口不存在。'});
}catch(e){json(res,400,{error:e.message||'请求失败'})}});
server.requestTimeout=300000;
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'端口已占用：请打开 '+ORIGIN+' 或先关闭旧的 PatentLens 服务。':e.message);process.exitCode=1});
server.listen(PORT,'127.0.0.1',()=>console.log('PatentLens '+VERSION+' 已启动：'+ORIGIN));
