'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Import komponen Map hanya di client
const DynamicLeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
});

export default function MapPage() {
  return (
    <main style={{ padding: '1em', fontFamily: 'sans-serif' }}>
      <h1>Peta Provinsi Lampung (Leaflet)</h1>
      <DynamicLeafletMap />
    </main>
  );
}
