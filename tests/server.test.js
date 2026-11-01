import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:net';

let server,base,bytes;
before(async()=>{
 const portProbe=createServer().listen(0,'127.0.0.1');await once(portProbe,'listening');
 const port=portProbe.address().port;await new Promise(resolve=>portProbe.close(resolve));
 server=spawn(process.execPath,['server.cjs'],{cwd:new URL('..',import.meta.url),env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
 await Promise.race([once(server.stdout,'data'),once(server,'exit').then(()=>{throw Error('Server exited early');})]);
 base=`http://127.0.0.1:${port}`;bytes=await readFile(new URL('../dist/assets/cami.jpg',import.meta.url));
});
after(async()=>{if(server&&server.exitCode===null){server.kill();await once(server,'exit');}});

test('MP4 is served as video/mp4 with byte range support',async()=>{
 const response=await fetch(`${base}/assets/hero-drone.mp4`,{method:'HEAD'});
 assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'video/mp4');
 assert.equal(response.headers.get('accept-ranges'),'bytes');assert.ok(Number(response.headers.get('content-length'))>0);
});

test('HEAD reports the full representation length without a response body',async()=>{
 const response=await fetch(`${base}/assets/cami.jpg`,{method:'HEAD'});
 assert.equal(response.status,200);assert.equal(response.headers.get('content-length'),String(bytes.length));
 assert.equal((await response.arrayBuffer()).byteLength,0);
});

for(const [range,start,end] of [['bytes=0-15',0,15],['bytes=16-',16,null],['bytes=-12',null,null],['bytes=0-999999999',0,null]]){
 test(`single range ${range} returns precisely the requested bytes`,async()=>{
  const first=start??bytes.length-12,last=end??bytes.length-1;
  const response=await fetch(`${base}/assets/cami.jpg`,{headers:{Range:range}});
  assert.equal(response.status,206);assert.equal(response.headers.get('content-range'),`bytes ${first}-${last}/${bytes.length}`);
  assert.equal(response.headers.get('content-length'),String(last-first+1));
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),bytes.subarray(first,last+1));
 });
}

for(const range of ['bytes=999999999-','bytes=10-5','bytes=-0','bytes=abc-def','bytes=0-1,4-5','items=0-1']){
 test(`invalid or unsupported range ${range} is rejected without file bytes`,async()=>{
  const response=await fetch(`${base}/assets/cami.jpg`,{headers:{Range:range}});
  assert.equal(response.status,416);assert.equal(response.headers.get('content-range'),`bytes */${bytes.length}`);
  assert.equal((await response.arrayBuffer()).byteLength,0);
 });
}

test('HEAD ignores a Range header and reports the full representation',async()=>{
 const response=await fetch(`${base}/assets/cami.jpg`,{method:'HEAD',headers:{Range:'bytes=0-15'}});
 assert.equal(response.status,200);assert.equal(response.headers.get('content-length'),String(bytes.length));
 assert.equal((await response.arrayBuffer()).byteLength,0);
});

test('missing paths and directories return 404 and unsupported methods return 405',async()=>{
 for(const route of ['/missing.mp4','/assets/'])assert.equal((await fetch(base+route)).status,404);
 const response=await fetch(base,{method:'POST'});assert.equal(response.status,405);assert.equal(response.headers.get('allow'),'GET, HEAD');
});

test('NUL path input is rejected without terminating the server',async()=>{
 const response=await fetch(`${base}/%00`);
 assert.equal(response.status,400);
 assert.equal((await response.arrayBuffer()).byteLength,0);
 assert.equal((await fetch(base,{method:'HEAD'})).status,200);
});
