// Sparse planted edges observed in the archive photograph, with schematic positions rather than surveyed landscaping.
export function createEnvironment(T) {
  const group = new T.Group(); group.name = 'Harput - olcusuz yakin cevre';
  let seed = 62317;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const bark = new T.MeshStandardMaterial({ color: 0x625d4d, roughness: 1 });
  const soil = new T.MeshStandardMaterial({ color: 0x9b9e8c, roughness: 1 });
  const path = new T.MeshStandardMaterial({ color: 0xb9b8a8, roughness: .98 });
  const oldBark = new T.MeshStandardMaterial({ color: 0x625440, roughness: 1 });
  const barkCanvas = document.createElement('canvas'); barkCanvas.width = barkCanvas.height = 256;
  const barkContext = barkCanvas.getContext('2d'); barkContext.fillStyle = '#b7aa8c'; barkContext.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 540; i++) {
    barkContext.fillStyle = i % 3 ? '#796e59' : '#d0c4a7';
    barkContext.fillRect(random() * 256, random() * 256, .5 + random() * 2, 5 + random() * 48);
  }
  oldBark.map = new T.CanvasTexture(barkCanvas); oldBark.map.colorSpace = T.SRGBColorSpace;
  const surroundBrick = new T.MeshStandardMaterial({ color: 0x9a7158, roughness: .98 });
  const darkEarth = new T.MeshStandardMaterial({ color: 0x49483d, roughness: 1 });
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
  function makeMulberry() {
    const tree = new T.Group();
    tree.name = 'Egik dut - Ulu Agac';
    tree.position.set(-2, -.32, -4.7);
    tree.userData = {
      kind: 'mulberry',
      representation: 'Guney duvarina bitisik egik dutun fotograf ve kaynaklardan gelistirilmis olcusuz temsili.'
    };
    group.add(tree);

    const surround = new T.Group(); surround.name = 'Egik dut koruyucu cevresi'; tree.add(surround);
    const border = new T.Shape(); border.absellipse(0, 0, 1.7, .7, 0, Math.PI * 2, false);
    const hollow = new T.Path(); hollow.absellipse(0, 0, 1.49, .49, 0, Math.PI * 2, true); border.holes.push(hollow);
    const brickRing = new T.Mesh(new T.ExtrudeGeometry(border, {depth:.23, bevelEnabled:false, curveSegments:48}), surroundBrick);
    brickRing.rotation.x = -Math.PI / 2; brickRing.position.y = .015;
    brickRing.castShadow = brickRing.receiveShadow = true; surround.add(brickRing);
    const bed = new T.Mesh(new T.CircleGeometry(1.22, 48), darkEarth);
    bed.rotation.x = -Math.PI / 2; bed.scale.set(1.35, .55, 1); bed.position.y = .155; bed.receiveShadow = true; surround.add(bed);

    const rootMass = new T.Mesh(new T.SphereGeometry(1, 18, 10), oldBark);
    rootMass.scale.set(1.38, .34, .62); rootMass.position.set(-.05, .25, .02);
    rootMass.castShadow = rootMass.receiveShadow = true; rootMass.userData.part = 'mulberry-root'; tree.add(rootMass);

    const trunkPoints = [
      [[-1.3,.18,.02],[-.5,.26,.08],[.25,.7,.12],[.6,1.9,.28],[1,3.15,.34]],
      [[-.9,.2,.1],[.2,.33,.03],[1.05,.6,.2],[1.8,1.5,.43],[2.25,3.02,.58]],
      [[-1.1,.18,-.03],[-.3,.27,-.25],[.3,.7,-.55],[.5,1.9,-.95],[.8,3.1,-1.2]]
    ];
    trunkPoints.forEach((points, index) => {
      const curve = new T.CatmullRomCurve3(points.map(point => new T.Vector3(...point)), false, 'catmullrom', .32);
      const geometry = new T.TubeGeometry(curve, 40, .29 - index * .04, 10, false);
      const positions = geometry.attributes.position;
      // Vary each cross-section around its centre so roots thicken and branch tips taper.
      for (let ring = 0; ring <= 40; ring++) {
        const t = ring / 40, centre = curve.getPointAt(t);
        const taper = (1.35 - t * 1.1) * (1 + Math.sin(t * 27 + index) * .065);
        for (let side = 0; side <= 10; side++) {
          const vertex = ring * 11 + side;
          positions.setXYZ(vertex,
            centre.x + (positions.getX(vertex) - centre.x) * taper,
            centre.y + (positions.getY(vertex) - centre.y) * taper,
            centre.z + (positions.getZ(vertex) - centre.z) * taper);
        }
      }
      geometry.computeVertexNormals();
      const trunk = new T.Mesh(geometry, oldBark);
      trunk.castShadow = trunk.receiveShadow = true; trunk.userData.part = 'mulberry-trunk'; tree.add(trunk);
    });

    // Low secondary limbs keep the photographed crown wide without multiplying draw calls.
    const limbs = new T.Group(); limbs.name = 'Egik dut ikincil dallari'; tree.add(limbs);
    const limbStarts = [trunkPoints[0][2], trunkPoints[0][3], trunkPoints[1][2], trunkPoints[1][3], trunkPoints[2][2], trunkPoints[2][3]];
    const crownCenters = [
      [-1.9,3.05,.25],[-1.1,3.35,-.1],[-.45,3.45,.05],[.55,3.55,-.18],[1.65,3.48,.25],[2.7,3.35,.58],
      [-1.35,3.15,1.0],[.15,3.25,1.05],[1.5,3.15,-1.0]
    ];
    limbStarts.forEach((start, index) => {
      const end = crownCenters[(index * 2 + 1) % crownCenters.length];
      const mid = [(start[0] + end[0]) * .5, Math.max(start[1], end[1]) + .15, (start[2] + end[2]) * .5];
      const curve = new T.CatmullRomCurve3([new T.Vector3(...start), new T.Vector3(...mid), new T.Vector3(...end)]);
      const limb = new T.Mesh(new T.TubeGeometry(curve, 10, .065, 6, false), oldBark);
      limb.castShadow = true; limb.userData.part = 'mulberry-limb'; limbs.add(limb);
    });

    const crown = new T.Group(); crown.name = 'Egik dut yaprak taclari'; tree.add(crown); swaying.push({ crown, phase: 5.6 });
    const leaves = [];
    for (const [cx, cy, cz] of crownCenters) {
      for (let i = 0; i < 38; i++) {
        const phi = random() * Math.PI * 2, radial = Math.sqrt(random());
        leaves.push([
          cx + Math.cos(phi) * radial * .78,
          cy + (random() - .48) * .95,
          cz + Math.sin(phi) * radial * .62,
          .19 + random() * .24,
          random() * Math.PI * 2
        ]);
      }
    }
    const foliage = new T.InstancedMesh(leafGeometry, leafMaterial, leaves.length);
    leaves.forEach(([lx, ly, lz, size, angle], i) => {
      dummy.position.set(lx, ly, lz); dummy.rotation.set((random() - .5) * 1.8, angle, (random() - .5) * 1.3);
      dummy.scale.set(size, size * 1.38, 1); dummy.updateMatrix(); foliage.setMatrixAt(i, dummy.matrix);
      foliage.setColorAt(i, new T.Color().setHSL(.245 + random() * .045, .25 + random() * .14, .55 + random() * .2));
    });
    foliage.castShadow = foliage.receiveShadow = true; crown.add(foliage);
    return tree;
  }
  // Keep the west entry approach clear; planted edges frame the monument instead of covering it.
  makeTree(-8.1, 3.9, 6.8, true, .3);
  makeTree(5.6, 7.5, 7.5, true, 1.7);
  makeTree(-7.8, -4.6, 5.3, false, 3.1);
  makeTree(7.8, -4.3, 4.7, false, 4.5);
  const mulberry = makeMulberry();
  const mulberryFocus = new T.Vector3(-2, 1.35, -4.7);
  function update(time) {
    for (const { crown, phase } of swaying) { crown.rotation.z = Math.sin(time * .34 + phase) * .0035; crown.rotation.x = Math.sin(time * .27 + phase) * .002; }
  }
  group.userData.representation = 'Fotograftaki agac turu ve konum iliskilerinden olcusuz, sade yakin cevre; egik dut guney duvari kaynaklarina gore yerlestirilmistir. Gercek peyzaj rolovesi degildir.';
  return { group, update, mulberry, mulberryFocus };
}
