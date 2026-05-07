// ============================================================
// GOOGLE APPS SCRIPT — Moentaz ProVision
// CARA PASANG:
// 1. Buka Google Sheet → Extensions → Apps Script
// 2. Hapus SEMUA kode lama
// 3. Paste SEMUA kode ini
// 4. Klik Save (Ctrl+S)
// 5. Deploy → Manage Deployments → Edit → New Version → Deploy
// URL tidak berubah, tidak perlu update website
// ============================================================

function doGet(e) {
  return out({ status: 'ok', version: '3.0', message: 'API aktif ✅' });
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.type === 'daftar')        return tambahPembeli(data);
    if (data.type === 'daftar_seller') return tambahSeller(data);
    if (data.type === 'pesanan')       return tambahPesanan(data);
    if (data.type === 'login')         return tambahLogin(data);
    return out({ status: 'error', message: 'type tidak dikenal: ' + data.type });
  } catch(err) {
    return out({ status: 'error', message: err.toString() });
  }
}

// ===== PEMBELI → sheet "users" =====
function tambahPembeli(d) {
  var sheet = ambilSheet('users', [
    'No','Waktu Daftar','Nama','Email','Telepon','Status','Total Pesanan'
  ]);

  // Cek duplikat email
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][3] === d.email) {
      return out({ status: 'duplicate', message: 'Email sudah ada' });
    }
  }

  var no = sheet.getLastRow(); // baris 1=header, baris 2=no.1
  sheet.appendRow([no, waktu(), d.nama, d.email, d.telpon, 'Aktif', 0]);
  warnaiBaris(sheet);
  return out({ status: 'success', message: 'Pembeli ditambahkan' });
}

// ===== SELLER → sheet "Akun Penjual" =====
function tambahSeller(d) {
  var sheet = ambilSheet('Akun Penjual', [
    'No','Waktu Daftar','Nama Toko','Nama Pemilik','Email','Telepon','Kategori','Status'
  ]);
  var no = sheet.getLastRow();
  sheet.appendRow([no, waktu(), d.namaToko, d.namaPemilik, d.email, d.telpon, d.kategori || 'Umum', 'Aktif']);
  warnaiBaris(sheet);
  return out({ status: 'success', message: 'Seller ditambahkan' });
}

// ===== PESANAN → sheet "orders" =====
function tambahPesanan(d) {
  var sheet = ambilSheet('orders', [
    'No','Waktu','Pembeli','Email','Produk','Harga Barang','Kurir','Ongkir','Total','Pembayaran','Alamat','Status'
  ]);
  var no = sheet.getLastRow();
  sheet.appendRow([
    no, waktu(), d.pembeli, d.email, d.produk,
    d.hargaBarang, d.kurir, d.ongkir, d.totalBayar,
    d.pembayaran, d.alamat, 'Pesanan Masuk'
  ]);
  warnaiBaris(sheet);

  // Update total pesanan di users
  try {
    var users = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('users');
    if (users) {
      var rows = users.getDataRange().getValues();
      var count = 0;
      var orders = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('orders');
      if (orders) {
        var orows = orders.getDataRange().getValues();
        for (var i = 1; i < orows.length; i++) {
          if (orows[i][3] === d.email) count++;
        }
      }
      for (var j = 1; j < rows.length; j++) {
        if (rows[j][3] === d.email) {
          users.getRange(j+1, 7).setValue(count + ' pesanan');
          break;
        }
      }
    }
  } catch(e) {}

  return out({ status: 'success', message: 'Pesanan ditambahkan' });
}

// ===== LOGIN → sheet "log_login" =====
function tambahLogin(d) {
  var sheet = ambilSheet('log_login', ['No','Waktu','Nama','Email','Role']);
  var no = sheet.getLastRow();
  sheet.appendRow([no, waktu(), d.nama, d.email, d.role || 'pembeli']);
  warnaiBaris(sheet);
  return out({ status: 'success', message: 'Login dicatat' });
}

// ===== HELPER =====
function ambilSheet(nama, headers) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(nama);
  if (!sheet) {
    sheet = ss.insertSheet(nama);
    sheet.appendRow(headers);
    var h = sheet.getRange(1, 1, 1, headers.length);
    var warna = { users:'#5b4fcf', sellers:'#2e7d32', orders:'#e65100', log_login:'#1a237e' };
    h.setBackground(warna[nama] || '#333');
    h.setFontColor('white');
    h.setFontWeight('bold');
    h.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function warnaiBaris(sheet) {
  var row = sheet.getLastRow();
  var cols = sheet.getLastColumn();
  sheet.getRange(row, 1, 1, cols)
    .setBackground(row % 2 === 0 ? '#f5f5f5' : '#ffffff');
}

function waktu() {
  return Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
}

function out(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
