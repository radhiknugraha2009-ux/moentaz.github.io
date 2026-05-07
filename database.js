// ============================================================
// DATABASE.JS — Koneksi ke Google Sheets via Apps Script
// Ganti SCRIPT_URL dengan URL deployment kamu
// ============================================================

// ⚠️ GANTI INI dengan URL dari Google Apps Script deployment kamu
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwQWkQxEqx59zKYKlC_EgTBXMKYFGaz-JBPvtGj2kF3S3F6ueZbkQV7x2mJc3-xrqtNOA/exec';

var DB_READY = SCRIPT_URL !== 'PASTE_URL_APPS_SCRIPT_DISINI';

// ===== KIRIM DATA KE GOOGLE SHEETS =====
function dbPost(action, payload) {
  if (!DB_READY) return Promise.resolve({ success: false, error: 'URL belum diset' });
  
  return fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(Object.assign({ action: action }, payload))
  })
  .then(function(r) { return r.json(); })
  .catch(function(e) { console.warn('DB Error:', e); return { success: false }; });
}

// ===== AMBIL DATA DARI GOOGLE SHEETS =====
function dbGet(action) {
  if (!DB_READY) return Promise.resolve({ success: false, data: [] });
  
  return fetch(SCRIPT_URL + '?action=' + action)
    .then(function(r) { return r.json(); })
    .catch(function(e) { console.warn('DB Error:', e); return { success: false, data: [] }; });
}

// ===== PATCH: Simpan user saat daftar =====
document.addEventListener('DOMContentLoaded', function() {

  // Patch doDaftar
  var _doDaftarDB = doDaftar;
  doDaftar = function() {
    _doDaftarDB();
    // Simpan ke Google Sheets setelah daftar berhasil
    setTimeout(function() {
      if (isLoggedIn && registeredUsers.length > 0) {
        var lastUser = registeredUsers[registeredUsers.length - 1];
        dbPost('saveUser', { user: lastUser }).then(function(res) {
          if (res && res.success) console.log('User tersimpan ke database');
        });
      }
    }, 300);
  };

  // Patch doDaftarPenjual
  if (typeof doDaftarPenjual === 'function') {
    var _doDaftarPenjualDB = doDaftarPenjual;
    doDaftarPenjual = function() {
      _doDaftarPenjualDB();
      setTimeout(function() {
        if (currentSeller) {
          dbPost('saveSeller', { seller: currentSeller }).then(function(res) {
            if (res && res.success) console.log('Seller tersimpan ke database');
          });
        }
      }, 300);
    };
  }

  // Patch confirmCheckout — simpan pesanan
  var _confirmCheckoutDB = confirmCheckout;
  confirmCheckout = function() {
    _confirmCheckoutDB();
    setTimeout(function() {
      if (allOrderHistory.length > 0) {
        var lastOrder = allOrderHistory[0];
        dbPost('saveOrder', { order: lastOrder }).then(function(res) {
          if (res && res.success) console.log('Pesanan tersimpan ke database');
        });
      }
    }, 300);
  };

  // Patch confirmQRIS
  var _confirmQRISDB = confirmQRIS;
  confirmQRIS = function() {
    _confirmQRISDB();
    setTimeout(function() {
      if (allOrderHistory.length > 0) {
        dbPost('saveOrder', { order: allOrderHistory[0] });
      }
    }, 300);
  };

  // ===== LOAD DATA SAAT ADMIN BUKA PANEL =====
  var _openAdminPanelDB = openAdminPanel;
  openAdminPanel = function() {
    if (!isAdmin) { showToast('Akses ditolak!'); return; }
    
    if (DB_READY) {
      showToast('Memuat data dari database...');
      
      // Load users dan orders secara paralel
      Promise.all([
        dbGet('getUsers'),
        dbGet('getOrders'),
        dbGet('getSellers')
      ]).then(function(results) {
        var usersRes   = results[0];
        var ordersRes  = results[1];
        var sellersRes = results[2];

        // Merge users dari database
        if (usersRes.success && usersRes.data) {
          usersRes.data.forEach(function(u) {
            if (!registeredUsers.find(function(x){ return x.email === u.email; })) {
              registeredUsers.push(u);
            }
          });
        }

        // Merge orders dari database
        if (ordersRes.success && ordersRes.data) {
          ordersRes.data.forEach(function(o) {
            if (!allOrderHistory.find(function(x){ return x.waktu === o.waktu && x.pembeli === o.pembeli; })) {
              allOrderHistory.push(o);
            }
          });
        }

        // Merge sellers dari database
        if (sellersRes.success && sellersRes.data) {
          sellersRes.data.forEach(function(s) {
            if (typeof registeredSellers !== 'undefined') {
              if (!registeredSellers.find(function(x){ return x.email === s.email; })) {
                registeredSellers.push(s);
              }
            }
          });
        }

        // Buka panel setelah data dimuat
        _openAdminPanelDB();
        showToast('Data berhasil dimuat dari database');

      }).catch(function() {
        // Jika gagal, tetap buka panel dengan data lokal
        _openAdminPanelDB();
      });

    } else {
      // Tidak ada koneksi DB, pakai data lokal
      _openAdminPanelDB();
    }
  };

});

// ===== INDIKATOR STATUS DATABASE =====
document.addEventListener('DOMContentLoaded', function() {
  if (!DB_READY) {
    console.warn('⚠️ Database belum dikonfigurasi. Ganti SCRIPT_URL di database.js');
  } else {
    console.log('✅ Database terhubung ke Google Sheets');
  }
});
