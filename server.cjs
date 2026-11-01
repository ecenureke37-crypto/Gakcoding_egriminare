const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'dist'),port=Number(process.env.PORT)||5182;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.json':'application/json; charset=utf-8','.mp4':'video/mp4'};

function singleRange(value,size){
 const match=/^bytes=(\d*)-(\d*)$/.exec(value);
 if(!match||(!match[1]&&!match[2])||size===0)return null;
 let start,end;
 if(!match[1]){
  const suffix=Number(match[2]);if(!Number.isSafeInteger(suffix)||suffix<=0)return null;
  start=Math.max(0,size-suffix);end=size-1;
 }else{
  start=Number(match[1]);end=match[2]?Number(match[2]):size-1;
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return null;
  end=Math.min(end,size-1);
 }
 return {start,end};
}

http.createServer((req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,{'Allow':'GET, HEAD','Content-Length':0});return res.end();}
 let name;
 try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 if(name.includes('\0')){res.writeHead(400,{'Content-Length':0});return res.end();}
 const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 fs.stat(file,(err,stat)=>{
  if(err||!stat.isFile()){res.writeHead(404,{'Content-Length':0});return res.end();}
  const headers={'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes','Content-Length':stat.size};
  let range;
  if(req.method==='GET'&&req.headers.range){
   range=singleRange(req.headers.range,stat.size);
   if(!range){res.writeHead(416,{...headers,'Content-Range':`bytes */${stat.size}`,'Content-Length':0});return res.end();}
   headers['Content-Range']=`bytes ${range.start}-${range.end}/${stat.size}`;
   headers['Content-Length']=range.end-range.start+1;
  }
  res.writeHead(range?206:200,headers);
  if(req.method==='HEAD')return res.end();
  const stream=fs.createReadStream(file,range||{});
  stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 });
}).listen(port,'0.0.0.0',()=>console.log('Harput: http://127.0.0.1:'+port));
