export function parsePeringatan(value) {
  const results = [];

  const blocks = value
    .split("!!! PERINGATAN DINI !!!")
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lokasiMatch = block.match(/- Kab\/Kot (.+?), Kecamatan (.+)/);
    const tanggalMatch = block.match(/- Tanggal: ([\d-]+)/);

    const lokasi = lokasiMatch
      ? `${lokasiMatch[1].trim()}, Kecamatan ${lokasiMatch[2].trim()}`
      : "Tidak diketahui";

    const tanggal = tanggalMatch ? tanggalMatch[1].trim() : "Tidak diketahui";

    const peringatan = {
      lokasi,
      tanggal,
      entries: [],
    };

    const waktuRegex = /Pukul ([0-9:]+ WIB):([\s\S]*?)(?=Pukul [0-9:]+ WIB:|$)/g;
    let waktuMatch;

    while ((waktuMatch = waktuRegex.exec(block)) !== null) {
      const waktu = waktuMatch[1].trim();
      const isi = waktuMatch[2].trim();

      const potensiMatch = isi.match(/Potensi:\s*(.*?)(?=Alasan:|Mitigasi & Aksi:|\n|$)/);
      const potensi = potensiMatch ? potensiMatch[1].trim() : "";

      const alasanMatch = isi.match(/Alasan:\s*([\s\S]*?)(?=Mitigasi & Aksi:|$)/);
      const aksiMatch = isi.match(/Mitigasi & Aksi:\s*([\s\S]*?)$/);

      const parseList = (text) => {
        if (!text) return [];
        return text
          .split("\n")
          .flatMap((line) => line.split(/(?=- )/))
          .map((line) => line.replace(/^- /, "").trim())
          .filter((line) => line.length > 0);
      };

      const alasan = parseList(alasanMatch?.[1] || "");
      const aksi = parseList(aksiMatch?.[1] || "");

      peringatan.entries.push({ waktu, potensi, alasan, aksi });
    }

    results.push(peringatan);
  }

  return results;
}
