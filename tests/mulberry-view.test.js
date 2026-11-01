import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chapters} from '../dist/story-content.js';

const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');

test('mulberry chapter keeps the south-wall location and legend boundary explicit',()=>{
 const chapter=chapters.mulberry;
 assert.ok(chapter,'mulberry chapter must exist');
 assert.match(chapter.label,/Eğik dut/);
 assert.match(chapter.paragraph,/güney|kıble/i);
 assert.match(chapter.paragraph,/mihrab|mihrap/i);
 assert.match(chapter.paragraph,/rivayet|halk anlatısı/i);
 assert.match(chapter.source,/kulturportali|elazig\.ktb\.gov\.tr/i);
});

test('mulberry identity is wired to photo, camera, hotspot and sixth stop',()=>{
 assert.match(app,/const order=\[[^\]]*'mulberry'[^\]]*\]/);
 assert.match(app,/mulberry:\{src:'assets\/egik-dut-reference\.png'/);
 assert.match(app,/mulberry:\{target:\[-2,[\d.]+,-4\.7\]/);
 assert.match(app,/mulberry:new T\.Vector3\(-2,[^,]+,-4\.7\)/);
 assert.match(html,/data-spot="mulberry"/);
 assert.match(html,/data-view="mulberry"[^>]*>[\s\S]*?<span>06<\/span>Eğik dut<\/button>/);
});

test('story card identifies the real location without presenting the legend as fact',()=>{
 const card=html.match(/<article class="story-entry-legend">[\s\S]*?<\/article>/)?.[0]??'';
 assert.match(card,/güney|kıble/i);
 assert.match(card,/mihrab/i);
 assert.match(card,/rivayet|efsane|halk anlatısı/i);
 assert.match(card,/bilimsel|tarihsel gerçek/i);
});
