'use client';

import { useEffect, useRef, useState } from 'react';
import { parsePeringatan } from '@/lib/parsePeringatan';

export default function PeringatanCarousel() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [parsedSlides, setParsedSlides] = useState([]);
  const [expanded, setExpanded] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('../api/peringatan');
        if (!res.ok) throw new Error('Gagal fetch');
        const data = await res.json();
        setRecords(data.records || []);

        const slides = [];
        data.records.forEach((record) => {
          const parsed = parsePeringatan(record.fields?.value || '');
          if (Array.isArray(parsed)) {
            parsed.forEach((block) => slides.push(block));
          }
        });
        setParsedSlides(slides);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data.');
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const isAnyExpanded = Object.values(expanded).some(val => val);

    if (!isAnyExpanded && parsedSlides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % parsedSlides.length);
      }, 5000);
      return () => clearInterval(interval);
    }

    return undefined;
  }, [expanded, parsedSlides.length]);

  const toggleExpand = (index) => {
    setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const resetAllExpand = () => setExpanded({});

  const nextSlide = () => {
    resetAllExpand();
    setCurrentSlide((prev) => (prev + 1) % parsedSlides.length);
  };

  const prevSlide = () => {
    resetAllExpand();
    setCurrentSlide((prev) => (prev - 1 + parsedSlides.length) % parsedSlides.length);
  };

  return (
    <section style={carouselSection}>
      <div style={carouselWrapper} ref={containerRef}>
        <div style={{ ...carouselInner, transform: `translateX(-${currentSlide * 100}%)` }}>
          {parsedSlides.length === 0 ? (
            <div style={slideCard}>
              <div style={alertBadge}>
                <span style={alertIcon}>⚠️</span>
                <span>Pembaruan Database</span>
              </div>
              <h3 style={slideTitle}>Mohon Maaf</h3>
              <p style={slideText}>
                Sedang ada pembaruan database. Peringatan dini akan ditampilkan sesegera mungkin.
              </p>
            </div>
          ) : (
            parsedSlides.map((block, i) => {
              const isExpanded = expanded[i];
              return (
                <div key={i} style={slideCard}>
                  <div style={alertBadge}>
                    <span style={alertIcon}>🚨</span>
                    <span>Peringatan Aktif</span>
                  </div>
                  <h3 style={slideTitle}>{block.lokasi}</h3>
                  <p style={slideMeta}><strong>Tanggal:</strong> {block.tanggal}</p>

                  {!isExpanded ? (
                    <>
                      {block.entries?.length ? (
                        <div style={timeCardsContainer}>
                          {block.entries.map((entry, j) => (
                            <div key={j} style={timeCard}>
                              <div style={timeHeader}>{entry.waktu}</div>
                              <div style={potensiContent}>{entry.potensi}</div>
                            </div>
                          ))}
                        </div>
                      ) : <p style={noDataText}>Tidak ada data waktu dan potensi tersedia.</p>}
                      <div style={buttonContainer}>
                        <button onClick={() => toggleExpand(i)} style={viewMoreBtn}>
                          Lihat Detail
                        </button>
                      </div>
                    </>
                  ) : (
                    <div style={expandedContent}>
                      {block.entries?.length ? block.entries.map((entry, j) => (
                        <div key={j} style={entryExpanded}>
                          <div style={entryHeader}>
                            <span style={timeLabel}>Pukul: {entry.waktu}</span>
                          </div>
                          <div style={entryBody}>
                            <p><strong>Potensi:</strong> {entry.potensi}</p>

                            {entry.alasan?.length > 0 && (
                              <div style={detailSection}>
                                <h4 style={detailTitle}>Alasan:</h4>
                                <ul style={detailList}>
                                  {entry.alasan.map((a, ai) => (
                                    <li key={ai} style={detailItem}>{a}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {entry.aksi?.length > 0 && (
                              <div style={detailSection}>
                                <h4 style={detailTitle}>Mitigasi & Aksi:</h4>
                                <ul style={detailList}>
                                  {entry.aksi.map((a, ai) => (
                                    <li key={ai} style={detailItem}>{a}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )) : <p style={noDataText}>Tidak ada data detail tersedia.</p>}
                      <div style={buttonContainer}>
                        <button onClick={() => toggleExpand(i)} style={closeBtn}>
                          Tutup Detail
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Arrows */}
      {parsedSlides.length > 0 && (
        <>
          <button onClick={prevSlide} style={arrowLeft}><span style={arrowIcon}>‹</span></button>
          <button onClick={nextSlide} style={arrowRight}><span style={arrowIcon}>›</span></button>
        </>
      )}

      {/* Indicators */}
      {parsedSlides.length > 1 && (
        <div style={indicatorsContainer}>
          {parsedSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                ...indicator,
                backgroundColor: i === currentSlide ? '#ffffff' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// === Styles ===

const carouselSection = {
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
  position: 'relative',
};

const carouselWrapper = {
  overflow: 'hidden',
  width: '100%',
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
};

const carouselInner = {
  display: 'flex',
  transition: 'transform 0.5s ease-in-out',
  width: '100%',
};

const slideCard = {
  flex: '0 0 100%',
  padding: '2rem',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const alertBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: 'rgba(245, 158, 11, 0.2)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
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

const slideTitle = {
  fontSize: '2rem',
  fontWeight: '700',
  margin: '0 0 1rem 0',
  color: '#ffffff',
};

const slideText = {
  fontSize: '1.1rem',
  lineHeight: '1.6',
  color: 'rgba(255,255,255,0.9)',
  margin: '0',
};

const slideMeta = {
  fontSize: '1rem',
  color: 'rgba(255,255,255,0.8)',
  marginBottom: '1.5rem',
};

const timeCardsContainer = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',  
  gap: '1rem',
  marginBottom: '2rem',
};

const timeCard = {
  backgroundColor: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: '12px',
  padding: '1.5rem',
  textAlign: 'center',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'default',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  minWidth: '200px',  
  maxWidth: '250px',  
  width: '200px',     
  flex: '0 0 auto',   
};

const timeHeader = {
  fontWeight: '700',
  fontSize: '1.1rem',
  color: '#ffffff',
  marginBottom: '0.75rem',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid rgba(255,255,255,0.2)',
};

const potensiContent = {
  fontSize: '0.95rem',
  color: 'rgba(255,255,255,0.9)',
  lineHeight: '1.4',
};

const buttonContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '1rem',
  marginTop: '1.5rem',
};

const viewMoreBtn = {
  padding: '0.75rem 2rem',
  backgroundColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(10px)',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '25px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
};

const closeBtn = {
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

const arrowLeft = {
  position: 'absolute',
  top: '50%',
  left: '1.5rem',
  transform: 'translateY(-50%)',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0)',
  border: 'none',
  color: '#ffffff',
  cursor: 'pointer',
};

const arrowRight = {
  position: 'absolute',
  top: '50%',
  right: '1.5rem',
  transform: 'translateY(-50%)',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0)',
  border: 'none',
  color: '#ffffff',
  cursor: 'pointer',
};

const arrowIcon = {
  fontSize: '1.5rem',
  fontWeight: '600',
};

const indicatorsContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '0.5rem',
  marginTop: '1rem',
};

const indicator = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const expandedContent = {
  marginTop: '1rem',
};

const entryExpanded = {
  marginBottom: '1.5rem',
  backgroundColor: 'rgba(255,255,255,0.05)',
  borderRadius: '12px',
  padding: '1.5rem',
  border: '1px solid rgba(255,255,255,0.1)',
};

const entryHeader = {
  marginBottom: '1rem',
};

const timeLabel = {
  backgroundColor: 'rgba(34, 197, 94, 0.2)',
  color: '#4ade80',
  padding: '0.25rem 0.75rem',
  borderRadius: '15px',
  fontSize: '0.875rem',
  fontWeight: '600',
  border: '1px solid rgba(34, 197, 94, 0.3)',
};

const entryBody = {
  color: 'rgba(255,255,255,0.9)',
};

const detailSection = {
  marginTop: '1rem',
};

const detailTitle = {
  fontSize: '1rem',
  fontWeight: '600',
  margin: '0 0 0.5rem 0',
  color: '#ffffff',
};

const detailList = {
  margin: '0',
  paddingLeft: '1.5rem',
  color: 'rgba(255,255,255,0.8)',
};

const detailItem = {
  marginBottom: '0.25rem',
  lineHeight: '1.4',
};

const noDataText = {
  color: 'rgba(255,255,255,0.6)',
  fontStyle: 'italic',
  textAlign: 'center',
  padding: '2rem',
};

