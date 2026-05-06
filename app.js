// ===== PAGE NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  updateNavbarStyle(pageId);
  updateNavbarVisibility(pageId);
}

function updateNavbarVisibility(pageId) {
  const isHome = pageId === 'page-home';
  const hamburger = document.getElementById('navbar-hamburger');
  const cart      = document.getElementById('navbar-cart');
  if (hamburger) hamburger.style.display = isHome ? 'none' : '';
  if (cart)      cart.style.display      = isHome ? 'none' : '';
}

function goToLayanan() {
  if (!isLoggedIn) { showToast('Silakan login atau daftar terlebih dahulu!'); openModal('modal-masuk'); return; }
  showPage('page-products');
}

function updateNavbarStyle(pageId) {
  const navbar = document.getElementById('navbar');
  const darkPages = ['page-home', 'page-tentang', 'page-kontak'];
  const dark = darkPages.includes(pageId);
  navbar.style.background = dark ? 'transparent' : 'rgba(255,255,255,0.95)';
  navbar.style.boxShadow  = dark ? 'none' : '0 2px 10px rgba(0,0,0,0.1)';
  const hamburger = document.getElementById('navbar-hamburger');
  const cartBtn   = document.getElementById('navbar-cart');
  if (hamburger) hamburger.style.color = dark ? 'white' : '#333';
  if (cartBtn)   cartBtn.style.color   = dark ? 'white' : '#333';
  const btnMasuk  = document.getElementById('btn-masuk');
  const btnDaftar = document.getElementById('btn-daftar');
  const btnLogout = document.getElementById('btn-logout');
  if (dark) {
    if (btnMasuk)  { btnMasuk.style.background = 'white'; btnMasuk.style.color = '#333'; btnMasuk.style.borderColor = 'white'; }
    if (btnDaftar) { btnDaftar.style.color = 'white'; btnDaftar.style.borderColor = 'white'; }
  } else {
    if (btnMasuk)  { btnMasuk.style.background = '#5b4fcf'; btnMasuk.style.color = 'white'; btnMasuk.style.borderColor = '#5b4fcf'; }
    if (btnDaftar) { btnDaftar.style.color = '#5b4fcf'; btnDaftar.style.borderColor = '#5b4fcf'; }
  }
  if (btnLogout) { btnLogout.style.color = 'white'; }
  applyAuthDisplay();
}

// ===== AUTH STATE =====
let isLoggedIn = false;
let currentUser = '';
let isAdmin = false;
let adminOnline = false;
let adminNotifications = [];

function applyAuthDisplay() {
  const btnMasuk  = document.getElementById('btn-masuk');
  const btnDaftar = document.getElementById('btn-daftar');
  const btnLogout = document.getElementById('btn-logout');
  const sidebarUser  = document.getElementById('sidebar-user');
  const sidebarUname = document.getElementById('sidebar-username');
  if (isLoggedIn) {
    if (btnMasuk)  btnMasuk.style.display  = 'none';
    if (btnDaftar) btnDaftar.style.display = 'none';
    if (btnLogout) {
      btnLogout.style.display = 'inline-flex';
      btnLogout.innerHTML = isAdmin
        ? `&#128081; ${currentUser} <span style="background:#ff6f00;color:white;font-size:10px;padding:1px 6px;border-radius:10px;margin-left:4px;">ADMIN</span> &nbsp;|&nbsp; KELUAR`
        : `&#128100; ${currentUser}  |  KELUAR`;
    }
    if (sidebarUser)  sidebarUser.style.display = 'flex';
    if (sidebarUname) {
      sidebarUname.innerHTML = isAdmin
        ? `${currentUser} <span style="background:#ff6f00;color:white;font-size:10px;padding:1px 8px;border-radius:10px;margin-left:4px;">ADMIN</span>`
        : currentUser;
    }
    const roleEl   = document.getElementById('sidebar-role');
    const avatarEl = document.getElementById('sidebar-avatar');
    if (roleEl)   roleEl.textContent   = isAdmin ? 'Admin Moentaz ProVision' : 'Member Moentaz ProVision';
    if (avatarEl) avatarEl.textContent = isAdmin ? '\u{1F451}' : '\u{1F464}';
    const adminLink = document.getElementById('sidebar-admin-link');
    if (adminLink) adminLink.style.display = isAdmin ? '' : 'none';
    adminOnline = isAdmin;
    const chatLink = document.getElementById('sidebar-chat-link');
    if (chatLink) chatLink.textContent = isAdmin ? '\u{1F4AC} Chat Pelanggan' : '\u{1F4AC} Chat Admin';
  } else {
    if (btnMasuk)  btnMasuk.style.display  = '';
    if (btnDaftar) btnDaftar.style.display = '';
    if (btnLogout) btnLogout.style.display = 'none';
    if (sidebarUser) sidebarUser.style.display = 'none';
    adminOnline = false;
    const chatLink = document.getElementById('sidebar-chat-link');
    if (chatLink) chatLink.textContent = '\u{1F4AC} Chat Admin';
  }
}

function requireLogin() {
  if (!isLoggedIn) { showToast('Silakan login atau daftar terlebih dahulu!'); openModal('modal-masuk'); return false; }
  return true;
}

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== LOGIN =====
const VALID_USER = { username: 'KelompokMaul', email: 'moentaz212@gmail.com', password: 'KelompokMaulJaya001' };
let registeredUsers = [];

function doLogin() {
  const username = document.getElementById('login-username').value.trim();
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('login-error');
  const validDefault    = username === VALID_USER.username && email === VALID_USER.email && password === VALID_USER.password;
  const validRegistered = registeredUsers.find(u => u.username === username && u.email === email && u.password === password);
  if (validDefault || validRegistered) {
    isLoggedIn = true; isAdmin = !!validDefault; currentUser = username;
    errEl.style.display = 'none';
    closeModal('modal-masuk'); applyAuthDisplay(); updateCPayDisplay();
    showToast(isAdmin ? `Selamat datang, Admin ${username}!` : `Selamat datang, ${username}!`);
  } else {
    const userExists = registeredUsers.find(u => u.username === username || u.email === email);
    if (userExists) { errEl.textContent = 'Username, email, atau kata sandi salah.'; }
    else if (username && email) {
      errEl.textContent = 'Akun tidak ditemukan. Silakan daftar terlebih dahulu!';
      errEl.innerHTML += ` <a href="#" onclick="closeModal('modal-masuk');openModal('modal-daftar');return false;" style="color:#5b4fcf;font-weight:700;text-decoration:underline;">Daftar sekarang</a>`;
    } else { errEl.textContent = 'Isi username dan email terlebih dahulu.'; }
    errEl.style.display = 'block';
  }
}

function doLogout() {
  isLoggedIn = false; currentUser = ''; isAdmin = false;
  cart = []; orderHistory = []; cctvPaySaldo = 0; cctvPayRiwayat = [];
  updateCartBadge(); applyAuthDisplay(); updateCPayDisplay();
  ['login-username','login-email','login-password'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  const le = document.getElementById('login-error'); if(le) le.style.display='none';
  ['reg-nama','reg-email','reg-jalan','reg-telpon','reg-password','reg-password2'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  const rp = document.getElementById('reg-provinsi'); if(rp) rp.value='';
  ['reg-kota','reg-kecamatan','reg-kodepos'].forEach(id => { const el=document.getElementById(id); if(el){el.innerHTML='<option value="">--</option>';el.disabled=true;} });
  const re = document.getElementById('reg-error'); if(re) re.style.display='none';
  showToast('Berhasil keluar. Sampai jumpa!');
}

// ===== DAFTAR =====
function doDaftar() {
  const nama      = document.getElementById('reg-nama').value.trim();
  const email     = document.getElementById('reg-email').value.trim();
  const provinsi  = document.getElementById('reg-provinsi')?.value || '';
  const kota      = document.getElementById('reg-kota')?.value || '';
  const kecamatan = document.getElementById('reg-kecamatan')?.value || '';
  const kodepos   = document.getElementById('reg-kodepos')?.value || '';
  const jalan     = document.getElementById('reg-jalan')?.value.trim() || '';
  const telpon    = document.getElementById('reg-telpon').value.trim();
  const pass1     = document.getElementById('reg-password').value;
  const pass2     = document.getElementById('reg-password2').value;
  const errEl     = document.getElementById('reg-error');
  const showErr   = (msg) => { errEl.textContent = msg; errEl.style.display = 'block'; };

  if (!nama || !email || !telpon || !pass1 || !pass2) return showErr('Semua field wajib diisi.');
  if (!provinsi || !kota || !kecamatan || !kodepos) return showErr('Pilih Provinsi, Kota, Kecamatan, dan Kode Pos.');
  if (!jalan) return showErr('Isi nama jalan, gedung, dan nomor rumah.');
  const words = nama.trim().split(/\s+/);
  if (words.length < 2) return showErr('Nama harus minimal 2 kata.');
  if (!/^[a-zA-Z\s]+$/.test(nama)) return showErr('Nama hanya boleh huruf dan spasi.');
  if (words.some(w => w.length < 2)) return showErr('Setiap kata pada nama minimal 2 huruf.');
  if (!email.endsWith('@gmail.com')) return showErr('Email harus @gmail.com.');
  if (email.indexOf('@') === 0) return showErr('Masukkan nama sebelum @gmail.com.');
  if (!/^[0-9+\-\s]+$/.test(telpon)) return showErr('Nomor telepon hanya boleh angka.');
  if (telpon.replace(/\D/g,'').length < 9) return showErr('Nomor telepon minimal 9 digit.');
  if (pass1.length < 8) return showErr('Password minimal 8 karakter.');
  if (!/[A-Z]/.test(pass1)) return showErr('Password harus ada huruf kapital.');
  if (!/[0-9]/.test(pass1)) return showErr('Password harus ada angka.');
  if (!/[.,\-_]/.test(pass1)) return showErr('Password harus ada tanda: . , - _');
  if (pass1 !== pass2) return showErr('Password tidak cocok.');

  errEl.style.display = 'none';
  const alamat = `${jalan}, ${kecamatan}, ${kota}, ${provinsi} ${kodepos}`;
  const newUser = {
    username: nama, email, alamat, telpon, password: pass1,
    terdaftar: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
  };
  registeredUsers.push(newUser);
  adminNotifications.push({ type: 'user_baru', data: newUser });
  // Simpan alamat ke daftar alamat
  daftarAlamat.push({ label: 'Rumah', provinsi, kota, kecamatan, kodepos, jalan, utama: true });
  isLoggedIn = true; currentUser = nama;
  closeModal('modal-daftar'); applyAuthDisplay(); updateCPayDisplay();
  showToast('Akun berhasil dibuat! Selamat datang, ' + nama);
}

// ===== MODALS =====
function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'modal-chat-admin') updateChatAdminStatus('chat-admin-status-umum');
  if (id === 'modal-checkout') updateCoAlamat();
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); });
});

// ===== SIDEBAR =====
function openSidebar() { document.getElementById('sidebar').classList.add('open'); document.getElementById('sidebar-overlay').classList.add('open'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebar-overlay').classList.remove('open'); }

// ===== CART =====
let cart = [];
const productImages = {
  'Tapo C500': () => CCTV_ICONS.ptz, 'Domeguard Cam': () => CCTV_ICONS.dome,
  'Guardian Lens': () => CCTV_ICONS.dual, 'ZTE CCTV': () => CCTV_ICONS.wireless,
  'CCTV Bullet Camera': () => CCTV_ICONS.bullet, 'Hikvision': () => CCTV_ICONS.indoor,
  'Ezviz Dome': () => CCTV_ICONS.smart, 'TVT Camera': () => CCTV_ICONS.outdoor,
};

function addToCart(name, price) {
  if (!requireLogin()) return;
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty++; }
  else { const fn = productImages[name]; cart.push({ name, price, qty: 1, img: fn ? fn() : CCTV_ICONS.dome }); }
  updateCartBadge(); renderCart(); openModal('modal-cart');
}
function addToCartDetail() {
  if (!requireLogin()) return;
  addToCart(document.getElementById('detail-name').textContent, parseInt(document.getElementById('detail-price').textContent.replace(/[^0-9]/g,'')));
}
function beliSekarang(name, price) {
  if (!requireLogin()) return;
  const fn = productImages[name];
  openCheckout([{ name, price, qty: 1, img: fn ? fn() : CCTV_ICONS.dome }]);
}
function beliSekarangDetail() {
  if (!requireLogin()) return;
  const name = document.getElementById('detail-name').textContent;
  const price = parseInt(document.getElementById('detail-price').textContent.replace(/[^0-9]/g,''));
  const fn = productImages[name];
  openCheckout([{ name, price, qty: 1, img: fn ? fn() : CCTV_ICONS.dome }]);
}
function updateCartBadge() { document.getElementById('cart-badge').textContent = cart.reduce((s,i) => s+i.qty, 0); }
function renderCart() {
  const container = document.getElementById('cart-items');
  if (cart.length === 0) { container.innerHTML = '<p style="text-align:center;padding:30px;color:#888;">Keranjang kosong</p>'; return; }
  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <input type="checkbox" class="cart-check" checked/>
      <img src="${item.img}" alt="${item.name}" style="image-rendering:pixelated;"/>
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <div class="cart-price">Rp${item.price.toLocaleString('id-ID')}</div>
        <div class="qty-ctrl">
          <button onclick="changeQty(${idx},-1)">&#8722;</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${idx},1)">+</button>
        </div>
      </div>
    </div>`).join('');
}
function changeQty(idx, delta) { cart[idx].qty += delta; if (cart[idx].qty <= 0) cart.splice(idx,1); updateCartBadge(); renderCart(); }
function toggleSelectAll(cb) { document.querySelectorAll('.cart-check').forEach(c => c.checked = cb.checked); }
function checkout() {
  if (!requireLogin()) return;
  const selected = [];
  document.querySelectorAll('.cart-check').forEach((cb,i) => { if (cb.checked && cart[i]) selected.push(cart[i]); });
  if (selected.length === 0) { showToast('Pilih produk terlebih dahulu!'); return; }
  closeModal('modal-cart'); openCheckout(selected);
}

// ===== CHECKOUT =====
let checkoutItems = [];
function openCheckout(items) {
  checkoutItems = items;
  const total = items.reduce((s,i) => s+i.price*i.qty, 0);
  hargaBarangCheckout = total;
  selectedOngkir = 0;
  document.getElementById('co-items').innerHTML = items.map(i => `
    <div class="co-item">
      <img src="${i.img}" alt="${i.name}" style="width:48px;height:48px;image-rendering:pixelated;"/>
      <div><strong>${i.name}</strong><br><span style="color:#ff6f00;font-weight:700;">Rp${i.price.toLocaleString('id-ID')} x ${i.qty}</span></div>
    </div>`).join('');
  document.getElementById('co-total').textContent = 'Rp' + total.toLocaleString('id-ID');
  document.querySelectorAll('.co-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('co-error').style.display = 'none';
  const summary = document.getElementById('co-ongkir-summary');
  if (summary) summary.style.display = 'none';
  updateCoAlamat();
  openModal('modal-checkout');
}
function selectOption(el, group) {
  document.querySelectorAll(`.co-group[data-group="${group}"] .co-option`).forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}
function confirmCheckout() {
  const pengiriman = document.querySelector('.co-group[data-group="pengiriman"] .co-option.selected');
  const pembayaran = document.querySelector('.co-group[data-group="pembayaran"] .co-option.selected');
  const errEl = document.getElementById('co-error');
  if (!pengiriman) { errEl.textContent = 'Pilih metode pengiriman terlebih dahulu.'; errEl.style.display = 'block'; return; }
  if (!pembayaran) { errEl.textContent = 'Pilih metode pembayaran terlebih dahulu.'; errEl.style.display = 'block'; return; }
  const total     = checkoutItems.reduce((s,i) => s+i.price*i.qty, 0) + selectedOngkir;
  const namaBarang = checkoutItems.map(i => `${i.name} (x${i.qty})`).join(', ');
  const metodePay  = pembayaran.dataset.label;
  if (metodePay === 'COD' && total > 1500000) {
    errEl.textContent = `COD maksimal Rp1.500.000. Total Anda: Rp${total.toLocaleString('id-ID')}.`;
    errEl.style.display = 'block'; return;
  }
  if (metodePay === 'QRIS') {
    errEl.style.display = 'none';
    document.getElementById('qris-total-val').textContent = 'Rp' + total.toLocaleString('id-ID');
    closeModal('modal-checkout'); openModal('modal-qris'); return;
  }
  if (metodePay === 'MoentazProVisionPay') {
    if (cctvPaySaldo < total) {
      errEl.textContent = `Saldo tidak cukup! Saldo: Rp${cctvPaySaldo.toLocaleString('id-ID')}, dibutuhkan: Rp${total.toLocaleString('id-ID')}`;
      errEl.style.display = 'block'; return;
    }
    cctvPaySaldo -= total;
    addRiwayat('keluar', 'Pembelian: ' + namaBarang, total);
    updateCPayDisplay();
  }
  errEl.style.display = 'none';
  closeModal('modal-checkout');
  const now = new Date();
  const waktu = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  orderHistory.unshift({
    barang: checkoutItems.map(i => `${i.name} x${i.qty}`).join(', '),
    pembeli: currentUser,
    pembayaran: metodePay, pengiriman: pengiriman.dataset.label,
    total: 'Rp' + total.toLocaleString('id-ID'), waktu,
    sumberProduk: checkoutItems.some(i => i.sellerUsername) ? 'penjual' : 'resmi',
    sellerUsername: checkoutItems.find(i => i.sellerUsername)?.sellerUsername || null
  });
  // Simpan ke allOrderHistory global agar admin bisa lihat
  if (typeof allOrderHistory !== 'undefined') allOrderHistory.unshift(orderHistory[0]);
  checkoutItems.forEach(ci => { const idx = cart.findIndex(c => c.name === ci.name); if (idx !== -1) cart.splice(idx,1); });
  updateCartBadge(); renderCart();
  document.getElementById('success-detail').innerHTML = `
    <p>Produk: <strong>${namaBarang}</strong></p>
    <p>Pengiriman: <strong>${pengiriman.dataset.label}</strong></p>
    <p>Pembayaran: <strong>${metodePay}</strong></p>
    <p>Total: <strong style="color:#ff6f00;">Rp${total.toLocaleString('id-ID')}</strong></p>
    ${metodePay === 'MoentazProVisionPay' ? `<p>Sisa saldo: <strong>Rp${cctvPaySaldo.toLocaleString('id-ID')}</strong></p>` : ''}
  `;
  openModal('modal-success');
}

// ===== PRODUCT DETAIL =====
const productDetails = {
  tapo:      { name:'TAPO C500',          price:500000, basePrice:500000, icon:'ptz'      },
  dome:      { name:'DOMEGUARD CAM',      price:600000, basePrice:600000, icon:'dome'     },
  guardian:  { name:'GUARDIAN LENS',      price:750000, basePrice:750000, icon:'dual'     },
  zte:       { name:'ZTE CCTV',           price:750000, basePrice:750000, icon:'wireless' },
  bullet:    { name:'CCTV BULLET CAMERA', price:400000, basePrice:400000, icon:'bullet'   },
  hikvision: { name:'HIKVISION',          price:350000, basePrice:350000, icon:'indoor'   },
  ezviz:     { name:'EZVIZ DOME',         price:450000, basePrice:450000, icon:'smart'    },
  tvt:       { name:'TVT CAMERA',         price:650000, basePrice:650000, icon:'outdoor'  },
};
function showDetail(key) {
  const p = productDetails[key]; if (!p) return;
  document.getElementById('detail-img').src = CCTV_ICONS[p.icon];
  document.getElementById('detail-name').textContent = p.name;
  document.getElementById('detail-price').textContent = 'Rp' + p.price.toLocaleString('id-ID');
  showPage('page-detail');
}

// ===== CHAT =====
const chatHistory = {};
let allChatMessages = [];

function openProductChat(productName) {
  if (!chatHistory[productName]) chatHistory[productName] = [];
  document.getElementById('chat-product-label').textContent = productName;
  document.getElementById('modal-chat').dataset.product = productName;
  updateChatAdminStatus('chat-admin-status');
  renderChatMessages(productName);
  openModal('modal-chat');
}
function openProductChatDetail() { openProductChat(document.getElementById('detail-name').textContent); }
function updateChatAdminStatus(elId) {
  const el = document.getElementById(elId); if (!el) return;
  el.textContent = adminOnline ? 'Admin Online' : 'Admin Offline - dibalas Bot';
  el.style.color  = adminOnline ? '#2e7d32' : '#e53935';
}
function renderChatMessages(productName) {
  const container = document.getElementById('chat-messages');
  const msgs = chatHistory[productName] || [];
  container.innerHTML = msgs.length === 0
    ? `<div style="text-align:center;color:#aaa;padding:20px;font-size:13px;">Mulai chat tentang ${productName}</div>`
    : msgs.map(m => `<div class="chat-msg ${m.mine?'mine':''}">${m.text.replace(/\n/g,'<br>')}</div>`).join('');
  container.scrollTop = container.scrollHeight;
}
function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim(); if (!msg) return;
  const productName = document.getElementById('modal-chat').dataset.product || 'Produk';
  if (!chatHistory[productName]) chatHistory[productName] = [];
  const waktu = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' });
  chatHistory[productName].push({ text: msg, mine: true });
  renderChatMessages(productName); input.value = '';
  allChatMessages.push({ from: currentUser||'Tamu', productName, text: msg, waktu, read: false });
  adminNotifications.push({ type:'chat', from: currentUser||'Tamu', productName, text: msg, waktu, read: false });
  updateAdminNotifBadge();
  if (adminOnline) {
    chatHistory[productName].push({ text: 'Admin sedang mengetik...', mine: false, typing: true });
    renderChatMessages(productName);
    setTimeout(() => {
      const idx = chatHistory[productName].findIndex(m => m.typing);
      if (idx !== -1) chatHistory[productName].splice(idx, 1);
      chatHistory[productName].push({ text: getAdminReply(msg, productName), mine: false });
      renderChatMessages(productName);
    }, 1500);
  } else {
    chatHistory[productName].push({ text: 'Bot: Admin sedang offline. Pesan kamu sudah kami catat!', mine: false });
    renderChatMessages(productName);
    setTimeout(() => {
      chatHistory[productName].push({ text: getAdminReply(msg, productName), mine: false });
      renderChatMessages(productName);
    }, 1200);
  }
}
function updateAdminNotifBadge() {
  const unread = adminNotifications.filter(n => !n.read).length;
  const badge = document.getElementById('admin-notif-badge');
  if (badge) badge.textContent = unread > 0 ? unread : '';
}
function getAdminReply(msg, productName) {
  const m = msg.toLowerCase();
  if (m.includes('harga')||m.includes('berapa')) return productName ? `Harga ${productName} bisa dilihat di halaman produk. WA: 0857-1254-3675` : 'Harga mulai Rp343.000. Mau tanya produk apa?';
  if (m.includes('stok')||m.includes('tersedia')) return `${productName||'Produk kami'} READY STOCK, siap kirim hari ini!`;
  if (m.includes('garansi')) return 'Semua produk bergaransi resmi 1 tahun!';
  if (m.includes('kirim')||m.includes('ongkir')) return 'Pengiriman ke seluruh Indonesia via J&T, JNE, SiCepat, AnterAja, Pos Indonesia. Gratis ongkir pakai voucher GRATIS50!';
  if (m.includes('cod')) return 'COD tersedia untuk pembelian maksimal Rp1.500.000.';
  if (m.includes('pasang')||m.includes('instal')) return 'Jasa instalasi profesional tersedia untuk area Jabodetabek.';
  if (m.includes('diskon')||m.includes('promo')||m.includes('voucher')) return 'Voucher: CCTV10 (diskon 10%), NEWUSER (cashback Rp25.000), GRATIS50 (gratis ongkir). Cek Promo & Voucher di sidebar!';
  if (m.includes('bayar')||m.includes('transfer')) return 'Pembayaran: DANA, GoPay, OVO, MoentazProVisionPay, BCA/BRI/Mandiri, BNI, COD, QRIS.';
  if (m.includes('outdoor')) return 'Untuk outdoor: CCTV Bullet Camera, TVT Camera, atau Tapo C500 (waterproof).';
  if (m.includes('indoor')) return 'Untuk indoor: Domeguard Cam, Hikvision, atau Ezviz Dome.';
  if (m.includes('kontak')||m.includes('whatsapp')) return 'WA: 0857-1254-3675\nIG: @moentazprovision\nEmail: moentaz212@gmail.com';
  if (m.includes('halo')||m.includes('hai')||m.includes('hello')) return 'Halo! Selamat datang di Moentaz ProVision. Ada yang bisa kami bantu?';
  if (m.includes('terima kasih')||m.includes('makasih')) return 'Sama-sama! Jangan ragu untuk tanya lagi ya.';
  return productName ? `Terima kasih menanyakan ${productName}! WA: 0857-1254-3675` : 'Terima kasih! Hubungi kami di WA 0857-1254-3675.';
}
document.getElementById('chat-input').addEventListener('keydown', e => { if (e.key==='Enter') sendChat(); });
document.getElementById('chat-input-admin').addEventListener('keydown', e => { if (e.key==='Enter') sendChatAdmin(); });
// ===== MoentazProVisionPay =====
let cctvPaySaldo = 0;
let cctvPayRiwayat = [];
function openCCTVPay() { if (!requireLogin()) return; updateCPayDisplay(); document.querySelectorAll('.cpay-section').forEach(s => s.style.display='none'); openModal('modal-cctvpay'); }
function updateCPayDisplay() {
  const fmt = 'Rp' + cctvPaySaldo.toLocaleString('id-ID');
  const e1=document.getElementById('cpay-saldo-display'); if(e1) e1.textContent=fmt;
  const e2=document.getElementById('sidebar-saldo-val'); if(e2) e2.textContent=fmt;
  const e3=document.getElementById('cpay-nomor'); if(e3) e3.textContent='No. Akun: '+(currentUser?currentUser.replace(/\s/g,'').toUpperCase()+'001':'-');
  const e4=document.getElementById('cpay-bayar-saldo'); if(e4) e4.textContent=fmt;
}
function showCPaySection(name) { document.querySelectorAll('.cpay-section').forEach(s=>s.style.display='none'); const el=document.getElementById('cpay-'+name); if(el) el.style.display='block'; if(name==='riwayat') renderRiwayat(); if(name==='bayar') updateCPayDisplay(); }
function addRiwayat(type,ket,nom) { const now=new Date(); const tgl=now.toLocaleDateString('id-ID')+' '+now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}); cctvPayRiwayat.unshift({type,keterangan:ket,nominal:nom,tgl}); }
function renderRiwayat() { const el=document.getElementById('cpay-riwayat-list'); if(!el) return; if(cctvPayRiwayat.length===0){el.innerHTML='<div style="text-align:center;color:#aaa;padding:20px;font-size:13px;">Belum ada transaksi</div>';return;} el.innerHTML=cctvPayRiwayat.map(r=>`<div class="cpay-riwayat-item"><div><strong>${r.keterangan}</strong><div style="font-size:11px;color:#888;">${r.tgl}</div></div><div style="font-weight:800;color:${r.type==='masuk'?'#2e7d32':'#e53935'};">${r.type==='masuk'?'+':'-'}Rp${r.nominal.toLocaleString('id-ID')}</div></div>`).join(''); }
function doTopUp(n) { cctvPaySaldo+=n; addRiwayat('masuk','Top Up Saldo',n); updateCPayDisplay(); showToast('Top Up Rp'+n.toLocaleString('id-ID')+' berhasil!'); }
function doTopUpCustom() { const v=parseInt(document.getElementById('topup-custom').value); if(!v||v<10000){showToast('Minimal top up Rp10.000');return;} doTopUp(v); document.getElementById('topup-custom').value=''; }
function doTransfer() { const t=document.getElementById('transfer-tujuan').value.trim(); const n=parseInt(document.getElementById('transfer-nominal').value); const c=document.getElementById('transfer-catatan').value.trim(); if(!t){showToast('Masukkan tujuan transfer');return;} if(!n||n<1000){showToast('Nominal minimal Rp1.000');return;} if(n>cctvPaySaldo){showToast('Saldo tidak cukup!');return;} cctvPaySaldo-=n; addRiwayat('keluar','Transfer ke '+t+(c?' - '+c:''),n); updateCPayDisplay(); document.getElementById('transfer-tujuan').value=''; document.getElementById('transfer-nominal').value=''; document.getElementById('transfer-catatan').value=''; showToast('Transfer Rp'+n.toLocaleString('id-ID')+' ke '+t+' berhasil!'); }
function doBayar() { const n=parseInt(document.getElementById('bayar-nominal').value); if(!n||n<1000){showToast('Masukkan nominal pembayaran');return;} if(n>cctvPaySaldo){showToast('Saldo tidak cukup!');return;} cctvPaySaldo-=n; addRiwayat('keluar','Pembayaran Belanja',n); updateCPayDisplay(); document.getElementById('bayar-nominal').value=''; showToast('Pembayaran Rp'+n.toLocaleString('id-ID')+' berhasil!'); }
function doTarik() { const b=document.getElementById('tarik-bank').value.trim(); const r=document.getElementById('tarik-norek').value.trim(); const n=parseInt(document.getElementById('tarik-nominal').value); if(!b||!r){showToast('Isi data rekening terlebih dahulu');return;} if(!n||n<50000){showToast('Minimal tarik Rp50.000');return;} if(n>cctvPaySaldo){showToast('Saldo tidak cukup!');return;} cctvPaySaldo-=n; addRiwayat('keluar','Tarik Tunai ke '+b+' '+r,n); updateCPayDisplay(); document.getElementById('tarik-bank').value=''; document.getElementById('tarik-norek').value=''; document.getElementById('tarik-nominal').value=''; showToast('Penarikan Rp'+n.toLocaleString('id-ID')+' ke '+b+' berhasil!'); }
function doVoucher() { const k=document.getElementById('voucher-kode').value.trim().toUpperCase(); const vs={'CCTV10':{label:'Diskon 10%',bonus:30000},'NEWUSER':{label:'Cashback Rp25.000',bonus:25000},'GRATIS50':{label:'Bonus Rp50.000',bonus:50000}}; if(!k){showToast('Masukkan kode voucher');return;} if(!vs[k]){showToast('Kode voucher tidak valid');return;} const v=vs[k]; cctvPaySaldo+=v.bonus; addRiwayat('masuk','Voucher '+k+' - '+v.label,v.bonus); updateCPayDisplay(); document.getElementById('voucher-kode').value=''; showToast('Voucher '+k+' berhasil! +Rp'+v.bonus.toLocaleString('id-ID')); }
// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => { const n=document.getElementById('navbar'); if(window.scrollY>50) n.classList.add('scrolled'); else n.classList.remove('scrolled'); });
// ===== INIT =====
updateNavbarStyle('page-home');
updateNavbarVisibility('page-home');
applyAuthDisplay();
function initProductImages() {
  const map={'feat-tapo':'ptz','feat-dome':'dome','feat-guardian':'dual','grid-tapo':'ptz','grid-dome':'dome','grid-guardian':'dual','grid-zte':'wireless','grid-bullet':'bullet','grid-hikvision':'indoor','grid-ezviz':'smart','grid-tvt':'outdoor'};
  Object.entries(map).forEach(([id,icon]) => { const el=document.getElementById(id); if(el) el.src=CCTV_ICONS[icon]; });
  const di=document.getElementById('detail-img'); if(di) di.src=CCTV_ICONS.dome;
}
function initPromoImages() { const e1=document.getElementById('promo-img-zte'); const e2=document.getElementById('promo-img-hikvision'); const e3=document.getElementById('promo-img-tvt'); if(e1) e1.src=CCTV_ICONS.wireless; if(e2) e2.src=CCTV_ICONS.indoor; if(e3) e3.src=CCTV_ICONS.outdoor; }
initProductImages(); initPromoImages(); applyRandomDiscounts();
// ===== LACAK PESANAN =====
let orderHistory = [];
// allOrderHistory menyimpan SEMUA pesanan dari semua user — tidak direset saat logout
if (typeof allOrderHistory === 'undefined') var allOrderHistory = [];
function openLacakPesanan() {
  if (!requireLogin()) return;
  const container = document.getElementById('lacak-content');
  if (orderHistory.length === 0) {
    container.innerHTML = '<div class="lacak-empty"><div style="font-size:48px;margin-bottom:12px;">&#128230;</div><p style="color:#888;font-size:14px;">Belum ada pesanan</p></div>';
  } else {
    container.innerHTML = orderHistory.map((o, i) => {
      const done = o.fotoPenerimaan;
      const sudahKirim = !!o.fotoKirim;
      const statusLabel = done ? '&#10003; Selesai' : sudahKirim ? '&#128666; Dikirim' : '&#128260; Diproses';
      const statusClass = done ? 'status-selesai' : '';

      let html = '<div class="lacak-item">';
      // Header
      html += '<div class="lacak-item-header"><strong>Pesanan #' + String(i+1).padStart(3,'0') + '</strong><span class="lacak-status ' + statusClass + '">' + statusLabel + '</span></div>';
      // Body
      html += '<div class="lacak-item-body">';
      html += '<p><strong>' + o.barang + '</strong></p>';
      html += '<p>' + o.pembayaran + ' | ' + o.pengiriman + '</p>';
      html += '<p>Total: <strong style="color:#ff6f00;">' + o.total + '</strong></p>';
      html += '<p style="font-size:12px;color:#888;">' + o.waktu + '</p>';
      html += '</div>';
      // Timeline
      html += '<div class="lacak-timeline">';
      html += '<div class="lacak-step done">&#10003; Pesanan Dikonfirmasi</div>';
      html += '<div class="lacak-step done">&#10003; Pesanan Sedang Diproses</div>';
      html += '<div class="lacak-step ' + (sudahKirim||done ? 'done' : 'pending') + '">&#128666; Dalam Pengiriman</div>';
      html += '<div class="lacav-step ' + (done ? 'done' : 'pending') + '">&#127968; Diterima</div>';
      html += '</div>';
      // Bukti kirim dari penjual/admin
      if (sudahKirim) {
        html += '<div class="lacak-foto-wrap">';
        html += '<div class="lacak-foto-label">&#128666; Bukti Pengiriman ke Ekspedisi</div>';
        if (o.noresiKirim) html += '<div style="font-size:12px;color:#5b4fcf;font-weight:700;margin-bottom:6px;">No. Resi: ' + o.noresiKirim + '</div>';
        html += '<img src="' + o.fotoKirim + '" class="lacak-foto-preview" alt="Bukti kirim"/>';
        html += '<div style="font-size:11px;color:#aaa;margin-top:4px;">Dikirim: ' + (o.waktuKirim||'-') + '</div>';
        html += '</div>';
      }
      // Upload foto penerimaan
      if (done) {
        html += '<div class="lacak-foto-wrap"><div class="lacak-foto-label">&#128247; Foto Penerimaan Barang</div><img src="' + done + '" class="lacak-foto-preview" alt="Foto penerimaan"/></div>';
      } else {
        html += '<div class="lacak-terima-wrap"><label class="btn-upload-foto" for="foto-input-' + i + '">&#128247; Upload Foto Penerimaan</label><input type="file" id="foto-input-' + i + '" accept="image/*" style="display:none;" onchange="uploadFotoPenerimaan(this,' + i + ')"/><p style="font-size:11px;color:#aaa;margin-top:4px;">Upload foto saat barang diterima</p></div>';
      }
      html += '</div>';
      return html;
    }).join('');
  }
  openModal('modal-lacak');
}
function uploadFotoPenerimaan(input, idx) {
  const file = input.files[0]; if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('File harus berupa gambar!'); return; }
  if (file.size > 5*1024*1024) { showToast('Ukuran foto maksimal 5MB'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    // Update di allOrderHistory berdasarkan pembeli + index
    var myOrders = (typeof allOrderHistory !== 'undefined') ? allOrderHistory.filter(function(o){ return o.pembeli === currentUser; }) : orderHistory;
    if(myOrders[idx]) myOrders[idx].fotoPenerimaan = e.target.result;
    // Update orderHistory juga untuk kompatibilitas
    if(orderHistory[idx]) orderHistory[idx].fotoPenerimaan = e.target.result;
    showToast('Foto penerimaan berhasil diupload!');
    openLacakPesanan();
  };
  reader.readAsDataURL(file);
}
// ===== QRIS =====
function confirmQRIS() {
  closeModal('modal-qris');
  const total = checkoutItems.reduce((s,i) => s+i.price*i.qty, 0);
  const namaBarang = checkoutItems.map(i => i.name+' (x'+i.qty+')').join(', ');
  const now = new Date();
  const waktu = now.toLocaleDateString('id-ID')+' '+now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
  orderHistory.unshift({ barang: checkoutItems.map(i=>i.name+' x'+i.qty).join(', '), pembeli: currentUser, pembayaran:'QRIS', pengiriman:'-', total:'Rp'+total.toLocaleString('id-ID'), waktu, sumberProduk: checkoutItems.some(i=>i.sellerUsername)?'penjual':'resmi', sellerUsername: checkoutItems.find(i=>i.sellerUsername)?.sellerUsername||null });
  if (typeof allOrderHistory !== 'undefined') allOrderHistory.unshift(orderHistory[0]);
  checkoutItems.forEach(ci => { const idx=cart.findIndex(c=>c.name===ci.name); if(idx!==-1) cart.splice(idx,1); });
  updateCartBadge(); renderCart();
  document.getElementById('success-detail').innerHTML = '<p>Produk: <strong>'+namaBarang+'</strong></p><p>Pembayaran: <strong>QRIS</strong></p><p>Total: <strong style="color:#ff6f00;">Rp'+total.toLocaleString('id-ID')+'</strong></p><p style="color:#2e7d32;font-size:13px;">Pembayaran QRIS berhasil dikonfirmasi</p>';
  openModal('modal-success');
}
// ===== RATING =====
let selectedRating = 0;
const ratingLabels = ['','Sangat Buruk','Kurang Memuaskan','Cukup Bagus','Bagus!','Luar Biasa!'];
function setRating(val) { selectedRating=val; document.querySelectorAll('.star-btn').forEach((s,i)=>s.classList.toggle('active',i<val)); document.getElementById('rating-label').textContent=ratingLabels[val]; }
function submitRating() {
  if (!requireLogin()) return;
  if (selectedRating===0) { showToast('Pilih bintang terlebih dahulu!'); return; }
  const komentar = document.getElementById('rating-komentar').value.trim();
  if (!komentar) { showToast('Tulis komentar terlebih dahulu!'); return; }
  const stars = '&#11088;'.repeat(selectedRating);
  const initial = currentUser.charAt(0).toUpperCase();
  const colors = ['#e53935','#43a047','#1e88e5','#8e24aa','#ff6f00','#00838f'];
  const color = colors[currentUser.charCodeAt(0)%colors.length];
  const reviewsEl = document.getElementById('reviews-list');
  const card = document.createElement('div');
  card.className = 'review-card review-card-new';
  card.innerHTML = '<span class="rev-avatar" style="background:'+color+';">'+initial+'</span><strong>'+currentUser+'</strong><div>'+stars+'</div><p>'+komentar+'</p>';
  reviewsEl.appendChild(card);
  selectedRating=0; document.querySelectorAll('.star-btn').forEach(s=>s.classList.remove('active'));
  document.getElementById('rating-label').textContent='Pilih bintang di atas';
  document.getElementById('rating-komentar').value='';
  showToast('Ulasan berhasil dikirim! Terima kasih');
}
// ===== RANDOM DISKON =====
function applyRandomDiscounts() {
  const keys = Object.keys(productDetails);
  const opts = [5,7,8,10,12,15,20];
  const jumlah = 3+Math.floor(Math.random()*3);
  const shuffled = [...keys].sort(()=>Math.random()-0.5);
  const discounted = shuffled.slice(0,jumlah);
  keys.forEach(key => {
    const card=document.getElementById('card-'+key); if(!card) return;
    card.classList.remove('discount');
    const badge=card.querySelector('.badge'); if(badge) badge.remove();
    productDetails[key].price=productDetails[key].basePrice;
    const priceEl=document.getElementById('price-'+key); if(priceEl) priceEl.innerHTML='Rp'+productDetails[key].basePrice.toLocaleString('id-ID');
    const belikEl=document.getElementById('beli-'+key);
    if(belikEl) { const n=productDetails[key].name; const p=productDetails[key].basePrice; belikEl.onclick=(e)=>{e.stopPropagation();beliSekarang(n,p);}; }
  });
  discounted.forEach(key => {
    const pct=opts[Math.floor(Math.random()*opts.length)];
    const base=productDetails[key].basePrice;
    const disc=Math.round(base*(1-pct/100)/1000)*1000;
    productDetails[key].price=disc;
    const card=document.getElementById('card-'+key); if(!card) return;
    card.classList.add('discount');
    const badge=document.createElement('span'); badge.className='badge'; badge.textContent='-'+pct+'%'; card.insertBefore(badge,card.firstChild);
    const priceEl=document.getElementById('price-'+key);
    if(priceEl) priceEl.innerHTML='<span style="text-decoration:line-through;color:#aaa;font-size:12px;font-weight:400;">Rp'+base.toLocaleString('id-ID')+'</span> <span style="color:#e53935;font-weight:900;">Rp'+disc.toLocaleString('id-ID')+'</span>';
    const belikEl=document.getElementById('beli-'+key);
    if(belikEl) { const n=productDetails[key].name; belikEl.onclick=(e)=>{e.stopPropagation();beliSekarang(n,disc);}; }
  });
  initPromoImages();
}

// ===== FUNGSI YANG HILANG =====

// updateCoAlamat - dipanggil saat checkout dibuka
let daftarAlamat = [];
function getAlamatUtama() { return daftarAlamat.find(a=>a.utama) || daftarAlamat[0] || null; }
function formatAlamat(a) { if(!a) return '-'; return a.jalan+', '+a.kecamatan+', '+a.kota+', '+a.provinsi+' '+a.kodepos; }
function updateCoAlamat() { const el=document.getElementById('co-alamat-text'); if(!el) return; const a=getAlamatUtama(); el.textContent=a?formatAlamat(a):'Belum ada alamat - klik Ganti Alamat'; }
function openModalAlamat() { initNewAlamatDropdown(); renderAlamatList(); const f=document.getElementById('form-tambah-alamat'); if(f) f.style.display='none'; closeModal('modal-checkout'); openModal('modal-alamat'); }
function renderAlamatList() { const c=document.getElementById('alamat-list'); if(!c) return; if(daftarAlamat.length===0){c.innerHTML='<p style="color:#aaa;font-size:13px;text-align:center;padding:16px;">Belum ada alamat tersimpan</p>';return;} c.innerHTML=daftarAlamat.map((a,i)=>'<div class="alamat-card '+(a.utama?'alamat-utama':'')+'"><div class="alamat-card-header"><strong>'+(a.label||'Alamat '+(i+1))+'</strong>'+(a.utama?'<span class="badge-utama">Utama</span>':'<button class="btn-set-utama" onclick="setAlamatUtama('+i+')">Jadikan Utama</button>')+'</div><div class="alamat-card-body">'+formatAlamat(a)+'</div><div class="alamat-card-actions"><button class="btn-pilih-alamat" onclick="pilihAlamat('+i+')">Pilih Alamat Ini</button><button class="btn-hapus-alamat" onclick="hapusAlamat('+i+')">Hapus</button></div></div>').join(''); }
function showFormTambahAlamat() { const f=document.getElementById('form-tambah-alamat'); if(f) f.style.display=f.style.display==='none'?'block':'none'; initNewAlamatDropdown(); }
function simpanAlamatBaru() { const prov=document.getElementById('new-provinsi').value; const kota=document.getElementById('new-kota').value; const kec=document.getElementById('new-kecamatan').value; const kp=document.getElementById('new-kodepos').value; const jalan=document.getElementById('new-jalan').value.trim(); const label=document.getElementById('new-label').value.trim()||'Alamat '+(daftarAlamat.length+1); if(!prov||!kota||!kec||!kp){showToast('Lengkapi pilihan wilayah!');return;} if(!jalan){showToast('Isi nama jalan!');return;} const isFirst=daftarAlamat.length===0; daftarAlamat.push({label,provinsi:prov,kota,kecamatan:kec,kodepos:kp,jalan,utama:isFirst}); ['new-provinsi','new-jalan','new-label'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';}); ['new-kota','new-kecamatan','new-kodepos'].forEach(id=>{const el=document.getElementById(id);if(el){el.innerHTML='<option value="">--</option>';el.disabled=true;}}); const f=document.getElementById('form-tambah-alamat');if(f)f.style.display='none'; renderAlamatList(); updateCoAlamat(); showToast('Alamat berhasil disimpan!'); }
function setAlamatUtama(idx) { daftarAlamat.forEach((a,i)=>a.utama=(i===idx)); renderAlamatList(); updateCoAlamat(); showToast('Alamat utama diperbarui!'); }
function hapusAlamat(idx) { daftarAlamat.splice(idx,1); if(daftarAlamat.length>0&&!daftarAlamat.find(a=>a.utama)) daftarAlamat[0].utama=true; renderAlamatList(); updateCoAlamat(); showToast('Alamat dihapus'); }
function pilihAlamat(idx) { setAlamatUtama(idx); closeModal('modal-alamat'); openModal('modal-checkout'); }

// Wilayah dropdown - form daftar
function initWilayahDropdown() { const sel=document.getElementById('reg-provinsi'); if(!sel||sel.options.length>1) return; if(typeof WILAYAH==='undefined') return; Object.keys(WILAYAH).sort().forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p;sel.appendChild(o);}); }
function onProvinsiChange() { const p=document.getElementById('reg-provinsi').value; const ks=document.getElementById('reg-kota'); const kcs=document.getElementById('reg-kecamatan'); const kps=document.getElementById('reg-kodepos'); ks.innerHTML='<option value="">-- Pilih Kota/Kab --</option>'; kcs.innerHTML='<option value="">-- Pilih Kecamatan --</option>'; kps.innerHTML='<option value="">-- Kode Pos --</option>'; kcs.disabled=true; kps.disabled=true; if(!p){ks.disabled=true;return;} ks.disabled=false; if(typeof WILAYAH==='undefined') return; Object.keys(WILAYAH[p]).sort().forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k;ks.appendChild(o);}); }
function onKotaChange() { const p=document.getElementById('reg-provinsi').value; const k=document.getElementById('reg-kota').value; const kcs=document.getElementById('reg-kecamatan'); const kps=document.getElementById('reg-kodepos'); kcs.innerHTML='<option value="">-- Pilih Kecamatan --</option>'; kps.innerHTML='<option value="">-- Kode Pos --</option>'; kps.disabled=true; if(!k){kcs.disabled=true;return;} kcs.disabled=false; if(typeof WILAYAH==='undefined') return; Object.keys(WILAYAH[p][k]).sort().forEach(kc=>{const o=document.createElement('option');o.value=kc;o.textContent=kc;kcs.appendChild(o);}); }
function onKecamatanChange() { const p=document.getElementById('reg-provinsi').value; const k=document.getElementById('reg-kota').value; const kc=document.getElementById('reg-kecamatan').value; const kps=document.getElementById('reg-kodepos'); kps.innerHTML='<option value="">-- Kode Pos --</option>'; if(!kc){kps.disabled=true;return;} kps.disabled=false; if(typeof WILAYAH==='undefined') return; const list=WILAYAH[p][k][kc]||[]; list.forEach(kp=>{const o=document.createElement('option');o.value=kp;o.textContent=kp;kps.appendChild(o);}); if(list.length===1) kps.value=list[0]; }

// Wilayah dropdown - form tambah alamat baru
function initNewAlamatDropdown() { const sel=document.getElementById('new-provinsi'); if(!sel||sel.options.length>1) return; if(typeof WILAYAH==='undefined') return; Object.keys(WILAYAH).sort().forEach(p=>{const o=document.createElement('option');o.value=p;o.textContent=p;sel.appendChild(o);}); }
function onNewProvinsiChange() { const p=document.getElementById('new-provinsi').value; const ks=document.getElementById('new-kota'); const kcs=document.getElementById('new-kecamatan'); const kps=document.getElementById('new-kodepos'); ks.innerHTML='<option value="">-- Kota/Kab --</option>'; kcs.innerHTML='<option value="">-- Kecamatan --</option>'; kps.innerHTML='<option value="">-- Kode Pos --</option>'; kcs.disabled=true; kps.disabled=true; if(!p){ks.disabled=true;return;} ks.disabled=false; if(typeof WILAYAH==='undefined') return; Object.keys(WILAYAH[p]).sort().forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k;ks.appendChild(o);}); }
function onNewKotaChange() { const p=document.getElementById('new-provinsi').value; const k=document.getElementById('new-kota').value; const kcs=document.getElementById('new-kecamatan'); const kps=document.getElementById('new-kodepos'); kcs.innerHTML='<option value="">-- Kecamatan --</option>'; kps.innerHTML='<option value="">-- Kode Pos --</option>'; kps.disabled=true; if(!k){kcs.disabled=true;return;} kcs.disabled=false; if(typeof WILAYAH==='undefined') return; Object.keys(WILAYAH[p][k]).sort().forEach(kc=>{const o=document.createElement('option');o.value=kc;o.textContent=kc;kcs.appendChild(o);}); }
function onNewKecamatanChange() { const p=document.getElementById('new-provinsi').value; const k=document.getElementById('new-kota').value; const kc=document.getElementById('new-kecamatan').value; const kps=document.getElementById('new-kodepos'); kps.innerHTML='<option value="">-- Kode Pos --</option>'; if(!kc){kps.disabled=true;return;} kps.disabled=false; if(typeof WILAYAH==='undefined') return; const list=WILAYAH[p][k][kc]||[]; list.forEach(kp=>{const o=document.createElement('option');o.value=kp;o.textContent=kp;kps.appendChild(o);}); if(list.length===1) kps.value=list[0]; }

// sendChatAdmin (shared thread)
const sharedChatThreads = {};
let activeChatUser = null;
function openChatSesuaiRole() { if(isAdmin){openChatPelangganList();}else{openModal('modal-chat-admin');updateChatAdminStatus('chat-admin-status-umum');renderSharedChat();} }
function renderSharedChat() { const c=document.getElementById('chat-messages-admin'); const key=currentUser||'Tamu'; const msgs=sharedChatThreads[key]||[]; if(msgs.length===0){c.innerHTML='<div style="text-align:center;color:#aaa;padding:20px;font-size:13px;">Mulai percakapan dengan Admin Moentaz ProVision</div>';}else{c.innerHTML=msgs.map(m=>'<div class="chat-msg '+(m.fromAdmin?'':'mine')+'">'+m.text.replace(/\n/g,'<br>')+'<span style="font-size:10px;color:#aaa;display:block;text-align:right;">'+m.waktu+'</span></div>').join('');} c.scrollTop=c.scrollHeight; }
function sendChatAdmin() { const input=document.getElementById('chat-input-admin'); const msg=input.value.trim(); if(!msg) return; const key=currentUser||'Tamu'; const waktu=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}); if(!sharedChatThreads[key]) sharedChatThreads[key]=[]; sharedChatThreads[key].push({text:msg,fromAdmin:false,waktu}); renderSharedChat(); input.value=''; allChatMessages.push({from:key,productName:'Umum',text:msg,waktu,read:false}); adminNotifications.push({type:'chat',from:key,productName:'Umum',text:msg,waktu,read:false}); updateAdminNotifBadge(); if(!adminOnline){setTimeout(()=>{const r=getAdminReply(msg,null); sharedChatThreads[key].push({text:r,fromAdmin:true,waktu:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}); renderSharedChat();},1000);} }
function openChatPelangganList() { allChatMessages.forEach(m=>{if(!sharedChatThreads[m.from]) sharedChatThreads[m.from]=[];}); const all=[...new Set([...Object.keys(sharedChatThreads),...allChatMessages.map(m=>m.from)])]; if(all.length===0){showToast('Belum ada pesan dari pelanggan');return;} openAdminPanel(); switchAdminTab('chat'); }
function openChatPelanggan(username) { activeChatUser=username; if(!sharedChatThreads[username]) sharedChatThreads[username]=[]; const lbl=document.getElementById('chat-pelanggan-label'); if(lbl) lbl.textContent='Percakapan dengan '+username; renderChatPelanggan(); closeModal('modal-admin'); openModal('modal-chat-pelanggan'); }
function renderChatPelanggan() { const c=document.getElementById('chat-messages-pelanggan'); const msgs=sharedChatThreads[activeChatUser]||[]; if(msgs.length===0){c.innerHTML='<div style="text-align:center;color:#aaa;padding:20px;font-size:13px;">Belum ada pesan dari '+activeChatUser+'</div>';}else{c.innerHTML=msgs.map(m=>'<div class="chat-msg '+(m.fromAdmin?'mine':'')+'">'+m.text.replace(/\n/g,'<br>')+'<span style="font-size:10px;color:#aaa;display:block;text-align:right;">'+m.waktu+'</span></div>').join('');} c.scrollTop=c.scrollHeight; }
function sendChatPelanggan() { if(!activeChatUser) return; const input=document.getElementById('chat-input-pelanggan'); const msg=input.value.trim(); if(!msg) return; const waktu=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}); if(!sharedChatThreads[activeChatUser]) sharedChatThreads[activeChatUser]=[]; sharedChatThreads[activeChatUser].push({text:msg,fromAdmin:true,waktu}); renderChatPelanggan(); input.value=''; showToast('Pesan terkirim ke '+activeChatUser); }
document.addEventListener('DOMContentLoaded',()=>{ const ip=document.getElementById('chat-input-pelanggan'); if(ip) ip.addEventListener('keydown',e=>{if(e.key==='Enter') sendChatPelanggan();}); initWilayahDropdown(); });
if(document.readyState!=='loading') initWilayahDropdown();

// Panel Admin
function openAdminPanel() { if(!isAdmin){showToast('Akses ditolak!');return;} renderAdminPanel(); openModal('modal-admin'); }
function renderAdminPanel() { const u=adminNotifications.filter(n=>!n.read).length; const b=document.getElementById('admin-notif-badge'); if(b) b.textContent=u>0?u:''; const t=document.getElementById('admin-active-tab'); renderAdminTab(t?t.value:'users'); }
function renderAdminTab(tab) {
  const content=document.getElementById('admin-content'); if(!content) return;
  if(tab==='users') {
    if(registeredUsers.length===0){content.innerHTML='<div class="admin-empty">Belum ada pengguna yang mendaftar</div>';return;}
    content.innerHTML=registeredUsers.map((u,i)=>'<div class="admin-user-card"><div class="admin-user-header"><span class="admin-user-avatar">'+u.username.charAt(0).toUpperCase()+'</span><div><strong>'+u.username+'</strong><div style="font-size:11px;color:#888;">Daftar: '+u.terdaftar+'</div></div><span class="admin-user-num">#'+String(i+1).padStart(3,'0')+'</span></div><div class="admin-user-detail"><div>Email: '+u.email+'</div><div>Telpon: '+u.telpon+'</div><div>Alamat: '+u.alamat+'</div></div></div>').join('');
  } else if(tab==='chat') {
    adminNotifications.filter(n=>n.type==='chat').forEach(n=>n.read=true); updateAdminNotifBadge();
    const users=[...new Set(allChatMessages.map(m=>m.from))];
    if(users.length===0){content.innerHTML='<div class="admin-empty">Belum ada pesan masuk</div>';return;}
    content.innerHTML=users.map(u=>{const msgs=allChatMessages.filter(m=>m.from===u); const last=msgs[msgs.length-1]; const unread=msgs.filter(m=>!m.read).length; return '<div class="admin-chat-item"><div class="admin-chat-from"><span class="admin-user-avatar" style="width:28px;height:28px;font-size:12px;">'+u.charAt(0).toUpperCase()+'</span><div style="flex:1;"><strong>'+u+'</strong><div style="font-size:11px;color:#555;margin-top:2px;">'+last.text.substring(0,40)+(last.text.length>40?'...':'')+'</div></div>'+(unread>0?'<span style="background:#e53935;color:white;font-size:10px;padding:2px 7px;border-radius:10px;">'+unread+' baru</span>':'')+'<span style="font-size:11px;color:#aaa;">'+last.waktu+'</span></div><div style="padding:8px 14px;background:white;"><button class="admin-reply-btn" onclick="openChatPelanggan(\''+u+'\')">Balas</button></div></div>';}).join('');
  } else if(tab==='notif') {
    adminNotifications.filter(n=>n.type!=='chat').forEach(n=>n.read=true); updateAdminNotifBadge();
    const nc=adminNotifications.filter(n=>n.type!=='chat');
    if(nc.length===0){content.innerHTML='<div class="admin-empty">Belum ada notifikasi</div>';return;}
    content.innerHTML=nc.slice().reverse().map(n=>{
      if(n.type==='konfirm_kirim'){
        const d=n.data;
        const aIdx=notifPengirimanAdmin.indexOf(d);
        return '<div class="admin-notif-item" style="flex-direction:column;align-items:flex-start;gap:8px;">' +
          '<div style="display:flex;gap:8px;align-items:center;"><span style="font-size:20px;">&#128666;</span>' +
          '<div><strong>Konfirmasi Kirim dari Penjual</strong>' +
          '<div style="font-size:12px;color:#555;">Pesanan #'+(String((d.pesananIdx||0)+1).padStart(3,'0'))+(d.noresi?' | Resi: '+d.noresi:'')+'</div>' +
          '<div style="font-size:11px;color:#aaa;">'+d.waktu+'</div></div></div>' +
          '<img src="'+d.foto+'" style="width:100%;border-radius:8px;" alt="Foto paket"/>' +
          (d.sudahDiteruskan
            ? '<span style="color:#2e7d32;font-size:12px;font-weight:700;">&#10003; Sudah diteruskan ke pembeli</span>'
            : '<button class="seller-btn-primary" style="width:100%;" onclick="adminTeruskankonfirmasi('+aIdx+')">&#128666; Teruskan ke Pembeli</button>') +
        '</div>';
      }
      if(!n.data||!n.data.username) return '';
      return '<div class="admin-notif-item"><span style="font-size:20px;">&#128226;</span><div><strong>Pengguna baru mendaftar</strong><div style="font-size:12px;color:#555;">'+n.data.username+' - '+n.data.email+'</div><div style="font-size:11px;color:#aaa;">'+n.data.terdaftar+'</div></div></div>';
    }).join('');
  }
}
function switchAdminTab(tab) { const t=document.getElementById('admin-active-tab'); if(t) t.value=tab; document.querySelectorAll('.admin-tab').forEach(el=>el.classList.remove('active')); const btn=document.getElementById('tab-'+tab); if(btn) btn.classList.add('active'); renderAdminTab(tab); }

// ===== SISTEM PENJUAL =====
let registeredSellers = [];
let currentSeller = null;
let isSellerLoggedIn = false;

// Tab login pembeli/penjual
function switchLoginTab(tab) {
  document.getElementById('form-login-pembeli').style.display = tab === 'pembeli' ? 'block' : 'none';
  document.getElementById('form-login-penjual').style.display = tab === 'penjual' ? 'block' : 'none';
  document.getElementById('tab-login-pembeli').classList.toggle('active', tab === 'pembeli');
  document.getElementById('tab-login-penjual').classList.toggle('active', tab === 'penjual');
}

// Dropdown wilayah untuk form penjual
function onSellerProvinsiChange() {
  const p = document.getElementById('seller-provinsi').value;
  const ks = document.getElementById('seller-kota');
  const kcs = document.getElementById('seller-kecamatan');
  const kps = document.getElementById('seller-kodepos');
  ks.innerHTML = '<option value="">-- Pilih Kota/Kab --</option>';
  kcs.innerHTML = '<option value="">-- Pilih Kecamatan --</option>';
  kps.innerHTML = '<option value="">-- Kode Pos --</option>';
  kcs.disabled = true; kps.disabled = true;
  if (!p) { ks.disabled = true; return; }
  ks.disabled = false;
  if (typeof WILAYAH === 'undefined') return;
  Object.keys(WILAYAH[p]).sort().forEach(k => { const o = document.createElement('option'); o.value = k; o.textContent = k; ks.appendChild(o); });
}
function onSellerKotaChange() {
  const p = document.getElementById('seller-provinsi').value;
  const k = document.getElementById('seller-kota').value;
  const kcs = document.getElementById('seller-kecamatan');
  const kps = document.getElementById('seller-kodepos');
  kcs.innerHTML = '<option value="">-- Pilih Kecamatan --</option>';
  kps.innerHTML = '<option value="">-- Kode Pos --</option>';
  kps.disabled = true;
  if (!k) { kcs.disabled = true; return; }
  kcs.disabled = false;
  if (typeof WILAYAH === 'undefined') return;
  Object.keys(WILAYAH[p][k]).sort().forEach(kc => { const o = document.createElement('option'); o.value = kc; o.textContent = kc; kcs.appendChild(o); });
}
function onSellerKecamatanChange() {
  const p = document.getElementById('seller-provinsi').value;
  const k = document.getElementById('seller-kota').value;
  const kc = document.getElementById('seller-kecamatan').value;
  const kps = document.getElementById('seller-kodepos');
  kps.innerHTML = '<option value="">-- Kode Pos --</option>';
  if (!kc) { kps.disabled = true; return; }
  kps.disabled = false;
  if (typeof WILAYAH === 'undefined') return;
  const list = WILAYAH[p][k][kc] || [];
  list.forEach(kp => { const o = document.createElement('option'); o.value = kp; o.textContent = kp; kps.appendChild(o); });
  if (list.length === 1) kps.value = list[0];
}

// Init dropdown wilayah penjual
function initSellerWilayah() {
  const sel = document.getElementById('seller-provinsi');
  if (!sel || sel.options.length > 1) return;
  if (typeof WILAYAH === 'undefined') return;
  Object.keys(WILAYAH).sort().forEach(p => { const o = document.createElement('option'); o.value = p; o.textContent = p; sel.appendChild(o); });
}

// Daftar penjual
function doDaftarPenjual() {
  const namaToko = document.getElementById('seller-nama-toko').value.trim();
  const username = document.getElementById('seller-username').value.trim();
  const email    = document.getElementById('seller-email').value.trim();
  const telpon   = document.getElementById('seller-telpon').value.trim();
  const provinsi = document.getElementById('seller-provinsi').value;
  const kota     = document.getElementById('seller-kota').value;
  const kecamatan= document.getElementById('seller-kecamatan').value;
  const kodepos  = document.getElementById('seller-kodepos').value;
  const jalan    = document.getElementById('seller-alamat-jalan').value.trim();
  const deskripsi= document.getElementById('seller-deskripsi').value.trim();
  const pass1    = document.getElementById('seller-password').value;
  const pass2    = document.getElementById('seller-password2').value;
  const errEl    = document.getElementById('seller-reg-error');
  const showErr  = (msg) => { errEl.textContent = msg; errEl.style.display = 'block'; };

  if (!namaToko || !username || !email || !telpon || !pass1 || !pass2) return showErr('Semua field wajib diisi.');
  if (!provinsi || !kota || !kecamatan || !kodepos) return showErr('Pilih lokasi toko (Provinsi, Kota, Kecamatan, Kode Pos).');
  if (!jalan) return showErr('Isi alamat lengkap toko.');
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return showErr('Username hanya boleh huruf, angka, dan underscore.');
  if (username.length < 3) return showErr('Username minimal 3 karakter.');
  if (registeredSellers.find(s => s.username === username)) return showErr('Username toko sudah digunakan.');
  if (!email.endsWith('@gmail.com')) return showErr('Email harus @gmail.com.');
  if (!/^[0-9+\-\s]+$/.test(telpon)) return showErr('Nomor telepon hanya boleh angka.');
  if (telpon.replace(/\D/g,'').length < 9) return showErr('Nomor telepon minimal 9 digit.');
  if (pass1.length < 8) return showErr('Password minimal 8 karakter.');
  if (!/[A-Z]/.test(pass1)) return showErr('Password harus ada huruf kapital.');
  if (!/[0-9]/.test(pass1)) return showErr('Password harus ada angka.');
  if (!/[.,\-_]/.test(pass1)) return showErr('Password harus ada tanda: . , - _');
  if (pass1 !== pass2) return showErr('Password tidak cocok.');

  errEl.style.display = 'none';
  const newSeller = {
    namaToko, username, email, telpon, provinsi, kota, kecamatan, kodepos, jalan, deskripsi,
    password: pass1, produk: [], pesananMasuk: [],
    terdaftar: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
  };
  registeredSellers.push(newSeller);
  adminNotifications.push({ type: 'seller_baru', data: newSeller });
  updateAdminNotifBadge();

  // Auto login setelah daftar
  currentSeller = newSeller;
  isSellerLoggedIn = true;
  closeModal('modal-daftar-penjual');
  openDashboardPenjual();
  showToast('Toko ' + namaToko + ' berhasil didaftarkan!');
}

// Login penjual
function doLoginPenjual() {
  const username = document.getElementById('seller-login-username').value.trim();
  const email    = document.getElementById('seller-login-email').value.trim();
  const password = document.getElementById('seller-login-password').value;
  const errEl    = document.getElementById('seller-login-error');

  const found = registeredSellers.find(s => s.username === username && s.email === email && s.password === password);
  if (found) {
    currentSeller = found;
    isSellerLoggedIn = true;
    errEl.style.display = 'none';
    closeModal('modal-masuk');
    openDashboardPenjual();
    showToast('Selamat datang, ' + found.namaToko + '!');
  } else {
    const exists = registeredSellers.find(s => s.username === username || s.email === email);
    errEl.textContent = exists ? 'Username atau password salah.' : 'Akun toko tidak ditemukan. Silakan daftar terlebih dahulu.';
    errEl.style.display = 'block';
  }
}

// Logout penjual
function doLogoutPenjual() {
  currentSeller = null;
  isSellerLoggedIn = false;
  closeModal('modal-dashboard-penjual');
  showToast('Berhasil keluar dari akun toko.');
}

// Buka dashboard penjual
function openDashboardPenjual() {
  if (!currentSeller) return;
  document.getElementById('seller-dash-name').textContent = currentSeller.namaToko;
  document.getElementById('seller-dash-username').textContent = '@' + currentSeller.username;
  document.getElementById('seller-stat-produk').textContent = currentSeller.produk.length;
  document.getElementById('seller-stat-pesanan').textContent = currentSeller.pesananMasuk.length;
  document.getElementById('seller-section-content').innerHTML = '';
  openModal('modal-dashboard-penjual');
}

// Tampilkan section dashboard
function showSellerSection(section) {
  const content = document.getElementById('seller-section-content');
  if (section === 'produk') {
    renderSellerProduk(content);
  } else if (section === 'pesanan') {
    renderSellerPesanan(content);
  } else if (section === 'profil') {
    renderSellerProfil(content);
  }
}

// Render daftar produk penjual
function renderSellerProduk(container) {
  let html = '<div class="seller-section-title">📦 Produk Saya</div>';
  html += '<button class="seller-btn-tambah" onclick="showFormTambahProduk()">+ Tambah Produk Baru</button>';
  html += '<div id="seller-form-produk" style="display:none;">' + formTambahProdukHTML() + '</div>';
  if (currentSeller.produk.length === 0) {
    html += '<div class="seller-empty">Belum ada produk. Tambahkan produk pertamamu!</div>';
  } else {
    html += '<div class="seller-produk-list">' + currentSeller.produk.map((p, i) => `
      <div class="seller-produk-card">
        <div class="seller-produk-info">
          <strong>${p.nama}</strong>
          <div style="font-size:12px;color:#888;">${p.kategori}</div>
          <div style="color:#ff6f00;font-weight:800;">Rp${parseInt(p.harga).toLocaleString('id-ID')}</div>
          <div style="font-size:11px;color:#555;">Stok: ${p.stok} | ${p.kondisi}</div>
        </div>
        <div class="seller-produk-actions">
          <button class="seller-btn-edit" onclick="editProdukPenjual(${i})">✏️ Edit</button>
          <button class="seller-btn-hapus" onclick="hapusProdukPenjual(${i})">🗑️ Hapus</button>
        </div>
      </div>`).join('') + '</div>';
  }
  container.innerHTML = html;
}

function formTambahProdukHTML(p, idx) {
  const isEdit = p !== undefined;
  return `
    <div class="seller-form-produk-wrap">
      <div class="seller-section-title">${isEdit ? '✏️ Edit Produk' : '➕ Tambah Produk'}</div>
      <div class="form-group"><input type="text" id="sp-nama" placeholder="Nama Produk" value="${isEdit ? p.nama : ''}"/><span>📦</span></div>
      <div class="form-group">
        <select id="sp-kategori" style="flex:1;padding:12px 14px;border:none;outline:none;background:transparent;font-size:14px;">
          <option value="">-- Pilih Kategori --</option>
          <option value="CCTV Outdoor" ${isEdit&&p.kategori==='CCTV Outdoor'?'selected':''}>CCTV Outdoor</option>
          <option value="CCTV Indoor" ${isEdit&&p.kategori==='CCTV Indoor'?'selected':''}>CCTV Indoor</option>
          <option value="CCTV PTZ" ${isEdit&&p.kategori==='CCTV PTZ'?'selected':''}>CCTV PTZ</option>
          <option value="CCTV Wireless" ${isEdit&&p.kategori==='CCTV Wireless'?'selected':''}>CCTV Wireless</option>
          <option value="Aksesoris CCTV" ${isEdit&&p.kategori==='Aksesoris CCTV'?'selected':''}>Aksesoris CCTV</option>
          <option value="Lainnya" ${isEdit&&p.kategori==='Lainnya'?'selected':''}>Lainnya</option>
        </select>
        <span>🏷️</span>
      </div>
      <div class="form-group"><input type="number" id="sp-harga" placeholder="Harga (Rp)" value="${isEdit ? p.harga : ''}"/><span>💰</span></div>
      <div class="form-group"><input type="number" id="sp-stok" placeholder="Jumlah Stok" value="${isEdit ? p.stok : ''}"/><span>📊</span></div>
      <div class="form-group">
        <select id="sp-kondisi" style="flex:1;padding:12px 14px;border:none;outline:none;background:transparent;font-size:14px;">
          <option value="Baru" ${isEdit&&p.kondisi==='Baru'?'selected':''}>Baru</option>
          <option value="Bekas" ${isEdit&&p.kondisi==='Bekas'?'selected':''}>Bekas</option>
        </select>
        <span>✅</span>
      </div>
      <textarea id="sp-deskripsi" placeholder="Deskripsi produk..." rows="3" style="width:100%;border:1px solid #ccc;border-radius:6px;padding:10px;font-size:13px;font-family:inherit;resize:none;outline:none;box-sizing:border-box;margin-bottom:8px;">${isEdit ? p.deskripsi : ''}</textarea>
      <div style="display:flex;gap:8px;">
        <button class="cpay-btn" onclick="${isEdit ? 'simpanEditProduk('+idx+')' : 'simpanProdukBaru()'}">${isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}</button>
        <button class="cpay-btn" style="background:#aaa;" onclick="tutupFormProduk()">Batal</button>
      </div>
    </div>`;
}

function showFormTambahProduk() {
  const f = document.getElementById('seller-form-produk');
  if (f) { f.style.display = 'block'; f.innerHTML = formTambahProdukHTML(); f.scrollIntoView({ behavior:'smooth' }); }
}

function tutupFormProduk() {
  const f = document.getElementById('seller-form-produk');
  if (f) f.style.display = 'none';
}

function simpanProdukBaru() {
  const nama      = document.getElementById('sp-nama').value.trim();
  const kategori  = document.getElementById('sp-kategori').value;
  const harga     = document.getElementById('sp-harga').value;
  const stok      = document.getElementById('sp-stok').value;
  const kondisi   = document.getElementById('sp-kondisi').value;
  const deskripsi = document.getElementById('sp-deskripsi').value.trim();
  if (!nama || !kategori || !harga || !stok) { showToast('Lengkapi semua field produk!'); return; }
  if (parseInt(harga) <= 0) { showToast('Harga harus lebih dari 0'); return; }
  currentSeller.produk.push({ nama, kategori, harga: parseInt(harga), stok: parseInt(stok), kondisi, deskripsi, terjual: 0 });
  document.getElementById('seller-stat-produk').textContent = currentSeller.produk.length;
  showToast('Produk "' + nama + '" berhasil ditambahkan!');
  showSellerSection('produk');
}

function editProdukPenjual(idx) {
  const p = currentSeller.produk[idx];
  const f = document.getElementById('seller-form-produk');
  if (f) { f.style.display = 'block'; f.innerHTML = formTambahProdukHTML(p, idx); f.scrollIntoView({ behavior:'smooth' }); }
}

function simpanEditProduk(idx) {
  const nama      = document.getElementById('sp-nama').value.trim();
  const kategori  = document.getElementById('sp-kategori').value;
  const harga     = document.getElementById('sp-harga').value;
  const stok      = document.getElementById('sp-stok').value;
  const kondisi   = document.getElementById('sp-kondisi').value;
  const deskripsi = document.getElementById('sp-deskripsi').value.trim();
  if (!nama || !kategori || !harga || !stok) { showToast('Lengkapi semua field!'); return; }
  currentSeller.produk[idx] = { ...currentSeller.produk[idx], nama, kategori, harga: parseInt(harga), stok: parseInt(stok), kondisi, deskripsi };
  showToast('Produk berhasil diperbarui!');
  showSellerSection('produk');
}

function hapusProdukPenjual(idx) {
  const nama = currentSeller.produk[idx].nama;
  currentSeller.produk.splice(idx, 1);
  document.getElementById('seller-stat-produk').textContent = currentSeller.produk.length;
  showToast('Produk "' + nama + '" dihapus.');
  showSellerSection('produk');
}

// Render pesanan masuk
function renderSellerPesanan(container) {
  let html = '<div class="seller-section-title">📋 Pesanan Masuk</div>';
  if (currentSeller.pesananMasuk.length === 0) {
    html += '<div class="seller-empty">Belum ada pesanan masuk.</div>';
  } else {
    html += currentSeller.pesananMasuk.map((p, i) => `
      <div class="seller-pesanan-card">
        <div class="seller-pesanan-header">
          <strong>Pesanan #${String(i+1).padStart(3,'0')}</strong>
          <span class="seller-pesanan-status ${p.status === 'Selesai' ? 'status-selesai' : ''}">${p.status}</span>
        </div>
        <div style="padding:10px 14px;font-size:13px;">
          <p>Produk: <strong>${p.produk}</strong></p>
          <p>Pembeli: ${p.pembeli} | Total: <strong style="color:#ff6f00;">${p.total}</strong></p>
          <p style="font-size:11px;color:#888;">${p.waktu}</p>
        </div>
      </div>`).join('');
  }
  container.innerHTML = html;
}

// Render profil toko
function renderSellerProfil(container) {
  const s = currentSeller;
  container.innerHTML = `
    <div class="seller-section-title">⚙️ Profil Toko</div>
    <div class="seller-profil-wrap">
      <div class="seller-profil-row"><span>🏪 Nama Toko</span><strong>${s.namaToko}</strong></div>
      <div class="seller-profil-row"><span>👤 Username</span><strong>@${s.username}</strong></div>
      <div class="seller-profil-row"><span>✉️ Email</span><strong>${s.email}</strong></div>
      <div class="seller-profil-row"><span>📞 Telepon</span><strong>${s.telpon}</strong></div>
      <div class="seller-profil-row"><span>📍 Lokasi</span><strong>${s.kecamatan}, ${s.kota}, ${s.provinsi}</strong></div>
      <div class="seller-profil-row"><span>🏠 Alamat</span><strong>${s.jalan}</strong></div>
      <div class="seller-profil-row"><span>📅 Bergabung</span><strong>${s.terdaftar}</strong></div>
      ${s.deskripsi ? '<div class="seller-profil-row"><span>📝 Deskripsi</span><strong>'+s.deskripsi+'</strong></div>' : ''}
    </div>`;
}

// Init wilayah penjual saat modal dibuka
document.addEventListener('DOMContentLoaded', () => {
  const btnDaftarPenjual = document.getElementById('modal-daftar-penjual');
  if (btnDaftarPenjual) {
    btnDaftarPenjual.addEventListener('click', function(e) {
      if (e.target === this) return;
      initSellerWilayah();
    });
  }
});

// ===== UPGRADE SISTEM PENJUAL =====

// Saldo penjual
function getSellerSaldo() { return currentSeller ? (currentSeller.saldo || 0) : 0; }
function updateSellerSaldoDisplay() {
  if (!currentSeller) return;
  const s = currentSeller.saldo || 0;
  const el = document.getElementById('seller-saldo-display');
  if (el) el.textContent = 'Rp' + s.toLocaleString('id-ID');
}

// Buka dashboard penjual (override)
function openDashboardPenjual() {
  if (!currentSeller) return;
  if (!currentSeller.saldo) currentSeller.saldo = 0;
  if (!currentSeller.riwayatKeuangan) currentSeller.riwayatKeuangan = [];
  if (!currentSeller.promosi) currentSeller.promosi = [];
  document.getElementById('seller-dash-name').textContent = currentSeller.namaToko;
  document.getElementById('seller-dash-username').textContent = '@' + currentSeller.username;
  document.getElementById('seller-stat-produk').textContent = currentSeller.produk.length;
  document.getElementById('seller-stat-pesanan').textContent = currentSeller.pesananMasuk.length;
  const totalPendapatan = (currentSeller.riwayatKeuangan || []).filter(r => r.type === 'masuk').reduce((s, r) => s + r.nominal, 0);
  document.getElementById('seller-stat-pendapatan').textContent = 'Rp' + totalPendapatan.toLocaleString('id-ID');
  updateSellerSaldoDisplay();
  // Cek pesanan baru
  const pesananBaru = (currentSeller.pesananMasuk || []).filter(p => !p.dibaca).length;
  const badge = document.getElementById('seller-pesanan-badge');
  if (badge) { badge.textContent = pesananBaru; badge.style.display = pesananBaru > 0 ? 'inline-flex' : 'none'; }
  showSellerSection('produk');
  openModal('modal-dashboard-penjual');
}

// Switch tab
function showSellerSection(section) {
  const content = document.getElementById('seller-section-content');
  document.querySelectorAll('.seller-tab-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.getElementById('stab-' + section);
  if (activeBtn) activeBtn.classList.add('active');
  if (section === 'produk')    renderSellerProduk(content);
  else if (section === 'pesanan')   renderSellerPesananUpgrade(content);
  else if (section === 'keuangan')  renderSellerKeuangan(content);
  else if (section === 'promosi')   renderSellerPromosi(content);
  else if (section === 'ulasan')    renderSellerUlasan(content);
  else if (section === 'profil')    renderSellerProfil(content);
  else if (section === 'saldo')     renderSellerSaldo(content);
}

// ===== PESANAN MASUK (UPGRADE) =====
function renderSellerPesananUpgrade(container) {
  const pesanan = currentSeller.pesananMasuk || [];
  // Tandai semua sudah dibaca
  pesanan.forEach(p => p.dibaca = true);
  const badge = document.getElementById('seller-pesanan-badge');
  if (badge) badge.style.display = 'none';

  let html = '<div class="seller-section-title">📋 Pesanan Masuk</div>';
  // Filter tabs
  html += '<div class="seller-filter-tabs">';
  html += '<button class="seller-filter-btn active" onclick="filterPesananPenjual(this,\'semua\')">Semua</button>';
  html += '<button class="seller-filter-btn" onclick="filterPesananPenjual(this,\'Menunggu\')">Menunggu</button>';
  html += '<button class="seller-filter-btn" onclick="filterPesananPenjual(this,\'Diproses\')">Diproses</button>';
  html += '<button class="seller-filter-btn" onclick="filterPesananPenjual(this,\'Dikirim\')">Dikirim</button>';
  html += '<button class="seller-filter-btn" onclick="filterPesananPenjual(this,\'Selesai\')">Selesai</button>';
  html += '</div>';
  html += '<div id="seller-pesanan-list">' + renderPesananList(pesanan) + '</div>';
  container.innerHTML = html;
}

function renderPesananList(list) {
  if (list.length === 0) return '<div class="seller-empty">Belum ada pesanan masuk.</div>';
  return list.map((p, i) => {
    const statusColor = { 'Menunggu':'#ff6f00', 'Diproses':'#1e88e5', 'Dikirim':'#8e24aa', 'Selesai':'#2e7d32', 'Dibatalkan':'#e53935' };
    const color = statusColor[p.status] || '#888';
    return '<div class="seller-pesanan-card">' +
      '<div class="seller-pesanan-header">' +
        '<strong>Pesanan #' + String(i+1).padStart(3,'0') + '</strong>' +
        '<span class="seller-pesanan-status" style="background:' + color + '20;color:' + color + ';">' + p.status + '</span>' +
      '</div>' +
      '<div style="padding:10px 14px;font-size:13px;">' +
        '<p>Produk: <strong>' + p.produk + '</strong></p>' +
        '<p>Pembeli: <strong>' + p.pembeli + '</strong> | Qty: ' + (p.qty||1) + '</p>' +
        '<p>Pembayaran: <strong>' + p.metodePembayaran + '</strong></p>' +
        '<p>Total: <strong style="color:#ff6f00;">' + p.total + '</strong></p>' +
        '<p style="font-size:11px;color:#888;">' + p.waktu + '</p>' +
      '</div>' +
      (p.status === 'Menunggu' ?
        '<div style="padding:0 14px 12px;display:flex;gap:8px;">' +
          '<button class="seller-btn-edit" onclick="updateStatusPesanan(' + i + ',\'Diproses\')">Proses Pesanan</button>' +
          '<button class="seller-btn-hapus" onclick="updateStatusPesanan(' + i + ',\'Dibatalkan\')">Tolak</button>' +
        '</div>' : '') +
      (p.status === 'Diproses' ?
        '<div style="padding:0 14px 12px;">' +
          '<button class="seller-btn-edit" onclick="updateStatusPesanan(' + i + ',\'Dikirim\')">&#128666; Tandai Dikirim</button>' +
        '</div>' : '') +
    '</div>';
  }).join('');
}

function filterPesananPenjual(btn, status) {
  document.querySelectorAll('.seller-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const list = status === 'semua' ? currentSeller.pesananMasuk : currentSeller.pesananMasuk.filter(p => p.status === status);
  const el = document.getElementById('seller-pesanan-list');
  if (el) el.innerHTML = renderPesananList(list);
}

function updateStatusPesanan(idx, status) {
  currentSeller.pesananMasuk[idx].status = status;
  if (status === 'Dikirim' || status === 'Selesai') {
    const p = currentSeller.pesananMasuk[idx];
    const nominal = parseInt((p.total || 'Rp0').replace(/[^0-9]/g,''));
    if (!currentSeller.riwayatKeuangan) currentSeller.riwayatKeuangan = [];
    if (status === 'Selesai') {
      currentSeller.saldo = (currentSeller.saldo || 0) + nominal;
      currentSeller.riwayatKeuangan.unshift({ type:'masuk', ket:'Penjualan: '+p.produk, nominal, waktu: new Date().toLocaleString('id-ID') });
      updateSellerSaldoDisplay();
      document.getElementById('seller-stat-pendapatan').textContent = 'Rp' + currentSeller.riwayatKeuangan.filter(r=>r.type==='masuk').reduce((s,r)=>s+r.nominal,0).toLocaleString('id-ID');
    }
  }
  showToast('Status pesanan diperbarui: ' + status);
  showSellerSection('pesanan');
}

// ===== KEUANGAN =====
function renderSellerKeuangan(container) {
  const saldo = currentSeller.saldo || 0;
  const riwayat = currentSeller.riwayatKeuangan || [];
  const totalMasuk = riwayat.filter(r=>r.type==='masuk').reduce((s,r)=>s+r.nominal,0);
  const totalKeluar = riwayat.filter(r=>r.type==='keluar').reduce((s,r)=>s+r.nominal,0);

  container.innerHTML =
    '<div class="seller-section-title">💳 Keuangan Toko</div>' +
    '<div class="seller-keuangan-summary">' +
      '<div class="seller-keu-card" style="background:linear-gradient(135deg,#ff6f00,#ff8f00);">' +
        '<div style="font-size:11px;opacity:0.8;">Saldo Tersedia</div>' +
        '<div style="font-size:22px;font-weight:900;">Rp' + saldo.toLocaleString('id-ID') + '</div>' +
      '</div>' +
      '<div class="seller-keu-row"><span>Total Pendapatan</span><strong style="color:#2e7d32;">+Rp' + totalMasuk.toLocaleString('id-ID') + '</strong></div>' +
      '<div class="seller-keu-row"><span>Total Penarikan</span><strong style="color:#e53935;">-Rp' + totalKeluar.toLocaleString('id-ID') + '</strong></div>' +
    '</div>' +
    '<div class="seller-section-title" style="margin-top:14px;">🏦 Tarik Dana</div>' +
    '<div class="form-group"><input type="text" id="seller-tarik-bank" placeholder="Nama Bank (BCA, BRI, Mandiri, dll)"/><span>🏦</span></div>' +
    '<div class="form-group"><input type="text" id="seller-tarik-norek" placeholder="Nomor Rekening"/><span>💳</span></div>' +
    '<div class="form-group"><input type="number" id="seller-tarik-nominal" placeholder="Nominal Penarikan (min. Rp50.000)"/><span>💰</span></div>' +
    '<button class="cpay-btn" style="background:#ff6f00;" onclick="sellerTarikDana()">Tarik Dana</button>' +
    '<div class="seller-section-title" style="margin-top:14px;">📋 Riwayat Transaksi</div>' +
    (riwayat.length === 0 ? '<div class="seller-empty">Belum ada transaksi</div>' :
      riwayat.map(r => '<div class="cpay-riwayat-item"><div><strong>' + r.ket + '</strong><div style="font-size:11px;color:#888;">' + r.waktu + '</div></div><div style="font-weight:800;color:' + (r.type==='masuk'?'#2e7d32':'#e53935') + ';">' + (r.type==='masuk'?'+':'-') + 'Rp' + r.nominal.toLocaleString('id-ID') + '</div></div>').join(''));
}

function sellerTarikDana() {
  const bank    = document.getElementById('seller-tarik-bank').value.trim();
  const norek   = document.getElementById('seller-tarik-norek').value.trim();
  const nominal = parseInt(document.getElementById('seller-tarik-nominal').value);
  if (!bank || !norek) { showToast('Isi data rekening terlebih dahulu'); return; }
  if (!nominal || nominal < 50000) { showToast('Minimal tarik Rp50.000'); return; }
  if (nominal > (currentSeller.saldo || 0)) { showToast('Saldo tidak cukup!'); return; }
  currentSeller.saldo -= nominal;
  if (!currentSeller.riwayatKeuangan) currentSeller.riwayatKeuangan = [];
  currentSeller.riwayatKeuangan.unshift({ type:'keluar', ket:'Tarik Dana ke '+bank+' '+norek, nominal, waktu: new Date().toLocaleString('id-ID') });
  updateSellerSaldoDisplay();
  showToast('Penarikan Rp' + nominal.toLocaleString('id-ID') + ' ke ' + bank + ' berhasil!');
  showSellerSection('keuangan');
}

// ===== PROMOSI =====
function renderSellerPromosi(container) {
  const promosi = currentSeller.promosi || [];
  container.innerHTML =
    '<div class="seller-section-title">🎁 Kelola Promosi</div>' +
    '<div class="seller-promo-form">' +
      '<div class="form-group"><input type="text" id="promo-nama" placeholder="Nama Promosi (contoh: Flash Sale)"/><span>🎁</span></div>' +
      '<div class="form-group"><input type="number" id="promo-diskon" placeholder="Diskon (%)" min="1" max="90"/><span>%</span></div>' +
      '<div class="form-group"><input type="text" id="promo-kode" placeholder="Kode Voucher (opsional)"/><span>🎫</span></div>' +
      '<div class="form-group"><input type="date" id="promo-sampai" /><span>📅</span></div>' +
      '<button class="cpay-btn" style="background:#ff6f00;" onclick="tambahPromosiPenjual()">Buat Promosi</button>' +
    '</div>' +
    '<div class="seller-section-title" style="margin-top:14px;">📋 Promosi Aktif</div>' +
    (promosi.length === 0 ? '<div class="seller-empty">Belum ada promosi aktif.</div>' :
      promosi.map((p, i) => '<div class="seller-promo-card"><div><strong>' + p.nama + '</strong><div style="font-size:12px;color:#888;">Diskon ' + p.diskon + '% | ' + (p.kode ? 'Kode: ' + p.kode + ' | ' : '') + 'Sampai: ' + p.sampai + '</div></div><button class="seller-btn-hapus" onclick="hapusPromosiPenjual(' + i + ')">Hapus</button></div>').join(''));
}

function tambahPromosiPenjual() {
  const nama   = document.getElementById('promo-nama').value.trim();
  const diskon = document.getElementById('promo-diskon').value;
  const kode   = document.getElementById('promo-kode').value.trim();
  const sampai = document.getElementById('promo-sampai').value;
  if (!nama || !diskon) { showToast('Isi nama dan diskon promosi!'); return; }
  if (parseInt(diskon) < 1 || parseInt(diskon) > 90) { showToast('Diskon harus antara 1-90%'); return; }
  if (!currentSeller.promosi) currentSeller.promosi = [];
  currentSeller.promosi.push({ nama, diskon: parseInt(diskon), kode, sampai: sampai || 'Tidak terbatas' });
  showToast('Promosi "' + nama + '" berhasil dibuat!');
  showSellerSection('promosi');
}

function hapusPromosiPenjual(idx) {
  currentSeller.promosi.splice(idx, 1);
  showToast('Promosi dihapus.');
  showSellerSection('promosi');
}

// ===== ULASAN =====
function renderSellerUlasan(container) {
  const ulasan = currentSeller.ulasanDiterima || [];
  const avg = ulasan.length > 0 ? (ulasan.reduce((s,u) => s + u.bintang, 0) / ulasan.length).toFixed(1) : '5.0';
  document.getElementById('seller-stat-rating').textContent = avg;
  container.innerHTML =
    '<div class="seller-section-title">⭐ Ulasan Pembeli</div>' +
    '<div style="text-align:center;padding:12px;background:#fff8f0;border-radius:10px;margin-bottom:12px;">' +
      '<div style="font-size:36px;font-weight:900;color:#ff6f00;">' + avg + '</div>' +
      '<div style="font-size:13px;color:#888;">' + ulasan.length + ' ulasan</div>' +
    '</div>' +
    (ulasan.length === 0 ? '<div class="seller-empty">Belum ada ulasan dari pembeli.</div>' :
      ulasan.map(u => '<div class="review-card" style="margin-bottom:8px;"><strong>' + u.pembeli + '</strong><div>' + '&#11088;'.repeat(u.bintang) + '</div><p>' + u.komentar + '</p><p style="font-size:11px;color:#aaa;">' + u.waktu + '</p></div>').join(''));
}

// ===== SALDO PENJUAL =====
function renderSellerSaldo(container) {
  const saldo = currentSeller.saldo || 0;
  container.innerHTML =
    '<div class="seller-section-title">💰 Saldo Toko</div>' +
    '<div class="seller-keu-card" style="background:linear-gradient(135deg,#ff6f00,#ff8f00);margin-bottom:14px;">' +
      '<div style="font-size:11px;opacity:0.8;">Saldo Tersedia</div>' +
      '<div style="font-size:28px;font-weight:900;">Rp' + saldo.toLocaleString('id-ID') + '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
      '<button class="cpay-btn" style="background:#ff6f00;" onclick="showSellerSection(\'keuangan\')">🏦 Tarik Dana</button>' +
      '<button class="cpay-btn" onclick="showSellerSection(\'keuangan\')">📋 Riwayat</button>' +
    '</div>';
}
// ===== PAGE PENJUAL FULL =====
function openSellerPage() {
  if (!currentSeller) { openModal('modal-masuk'); switchLoginTab('penjual'); return; }
  initSellerPage();
  showPage('page-seller');
  updateNavbarVisibility('page-seller');
}
function initSellerPage() {
  if (!currentSeller) return;
  if (!currentSeller.saldo) currentSeller.saldo = 0;
  if (!currentSeller.riwayatKeuangan) currentSeller.riwayatKeuangan = [];
  if (!currentSeller.promosi) currentSeller.promosi = [];
  if (!currentSeller.ulasanDiterima) currentSeller.ulasanDiterima = [];
  const el1 = document.getElementById('snav-toko'); if(el1) el1.textContent = currentSeller.namaToko;
  const el2 = document.getElementById('snav-saldo'); if(el2) el2.textContent = 'Rp' + (currentSeller.saldo||0).toLocaleString('id-ID');
  const el3 = document.getElementById('ssidebar-toko'); if(el3) el3.textContent = currentSeller.namaToko;
  const el4 = document.getElementById('ssidebar-username'); if(el4) el4.textContent = '@' + currentSeller.username;
  const pb = (currentSeller.pesananMasuk||[]).filter(p=>!p.dibaca).length;
  ['snav-pesanan-badge','bnav-pesanan-badge'].forEach(id => { const b=document.getElementById(id); if(b){b.textContent=pb;b.style.display=pb>0?'flex':'none';} });
  showSellerTab('beranda');
}

function showSellerTab(tab) {
  const content = document.getElementById('seller-main-content');
  if (!content) return;
  document.querySelectorAll('.seller-snav').forEach(a => a.classList.remove('active'));
  document.querySelectorAll('.seller-bnav-btn').forEach(b => b.classList.remove('active'));
  const sn = document.getElementById('snav-' + tab); if(sn) sn.classList.add('active');
  const bn = document.getElementById('bnav-' + tab); if(bn) bn.classList.add('active');
  if (tab === 'beranda')   renderSellerBeranda(content);
  else if (tab === 'produk')    renderSellerProdukPage(content);
  else if (tab === 'pesanan')   renderSellerPesananPage(content);
  else if (tab === 'keuangan')  renderSellerKeuanganPage(content);
  else if (tab === 'promosi')   renderSellerPromosiPage(content);
  else if (tab === 'ulasan')    renderSellerUlasanPage(content);
  else if (tab === 'profil')    renderSellerProfilPage(content);
}

function renderSellerBeranda(c) {
  const s = currentSeller;
  const totalPend = (s.riwayatKeuangan||[]).filter(r=>r.type==='masuk').reduce((a,r)=>a+r.nominal,0);
  const pesananBaru = (s.pesananMasuk||[]).filter(p=>p.status==='Menunggu').length;
  c.innerHTML =
    '<div class="seller-page-title">&#127968; Selamat Datang, ' + s.namaToko + '!</div>' +
    '<div class="seller-stats-grid">' +
      '<div class="seller-stat-card"><div class="seller-stat-card-val">' + s.produk.length + '</div><div class="seller-stat-card-label">&#128230; Total Produk</div></div>' +
      '<div class="seller-stat-card"><div class="seller-stat-card-val">' + (s.pesananMasuk||[]).length + '</div><div class="seller-stat-card-label">&#128203; Total Pesanan</div></div>' +
      '<div class="seller-stat-card"><div class="seller-stat-card-val">Rp' + totalPend.toLocaleString('id-ID') + '</div><div class="seller-stat-card-label">&#128176; Total Pendapatan</div></div>' +
      '<div class="seller-stat-card"><div class="seller-stat-card-val">' + (s.ulasanDiterima||[]).length + '</div><div class="seller-stat-card-label">&#11088; Ulasan</div></div>' +
    '</div>' +
    (pesananBaru > 0 ? '<div class="seller-card" style="border-left:4px solid #ff6f00;"><div class="seller-card-title">&#128226; ' + pesananBaru + ' Pesanan Baru Menunggu Konfirmasi</div><button class="seller-btn-primary" onclick="showSellerTab(\'pesanan\')">Lihat Pesanan</button></div>' : '') +
    '<div class="seller-card"><div class="seller-card-title">&#9889; Aksi Cepat</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">' +
      '<button class="seller-btn-secondary" onclick="showSellerTab(\'produk\')">&#128230; Tambah Produk</button>' +
      '<button class="seller-btn-secondary" onclick="showSellerTab(\'pesanan\')">&#128203; Cek Pesanan</button>' +
      '<button class="seller-btn-secondary" onclick="showSellerTab(\'keuangan\')">&#128179; Keuangan</button>' +
    '</div></div>' +
    '<div class="seller-card"><div class="seller-card-title">&#128203; Pesanan Terbaru</div>' +
    ((s.pesananMasuk||[]).length === 0 ? '<div class="seller-empty">Belum ada pesanan</div>' :
      (s.pesananMasuk||[]).slice(0,3).map(p => {
        const sc = {'Menunggu':'#ff6f00','Diproses':'#1e88e5','Dikirim':'#8e24aa','Selesai':'#2e7d32','Dibatalkan':'#e53935'};
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:13px;"><div><strong>' + p.produk + '</strong><div style="color:#888;font-size:11px;">' + p.pembeli + ' | ' + p.waktu + '</div></div><span class="seller-status-badge" style="background:' + (sc[p.status]||'#888') + '20;color:' + (sc[p.status]||'#888') + ';">' + p.status + '</span></div>';
      }).join('')) +
    '</div>';
}

function renderSellerProdukPage(c) {
  const s = currentSeller;
  const tipeBadge = { 'Jual':'#5b4fcf', 'Sewa':'#ff6f00', 'Jasa':'#2e7d32' };

  c.innerHTML =
    '<div class="seller-page-title">&#128230; Produk, Sewa &amp; Jasa</div>' +

    // ===== FORM TAMBAH =====
    '<div class="seller-form-card" id="seller-form-produk-wrap">' +
      '<div class="seller-card-title">&#10133; Tambah Listing Baru</div>' +

      // Tipe listing
      '<div style="margin-bottom:14px;">' +
        '<label class="sp-label">Tipe Listing *</label>' +
        '<div class="sp-tipe-group">' +
          '<label class="sp-tipe-btn"><input type="radio" name="sp-tipe" value="Jual" checked onchange="toggleTipeListing()"/> &#128722; Jual</label>' +
          '<label class="sp-tipe-btn"><input type="radio" name="sp-tipe" value="Sewa" onchange="toggleTipeListing()"/> &#128336; Sewa</label>' +
          '<label class="sp-tipe-btn"><input type="radio" name="sp-tipe" value="Jasa" onchange="toggleTipeListing()"/> &#128295; Jasa</label>' +
        '</div>' +
      '</div>' +

      // Upload foto
      '<div style="margin-bottom:14px;">' +
        '<label class="sp-label">Foto Produk * <span style="color:#888;font-weight:400;">(wajib, maks 5MB)</span></label>' +
        '<div class="sp-foto-upload" id="sp-foto-preview-wrap" onclick="document.getElementById(\'sp-foto-input\').click()">' +
          '<div id="sp-foto-placeholder">&#128247;<br><span>Klik untuk upload foto</span></div>' +
          '<img id="sp-foto-preview" style="display:none;width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="Preview"/>' +
        '</div>' +
        '<input type="file" id="sp-foto-input" accept="image/*" style="display:none;" onchange="previewFotoProduk(this)"/>' +
        '<input type="hidden" id="sp-foto-data"/>' +
      '</div>' +

      '<div class="seller-form-grid">' +
        '<div><label class="sp-label">Nama *</label><input class="seller-input" id="sp-nama" placeholder="Nama produk/jasa..."/></div>' +
        '<div><label class="sp-label">Kategori *</label><select class="seller-select" id="sp-kategori">' +
          '<option value="">-- Pilih --</option>' +
          '<option>CCTV Outdoor</option><option>CCTV Indoor</option><option>CCTV PTZ</option>' +
          '<option>CCTV Wireless</option><option>Aksesoris CCTV</option>' +
          '<option>Jasa Instalasi</option><option>Jasa Perawatan</option><option>Jasa Konsultasi</option>' +
          '<option>Lainnya</option>' +
        '</select></div>' +
        '<div><label class="sp-label" id="sp-harga-label">Harga Jual (Rp) *</label><input class="seller-input" type="number" id="sp-harga" placeholder="0"/></div>' +
        '<div id="sp-sewa-wrap" style="display:none;"><label class="sp-label">Harga Sewa / Hari (Rp) *</label><input class="seller-input" type="number" id="sp-harga-sewa" placeholder="0"/></div>' +
        '<div id="sp-stok-wrap"><label class="sp-label">Stok / Unit *</label><input class="seller-input" type="number" id="sp-stok" placeholder="1"/></div>' +
        '<div id="sp-kondisi-wrap"><label class="sp-label">Kondisi</label><select class="seller-select" id="sp-kondisi"><option>Baru</option><option>Bekas</option></select></div>' +
        '<div id="sp-durasi-wrap" style="display:none;"><label class="sp-label">Min. Durasi Sewa</label><select class="seller-select" id="sp-durasi"><option>1 Hari</option><option>3 Hari</option><option>1 Minggu</option><option>1 Bulan</option></select></div>' +
        '<div id="sp-garansi-wrap" style="display:none;"><label class="sp-label">Garansi Jasa</label><select class="seller-select" id="sp-garansi"><option>Tidak Ada</option><option>7 Hari</option><option>30 Hari</option><option>3 Bulan</option></select></div>' +
      '</div>' +
      '<div style="margin-bottom:12px;"><label class="sp-label">Deskripsi *</label><textarea class="seller-textarea" id="sp-deskripsi" rows="3" placeholder="Jelaskan detail produk/jasa/sewa kamu..."></textarea></div>' +
      '<button class="seller-btn-primary" onclick="simpanProdukSellerPage()">&#10133; Tambah Listing</button>' +
    '</div>' +

    // ===== DAFTAR PRODUK =====
    '<div class="seller-card">' +
      '<div class="seller-card-title">&#128230; Semua Listing (' + s.produk.length + ')</div>' +
      (s.produk.length === 0
        ? '<div class="seller-empty">Belum ada listing. Tambahkan di atas!</div>'
        : '<div class="seller-produk-grid">' +
            s.produk.map((p, i) => {
              const tipe = p.tipe || 'Jual';
              const warna = tipeBadge[tipe] || '#5b4fcf';
              const hargaLabel = tipe === 'Sewa' ? 'Rp' + parseInt(p.hargaSewa||p.harga).toLocaleString('id-ID') + '/hari' : 'Rp' + parseInt(p.harga).toLocaleString('id-ID');
              return '<div class="seller-produk-item">' +
                (p.foto ? '<img src="' + p.foto + '" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px;"/>' : '<div style="width:100%;height:80px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:8px;">&#128247;</div>') +
                '<span style="background:' + warna + '20;color:' + warna + ';font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;">' + tipe + '</span>' +
                '<div class="seller-produk-item-name" style="margin-top:4px;">' + p.nama + '</div>' +
                '<div class="seller-produk-item-info">' + p.kategori + (p.kondisi ? ' | ' + p.kondisi : '') + '</div>' +
                '<div class="seller-produk-item-price">' + hargaLabel + '</div>' +
                '<div class="seller-produk-item-info">Stok: ' + (p.stok||'-') + ' | Terjual: ' + (p.terjual||0) + '</div>' +
                '<div class="seller-produk-item-actions">' +
                  '<button class="seller-btn-edit" onclick="editProdukPage(' + i + ')">&#9998; Edit</button>' +
                  '<button class="seller-btn-hapus" onclick="hapusProdukSellerPage(' + i + ')">&#128465; Hapus</button>' +
                '</div>' +
              '</div>';
            }).join('') +
          '</div>'
      ) +
    '</div>';
}

// Toggle tampilan field sesuai tipe listing
function toggleTipeListing() {
  const tipe = document.querySelector('input[name="sp-tipe"]:checked')?.value || 'Jual';
  const isSewa = tipe === 'Sewa';
  const isJasa = tipe === 'Jasa';
  document.getElementById('sp-sewa-wrap').style.display    = isSewa ? '' : 'none';
  document.getElementById('sp-durasi-wrap').style.display  = isSewa ? '' : 'none';
  document.getElementById('sp-garansi-wrap').style.display = isJasa ? '' : 'none';
  document.getElementById('sp-stok-wrap').style.display    = isJasa ? 'none' : '';
  document.getElementById('sp-kondisi-wrap').style.display = isJasa ? 'none' : '';
  const hargaLabel = document.getElementById('sp-harga-label');
  if (hargaLabel) hargaLabel.textContent = isJasa ? 'Harga Jasa (Rp) *' : isSewa ? 'Harga Deposit (Rp)' : 'Harga Jual (Rp) *';
}

// Preview foto sebelum upload
function previewFotoProduk(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('File harus berupa gambar!'); return; }
  if (file.size > 5 * 1024 * 1024) { showToast('Ukuran foto maksimal 5MB'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('sp-foto-data').value = e.target.result;
    const preview = document.getElementById('sp-foto-preview');
    const placeholder = document.getElementById('sp-foto-placeholder');
    preview.src = e.target.result;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    showToast('Foto berhasil dipilih!');
  };
  reader.readAsDataURL(file);
}

function simpanProdukSellerPage() {
  const tipe  = document.querySelector('input[name="sp-tipe"]:checked')?.value || 'Jual';
  const foto  = document.getElementById('sp-foto-data').value;
  const nama  = document.getElementById('sp-nama').value.trim();
  const kat   = document.getElementById('sp-kategori').value;
  const hrg   = document.getElementById('sp-harga').value;
  const hrgs  = document.getElementById('sp-harga-sewa').value;
  const stok  = document.getElementById('sp-stok').value || '1';
  const kond  = document.getElementById('sp-kondisi').value;
  const desk  = document.getElementById('sp-deskripsi').value.trim();
  const dur   = document.getElementById('sp-durasi').value;
  const gar   = document.getElementById('sp-garansi').value;

  if (!foto) { showToast('Foto produk wajib diupload!'); return; }
  if (!nama) { showToast('Nama wajib diisi!'); return; }
  if (!kat)  { showToast('Pilih kategori!'); return; }
  if (!desk) { showToast('Deskripsi wajib diisi!'); return; }
  if (tipe === 'Sewa' && !hrgs) { showToast('Harga sewa wajib diisi!'); return; }
  if (tipe !== 'Sewa' && (!hrg || parseInt(hrg) <= 0)) { showToast('Harga wajib diisi!'); return; }

  const item = {
    tipe, foto, nama, kategori: kat,
    harga: parseInt(hrg) || 0,
    hargaSewa: parseInt(hrgs) || 0,
    stok: parseInt(stok),
    kondisi: kond, deskripsi: desk,
    durasiMinSewa: dur, garansiJasa: gar,
    terjual: 0
  };
  currentSeller.produk.push(item);
  showToast(tipe + ' "' + nama + '" berhasil ditambahkan!');
  showSellerTab('produk');
}

function hapusProdukSellerPage(idx) {
  const nama = currentSeller.produk[idx].nama;
  currentSeller.produk.splice(idx, 1);
  showToast('"' + nama + '" dihapus.');
  showSellerTab('produk');
}

function editProdukPage(idx) {
  const p = currentSeller.produk[idx];
  // Scroll ke form
  document.getElementById('seller-form-produk-wrap').scrollIntoView({ behavior: 'smooth' });
  // Set tipe
  const tipeRadio = document.querySelector('input[name="sp-tipe"][value="' + (p.tipe||'Jual') + '"]');
  if (tipeRadio) { tipeRadio.checked = true; toggleTipeListing(); }
  // Set foto
  if (p.foto) {
    document.getElementById('sp-foto-data').value = p.foto;
    const preview = document.getElementById('sp-foto-preview');
    const placeholder = document.getElementById('sp-foto-placeholder');
    preview.src = p.foto; preview.style.display = 'block'; placeholder.style.display = 'none';
  }
  // Set field
  document.getElementById('sp-nama').value = p.nama;
  document.getElementById('sp-kategori').value = p.kategori;
  document.getElementById('sp-harga').value = p.harga || '';
  document.getElementById('sp-harga-sewa').value = p.hargaSewa || '';
  document.getElementById('sp-stok').value = p.stok || '';
  document.getElementById('sp-kondisi').value = p.kondisi || 'Baru';
  document.getElementById('sp-deskripsi').value = p.deskripsi || '';
  if (p.durasiMinSewa) document.getElementById('sp-durasi').value = p.durasiMinSewa;
  if (p.garansiJasa)   document.getElementById('sp-garansi').value = p.garansiJasa;
  // Ubah tombol jadi Simpan
  const btn = document.querySelector('#seller-form-produk-wrap .seller-btn-primary');
  if (btn) {
    btn.textContent = 'Simpan Perubahan';
    btn.onclick = () => {
      const tipe2 = document.querySelector('input[name="sp-tipe"]:checked')?.value || 'Jual';
      currentSeller.produk[idx] = {
        ...currentSeller.produk[idx],
        tipe: tipe2,
        foto: document.getElementById('sp-foto-data').value || p.foto,
        nama: document.getElementById('sp-nama').value.trim(),
        kategori: document.getElementById('sp-kategori').value,
        harga: parseInt(document.getElementById('sp-harga').value) || 0,
        hargaSewa: parseInt(document.getElementById('sp-harga-sewa').value) || 0,
        stok: parseInt(document.getElementById('sp-stok').value) || 1,
        kondisi: document.getElementById('sp-kondisi').value,
        deskripsi: document.getElementById('sp-deskripsi').value.trim(),
        durasiMinSewa: document.getElementById('sp-durasi').value,
        garansiJasa: document.getElementById('sp-garansi').value,
      };
      showToast('Listing diperbarui!');
      showSellerTab('produk');
    };
  }
}
function renderSellerPesananPage(c) {
  const pesanan = currentSeller.pesananMasuk || [];
  pesanan.forEach(p => p.dibaca = true);
  ['snav-pesanan-badge','bnav-pesanan-badge'].forEach(id => { const b=document.getElementById(id); if(b) b.style.display='none'; });
  const sc = {'Menunggu':'#ff6f00','Diproses':'#1e88e5','Dikirim':'#8e24aa','Selesai':'#2e7d32','Dibatalkan':'#e53935'};
  c.innerHTML =
    '<div class="seller-page-title">&#128203; Pesanan Masuk</div>' +
    '<div class="seller-filter-tabs" style="margin-bottom:14px;">' +
      '<button class="seller-filter-btn active" onclick="filterPesananPage(this,\'semua\')">Semua (' + pesanan.length + ')</button>' +
      '<button class="seller-filter-btn" onclick="filterPesananPage(this,\'Menunggu\')">Menunggu (' + pesanan.filter(p=>p.status==='Menunggu').length + ')</button>' +
      '<button class="seller-filter-btn" onclick="filterPesananPage(this,\'Diproses\')">Diproses</button>' +
      '<button class="seller-filter-btn" onclick="filterPesananPage(this,\'Dikirim\')">Dikirim</button>' +
      '<button class="seller-filter-btn" onclick="filterPesananPage(this,\'Selesai\')">Selesai</button>' +
    '</div>' +
    '<div id="pesanan-page-list">' + renderPesananPageList(pesanan) + '</div>';
}

function renderPesananPageList(list) {
  const sc = {'Menunggu':'#ff6f00','Diproses':'#1e88e5','Dikirim':'#8e24aa','Selesai':'#2e7d32','Dibatalkan':'#e53935'};
  if (list.length === 0) return '<div class="seller-card"><div class="seller-empty">Tidak ada pesanan</div></div>';
  return list.map((p,i) =>
    '<div class="seller-card" style="margin-bottom:12px;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
        '<strong style="font-size:14px;">Pesanan #' + String(i+1).padStart(3,'0') + '</strong>' +
        '<span class="seller-status-badge" style="background:' + (sc[p.status]||'#888') + '20;color:' + (sc[p.status]||'#888') + ';">' + p.status + '</span>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;margin-bottom:12px;">' +
        '<div><span style="color:#888;">Produk</span><br><strong>' + p.produk + '</strong></div>' +
        '<div><span style="color:#888;">Pembeli</span><br><strong>' + p.pembeli + '</strong></div>' +
        '<div><span style="color:#888;">Pembayaran</span><br><strong>' + (p.metodePembayaran||'-') + '</strong></div>' +
        '<div><span style="color:#888;">Total</span><br><strong style="color:#ff6f00;">' + p.total + '</strong></div>' +
        '<div><span style="color:#888;">Qty</span><br><strong>' + (p.qty||1) + '</strong></div>' +
        '<div><span style="color:#888;">Waktu</span><br><strong style="font-size:11px;">' + p.waktu + '</strong></div>' +
      '</div>' +
      (p.status==='Menunggu' ?
        '<div style="display:flex;gap:8px;">' +
          '<button class="seller-btn-primary" onclick="updateStatusPesananPage(' + i + ',\'Diproses\')">&#10003; Proses Pesanan</button>' +
          '<button class="seller-btn-hapus" style="padding:10px 16px;" onclick="updateStatusPesananPage(' + i + ',\'Dibatalkan\')">&#10007; Tolak</button>' +
        '</div>' : '') +
      (p.status==='Diproses' ?
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button class="seller-btn-primary" onclick="updateStatusPesananPage(' + i + ',\'Dikirim\')">&#128666; Tandai Dikirim</button>' +
          '<button class="seller-btn-primary" style="background:#8e24aa;" onclick="bukaKonfirmasiKirimDariPenjual(' + i + ')">&#128247; Konfirmasi + Foto Kirim</button>' +
        '</div>' : '') +
      (p.status==='Dikirim' ?
        '<button class="seller-btn-primary" style="background:#2e7d32;" onclick="updateStatusPesananPage(' + i + ',\'Selesai\')">&#10003; Tandai Selesai</button>' : '') +
    '</div>'
  ).join('');
}

function filterPesananPage(btn, status) {
  document.querySelectorAll('.seller-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const list = status==='semua' ? currentSeller.pesananMasuk : currentSeller.pesananMasuk.filter(p=>p.status===status);
  const el = document.getElementById('pesanan-page-list');
  if (el) el.innerHTML = renderPesananPageList(list);
}

function updateStatusPesananPage(idx, status) {
  currentSeller.pesananMasuk[idx].status = status;
  if (status === 'Selesai') {
    const p = currentSeller.pesananMasuk[idx];
    const nominal = parseInt((p.total||'Rp0').replace(/[^0-9]/g,''));
    if (!currentSeller.riwayatKeuangan) currentSeller.riwayatKeuangan = [];
    currentSeller.saldo = (currentSeller.saldo||0) + nominal;
    currentSeller.riwayatKeuangan.unshift({type:'masuk',ket:'Penjualan: '+p.produk+' ke '+p.pembeli,nominal,waktu:new Date().toLocaleString('id-ID')});
    const el = document.getElementById('snav-saldo'); if(el) el.textContent = 'Rp' + currentSeller.saldo.toLocaleString('id-ID');
  }
  showToast('Status diperbarui: ' + status);
  showSellerTab('pesanan');
}

function renderSellerKeuanganPage(c) {
  const s = currentSeller;
  const saldo = s.saldo || 0;
  const riwayat = s.riwayatKeuangan || [];
  const totalMasuk = riwayat.filter(r=>r.type==='masuk').reduce((a,r)=>a+r.nominal,0);
  const totalKeluar = riwayat.filter(r=>r.type==='keluar').reduce((a,r)=>a+r.nominal,0);
  c.innerHTML =
    '<div class="seller-page-title">&#128179; Keuangan Toko</div>' +
    '<div class="seller-keu-grid">' +
      '<div class="seller-keu-summary-card" style="background:linear-gradient(135deg,#ff6f00,#ff8f00);"><div class="val">Rp' + saldo.toLocaleString('id-ID') + '</div><div class="lbl">&#128176; Saldo Tersedia</div></div>' +
      '<div class="seller-keu-summary-card" style="background:linear-gradient(135deg,#2e7d32,#43a047);"><div class="val">Rp' + totalMasuk.toLocaleString('id-ID') + '</div><div class="lbl">&#8679; Total Pendapatan</div></div>' +
      '<div class="seller-keu-summary-card" style="background:linear-gradient(135deg,#1565c0,#1e88e5);"><div class="val">Rp' + totalKeluar.toLocaleString('id-ID') + '</div><div class="lbl">&#8681; Total Penarikan</div></div>' +
    '</div>' +
    '<div class="seller-card"><div class="seller-card-title">&#127968; Tarik Dana ke Rekening</div>' +
      '<div class="seller-form-grid">' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Nama Bank</label><input class="seller-input" id="sk-bank" placeholder="BCA, BRI, Mandiri..."/></div>' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Nomor Rekening</label><input class="seller-input" id="sk-norek" placeholder="Nomor rekening"/></div>' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Atas Nama</label><input class="seller-input" id="sk-atasnama" placeholder="Nama pemilik rekening"/></div>' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Nominal (min. Rp50.000)</label><input class="seller-input" type="number" id="sk-nominal" placeholder="0"/></div>' +
      '</div>' +
      '<button class="seller-btn-primary" onclick="sellerTarikDanaPage()">&#128666; Tarik Dana</button>' +
    '</div>' +
    '<div class="seller-card"><div class="seller-card-title">&#128203; Riwayat Transaksi</div>' +
    (riwayat.length === 0 ? '<div class="seller-empty">Belum ada transaksi</div>' :
      riwayat.map(r =>
        '<div class="cpay-riwayat-item"><div><strong>' + r.ket + '</strong><div style="font-size:11px;color:#888;">' + r.waktu + '</div></div>' +
        '<div style="font-weight:800;color:' + (r.type==='masuk'?'#2e7d32':'#e53935') + ';">' + (r.type==='masuk'?'+':'-') + 'Rp' + r.nominal.toLocaleString('id-ID') + '</div></div>'
      ).join('')) +
    '</div>';
}

function sellerTarikDanaPage() {
  const bank = document.getElementById('sk-bank').value.trim();
  const norek = document.getElementById('sk-norek').value.trim();
  const atasnama = document.getElementById('sk-atasnama').value.trim();
  const nominal = parseInt(document.getElementById('sk-nominal').value);
  if (!bank||!norek||!atasnama) { showToast('Lengkapi data rekening!'); return; }
  if (!nominal||nominal<50000) { showToast('Minimal tarik Rp50.000'); return; }
  if (nominal>(currentSeller.saldo||0)) { showToast('Saldo tidak cukup!'); return; }
  currentSeller.saldo -= nominal;
  if (!currentSeller.riwayatKeuangan) currentSeller.riwayatKeuangan = [];
  currentSeller.riwayatKeuangan.unshift({type:'keluar',ket:'Tarik Dana ke '+bank+' '+norek+' a/n '+atasnama,nominal,waktu:new Date().toLocaleString('id-ID')});
  const el = document.getElementById('snav-saldo'); if(el) el.textContent = 'Rp' + currentSeller.saldo.toLocaleString('id-ID');
  showToast('Penarikan Rp' + nominal.toLocaleString('id-ID') + ' berhasil!');
  showSellerTab('keuangan');
}

function renderSellerPromosiPage(c) {
  const promosi = currentSeller.promosi || [];
  c.innerHTML =
    '<div class="seller-page-title">&#127873; Kelola Promosi</div>' +
    '<div class="seller-form-card"><div class="seller-card-title">&#10133; Buat Promosi Baru</div>' +
      '<div class="seller-form-grid">' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Nama Promosi</label><input class="seller-input" id="promo-nama" placeholder="Flash Sale, Diskon Akhir Tahun..."/></div>' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Diskon (%)</label><input class="seller-input" type="number" id="promo-diskon" placeholder="10" min="1" max="90"/></div>' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Kode Voucher (opsional)</label><input class="seller-input" id="promo-kode" placeholder="SALE10"/></div>' +
        '<div><label style="font-size:12px;color:#888;display:block;margin-bottom:4px;">Berlaku Sampai</label><input class="seller-input" type="date" id="promo-sampai"/></div>' +
      '</div>' +
      '<button class="seller-btn-primary" onclick="tambahPromosiPage()">Buat Promosi</button>' +
    '</div>' +
    '<div class="seller-card"><div class="seller-card-title">&#128203; Promosi Aktif (' + promosi.length + ')</div>' +
    (promosi.length === 0 ? '<div class="seller-empty">Belum ada promosi aktif.</div>' :
      promosi.map((p,i) =>
        '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid #f0f0f0;">' +
          '<div><strong>' + p.nama + '</strong><div style="font-size:12px;color:#888;">Diskon ' + p.diskon + '%' + (p.kode?' | Kode: '+p.kode:'') + ' | Sampai: ' + p.sampai + '</div></div>' +
          '<button class="seller-btn-hapus" onclick="hapusPromosiPage(' + i + ')">Hapus</button>' +
        '</div>'
      ).join('')) +
    '</div>';
}

function tambahPromosiPage() {
  const nama = document.getElementById('promo-nama').value.trim();
  const diskon = parseInt(document.getElementById('promo-diskon').value);
  const kode = document.getElementById('promo-kode').value.trim();
  const sampai = document.getElementById('promo-sampai').value;
  if (!nama||!diskon) { showToast('Isi nama dan diskon!'); return; }
  if (diskon<1||diskon>90) { showToast('Diskon 1-90%'); return; }
  if (!currentSeller.promosi) currentSeller.promosi = [];
  currentSeller.promosi.push({nama,diskon,kode,sampai:sampai||'Tidak terbatas'});
  showToast('Promosi "' + nama + '" dibuat!');
  showSellerTab('promosi');
}

function hapusPromosiPage(idx) { currentSeller.promosi.splice(idx,1); showToast('Promosi dihapus.'); showSellerTab('promosi'); }

function renderSellerUlasanPage(c) {
  const ulasan = currentSeller.ulasanDiterima || [];
  const avg = ulasan.length > 0 ? (ulasan.reduce((s,u)=>s+u.bintang,0)/ulasan.length).toFixed(1) : '5.0';
  c.innerHTML =
    '<div class="seller-page-title">&#11088; Ulasan Pembeli</div>' +
    '<div class="seller-card" style="text-align:center;">' +
      '<div style="font-size:48px;font-weight:900;color:#ff6f00;">' + avg + '</div>' +
      '<div style="font-size:13px;color:#888;">' + ulasan.length + ' ulasan dari pembeli</div>' +
    '</div>' +
    '<div class="seller-card"><div class="seller-card-title">Semua Ulasan</div>' +
    (ulasan.length === 0 ? '<div class="seller-empty">Belum ada ulasan dari pembeli.</div>' :
      ulasan.map(u =>
        '<div style="padding:12px 0;border-bottom:1px solid #f0f0f0;">' +
          '<div style="display:flex;justify-content:space-between;"><strong>' + u.pembeli + '</strong><span style="font-size:11px;color:#aaa;">' + u.waktu + '</span></div>' +
          '<div style="color:#ff6f00;margin:4px 0;">' + '&#11088;'.repeat(u.bintang) + '</div>' +
          '<p style="font-size:13px;color:#444;">' + u.komentar + '</p>' +
        '</div>'
      ).join('')) +
    '</div>';
}

function renderSellerProfilPage(c) {
  const s = currentSeller;
  c.innerHTML =
    '<div class="seller-page-title">&#9881;&#65039; Profil Toko</div>' +
    '<div class="seller-card">' +
      '<div style="text-align:center;padding:16px 0;">' +
        '<div style="font-size:48px;">&#127978;</div>' +
        '<div style="font-size:20px;font-weight:900;margin:8px 0;">' + s.namaToko + '</div>' +
        '<div style="color:#888;font-size:13px;">@' + s.username + '</div>' +
        '<div style="background:#fff3e0;color:#ff6f00;display:inline-block;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-top:8px;">Penjual Terverifikasi &#10003;</div>' +
      '</div>' +
      '<div class="seller-profil-wrap">' +
        '<div class="seller-profil-row"><span>&#128231; Email</span><strong>' + s.email + '</strong></div>' +
        '<div class="seller-profil-row"><span>&#128222; Telepon</span><strong>' + s.telpon + '</strong></div>' +
        '<div class="seller-profil-row"><span>&#128205; Lokasi</span><strong>' + s.kecamatan + ', ' + s.kota + '</strong></div>' +
        '<div class="seller-profil-row"><span>&#127968; Alamat</span><strong>' + s.jalan + '</strong></div>' +
        '<div class="seller-profil-row"><span>&#128197; Bergabung</span><strong>' + s.terdaftar + '</strong></div>' +
        (s.deskripsi ? '<div class="seller-profil-row"><span>&#128221; Deskripsi</span><strong>' + s.deskripsi + '</strong></div>' : '') +
      '</div>' +
    '</div>' +
    '<div class="seller-card"><div class="seller-card-title">&#128722; Akses Pembeli</div>' +
      '<p style="font-size:13px;color:#555;margin-bottom:12px;">Kamu bisa berbelanja sebagai pembeli tanpa perlu logout dari akun toko.</p>' +
      '<button class="seller-btn-primary" onclick="showPage(\'page-home\')">&#128722; Pergi Belanja</button>' +
    '</div>' +
    '<div class="seller-card"><div class="seller-card-title">&#128682; Keluar dari Toko</div>' +
      '<button class="seller-btn-hapus" style="padding:12px 24px;font-size:14px;" onclick="doLogoutPenjual()">Keluar dari Akun Toko</button>' +
    '</div>';
}

// Override doLogoutPenjual agar kembali ke home
function doLogoutPenjual() {
  currentSeller = null;
  isSellerLoggedIn = false;
  closeModal('modal-dashboard-penjual');
  showPage('page-home');
  showToast('Berhasil keluar dari akun toko.');
}

// Override openDashboardPenjual agar buka page, bukan modal
function openDashboardPenjual() {
  if (!currentSeller) return;
  initSellerPage();
  showPage('page-seller');
}

// ===== PRODUK PENJUAL DI HALAMAN LAYANAN =====

// Render semua produk penjual ke halaman produk
function renderSellerProductsOnPage() {
  const allProduk = [];
  registeredSellers.forEach(seller => {
    (seller.produk || []).forEach(p => {
      allProduk.push({ ...p, sellerNama: seller.namaToko, sellerUsername: seller.username, sellerTelpon: seller.telpon });
    });
  });

  const section = document.getElementById('seller-products-section');
  const grid = document.getElementById('seller-products-grid');
  if (!section || !grid) return;

  if (allProduk.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  grid.innerHTML = allProduk.map((p, i) => {
    const harga = parseInt(p.harga).toLocaleString('id-ID');
    const tipe = p.tipe || 'Jual';
    const tipeBadgeColor = { 'Jual':'#5b4fcf', 'Sewa':'#ff6f00', 'Jasa':'#2e7d32' };
    const warna = tipeBadgeColor[tipe] || '#5b4fcf';
    const hargaLabel = tipe === 'Sewa'
      ? 'Rp' + parseInt(p.hargaSewa||p.harga).toLocaleString('id-ID') + '/hari'
      : 'Rp' + parseInt(p.harga).toLocaleString('id-ID');
    return '<div class="seller-product-card" onclick="showSellerProductDetail(' + i + ')">' +
      '<span class="seller-product-badge" style="background:' + warna + ';">&#127978; ' + tipe + '</span>' +
      (p.foto
        ? '<img src="' + p.foto + '" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-top:24px;margin-bottom:8px;"/>'
        : '<div style="width:100%;height:100px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:32px;margin-top:24px;margin-bottom:8px;">&#128247;</div>') +
      '<div class="seller-product-toko">&#127978; ' + p.sellerNama + '</div>' +
      '<div class="seller-product-name">' + p.nama + '</div>' +
      '<div class="seller-product-kat">' + p.kategori + (p.kondisi ? ' | ' + p.kondisi : '') + '</div>' +
      '<div class="seller-product-price">' + hargaLabel + '</div>' +
      '<div class="seller-product-stok">' + (tipe === 'Jasa' ? 'Garansi: ' + (p.garansiJasa||'-') : 'Stok: ' + (p.stok||'-')) + '</div>' +
      '<div class="seller-product-actions">' +
        '<button class="btn-chat-seller" onclick="event.stopPropagation();chatWithSeller(\'' + p.sellerUsername + '\',\'' + p.nama + '\')">&#128172; Chat</button>' +
        '<button class="btn-beli-seller" onclick="event.stopPropagation();beliProdukSeller(' + i + ')">' + (tipe === 'Sewa' ? 'Sewa' : tipe === 'Jasa' ? 'Pesan' : 'Beli') + '</button>' +
      '</div>' +
    '</div>';
  }).join('');

  // Simpan ke variabel global untuk filter
  window._allSellerProduk = allProduk;
}

// Filter & search produk
function filterProdukPage() {
  const keyword = (document.getElementById('search-produk')?.value || '').toLowerCase();
  const kategori = document.getElementById('filter-kategori')?.value || '';
  const sort = document.getElementById('filter-sort')?.value || 'default';

  // Filter produk penjual
  let sellerProduk = (window._allSellerProduk || []).filter(p => {
    const matchKw = !keyword || p.nama.toLowerCase().includes(keyword) || p.kategori.toLowerCase().includes(keyword) || p.sellerNama.toLowerCase().includes(keyword);
    const matchKat = !kategori || kategori === 'Produk Resmi' ? false : (!kategori || p.kategori === kategori);
    return matchKw && matchKat;
  });

  // Filter produk resmi
  const showResmi = !kategori || kategori === '' || kategori === 'Produk Resmi';
  const officialHeader = document.getElementById('official-products-header');
  const officialSection = document.querySelector('.featured-grid');
  const officialGrid = document.querySelector('.product-grid');
  if (officialHeader) officialHeader.style.display = showResmi ? '' : 'none';
  if (officialSection) officialSection.style.display = showResmi ? '' : 'none';
  if (officialGrid) officialGrid.style.display = showResmi ? '' : 'none';
  const officialTitle = document.querySelector('#page-products .section-title');
  if (officialTitle) officialTitle.style.display = showResmi ? '' : 'none';

  // Sort
  if (sort === 'termurah') sellerProduk.sort((a,b) => a.harga - b.harga);
  else if (sort === 'termahal') sellerProduk.sort((a,b) => b.harga - a.harga);

  const grid = document.getElementById('seller-products-grid');
  const section = document.getElementById('seller-products-section');
  if (!grid || !section) return;

  if (sellerProduk.length === 0 && !showResmi) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#888;">Tidak ada produk yang cocok</div>';
    section.style.display = 'block';
  } else if (sellerProduk.length === 0) {
    section.style.display = 'none';
  } else {
    section.style.display = 'block';
    grid.innerHTML = sellerProduk.map((p, i) => {
      const harga = parseInt(p.harga).toLocaleString('id-ID');
      const idx = (window._allSellerProduk || []).indexOf(p);
      return '<div class="seller-product-card" onclick="showSellerProductDetail(' + idx + ')">' +
        '<span class="seller-product-badge">&#127978; Penjual</span>' +
        '<div style="margin-top:20px;">' +
          '<div class="seller-product-toko">&#127978; ' + p.sellerNama + '</div>' +
          '<div class="seller-product-name">' + p.nama + '</div>' +
          '<div class="seller-product-kat">' + p.kategori + ' | ' + p.kondisi + '</div>' +
          '<div class="seller-product-price">Rp' + harga + '</div>' +
          '<div class="seller-product-stok">Stok: ' + p.stok + '</div>' +
        '</div>' +
        '<div class="seller-product-actions">' +
          '<button class="btn-chat-seller" onclick="event.stopPropagation();chatWithSeller(\'' + p.sellerUsername + '\',\'' + p.nama + '\')">&#128172; Chat</button>' +
          '<button class="btn-beli-seller" onclick="event.stopPropagation();beliProdukSeller(' + idx + ')">Beli</button>' +
        '</div>' +
      '</div>';
    }).join('');
  }
}

function showSellerProductDetail(idx) {
  const p = (window._allSellerProduk || [])[idx];
  if (!p) return;
  const tipe = p.tipe || 'Jual';
  const tipeBadgeColor = { 'Jual':'#5b4fcf', 'Sewa':'#ff6f00', 'Jasa':'#2e7d32' };
  const warna = tipeBadgeColor[tipe] || '#5b4fcf';
  const hargaLabel = tipe === 'Sewa'
    ? 'Rp' + parseInt(p.hargaSewa||p.harga).toLocaleString('id-ID') + ' / hari'
    : 'Rp' + parseInt(p.harga).toLocaleString('id-ID');
  const tombolLabel = tipe === 'Sewa' ? '&#128336; Sewa Sekarang' : tipe === 'Jasa' ? '&#128295; Pesan Jasa' : '&#128722; Beli Sekarang';

  document.getElementById('seller-detail-content').innerHTML =
    // Foto
    (p.foto
      ? '<img src="' + p.foto + '" style="width:100%;height:200px;object-fit:cover;border-radius:12px;margin-bottom:14px;"/>'
      : '<div style="width:100%;height:140px;background:#f5f5f5;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:48px;margin-bottom:14px;">&#128247;</div>') +
    // Info toko
    '<div class="seller-detail-toko">' +
      '<div class="seller-detail-toko-avatar">&#127978;</div>' +
      '<div class="seller-detail-toko-info">' +
        '<strong>' + p.sellerNama + '</strong>' +
        '<small>@' + p.sellerUsername + ' | &#128222; ' + p.sellerTelpon + '</small>' +
      '</div>' +
    '</div>' +
    // Badge tipe
    '<span style="background:' + warna + '20;color:' + warna + ';font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;display:inline-block;margin-bottom:8px;">' + tipe + '</span>' +
    '<h2 style="font-size:20px;font-weight:900;margin-bottom:6px;">' + p.nama + '</h2>' +
    '<div style="color:' + warna + ';font-size:22px;font-weight:900;margin-bottom:10px;">' + hargaLabel + '</div>' +
    // Tags
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">' +
      '<span style="background:#f3f0ff;color:#5b4fcf;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">' + p.kategori + '</span>' +
      (p.kondisi ? '<span style="background:#e8f5e9;color:#2e7d32;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">' + p.kondisi + '</span>' : '') +
      (tipe !== 'Jasa' ? '<span style="background:#e3f2fd;color:#1565c0;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">Stok: ' + (p.stok||'-') + '</span>' : '') +
      (tipe === 'Sewa' && p.durasiMinSewa ? '<span style="background:#fff3e0;color:#ff6f00;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">Min. ' + p.durasiMinSewa + '</span>' : '') +
      (tipe === 'Jasa' && p.garansiJasa ? '<span style="background:#e8f5e9;color:#2e7d32;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">Garansi: ' + p.garansiJasa + '</span>' : '') +
    '</div>' +
    // Deskripsi
    (p.deskripsi ? '<div style="background:#f9f9f9;border-radius:8px;padding:12px;font-size:13px;color:#444;margin-bottom:14px;line-height:1.6;">' + p.deskripsi + '</div>' : '') +
    // Tombol aksi
    '<div style="display:flex;gap:10px;">' +
      '<button class="btn-chat-seller" style="flex:1;padding:12px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;" onclick="closeModal(\'modal-seller-detail\');chatWithSeller(\'' + p.sellerUsername + '\',\'' + p.nama + '\')">&#128172; Chat Penjual</button>' +
      '<button class="btn-beli-seller" style="flex:2;padding:12px;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;background:' + warna + ';" onclick="closeModal(\'modal-seller-detail\');beliProdukSeller(' + idx + ')">' + tombolLabel + '</button>' +
    '</div>';
  openModal('modal-seller-detail');
}

// Beli produk penjual
function beliProdukSeller(idx) {
  if (!requireLogin()) return;
  const p = (window._allSellerProduk || [])[idx];
  if (!p) return;
  if (p.stok <= 0) { showToast('Stok habis!'); return; }
  // Buat item checkout dengan info penjual
  const item = {
    name: p.nama + ' (' + p.sellerNama + ')',
    price: parseInt(p.harga),
    qty: 1,
    img: CCTV_ICONS.dome,
    sellerUsername: p.sellerUsername,
    sellerNama: p.sellerNama
  };
  openCheckout([item]);
}

// Chat dengan penjual
function chatWithSeller(sellerUsername, produkNama) {
  if (!requireLogin()) return;
  // Buka chat admin umum dengan pesan awal tentang produk
  openModal('modal-chat-admin');
  updateChatAdminStatus('chat-admin-status-umum');
  renderSharedChat();
  // Isi pesan awal
  const input = document.getElementById('chat-input-admin');
  if (input) input.value = 'Halo, saya tertarik dengan produk "' + produkNama + '" dari toko ' + sellerUsername + '. Apakah masih tersedia?';
  showToast('Chat dengan penjual ' + sellerUsername);
}

// Override showPage untuk render produk penjual saat masuk halaman produk
const _origShowPage = showPage;
showPage = function(pageId) {
  _origShowPage(pageId);
  if (pageId === 'page-products') {
    renderSellerProductsOnPage();
  }
};

// Override goToLayanan juga
const _origGoToLayanan = goToLayanan;
goToLayanan = function() {
  _origGoToLayanan();
  // renderSellerProductsOnPage dipanggil via showPage override
};

// ===== MOBILE BOTTOM NAV PEMBELI =====
function updateBuyerBottomNav(pageId) {
  const nav = document.getElementById('buyer-bottom-nav');
  if (!nav) return;
  // Hanya sembunyikan di halaman home dan seller via class, bukan inline style
  // CSS yang mengatur display berdasarkan media query
  const hideOn = ['page-home', 'page-seller'];
  if (hideOn.includes(pageId)) {
    nav.style.display = 'none';
  } else {
    // Hapus inline style, biarkan CSS yang mengatur
    nav.style.removeProperty('display');
  }
  // Update badge cart
  const badge = document.getElementById('buyer-cart-badge-mobile');
  if (badge) badge.textContent = cart.reduce((s,i) => s+i.qty, 0);
  // Active state
  document.querySelectorAll('.buyer-bnav-btn').forEach(b => b.classList.remove('active'));
  const map = { 'page-products': 1, 'page-detail': 1, 'page-kontak': 3, 'page-tentang': 4 };
  const idx = map[pageId];
  if (idx !== undefined) {
    const btns = document.querySelectorAll('.buyer-bnav-btn');
    if (btns[idx]) btns[idx].classList.add('active');
  }
}

// Patch updateCartBadge untuk update mobile badge juga
const _origUpdateCartBadge = updateCartBadge;
updateCartBadge = function() {
  _origUpdateCartBadge();
  const badge = document.getElementById('buyer-cart-badge-mobile');
  if (badge) badge.textContent = cart.reduce((s,i) => s+i.qty, 0);
};

// Patch showPage untuk update bottom nav
const _origShowPageMobile = showPage;
showPage = function(pageId) {
  _origShowPageMobile(pageId);
  updateBuyerBottomNav(pageId);
};

// Init saat load
updateBuyerBottomNav('page-home');
// ===== HARGA PENGIRIMAN DINAMIS =====
let selectedOngkir = 0;
let hargaBarangCheckout = 0;

function selectPengiriman(el) {
  document.querySelectorAll('.co-group[data-group="pengiriman"] .co-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  selectedOngkir = parseInt(el.dataset.ongkir) || 0;
  updateTotalCheckout();
}

function updateTotalCheckout() {
  const summary = document.getElementById('co-ongkir-summary');
  const elBarang = document.getElementById('co-harga-barang');
  const elOngkir = document.getElementById('co-harga-ongkir');
  const elTotal  = document.getElementById('co-total-final');
  const elTotalOld = document.getElementById('co-total');
  if (!summary) return;
  summary.style.display = selectedOngkir > 0 ? 'block' : 'none';
  const totalBayar = hargaBarangCheckout + selectedOngkir;
  if (elBarang) elBarang.textContent = 'Rp' + hargaBarangCheckout.toLocaleString('id-ID');
  if (elOngkir) elOngkir.textContent = '+Rp' + selectedOngkir.toLocaleString('id-ID');
  if (elTotal)  elTotal.textContent  = 'Rp' + totalBayar.toLocaleString('id-ID');
  if (elTotalOld) elTotalOld.textContent = 'Rp' + totalBayar.toLocaleString('id-ID');
}

// ===== KONFIRMASI PENGIRIMAN DENGAN FOTO =====
// notifPengiriman: array { pesananIdx, role, foto, noresi, waktu, sudahDiteruskan }
let notifPengirimanAdmin = [];
let notifPengirimanPembeli = {};

function bukaKonfirmasiKirim(pesananIdx, role) {
  document.getElementById('konfirm-pesanan-idx').value = pesananIdx;
  document.getElementById('konfirm-role').value = role;
  document.getElementById('konfirm-foto-data').value = '';
  document.getElementById('konfirm-foto-preview').style.display = 'none';
  document.getElementById('konfirm-foto-placeholder').style.display = 'block';
  document.getElementById('konfirm-noresi').value = '';
  const info = document.getElementById('konfirm-info');
  if (info) info.style.display = role === 'penjual' ? 'block' : 'none';
  openModal('modal-konfirm-kirim');
}

function previewKonfirmFoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('File harus berupa gambar!'); return; }
  if (file.size > 5*1024*1024) { showToast('Foto maksimal 5MB'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('konfirm-foto-data').value = e.target.result;
    const prev = document.getElementById('konfirm-foto-preview');
    prev.src = e.target.result; prev.style.display = 'block';
    document.getElementById('konfirm-foto-placeholder').style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function submitKonfirmasiKirim() {
  const foto = document.getElementById('konfirm-foto-data').value;
  const noresi = document.getElementById('konfirm-noresi').value.trim();
  const idx = parseInt(document.getElementById('konfirm-pesanan-idx').value);
  const role = document.getElementById('konfirm-role').value;
  if (!foto) { showToast('Foto paket wajib diupload!'); return; }
  const waktu = new Date().toLocaleString('id-ID');
  const notif = { pesananIdx: idx, role, foto, noresi, waktu, sudahDiteruskan: false };
  if (role === 'admin') {
    // Admin langsung update status dan kirim ke pembeli
    if (orderHistory[idx]) {
      orderHistory[idx].statusKirim = 'Dikirim';
      orderHistory[idx].fotoKirim = foto;
      orderHistory[idx].noresiKirim = noresi;
      orderHistory[idx].waktuKirim = waktu;
    }
    // Simpan notif untuk pembeli
    const pembeli = currentUser;
    if (!notifPengirimanPembeli[pembeli]) notifPengirimanPembeli[pembeli] = [];
    notifPengirimanPembeli[pembeli].push(notif);
    showToast('Konfirmasi pengiriman berhasil dikirim ke pembeli!');
  } else {
    // Penjual: masuk ke antrian admin dulu
    notifPengirimanAdmin.push(notif);
    adminNotifications.push({ type: 'konfirm_kirim', data: notif, read: false });
    updateAdminNotifBadge();
    showToast('Konfirmasi dikirim ke Admin. Admin akan meneruskan ke pembeli.');
  }
  closeModal('modal-konfirm-kirim');
  openLacakPesanan();
}

// Admin teruskan konfirmasi ke pembeli
function adminTeruskankonfirmasi(idx) {
  const notif = notifPengirimanAdmin[idx];
  if (!notif) return;
  notif.sudahDiteruskan = true;
  if (orderHistory[notif.pesananIdx]) {
    orderHistory[notif.pesananIdx].statusKirim = 'Dikirim';
    orderHistory[notif.pesananIdx].fotoKirim = notif.foto;
    orderHistory[notif.pesananIdx].noresiKirim = notif.noresi;
    orderHistory[notif.pesananIdx].waktuKirim = notif.waktu;
  }
  const pembeli = currentUser;
  if (!notifPengirimanPembeli[pembeli]) notifPengirimanPembeli[pembeli] = [];
  notifPengirimanPembeli[pembeli].push(notif);
  showToast('Konfirmasi berhasil diteruskan ke pembeli!');
  renderAdminTab('notif');
}

// Pembeli lihat notif pengiriman
function lihatNotifKirim(idx) {
  const pembeli = currentUser;
  const list = notifPengirimanPembeli[pembeli] || [];
  const n = list[idx];
  if (!n) return;
  const o = orderHistory[n.pesananIdx] || {};
  document.getElementById('notif-kirim-content').innerHTML =
    '<div style="text-align:center;margin-bottom:14px;">' +
      '<div style="font-size:36px;">&#128666;</div>' +
      '<h2 style="font-size:18px;font-weight:900;color:#2e7d32;">Paket Sudah Dikirim!</h2>' +
      '<p style="font-size:13px;color:#555;">Pesanan kamu sudah diserahkan ke ekspedisi pengiriman.</p>' +
    '</div>' +
    '<img src="' + n.foto + '" style="width:100%;border-radius:10px;margin-bottom:12px;" alt="Foto paket"/>' +
    '<div style="background:#f9f9f9;border-radius:8px;padding:12px;font-size:13px;">' +
      '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;"><span style="color:#888;">Produk</span><strong>' + (o.barang||'-') + '</strong></div>' +
      (n.noresi ? '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;"><span style="color:#888;">No. Resi</span><strong style="color:#5b4fcf;">' + n.noresi + '</strong></div>' : '') +
      '<div style="display:flex;justify-content:space-between;padding:6px 0;"><span style="color:#888;">Waktu Kirim</span><strong>' + n.waktu + '</strong></div>' +
    '</div>';
  openModal('modal-notif-kirim');
}

// ===== TOP UP MINIMARKET & AGEN MPP =====
let selectedMinimarket = '';

function openTopupMPP() {
  if (!requireLogin()) return;
  switchTopupTab('minimarket');
  openModal('modal-topup-mpp');
}

function switchTopupTab(tab) {
  document.getElementById('topup-section-minimarket').style.display = tab === 'minimarket' ? 'block' : 'none';
  document.getElementById('topup-section-agen').style.display = tab === 'agen' ? 'block' : 'none';
  document.getElementById('ttab-minimarket').classList.toggle('active', tab === 'minimarket');
  document.getElementById('ttab-agen').classList.toggle('active', tab === 'agen');
  if (tab === 'agen') renderAgenMPP();
}

function pilihTopupMinimarket(nama) {
  selectedMinimarket = nama;
  document.getElementById('topup-minimarket-form').style.display = 'block';
  document.getElementById('topup-kode-result').style.display = 'none';
  const instruksi = {
    'Indomaret': '1. Datang ke kasir Indomaret terdekat\n2. Beritahu kasir: "Top Up MoentazProVisionPay"\n3. Tunjukkan kode bayar di bawah\n4. Bayar sesuai nominal\n5. Saldo otomatis masuk dalam 5 menit',
    'Alfamart':  '1. Datang ke kasir Alfamart terdekat\n2. Beritahu kasir: "Top Up MoentazProVisionPay"\n3. Tunjukkan kode bayar di bawah\n4. Bayar sesuai nominal\n5. Saldo otomatis masuk dalam 5 menit'
  };
  const el = document.getElementById('topup-instruksi-text');
  if (el) el.innerHTML = '<strong>Cara Top Up via ' + nama + ':</strong><br>' + (instruksi[nama]||'').replace(/\n/g,'<br>');
}

function prosesTopupMinimarket() {
  const nominal = parseInt(document.getElementById('topup-mm-nominal').value);
  if (!nominal || nominal < 20000) { showToast('Minimal top up Rp20.000'); return; }
  if (nominal > 5000000) { showToast('Maksimal top up Rp5.000.000'); return; }
  const kode = 'MPP' + Date.now().toString().slice(-8);
  const noAkun = currentUser.replace(/\s/g,'').toUpperCase() + '001';
  const el = document.getElementById('topup-kode-result');
  el.style.display = 'block';
  el.innerHTML =
    '<div style="text-align:center;">' +
      '<div style="font-size:12px;color:#888;margin-bottom:4px;">Kode Bayar ' + selectedMinimarket + '</div>' +
      '<div style="font-size:28px;font-weight:900;color:#5b4fcf;letter-spacing:4px;">' + kode + '</div>' +
      '<div style="font-size:13px;color:#555;margin:8px 0;">No. Akun: <strong>' + noAkun + '</strong></div>' +
      '<div style="font-size:18px;font-weight:900;color:#ff6f00;">Rp' + nominal.toLocaleString('id-ID') + '</div>' +
      '<div style="font-size:11px;color:#aaa;margin-top:6px;">Berlaku 2 jam | Tunjukkan ke kasir ' + selectedMinimarket + '</div>' +
    '</div>' +
    '<button class="cpay-btn" style="margin-top:12px;background:#2e7d32;" onclick="simulasiTopupBerhasil(' + nominal + ')">&#10003; Simulasi Pembayaran Berhasil</button>';
}

function simulasiTopupBerhasil(nominal) {
  cctvPaySaldo += nominal;
  if (!cctvPayRiwayat) cctvPayRiwayat = [];
  cctvPayRiwayat.unshift({ type:'masuk', keterangan:'Top Up via ' + selectedMinimarket, nominal, tgl: new Date().toLocaleString('id-ID') });
  updateCPayDisplay();
  closeModal('modal-topup-mpp');
  showToast('Top Up Rp' + nominal.toLocaleString('id-ID') + ' via ' + selectedMinimarket + ' berhasil!');
}

// ===== DATA 43 AGEN MPP =====
const AGEN_MPP = [
  { nama:'Agen MPP Cengkareng (Persaki)', kota:'Jakarta Barat', provinsi:'DKI Jakarta', kodepos:'11750', alamat:'Jl. Persaki, Cengkareng, Jakarta Barat', lat:-6.1559, lng:106.7347 },
  { nama:'Agen MPP Pamijahan', kota:'Kuningan', provinsi:'Jawa Barat', kodepos:'45591', alamat:'Desa Pamijahan, Kuningan, Jawa Barat', lat:-6.9833, lng:108.4833 },
  { nama:'Agen MPP Medan Kota', kota:'Medan', provinsi:'Sumatera Utara', kodepos:'20212', alamat:'Jl. Pemuda No. 12, Medan Kota', lat:3.5952, lng:98.6722 },
  { nama:'Agen MPP Bandung Tengah', kota:'Bandung', provinsi:'Jawa Barat', kodepos:'40111', alamat:'Jl. Asia Afrika No. 8, Bandung', lat:-6.9175, lng:107.6191 },
  { nama:'Agen MPP Surabaya Pusat', kota:'Surabaya', provinsi:'Jawa Timur', kodepos:'60261', alamat:'Jl. Tunjungan No. 5, Surabaya', lat:-7.2575, lng:112.7521 },
  { nama:'Agen MPP Makassar', kota:'Makassar', provinsi:'Sulawesi Selatan', kodepos:'90111', alamat:'Jl. Somba Opu No. 3, Makassar', lat:-5.1477, lng:119.4327 },
  { nama:'Agen MPP Semarang', kota:'Semarang', provinsi:'Jawa Tengah', kodepos:'50131', alamat:'Jl. Pemuda No. 7, Semarang', lat:-6.9932, lng:110.4203 },
  { nama:'Agen MPP Yogyakarta', kota:'Yogyakarta', provinsi:'DI Yogyakarta', kodepos:'55111', alamat:'Jl. Malioboro No. 15, Yogyakarta', lat:-7.7956, lng:110.3695 },
  { nama:'Agen MPP Palembang', kota:'Palembang', provinsi:'Sumatera Selatan', kodepos:'30111', alamat:'Jl. Sudirman No. 22, Palembang', lat:-2.9761, lng:104.7754 },
  { nama:'Agen MPP Pekanbaru', kota:'Pekanbaru', provinsi:'Riau', kodepos:'28291', alamat:'Jl. Jendral Sudirman No. 9, Pekanbaru', lat:0.5071, lng:101.4478 },
  { nama:'Agen MPP Batam', kota:'Batam', provinsi:'Kepulauan Riau', kodepos:'29444', alamat:'Jl. Imam Bonjol No. 4, Batam', lat:1.1301, lng:104.0529 },
  { nama:'Agen MPP Denpasar', kota:'Denpasar', provinsi:'Bali', kodepos:'80111', alamat:'Jl. Gajah Mada No. 11, Denpasar', lat:-8.6705, lng:115.2126 },
  { nama:'Agen MPP Banjarmasin', kota:'Banjarmasin', provinsi:'Kalimantan Selatan', kodepos:'70111', alamat:'Jl. Lambung Mangkurat No. 6, Banjarmasin', lat:-3.3194, lng:114.5908 },
  { nama:'Agen MPP Samarinda', kota:'Samarinda', provinsi:'Kalimantan Timur', kodepos:'75111', alamat:'Jl. Gajah Mada No. 18, Samarinda', lat:-0.5022, lng:117.1536 },
  { nama:'Agen MPP Pontianak', kota:'Pontianak', provinsi:'Kalimantan Barat', kodepos:'78111', alamat:'Jl. Tanjungpura No. 3, Pontianak', lat:-0.0263, lng:109.3425 },
  { nama:'Agen MPP Manado', kota:'Manado', provinsi:'Sulawesi Utara', kodepos:'95111', alamat:'Jl. Sam Ratulangi No. 7, Manado', lat:1.4748, lng:124.8421 },
  { nama:'Agen MPP Kendari', kota:'Kendari', provinsi:'Sulawesi Tenggara', kodepos:'93111', alamat:'Jl. Mayjen Sutoyo No. 5, Kendari', lat:-3.9985, lng:122.5127 },
  { nama:'Agen MPP Mataram', kota:'Mataram', provinsi:'Nusa Tenggara Barat', kodepos:'83111', alamat:'Jl. Pejanggik No. 12, Mataram', lat:-8.5833, lng:116.1167 },
  { nama:'Agen MPP Kupang', kota:'Kupang', provinsi:'Nusa Tenggara Timur', kodepos:'85111', alamat:'Jl. El Tari No. 8, Kupang', lat:-10.1772, lng:123.6070 },
  { nama:'Agen MPP Jayapura', kota:'Jayapura', provinsi:'Papua', kodepos:'99111', alamat:'Jl. Ahmad Yani No. 3, Jayapura', lat:-2.5916, lng:140.6690 },
  { nama:'Agen MPP Ambon', kota:'Ambon', provinsi:'Maluku', kodepos:'97111', alamat:'Jl. Pattimura No. 6, Ambon', lat:-3.6954, lng:128.1814 },
  { nama:'Agen MPP Ternate', kota:'Ternate', provinsi:'Maluku Utara', kodepos:'97711', alamat:'Jl. Pahlawan Revolusi No. 4, Ternate', lat:0.7833, lng:127.3667 },
  { nama:'Agen MPP Banda Aceh', kota:'Banda Aceh', provinsi:'Aceh', kodepos:'23116', alamat:'Jl. Cut Nyak Dhien No. 9, Banda Aceh', lat:5.5483, lng:95.3238 },
  { nama:'Agen MPP Padang', kota:'Padang', provinsi:'Sumatera Barat', kodepos:'25111', alamat:'Jl. Sudirman No. 14, Padang', lat:-0.9471, lng:100.4172 },
  { nama:'Agen MPP Jambi', kota:'Jambi', provinsi:'Jambi', kodepos:'36111', alamat:'Jl. Sultan Thaha No. 7, Jambi', lat:-1.6101, lng:103.6131 },
  { nama:'Agen MPP Bengkulu', kota:'Bengkulu', provinsi:'Bengkulu', kodepos:'38221', alamat:'Jl. Suprapto No. 5, Bengkulu', lat:-3.7928, lng:102.2608 },
  { nama:'Agen MPP Bandar Lampung', kota:'Bandar Lampung', provinsi:'Lampung', kodepos:'35111', alamat:'Jl. Raden Intan No. 11, Bandar Lampung', lat:-5.4292, lng:105.2613 },
  { nama:'Agen MPP Serang', kota:'Serang', provinsi:'Banten', kodepos:'42111', alamat:'Jl. Jendral Sudirman No. 8, Serang', lat:-6.1104, lng:106.1640 },
  { nama:'Agen MPP Bekasi', kota:'Bekasi', provinsi:'Jawa Barat', kodepos:'17111', alamat:'Jl. Ahmad Yani No. 15, Bekasi', lat:-6.2383, lng:106.9756 },
  { nama:'Agen MPP Bogor', kota:'Bogor', provinsi:'Jawa Barat', kodepos:'16111', alamat:'Jl. Sudirman No. 6, Bogor', lat:-6.5971, lng:106.8060 },
  { nama:'Agen MPP Depok', kota:'Depok', provinsi:'Jawa Barat', kodepos:'16421', alamat:'Jl. Margonda Raya No. 20, Depok', lat:-6.4025, lng:106.7942 },
  { nama:'Agen MPP Tangerang', kota:'Tangerang', provinsi:'Banten', kodepos:'15111', alamat:'Jl. Daan Mogot No. 9, Tangerang', lat:-6.1783, lng:106.6319 },
  { nama:'Agen MPP Solo', kota:'Surakarta', provinsi:'Jawa Tengah', kodepos:'57141', alamat:'Jl. Slamet Riyadi No. 12, Solo', lat:-7.5755, lng:110.8243 },
  { nama:'Agen MPP Malang', kota:'Malang', provinsi:'Jawa Timur', kodepos:'65111', alamat:'Jl. Basuki Rahmat No. 7, Malang', lat:-7.9797, lng:112.6304 },
  { nama:'Agen MPP Kediri', kota:'Kediri', provinsi:'Jawa Timur', kodepos:'64111', alamat:'Jl. Dhoho No. 5, Kediri', lat:-7.8166, lng:112.0114 },
  { nama:'Agen MPP Balikpapan', kota:'Balikpapan', provinsi:'Kalimantan Timur', kodepos:'76111', alamat:'Jl. Jendral Sudirman No. 10, Balikpapan', lat:-1.2654, lng:116.8312 },
  { nama:'Agen MPP Palangka Raya', kota:'Palangka Raya', provinsi:'Kalimantan Tengah', kodepos:'73111', alamat:'Jl. Tjilik Riwut No. 8, Palangka Raya', lat:-2.2161, lng:113.9135 },
  { nama:'Agen MPP Gorontalo', kota:'Gorontalo', provinsi:'Gorontalo', kodepos:'96111', alamat:'Jl. Agus Salim No. 4, Gorontalo', lat:0.5435, lng:123.0568 },
  { nama:'Agen MPP Palu', kota:'Palu', provinsi:'Sulawesi Tengah', kodepos:'94111', alamat:'Jl. Sudirman No. 6, Palu', lat:-0.8917, lng:119.8707 },
  { nama:'Agen MPP Mamuju', kota:'Mamuju', provinsi:'Sulawesi Barat', kodepos:'91511', alamat:'Jl. Soekarno Hatta No. 3, Mamuju', lat:-2.6741, lng:118.8886 },
  { nama:'Agen MPP Sorong', kota:'Sorong', provinsi:'Papua Barat', kodepos:'98411', alamat:'Jl. Ahmad Yani No. 7, Sorong', lat:-0.8762, lng:131.2461 },
  { nama:'Agen MPP Manokwari', kota:'Manokwari', provinsi:'Papua Barat', kodepos:'98311', alamat:'Jl. Trikora No. 5, Manokwari', lat:-0.8615, lng:134.0622 },
  { nama:'Agen MPP Tanjung Pinang', kota:'Tanjung Pinang', provinsi:'Kepulauan Riau', kodepos:'29111', alamat:'Jl. Merdeka No. 9, Tanjung Pinang', lat:0.9167, lng:104.4500 }
];

function renderAgenMPP() {
  filterAgenMPP();
}

function filterAgenMPP() {
  const q = (document.getElementById('agen-search')?.value || '').toLowerCase();
  const list = q ? AGEN_MPP.filter(a => a.nama.toLowerCase().includes(q) || a.kota.toLowerCase().includes(q) || a.provinsi.toLowerCase().includes(q) || a.kodepos.includes(q)) : AGEN_MPP;
  const el = document.getElementById('agen-list');
  if (!el) return;
  if (list.length === 0) { el.innerHTML = '<div style="text-align:center;color:#aaa;padding:20px;">Tidak ditemukan</div>'; return; }
  el.innerHTML = list.map((a, i) =>
    '<div class="agen-card">' +
      '<div class="agen-card-header">' +
        '<div class="agen-avatar">&#128205;</div>' +
        '<div style="flex:1;">' +
          '<strong>' + a.nama + '</strong>' +
          '<div style="font-size:11px;color:#888;">' + a.kota + ', ' + a.provinsi + ' ' + a.kodepos + '</div>' +
          '<div style="font-size:11px;color:#555;margin-top:2px;">' + a.alamat + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="agen-card-actions">' +
        '<a href="https://www.google.com/maps/search/' + encodeURIComponent(a.alamat + ' ' + a.kota) + '" target="_blank" class="agen-btn-maps agen-btn-google">&#127758; Google Maps</a>' +
        '<a href="https://maps.apple.com/?q=' + encodeURIComponent(a.alamat + ' ' + a.kota) + '" target="_blank" class="agen-btn-maps agen-btn-apple">&#127758; Apple Maps</a>' +
      '</div>' +
    '</div>'
  ).join('');
}
