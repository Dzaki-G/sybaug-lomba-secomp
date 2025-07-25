"use client";

import { useState } from "react";
import MapPanel from "./MapPanel";
import RegionDetailPanel from "./RegionDetailPanel";
import PeringatanCarousel from "../components/PeringatanCarousel";
import Header from "../components/header";
import StatistikPanel from './StatistikPanel';
import Footer from "../components/footer";

export default function DashboardPage() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState([]);

  const handleHideDetail = () => {
    setSelectedRegion(null);
    setRegionData([]);
  };

  return (
    <div style={pageWrapper}>
      <Header />

      <main style={mainContainer}>
        <section style={carouselSection}>
          <PeringatanCarousel />
        </section>

        <section style={contentSection}>
          <div style={mapContainer}>
            <MapPanel
              onRegionClick={(name, details) => {
                setSelectedRegion(name);
                setRegionData(details);
              }}
            />
          </div>

          {selectedRegion && (
            <div style={detailContainer}>
              <RegionDetailPanel
                region={selectedRegion}
                data={regionData}
                onHide={handleHideDetail}
              />
            </div>
          )}
        </section>

        <section style={statistikSection}>
          <StatistikPanel />
        </section>
      </main>
      <Footer /> 
    </div>
  );
}

// === Styles ===

const pageWrapper = {
  flex: 1,
  background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #2563eb 50%, #1d4ed8 75%, #1e3a8a 100%)',
  color: '#ffffff',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '0',
  margin: '0',
};

const mainContainer = {
  // flex: 1,
  // background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 25%, #2563eb 50%, #1d4ed8 75%, #1e3a8a 100%)',
  // color: '#ffffff',
  // fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  // padding: '0',
  // margin: '0',
};

const carouselSection = {
  width: '100%',
  marginBottom: '2rem',
};

const contentSection = {
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  padding: '0 1.5rem 1.5rem 1.5rem',
  maxWidth: '1400px',
  margin: '0 auto',
  width: '100%',
  boxSizing: 'border-box',
};

const mapContainer = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
};

const detailContainer = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1rem',
};

const statistikSection = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginTop: '1rem',
};
