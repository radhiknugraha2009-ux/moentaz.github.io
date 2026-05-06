// ============================================================
// SISTEM PESANAN GLOBAL
// allOrderHistory tidak pernah direset saat logout
// Admin bisa lihat semua pesanan dari semua user
// ============================================================

var allOrderHistory = [];

// Simpan pesanan baru ke allOrderHistory
function simpanPesananGlobal(pesanan) {
  allOrderHistory.unshift(pesanan);
}

// Ambil pesanan milik user tertentu
function getPesananUser(username) {
  return allOrderHistory.filter(function(o) {
    return o.pembeli === username;
  });
}

// ============================================================
// PANEL ADMIN - TAB PESANAN
// ============================================================

function bukaAdminPesanan() {
  if (!isAdmin) { showToast('Akses ditolak!'); return; }
  openAdminPanel();
  // Tunggu modal terbuka lalu switch ke tab pesanan
  setTimeout(function() {
    var t = document.getElementById('admin-active-tab');
    if (t) t.value = 'pesanan';
    document.querySelectorAll('.admin-tab').forEach(function(el) { el.classList.remove('active'); });
    var btn = document.getElementById('tab-pesanan');
    if (btn) btn.classList.add('active');
    renderTabPesananAdmin();
  }, 50);
}

function renderTabPesananAdmin() {
  var content = document.getElementById('admin-content');
  if (!content) return;

  if (allOrderHistory.length === 0) {
    content.innerHTML =
      '<div style="text-align:center;padding:40px;">' +
        '<div style="font-size:48px;margin-bottom:12px;">&#128230;</div>' +
        '<p style="color:#888;font-size:14px;font-weight:700;">Belum ada pesanan</p>' +
        '<p style="color:#aaa;font-size:12px;margin-top:6px;">Pesanan akan muncul setelah pembeli melakukan checkout</p>' +
      '</div>';
    return;
  }

  var sc = { 'resmi': '#2e7d32', 'penjual': '#ff6f00' };

  content.innerHTML =
    '<div style="font-size:13px;color:#888;margin-bottom:12px;padding:0 4px;">' +
      'Total: <strong>' + allOrderHistory.length + ' pesanan</strong>' +
    '</div>' +
    allOrderHistory.map(function(o, i) {
      var sudahKirim = !!o.fotoKirim;
      var statusColor = sudahKirim ? '#2e7d32' : '#ff6f00';
      var statusLabel = sudahKirim ? '&#10003; Sudah Dikonfirmasi' : '&#128260; Belum Dikonfirmasi';
      var sumberColor = o.sumberProduk === 'penjual' ? '#ff6f00' : '#2e7d32';
      var sumberLabel = o.sumberProduk === 'penjual' ? '&#127978; Produk Penjual' : '&#10003; Produk Resmi';

      var html = '<div class="admin-user-card" style="margin-bottom:12px;">';

      // Header
      html += '<div class="admin-user-header">';
      html += '<span class="admin-user-avatar" style="background:#5b4fcf;font-size:16px;">&#128230;</span>';
      html += '<div style="flex:1;">';
      html += '<strong style="font-size:13px;">' + (o.barang || '-') + '</strong>';
      html += '<div style="font-size:11px;color:#888;margin-top:2px;">Pembeli: <strong>' + (o.pembeli || 'Anonim') + '</strong> &bull; ' + (o.waktu || '-') + '</div>';
      html += '</div>';
      html += '<span style="font-size:11px;font-weight:700;color:' + statusColor + ';white-space:nowrap;">' + statusLabel + '</span>';
      html += '</div>';

      // Detail
      html += '<div class="admin-user-detail">';
      html += '<div><span style="background:' + sumberColor + '20;color:' + sumberColor + ';font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700;">' + sumberLabel + '</span></div>';
      html += '<div>&#128179; ' + (o.total || '-') + ' &bull; ' + (o.pembayaran || '-') + '</div>';
      html += '<div>&#128666; ' + (o.pengiriman || '-') + '</div>';
      html += '</div>';

      // Foto bukti kirim jika sudah ada
      if (sudahKirim) {
        html += '<div style="padding:10px 14px;">';
        html += '<div style="font-size:12px;font-weight:700;color:#5b4fcf;margin-bottom:6px;">&#128247; Foto Bukti Pengiriman</div>';
        if (o.noresiKirim) html += '<div style="font-size:12px;color:#555;margin-bottom:6px;">No. Resi: <strong>' + o.noresiKirim + '</strong></div>';
        html += '<img src="' + o.fotoKirim + '" style="width:100%;max-height:180px;object-fit:cover;border-radius:8px;" alt="Bukti kirim"/>';
        if (o.waktuKirim) html += '<div style="font-size:11px;color:#aaa;margin-top:4px;">Dikonfirmasi: ' + o.waktuKirim + '</div>';
        html += '</div>';
      }

      // Tombol aksi berdasarkan sumber produk
      if (!sudahKirim) {
        if (o.sumberProduk === 'penjual') {
          // Produk penjual — admin HANYA LIHAT, tidak bisa konfirmasi
          html += '<div style="padding:0 14px 12px;">';
          html += '<div style="background:#fff3e0;border-radius:8px;padding:10px 12px;font-size:12px;color:#ff6f00;">';
          html += '&#9432; Produk dari penjual. Konfirmasi pengiriman dilakukan oleh <strong>penjual</strong>. Admin hanya dapat memantau status.';
          html += '</div>';
          html += '</div>';
        } else {
          // Produk resmi website — admin bisa konfirmasi
          html += '<div style="padding:0 14px 12px;">';
          html += '<button class="seller-btn-primary" style="width:100%;background:#5b4fcf;padding:11px;" ';
          html += 'onclick="bukaKonfirmasiAdmin(' + i + ')">&#128247; Konfirmasi Pengiriman + Upload Foto</button>';
          html += '</div>';
        }
      } else if (o.sumberProduk === 'penjual') {
        // Produk penjual sudah dikonfirmasi — tampilkan info saja
        html += '<div style="padding:0 14px 12px;">';
        html += '<div style="background:#e8f5e9;border-radius:8px;padding:8px 12px;font-size:12px;color:#2e7d32;">&#10003; Dikonfirmasi oleh penjual</div>';
        html += '</div>';
      }

      html += '</div>';
      return html;
    }).join('');
}

// Buka modal konfirmasi dari panel admin
function bukaKonfirmasiAdmin(idx) {
  var o = allOrderHistory[idx];
  if (!o) return;

  // Set data ke modal konfirmasi
  document.getElementById('konfirm-pesanan-idx').value = idx;
  document.getElementById('konfirm-role').value = 'admin_global';
  document.getElementById('konfirm-foto-data').value = '';
  document.getElementById('konfirm-foto-preview').style.display = 'none';
  document.getElementById('konfirm-foto-placeholder').style.display = 'block';
  document.getElementById('konfirm-noresi').value = '';
  var info = document.getElementById('konfirm-info');
  if (info) info.style.display = 'none';

  // Set callback setelah submit
  window._afterKonfirmCallback = function() {
    closeModal('modal-konfirm-kirim');
    // Refresh tab pesanan
    renderTabPesananAdmin();
    showToast('Konfirmasi berhasil! Pembeli dapat melihat di Lacak Pesanan.');
  };

  openModal('modal-konfirm-kirim');
}

// Override submitKonfirmasiKirim untuk handle admin_global
var _submitKonfirmasiBase2 = submitKonfirmasiKirim;
submitKonfirmasiKirim = function() {
  var foto   = document.getElementById('konfirm-foto-data').value;
  var noresi = document.getElementById('konfirm-noresi').value.trim();
  var idx    = parseInt(document.getElementById('konfirm-pesanan-idx').value);
  var role   = document.getElementById('konfirm-role').value;

  if (!foto) { showToast('Foto paket wajib diupload!'); return; }
  var waktu = new Date().toLocaleString('id-ID');

  if (role === 'admin_global') {
    // Update di allOrderHistory
    if (allOrderHistory[idx]) {
      allOrderHistory[idx].fotoKirim   = foto;
      allOrderHistory[idx].noresiKirim = noresi;
      allOrderHistory[idx].waktuKirim  = waktu;
    }
    if (window._afterKonfirmCallback) {
      window._afterKonfirmCallback();
      window._afterKonfirmCallback = null;
    }

  } else if (role === 'admin') {
    // Update orderHistory lokal
    if (orderHistory[idx]) {
      orderHistory[idx].fotoKirim   = foto;
      orderHistory[idx].noresiKirim = noresi;
      orderHistory[idx].waktuKirim  = waktu;
    }
    // Update allOrderHistory juga jika ada
    var match = allOrderHistory.find(function(o) {
      return o.pembeli === (orderHistory[idx] && orderHistory[idx].pembeli);
    });
    if (match) { match.fotoKirim = foto; match.noresiKirim = noresi; match.waktuKirim = waktu; }
    showToast('Konfirmasi pengiriman berhasil!');
    if (window._afterKonfirmCallback) { window._afterKonfirmCallback(); window._afterKonfirmCallback = null; }
    else { closeModal('modal-konfirm-kirim'); }

  } else {
    // Penjual
    var pesananInfo = currentSeller ? (currentSeller.pesananMasuk[idx] || {}) : {};
    var notif = {
      pesananIdx: idx, role: role, foto: foto, noresi: noresi, waktu: waktu,
      sudahDiteruskan: false,
      namaBarang: pesananInfo.produk || '-',
      namaPembeli: pesananInfo.pembeli || '-',
      namaToko: currentSeller ? currentSeller.namaToko : '-'
    };
    notifPengirimanAdmin.push(notif);
    adminNotifications.push({ type: 'konfirm_kirim', data: notif, read: false });
    updateAdminNotifBadge();
    if (currentSeller && currentSeller.pesananMasuk[idx]) {
      currentSeller.pesananMasuk[idx].status = 'Dikirim';
      currentSeller.pesananMasuk[idx].fotoKirim = foto;
    }
    showToast('Konfirmasi dikirim ke Admin. Admin akan meneruskan ke pembeli.');
    closeModal('modal-konfirm-kirim');
    if (currentSeller) showSellerTab('pesanan');
  }
};

// ============================================================
// PATCH: simpan ke allOrderHistory saat checkout
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  // Patch openCheckout
  if (typeof openCheckout === 'function') {
    var _oc = openCheckout;
    openCheckout = function(items) {
      window._lastCheckoutItems = items;
      _oc(items);
    };
  }
});

// ============================================================
// PATCH: openAdminPanel pakai tab pesanan
// ============================================================
var _origOpenAdminPanelGlobal = null;
document.addEventListener('DOMContentLoaded', function() {
  _origOpenAdminPanelGlobal = openAdminPanel;
  openAdminPanel = function() {
    if (!isAdmin) { showToast('Akses ditolak!'); return; }
    var unread = adminNotifications.filter(function(n) { return !n.read; }).length;
    var badge = document.getElementById('admin-notif-badge');
    if (badge) badge.textContent = unread > 0 ? unread : '';

    // Default ke tab pesanan jika ada data, users jika tidak
    var defaultTab = allOrderHistory.length > 0 ? 'pesanan' : 'users';
    var t = document.getElementById('admin-active-tab');
    if (t) t.value = defaultTab;
    document.querySelectorAll('.admin-tab').forEach(function(el) { el.classList.remove('active'); });
    var btn = document.getElementById('tab-' + defaultTab);
    if (btn) btn.classList.add('active');

    if (defaultTab === 'pesanan') {
      renderTabPesananAdmin();
    } else {
      renderAdminTab('users');
    }
    openModal('modal-admin');
  };

  // Patch switchAdminTab untuk tab pesanan
  var _origSwitch = switchAdminTab;
  switchAdminTab = function(tab) {
    var t = document.getElementById('admin-active-tab');
    if (t) t.value = tab;
    document.querySelectorAll('.admin-tab').forEach(function(el) { el.classList.remove('active'); });
    var btn = document.getElementById('tab-' + tab);
    if (btn) btn.classList.add('active');
    if (tab === 'pesanan') {
      renderTabPesananAdmin();
    } else {
      renderAdminTab(tab);
    }
  };
});

// ============================================================
// PATCH: openLacakPesanan pakai allOrderHistory
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  var _origLacak = openLacakPesanan;
  openLacakPesanan = function() {
    if (!requireLogin()) return;
    var container = document.getElementById('lacak-content');

    // Ambil pesanan milik user ini dari allOrderHistory
    var myOrders = getPesananUser(currentUser);
    if (myOrders.length === 0) myOrders = orderHistory; // fallback

    if (myOrders.length === 0) {
      container.innerHTML =
        '<div class="lacak-empty">' +
          '<div style="font-size:48px;margin-bottom:12px;">&#128230;</div>' +
          '<p style="color:#888;font-size:14px;">Belum ada pesanan</p>' +
        '</div>';
    } else {
      container.innerHTML = myOrders.map(function(o, i) {
        var done = o.fotoPenerimaan;
        var sudahKirim = !!o.fotoKirim;
        var statusLabel = done ? '&#10003; Selesai' : sudahKirim ? '&#128666; Dikirim' : '&#128260; Diproses';
        var statusClass = done ? 'status-selesai' : '';

        var html = '<div class="lacak-item">';
        html += '<div class="lacak-item-header"><strong>Pesanan #' + String(i+1).padStart(3,'0') + '</strong><span class="lacak-status ' + statusClass + '">' + statusLabel + '</span></div>';
        html += '<div class="lacak-item-body">';
        html += '<p><strong>' + (o.barang||'-') + '</strong></p>';
        html += '<p>' + (o.pembayaran||'-') + ' | ' + (o.pengiriman||'-') + '</p>';
        html += '<p>Total: <strong style="color:#ff6f00;">' + (o.total||'-') + '</strong></p>';
        html += '<p style="font-size:12px;color:#888;">' + (o.waktu||'-') + '</p>';
        html += '</div>';

        // Timeline
        html += '<div class="lacak-timeline">';
        html += '<div class="lacak-step done">&#10003; Pesanan Dikonfirmasi</div>';
        html += '<div class="lacak-step done">&#10003; Pesanan Sedang Diproses</div>';
        html += '<div class="lacak-step ' + (sudahKirim||done ? 'done' : 'pending') + '">&#128666; Dalam Pengiriman</div>';
        html += '<div class="lacak-step ' + (done ? 'done' : 'pending') + '">&#127968; Diterima</div>';
        html += '</div>';

        // Bukti kirim dari admin
        if (sudahKirim) {
          html += '<div class="lacak-foto-wrap">';
          html += '<div class="lacak-foto-label">&#128666; Bukti Pengiriman ke Ekspedisi</div>';
          if (o.noresiKirim) html += '<div style="font-size:12px;color:#5b4fcf;font-weight:700;margin-bottom:6px;">No. Resi: ' + o.noresiKirim + '</div>';
          html += '<img src="' + o.fotoKirim + '" class="lacak-foto-preview" alt="Bukti kirim"/>';
          if (o.waktuKirim) html += '<div style="font-size:11px;color:#aaa;margin-top:4px;">Dikirim: ' + o.waktuKirim + '</div>';
          html += '</div>';
        }

        // Upload foto penerimaan
        if (done) {
          html += '<div class="lacak-foto-wrap"><div class="lacak-foto-label">&#128247; Foto Penerimaan Barang</div><img src="' + done + '" class="lacak-foto-preview" alt="Foto penerimaan"/></div>';
        } else {
          html += '<div class="lacak-terima-wrap"><label class="btn-upload-foto" for="foto-lacak-' + i + '">&#128247; Upload Foto Penerimaan</label><input type="file" id="foto-lacak-' + i + '" accept="image/*" style="display:none;" onchange="uploadFotoTerima(this,' + i + ')"/><p style="font-size:11px;color:#aaa;margin-top:4px;">Upload foto saat barang diterima</p></div>';
        }

        html += '</div>';
        return html;
      }).join('');
    }
    openModal('modal-lacak');
  };
});

function uploadFotoTerima(input, idx) {
  var file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('File harus berupa gambar!'); return; }
  if (file.size > 5*1024*1024) { showToast('Ukuran foto maksimal 5MB'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    var myOrders = getPesananUser(currentUser);
    if (myOrders.length === 0) myOrders = orderHistory;
    if (myOrders[idx]) myOrders[idx].fotoPenerimaan = e.target.result;
    showToast('Foto penerimaan berhasil diupload!');
    openLacakPesanan();
  };
  reader.readAsDataURL(file);
}
