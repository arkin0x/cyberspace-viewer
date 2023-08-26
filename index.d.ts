// index.d.ts
import * as React from 'react';
import * as THREE from 'three';

declare module 'cyberspace-viewer' { 

  export type ConstructViewerProps = {
    constructSize?: number;
    hexLocation?: string; // 64 character hex string
    style?: React.CSSProperties;
  };

  const ConstructViewer: React.FC<ConstructViewerProps>;

  export default ConstructViewer;
}
