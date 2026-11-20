# Flipkart 3D – 3D Asset Pipeline & Model Specifications

This directory contains static 3D assets (GLTF/GLB) and specification guidelines for the Flipkart 3D Virtual Shopping Mall.

## 1. Real-Time WebGL Polycount & Performance Budgets

To maintain a consistent 60 FPS on integrated laptop GPUs and mobile devices, all 3D models adhere to strict geometric and texture budgets:

| Category | Max Triangle Budget | Max Texture Resolution | Format | Draw Calls |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Products** (Smartphones, Laptops) | ≤ 15,000 tris | 2048 x 2048 (PBR) | GLTF / GLB / Procedural JSX | 1 - 3 |
| **Wearables & Audio** (Watches, Earbuds) | ≤ 8,000 tris | 1024 x 1024 (PBR) | GLTF / GLB / Procedural JSX | 1 - 2 |
| **Large Appliances** (Fridges, Washing Machines) | ≤ 12,000 tris | 2048 x 2048 (PBR) | GLTF / GLB / Procedural JSX | 2 - 4 |
| **Furniture** (Sofas, Platform Beds) | ≤ 10,000 tris | 1024 x 1024 (PBR) | GLTF / GLB / Procedural JSX | 1 - 3 |
| **Fashion** (Mannequins, Sneakers, Handbags) | ≤ 12,000 tris | 2048 x 2048 (PBR) | GLTF / GLB / Procedural JSX | 1 - 3 |
| **Architectural Modules** (Atrium, Escalators) | ≤ 25,000 tris | Standard Procedural / Material Reuse | Three.js BufferGeometry | Batched |

## 2. Material & Lighting Conventions

- **PBR Workflow**: Roughness-Metalness workflow (`MeshStandardMaterial` / `MeshPhysicalMaterial`).
- **Clearcoat**: Applied exclusively to glass, car finishes, and smartphone displays (`clearcoat: 1.0`, `clearcoatRoughness: 0.1`).
- **Transmission**: Reserved for glass railings and panoramic elevator walls (`transmission: 0.92 - 0.95`, `roughness: 0.05`).
- **Shadows**: Soft contact shadows generated via Drei `<ContactShadows />` (`blur: 2.0`, `opacity: 0.35`) to avoid expensive real-time shadow map passes on low-end hardware.

## 3. Hotspot Positioning Convention

Every interactive model defines normalized 3D hotspot coordinates centered on its bounding box `[x, y, z]`:

```json
{
  "name": "camera",
  "title": "48MP Pro Fusion Camera System",
  "hotspot_position": { "x": -0.32, "y": 0.58, "z": 0.12 },
  "icon": "Camera",
  "badge_text": "4K 120 FPS"
}
```

- `+X` = Right, `-X` = Left
- `+Y` = Top, `-Y` = Bottom
- `+Z` = Front (Facing customer), `-Z` = Rear

## 4. Procedural & Static Dual Support

The application utilizes a hybrid pipeline:
1. **Procedural Parametric Models (`src/components/ProductViewer/Models3D/`)**: Zero network download footprint, instant rendering, deterministic geometry, and dynamic PBR swatch customization.
2. **GLTF/GLB Loaders**: Drei `useGLTF` compatible for high-fidelity photogrammetry or CAD scan drops into `public/models/{slug}.glb`.
