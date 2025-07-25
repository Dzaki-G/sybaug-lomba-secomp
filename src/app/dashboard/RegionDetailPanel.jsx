"use client";

import { useMemo, useState, useEffect } from "react";

export default function RegionDetailPanel({ region, data = [], onHide }) {
  const [jenisFilter, setJenisFilter] = useState("Semua");
  const [bulanFilter, setBulanFilter] = useState("Semua");

  useEffect(() => {
    setJenisFilter("Semua");
    setBulanFilter("Semua");
  }, [region]);

  // Daftar lengkap semua jenis bencana yang mungkin ada
  const allJenisBencana = [
    "Banjir",
    "Banjir ROB",
    "Angin Kencang",
    "Kebakaran Hutan & Lahan",
    "Tanah Longsor",
    "Gempa Bumi"
  ];

  // Mendapatkan jenis bencana yang ada di data current region
  const availableJenis = useMemo(() => {
    const set = new Set(data.map((d) => d["Jenis Bencana"]).filter(Boolean));
    return Array.from(set);
  }, [data]);

  // Membuat options untuk dropdown dengan info ketersediaan data
  const jenisOptions = useMemo(() => {
    const options = ["Semua"];
    
    allJenisBencana.forEach(jenis => {
      if (availableJenis.includes(jenis)) {
        options.push(jenis);
      } else {
        options.push(`${jenis} (Tidak ada data di ${region})`);
      }
    });

    return options;
  }, [availableJenis, region]);

  // Mapping bulan untuk tampilan UI yang lebih user-friendly
  const bulanMapping = {
    "Semua": "Semua Bulan",
    "01": "Januari",
    "02": "Februari", 
    "03": "Maret",
    "04": "April",
    "05": "Mei",
    "06": "Juni",
    "07": "Juli",
    "08": "Agustus",
    "09": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember"
  };

  const bulanOptions = [
    "Semua", "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12",
  ];

  const dampakFields = [
    "Korban Meninggal",
    "Korban Hilang",
    "Korban Luka",
    "Jiwa Mengungsi",
    "Jiwa Menderita",
    "Rumah Rusak Berat",
    "Rumah Rusak Sedang",
    "Rumah Rusak Ringan",
    "Rumah Terendam",
    "Sarana Pendidikan",
    "Sarana Ibadah",
    "Sarana Kesehatan",
    "Perkantoran",
    "Jalan (Km)",
    "Sawah (Ha)",
    "Kebun/Lahan (Ha)",
  ];

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const bulan = d["Tanggal Bencana"]?.slice(5, 7);
      
      // Ekstrak jenis bencana asli dari option yang mungkin mengandung info "(Tidak ada data...)"
      const actualJenis = jenisFilter.includes("(Tidak ada data") 
        ? jenisFilter.split(" (Tidak ada data")[0]
        : jenisFilter;
      
      const byJenis = jenisFilter === "Semua" || d["Jenis Bencana"] === actualJenis;
      const byBulan = bulanFilter === "Semua" || bulan === bulanFilter;
      return byJenis && byBulan;
    });
  }, [data, jenisFilter, bulanFilter]);

  return (
    <section style={panelSection}>
      <div style={panelWrapper}>
        {/* Header */}
        <div style={panelHeader}>
          <div style={alertBadge}>
            <span style={alertIcon}>📊</span>
            <span>Detail Kejadian</span>
          </div>
          <h2 style={panelTitle}>
            {region}
          </h2>
        </div>

        {/* Filter Section */}
        <div style={filterContainer}>
          <select
            style={selectStyle}
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
          >
            {jenisOptions.map((opt) => (
              <option 
                key={opt} 
                value={opt}
                disabled={opt.includes("(Tidak ada data")}
                style={optionStyle}
              >
                {opt}
              </option>
            ))}
          </select>

          <select
            style={selectStyle}
            value={bulanFilter}
            onChange={(e) => setBulanFilter(e.target.value)}
          >
            {bulanOptions.map((b) => (
              <option key={b} value={b} style={optionStyle}>
                {bulanMapping[b]}
              </option>
            ))}
          </select>
        </div>

        {/* Content Container */}
        <div style={contentContainer}>
          {filteredData.length === 0 ? (
            <div style={noDataCard}>
              <h3 style={noDataTitle}>Tidak Ada Data</h3>
              <p style={noDataText}>
                {jenisFilter.includes("(Tidak ada data") 
                  ? `Tidak ada data bencana ${jenisFilter.split(" (Tidak ada data")[0]} di ${region}.`
                  : "Tidak ada data ditemukan dengan filter yang dipilih."
                }
              </p>
            </div>
          ) : (
            <div style={cardGrid}>
              {filteredData.map((d, i) => (
                <div key={i} style={incidentCard}>
                  <div style={cardHeader}>
                    <h3 style={cardTitle}>
                      {d["Jenis Bencana"] || "Bencana Tidak Diketahui"}
                    </h3>
                  </div>
                  
                  <div style={cardMeta}>
                    <div style={metaItem}>
                      <strong>Tanggal:</strong> {d["Tanggal Bencana"] || "-"}
                    </div>
                    <div style={metaItem}>
                      <strong>Lokasi:</strong> {d["Kecamatan"] || "-"}, {d["Desa/Kelurahan"] || "-"}
                    </div>
                    <div style={metaItem}>
                      <strong>Kronologi:</strong> {d["Kronologi/Penyebab"] || "-"}
                    </div>
                  </div>

                  <div style={cardContent}>
                    {dampakFields.map((field) =>
                      d[field] && parseInt(d[field]) > 0 ? (
                        <div key={field} style={dampakItem}>
                          <strong>{field}:</strong> {d[field]}
                        </div>
                      ) : null
                    )}

                    {!isNaN(Number(d["Taksiran Kerugian"])) && Number(d["Taksiran Kerugian"]) > 0 && (
                      <div style={{...dampakItem, marginTop: '0.75rem'}}>
                        <strong>Kerugian:</strong>{" "}
                        Rp {Number(d["Taksiran Kerugian"]).toLocaleString("id-ID")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hide Button */}
        <div style={buttonContainer}>
          <button
            style={hideButton}
            onClick={onHide}
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </section>
  );
}

// === Styles ===

const panelSection = {
  padding: '0',
  minWidth: '1134px',
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
};

const panelWrapper = {
  backgroundColor: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
};

const panelHeader = {
  padding: '2rem 2rem 1rem 2rem',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  flexShrink: 0,
};

const alertBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'rgba(59, 130, 246, 0.2)',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  borderRadius: '20px',
  padding: '0.5rem 1rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: 'white',
  marginBottom: '1rem',
  width: 'fit-content',
};

const alertIcon = {
  fontSize: '1rem',
};

const panelTitle = {
  fontSize: '2rem',
  fontWeight: '700',
  margin: '0',
  color: '#ffffff',
};

const filterContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1rem',
  padding: '1.5rem 2rem',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  flexShrink: 0,
};

const selectStyle = {
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
  minWidth: '200px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  backgroundSize: '16px',
  paddingRight: '40px',
};

// Style untuk option dalam dropdown
const optionStyle = {
  color: '#1e40af', // Warna biru untuk teks option
  backgroundColor: '#ffffff', // Background putih untuk option
  padding: '0.5rem',
  fontWeight: '500',
};

const contentContainer = {
  flex: 1,
  overflowY: 'auto',
  padding: '2rem',
};

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '1.5rem',
};

const incidentCard = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'default',
};

const cardHeader = {
  marginBottom: '1rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
};

const cardTitle = {
  fontSize: '1.25rem',
  fontWeight: '700',
  margin: '0',
  color: '#ffffff',
};

const cardMeta = {
  marginBottom: '1rem',
};

const metaItem = {
  fontSize: '0.875rem',
  color: 'rgba(255,255,255,0.8)',
  marginBottom: '0.5rem',
  lineHeight: '1.4',
};

const cardContent = {
  fontSize: '0.875rem',
  color: 'rgba(255,255,255,0.9)',
  lineHeight: '1.4',
};

const dampakItem = {
  marginBottom: '0.25rem',
};

const noDataCard = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
  padding: '3rem',
  textAlign: 'center',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};

const noDataTitle = {
  fontSize: '1.5rem',
  fontWeight: '700',
  margin: '0 0 1rem 0',
  color: '#ffffff',
};

const noDataText = {
  color: 'rgba(255,255,255,0.6)',
  fontStyle: 'italic',
  fontSize: '1rem',
  margin: '0',
  lineHeight: '1.6',
};

const buttonContainer = {
  display: 'flex',
  justifyContent: 'center',
  padding: '1.5rem 2rem 2rem 2rem',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  flexShrink: 0,
};

const hideButton = {
  padding: '0.75rem 2rem',
  backgroundColor: 'rgba(240, 38, 38, 0.3)',
  backdropFilter: 'blur(10px)',
  color: '#ffffff',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '25px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};