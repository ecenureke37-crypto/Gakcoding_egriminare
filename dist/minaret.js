export function createMinaret(T) {
  const group = new T.Group();
  group.name = 'Harput-Egri-Minare';
  group.rotation.z = -.07;
  group.userData.representation = 'Temsili model; olcum veya rolove degildir.';
  let seed = 1937;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  function surface(kind) {
    const width = 1024, height = kind === 'brick' ? 2048 : 1024;
    const canvas = document.createElement('canvas');
    const relief = document.createElement('canvas');
    canvas.width = relief.width = width;
    canvas.height = relief.height = height;
    const c = canvas.getContext('2d'), b = relief.getContext('2d');
    c.fillStyle = kind === 'brick' ? '#847565' : '#8c897a'; c.fillRect(0, 0, width, height);
    b.fillStyle = '#636363'; b.fillRect(0, 0, width, height);
    const columns = kind === 'brick' ? 34 : 18;
    const rows = kind === 'brick' ? 114 : 28;
    const cellW = width / columns, cellH = height / rows;
    for (let row = 0; row < rows; row++) {
      for (let col = -1; col <= columns; col++) {
        const x = (col + (row % 2) * .5) * cellW;
        const y = row * cellH;
        const wear = random(), variation = random() * 15 - 7;
        const tones = kind === 'brick' ? [145, 120, 95] : [151, 146, 130];
        c.fillStyle = `rgb(${tones.map(v => Math.round(v + variation)).join(',')})`;
        b.fillStyle = `rgb(${[0, 0, 0].map(() => Math.round(154 + wear * 25)).join(',')})`;
        const gap = kind === 'brick' ? 2.2 : 3.5;
        c.fillRect(x + gap, y + gap, cellW - gap * 2, cellH - gap * 1.7);
        b.fillRect(x + gap, y + gap, cellW - gap * 2, cellH - gap * 1.7);
        if (kind === 'stone') {
          c.fillStyle = `rgba(68,66,58,${.04 + random() * .05})`;
          c.fillRect(x + 5, y + 4, cellW - 9, 3);
        }
      }
    }
    if (kind === 'brick') {
      // Abstract brick geometry only: no invented inscriptions or pseudo-calligraphy.
      for (const [top, bottom, scale] of [[.18, .37, 25], [.39, .56, 28], [.62, .88, 23]]) {
        const y1 = height * top, y2 = height * bottom;
        c.fillStyle = '#887866'; c.fillRect(0, y1, width, y2 - y1);
        b.fillStyle = '#747474'; b.fillRect(0, y1, width, y2 - y1);
        c.strokeStyle = '#a18b70'; b.strokeStyle = '#cccccc';
        c.lineWidth = 6; b.lineWidth = 5;
        for (let y = y1 - scale; y < y2 + scale; y += scale * 2) {
          for (let x = -scale; x < width + scale; x += scale * 2) {
            for (const ctx of [c, b]) {
              ctx.save(); ctx.beginPath(); ctx.rect(0, y1, width, y2 - y1); ctx.clip();
              ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + scale, y + scale);
              ctx.lineTo(x + scale * 2, y); ctx.lineTo(x + scale, y - scale); ctx.closePath(); ctx.stroke();
              if (top > .6) {
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + scale * 2, y);
                ctx.moveTo(x + scale, y - scale); ctx.lineTo(x + scale, y + scale); ctx.stroke();
              }
              ctx.restore();
            }
          }
        }
      }
    }
    // Broad irregular lime-mortar repairs and erosion, avoiding bright speckled noise.
    for (let i = 0; i < (kind === 'brick' ? 75 : 22); i++) {
      const x = random() * width, y = random() * height;
      const rx = 10 + random() * 38, ry = 15 + random() * 68;
      c.fillStyle = `rgba(157,153,135,${.18 + random() * .45})`;
      b.fillStyle = `rgba(144,144,144,${.12 + random() * .3})`;
      for (const ctx of [c, b]) {
        ctx.beginPath();
        for (let j = 0; j < 9; j++) {
          const a = j / 9 * Math.PI * 2, amount = .7 + random() * .3;
          const px = x + Math.cos(a) * rx * amount, py = y + Math.sin(a) * ry * amount;
          if (!j) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
      }
    }
    const colorData = c.getImageData(0, 0, width, height);
    const reliefData = b.getImageData(0, 0, width, height);
    const normalData = new Uint8Array(width * height * 4);
    const pixels = reliefData.data;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const noise = (random() - .5) * 11;
        for (let k = 0; k < 3; k++) colorData.data[index + k] = clamp(colorData.data[index + k] + noise, 0, 255);
        const left = pixels[(y * width + (x + width - 1) % width) * 4];
        const right = pixels[(y * width + (x + 1) % width) * 4];
        const down = pixels[((y + height - 1) % height * width + x) * 4];
        const up = pixels[((y + 1) % height * width + x) * 4];
        const dx = (left - right) / 180, dy = (up - down) / 180;
        const length = Math.sqrt(dx * dx + dy * dy + 1);
        normalData[index] = (dx / length * .5 + .5) * 255;
        normalData[index + 1] = (dy / length * .5 + .5) * 255;
        normalData[index + 2] = (1 / length * .5 + .5) * 255;
        normalData[index + 3] = 255;
      }
    }
    c.putImageData(colorData, 0, 0);
    const map = new T.CanvasTexture(canvas); map.colorSpace = T.SRGBColorSpace;
    const normalMap = new T.DataTexture(normalData, width, height, T.RGBAFormat);
    normalMap.needsUpdate = true; normalMap.flipY = true;
    for (const texture of [map, normalMap]) {
      texture.wrapS = T.RepeatWrapping; texture.wrapT = T.RepeatWrapping;
      texture.anisotropy = 4; texture.generateMipmaps = true;
      texture.minFilter = T.LinearMipmapLinearFilter;
    }
    return {map, normalMap};
  }

  const brickSurface = surface('brick'), stoneSurface = surface('stone');
  const brick = new T.MeshStandardMaterial({...brickSurface, roughness: .97, metalness: 0, normalScale: new T.Vector2(.65, .65)});
  const stone = new T.MeshStandardMaterial({...stoneSurface, color: 0xc7c4b4, roughness: .98, normalScale: new T.Vector2(.45, .45)});
  const paleStone = new T.MeshStandardMaterial({...stoneSurface, color: 0xd3d2c6, roughness: .96, normalScale: new T.Vector2(.25, .25)});
  const darkBrick = new T.MeshStandardMaterial({color: 0x74604d, roughness: .99});
  const metal = new T.MeshStandardMaterial({color: 0x8a9390, roughness: .76, metalness: .48});
  function add(geometry, material, y, part = 'brick') {
    const mesh = new T.Mesh(geometry, material); mesh.position.y = y;
    mesh.castShadow = true; mesh.receiveShadow = true; mesh.userData.part = part;
    group.add(mesh); return mesh;
  }
  function lathe(profile, material, part = 'brick') {
    return add(new T.LatheGeometry(profile.map(([r, y]) => new T.Vector2(r, y)), 96), material, 0, part);
  }
  lathe([[0, 0], [1.02, 0], [1.01, .45], [.97, 1.55], [.94, 1.72]], stone);
  lathe([[.94, 1.45], [.92, 2.2], [.89, 4], [.86, 6], [.82, 7.95]], brick);
  for (const y of [1.7, 3.75, 5.15, 6.58, 7.82]) {
    const radius = .955 - y * .0165;
    lathe([[radius, y - .045], [radius + .025, y], [radius + .025, y + .05], [radius, y + .08]], darkBrick);
  }
  lathe([[.82, 7.88], [.89, 7.94], [.98, 8.02], [1.1, 8.1], [1.12, 8.19]], stone, 'balcony');
  const ring = add(new T.TorusGeometry(1.08, .065, 8, 96), paleStone, 8.2, 'balcony'); ring.rotation.x = Math.PI / 2;

  const panel = new T.Shape();
  panel.moveTo(-.107, 0); panel.lineTo(.107, 0); panel.lineTo(.107, .49); panel.lineTo(-.107, .49); panel.closePath();
  const opening = new T.Path();
  opening.moveTo(0, .12); opening.lineTo(-.027, .24); opening.lineTo(0, .38); opening.lineTo(.027, .24); opening.closePath();
  panel.holes.push(opening);
  const panelGeometry = new T.ExtrudeGeometry(panel, {depth: .095, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelThickness: .004, bevelSize: .003});
  const parapet = new T.InstancedMesh(panelGeometry, paleStone, 32);
  const dummy = new T.Object3D();
  for (let i = 0; i < 32; i++) {
    const a = i / 32 * Math.PI * 2;
    dummy.position.set(Math.sin(a) * 1.065, 8.2, Math.cos(a) * 1.065);
    dummy.rotation.set(0, a, 0); dummy.updateMatrix(); parapet.setMatrixAt(i, dummy.matrix);
  }
  parapet.castShadow = true; parapet.receiveShadow = true; parapet.userData.part = 'balcony'; group.add(parapet);
  const crown = add(new T.TorusGeometry(1.11, .045, 8, 96), paleStone, 8.7, 'balcony'); crown.rotation.x = Math.PI / 2;

  add(new T.CylinderGeometry(.53, .57, 1.5, 64), darkBrick, 9.42, 'balcony');
  const topBricks = new T.InstancedMesh(new T.BoxGeometry(.135, .047, .047), brick, 32 * 28);
  let n = 0;
  for (let row = 0; row < 28; row++) {
    for (let col = 0; col < 32; col++) {
      const a = (col + row % 2 * .5) / 32 * Math.PI * 2;
      const y = 8.72 + row * .051, radius = .575 - row * .0015;
      dummy.position.set(Math.sin(a) * radius, y, Math.cos(a) * radius);
      dummy.rotation.set(0, a, (random() - .5) * .025);
      dummy.scale.set(.93 + random() * .12, .9 + random() * .16, 1);
      dummy.updateMatrix(); topBricks.setMatrixAt(n++, dummy.matrix);
    }
  }
  topBricks.castShadow = true; topBricks.receiveShadow = true; topBricks.userData.part = 'balcony'; group.add(topBricks);
  lathe([[.55, 10.12], [.62, 10.15], [.63, 10.22], [.58, 10.27]], metal, 'balcony');
  add(new T.ConeGeometry(.64, .76, 16), metal, 10.62, 'balcony');
  const seamMaterial = new T.MeshStandardMaterial({color: 0x707c77, roughness: .85, metalness: .45});
  const capProfile = new T.LineCurve3(new T.Vector3(0, 11, 0), new T.Vector3(.628, 10.25, 0));
  const seamGeometry = new T.TubeGeometry(capProfile, 1, .006, 4, false);
  for (let i = 0; i < 8; i++) {const seam = add(seamGeometry, seamMaterial, 0, 'balcony'); seam.rotation.y = i / 8 * Math.PI * 2;}
  group.userData.height = 11;
  group.userData.focus = {brick: new T.Vector3(0, 5.2, 0), balcony: new T.Vector3(0, 8.65, 0)};
  return group;
}
