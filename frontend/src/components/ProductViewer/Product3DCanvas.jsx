import React from 'react';
import { Product3DViewer } from './Product3DViewer';

// Backwards-compatible export wrapping Product3DViewer
export function Product3DCanvas(props) {
  return <Product3DViewer {...props} />;
}

export default Product3DCanvas;
