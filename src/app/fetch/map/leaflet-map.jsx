'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap() {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('/data/geojson-lampung.json')
      .then(res => res.json())
      .then(setGeoData)
      .catch(err => console.error('Gagal memuat GeoJSON:', err));
  }, []);

  const onEachFeature = (feature, layer) => {
    if (feature.properties?.kabkot) {
      layer.bindPopup(`<strong>${feature.properties.kabkot}</strong>`);
    }
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({ weight: 2, color: '#333', fillOpacity: 0.7 });
      },
      mouseout: (e) => {
        e.target.setStyle({ weight: 1, color: '#666', fillOpacity: 0.5 });
      },
    });
  };

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <MapContainer center={[-5.1, 105.3]} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <GeoJSON
            data={geoData}
            onEachFeature={onEachFeature}
            style={{
              fillColor: '#3fa9f5',
              weight: 1,
              color: '#666',
              fillOpacity: 0.5,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
