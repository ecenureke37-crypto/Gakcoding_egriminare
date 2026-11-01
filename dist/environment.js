// Sparse planted edges observed in the archive photograph, with schematic positions rather than surveyed landscaping.
export function createEnvironment(T) {
  const group = new T.Group(); group.name = 'Harput - olcusuz yakin cevre';
  let seed = 62317;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const bark = new T.MeshStandardMaterial({ color: 0x625d4d, roughness: 1 });
  const soil = new T.MeshStandardMaterial({ color: 0x9b9e8c, roughness: 1 });
  const path = new T.MeshStandardMaterial({ color: 0xb9b8a8, roughness: .98 });
  const ground = new T.Mesh(new T.PlaneGeometry(31, 29), soil); ground.rotation.x = -Math.PI / 2; ground.position.set(-1.5, -.355, 1); ground.receiveShadow = true; group.add(ground);
  const approach = new T.Mesh(new T.PlaneGeometry(7.8, 1.5), path); approach.rotation.x = -Math.PI / 2; approach.position.set(5.3, -.345, -.05); approach.receiveShadow = true; group.add(approach);
  function leafTexture(needle = false) {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128; const c = canvas.getContext('2d');
    c.clearRect(0, 0, 128, 128);
    if (needle) {
      c.strokeStyle = '#dce4d1'; c.lineWidth = 1.8;
      c.beginPath(); c.moveTo(64, 119); c.lineTo(64, 9); c.stroke();
      for (let i = 0; i < 12; i++) { const y = 20 + i * 7.5, length = 13 + i * 1.7; c.beginPath(); c.moveTo(64, y + 9); c.lineTo(64 - length, y - 12); c.moveTo(64, y + 9); c.lineTo(64 + length, y - 12); c.stroke(); }
    } else {
      c.fillStyle = '#e0e7cb'; c.beginPath(); c.moveTo(64, 5); c.bezierCurveTo(12, 30, 18, 92, 64, 123); c.bezierCurveTo(109, 93, 115, 34, 64, 5); c.fill();
      c.strokeStyle = '#afc191'; c.lineWidth = 2; c.beginPath(); c.moveTo(64, 12); c.lineTo(64, 119); c.stroke();
    }
    const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace; texture.anisotropy = 2; return texture;
  }
  const leafMaterial = new T.MeshStandardMaterial({ color: 0x647c49, map: leafTexture(), alphaTest: .36, roughness: .9, side: T.DoubleSide });
  const needleMaterial = new T.MeshStandardMaterial({ color: 0x456754, map: leafTexture(true), alphaTest: .3, roughness: .95, side: T.DoubleSide });
  const twigGeometry = new T.CylinderGeometry(1, 1, 1, 5), leafGeometry = new T.PlaneGeometry(1, 1);
  const up = new T.Vector3(0, 1, 0), dummy = new T.Object3D(), swaying = [];
  function makeTree(x, z, height, evergreen, phase) {
    const tree = new T.Group(); tree.position.set(x, -.32, z); tree.name = evergreen ? 'Igneli yaprakli agac' : 'Genis yaprakli agac'; group.add(tree);
    const crown = new T.Group(); tree.add(crown); swaying.push({ crown, phase });
    const segments = [], leaves = [];
    function branch(a, b, radius) { segments.push({ a: new T.Vector3(...a), b: new T.Vector3(...b), radius }); }
    branch([0, 0, 0], [.08, height * .72, .05], evergreen ? .14 : .2);
    if (evergreen) {
      for (let tier = 0; tier < 11; tier++) {
        const y = height * (.18 + tier * .069), radius = height * (.31 - tier * .024);
        for (let arm = 0; arm < 9; arm++) {
          const angle = arm / 9 * Math.PI * 2 + tier * .7 + random() * .3, end = [Math.cos(angle) * radius, y + .12 - radius * .06, Math.sin(angle) * radius];
          branch([.05, y, 0], end, .024 + .017 * (1 - tier / 11));
          for (let i = 0; i < 23; i++) {
            const t = .27 + random() * .75, spread = .1 + radius * .12;
            leaves.push([end[0] * t + (random() - .5) * spread, y + (random() - .5) * .24, end[2] * t + (random() - .5) * spread, .22 + random() * .28, angle + random() * 1.1]);
          }
        }
      }
    } else {
      for (let arm = 0; arm < 10; arm++) {
        const angle = arm / 10 * Math.PI * 2 + random() * .4, reach = height * (.24 + random() * .12), y = height * (.41 + random() * .19);
        const end = [Math.cos(angle) * reach, y + height * .22, Math.sin(angle) * reach]; branch([0, height * .36, 0], end, .055);
        for (let j = 0; j < 5; j++) {
          const a = angle + (j - 2) * .5, r = .45 + random() * .52, tip = [end[0] + Math.cos(a) * r, end[1] + (random() - .25) * .8, end[2] + Math.sin(a) * r];
          branch(end, tip, .014);
          for (let i = 0; i < 25; i++) {
            const phi = random() * Math.PI * 2, radial = Math.sqrt(random()) * .6;
            leaves.push([tip[0] + Math.cos(phi) * radial, tip[1] + (random() - .5) * .72, tip[2] + Math.sin(phi) * radial, .16 + random() * .19, random() * Math.PI * 2]);
          }
        }
      }
    }
    const branches = new T.InstancedMesh(twigGeometry, bark, segments.length);
    segments.forEach(({ a, b, radius }, i) => { const vector = b.clone().sub(a); dummy.position.copy(a).add(b).multiplyScalar(.5); dummy.quaternion.setFromUnitVectors(up, vector.clone().normalize()); dummy.scale.set(radius, vector.length(), radius); dummy.updateMatrix(); branches.setMatrixAt(i, dummy.matrix); });
    branches.castShadow = branches.receiveShadow = true; crown.add(branches);
    const foliage = new T.InstancedMesh(leafGeometry, evergreen ? needleMaterial : leafMaterial, leaves.length);
    leaves.forEach(([lx, ly, lz, size, angle], i) => { dummy.position.set(lx, ly, lz); dummy.rotation.set((random() - .5) * 2.2, angle, (random() - .5) * 1.6); dummy.scale.set(size, evergreen ? size * .68 : size * 1.4, 1); dummy.updateMatrix(); foliage.setMatrixAt(i, dummy.matrix); foliage.setColorAt(i, new T.Color().setHSL(evergreen ? .36 + random() * .035 : .24 + random() * .055, .18 + random() * .15, .62 + random() * .22)); });
    foliage.castShadow = true; foliage.receiveShadow = true; crown.add(foliage);
  }
  // Keep the west entry approach clear; planted edges frame the monument instead of covering it.
  makeTree(-8.1, 3.9, 6.8, true, .3);
  makeTree(5.6, 7.5, 7.5, true, 1.7);
  makeTree(-7.8, -4.6, 5.3, false, 3.1);
  makeTree(7.8, -4.3, 4.7, false, 4.5);
  function update(time) {
    for (const { crown, phase } of swaying) { crown.rotation.z = Math.sin(time * .34 + phase) * .0035; crown.rotation.x = Math.sin(time * .27 + phase) * .002; }
  }
  group.userData.representation = 'Fotograftaki agac turu ve konum iliskilerinden olcusuz, sade yakin cevre; gercek peyzaj rolovesi degildir.';
  return { group, update };
}
