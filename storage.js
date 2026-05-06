// ============================================================
// STORAGE.JS — Simpan data ke localStorage agar tidak hilang
// saat refresh atau buka ulang browser
// ============================================================

var STORAGE_KEY = {
  users:    'mpp_users',
  sellers:  'mpp_sellers',
  orders:   'mpp_orders',
  notif:    'mpp_notif'
};

// ===== SIMPAN & BACA =====
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch(e) {
    console.warn('Storage penuh atau tidak tersedia:', e);
  }
}

function loadData(key, defaultVal) {
  try {
    var raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch(e) {
    return defaultVal;
  }
}

// ===== INIT — Load data saat halaman dibuka =====
document.addEventListener('DOMContentLoaded', function() {

  // Load data pengguna terdaftar
  var savedUsers = loadData(STORAGE_KEY.users, []);
  if (savedUsers.length > 0) {
    savedUsers.forEach(function(u) {
      // Hindari duplikat
      if (!registeredUsers.find(function(x){ return x.email === u.email; })) {
        registeredUsers.push(u);
      }
    });
  }

  // Load data penjual terdaftar
  var savedSellers = loadData(STORAGE_KEY.sellers, []);
  if (savedSellers.length > 0) {
    savedSellers.forEach(function(s) {
      if (!registeredSellers.find(function(x){ return x.email === s.email; })) {
        registeredSellers.push(s);
      }
    });
  }

  // Load semua pesanan
  var savedOrders = loadData(STORAGE_KEY.orders, []);
  if (savedOrders.length > 0) {
    savedOrders.forEach(function(o) {
      if (!allOrderHistory.find(function(x){ return x.waktu === o.waktu && x.pembeli === o.pembeli && x.barang === o.barang; })) {
        allOrderHistory.push(o);
      }
    });
  }

  // Load notifikasi admin
  var savedNotif = loadData(STORAGE_KEY.notif, []);
  if (savedNotif.length > 0) {
    savedNotif.forEach(function(n) {
      adminNotifications.push(n);
    });
    updateAdminNotifBadge();
  }

  console.log('Data loaded: ' + registeredUsers.length + ' users, ' + registeredSellers.length + ' sellers, ' + allOrderHistory.length + ' orders');
});

// ===== PATCH: Simpan otomatis saat data berubah =====

// Patch doDaftar — simpan user baru
var _doDaftarOrig = doDaftar;
doDaftar = function() {
  _doDaftarOrig();
  // Simpan setelah daftar berhasil (cek isLoggedIn berubah)
  setTimeout(function() {
    saveData(STORAGE_KEY.users, registeredUsers);
  }, 100);
};

// Patch doDaftarPenjual — simpan penjual baru
var _doDaftarPenjualOrig = doDaftarPenjual;
doDaftarPenjual = function() {
  _doDaftarPenjualOrig();
  setTimeout(function() {
    saveData(STORAGE_KEY.sellers, registeredSellers);
  }, 100);
};

// Patch simpanProdukSellerPage — simpan produk penjual
var _simpanProdukOrig = simpanProdukSellerPage;
simpanProdukSellerPage = function() {
  _simpanProdukOrig();
  setTimeout(function() {
    saveData(STORAGE_KEY.sellers, registeredSellers);
  }, 100);
};

// Patch confirmCheckout — simpan pesanan baru
var _confirmCheckoutStorage = confirmCheckout;
confirmCheckout = function() {
  _confirmCheckoutStorage();
  setTimeout(function() {
    saveData(STORAGE_KEY.orders, allOrderHistory);
  }, 200);
};

// Patch confirmQRIS — simpan pesanan QRIS
var _confirmQRISStorage = confirmQRIS;
confirmQRIS = function() {
  _confirmQRISStorage();
  setTimeout(function() {
    saveData(STORAGE_KEY.orders, allOrderHistory);
  }, 200);
};

// Patch submitKonfirmasiKirim — simpan update foto kirim
var _submitKonfirmasiStorage = submitKonfirmasiKirim;
submitKonfirmasiKirim = function() {
  _submitKonfirmasiStorage();
  setTimeout(function() {
    saveData(STORAGE_KEY.orders, allOrderHistory);
    saveData(STORAGE_KEY.notif, adminNotifications);
  }, 200);
};

// Patch adminTeruskankonfirmasiKirim — simpan update
var _adminTeruskanStorage = adminTeruskankonfirmasiKirim;
adminTeruskankonfirmasiKirim = function(idx) {
  _adminTeruskanStorage(idx);
  setTimeout(function() {
    saveData(STORAGE_KEY.orders, allOrderHistory);
    saveData(STORAGE_KEY.notif, adminNotifications);
  }, 200);
};

// Patch uploadFotoTerima — simpan foto penerimaan
var _uploadFotoStorage = uploadFotoTerima;
uploadFotoTerima = function(input, idx) {
  _uploadFotoStorage(input, idx);
  setTimeout(function() {
    saveData(STORAGE_KEY.orders, allOrderHistory);
  }, 500);
};

// ===== FUNGSI UTILITAS =====

// Hapus semua data (untuk testing)
function clearAllStorage() {
  Object.values(STORAGE_KEY).forEach(function(k) {
    localStorage.removeItem(k);
  });
  showToast('Semua data lokal dihapus');
}

// Lihat ringkasan data tersimpan
function getStorageSummary() {
  return {
    users:   loadData(STORAGE_KEY.users, []).length,
    sellers: loadData(STORAGE_KEY.sellers, []).length,
    orders:  loadData(STORAGE_KEY.orders, []).length,
    notif:   loadData(STORAGE_KEY.notif, []).length
  };
}
