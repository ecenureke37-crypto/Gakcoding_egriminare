import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import { createArchitecture } from '../dist/architecture.js';
import { createMinaret } from '../dist/minaret.js';

function withCanvasDocument(run) {
  const originalDocument = globalThis.document;
  globalThis.document = {
    createElement: () => {
      const canvas = { width: 0, height: 0 };
      const context = new Proxy({
        getImageData: () => ({ data: new Uint8ClampedArray(canvas.width * canvas.height * 4) }),
      }, { get: (target, property) => property in target ? target[property] : () => {} });
      canvas.getContext = () => context;
      return canvas;
    },
  };
  try {
    return run();
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
}

test('minaret shaft remains inside the mosque roof envelope at roof height', () => withCanvasDocument(() => {
  const building = createArchitecture({ ...T, TextureLoader: class { load() { return new T.Texture(); } } });
  const minaret = createMinaret(T);
  minaret.position.copy(building.group.userData.minaretBase);
  minaret.updateMatrixWorld(true);

  const roofOuterEdge = 2.08;
  const ray = new T.Raycaster(new T.Vector3(4, 3.05, 2.25), new T.Vector3(-1, 0, 0), 0, 5);
  const shaftHit = ray.intersectObject(minaret, true)[0];

  assert.ok(shaftHit, 'a roof-height ray must hit the minaret shaft');
  assert.ok(shaftHit.point.x <= roofOuterEdge, `shaft edge ${shaftHit.point.x.toFixed(3)} must stay within roof edge ${roofOuterEdge}`);
}));

test('balcony includes a solid annular deck below the parapet', () => withCanvasDocument(() => {
  const minaret = createMinaret(T);
  minaret.updateMatrixWorld(true);
  const localOrigin = new T.Vector3(.8, 9, 0);
  const worldOrigin = minaret.localToWorld(localOrigin.clone());
  const worldDown = new T.Vector3(0, -1, 0).transformDirection(minaret.matrixWorld);
  const hit = new T.Raycaster(worldOrigin, worldDown, 0, 2).intersectObject(minaret, true)
    .find(({ object }) => object.geometry?.type === 'RingGeometry');

  assert.ok(hit, 'a downward ray at balcony radius must hit a solid ring deck');
  const localHit = minaret.worldToLocal(hit.point.clone());
  assert.ok(Math.abs(localHit.y - 8.205) < .02, `deck height ${localHit.y.toFixed(3)} must close the balcony at 8.205`);
}));

test('upper drum extends down behind the balcony deck', () => withCanvasDocument(() => {
  const minaret = createMinaret(T);
  const upperDrum = minaret.children.find(({ geometry }) => geometry?.type === 'CylinderGeometry');

  assert.ok(upperDrum, 'the upper drum must exist');
  const drumBottom = upperDrum.position.y - upperDrum.geometry.parameters.height / 2;
  assert.ok(drumBottom <= 8.205, `upper drum bottom ${drumBottom.toFixed(3)} must overlap the balcony deck`);
}));
