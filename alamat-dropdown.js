// ===== ALAMAT DROPDOWN — FINAL OVERRIDE =====
// File ini di-load paling terakhir untuk memastikan tidak ada konflik

(function() {
  'use strict';

  function _initDropdown() {
    var selProv = document.getElementById('alamat-provinsi');
    if (!selProv) return;

    if (typeof WILAYAH === 'undefined') {
      console.error('[Alamat] WILAYAH tidak tersedia!');
      return;
    }

    // Isi provinsi
    selProv.innerHTML = '<option value="">— Pilih Provinsi —</option>';
    Object.keys(WILAYAH).sort().forEach(function(prov) {
      var opt = document.createElement('option');
      opt.value = prov;
      opt.textContent = prov;
      selProv.appendChild(opt);
    });

    // Reset kota & kecamatan
    var selKota = document.getElementById('alamat-kota');
    var selKec  = document.getElementById('alamat-kecamatan');
    var inpKP   = document.getElementById('alamat-kodepos');
    if (selKota) { selKota.innerHTML = '<option value="">— Pilih Kota / Kabupaten —</option>'; selKota.disabled = true; }
    if (selKec)  { selKec.innerHTML  = '<option value="">— Pilih Kecamatan —</option>';        selKec.disabled  = true; }
    if (inpKP)   inpKP.value = '';

    console.log('[Alamat] Dropdown provinsi berhasil diisi:', Object.keys(WILAYAH).length, 'provinsi');
  }

  // Expose ke global
  window.initAlamatDropdown = _initDropdown;

  window.onAlamatProvinsiChange = function() {
    var prov    = document.getElementById('alamat-provinsi').value;
    var selKota = document.getElementById('alamat-kota');
    var selKec  = document.getElementById('alamat-kecamatan');
    var inpKP   = document.getElementById('alamat-kodepos');

    selKota.innerHTML = '<option value="">— Pilih Kota / Kabupaten —</option>';
    selKec.innerHTML  = '<option value="">— Pilih Kecamatan —</option>';
    selKota.disabled  = true;
    selKec.disabled   = true;
    if (inpKP) inpKP.value = '';

    if (!prov || !WILAYAH[prov]) return;
    Object.keys(WILAYAH[prov]).sort().forEach(function(kota) {
      var opt = document.createElement('option');
      opt.value = kota; opt.textContent = kota;
      selKota.appendChild(opt);
    });
    selKota.disabled = false;

    // Update ongkir
    if (typeof updateOngkirByProvinsi === 'function') updateOngkirByProvinsi(prov);
  };

  window.onAlamatKotaChange = function() {
    var prov   = document.getElementById('alamat-provinsi').value;
    var kota   = document.getElementById('alamat-kota').value;
    var selKec = document.getElementById('alamat-kecamatan');
    var inpKP  = document.getElementById('alamat-kodepos');

    selKec.innerHTML = '<option value="">— Pilih Kecamatan —</option>';
    selKec.disabled  = true;
    if (inpKP) inpKP.value = '';

    if (!prov || !kota || !WILAYAH[prov] || !WILAYAH[prov][kota]) return;
    Object.keys(WILAYAH[prov][kota]).sort().forEach(function(kec) {
      var opt = document.createElement('option');
      opt.value = kec; opt.textContent = kec;
      selKec.appendChild(opt);
    });
    selKec.disabled = false;
  };

  window.onAlamatKecamatanChange = function() {
    var prov  = document.getElementById('alamat-provinsi').value;
    var kota  = document.getElementById('alamat-kota').value;
    var kec   = document.getElementById('alamat-kecamatan').value;
    var inpKP = document.getElementById('alamat-kodepos');

    if (!prov || !kota || !kec || !inpKP) return;
    if (!WILAYAH[prov] || !WILAYAH[prov][kota] || !WILAYAH[prov][kota][kec]) return;
    var list = WILAYAH[prov][kota][kec];
    if (list && list.length > 0) inpKP.value = list[0];
  };

  window.openModalAlamat = function() {
    _initDropdown();

    // Isi data tersimpan jika ada
    var a = null;
    if (typeof getAlamatUtama === 'function') a = getAlamatUtama();
    if (a && a.jalan) {
      var setV = function(id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
      setV('alamat-jalan',   a.jalan);
      setV('alamat-kodepos', a.kodepos);

      var selProv = document.getElementById('alamat-provinsi');
      if (selProv && a.provinsi) {
        selProv.value = a.provinsi;
        window.onAlamatProvinsiChange();
        setTimeout(function() {
          var selKota = document.getElementById('alamat-kota');
          if (selKota && a.kota) {
            selKota.value = a.kota;
            window.onAlamatKotaChange();
            setTimeout(function() {
              var selKec = document.getElementById('alamat-kecamatan');
              if (selKec && a.kecamatan) {
                selKec.value = a.kecamatan;
                if (a.kodepos) document.getElementById('alamat-kodepos').value = a.kodepos;
              }
            }, 60);
          }
        }, 60);
      }
    }

    var errEl = document.getElementById('alamat-error');
    if (errEl) errEl.style.display = 'none';

    if (typeof closeModal === 'function') closeModal('modal-checkout');
    if (typeof openModal  === 'function') openModal('modal-alamat');
  };

  window.simpanAlamat = function() {
    var get = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var jalan     = get('alamat-jalan');
    var provinsi  = get('alamat-provinsi');
    var kota      = get('alamat-kota');
    var kecamatan = get('alamat-kecamatan');
    var kodepos   = get('alamat-kodepos');
    var errEl     = document.getElementById('alamat-error');

    if (!jalan)     { errEl.textContent = 'Isi nama jalan dan nomor rumah.'; errEl.style.display = 'block'; return; }
    if (!provinsi)  { errEl.textContent = 'Pilih Provinsi.';                 errEl.style.display = 'block'; return; }
    if (!kota)      { errEl.textContent = 'Pilih Kota / Kabupaten.';         errEl.style.display = 'block'; return; }
    if (!kecamatan) { errEl.textContent = 'Pilih Kecamatan.';                errEl.style.display = 'block'; return; }
    if (!kodepos)   { errEl.textContent = 'Isi kode pos.';                   errEl.style.display = 'block'; return; }
    if (!/^\d{5}$/.test(kodepos)) { errEl.textContent = 'Kode pos harus 5 digit angka.'; errEl.style.display = 'block'; return; }

    errEl.style.display = 'none';

    var alamatBaru = { jalan: jalan, kecamatan: kecamatan, kota: kota, provinsi: provinsi, kodepos: kodepos, utama: true, label: 'Rumah' };

    // Simpan ke daftarAlamat
    if (typeof daftarAlamat !== 'undefined') {
      daftarAlamat.forEach(function(a) { a.utama = false; });
      daftarAlamat.unshift(alamatBaru);
    }

    // Simpan ke profil user
    if (typeof registeredUsers !== 'undefined' && typeof currentUser !== 'undefined') {
      var user = registeredUsers.find(function(u) { return u.username === currentUser; });
      if (user) {
        user.alamatLengkap = alamatBaru;
        user.alamat = [jalan, kecamatan, kota, provinsi, kodepos].join(', ');
      }
    }

    if (typeof closeModal === 'function') closeModal('modal-alamat');

    if (typeof checkoutItems !== 'undefined' && checkoutItems && checkoutItems.length > 0) {
      if (typeof updateCoAlamat === 'function') updateCoAlamat();
      if (typeof openModal === 'function') openModal('modal-checkout');
    }

    if (typeof showToast === 'function') showToast('Alamat berhasil disimpan! 📍');
  };

  console.log('[Alamat] alamat-dropdown.js loaded successfully');
})();

// ===== SISTEM MULTI-ALAMAT (max 5) =====

window.openModalAlamat = function() {
  renderAlamatListMulti();
  // Reset form tambah
  var form = document.getElementById('form-alamat-baru');
  if (form) form.style.display = 'none';
  resetFormAlamatBaru();
  if (typeof closeModal === 'function') closeModal('modal-checkout');
  if (typeof openModal  === 'function') openModal('modal-alamat');
};

function renderAlamatListMulti() {
  var list = typeof daftarAlamat !== 'undefined' ? daftarAlamat : [];
  var container = document.getElementById('alamat-list-multi');
  var countLabel = document.getElementById('alamat-count-label');
  if (!container) return;

  if (countLabel) countLabel.textContent = list.length + ' / 5 alamat tersimpan';

  // Tombol tambah — disable jika sudah 5
  var btnTambah = document.getElementById('btn-tambah-alamat-baru');
  if (btnTambah) {
    btnTambah.disabled = list.length >= 5;
    btnTambah.style.opacity = list.length >= 5 ? '0.4' : '1';
    btnTambah.title = list.length >= 5 ? 'Maksimal 5 alamat' : '';
  }

  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#aaa;padding:24px;font-size:13px;">Belum ada alamat tersimpan.<br>Tambahkan alamat pengiriman Anda.</p>';
    return;
  }

  container.innerHTML = list.map(function(a, i) {
    var alamatStr = [a.jalan, a.kecamatan, a.kota, a.provinsi, a.kodepos].filter(Boolean).join(', ');
    return '<div class="alamat-card-multi' + (a.utama ? ' alamat-utama-multi' : '') + '">' +
      '<div class="acm-header">' +
        '<span class="acm-label">' + (a.label || 'Alamat ' + (i+1)) + '</span>' +
        (a.utama ? '<span class="acm-badge-utama">✓ Utama</span>' : '') +
      '</div>' +
      '<div class="acm-body">' + alamatStr + '</div>' +
      '<div class="acm-actions">' +
        '<button class="acm-btn-pilih" onclick="pilihAlamatMulti(' + i + ')">Gunakan</button>' +
        (!a.utama ? '<button class="acm-btn-utama" onclick="setAlamatUtamaMulti(' + i + ')">Jadikan Utama</button>' : '') +
        '<button class="acm-btn-hapus" onclick="hapusAlamatMulti(' + i + ')">Hapus</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

window.pilihAlamatMulti = function(idx) {
  if (typeof daftarAlamat === 'undefined') return;
  // Set sebagai utama
  daftarAlamat.forEach(function(a) { a.utama = false; });
  daftarAlamat[idx].utama = true;
  if (typeof closeModal === 'function') closeModal('modal-alamat');
  if (typeof updateCoAlamat === 'function') updateCoAlamat();
  if (typeof openModal === 'function') openModal('modal-checkout');
  if (typeof showToast === 'function') showToast('Alamat dipilih: ' + (daftarAlamat[idx].label || 'Alamat'));
};

window.setAlamatUtamaMulti = function(idx) {
  if (typeof daftarAlamat === 'undefined') return;
  daftarAlamat.forEach(function(a) { a.utama = false; });
  daftarAlamat[idx].utama = true;
  renderAlamatListMulti();
  if (typeof updateCoAlamat === 'function') updateCoAlamat();
  if (typeof showToast === 'function') showToast('Alamat utama diperbarui!');
};

window.hapusAlamatMulti = function(idx) {
  if (typeof daftarAlamat === 'undefined') return;
  var wasUtama = daftarAlamat[idx].utama;
  daftarAlamat.splice(idx, 1);
  // Jika yang dihapus adalah utama, set yang pertama jadi utama
  if (wasUtama && daftarAlamat.length > 0) daftarAlamat[0].utama = true;
  renderAlamatListMulti();
  if (typeof updateCoAlamat === 'function') updateCoAlamat();
  if (typeof showToast === 'function') showToast('Alamat dihapus.');
};

window.toggleFormAlamatBaru = function() {
  var form = document.getElementById('form-alamat-baru');
  if (!form) return;
  var isOpen = form.style.display !== 'none';
  form.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) resetFormAlamatBaru();
};

function resetFormAlamatBaru() {
  var ids = ['new-label-alamat','new-jalan-alamat','new-kodepos-alamat'];
  ids.forEach(function(id) { var el = document.getElementById(id); if (el) el.value = ''; });
  var selProv = document.getElementById('new-provinsi-alamat');
  var selKota = document.getElementById('new-kota-alamat');
  var selKec  = document.getElementById('new-kecamatan-alamat');
  if (selProv) selProv.value = '';
  if (selKota) { selKota.innerHTML = '<option value="">Pilih Kota / Kabupaten</option>'; selKota.disabled = true; }
  if (selKec)  { selKec.innerHTML  = '<option value="">Pilih Kecamatan</option>';        selKec.disabled  = true; }
  var errEl = document.getElementById('new-alamat-error');
  if (errEl) errEl.style.display = 'none';
}

window.onNewProvinsiAlamat = function() {
  var prov    = document.getElementById('new-provinsi-alamat').value;
  var selKota = document.getElementById('new-kota-alamat');
  var selKec  = document.getElementById('new-kecamatan-alamat');
  var inpKP   = document.getElementById('new-kodepos-alamat');
  selKota.innerHTML = '<option value="">Pilih Kota / Kabupaten</option>';
  selKec.innerHTML  = '<option value="">Pilih Kecamatan</option>';
  selKota.disabled  = true; selKec.disabled = true;
  if (inpKP) inpKP.value = '';
  if (!prov || typeof WILAYAH === 'undefined' || !WILAYAH[prov]) return;
  Object.keys(WILAYAH[prov]).sort().forEach(function(kota) {
    var opt = document.createElement('option');
    opt.value = kota; opt.textContent = kota;
    selKota.appendChild(opt);
  });
  selKota.disabled = false;
};

window.onNewKotaAlamat = function() {
  var prov   = document.getElementById('new-provinsi-alamat').value;
  var kota   = document.getElementById('new-kota-alamat').value;
  var selKec = document.getElementById('new-kecamatan-alamat');
  var inpKP  = document.getElementById('new-kodepos-alamat');
  selKec.innerHTML = '<option value="">Pilih Kecamatan</option>';
  selKec.disabled  = true;
  if (inpKP) inpKP.value = '';
  if (!prov || !kota || typeof WILAYAH === 'undefined' || !WILAYAH[prov] || !WILAYAH[prov][kota]) return;
  Object.keys(WILAYAH[prov][kota]).sort().forEach(function(kec) {
    var opt = document.createElement('option');
    opt.value = kec; opt.textContent = kec;
    selKec.appendChild(opt);
  });
  selKec.disabled = false;
};

window.onNewKecamatanAlamat = function() {
  var prov  = document.getElementById('new-provinsi-alamat').value;
  var kota  = document.getElementById('new-kota-alamat').value;
  var kec   = document.getElementById('new-kecamatan-alamat').value;
  var inpKP = document.getElementById('new-kodepos-alamat');
  if (!prov || !kota || !kec || !inpKP || typeof WILAYAH === 'undefined') return;
  var list = WILAYAH[prov] && WILAYAH[prov][kota] && WILAYAH[prov][kota][kec];
  if (list && list.length > 0) inpKP.value = list[0];
};

window.simpanAlamatBaru = function() {
  var get = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var label     = get('new-label-alamat') || 'Alamat';
  var jalan     = get('new-jalan-alamat');
  var provinsi  = get('new-provinsi-alamat');
  var kota      = get('new-kota-alamat');
  var kecamatan = get('new-kecamatan-alamat');
  var kodepos   = get('new-kodepos-alamat');
  var errEl     = document.getElementById('new-alamat-error');

  if (!jalan)     { errEl.textContent = 'Isi nama jalan.';       errEl.style.display='block'; return; }
  if (!provinsi)  { errEl.textContent = 'Pilih Provinsi.';       errEl.style.display='block'; return; }
  if (!kota)      { errEl.textContent = 'Pilih Kota.';           errEl.style.display='block'; return; }
  if (!kecamatan) { errEl.textContent = 'Pilih Kecamatan.';      errEl.style.display='block'; return; }
  if (!kodepos)   { errEl.textContent = 'Isi kode pos.';         errEl.style.display='block'; return; }
  if (!/^\d{5}$/.test(kodepos)) { errEl.textContent = 'Kode pos harus 5 digit.'; errEl.style.display='block'; return; }

  if (typeof daftarAlamat === 'undefined') window.daftarAlamat = [];
  if (daftarAlamat.length >= 5) {
    errEl.textContent = 'Maksimal 5 alamat. Hapus salah satu terlebih dahulu.';
    errEl.style.display = 'block'; return;
  }

  errEl.style.display = 'none';
  var isFirst = daftarAlamat.length === 0;
  var alamatBaru = { label: label, jalan: jalan, kecamatan: kecamatan, kota: kota, provinsi: provinsi, kodepos: kodepos, utama: isFirst };
  daftarAlamat.push(alamatBaru);

  // Simpan ke profil user
  if (typeof registeredUsers !== 'undefined' && typeof currentUser !== 'undefined') {
    var user = registeredUsers.find(function(u) { return u.username === currentUser; });
    if (user) { user.alamat = [jalan, kecamatan, kota, provinsi, kodepos].join(', '); }
  }

  resetFormAlamatBaru();
  var form = document.getElementById('form-alamat-baru');
  if (form) form.style.display = 'none';
  renderAlamatListMulti();
  if (typeof updateCoAlamat === 'function') updateCoAlamat();
  if (typeof showToast === 'function') showToast('Alamat "' + label + '" berhasil disimpan!');
};
