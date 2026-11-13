CUSTOM APPAREL MANAGEMENT — PEMBARUAN FITUR PESANAN PER PESERTA

Isi paket:
- index.html
- style.css
- app.js
- manifest.json
- sw.js

FITUR PEMBARUAN
- Spesifikasi umum pesanan diisi satu kali: produk, paket atasan/celana, bahan, lengan, kerah, teknik produksi, dan warna.
- Semua peserta otomatis mengikuti spesifikasi umum.
- Tabel peserta dibuat ringkas: nama, nomor punggung, ukuran, jumlah, harga satuan, tombol Custom, dan catatan peserta.
- Tombol Custom membuka pilihan produk, paket, lengan, kerah, teknik, dan warna khusus untuk peserta tersebut. Bahan kain tetap menjadi spesifikasi umum agar satu grup menggunakan bahan yang sama.
- Tombol Hitung menghitung harga berdasarkan database harga dan spesifikasi umum/custom. Harga masih dapat disesuaikan manual.
- Dokumen konfirmasi pelanggan menampilkan identitas toko/logo, spesifikasi umum (bahan hanya ditampilkan satu kali), desain yang diunggah, tabel detail peserta, lalu estimasi harga total tepat di bawah tabel. Rincian harga per peserta, subtotal, diskon, DP, dan sisa tagihan tidak ditampilkan pada lembar persetujuan pelanggan.
- File PDF desain ditampilkan sebagai tautan lampiran untuk dibuka.
- Pengaturan toko mendukung upload logo JPG/PNG (maksimal 2 MB).
- Tetap mendukung data pesanan lama, riwayat, produksi, pembayaran, backup/restore, dan PWA.
CARA MEMASANG DI GITHUB
1. Buka aplikasi yang sekarang di HP, masuk Backup & Restore, lalu unduh backup JSON terlebih dahulu. Jangan lewati langkah ini.
2. Buka repository GitHub custom-apparel-management.
3. Unggah dan timpa kelima file aplikasi (index.html, style.css, app.js, manifest.json, sw.js) ke folder root repository. Jangan unggah ke dalam folder custom-apparel-ready.
4. Commit changes dan tunggu GitHub Pages selesai deploy.
5. Buka kembali aplikasi. Jika tampilan lama masih muncul, tutup aplikasi dan buka ulang setelah HP tersambung internet.

CARA MENGISI PESANAN ROMBONGAN
1. Masuk Pesanan Baru, isi data pelanggan dan Spesifikasi Produk umum. Pilih bahan satu kali untuk seluruh grup.
2. Tekan Tambah peserta, lalu isi nama, nomor punggung, ukuran, jumlah, dan catatan tiap peserta.
3. Tekan Hitung pada baris peserta untuk menghitung harga otomatis dari database Pengaturan.
4. Jika ada peserta dengan spesifikasi berbeda, tekan Custom pada barisnya, ubah variasi yang diperlukan, lalu tekan Hitung Harga Custom. Tombol Kembali ke spesifikasi umum membatalkan custom peserta.
5. Harga dan total pesanan dihitung otomatis. Isi diskon/DP bila diperlukan, lalu simpan.
6. Di Riwayat Pesanan, tekan Cetak untuk membuka lembar konfirmasi pelanggan: spesifikasi umum, desain, rincian peserta, dan estimasi total.
PENTING TENTANG DATA
- Database tetap memakai nama CustomApparelDB dan object store pesanan yang sama; data pesanan lama tidak sengaja dihapus oleh pembaruan ini.
- Backup/restore tetap tersedia. Restore akan mengganti seluruh data lokal di perangkat tujuan.
- Data lokal tidak otomatis tersinkron antarperangkat. Pindahkan melalui Backup & Restore.
- Logo toko disimpan di penyimpanan lokal browser (localStorage) dan ikut masuk ke file backup.
- File desain disimpan pada database lokal perangkat. Buat backup secara berkala.

CATATAN
Pembaruan ini mencakup fitur yang diminta untuk harga per peserta, rincian konfirmasi, desain, dan logo. Fitur lanjutan seperti persetujuan desain bertingkat, log revisi desain lengkap, serta template SPP dan invoice formal belum termasuk dalam paket ini. Kode sudah diperiksa secara sintaks (node --check), tetapi tetap lakukan uji coba di komputer/perangkat cadangan sebelum mengganti aplikasi utama.


DATABASE HARGA PRODUK
- Buka menu Pengaturan Toko, lalu bagian Database Harga Produk.
- Harga awal: Kaos DTF Rp80.000; Jersey Dryfit atasan Rp100.000; Jersey Dryfit atasan + celana Rp140.000; Kaos Polo Lacost DTF Rp100.000; Kaos Polo Lacost bordir Rp120.000.
- Tambahan jersey: Dryfit Emboss/Jaquard +Rp10.000; lengan panjang +Rp10.000; kerah Polo +Rp10.000 per pcs.
- Saat membuat pesanan, pilih spesifikasi umum atau variasi Custom untuk peserta tertentu, lalu tekan tombol Hitung pada baris peserta. Harga satuan akan terisi otomatis dan subtotal pesanan dihitung otomatis. Harga hasil hitung masih dapat diedit manual bila ada kesepakatan khusus.
- Perubahan database harga disimpan pada perangkat/browser yang digunakan. Sertakan backup untuk memindahkan pengaturan harga ke perangkat lain.


PEMBARUAN VERSI 6
- Dokumen konfirmasi dan lembar produksi tidak menampilkan nama file gambar desain.
- Rincian peserta menampilkan jenis lengan dan kerah yang berlaku (termasuk nilai spesifikasi umum), bukan teks 'Ikuti umum'.
- Header identitas toko distandarkan: nama toko, alamat, WhatsApp, Instagram, lalu slogan pada baris terpisah.
- Tersedia tombol Cetak Lembar Produksi dari Riwayat Pesanan maupun menu Produksi. Lembar produksi berisi rincian spesifikasi/peserta, tanggal pesanan diterima, target selesai, dan estimasi hari kalender; tidak menampilkan harga atau estimasi biaya.
- Status produksi kini berupa dropdown: Siap Produksi, Dalam Produksi, Produksi Selesai, Siap Diambil / Dikirim, Selesai. Tahap Menunggu Desain dan Menunggu Persetujuan dihilangkan dari alur produksi.


VERSI 7: Nota menampilkan rekap ukuran, jenis lengan, jenis kerah, dan paket produk. Nota tanpa blok tanda tangan/ucapan di bagian bawah. Status lunas menampilkan watermark PAID. Halaman pembayaran menampilkan label LUNAS atau BELUM LUNAS. Lembar konfirmasi menampilkan rekap jumlah per kategori; kategori bernilai nol tidak ditampilkan.


PEMBARUAN VERSI 14 — PERBAIKAN CATAT PEMBAYARAN
- Tombol Catat Pembayaran sekarang memanggil panel secara langsung melalui onclick, tidak lagi bergantung pada event delegation.
- Setelah diklik, formulir nominal dan metode pembayaran akan muncul di bawah kartu pesanan. Isi nominal, pilih metode, lalu tekan Simpan Pembayaran.
- Versi cache aplikasi dinaikkan agar browser mengambil app.js terbaru.
- Untuk memasang, timpa semua file aplikasi di root repository: index.html, style.css, app.js, manifest.json, sw.js. Jangan menghapus database browser/IndexedDB. Data pesanan tetap disimpan lokal dan tidak ikut terhapus saat file aplikasi diganti.
\n\nPERBAIKAN V15 - PEMBAYARAN\nTombol Catat Pembayaran sekarang membuka panel secara langsung tanpa menunggu pembacaan database terlebih dahulu. Setelah panel muncul, isi nominal dan metode, lalu klik Simpan Pembayaran. Jika menggunakan file index.html langsung, pastikan seluruh file hasil ekstrak berada dalam satu folder.\n

PERBAIKAN V16 - STATUS LUNAS
Di menu Pembayaran, tombol Catat Pembayaran dihilangkan. Klik indikator BELUM LUNAS untuk mengubah menjadi LUNAS. Sistem akan memindahkan seluruh sisa tagihan ke pembayaran sehingga sisa menjadi Rp 0 dan dashboard menghitungnya sebagai uang diterima. Klik kembali untuk membatalkan penandaan LUNAS dan mengembalikan nilai pembayaran sebelumnya.
