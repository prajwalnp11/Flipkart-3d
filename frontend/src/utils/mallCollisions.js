/**
 * Architectural collision boundaries for customer avatar movement inside Flipkart 3D Mall.
 * Prevents walking through walls, colossal columns, glass balustrades, elevator shaft,
 * category directory kiosk, and showroom display islands while allowing smooth sliding along edges.
 */

const AVATAR_RADIUS = 0.42;

// 6 colossal Carrara marble columns spanning all 4 storeys (CentralAtrium.jsx)
const COLOSSAL_COLUMNS = [
  { x: -9.2, z: -3.5, r: 0.95 },
  { x: 9.2, z: -3.5, r: 0.95 },
  { x: -9.2, z: 4.5, r: 0.95 },
  { x: 9.2, z: 4.5, r: 0.95 },
  { x: -9.2, z: 12.5, r: 0.95 },
  { x: 9.2, z: 12.5, r: 0.95 }
];

// Panoramic glass elevator shaft (GlassElevator.jsx at [0, y, -7.0])
const ELEVATOR_SHAFT_BOX = { minX: -1.75, maxX: 1.75, minZ: -8.45, maxZ: -5.55 };

// Upper-floor glass balustrades (CentralAtrium.jsx)
const ATRIUM_RAILINGS = [
  { minX: -6.48, maxX: -6.28, minZ: -5.5, maxZ: 9.5 }, // West glass railing
  { minX: 6.28, maxX: 6.48, minZ: -5.5, maxZ: 9.5 },   // East glass railing
  { minX: -6.4, maxX: 6.4, minZ: 8.7, maxZ: 8.9 }      // South cross railing
];

// Ground-floor Category Directory Kiosk (GroundLobby.jsx at [-2.8, 0, 6.4])
const DIRECTORY_KIOSK_CIRCLE = { x: -2.8, z: 6.4, r: 1.55 };

// Floor 2 Fashion display islands (FashionShowroom.jsx)
const FASHION_ISLANDS = [
  { minX: -8.0, maxX: -3.6, minZ: -2.1, maxZ: 0.1 }, // Mannequin island
  { minX: 3.6, maxX: 8.0, minZ: -2.1, maxZ: 0.1 }    // Sneaker / bag island
];

// Floor 3 Home & Living display suites (HomeShowroom.jsx)
const HOME_ISLANDS = [
  { minX: -8.2, maxX: -4.2, minZ: -2.6, maxZ: 1.2 }, // Living room sofa/bed zone
  { minX: 4.2, maxX: 8.2, minZ: -2.6, maxZ: 1.2 }    // Kitchen / appliances zone
];

function pushOutCircle(x, z, cx, cz, minDist) {
  const dx = x - cx;
  const dz = z - cz;
  const distSq = dx * dx + dz * dz;
  if (distSq >= minDist * minDist) return { x, z };

  const dist = Math.sqrt(distSq);
  if (dist < 0.0001) {
    return { x, z: cz + minDist };
  }
  const scale = minDist / dist;
  return {
    x: cx + dx * scale,
    z: cz + dz * scale
  };
}

function pushOutAABB(x, z, box, radius) {
  const expandedMinX = box.minX - radius;
  const expandedMaxX = box.maxX + radius;
  const expandedMinZ = box.minZ - radius;
  const expandedMaxZ = box.maxZ + radius;

  if (x <= expandedMinX || x >= expandedMaxX || z <= expandedMinZ || z >= expandedMaxZ) {
    return { x, z };
  }

  const dLeft = x - expandedMinX;
  const dRight = expandedMaxX - x;
  const dBack = z - expandedMinZ;
  const dFront = expandedMaxZ - z;
  const minPen = Math.min(dLeft, dRight, dBack, dFront);

  if (minPen === dLeft) return { x: expandedMinX, z };
  if (minPen === dRight) return { x: expandedMaxX, z };
  if (minPen === dBack) return { x, z: expandedMinZ };
  return { x, z: expandedMaxZ };
}

/**
 * Resolves collisions for a customer avatar at (x, z) on the given floor.
 * Returns clamped and collision-resolved { x, z } coordinates.
 */
export function resolveMallCollisions(rawX, rawZ, floor = 0, { selectedBrand = null, elevatorDoorOpen = false } = {}) {
  let x = rawX;
  let z = rawZ;

  // 1. Outer architectural walls (narrower inside a brand boutique with wall shelving)
  if (selectedBrand) {
    x = Math.max(-8.3, Math.min(8.3, x));
    z = Math.max(-6.8, Math.min(8.2, z));

    // Brand boutique primary display table (center [0, 0])
    const counterRes = pushOutAABB(x, z, { minX: -4.1, maxX: 4.1, minZ: -1.25, maxZ: 1.25 }, AVATAR_RADIUS);
    x = counterRes.x;
    z = counterRes.z;

    // Secondary showcase table at [0, -4.0]
    const rearRes = pushOutAABB(x, z, { minX: -2.2, maxX: 2.2, minZ: -5.05, maxZ: -2.95 }, AVATAR_RADIUS);
    return rearRes;
  }

  // Main mall concourse outer walls
  x = Math.max(-15.0, Math.min(15.0, x));
  z = Math.max(-10.0, Math.min(13.0, z));

  // 2. Colossal marble columns (present on all floors)
  for (const col of COLOSSAL_COLUMNS) {
    const res = pushOutCircle(x, z, col.x, col.z, col.r + AVATAR_RADIUS);
    x = res.x;
    z = res.z;
  }

  // 3. Panoramic glass elevator shaft (allow entering front if doors are open)
  if (!elevatorDoorOpen) {
    const shaftRes = pushOutAABB(x, z, ELEVATOR_SHAFT_BOX, AVATAR_RADIUS);
    x = shaftRes.x;
    z = shaftRes.z;
  }

  // 4. Floor-specific obstacles
  if (floor === 0) {
    const kioskRes = pushOutCircle(x, z, DIRECTORY_KIOSK_CIRCLE.x, DIRECTORY_KIOSK_CIRCLE.z, DIRECTORY_KIOSK_CIRCLE.r + AVATAR_RADIUS);
    x = kioskRes.x;
    z = kioskRes.z;
  } else {
    // Upper-floor glass balustrades around central atrium
    for (const rail of ATRIUM_RAILINGS) {
      const railRes = pushOutAABB(x, z, rail, AVATAR_RADIUS * 0.85);
      x = railRes.x;
      z = railRes.z;
    }

    if (floor === 2) {
      for (const island of FASHION_ISLANDS) {
        const res = pushOutAABB(x, z, island, AVATAR_RADIUS);
        x = res.x;
        z = res.z;
      }
    } else if (floor === 3) {
      for (const island of HOME_ISLANDS) {
        const res = pushOutAABB(x, z, island, AVATAR_RADIUS);
        x = res.x;
        z = res.z;
      }
    }
  }

  return { x, z };
}
