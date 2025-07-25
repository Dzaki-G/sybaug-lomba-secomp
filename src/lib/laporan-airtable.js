export async function fetchLaporanBencana() {
    const baseId = process.env.NEXT_PUBLIC_LAPORAN_AIRTABLE_BASE;
    const tableName = encodeURIComponent(process.env.NEXT_PUBLIC_LAPORAN_AIRTABLE_TABLE);
    const token = process.env.NEXT_PUBLIC_LAPORAN_AIRTABLE_TOKEN;
  
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('Gagal mengambil data dari Airtable');
    }
  
    return res.json();
  }
  