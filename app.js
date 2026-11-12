
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
