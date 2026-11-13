
const DB_NAME = "CustomApparelDB";
const DB_VERSION = 1;
const STORE_NAME = "pesanan";

function bukaDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true
        });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function simpanPesanan(data) {
  const db = await bukaDatabase();

  return new Promise((resolve, reject) => {
    const transaksi = db.transaction(STORE_NAME, "readwrite");
    const store = transaksi.objectStore(STORE_NAME);

    const request = store.add({
      ...data,
      tanggalSimpan: new Date().toISOString()
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaksi.oncomplete = () => db.close();
  });
}

async function ambilSemuaPesanan() {
  const db = await bukaDatabase();

  return new Promise((resolve, reject) => {
    const transaksi = db.transaction(STORE_NAME, "readonly");
    const request = transaksi.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      resolve(request.result);
      db.close();
    };

    request.onerror = () => {
      reject(request.error);
      db.close();
    };
  });
}

console.log("Database Custom Apparel siap digunakan.");

async function tampilkanRiwayat() {
  const halaman = document.getElementById("halamanRiwayat");
  const daftar = document.getElementById("daftarRiwayat");

  halaman.style.display = "block";
  daftar.innerHTML = "<p>Memuat data pesanan...</p>";

  try {
    const pesanan = await ambilSemuaPesanan();

    if (pesanan.length === 0) {
      daftar.innerHTML = "<p>Belum ada pesanan tersimpan.</p>";
      return;
    }

    daftar.innerHTML = pesanan.map((item) => `
      <div class="card">
        <h3>Pesanan #${item.id}</h3>
        <p><b>Nama:</b> ${item.nama || "-"}</p>
        <p><b>WhatsApp:</b> ${item.wa || "-"}</p>
        <p><b>Produk:</b> ${item.produk || "-"}</p>
        <p><b>Jumlah:</b> ${item.jumlah || 0}</p>
        <p><b>Target selesai:</b> ${item.target || "-"}</p>
        <p><b>Total:</b> Rp ${Number(item.total || 0).toLocaleString("id-ID")}</p>
        <p><b>DP:</b> Rp ${Number(item.dp || 0).toLocaleString("id-ID")}</p>
      </div>
    `).join("");

  } catch (error) {
    daftar.innerHTML = "<p>Gagal mengambil data pesanan.</p>";
    console.error(error);
  }
}

function kembaliDashboard() {
  document.getElementById("halamanRiwayat").style.display = "none";
}



async function backupDatabase() {
  try {
    const pesanan = await ambilSemuaPesanan();

    const backup = {
      aplikasi: "Custom Apparel Management",
      versi: 1,
      tanggalBackup: new Date().toISOString(),
      dataPesanan: pesanan
    };

    const file = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `backup-pesanan-${new Date().toISOString().slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    // Simpan informasi backup terakhir
    const informasi = {
      tanggal: new Date().toISOString(),
      jumlah: pesanan.length
    };

    localStorage.setItem(
      "informasiBackup",
      JSON.stringify(informasi)
    );

    tampilkanInfoBackup();

    alert("Backup database berhasil dibuat!");

  } catch (error) {
    console.error(error);
    alert("Backup gagal dibuat.");
  }
}

function tampilkanInfoBackup() {
  const area = document.getElementById("infoBackup");

  if (!area) return;

  const data = localStorage.getItem("informasiBackup");

  if (!data) {
    area.innerHTML = `
      <b>Informasi Backup Terakhir</b>
      <p>Belum ada backup yang dilakukan.</p>
    `;
    return;
  }

  const informasi = JSON.parse(data);

  const tanggal = new Date(informasi.tanggal);

  area.innerHTML = `
    <b>Informasi Backup Terakhir</b>
    <p>Tanggal: ${tanggal.toLocaleString("id-ID")}</p>
    <p>Jumlah pesanan: ${informasi.jumlah} pesanan</p>
  `;
}

document.addEventListener("DOMContentLoaded", tampilkanInfoBackup);

async function restoreDatabase(file) {
  let db;

  try {
    const isiFile = await file.text();
    const backup = JSON.parse(isiFile);

    if (
      !backup.dataPesanan ||
      !Array.isArray(backup.dataPesanan)
    ) {
      alert("File backup tidak valid.");
      return;
    }

    const pesananLama = await ambilSemuaPesanan();

    const idTerpakai = new Set(
      pesananLama.map(item => item.id)
    );

    db = await bukaDatabase();

    await new Promise((resolve, reject) => {
      const transaksi = db.transaction(STORE_NAME, "readwrite");
      const store = transaksi.objectStore(STORE_NAME);

      backup.dataPesanan.forEach(item => {
        const data = { ...item };

        if (data.id == null || idTerpakai.has(data.id)) {
          delete data.id;
        } else {
          idTerpakai.add(data.id);
        }

        store.add(data);
      });

      transaksi.oncomplete = resolve;
      transaksi.onerror = () => reject(transaksi.error);
      transaksi.onabort = () => reject(transaksi.error);
    });

    alert(
      "Restore berhasil! " +
      backup.dataPesanan.length +
      " data pesanan berhasil diproses."
    );

  } catch (error) {
    console.error(error);
    alert("Restore gagal. Pastikan file backup benar.");
  } finally {
    if (db) db.close();
  }
}

async function mulaiRestoreDatabase() {
  const input = document.getElementById("fileBackup");

  if (!input.files.length) {
    alert("Pilih file backup terlebih dahulu.");
    return;
  }

  if (!confirm("Gabungkan data dari file backup ke database ini?")) {
    return;
  }

  await restoreDatabase(input.files[0]);
}
