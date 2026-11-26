import * as THREE from 'three';

let cachedMarbleTexture = null;
let cachedRoughnessTexture = null;

/**
 * Generates an ultra-realistic, procedural Italian Carrara Marble texture.
 * Features delicate feathered grey veins, hairline fractures, and subtle clouding
 * on a luminous off-white polished stone surface with tile joint lines.
 */
export function getCarraraMarbleTexture(repeatX = 8, repeatY = 8) {
  if (typeof document === 'undefined') return null;

  if (!cachedMarbleTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // 1. Luminous Warm Cream Calacatta Marble Base Tone
    ctx.fillStyle = '#F5EFE6';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. Soft Warm Stone Clouding & Mineral Undertones
    const grad1 = ctx.createRadialGradient(512, 512, 100, 512, 512, 620);
    grad1.addColorStop(0, 'rgba(250, 246, 239, 0.55)');
    grad1.addColorStop(0.5, 'rgba(241, 234, 222, 0.3)');
    grad1.addColorStop(1, 'rgba(222, 211, 194, 0.45)');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, 1024, 1024);

    // 3. Natural Organic Veining Generator
    const drawVein = (points, width, color, alpha) => {
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i][0] + points[i + 1][0]) / 2;
        const yc = (points[i][1] + points[i + 1][1]) / 2;
        ctx.quadraticCurveTo(points[i][0], points[i][1], xc, yc);
      }
      ctx.stroke();
      ctx.restore();
    };

    // Major Feathered Veins
    const majorVeins = [
      [[0, 180], [220, 290], [450, 310], [680, 520], [890, 710], [1024, 820]],
      [[150, 0], [280, 240], [390, 480], [610, 620], [790, 890], [920, 1024]],
      [[1024, 120], [820, 310], [540, 410], [320, 680], [180, 820], [0, 940]],
      [[350, 0], [490, 190], [580, 380], [720, 450], [950, 620], [1024, 710]],
      [[0, 480], [180, 560], [310, 520], [520, 690], [740, 740], [1024, 910]]
    ];

    // Under-Vein Soft Warm Taupe & Gold Smudges (feathers)
    majorVeins.forEach((pts) => {
      drawVein(pts, 18, '#B8AA96', 0.12);
      drawVein(pts, 9, '#9C8D79', 0.16);
      drawVein(pts, 3.5, '#7E6F5D', 0.24);
      drawVein(pts, 1.2, '#C5A880', 0.35);
    });

    // Secondary Branching Hairline Veins
    const minorVeins = [
      [[220, 290], [310, 220], [420, 180], [490, 90]],
      [[680, 520], [610, 440], [580, 380]],
      [[540, 410], [620, 320], [780, 260], [850, 140]],
      [[320, 680], [410, 760], [480, 890], [520, 1024]],
      [[740, 740], [840, 680], [910, 550]],
      [[180, 560], [140, 690], [90, 790], [0, 850]]
    ];

    minorVeins.forEach((pts) => {
      drawVein(pts, 5, '#94A3B8', 0.07);
      drawVein(pts, 2, '#64748B', 0.18);
      drawVein(pts, 0.8, '#475569', 0.28);
    });

    // 4. Subtle Architectural Tile Joint Grid (4x4 Large Format Slabs)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.55;
    for (let i = 1; i < 4; i++) {
      const pos = (1024 / 4) * i;
      // Vertical seam
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, 1024);
      ctx.stroke();

      // Horizontal seam
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(1024, pos);
      ctx.stroke();
    }

    cachedMarbleTexture = new THREE.CanvasTexture(canvas);
    cachedMarbleTexture.wrapS = THREE.RepeatWrapping;
    cachedMarbleTexture.wrapT = THREE.RepeatWrapping;
    cachedMarbleTexture.colorSpace = THREE.SRGBColorSpace;
    cachedMarbleTexture.anisotropy = 16;
  }

  const tex = cachedMarbleTexture.clone();
  tex.repeat.set(repeatX, repeatY);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates matching Roughness map for high-gloss Carrara Marble.
 * Mirror-sheen on tile faces with realistic micro-variations.
 */
export function getCarraraMarbleRoughnessTexture(repeatX = 8, repeatY = 8) {
  if (typeof document === 'undefined') return null;

  if (!cachedRoughnessTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Smooth glossy marble body (#181818 => ~0.09 roughness)
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle natural surface ripple
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 40 + Math.random() * 120;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(32, 32, 32, 0.2)');
      grad.addColorStop(1, 'rgba(22, 22, 22, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // Tile seams are slightly less reflective (#505050 => ~0.31 roughness)
    ctx.strokeStyle = '#505050';
    ctx.lineWidth = 2;
    for (let i = 1; i < 4; i++) {
      const pos = (512 / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, 512);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(512, pos);
      ctx.stroke();
    }

    cachedRoughnessTexture = new THREE.CanvasTexture(canvas);
    cachedRoughnessTexture.wrapS = THREE.RepeatWrapping;
    cachedRoughnessTexture.wrapT = THREE.RepeatWrapping;
    cachedRoughnessTexture.anisotropy = 16;
  }

  const tex = cachedRoughnessTexture.clone();
  tex.repeat.set(repeatX, repeatY);
  tex.needsUpdate = true;
  return tex;
}
