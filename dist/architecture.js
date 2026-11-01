// Schematic geometry derived from the documented courtyard / two-aisle plan, not a survey.
export function createArchitecture(T) {
  const group = new T.Group();
  group.name = 'Harput Ulu Camii - temsili mimari';
  const roof = new T.Group(), cutWalls = new T.Group();
  roof.name = 'Kaldirilabilir ortu'; cutWalls.name = 'Kesit duvarlari';
  group.add(roof, cutWalls);
  let seed = 1157;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  function stoneTexture(bump = false) {
    seed = 1157;
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1024;
    const c = canvas.getContext('2d');
    c.fillStyle = bump ? '#555' : '#928c7e'; c.fillRect(0, 0, 1024, 1024);
    const points = [];
    for (let row = -1; row < 10; row++) for (let col = -1; col < 14; col++) points.push([(col + .12 + random() * .85) * 84, (row + .12 + random() * .85) * 126]);
    for (const p of points) {
      let polygon = [[p[0] - 160, p[1] - 180], [p[0] + 160, p[1] - 180], [p[0] + 160, p[1] + 180], [p[0] - 160, p[1] + 180]];
      for (const q of points) {
        const dx = q[0] - p[0], dy = q[1] - p[1];
        if (q === p || Math.abs(dx) > 220 || Math.abs(dy) > 270) continue;
        const border = (q[0] * q[0] + q[1] * q[1] - p[0] * p[0] - p[1] * p[1]) / 2, clipped = [];
        for (let k = 0; k < polygon.length; k++) {
          const a = polygon[k], b = polygon[(k + 1) % polygon.length], da = a[0] * dx + a[1] * dy - border, db = b[0] * dx + b[1] * dy - border;
          if (da <= 0) clipped.push(a);
          if ((da <= 0) !== (db <= 0)) { const t = da / (da - db); clipped.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
        }
        polygon = clipped; if (!polygon.length) break;
      }
      if (!polygon.length) continue;
      const tone = Math.floor(146 + random() * 42), warm = Math.floor(random() * 9);
      c.fillStyle = bump ? `rgb(${tone},${tone},${tone})` : `rgb(${tone + 4},${tone + warm},${tone - 9})`;
      c.beginPath(); polygon.forEach(([x, y], k) => { const px = p[0] + (x - p[0]) * .965, py = p[1] + (y - p[1]) * .965; if (!k) c.moveTo(px, py); else c.lineTo(px, py); }); c.closePath(); c.fill();
    }
    for (let i = 0; i < 36000; i++) {
      const v = random() > .5 ? 255 : 25;
      c.fillStyle = `rgba(${v},${v},${v},${.025 + random() * .055})`;
      c.fillRect(random() * 1024, random() * 1024, 1 + random() * 3, 1 + random() * 2);
    }
    const texture = new T.CanvasTexture(canvas); texture.wrapS = texture.wrapT = T.RepeatWrapping;
    if (!bump) texture.colorSpace = T.SRGBColorSpace;
    texture.repeat.set(2.1, 1.15); texture.anisotropy = 4; return texture;
  }
  function brickTexture(bump = false) {
    seed = 853;
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1024; const c = canvas.getContext('2d');
    c.fillStyle = bump ? '#444' : '#847563'; c.fillRect(0, 0, 1024, 1024);
    for (let row = 0; row < 20; row++) for (let col = -1; col < 9; col++) {
      const v = Math.floor(128 + random() * 36), x = (col + row % 2 * .5) * 128, y = row * 51.2;
      c.fillStyle = bump ? `rgb(${v + 40},${v + 40},${v + 40})` : `rgb(${v + 16},${v - 7},${v - 25})`; c.fillRect(x + 2, y + 2, 123, 46);
      for (let n = 0; n < 30; n++) { c.fillStyle = `rgba(30,20,15,${random() * .13})`; c.fillRect(x + random() * 126, y + random() * 48, 1 + random() * 6, 1 + random() * 2); }
    }
    const texture = new T.CanvasTexture(canvas); texture.wrapS = texture.wrapT = T.RepeatWrapping; if (!bump) texture.colorSpace = T.SRGBColorSpace; texture.anisotropy = 4; return texture;
  }
  const colorMap = stoneTexture(), bumpMap = stoneTexture(true);
  const realStone = new T.TextureLoader().load('assets/stone-surface.jpg');
  realStone.colorSpace=T.SRGBColorSpace;realStone.wrapS=realStone.wrapT=T.RepeatWrapping;realStone.repeat.set(1.4,1);realStone.anisotropy=4;
  const stone = new T.MeshStandardMaterial({ color: 0xffffff, map: realStone, bumpMap: realStone, bumpScale: .055, roughness: .96 });
  const ashlar = new T.MeshStandardMaterial({ color: 0xcfc9bb, map: colorMap, bumpMap, bumpScale: .027, roughness: .92 });
  const brick = new T.MeshStandardMaterial({ color: 0xc9bba8, map: brickTexture(), roughness: .98, bumpMap: brickTexture(true), bumpScale: .025 });
  const lead = new T.MeshStandardMaterial({ color: 0x6b7377, roughness: .82, metalness: .25 });
  const paving = new T.MeshStandardMaterial({ color: 0xa8a397, roughness: .95, map: colorMap, bumpMap, bumpScale: .015 });
  const dark = new T.MeshStandardMaterial({ color: 0x3d332a, roughness: .95 });
  const plaster = new T.MeshStandardMaterial({ color: 0xd7d3c6, roughness: .98, bumpMap, bumpScale: .007 });
  const greyPlinth = new T.MeshStandardMaterial({ color: 0xa2a49f, roughness: .96 });
  const carpetCanvas = document.createElement('canvas'); carpetCanvas.width = carpetCanvas.height = 512;
  const carpetContext = carpetCanvas.getContext('2d');
  carpetContext.fillStyle = '#995f59'; carpetContext.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 4; row++) {
    const y = row * 128;
    carpetContext.fillStyle = '#c3ac95'; carpetContext.fillRect(0, y, 512, 3);
    carpetContext.fillStyle = '#484b43'; carpetContext.fillRect(0, y + 5, 512, 8);
    carpetContext.fillStyle = '#c2af94'; carpetContext.fillRect(0, y + 14, 512, 2);
    for (let x = 24; x < 512; x += 64) {
      carpetContext.strokeStyle = '#b9a88e'; carpetContext.lineWidth = 3;
      carpetContext.beginPath(); carpetContext.moveTo(x - 18, y + 100); carpetContext.lineTo(x - 18, y + 43);
      carpetContext.quadraticCurveTo(x - 18, y + 22, x, y + 15); carpetContext.quadraticCurveTo(x + 18, y + 22, x + 18, y + 43);
      carpetContext.lineTo(x + 18, y + 100); carpetContext.stroke();
      carpetContext.strokeStyle = '#4d5046'; carpetContext.lineWidth = 3;
      carpetContext.beginPath(); carpetContext.moveTo(x - 22, y + 104); carpetContext.lineTo(x - 22, y + 42);
      carpetContext.quadraticCurveTo(x - 22, y + 17, x, y + 11); carpetContext.quadraticCurveTo(x + 22, y + 17, x + 22, y + 42);
      carpetContext.lineTo(x + 22, y + 104); carpetContext.stroke();
      for (let dy = 40; dy < 105; dy += 13) {
        carpetContext.fillStyle = '#c2b296'; carpetContext.fillRect(x - 20, y + dy, 3, 3); carpetContext.fillRect(x + 18, y + dy, 3, 3);
      }
    }
  }
  for (let i = 0; i < 12000; i++) { carpetContext.fillStyle = `rgba(210,211,183,${random() * .05})`; carpetContext.fillRect(random() * 512, random() * 512, 1, 2); }
  const carpetMap = new T.CanvasTexture(carpetCanvas); carpetMap.colorSpace = T.SRGBColorSpace; carpetMap.wrapS = carpetMap.wrapT = T.RepeatWrapping; carpetMap.repeat.set(2, 1);
  const carpet = new T.MeshStandardMaterial({ color: 0xffffff, map: carpetMap, bumpMap: carpetMap, bumpScale: .006, roughness: 1 });
  const vaultMaterial = brick.clone(); vaultMaterial.color.set(0xdcd5c7); vaultMaterial.side = T.DoubleSide;
  const boxGeometry = new T.BoxGeometry(1, 1, 1);
  function box(x, y, z, w, h, d, material = stone, parent = group) {
    const m = new T.Mesh(boxGeometry, material); m.position.set(x, y, z); m.scale.set(w, h, d);
    m.castShadow = m.receiveShadow = true; parent.add(m); return m;
  }
  function archGeometry(width, spring = 1.5, crown = 2.35, thickness = .36, top = 2.8) {
    const s = new T.Shape(); const half = width / 2;
    // A bottom-open notch is a single outline; a hole crossing the outer edge cannot triangulate reliably.
    s.moveTo(-half - .22, 0); s.lineTo(-half - .22, top); s.lineTo(half + .22, top); s.lineTo(half + .22, 0);
    s.lineTo(half, 0); s.lineTo(half, spring); s.quadraticCurveTo(half, crown - .3, 0, crown);
    s.quadraticCurveTo(-half, crown - .3, -half, spring); s.lineTo(-half, 0); s.closePath();
    return new T.ExtrudeGeometry(s, { depth: thickness, bevelEnabled: false, curveSegments: 16 });
  }
  function arches(positions, width = 1.06, rotate = 0, material = brick) {
    const geometry = archGeometry(width), inst = new T.InstancedMesh(geometry, material, positions.length);
    const dummy = new T.Object3D();
    positions.forEach(([x, y, z], i) => { dummy.position.set(x, y, z); dummy.rotation.y = rotate; dummy.updateMatrix(); inst.setMatrixAt(i, dummy.matrix); });
    inst.castShadow = inst.receiveShadow = true; group.add(inst); return inst;
  }
  // Schematic rectangle; exact dimensions and openings require a measured survey.
  box(-2, -.12, 1, 8.35, .24, 10.35, ashlar);
  box(-2, .025, 1, 7.55, .05, 9.55, paving);
  box(-2, .07, -1.85, 7.25, .06, 3.55, carpet);
  // Massive perimeter, with high narrow slit windows rather than broad modern glazing.
  box(-5.8, 1.42, 1, .4, 2.84, 10, stone);
  box(-2, 1.42, 5.8, 7.6, 2.84, .4, stone);
  box(-2, 1.42, -3.8, 7.6, 2.84, .4, stone, cutWalls);
  // West elevation: cümle kapısı and a separate recessed bay below the minaret.
  box(1.8, 1.42, -2.15, .4, 2.84, 3.3, stone, cutWalls);
  box(1.8, 1.42, 4.7, .4, 2.84, 2.2, stone, cutWalls);
  box(1.8, 2.57, 1.25, .4, .54, 4.9, stone, cutWalls);
  const portal = new T.Mesh(archGeometry(1.1, 1.55, 2.48, .32, 2.85), ashlar);
  portal.position.set(1.63, 0, -.05); portal.rotation.y = Math.PI / 2; portal.castShadow = portal.receiveShadow = true; cutWalls.add(portal);
  const entranceDoor = box(1.82, .95, -.05, .025, 1.9, .89, dark, cutWalls);
  entranceDoor.name = 'Gezide acilabilen giris kapisi';
  const baseArch = new T.Mesh(archGeometry(1.12, 1.12, 2.1, .32, 2.85), brick);
  baseArch.position.set(1.63, 0, 2.25); baseArch.rotation.y = Math.PI / 2; baseArch.castShadow = baseArch.receiveShadow = true; cutWalls.add(baseArch);
  for (const z of [-3.05, 4.65]) box(2.02, 2.25, z, .025, .4, .09, dark, cutWalls);
  for (const z of [-2.7, -.5, 1.65, 4.55]) box(-6.005, 2.18, z, .025, .44, .1, dark);
  // Two east-west aisles in the southern harim, on squat rectangular piers.
  const harimArches = [];
  for (let i = 0; i < 6; i++) harimArches.push([-5.05 + i * 1.22, 0, -1.85]);
  arches(harimArches, 1.0, 0, plaster);
  const archBand = new T.Shape();
  archBand.moveTo(-.5,1.5);archBand.quadraticCurveTo(-.5,2.05,0,2.35);archBand.quadraticCurveTo(.5,2.05,.5,1.5);
  archBand.lineTo(.61,1.5);archBand.quadraticCurveTo(.61,2.14,0,2.47);archBand.quadraticCurveTo(-.61,2.14,-.61,1.5);archBand.closePath();
  const bandMesh = new T.InstancedMesh(new T.ExtrudeGeometry(archBand,{depth:.012,bevelEnabled:false,curveSegments:16}),brick,12);
  const bandTransform = new T.Object3D();
  harimArches.forEach(([x,y,z],i)=>{for(let side=0;side<2;side++){bandTransform.position.set(x,y,z+(side?.361:-.013));bandTransform.updateMatrix();bandMesh.setMatrixAt(i*2+side,bandTransform.matrix);}});
  bandMesh.castShadow=bandMesh.receiveShadow=true;group.add(bandMesh);
  const pierPositions = [];
  for (let i = 0; i < 7; i++) pierPositions.push([-5.66 + i * 1.22, .7, -1.65]);
  const pier = new T.InstancedMesh(new T.BoxGeometry(.39, 1.4, .58), plaster, pierPositions.length);
  const dummy = new T.Object3D(); pierPositions.forEach(([x, y, z], i) => { dummy.position.set(x, y, z); dummy.updateMatrix(); pier.setMatrixAt(i, dummy.matrix); });
  pier.castShadow = pier.receiveShadow = true; group.add(pier);
  for (const [x] of pierPositions) box(x, .15, -1.65, .4, .3, .59, greyPlinth);
  box(-2, 1.42, -3.588, 7.19, 2.84, .025, plaster, cutWalls);
  box(-5.588, 1.42, -1.85, .025, 2.84, 3.45, plaster);
  box(1.588, 1.42, -2.15, .025, 2.84, 3.3, plaster, cutWalls);
  box(-2, .14, -3.565, 7.19, .28, .03, greyPlinth, cutWalls);
  // The small central open court is surrounded by arcades, not an enormous roof void.
  const courtyardCenter = new T.Vector3(-2.0, .08, 2.55);
  box(-2, .075, 2.55, 2.45, .035, 2.8, paving);
  arches([[-2.65, 0, 1.02], [-1.3, 0, 1.02], [-2.65, 0, 3.92], [-1.3, 0, 3.92]], 1.08);
  arches([[-3.36, 0, 1.9], [-3.36, 0, 3.25], [-.64, 0, 1.9], [-.64, 0, 3.25]], 1.08, Math.PI / 2);
  // Southern intermediate bay and the northern two transverse vaulted bays.
  arches([[-4.75, 0, .13], [-3.3, 0, .13], [-1.85, 0, .13], [-.4, 0, .13], [.95, 0, .13]], 1.13);
  const prayerCenter = new T.Vector3(-2, 1.25, -2.25);
  box(-2, 1.03, -3.48, 1.05, 2.06, .22, plaster);
  const niche = new T.Mesh(new T.SphereGeometry(.34, 20, 16, 0, Math.PI), new T.MeshStandardMaterial({color:0xbeb9aa,roughness:1,side:T.DoubleSide}));
  niche.scale.set(1, 2.05, .45); niche.position.set(-2, 1.07, -3.355); niche.rotation.y = Math.PI; group.add(niche);
  // The archive interior shows a restrained dark timber minber beside the pale mihrab.
  const timber = new T.MeshStandardMaterial({color:0x51402c,roughness:.85});
  const minber = new T.Group(); minber.name = 'Arsiv fotografini yorumlayan ahsap minber'; group.add(minber);
  for(let i=0;i<7;i++) box(-.65,.11+i*.1,-2.08-i*.17,.65,.2+i*.2,.18,timber,minber);
  for(const x of[-.99,-.31]) {
    box(x,.62,-2.57,.055,1.24,.055,timber,minber);
    box(x,1.12,-3.11,.065,2.24,.065,timber,minber);
    const rail=box(x,1.1,-2.57,.055,.055,1.37,timber,minber);rail.rotation.x=.65;
    for(let i=0;i<6;i++)box(x,.6+i*.08,-2.1-i*.17,.025,.85,.025,timber,minber);
  }
  box(-.65,1.45,-3.12,.72,.08,.48,timber,minber);
  box(-.65,2.27,-3.12,.74,.065,.55,timber,minber);
  const minberCrown = new T.Mesh(new T.ConeGeometry(.34,.8,8),timber);minberCrown.position.set(-.65,2.68,-3.12);minberCrown.castShadow=true;minber.add(minberCrown);
  // Thin DoubleSide barrel vaults stay with the removable roof and remain visible from eye level.
  function barrelVault(centerX, centerZ, length, radius, springY, alongX = true) {
    const vertices = [], uvs = [], indices = [], segments = 32;
    for (let end = 0; end < 2; end++) for (let i = 0; i <= segments; i++) {
      const a = i / segments * Math.PI, transverse = Math.cos(a) * radius;
      vertices.push(alongX ? centerX + (end - .5) * length : centerX + transverse, springY + Math.sin(a) * radius, alongX ? centerZ + transverse : centerZ + (end - .5) * length);
      uvs.push(end * length, i / segments * radius * Math.PI);
    }
    for (let i = 0; i < segments; i++) { const k = i + segments + 1; indices.push(i, k, i + 1, i + 1, k, k + 1); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(vertices, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uvs, 2)); g.setIndex(indices); g.computeVertexNormals();
    const vault = new T.Mesh(g, vaultMaterial); vault.castShadow = vault.receiveShadow = true; roof.add(vault); return vault;
  }
  barrelVault(-2, -2.78, 7.25, .84, 1.91);
  barrelVault(-2, -.73, 7.25, .85, 1.9);
  barrelVault(-4.52, 2.4, 6.2, .85, 1.9, false);
  barrelVault(.63, 2.4, 6.2, .83, 1.92, false);
  barrelVault(-2, 4.89, 2.45, .77, 1.98);
  // Restrained, warm interior fill; no invented decorative fixture is shown.
  const interiorLights = new T.Group(); interiorLights.name = 'Temsili ic mekan dolgu isigi'; group.add(interiorLights);
  const prayerFill = new T.PointLight(0xffe7c6, 7.5, 9, 2); prayerFill.position.set(-2, 2.42, -2.1); interiorLights.add(prayerFill);
  const vestibuleFill = new T.PointLight(0xe6efed, 5.5, 8, 2); vestibuleFill.position.set(.2, 2.25, .2); interiorLights.add(vestibuleFill);
  // Lead-like low roof slabs preserve the court aperture in the exterior mode.
  box(-2, 2.95, -1.88, 8.08, .22, 4.38, lead, roof);
  box(-2, 2.95, 4.99, 8.08, .22, 2.05, lead, roof);
  box(-4.65, 2.95, 2.19, 2.78, .22, 3.62, lead, roof);
  box(.65, 2.95, 2.19, 2.78, .22, 3.62, lead, roof);
  const modernCover = new T.Group(); modernCover.name = 'Modern avlu koruyucu ortusu'; roof.add(modernCover);
  const glass = new T.MeshPhysicalMaterial({ color: 0xd0e6e5, roughness: .2, metalness: 0, transparent: true, opacity: .22, depthWrite: false, side: T.DoubleSide });
  box(-2, 3.3, 2.55, 2.68, .028, 3.03, glass, modernCover);
  const steel = new T.MeshStandardMaterial({ color: 0x78837e, metalness: .6, roughness: .58 });
  for (const x of [-3.31, -2.44, -1.56, -.69]) box(x, 3.32, 2.55, .035, .045, 3.07, steel, modernCover);
  for (const z of [1.02, 2.04, 3.06, 4.08]) box(-2, 3.32, z, 2.68, .045, .035, steel, modernCover);
  // Small mihrab-front dome, on the south end; never centered over the entire mosque.
  const dome = new T.Mesh(new T.SphereGeometry(.98, 36, 20, 0, Math.PI * 2, 0, Math.PI / 2), lead);
  dome.position.set(-2, 3.06, -2.42); dome.scale.y = .68; dome.castShadow = dome.receiveShadow = true; roof.add(dome);
  const seams = [];
  for (let x = -5.65; x < 2; x += .45) { seams.push([x, 3.071, -1.88, .018, .015, 4.36]); seams.push([x, 3.071, 5, .018, .015, 2]); }
  const seamMesh = new T.InstancedMesh(boxGeometry, new T.MeshStandardMaterial({ color: 0x858b8d, roughness: .78, metalness: .2 }), seams.length);
  seams.forEach(([x, y, z, w, h, d], i) => { dummy.position.set(x, y, z); dummy.scale.set(w, h, d); dummy.rotation.set(0, 0, 0); dummy.updateMatrix(); seamMesh.setMatrixAt(i, dummy.matrix); }); roof.add(seamMesh);
  // Simple masonry cornice, without decorative additions unrelated to the documented building.
  box(-5.84, 2.87, 1, .48, .13, 10.05, ashlar);
  box(-2, 2.87, 5.84, 7.6, .13, .48, ashlar);
  box(-2, 2.87, -3.84, 7.6, .13, .48, ashlar, cutWalls);
  box(1.84, 2.87, 1, .48, .13, 10.05, ashlar, cutWalls);
  group.userData.minaretBase = new T.Vector3(1.47, 0, 2.25);
  const walkRoute = [new T.Vector3(5, 1.25, -.05), new T.Vector3(2.35, 1.25, -.05), new T.Vector3(1.1, 1.25, -.28), new T.Vector3(.55, 1.25, -.78), new T.Vector3(-1.3, 1.25, -.78), new T.Vector3(-1.3, 1.25, -2.66), new T.Vector3(-2.1, 1.25, -2.8)];
  return { group, roof, cutWalls, courtyardCenter, prayerCenter, modernCover, entranceDoor, interiorLights, walkRoute };
}
