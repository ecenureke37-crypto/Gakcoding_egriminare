import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import { createArchitecture } from '../dist/architecture.js';
import { createTourPlayer, tourDuration } from '../dist/tour.js';

test('mihrab is recessed and courtyard detail leaves the tour clear', () => {
  const originalDocument = globalThis.document;
  const context = new Proxy({}, { get: () => () => {} });
  globalThis.document = { createElement: () => ({ getContext: () => context }) };
  try {
    const building = createArchitecture({ ...T, TextureLoader: class { load() { return new T.Texture(); } } });
    building.group.updateMatrixWorld(true);
    const ray = (x, y) => new T.Raycaster(new T.Vector3(x, y, -2.75), new T.Vector3(0, 0, -1), 0, 2);
    const back = ray(-2, 1.1).intersectObject(building.mihrab, true)[0];
    const edge = ray(-1.56, 1.1).intersectObject(building.mihrab, true)[0];
    assert.ok(back && edge);
    assert.ok(edge.point.z - back.point.z > .28, 'the opening must have physical depth');
    assert.equal(back.object.geometry.type, 'ShapeGeometry');
    assert.equal(back.object.material.metalness, 0);
    assert.equal(back.object.material.roughness, 1);
    const featureSize = new T.Box3().setFromObject(building.courtyardWaterFeature).getSize(new T.Vector3());
    assert.ok(featureSize.y < .35 && featureSize.x < .75, 'the archive water feature stays low and compact');

    const targets = [];
    building.group.traverse(object => { if (object.isMesh && object !== building.entranceDoor) targets.push(object); });
    const player = createTourPlayer(T);
    let previous;
    for (let sample = 0; sample <= tourDuration * 10; sample++) {
      player.seek(sample / 10);
      const point = player.pose().position;
      if (previous) {
        const direction = point.clone().sub(previous), distance = direction.length();
        if (distance > .00001) assert.equal(new T.Raycaster(previous, direction.normalize(), .0001, distance).intersectObjects(targets, false).length, 0, `route crosses geometry at ${sample / 10}s`);
      }
      for (let direction = 0; direction < 24; direction++) {
        const angle = direction * Math.PI / 12;
        assert.equal(new T.Raycaster(point, new T.Vector3(Math.cos(angle), 0, Math.sin(angle)), .001, .1).intersectObjects(targets, false).length, 0, `camera clearance below .1 at ${sample / 10}s`);
      }
      previous = point;
    }
  } finally {
    if (originalDocument === undefined) delete globalThis.document;
    else globalThis.document = originalDocument;
  }
});
