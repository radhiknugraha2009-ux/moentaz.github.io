// ============================================================
// GOOGLE APPS SCRIPT — Database untuk Moentaz ProVision
// Copy-paste kode ini ke Google Apps Script
// ============================================================

var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var result = {};

    if (action === 'saveUser') {
      result = saveUser(data.user);
    } else if (action === 'saveOrder') {
      result = saveOrder(data.order);
    } else if (action === 'saveSeller') {
      result = saveSeller(data.seller);
    } else if (action === 'updateOrder') {
      result = updateOrder(data.orderId, data.updates);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    var result = {};

    if (action === 'getUsers') {
      result = getUsers();
    } else if (action === 'getOrders') {
      result = getOrders();
    } else if (action === 'getSellers') {
      result = getSellers();
    }

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== USERS =====
function saveUser(user) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('users');
  
  // Buat header jika belum ada
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Nama', 'Email', 'Telepon', 'Alamat', 'Terdaftar']);
  }
  
  // Cek duplikat email
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][2] === user.email) {
      return { status: 'exists' };
    }
  }
  
  var id = 'USR' + Date.now();
  sheet.appendRow([id, user.username, user.email, user.telpon, user.alamat, user.terdaftar]);
  return { status: 'saved', id: id };
}

function getUsers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('users');
  if (sheet.getLastRow() <= 1) return [];
  
  var data = sheet.getDataRange().getValues();
  var users = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      users.push({
        id: data[i][0],
        username: data[i][1],
        email: data[i][2],
        telpon: data[i][3],
        alamat: data[i][4],
        terdaftar: data[i][5]
      });
    }
  }
  return users;
}

// ===== ORDERS =====
function saveOrder(order) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('orders');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Pembeli', 'Barang', 'Total', 'Pembayaran', 'Pengiriman', 'Waktu', 'Status', 'Sumber']);
  }
  
  var id = 'ORD' + Date.now();
  sheet.appendRow([
    id,
    order.pembeli || '-',
    order.barang || '-',
    order.total || '-',
    order.pembayaran || '-',
    order.pengiriman || '-',
    order.waktu || new Date().toLocaleString('id-ID'),
    'Diproses',
    order.sumberProduk || 'resmi'
  ]);
  return { status: 'saved', id: id };
}

function getOrders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('orders');
  if (sheet.getLastRow() <= 1) return [];
  
  var data = sheet.getDataRange().getValues();
  var orders = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      orders.push({
        id: data[i][0],
        pembeli: data[i][1],
        barang: data[i][2],
        total: data[i][3],
        pembayaran: data[i][4],
        pengiriman: data[i][5],
        waktu: data[i][6],
        status: data[i][7],
        sumberProduk: data[i][8]
      });
    }
  }
  return orders;
}

function updateOrder(orderId, updates) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('orders');
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {
      if (updates.status) sheet.getRange(i+1, 8).setValue(updates.status);
      return { status: 'updated' };
    }
  }
  return { status: 'not_found' };
}

// ===== SELLERS =====
function saveSeller(seller) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sellers');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['ID', 'Nama Toko', 'Username', 'Email', 'Telepon', 'Kota', 'Terdaftar']);
  }
  
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][3] === seller.email) {
      return { status: 'exists' };
    }
  }
  
  var id = 'SEL' + Date.now();
  sheet.appendRow([id, seller.namaToko, seller.username, seller.email, seller.telpon, seller.kota, seller.terdaftar]);
  return { status: 'saved', id: id };
}

function getSellers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('sellers');
  if (sheet.getLastRow() <= 1) return [];
  
  var data = sheet.getDataRange().getValues();
  var sellers = [];
  for (var i = 1; i < data.length; i++) {
    if (data[i][0]) {
      sellers.push({
        id: data[i][0],
        namaToko: data[i][1],
        username: data[i][2],
        email: data[i][3],
        telpon: data[i][4],
        kota: data[i][5],
        terdaftar: data[i][6]
      });
    }
  }
  return sellers;
}
