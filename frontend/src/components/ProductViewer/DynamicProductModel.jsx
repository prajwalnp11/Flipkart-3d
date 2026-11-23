import React from 'react';
import { SmartphoneModel } from './Models3D/SmartphoneModel';
import { ExplodedSmartphoneModel } from './Models3D/ExplodedSmartphoneModel';
import { LaptopModel } from './Models3D/LaptopModel';
import { TabletModel } from './Models3D/TabletModel';
import { SmartwatchModel } from './Models3D/SmartwatchModel';
import { HeadphonesModel } from './Models3D/HeadphonesModel';
import { EarbudsModel } from './Models3D/EarbudsModel';
import { SpeakerModel } from './Models3D/SpeakerModel';
import { CameraModel } from './Models3D/CameraModel';
import { TelevisionModel } from './Models3D/TelevisionModel';
import { RefrigeratorModel } from './Models3D/RefrigeratorModel';
import { WashingMachineModel } from './Models3D/WashingMachineModel';
import { SofaModel } from './Models3D/SofaModel';
import { SneakerModel } from './Models3D/SneakerModel';
import { MannequinModel } from './Models3D/MannequinModel';
import { HandbagModel } from './Models3D/HandbagModel';

/**
 * Normalizes any model type identifier to one of the 15 supported canonical types.
 */
export function normalizeModelType(rawType) {
  if (!rawType || typeof rawType !== 'string') return null;
  const t = rawType.toLowerCase().trim().replace(/[-_]/g, ' ');

  if (t === 'smartphone' || t === 'phone' || t === 'mobile' || t === 'cellphone') return 'smartphone';
  if (t === 'laptop' || t === 'notebook' || t === 'computer' || t === 'macbook' || t === 'pc') return 'laptop';
  if (t === 'tablet' || t === 'ipad' || t === 'pad') return 'tablet';
  if (t === 'smartwatch' || t === 'watch' || t === 'wearable' || t === 'timepiece') return 'smartwatch';
  if (t === 'headphones' || t === 'headphone' || t === 'headset' || t === 'over ear') return 'headphones';
  if (t === 'earbuds' || t === 'earbud' || t === 'airpods' || t === 'tws' || t === 'earphones') return 'earbuds';
  if (t === 'speaker' || t === 'bluetooth speaker' || t === 'audio speaker') return 'speaker';
  if (t === 'camera' || t === 'dslr' || t === 'mirrorless' || t === 'cam') return 'camera';
  if (t === 'television' || t === 'tv' || t === 'display' || t === 'monitor' || t === 'smart tv') return 'television';
  if (t === 'refrigerator' || t === 'fridge' || t === 'cooler') return 'refrigerator';
  if (t === 'washing machine' || t === 'washer' || t === 'laundry' || t === 'washingmachine') return 'washing_machine';
  if (t === 'sofa' || t === 'couch' || t === 'lounge' || t === 'furniture' || t === 'settee') return 'sofa';
  if (t === 'sneaker' || t === 'shoe' || t === 'footwear' || t === 'shoes' || t === 'kicks') return 'sneaker';
  if (t === 'mannequin' || t === 'apparel' || t === 'clothing' || t === 'blazer' || t === 'suit' || t === 'fashion') return 'mannequin';
  if (t === 'handbag' || t === 'bag' || t === 'purse' || t === 'tote' || t === 'beauty' || t === 'perfume') return 'handbag';

  return null;
}

/**
 * Dynamically resolves the 3D model type from Django API product data or explicit type.
 * Uses model configuration first, then category hints, then gracefully falls back to 'smartphone'.
 */
export function resolveModelType(product, explicitType = null) {
  // 1. Explicit override passed by caller
  if (explicitType) {
    const normalized = normalizeModelType(explicitType);
    if (normalized) return normalized;
  }

  if (!product) return 'smartphone';

  // 2. Direct model_type from Django Product3DModel or serialized model_3d_type
  const candidateTypes = [
    product.model_3d?.model_type,
    product.model_3d_type,
    product.modelType,
    product.model_type
  ];

  for (const candidate of candidateTypes) {
    if (candidate && candidate !== 'generic') {
      const normalized = normalizeModelType(candidate);
      if (normalized) return normalized;
    }
  }

  // 3. Fallback inference from Category metadata (slug, name)
  const categoryStr = [
    product.category_slug,
    product.category?.slug,
    product.category_name,
    product.category?.name
  ].filter(Boolean).join(' ').toLowerCase();

  if (categoryStr) {
    if (/mobile|smartphone|phone/.test(categoryStr)) return 'smartphone';
    if (/laptop|computer|macbook/.test(categoryStr)) return 'laptop';
    if (/tablet|ipad/.test(categoryStr)) return 'tablet';
    if (/watch|wearable/.test(categoryStr)) return 'smartwatch';
    if (/headphone|audio/.test(categoryStr)) return 'headphones';
    if (/earbud|airpod|earphone/.test(categoryStr)) return 'earbuds';
    if (/speaker/.test(categoryStr)) return 'speaker';
    if (/camera|photography/.test(categoryStr)) return 'camera';
    if (/tv|television|appliance/.test(categoryStr)) return 'television';
    if (/fridge|refrigerator/.test(categoryStr)) return 'refrigerator';
    if (/washer|washing/.test(categoryStr)) return 'washing_machine';
    if (/sofa|furniture|living/.test(categoryStr)) return 'sofa';
    if (/shoe|sneaker|footwear/.test(categoryStr)) return 'sneaker';
    if (/fashion|clothing|apparel/.test(categoryStr)) return 'mannequin';
    if (/handbag|bag|beauty|perfume/.test(categoryStr)) return 'handbag';
  }

  // 4. Fallback inference from Product Name if model_3d was 'generic'
  const nameStr = (product.name || '').toLowerCase();
  if (/macbook|laptop|thinkpad|zenbook|notebook/.test(nameStr)) return 'laptop';
  if (/ipad|tablet|galaxy tab/.test(nameStr)) return 'tablet';
  if (/watch|band|timepiece/.test(nameStr)) return 'smartwatch';
  if (/airpods max|wh-1000|headphone|headset/.test(nameStr)) return 'headphones';
  if (/airpods|earbuds|buds|earphones|galaxy buds/.test(nameStr)) return 'earbuds';
  if (/speaker|soundbar|charge|boombox/.test(nameStr)) return 'speaker';
  if (/camera|alpha a|eos|lumix|nikon/.test(nameStr)) return 'camera';
  if (/tv|qled|oled|bravia|television/.test(nameStr)) return 'television';
  if (/fridge|refrigerator|instaview/.test(nameStr)) return 'refrigerator';
  if (/washer|washing machine|i-dos/.test(nameStr)) return 'washing_machine';
  if (/sofa|couch|chair|recliner/.test(nameStr)) return 'sofa';
  if (/sneaker|shoe|air max|jordan|runner/.test(nameStr)) return 'sneaker';
  if (/blazer|jacket|shirt|dress|suit/.test(nameStr)) return 'mannequin';
  if (/bag|handbag|tote|purse|sauvage|perfume/.test(nameStr)) return 'handbag';

  // 5. Safe, guaranteed default
  return 'smartphone';
}

/**
 * Standard registry of supported 3D models with geometry-specific dimensions,
 * default materials/colors, and stand/viewer scale multipliers.
 */
export const MODEL_REGISTRY = {
  smartphone: {
    Component: SmartphoneModel,
    name: 'Smartphone',
    defaultColor: '#C2A385',
    standScaleMultiplier: 1.0,
    standOffset: [0, 0, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.0
  },
  laptop: {
    Component: LaptopModel,
    name: 'Laptop',
    defaultColor: '#1C1D1F',
    standScaleMultiplier: 0.82,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.0
  },
  tablet: {
    Component: TabletModel,
    name: 'Tablet',
    defaultColor: '#1C1D1F',
    standScaleMultiplier: 0.95,
    standOffset: [0, 0, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.0
  },
  smartwatch: {
    Component: SmartwatchModel,
    name: 'Smartwatch',
    defaultColor: '#B5AEA4',
    standScaleMultiplier: 1.15,
    standOffset: [0, 0, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.0
  },
  headphones: {
    Component: HeadphonesModel,
    name: 'Headphones',
    defaultColor: '#1B263B',
    standScaleMultiplier: 0.95,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.0
  },
  earbuds: {
    Component: EarbudsModel,
    name: 'Earbuds',
    defaultColor: '#FFFFFF',
    standScaleMultiplier: 1.35,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.45
  },
  speaker: {
    Component: SpeakerModel,
    name: 'Speaker',
    defaultColor: '#2874F0',
    standScaleMultiplier: 0.95,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.25
  },
  camera: {
    Component: CameraModel,
    name: 'Camera',
    defaultColor: '#18181B',
    standScaleMultiplier: 0.9,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.15
  },
  television: {
    Component: TelevisionModel,
    name: 'Television',
    defaultColor: '#9CA3AF',
    standScaleMultiplier: 0.52,
    standOffset: [0, 0.1, 0],
    standRotation: [0, 0, 0],
    viewerScale: 0.85
  },
  refrigerator: {
    Component: RefrigeratorModel,
    name: 'Refrigerator',
    defaultColor: '#E2E8F0',
    standScaleMultiplier: 0.5,
    standOffset: [0, 0.1, 0],
    standRotation: [0, 0, 0],
    viewerScale: 0.78
  },
  washing_machine: {
    Component: WashingMachineModel,
    name: 'Washing Machine',
    defaultColor: '#F8FAFC',
    standScaleMultiplier: 0.58,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 0.82
  },
  sofa: {
    Component: SofaModel,
    name: 'Sofa',
    defaultColor: '#1E3A8A',
    standScaleMultiplier: 0.5,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 0.9
  },
  sneaker: {
    Component: SneakerModel,
    name: 'Sneaker',
    defaultColor: '#0090FF',
    standScaleMultiplier: 0.85,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.0
  },
  mannequin: {
    Component: MannequinModel,
    name: 'Mannequin',
    defaultColor: '#EC4899',
    standScaleMultiplier: 0.65,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 0.82
  },
  handbag: {
    Component: HandbagModel,
    name: 'Handbag',
    defaultColor: '#D97706',
    standScaleMultiplier: 1.1,
    standOffset: [0, 0.05, 0],
    standRotation: [0, 0, 0],
    viewerScale: 1.2
  }
};

/**
 * Resolves the display color for a product from its model options or fallbacks.
 */
export function resolveProductColor(product, explicitColor = null, fallbackColor = null) {
  if (explicitColor) return explicitColor;

  // 1. Check Product 3D model color options from API
  const apiColor = product?.model_3d?.color_options?.[0]?.hex ||
                   product?.color_options?.[0]?.hex;
  if (apiColor) return apiColor;

  // 2. Caller provided fallback (e.g. brand theme color)
  if (fallbackColor) return fallbackColor;

  // 3. Fallback to model registry default
  const resolvedType = resolveModelType(product);
  return MODEL_REGISTRY[resolvedType]?.defaultColor || '#2874F0';
}

/**
 * Reusable Dynamic 3D Product Model Component.
 * Automatically selects and renders the matching 3D component with proper scaling,
 * materials, and positioning offsets.
 */
export function DynamicProductModel({
  product = null,
  modelType = null,
  color = null,
  fallbackColor = null,
  isExploded = false,
  isHovered = false,
  standMode = false,
  scale = null,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ...restProps
}) {
  const resolvedType = resolveModelType(product, modelType);
  const resolvedColor = resolveProductColor(product, color, fallbackColor);
  const config = MODEL_REGISTRY[resolvedType] || MODEL_REGISTRY.smartphone;
  const ModelComponent = config.Component;

  // Exploded View support for Smartphones
  if (resolvedType === 'smartphone' && isExploded) {
    return <ExplodedSmartphoneModel color={resolvedColor} {...restProps} />;
  }

  // Calculate composite scale
  let finalScale = scale;
  if (finalScale === null) {
    finalScale = standMode ? config.standScaleMultiplier : 1.0;
  }

  // Calculate composite position offset
  const finalPosition = [
    position[0] + (standMode ? config.standOffset[0] : 0),
    position[1] + (standMode ? config.standOffset[1] : 0),
    position[2] + (standMode ? config.standOffset[2] : 0)
  ];

  // Calculate composite rotation
  const finalRotation = [
    rotation[0] + (standMode ? config.standRotation[0] : 0),
    rotation[1] + (standMode ? config.standRotation[1] : 0),
    rotation[2] + (standMode ? config.standRotation[2] : 0)
  ];

  return (
    <group
      scale={finalScale}
      position={finalPosition}
      rotation={finalRotation}
      {...restProps}
    >
      <ModelComponent
        color={resolvedColor}
        isHovered={isHovered}
      />
    </group>
  );
}

// Backwards-compatible export alias
export const DynamicProductMesh = DynamicProductModel;

export default DynamicProductModel;
