import { fetchPeringatanDini } from '@/lib/peringatan-airtable';

export async function GET() {
  try {
    const data = await fetchPeringatanDini();
    return Response.json(data);
  } catch (error) {
    console.error('API Peringatan Error:', error);
    return Response.json({ error: 'Gagal mengambil data peringatan dini' }, { status: 500 });
  }
}
