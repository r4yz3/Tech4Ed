import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve('public');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403,{'Content-Type':types['.html']});res.end(await readFile(resolve(root,'403.html')));return;}const file=path===root?resolve(root,'index.html'):path;const content=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(content);}catch{try{res.writeHead(404,{'Content-Type':types['.html']});res.end(await readFile(resolve(root,'404.html')));}catch{res.writeHead(404).end('Not found');}}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
