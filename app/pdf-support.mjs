import fs from 'node:fs/promises';
import path from 'node:path';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {RECORDS} from './data-dir.mjs';

const exec=promisify(execFile);
export const ROOT=path.dirname(fileURLToPath(import.meta.url));
export const PATENT_ASSETS=path.join(RECORDS,'_patent_documents');
export function officialPdf(id){if(!/^US(?:D)?\d+(?:[ABS]\d?)?$/.test(id))return '';const num=id.replace(/^US/,'').replace(/[ABS]\d?$/,'');return 'https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/'+num;}
export async function pdfEvidence(p,reader,{ocr=true}={}){
 if(!/^US(?:D)?\d+(?:[ABS]\d?)?$/.test(p.id))throw new Error('官方PDF补充当前只支持美国文献。');
 const dir=path.join(PATENT_ASSETS,p.id);await fs.mkdir(dir,{recursive:true});
 const pdf=path.join(dir,'original.pdf'),meta=path.join(dir,'pdf-pages.json');
 const url=officialPdf(p.id);let downloadedAt;
 try{await fs.access(pdf)}catch{const r=await reader(url,{binary:true,max:22000000,timeout:35000});if(!Buffer.isBuffer(r.data)||r.data.subarray(0,4).toString()!=='%PDF')throw new Error('USPTO未返回有效PDF。');await fs.writeFile(pdf,r.data);downloadedAt=new Date().toISOString()}
 let data;
 try{data=JSON.parse(await fs.readFile(meta,'utf8'))}catch{
   const bundledPython=path.join(RECORDS,'.venv',process.platform==='win32'?'Scripts/python.exe':'bin/python');
   const python=process.env.PATENTLENS_PYTHON||(existsSync(bundledPython)?bundledPython:(process.platform==='win32'?'python':'python3'));
   try{await exec(python,[path.join(ROOT,'pdf-pages.py'),pdf,dir],{windowsHide:true,timeout:100000,maxBuffer:2000000})}catch(e){throw new Error('官方PDF已保存，原文页渲染失败：'+(e.stderr||e.message).slice(0,300))}
   data=JSON.parse(await fs.readFile(meta,'utf8'));
 }
 let texts=data.texts||[],ocrState='无需OCR';
 if(data.scanned&&ocr){
   const ocrOut=path.join(dir,'ocr-text.json');
   try{const rows=JSON.parse((await fs.readFile(ocrOut,'utf8')).replace(/^\ufeff/,''));const expected=Math.max(2,data.pageCount-4);if(data.pageCount>5&&!rows.some(x=>x.page===expected))throw new Error('OCR coverage needs expansion');texts=Array.isArray(rows)?rows.map(x=>x.text):[rows.text];ocrState='Windows OCR缓存，须核对扫描原文'}catch{
     const pages=[data.rendered[0],...data.rendered.slice(-5)].filter((v,i,a)=>v&&a.findIndex(x=>x?.page===v.page)===i);
     const request=path.join(dir,'ocr-request.json');await fs.writeFile(request,JSON.stringify({pages:pages.map(x=>({page:x.page,path:path.join(dir,x.file)})),output:ocrOut}));
     try{await exec(path.join(process.env.SystemRoot||'C:/Windows','System32','WindowsPowerShell','v1.0','powershell.exe'),['-NoLogo','-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(ROOT,'ocr-pages.ps1'),'-RequestFile',request],{windowsHide:true,timeout:55000,maxBuffer:1000000});const rows=JSON.parse((await fs.readFile(ocrOut,'utf8')).replace(/^\ufeff/,''));texts=(Array.isArray(rows)?rows:[rows]).map(x=>x.text);ocrState='Windows OCR，仅首页和末5页，须核对扫描原文'}catch(e){ocrState='扫描版；OCR不可用，请直接查看原始页'}
   }
 }
 const text=texts.join('\n\n');
 const cm=text.match(/(?:what\s+(?:I|we)\s+claim\s+is|what\s+is\s+claimed\s+is|the\s+invention\s+claimed\s+is|I\s+claim)\s*:?\s*([\s\S]+)/i);
 const designClaim=text.match(/The ornamental design[\s\S]{0,450}?(?:described|shown)\./i)?.[0];
 const numbered=texts.slice(1).join('\n').match(/(?:^|\n)1\.\s+([\s\S]+)/)?.[0];
 const claim=p.claimsBasis==='USPTO官方公告正文'?p.claims:(designClaim||cm?.[1]||numbered||'');
 const sourceText='USPTO官方PDF'+(data.scanned?'扫描页':'原文');
 return {...p,pdf:url,officialPdf:url,localPdf:'/api/patents/'+p.id+'/original.pdf',images:data.rendered.map(x=>'/api/patents/'+p.id+'/'+x.file),imageLabels:data.rendered.map(x=>'原文第'+x.page+'页'),pageCount:data.pageCount,officialDocumentAvailable:true,officialStatus:'unknown',status:p.status||'unknown',claims:claim.slice(0,35000),claimsBasis:p.claimsBasis||(data.scanned?'官方扫描页OCR，须核对原图':'PDF可检索文字'),claimsTruncated:claim.length>35000,description:text.slice(0,30000),descriptionTruncated:text.length>30000,detailState:'已读取官方PDF（'+data.pageCount+'页）',detailAt:new Date().toISOString(),evidenceMethod:sourceText+'；'+ocrState,ocr:!!data.scanned,ocrState,renderingTruncated:data.renderingTruncated,source:sourceText,downloadedAt};
}
