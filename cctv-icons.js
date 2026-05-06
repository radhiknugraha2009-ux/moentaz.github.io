// ===== CCTV PIXEL ART SVGs =====
// Setiap produk punya warna aksen berbeda tapi bentuk CCTV pixel

const CCTV_ICONS = {
  // Dome camera (bulat) - biru
  dome: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- body dome -->
    <rect x='16' y='28' width='32' height='18' fill='%23333'/>
    <rect x='20' y='24' width='24' height='6' fill='%23444'/>
    <rect x='24' y='20' width='16' height='6' fill='%23555'/>
    <!-- lens -->
    <rect x='26' y='30' width='12' height='12' fill='%231a237e'/>
    <rect x='28' y='32' width='8' height='8' fill='%233949ab'/>
    <rect x='30' y='34' width='4' height='4' fill='%237986cb'/>
    <rect x='31' y='35' width='2' height='2' fill='%23fff'/>
    <!-- IR dots -->
    <rect x='18' y='31' width='3' height='3' fill='%23e53935'/>
    <rect x='18' y='37' width='3' height='3' fill='%23e53935'/>
    <rect x='43' y='31' width='3' height='3' fill='%23e53935'/>
    <rect x='43' y='37' width='3' height='3' fill='%23e53935'/>
    <!-- mount -->
    <rect x='28' y='46' width='8' height='4' fill='%23222'/>
    <rect x='24' y='50' width='16' height='3' fill='%23111'/>
    <!-- highlight -->
    <rect x='20' y='28' width='4' height='2' fill='%23666'/>
  </svg>`,

  // PTZ / Pan-Tilt (Tapo C500) - ungu
  ptz: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- base mount -->
    <rect x='26' y='50' width='12' height='4' fill='%23222'/>
    <rect x='28' y='46' width='8' height='5' fill='%23333'/>
    <!-- body -->
    <rect x='18' y='26' width='28' height='22' rx='0' fill='%23444'/>
    <rect x='20' y='24' width='24' height='4' fill='%23555'/>
    <!-- lens barrel -->
    <rect x='22' y='30' width='20' height='14' fill='%235b4fcf'/>
    <rect x='24' y='32' width='16' height='10' fill='%237b6fe8'/>
    <rect x='27' y='34' width='10' height='6' fill='%231a237e'/>
    <rect x='29' y='35' width='6' height='4' fill='%233949ab'/>
    <rect x='30' y='36' width='4' height='2' fill='%23fff'/>
    <!-- IR -->
    <rect x='19' y='29' width='2' height='2' fill='%23e53935'/>
    <rect x='19' y='35' width='2' height='2' fill='%23e53935'/>
    <rect x='43' y='29' width='2' height='2' fill='%23e53935'/>
    <rect x='43' y='35' width='2' height='2' fill='%23e53935'/>
    <!-- antenna -->
    <rect x='38' y='16' width='3' height='12' fill='%23333'/>
    <rect x='37' y='14' width='5' height='3' fill='%23555'/>
  </svg>`,

  // Bullet camera - hijau
  bullet: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- mount bracket -->
    <rect x='28' y='10' width='8' height='14' fill='%23333'/>
    <rect x='24' y='10' width='16' height='4' fill='%23222'/>
    <!-- body tube -->
    <rect x='10' y='26' width='44' height='16' fill='%23444'/>
    <rect x='10' y='28' width='44' height='4' fill='%23555'/>
    <!-- front lens -->
    <rect x='8' y='24' width='8' height='20' fill='%23333'/>
    <rect x='6' y='26' width='4' height='16' fill='%232e7d32'/>
    <rect x='7' y='28' width='2' height='12' fill='%2343a047'/>
    <rect x='7' y='31' width='2' height='6' fill='%2381c784'/>
    <!-- IR ring -->
    <rect x='14' y='27' width='3' height='3' fill='%23e53935'/>
    <rect x='14' y='34' width='3' height='3' fill='%23e53935'/>
    <rect x='20' y='27' width='3' height='3' fill='%23e53935'/>
    <rect x='20' y='34' width='3' height='3' fill='%23e53935'/>
    <!-- back end -->
    <rect x='52' y='26' width='6' height='16' fill='%23222'/>
    <!-- cable -->
    <rect x='55' y='30' width='4' height='3' fill='%23111'/>
  </svg>`,

  // Dual lens / Guardian - oranye
  dual: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- body -->
    <rect x='14' y='22' width='36' height='24' fill='%23444'/>
    <rect x='16' y='20' width='32' height='4' fill='%23555'/>
    <!-- lens kiri -->
    <rect x='16' y='26' width='14' height='14' fill='%23e65100'/>
    <rect x='18' y='28' width='10' height='10' fill='%23ff6f00'/>
    <rect x='20' y='30' width='6' height='6' fill='%23ff8f00'/>
    <rect x='21' y='31' width='4' height='4' fill='%23fff8e1'/>
    <rect x='22' y='32' width='2' height='2' fill='%23fff'/>
    <!-- lens kanan -->
    <rect x='34' y='26' width='14' height='14' fill='%23e65100'/>
    <rect x='36' y='28' width='10' height='10' fill='%23ff6f00'/>
    <rect x='38' y='30' width='6' height='6' fill='%23ff8f00'/>
    <rect x='39' y='31' width='4' height='4' fill='%23fff8e1'/>
    <rect x='40' y='32' width='2' height='2' fill='%23fff'/>
    <!-- IR -->
    <rect x='15' y='24' width='2' height='2' fill='%23e53935'/>
    <rect x='47' y='24' width='2' height='2' fill='%23e53935'/>
    <rect x='15' y='40' width='2' height='2' fill='%23e53935'/>
    <rect x='47' y='40' width='2' height='2' fill='%23e53935'/>
    <!-- mount -->
    <rect x='28' y='46' width='8' height='6' fill='%23222'/>
    <rect x='24' y='52' width='16' height='3' fill='%23111'/>
  </svg>`,

  // Wireless / ZTE - cyan
  wireless: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- body bulat -->
    <rect x='18' y='22' width='28' height='26' fill='%23444'/>
    <rect x='22' y='18' width='20' height='6' fill='%23555'/>
    <rect x='26' y='14' width='12' height='6' fill='%23444'/>
    <!-- lens -->
    <rect x='24' y='28' width='16' height='14' fill='%2300838f'/>
    <rect x='26' y='30' width='12' height='10' fill='%2300acc1'/>
    <rect x='28' y='32' width='8' height='6' fill='%234dd0e1'/>
    <rect x='30' y='33' width='4' height='4' fill='%23e0f7fa'/>
    <rect x='31' y='34' width='2' height='2' fill='%23fff'/>
    <!-- wifi symbol -->
    <rect x='38' y='14' width='2' height='2' fill='%2300bcd4'/>
    <rect x='36' y='12' width='6' height='2' fill='%2300bcd4'/>
    <rect x='34' y='10' width='10' height='2' fill='%2300bcd4'/>
    <!-- IR -->
    <rect x='19' y='25' width='2' height='2' fill='%23e53935'/>
    <rect x='43' y='25' width='2' height='2' fill='%23e53935'/>
    <rect x='19' y='40' width='2' height='2' fill='%23e53935'/>
    <rect x='43' y='40' width='2' height='2' fill='%23e53935'/>
    <!-- mount -->
    <rect x='28' y='48' width='8' height='4' fill='%23222'/>
    <rect x='24' y='52' width='16' height='3' fill='%23111'/>
  </svg>`,

  // Indoor dome kecil / Hikvision - merah
  indoor: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- ceiling mount -->
    <rect x='22' y='10' width='20' height='4' fill='%23222'/>
    <rect x='26' y='14' width='12' height='6' fill='%23333'/>
    <!-- dome body -->
    <rect x='16' y='20' width='32' height='10' fill='%23555'/>
    <rect x='14' y='28' width='36' height='14' fill='%23444'/>
    <rect x='16' y='40' width='32' height='4' fill='%23333'/>
    <!-- lens -->
    <rect x='24' y='30' width='16' height='10' fill='%23b71c1c'/>
    <rect x='26' y='32' width='12' height='6' fill='%23e53935'/>
    <rect x='28' y='33' width='8' height='4' fill='%23ef9a9a'/>
    <rect x='30' y='34' width='4' height='2' fill='%23fff'/>
    <!-- IR ring -->
    <rect x='17' y='30' width='3' height='3' fill='%23e53935'/>
    <rect x='17' y='36' width='3' height='3' fill='%23e53935'/>
    <rect x='44' y='30' width='3' height='3' fill='%23e53935'/>
    <rect x='44' y='36' width='3' height='3' fill='%23e53935'/>
  </svg>`,

  // Smart home / Ezviz - hijau muda
  smart: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- base -->
    <rect x='24' y='50' width='16' height='4' fill='%23222'/>
    <rect x='28' y='44' width='8' height='8' fill='%23333'/>
    <!-- body slim -->
    <rect x='20' y='20' width='24' height='26' fill='%23444'/>
    <rect x='22' y='18' width='20' height='4' fill='%23555'/>
    <!-- lens -->
    <rect x='24' y='26' width='16' height='14' fill='%231b5e20'/>
    <rect x='26' y='28' width='12' height='10' fill='%232e7d32'/>
    <rect x='28' y='30' width='8' height='6' fill='%2343a047'/>
    <rect x='30' y='31' width='4' height='4' fill='%23a5d6a7'/>
    <rect x='31' y='32' width='2' height='2' fill='%23fff'/>
    <!-- status LED -->
    <rect x='22' y='42' width='3' height='3' fill='%2300e676'/>
    <!-- IR -->
    <rect x='21' y='27' width='2' height='2' fill='%23e53935'/>
    <rect x='41' y='27' width='2' height='2' fill='%23e53935'/>
    <rect x='21' y='37' width='2' height='2' fill='%23e53935'/>
    <rect x='41' y='37' width='2' height='2' fill='%23e53935'/>
  </svg>`,

  // Outdoor bullet besar / TVT - abu gelap
  outdoor: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' shape-rendering='crispEdges'>
    <rect width='64' height='64' fill='%23e8eaf6'/>
    <!-- bracket atas -->
    <rect x='26' y='8' width='12' height='16' fill='%23333'/>
    <rect x='22' y='8' width='20' height='5' fill='%23222'/>
    <!-- body besar -->
    <rect x='8' y='28' width='48' height='14' fill='%23424242'/>
    <rect x='8' y='26' width='48' height='4' fill='%23616161'/>
    <rect x='8' y='40' width='48' height='4' fill='%23212121'/>
    <!-- lens depan -->
    <rect x='4' y='24' width='10' height='20' fill='%23333'/>
    <rect x='4' y='26' width='6' height='16' fill='%23455a64'/>
    <rect x='5' y='28' width='4' height='12' fill='%23607d8b'/>
    <rect x='6' y='31' width='2' height='6' fill='%23b0bec5'/>
    <!-- IR array -->
    <rect x='16' y='28' width='3' height='3' fill='%23e53935'/>
    <rect x='22' y='28' width='3' height='3' fill='%23e53935'/>
    <rect x='28' y='28' width='3' height='3' fill='%23e53935'/>
    <rect x='16' y='37' width='3' height='3' fill='%23e53935'/>
    <rect x='22' y='37' width='3' height='3' fill='%23e53935'/>
    <rect x='28' y='37' width='3' height='3' fill='%23e53935'/>
    <!-- back -->
    <rect x='54' y='28' width='6' height='14' fill='%23212121'/>
    <rect x='56' y='32' width='4' height='4' fill='%23111'/>
  </svg>`,
};
