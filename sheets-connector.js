// ============================================================
// SHEETS CONNECTOR — Moentaz ProVision
// Terhubung ke Google Sheets via Apps Script
// ============================================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyV_SvB8QCVNLlDsc-z2s1rvIqoNTuJNc1fi58a3wocDdT_oyHdyXHk3tyFLPaDscx4/exec';

// ===== Core: kirim data ke sheet =====
function kirimKeSheet(type, data) {
  if (!APPS_SCRIPT_URL) return;
  var payload = Object.assign({ type: type }, data);
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function() {
    console.log('[Sheet] ✅ Terkirim:', type);
  })
  .catch(function(err) {
    console.warn('[Sheet] ❌ Gagal:', err);
  });
}

// ===== Dipanggil saat user DAFTAR (→ sheet: users) =====
function sheetDaftar(nama, email, telpon) {
  kirimKeSheet('daftar', { nama: nama, email: email, telpon: telpon });
}

// ===== Dipanggil saat user LOGIN (→ sheet: log_login) =====
function sheetLogin(nama, email, role) {
  kirimKeSheet('login', { nama: nama, email: email, role: role || 'pembeli' });
}

// ===== Dipanggil saat CHECKOUT berhasil (→ sheet: orders) =====
function sheetPesanan(data) {
  kirimKeSheet('pesanan', {
    pembeli:     data.pembeli,
    email:       data.email,
    produk:      data.produk,
    qty:         data.qty,
    hargaBarang: data.hargaBarang,
    kurir:       data.kurir,
    ongkir:      data.ongkir,
    totalBayar:  data.totalBayar,
    pembayaran:  data.pembayaran,
    alamat:      data.alamat
  });
}

// ===== Dipanggil saat SELLER DAFTAR (→ sheet: sellers) =====
function sheetDaftarSeller(namaToko, namaPemilik, email, telpon, kategori) {
  kirimKeSheet('daftar_seller', {
    namaToko:    namaToko,
    namaPemilik: namaPemilik,
    email:       email,
    telpon:      telpon,
    kategori:    kategori || 'Umum'
  });
}
