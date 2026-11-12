
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

