import { fetchLaporanBencana } from '@/lib/laporan-airtable';

export async function GET() {
  try {
    const data = await fetchLaporanBencana();
    return Response.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
