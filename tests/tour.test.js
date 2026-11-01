import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createTourPlayer, tourStops, tourDuration} from '../dist/tour.js';

test('paused tour holds its position and playback advances only when requested', () => {
 const tour=createTourPlayer(T);
 tour.seek(20); tour.update(.1);
 assert.equal(tour.time,20);
 tour.play(); tour.update(.1);
 assert.ok(tour.time>20);
 tour.pause(); const paused=tour.time; tour.update(1);
 assert.equal(tour.time,paused);
});

test('seeking is clamped and reaching the end stops playback', () => {
 const tour=createTourPlayer(T);
 tour.seek(-10); assert.equal(tour.time,0);
 tour.seek(tourDuration+20); assert.equal(tour.time,tourDuration);
 tour.seek(tourDuration-.02); tour.play(); tour.update(.05);
 assert.equal(tour.time,tourDuration); assert.equal(tour.playing,false);
});

test('a hidden-tab interval cannot skip the tour', () => {
 const tour=createTourPlayer(T); tour.play(); tour.update(90);
 assert.ok(tour.time<=.1);
});

test('all stop positions and sampled route poses are finite and at visitor eye height', () => {
 const tour=createTourPlayer(T);
 assert.equal(tourStops.length,6);
 for(let time=0;time<=tourDuration;time+=.125){
  tour.seek(time); const pose=tour.pose();
  for(const n of [...pose.position.toArray(),...pose.target.toArray()])assert.ok(Number.isFinite(n));
  assert.ok(pose.position.y>=1.2&&pose.position.y<=1.6);
  assert.ok(pose.position.distanceTo(pose.target)>.25);
 }
});

test('stop jumps settle exactly and invalid timeline input does not corrupt the pose', () => {
 const tour=createTourPlayer(T);
 tour.goTo(3,{immediate:true}); assert.equal(tour.stopIndex,3);
 assert.equal(tour.time,tourStops[3].time);
 const before=tour.time; tour.seek(NaN); assert.equal(tour.time,before);
 tour.goTo(99,{immediate:true}); assert.equal(tour.stopIndex,5);
});
