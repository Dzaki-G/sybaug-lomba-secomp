// src/app/fetch/page.jsx
import Link from 'next/link';

export default function Page() {
  return (
    <main style={{ padding: '1em' }}>
      <h1>Halaman Fetch</h1>
      <ul>
        <li><Link href="/fetch/laporan">Lihat Laporan Bencana</Link></li>
        <li><Link href="/fetch/peringatan">Lihat Peringatan Dini</Link></li>
      </ul>
    </main>
  );
}
