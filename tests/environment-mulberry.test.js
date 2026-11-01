import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import { createEnvironment } from '../dist/environment.js';

function withCanvasDocument(run) {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement: () => {
      const canvas = { width: 0, height: 0 };
      const context = new Proxy({}, { get: () => () => {} });
      canvas.getContext = () => context;
      return canvas;
    },
  };
  try { return run(); }
  finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
}

test('leaning mulberry sits outside the south wall behind the mihrab', () => withCanvasDocument(() => {
  const environment = createEnvironment(T);

  assert.ok(environment.mulberry, 'environment must expose the dedicated mulberry group');
  assert.ok(environment.mulberryFocus?.isVector3, 'environment must expose a camera focus point');
  assert.ok(Math.abs(environment.mulberry.position.x + 2) < .25, 'mulberry must stay close to the mihrab axis');
  assert.ok(environment.mulberry.position.z < -4.2, 'mulberry roots must remain outside the south wall');
  assert.ok(environment.mulberryFocus.distanceTo(new T.Vector3(-2, 1.35, -4.7)) < .8, 'focus must frame the leaning trunk and crown');
}));

test('mulberry has multiple curved trunks with a horizontal first movement', () => withCanvasDocument(() => {
  const { mulberry } = createEnvironment(T);
  const trunks = [];
  mulberry.traverse(object => { if (object.geometry?.type === 'TubeGeometry' && object.userData.part === 'mulberry-trunk') trunks.push(object); });

  assert.ok(trunks.length >= 3, `expected at least three separate curved trunks, found ${trunks.length}`);
  for (const trunk of trunks) {
    const path = trunk.geometry.parameters.path;
    const start = path.getPoint(0), early = path.getPoint(.28), movement = early.clone().sub(start);
    const horizontal = Math.hypot(movement.x, movement.z);
    assert.ok(horizontal > Math.abs(movement.y), 'each primary trunk must begin by leaning more than rising');
  }
}));

test('mulberry is broad and its protective surround stays clear of the museum route', () => withCanvasDocument(() => {
  const { mulberry } = createEnvironment(T);
  mulberry.updateMatrixWorld(true);
  const size = new T.Box3().setFromObject(mulberry).getSize(new T.Vector3());
  const surround = mulberry.getObjectByName('Egik dut koruyucu cevresi');

  assert.ok(size.x >= size.y * .9, `crown must read broad and low; width ${size.x.toFixed(2)}, height ${size.y.toFixed(2)}`);
  assert.ok(size.y < 5.1, `mulberry must not compete with the minaret; height ${size.y.toFixed(2)}`);
  assert.ok(surround, 'the photographed low protective surround must be represented');
  const surroundBox = new T.Box3().setFromObject(surround);
  assert.ok(surroundBox.max.z < -3.85, 'protective surround must not enter the south-side museum route');
  assert.ok(surroundBox.max.x < .1, 'protective surround must remain away from the east entrance approach');
}));

test('mulberry crown sways without moving the trunk group', () => withCanvasDocument(() => {
  const environment = createEnvironment(T);
  const trunk = environment.mulberry.children.find(child => child.userData.part === 'mulberry-trunk');
  const crown = environment.mulberry.getObjectByName('Egik dut yaprak taclari');
  const before = trunk?.matrix.clone();

  environment.update(3.25);

  assert.ok(crown, 'mulberry must expose a dedicated animated crown');
  assert.ok(Math.abs(crown.rotation.z) > 0, 'only the leaf crown should receive restrained wind motion');
  assert.ok(before?.equals(trunk.matrix), 'the old leaning trunk must remain structurally still');
}));
