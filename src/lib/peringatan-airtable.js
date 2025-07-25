export async function fetchPeringatanDini() {
    const baseId = process.env.NEXT_PUBLIC_PERINGATAN_AIRTABLE_BASE;
    const tableName = encodeURIComponent(process.env.NEXT_PUBLIC_PERINGATAN_AIRTABLE_TABLE);
    const token = process.env.NEXT_PUBLIC_PERINGATAN_AIRTABLE_TOKEN;
  
    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!res.ok) {
      throw new Error('Gagal mengambil data peringatan dini dari Airtable');
    }
  
    return res.json();
  }
  