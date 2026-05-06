// ============================================================
// FITUR BARU: Ongkir Dinamis, Konfirmasi Kirim, Top Up MPP
// ============================================================

// ===== 1. ONGKIR DINAMIS =====
var selectedOngkir = 0;
var hargaBarangCheckout = 0;

function selectPengiriman(el) {
  document.querySelectorAll('.co-group[data-group="pengiriman"] .co-option').forEach(function(o){o.classList.remove('selected');});
  el.classList.add('selected');
  selectedOngkir = parseInt(el.dataset.ongkir) || 0;
  updateTotalCheckout();
}

function updateTotalCheckout() {
  var summary=document.getElementById('co-ongkir-summary');
  var elB=document.getElementById('co-harga-barang');
  var elO=document.getElementById('co-harga-ongkir');
  var elF=document.getElementById('co-total-final');
  var elT=document.getElementById('co-total');
  if(!summary) return;
  var tot=hargaBarangCheckout+selectedOngkir;
  summary.style.display='block';
  if(elB) elB.textContent='Rp'+hargaBarangCheckout.toLocaleString('id-ID');
  if(elO) elO.textContent='+Rp'+selectedOngkir.toLocaleString('id-ID');
  if(elF) elF.textContent='Rp'+tot.toLocaleString('id-ID');
  if(elT) elT.textContent='Rp'+tot.toLocaleString('id-ID');
}

var _openCheckoutOrig=openCheckout;
openCheckout=function(items){
  hargaBarangCheckout=items.reduce(function(s,i){return s+i.price*i.qty;},0);
  selectedOngkir=0;
  _openCheckoutOrig(items);
  var s=document.getElementById('co-ongkir-summary');
  if(s) s.style.display='none';
};

var _confirmCheckoutOrig=confirmCheckout;
confirmCheckout=function(){
  var pEl=document.querySelector('.co-group[data-group="pengiriman"] .co-option.selected');
  if(!pEl){var e=document.getElementById('co-error');if(e){e.textContent='Pilih metode pengiriman terlebih dahulu.';e.style.display='block';}return;}
  _confirmCheckoutOrig();
};

// ===== 2. KONFIRMASI PENGIRIMAN =====
var notifPengirimanAdmin=[];
var notifPengirimanPembeli={};

function bukaKonfirmasiKirim(pesananIdx,role){
  document.getElementById('konfirm-pesanan-idx').value=pesananIdx;
  document.getElementById('konfirm-role').value=role;
  document.getElementById('konfirm-foto-data').value='';
  document.getElementById('konfirm-foto-preview').style.display='none';
  document.getElementById('konfirm-foto-placeholder').style.display='block';
  document.getElementById('konfirm-noresi').value='';
  var info=document.getElementById('konfirm-info');
  if(info) info.style.display=role==='penjual'?'block':'none';
  window._afterKonfirmCallback=null;
  openModal('modal-konfirm-kirim');
}

function adminKonfirmasiDariPanel(pesananIdx, sumber){
  bukaKonfirmasiKirim(pesananIdx,'admin');
  window._afterKonfirmCallback=function(){
    // Update objek pesanan yang benar
    var targetArr = (sumber === 'allOrderHistory' && typeof allOrderHistory !== 'undefined') ? allOrderHistory : orderHistory;
    var foto = document.getElementById('konfirm-foto-data').value;
    var noresi = document.getElementById('konfirm-noresi').value.trim();
    var waktu = new Date().toLocaleString('id-ID');
    if(targetArr[pesananIdx]){
      targetArr[pesananIdx].fotoKirim = foto;
      targetArr[pesananIdx].noresiKirim = noresi;
      targetArr[pesananIdx].waktuKirim = waktu;
    }
    closeModal('modal-konfirm-kirim');
    openAdminPanel();
    doSwitchAdminTab('pesanan');
  };
}

function bukaKonfirmasiKirimDariPenjual(pesananSellerIdx){
  bukaKonfirmasiKirim(pesananSellerIdx,'penjual');
}

function previewKonfirmFoto(input){
  var file=input.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/')){showToast('File harus berupa gambar!');return;}
  if(file.size>5*1024*1024){showToast('Foto maksimal 5MB');return;}
  var reader=new FileReader();
  reader.onload=function(e){
    document.getElementById('konfirm-foto-data').value=e.target.result;
    var prev=document.getElementById('konfirm-foto-preview');
    prev.src=e.target.result; prev.style.display='block';
    document.getElementById('konfirm-foto-placeholder').style.display='none';
  };
  reader.readAsDataURL(file);
}

function submitKonfirmasiKirim(){
  var foto=document.getElementById('konfirm-foto-data').value;
  var noresi=document.getElementById('konfirm-noresi').value.trim();
  var idx=parseInt(document.getElementById('konfirm-pesanan-idx').value);
  var role=document.getElementById('konfirm-role').value;
  if(!foto){showToast('Foto paket wajib diupload!');return;}
  var waktu=new Date().toLocaleString('id-ID');

  if(role==='admin'){
    // Update dilakukan via _afterKonfirmCallback jika dari panel
    // Jika dari lacak pesanan langsung, update orderHistory
    if(!window._afterKonfirmCallback){
      if(orderHistory[idx]){
        orderHistory[idx].fotoKirim=foto;
        orderHistory[idx].noresiKirim=noresi;
        orderHistory[idx].waktuKirim=waktu;
      }
      // Update allOrderHistory juga
      if(typeof allOrderHistory !== 'undefined' && allOrderHistory[idx]){
        allOrderHistory[idx].fotoKirim=foto;
        allOrderHistory[idx].noresiKirim=noresi;
        allOrderHistory[idx].waktuKirim=waktu;
      }
    }
    showToast('Konfirmasi pengiriman berhasil! Pembeli dapat melihat di Lacak Pesanan.');
    if(window._afterKonfirmCallback){window._afterKonfirmCallback();window._afterKonfirmCallback=null;}
    else{closeModal('modal-konfirm-kirim');}
  } else {
    var pesananInfo=currentSeller?(currentSeller.pesananMasuk[idx]||{}):{};
    var notif={pesananIdx:idx,role:role,foto:foto,noresi:noresi,waktu:waktu,sudahDiteruskan:false,namaBarang:pesananInfo.produk||'-',namaPembeli:pesananInfo.pembeli||'-',namaToko:currentSeller?currentSeller.namaToko:'-'};
    notifPengirimanAdmin.push(notif);
    adminNotifications.push({type:'konfirm_kirim',data:notif,read:false});
    updateAdminNotifBadge();
    if(currentSeller&&currentSeller.pesananMasuk[idx]){currentSeller.pesananMasuk[idx].status='Dikirim';currentSeller.pesananMasuk[idx].fotoKirim=foto;currentSeller.pesananMasuk[idx].noresiKirim=noresi;}
    showToast('Konfirmasi dikirim ke Admin. Admin akan meneruskan ke pembeli.');
    closeModal('modal-konfirm-kirim');
    if(currentSeller) showSellerTab('pesanan');
  }
}

function adminTeruskankonfirmasiKirim(idx){
  var notif=notifPengirimanAdmin[idx];
  if(!notif) return;
  notif.sudahDiteruskan=true;
  if(orderHistory[notif.pesananIdx]){orderHistory[notif.pesananIdx].fotoKirim=notif.foto;orderHistory[notif.pesananIdx].noresiKirim=notif.noresi;orderHistory[notif.pesananIdx].waktuKirim=notif.waktu;}
  showToast('Konfirmasi berhasil diteruskan ke pembeli!');
  doSwitchAdminTab('pesanan');
}

// ===== PANEL ADMIN - SATU FUNGSI BERSIH =====
function doSwitchAdminTab(tab) {
  var t=document.getElementById('admin-active-tab');
  if(t) t.value=tab;
  document.querySelectorAll('.admin-tab').forEach(function(el){el.classList.remove('active');});
  var btn=document.getElementById('tab-'+tab);
  if(btn) btn.classList.add('active');
  doRenderAdminTab(tab);
}

function doRenderAdminTab(tab) {
  var content=document.getElementById('admin-content');
  if(!content) return;

  if(tab==='users') {
    if(registeredUsers.length===0){content.innerHTML='<div class="admin-empty">Belum ada pengguna yang mendaftar</div>';return;}
    content.innerHTML=registeredUsers.map(function(u,i){
      return '<div class="admin-user-card"><div class="admin-user-header"><span class="admin-user-avatar">'+u.username.charAt(0).toUpperCase()+'</span><div><strong>'+u.username+'</strong><div style="font-size:11px;color:#888;">Daftar: '+u.terdaftar+'</div></div><span class="admin-user-num">#'+String(i+1).padStart(3,'0')+'</span></div><div class="admin-user-detail"><div>Email: '+u.email+'</div><div>Telpon: '+u.telpon+'</div><div>Alamat: '+u.alamat+'</div></div></div>';
    }).join('');

  } else if(tab==='pesanan') {
    var semuaPesanan=[];
    // Pakai allOrderHistory agar pesanan dari semua user terlihat
    var sumberData = (typeof allOrderHistory !== 'undefined' && allOrderHistory.length > 0) ? allOrderHistory : orderHistory;
    sumberData.forEach(function(o,i){
      semuaPesanan.push({
        idx:i, sumber_arr:'allOrderHistory',
        barang:o.barang, pembeli:o.pembeli||'Pembeli',
        total:o.total, pembayaran:o.pembayaran, pengiriman:o.pengiriman,
        waktu:o.waktu, sumber:o.sumberProduk||'resmi',
        sudahKirim:!!o.fotoKirim, fotoKirim:o.fotoKirim||null,
        noresiKirim:o.noresiKirim||null, waktuKirim:o.waktuKirim||null
      });
    });
    notifPengirimanAdmin.forEach(function(n,i){
      if(!n.sudahDiteruskan){
        semuaPesanan.push({isNotifPenjual:true,notifIdx:i,barang:n.namaBarang||'-',pembeli:n.namaPembeli||'-',toko:n.namaToko||'-',waktu:n.waktu,sumber:'penjual',sudahKirim:false,fotoKirim:n.foto,noresiKirim:n.noresi});
      }
    });
    if(semuaPesanan.length===0){
      content.innerHTML='<div class="admin-empty" style="padding:30px;text-align:center;">' +
        '<div style="font-size:40px;margin-bottom:12px;">&#128230;</div>' +
        '<p style="color:#888;font-size:14px;">Belum ada pesanan masuk.</p>' +
        '<p style="color:#aaa;font-size:12px;margin-top:8px;">Pesanan akan muncul di sini setelah pembeli melakukan checkout.</p>' +
        '</div>';
      return;
    }
    content.innerHTML='<div style="font-size:13px;color:#888;margin-bottom:12px;">Total: <strong>'+semuaPesanan.length+' pesanan</strong></div>'+
    semuaPesanan.map(function(p){
      var statusColor=p.sudahKirim?'#2e7d32':'#ff6f00';
      var statusLabel=p.sudahKirim?'&#10003; Sudah Dikonfirmasi':'&#128260; Belum Dikonfirmasi';
      var sumberBadge=p.sumber==='penjual'?'<span style="background:#fff3e0;color:#ff6f00;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700;">&#127978; Penjual: '+(p.toko||'-')+'</span>':'<span style="background:#e8f5e9;color:#2e7d32;font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700;">&#10003; Produk Resmi</span>';
      var html='<div class="admin-user-card" style="margin-bottom:12px;">';
      html+='<div class="admin-user-header"><span class="admin-user-avatar" style="background:#5b4fcf;">&#128230;</span><div style="flex:1;"><strong>'+p.barang+'</strong><div style="font-size:11px;color:#888;margin-top:2px;">Pembeli: '+p.pembeli+' | '+(p.waktu||'-')+'</div></div><span style="font-size:11px;font-weight:700;color:'+statusColor+';">'+statusLabel+'</span></div>';
      html+='<div class="admin-user-detail"><div>'+sumberBadge+'</div><div><span>&#128179;</span> '+(p.total||'-')+' | '+(p.pembayaran||'-')+'</div><div><span>&#128666;</span> '+(p.pengiriman||'-')+'</div></div>';
      if(p.fotoKirim){
        html+='<div style="padding:10px 14px;"><div style="font-size:12px;font-weight:700;color:#5b4fcf;margin-bottom:6px;">&#128247; Foto Bukti Pengiriman</div>';
        if(p.noresiKirim) html+='<div style="font-size:12px;color:#555;margin-bottom:4px;">No. Resi: <strong>'+p.noresiKirim+'</strong></div>';
        html+='<img src="'+p.fotoKirim+'" style="width:100%;max-height:160px;object-fit:cover;border-radius:8px;" alt="Bukti kirim"/>';
        if(p.waktuKirim) html+='<div style="font-size:11px;color:#aaa;margin-top:4px;">Dikonfirmasi: '+p.waktuKirim+'</div>';
        html+='</div>';
      }
      if(!p.sudahKirim){
        if(p.isNotifPenjual){
          html+='<div style="padding:0 14px 12px;"><div style="font-size:12px;color:#ff6f00;background:#fff3e0;padding:8px;border-radius:6px;margin-bottom:8px;">&#9888; Penjual sudah upload foto. Teruskan ke pembeli?</div><button class="seller-btn-primary" style="width:100%;" onclick="adminTeruskankonfirmasiKirim('+p.notifIdx+')">&#128666; Teruskan Konfirmasi ke Pembeli</button></div>';
        } else {
          html+='<div style="padding:0 14px 12px;"><button class="seller-btn-primary" style="width:100%;background:#5b4fcf;" onclick="adminKonfirmasiDariPanel('+p.idx+',\''+p.sumber_arr+'\')">&#128247; Konfirmasi + Upload Foto Pengiriman</button></div>';
        }
      }
      html+='</div>';
      return html;
    }).join('');

  } else if(tab==='chat') {
    adminNotifications.filter(function(n){return n.type==='chat';}).forEach(function(n){n.read=true;});
    updateAdminNotifBadge();
    var users=[...new Set(allChatMessages.map(function(m){return m.from;}))];
    if(users.length===0){content.innerHTML='<div class="admin-empty">Belum ada pesan masuk</div>';return;}
    content.innerHTML=users.map(function(u){
      var msgs=allChatMessages.filter(function(m){return m.from===u;});
      var last=msgs[msgs.length-1];
      var unread=msgs.filter(function(m){return !m.read;}).length;
      return '<div class="admin-chat-item"><div class="admin-chat-from"><span class="admin-user-avatar" style="width:28px;height:28px;font-size:12px;">'+u.charAt(0).toUpperCase()+'</span><div style="flex:1;"><strong>'+u+'</strong><div style="font-size:11px;color:#555;margin-top:2px;">'+last.text.substring(0,40)+(last.text.length>40?'...':'')+'</div></div>'+(unread>0?'<span style="background:#e53935;color:white;font-size:10px;padding:2px 7px;border-radius:10px;">'+unread+' baru</span>':'')+'<span style="font-size:11px;color:#aaa;">'+last.waktu+'</span></div><div style="padding:8px 14px;background:white;"><button class="admin-reply-btn" onclick="openChatPelanggan(\''+u+'\')">Balas</button></div></div>';
    }).join('');

  } else if(tab==='notif') {
    adminNotifications.filter(function(n){return n.type!=='chat';}).forEach(function(n){n.read=true;});
    updateAdminNotifBadge();
    var nc=adminNotifications.filter(function(n){return n.type!=='chat';});
    if(nc.length===0){content.innerHTML='<div class="admin-empty">Belum ada notifikasi</div>';return;}
    content.innerHTML=nc.slice().reverse().map(function(n){
      if(n.type==='konfirm_kirim'){
        var d=n.data;
        var aIdx=notifPengirimanAdmin.indexOf(d);
        return '<div class="admin-notif-item" style="flex-direction:column;align-items:flex-start;gap:8px;"><div style="display:flex;gap:8px;align-items:center;"><span style="font-size:20px;">&#128666;</span><div><strong>Konfirmasi Kirim dari Penjual</strong><div style="font-size:12px;color:#555;">'+d.namaBarang+' | Pembeli: '+d.namaPembeli+'</div><div style="font-size:11px;color:#aaa;">'+d.waktu+'</div></div></div><img src="'+d.foto+'" style="width:100%;border-radius:8px;" alt="Foto paket"/>'+(d.noresi?'<div style="font-size:12px;color:#5b4fcf;">No. Resi: <strong>'+d.noresi+'</strong></div>':'')+(d.sudahDiteruskan?'<span style="color:#2e7d32;font-size:12px;font-weight:700;">&#10003; Sudah diteruskan ke pembeli</span>':'<button class="seller-btn-primary" style="width:100%;" onclick="adminTeruskankonfirmasiKirim('+aIdx+')">&#128666; Teruskan ke Pembeli</button>')+'</div>';
      }
      if(!n.data||!n.data.username) return '';
      return '<div class="admin-notif-item"><span style="font-size:20px;">&#128226;</span><div><strong>Pengguna baru mendaftar</strong><div style="font-size:12px;color:#555;">'+n.data.username+' - '+n.data.email+'</div><div style="font-size:11px;color:#aaa;">'+n.data.terdaftar+'</div></div></div>';
    }).join('');
  }
}

// Override fungsi lama agar pakai yang baru
renderAdminTab = doRenderAdminTab;
switchAdminTab = doSwitchAdminTab;

// Patch openAdminPanel agar pakai fungsi baru
var _origOpenAdminPanel = openAdminPanel;
openAdminPanel = function() {
  if (!isAdmin) { showToast('Akses ditolak!'); return; }
  // Update badge notif
  var unread = adminNotifications.filter(function(n){ return !n.read; }).length;
  var badge = document.getElementById('admin-notif-badge');
  if (badge) badge.textContent = unread > 0 ? unread : '';
  // Set tab default ke pesanan jika ada pesanan, users jika tidak
  var defaultTab = orderHistory.length > 0 ? 'pesanan' : 'users';
  var t = document.getElementById('admin-active-tab');
  if (t) t.value = defaultTab;
  document.querySelectorAll('.admin-tab').forEach(function(el){ el.classList.remove('active'); });
  var btn = document.getElementById('tab-' + defaultTab);
  if (btn) btn.classList.add('active');
  doRenderAdminTab(defaultTab);
  openModal('modal-admin');
};

// ===== 3. TOP UP MPP =====
var selectedMinimarket='';
function openTopupMPP(){if(!requireLogin())return;switchTopupTab('minimarket');openModal('modal-topup-mpp');}
function switchTopupTab(tab){var mm=document.getElementById('topup-section-minimarket');var ag=document.getElementById('topup-section-agen');var tm=document.getElementById('ttab-minimarket');var ta=document.getElementById('ttab-agen');if(mm)mm.style.display=tab==='minimarket'?'block':'none';if(ag)ag.style.display=tab==='agen'?'block':'none';if(tm)tm.classList.toggle('active',tab==='minimarket');if(ta)ta.classList.toggle('active',tab==='agen');if(tab==='agen')renderAgenMPP();}
function pilihTopupMinimarket(nama){selectedMinimarket=nama;var f=document.getElementById('topup-minimarket-form');var k=document.getElementById('topup-kode-result');if(f)f.style.display='block';if(k)k.style.display='none';var instruksi={'Indomaret':'1. Datang ke kasir Indomaret terdekat\n2. Beritahu kasir: "Top Up MoentazProVisionPay"\n3. Tunjukkan kode bayar di bawah\n4. Bayar sesuai nominal\n5. Saldo masuk dalam 5 menit','Alfamart':'1. Datang ke kasir Alfamart terdekat\n2. Beritahu kasir: "Top Up MoentazProVisionPay"\n3. Tunjukkan kode bayar di bawah\n4. Bayar sesuai nominal\n5. Saldo masuk dalam 5 menit'};var el=document.getElementById('topup-instruksi-text');if(el)el.innerHTML='<strong>Cara Top Up via '+nama+':</strong><br>'+(instruksi[nama]||'').replace(/\n/g,'<br>');}
function prosesTopupMinimarket(){var nominal=parseInt(document.getElementById('topup-mm-nominal').value);if(!nominal||nominal<20000){showToast('Minimal top up Rp20.000');return;}if(nominal>5000000){showToast('Maksimal top up Rp5.000.000');return;}var kode='MPP'+Date.now().toString().slice(-8);var noAkun=currentUser.replace(/\s/g,'').toUpperCase()+'001';var el=document.getElementById('topup-kode-result');if(!el)return;el.style.display='block';el.innerHTML='<div style="text-align:center;padding:16px;background:#f3f0ff;border-radius:10px;"><div style="font-size:12px;color:#888;margin-bottom:4px;">Kode Bayar '+selectedMinimarket+'</div><div style="font-size:28px;font-weight:900;color:#5b4fcf;letter-spacing:4px;">'+kode+'</div><div style="font-size:13px;color:#555;margin:8px 0;">No. Akun: <strong>'+noAkun+'</strong></div><div style="font-size:20px;font-weight:900;color:#ff6f00;">Rp'+nominal.toLocaleString('id-ID')+'</div><div style="font-size:11px;color:#aaa;margin-top:6px;">Berlaku 2 jam &bull; Tunjukkan ke kasir '+selectedMinimarket+'</div></div><button class="cpay-btn" style="margin-top:12px;background:#2e7d32;" onclick="simulasiTopupBerhasil('+nominal+')">&#10003; Simulasi Pembayaran Berhasil</button>';}
function simulasiTopupBerhasil(nominal){cctvPaySaldo+=nominal;if(!cctvPayRiwayat)cctvPayRiwayat=[];cctvPayRiwayat.unshift({type:'masuk',keterangan:'Top Up via '+selectedMinimarket,nominal:nominal,tgl:new Date().toLocaleString('id-ID')});updateCPayDisplay();closeModal('modal-topup-mpp');showToast('Top Up Rp'+nominal.toLocaleString('id-ID')+' via '+selectedMinimarket+' berhasil!');}

// ===== 4. DATA 43 AGEN MPP =====
var AGEN_MPP=[{nama:'Agen MPP Cengkareng (Persaki)',kota:'Jakarta Barat',provinsi:'DKI Jakarta',kodepos:'11750',alamat:'Jl. Persaki, Cengkareng, Jakarta Barat'},{nama:'Agen MPP Pamijahan',kota:'Kuningan',provinsi:'Jawa Barat',kodepos:'45591',alamat:'Desa Pamijahan, Kuningan, Jawa Barat'},{nama:'Agen MPP Medan Kota',kota:'Medan',provinsi:'Sumatera Utara',kodepos:'20212',alamat:'Jl. Pemuda No. 12, Medan'},{nama:'Agen MPP Bandung Tengah',kota:'Bandung',provinsi:'Jawa Barat',kodepos:'40111',alamat:'Jl. Asia Afrika No. 8, Bandung'},{nama:'Agen MPP Surabaya Pusat',kota:'Surabaya',provinsi:'Jawa Timur',kodepos:'60261',alamat:'Jl. Tunjungan No. 5, Surabaya'},{nama:'Agen MPP Makassar',kota:'Makassar',provinsi:'Sulawesi Selatan',kodepos:'90111',alamat:'Jl. Somba Opu No. 3, Makassar'},{nama:'Agen MPP Semarang',kota:'Semarang',provinsi:'Jawa Tengah',kodepos:'50131',alamat:'Jl. Pemuda No. 7, Semarang'},{nama:'Agen MPP Yogyakarta',kota:'Yogyakarta',provinsi:'DI Yogyakarta',kodepos:'55111',alamat:'Jl. Malioboro No. 15, Yogyakarta'},{nama:'Agen MPP Palembang',kota:'Palembang',provinsi:'Sumatera Selatan',kodepos:'30111',alamat:'Jl. Sudirman No. 22, Palembang'},{nama:'Agen MPP Pekanbaru',kota:'Pekanbaru',provinsi:'Riau',kodepos:'28291',alamat:'Jl. Sudirman No. 9, Pekanbaru'},{nama:'Agen MPP Batam',kota:'Batam',provinsi:'Kepulauan Riau',kodepos:'29444',alamat:'Jl. Imam Bonjol No. 4, Batam'},{nama:'Agen MPP Denpasar',kota:'Denpasar',provinsi:'Bali',kodepos:'80111',alamat:'Jl. Gajah Mada No. 11, Denpasar'},{nama:'Agen MPP Banjarmasin',kota:'Banjarmasin',provinsi:'Kalimantan Selatan',kodepos:'70111',alamat:'Jl. Lambung Mangkurat No. 6, Banjarmasin'},{nama:'Agen MPP Samarinda',kota:'Samarinda',provinsi:'Kalimantan Timur',kodepos:'75111',alamat:'Jl. Gajah Mada No. 18, Samarinda'},{nama:'Agen MPP Pontianak',kota:'Pontianak',provinsi:'Kalimantan Barat',kodepos:'78111',alamat:'Jl. Tanjungpura No. 3, Pontianak'},{nama:'Agen MPP Manado',kota:'Manado',provinsi:'Sulawesi Utara',kodepos:'95111',alamat:'Jl. Sam Ratulangi No. 7, Manado'},{nama:'Agen MPP Kendari',kota:'Kendari',provinsi:'Sulawesi Tenggara',kodepos:'93111',alamat:'Jl. Mayjen Sutoyo No. 5, Kendari'},{nama:'Agen MPP Mataram',kota:'Mataram',provinsi:'Nusa Tenggara Barat',kodepos:'83111',alamat:'Jl. Pejanggik No. 12, Mataram'},{nama:'Agen MPP Kupang',kota:'Kupang',provinsi:'Nusa Tenggara Timur',kodepos:'85111',alamat:'Jl. El Tari No. 8, Kupang'},{nama:'Agen MPP Jayapura',kota:'Jayapura',provinsi:'Papua',kodepos:'99111',alamat:'Jl. Ahmad Yani No. 3, Jayapura'},{nama:'Agen MPP Ambon',kota:'Ambon',provinsi:'Maluku',kodepos:'97111',alamat:'Jl. Pattimura No. 6, Ambon'},{nama:'Agen MPP Ternate',kota:'Ternate',provinsi:'Maluku Utara',kodepos:'97711',alamat:'Jl. Pahlawan Revolusi No. 4, Ternate'},{nama:'Agen MPP Banda Aceh',kota:'Banda Aceh',provinsi:'Aceh',kodepos:'23116',alamat:'Jl. Cut Nyak Dhien No. 9, Banda Aceh'},{nama:'Agen MPP Padang',kota:'Padang',provinsi:'Sumatera Barat',kodepos:'25111',alamat:'Jl. Sudirman No. 14, Padang'},{nama:'Agen MPP Jambi',kota:'Jambi',provinsi:'Jambi',kodepos:'36111',alamat:'Jl. Sultan Thaha No. 7, Jambi'},{nama:'Agen MPP Bengkulu',kota:'Bengkulu',provinsi:'Bengkulu',kodepos:'38221',alamat:'Jl. Suprapto No. 5, Bengkulu'},{nama:'Agen MPP Bandar Lampung',kota:'Bandar Lampung',provinsi:'Lampung',kodepos:'35111',alamat:'Jl. Raden Intan No. 11, Bandar Lampung'},{nama:'Agen MPP Serang',kota:'Serang',provinsi:'Banten',kodepos:'42111',alamat:'Jl. Sudirman No. 8, Serang'},{nama:'Agen MPP Bekasi',kota:'Bekasi',provinsi:'Jawa Barat',kodepos:'17111',alamat:'Jl. Ahmad Yani No. 15, Bekasi'},{nama:'Agen MPP Bogor',kota:'Bogor',provinsi:'Jawa Barat',kodepos:'16111',alamat:'Jl. Sudirman No. 6, Bogor'},{nama:'Agen MPP Depok',kota:'Depok',provinsi:'Jawa Barat',kodepos:'16421',alamat:'Jl. Margonda Raya No. 20, Depok'},{nama:'Agen MPP Tangerang',kota:'Tangerang',provinsi:'Banten',kodepos:'15111',alamat:'Jl. Daan Mogot No. 9, Tangerang'},{nama:'Agen MPP Solo',kota:'Surakarta',provinsi:'Jawa Tengah',kodepos:'57141',alamat:'Jl. Slamet Riyadi No. 12, Solo'},{nama:'Agen MPP Malang',kota:'Malang',provinsi:'Jawa Timur',kodepos:'65111',alamat:'Jl. Basuki Rahmat No. 7, Malang'},{nama:'Agen MPP Kediri',kota:'Kediri',provinsi:'Jawa Timur',kodepos:'64111',alamat:'Jl. Dhoho No. 5, Kediri'},{nama:'Agen MPP Balikpapan',kota:'Balikpapan',provinsi:'Kalimantan Timur',kodepos:'76111',alamat:'Jl. Sudirman No. 10, Balikpapan'},{nama:'Agen MPP Palangka Raya',kota:'Palangka Raya',provinsi:'Kalimantan Tengah',kodepos:'73111',alamat:'Jl. Tjilik Riwut No. 8, Palangka Raya'},{nama:'Agen MPP Gorontalo',kota:'Gorontalo',provinsi:'Gorontalo',kodepos:'96111',alamat:'Jl. Agus Salim No. 4, Gorontalo'},{nama:'Agen MPP Palu',kota:'Palu',provinsi:'Sulawesi Tengah',kodepos:'94111',alamat:'Jl. Sudirman No. 6, Palu'},{nama:'Agen MPP Mamuju',kota:'Mamuju',provinsi:'Sulawesi Barat',kodepos:'91511',alamat:'Jl. Soekarno Hatta No. 3, Mamuju'},{nama:'Agen MPP Sorong',kota:'Sorong',provinsi:'Papua Barat',kodepos:'98411',alamat:'Jl. Ahmad Yani No. 7, Sorong'},{nama:'Agen MPP Manokwari',kota:'Manokwari',provinsi:'Papua Barat',kodepos:'98311',alamat:'Jl. Trikora No. 5, Manokwari'},{nama:'Agen MPP Tanjung Pinang',kota:'Tanjung Pinang',provinsi:'Kepulauan Riau',kodepos:'29111',alamat:'Jl. Merdeka No. 9, Tanjung Pinang'}];

function renderAgenMPP(){filterAgenMPP();}
function filterAgenMPP(){var q=(document.getElementById('agen-search')?document.getElementById('agen-search').value:'').toLowerCase();var list=q?AGEN_MPP.filter(function(a){return a.nama.toLowerCase().includes(q)||a.kota.toLowerCase().includes(q)||a.provinsi.toLowerCase().includes(q)||a.kodepos.includes(q);}):AGEN_MPP;var el=document.getElementById('agen-list');if(!el)return;if(list.length===0){el.innerHTML='<div style="text-align:center;color:#aaa;padding:20px;">Tidak ditemukan</div>';return;}el.innerHTML=list.map(function(a){var gm='https://www.google.com/maps/search/'+encodeURIComponent(a.alamat+', '+a.kota);var ap='https://maps.apple.com/?q='+encodeURIComponent(a.alamat+', '+a.kota);return '<div class="agen-card"><div class="agen-card-header"><div class="agen-avatar">&#128205;</div><div style="flex:1;"><strong>'+a.nama+'</strong><div style="font-size:11px;color:#888;">'+a.kota+', '+a.provinsi+' &bull; '+a.kodepos+'</div><div style="font-size:11px;color:#555;margin-top:2px;">'+a.alamat+'</div></div></div><div class="agen-card-actions"><a href="'+gm+'" target="_blank" class="agen-btn-maps agen-btn-google">&#127758; Google Maps</a><a href="'+ap+'" target="_blank" class="agen-btn-maps agen-btn-apple">&#127758; Apple Maps</a></div></div>';}).join('');}

// ===== LACAK PESANAN DENGAN BUKTI KIRIM =====
var _openLacakOrig=openLacakPesanan;
openLacakPesanan=function(){
  if(!requireLogin())return;
  var container=document.getElementById('lacak-content');
  // Filter pesanan milik user yang sedang login dari allOrderHistory
  var myOrders = [];
  if(typeof allOrderHistory !== 'undefined'){
    myOrders = allOrderHistory.filter(function(o){ return o.pembeli === currentUser; });
  }
  // Fallback ke orderHistory jika allOrderHistory kosong
  if(myOrders.length === 0) myOrders = orderHistory;

  if(myOrders.length===0){container.innerHTML='<div class="lacak-empty"><div style="font-size:48px;margin-bottom:12px;">&#128230;</div><p style="color:#888;font-size:14px;">Belum ada pesanan</p></div>';}
  else{
    container.innerHTML=myOrders.map(function(o,i){
      var done=o.fotoPenerimaan;
      var sudahKirim=!!o.fotoKirim;
      var statusLabel=done?'&#10003; Selesai':sudahKirim?'&#128666; Dikirim':'&#128260; Diproses';
      var statusClass=done?'status-selesai':'';
      var html='<div class="lacak-item">';
      html+='<div class="lacak-item-header"><strong>Pesanan #'+String(i+1).padStart(3,'0')+'</strong><span class="lacak-status '+statusClass+'">'+statusLabel+'</span></div>';
      html+='<div class="lacak-item-body"><p><strong>'+o.barang+'</strong></p><p>'+o.pembayaran+' | '+o.pengiriman+'</p><p>Total: <strong style="color:#ff6f00;">'+o.total+'</strong></p><p style="font-size:12px;color:#888;">'+o.waktu+'</p></div>';
      html+='<div class="lacak-timeline"><div class="lacak-step done">&#10003; Pesanan Dikonfirmasi</div><div class="lacak-step done">&#10003; Pesanan Sedang Diproses</div><div class="lacak-step '+(sudahKirim||done?'done':'pending')+'">&#128666; Dalam Pengiriman</div><div class="lacak-step '+(done?'done':'pending')+'">&#127968; Diterima</div></div>';
      if(sudahKirim){html+='<div class="lacak-foto-wrap"><div class="lacak-foto-label">&#128666; Bukti Pengiriman ke Ekspedisi</div>';if(o.noresiKirim)html+='<div style="font-size:12px;color:#5b4fcf;font-weight:700;margin-bottom:6px;">No. Resi: '+o.noresiKirim+'</div>';html+='<img src="'+o.fotoKirim+'" class="lacak-foto-preview" alt="Bukti kirim"/><div style="font-size:11px;color:#aaa;margin-top:4px;">Dikirim: '+(o.waktuKirim||'-')+'</div></div>';}
      if(done){html+='<div class="lacak-foto-wrap"><div class="lacak-foto-label">&#128247; Foto Penerimaan Barang</div><img src="'+done+'" class="lacak-foto-preview" alt="Foto penerimaan"/></div>';}
      else{html+='<div class="lacak-terima-wrap"><label class="btn-upload-foto" for="foto-input-'+i+'">&#128247; Upload Foto Penerimaan</label><input type="file" id="foto-input-'+i+'" accept="image/*" style="display:none;" onchange="uploadFotoPenerimaan(this,'+i+')"/><p style="font-size:11px;color:#aaa;margin-top:4px;">Upload foto saat barang diterima</p></div>';}
      if(isAdmin&&!sudahKirim){
        var sumber=o.sumberProduk||'resmi';
        if(sumber==='resmi'){
          html+='<div class="lacak-terima-wrap"><button class="btn-upload-foto" onclick="bukaKonfirmasiAdmin('+i+')">&#128247; Konfirmasi Pengiriman (Admin)</button><p style="font-size:11px;color:#aaa;margin-top:4px;">Produk resmi — admin yang konfirmasi</p></div>';
        } else {
          html+='<div class="lacak-terima-wrap"><div style="background:#fff3e0;border-radius:8px;padding:8px 12px;font-size:12px;color:#ff6f00;text-align:center;">&#9432; Produk penjual — konfirmasi dilakukan oleh penjual</div></div>';
        }
      }
      html+='</div>';
      return html;
    }).join('');
  }
  openModal('modal-lacak');
};
