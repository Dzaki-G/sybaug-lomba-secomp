'use client';

import { useEffect, useState } from 'react';

export default function Page() {
  const [records, setRecords] = useState([]);
  const [fieldObj, setFieldObj] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/laporan');
        if (!res.ok) throw new Error('Gagal fetch');
        const data = await res.json();
        setRecords(data.records || []);

        const allFields = new Set();
        data.records.forEach(record => {
          Object.keys(record.fields || {}).forEach(key => allFields.add(key));
        });

        const structure = Array.from(allFields).reduce((acc, key) => {
          acc[key] = 'string | number | ...';
          return acc;
        }, {});
        setFieldObj(structure);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat data.');
      }
    }

    fetchData();
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '1em', background: 'black', minHeight: '100vh'}}>
      <h1>Laporan Bencana Final</h1>
      {error && <p>{error}</p>}
      {records.length === 0 && !error && <p>Memuat data...</p>}
      {records.map((record, i) => {
        const f = record.fields;
        return (
          <div key={i} style={cardStyle}>
            <h3>{f["Jenis Bencana"] || 'Tanpa Jenis Bencana'}</h3>
            {Object.entries(f).map(([key, value]) => (
              key !== "Jenis Bencana" && (
                <p key={key}><strong>{key}:</strong> {value.toString()}</p>
              )
            ))}
          </div>
        );
      })}
      <h2>Struktur Field (JSON)</h2>
      <div style={structureStyle}>
        <pre style={structureStyle}>{JSON.stringify(fieldObj, null, 2)}</pre>
      </div>
    </main>
  );
}

const cardStyle = {
  background: 'white',
  borderRadius: '8px',
  padding: '1em',
  marginBottom: '1em',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const structureStyle = {
  marginTop: '2em',
  background: 'white',
  padding: '1em',
  borderRadius: '8px',
  whiteSpace: 'pre-wrap',
  fontFamily: 'monospace',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};
