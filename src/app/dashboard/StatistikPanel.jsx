// StatistikPanel.jsx
'use client';

import { useEffect, useState } from 'react';
import DisasterSummaryCard from './DisasterSummaryCard';
import DisasterTrendChart from './DisasterTrendChart';
import DisasterFilterTabs from './DisasterFilterTabs';

const disasterTypes = [
  'Banjir',
  'Banjir ROB',
  'Angin Kencang',
  'Kebakaran Hutan & Lahan',
  'Tanah Longsor',
  'Gempa Bumi',
  'Tsunami',
];

export default function StatistikPanel() {
  const [summaryData, setSummaryData] = useState({});
  const [trendData, setTrendData] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/laporan');
        const raw = await res.json();

        const summary = {};
        const trends = {};

        raw?.records?.forEach((record) => {
          const fields = record.fields || {};
          const type = fields['Jenis Bencana'];
          const date = new Date(fields['Tanggal Bencana']);
          const month = date.getMonth(); // 0–11

          // Summary count
          if (disasterTypes.includes(type)) {
            summary[type] = (summary[type] || 0) + 1;
          }

          // Trend by month
          if (!trends[type]) trends[type] = new Array(12).fill(0);
          if (month >= 0) trends[type][month] += 1;
        });

        setSummaryData(summary);
        setTrendData(trends);
      } catch (err) {
        console.error('Gagal ambil data statistik:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <section style={statistikPanelStyle}>
      {/* Summary Cards */}
      <div style={cardGridStyle}>
        {disasterTypes.map((type) => (
          <DisasterSummaryCard
            key={type}
            title={type}
            count={summaryData[type] || 0}
            unit="Kejadian"
          />
        ))}
      </div>



      {/* Trend Chart */}
      <div style={chartContainerStyle}>
          {/* Filter Tabs */}
          <DisasterFilterTabs
            selected={selectedDisaster}
            setSelected={setSelectedDisaster}
          />
        <DisasterTrendChart
          selected={selectedDisaster}
          data={trendData}
        />
      </div>
    </section>
  );
}

// Styles for StatistikPanel
const statistikPanelStyle = {
  color: '#FFFFFF',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  borderRadius: '16px',
  margin: '0 auto',
  maxWidth: '1134px',
  width: '100%',
};

const cardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: '20px',
  marginBottom: '40px',
};

const chartContainerStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(15px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  padding: '32px',
};