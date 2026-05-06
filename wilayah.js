// ===== DATA WILAYAH INDONESIA =====
const WILAYAH = {
  "Aceh": {
    "Banda Aceh": { "Baiturrahman": ["23116","23117"], "Kuta Alam": ["23127","23128"], "Syiah Kuala": ["23111","23112"], "Meuraxa": ["23233","23234"], "Lueng Bata": ["23247","23248"] },
    "Aceh Besar": { "Ingin Jaya": ["23371","23372"], "Kuta Baro": ["23361","23362"], "Darul Imarah": ["23351","23352"] },
    "Sabang": { "Sukakarya": ["23512","23513"], "Sukajaya": ["23511","23514"] }
  },
  "Sumatera Utara": {
    "Medan": { "Medan Kota": ["20212","20213"], "Medan Baru": ["20152","20153"], "Medan Sunggal": ["20128","20129"], "Medan Helvetia": ["20124","20125"], "Medan Selayang": ["20131","20132"], "Medan Tembung": ["20221","20222"], "Medan Amplas": ["20148","20149"] },
    "Deli Serdang": { "Lubuk Pakam": ["20514","20515"], "Percut Sei Tuan": ["20371","20372"], "Sunggal": ["20351","20352"] },
    "Binjai": { "Binjai Kota": ["20712","20713"], "Binjai Selatan": ["20741","20742"] },
    "Tebing Tinggi": { "Padang Hulu": ["20612","20613"], "Rambutan": ["20631","20632"] }
  },
  "Sumatera Barat": {
    "Padang": { "Padang Barat": ["25111","25112"], "Padang Timur": ["25121","25122"], "Kuranji": ["25152","25153"], "Lubuk Kilangan": ["25181","25182"] },
    "Bukittinggi": { "Guguk Panjang": ["26111","26112"], "Mandiangin Koto Selayan": ["26131","26132"] },
    "Payakumbuh": { "Payakumbuh Barat": ["26211","26212"], "Payakumbuh Timur": ["26221","26222"] }
  },
  "Riau": {
    "Pekanbaru": { "Tampan": ["28291","28292"], "Marpoyan Damai": ["28125","28126"], "Bukit Raya": ["28281","28282"], "Sail": ["28127","28128"], "Senapelan": ["28151","28152"] },
    "Dumai": { "Dumai Kota": ["28811","28812"], "Dumai Barat": ["28821","28822"] }
  },
  "Kepulauan Riau": {
    "Batam": { "Batam Kota": ["29444","29445"], "Sekupang": ["29422","29423"], "Nongsa": ["29465","29466"], "Batu Ampar": ["29451","29452"] },
    "Tanjung Pinang": { "Tanjungpinang Kota": ["29111","29112"], "Bukit Bestari": ["29121","29122"] }
  },
  "Jambi": {
    "Jambi": { "Pasar Jambi": ["36111","36112"], "Telanaipura": ["36122","36123"], "Jambi Selatan": ["36138","36139"], "Kota Baru": ["36128","36129"] },
    "Sungai Penuh": { "Pesisir Bukit": ["37112","37113"], "Hamparan Rawang": ["37121","37122"] }
  },
  "Sumatera Selatan": {
    "Palembang": { "Ilir Barat I": ["30111","30112"], "Ilir Timur I": ["30121","30122"], "Seberang Ulu I": ["30251","30252"], "Bukit Kecil": ["30131","30132"], "Kemuning": ["30151","30152"] },
    "Lubuklinggau": { "Lubuklinggau Barat I": ["31611","31612"], "Lubuklinggau Timur I": ["31621","31622"] }
  },
  "Bengkulu": {
    "Bengkulu": { "Ratu Agung": ["38221","38222"], "Teluk Segara": ["38111","38112"], "Gading Cempaka": ["38225","38226"] }
  },
  "Lampung": {
    "Bandar Lampung": { "Tanjung Karang Pusat": ["35111","35112"], "Kedaton": ["35148","35149"], "Rajabasa": ["35144","35145"], "Sukarame": ["35131","35132"], "Panjang": ["35241","35242"] },
    "Metro": { "Metro Pusat": ["34111","34112"], "Metro Timur": ["34124","34125"] }
  },
  "DKI Jakarta": {
    "Jakarta Pusat": { "Gambir": ["10110","10120"], "Sawah Besar": ["10710","10720"], "Kemayoran": ["10610","10620"], "Senen": ["10410","10420"], "Cempaka Putih": ["10510","10520"], "Menteng": ["10310","10320"], "Tanah Abang": ["10210","10220"], "Johar Baru": ["10530","10540"] },
    "Jakarta Utara": { "Penjaringan": ["14440","14450"], "Pademangan": ["14410","14420"], "Tanjung Priok": ["14310","14320"], "Koja": ["14210","14220"], "Kelapa Gading": ["14240","14250"], "Cilincing": ["14110","14120"] },
    "Jakarta Barat": { "Tambora": ["11210","11220"], "Taman Sari": ["11150","11160"], "Grogol Petamburan": ["11450","11460"], "Palmerah": ["11480","11490"], "Kebon Jeruk": ["11530","11540"], "Kembangan": ["11610","11620"], "Cengkareng": ["11730","11740"], "Kalideres": ["11810","11820"] },
    "Jakarta Selatan": { "Tebet": ["12810","12820"], "Setiabudi": ["12910","12920"], "Mampang Prapatan": ["12760","12770"], "Pancoran": ["12770","12780"], "Kebayoran Baru": ["12110","12120"], "Kebayoran Lama": ["12210","12220"], "Pesanggrahan": ["12310","12320"], "Cilandak": ["12430","12440"], "Pasar Minggu": ["12510","12520"], "Jagakarsa": ["12610","12620"] },
    "Jakarta Timur": { "Matraman": ["13140","13150"], "Pulo Gadung": ["13210","13220"], "Jatinegara": ["13310","13320"], "Duren Sawit": ["13440","13450"], "Kramat Jati": ["13510","13520"], "Pasar Rebo": ["13710","13720"], "Ciracas": ["13740","13750"], "Cipayung": ["13840","13850"], "Cakung": ["13910","13920"], "Makasar": ["13570","13580"] },
    "Jakarta Selatan (Kep.)": { "Kepulauan Seribu Utara": ["14550","14560"], "Kepulauan Seribu Selatan": ["14510","14520"] }
  },
  "Jawa Barat": {
    "Bandung": { "Bandung Wetan": ["40111","40112"], "Coblong": ["40132","40133"], "Cicendo": ["40171","40172"], "Andir": ["40181","40182"], "Astanaanyar": ["40241","40242"], "Bojongloa Kaler": ["40231","40232"], "Buahbatu": ["40261","40262"], "Rancasari": ["40292","40293"], "Gedebage": ["40295","40296"], "Cibiru": ["40615","40616"] },
    "Bekasi": { "Bekasi Timur": ["17111","17112"], "Bekasi Barat": ["17134","17135"], "Bekasi Selatan": ["17141","17142"], "Bekasi Utara": ["17121","17122"], "Rawalumbu": ["17116","17117"], "Mustikajaya": ["17157","17158"], "Bantargebang": ["17151","17152"], "Pondokgede": ["17411","17412"] },
    "Bogor": { "Bogor Tengah": ["16111","16112"], "Bogor Utara": ["16152","16153"], "Bogor Selatan": ["16132","16133"], "Bogor Timur": ["16143","16144"], "Bogor Barat": ["16117","16118"], "Tanah Sareal": ["16161","16162"] },
    "Depok": { "Beji": ["16421","16422"], "Pancoran Mas": ["16431","16432"], "Sukmajaya": ["16411","16412"], "Cimanggis": ["16451","16452"], "Sawangan": ["16511","16512"], "Limo": ["16515","16516"] },
    "Cimahi": { "Cimahi Utara": ["40511","40512"], "Cimahi Tengah": ["40521","40522"], "Cimahi Selatan": ["40531","40532"] },
    "Tasikmalaya": { "Tawang": ["46111","46112"], "Cihideung": ["46121","46122"], "Cipedes": ["46131","46132"] },
    "Cirebon": { "Kejaksan": ["45121","45122"], "Kesambi": ["45131","45132"], "Lemahwungkuk": ["45111","45112"] }
  },
  "Banten": {
    "Tangerang": { "Tangerang": ["15111","15112"], "Cipondoh": ["15148","15149"], "Pinang": ["15141","15142"], "Ciledug": ["15151","15152"], "Karawaci": ["15115","15116"] },
    "Tangerang Selatan": { "Pamulang": ["15411","15412"], "Ciputat": ["15411","15412"], "Serpong": ["15310","15311"], "Pondok Aren": ["15221","15222"] },
    "Serang": { "Serang": ["42111","42112"], "Cipocok Jaya": ["42121","42122"], "Curug": ["42171","42172"] },
    "Cilegon": { "Cilegon": ["42411","42412"], "Jombang": ["42421","42422"], "Grogol": ["42431","42432"] }
  },
  "Jawa Tengah": {
    "Semarang": { "Semarang Tengah": ["50131","50132"], "Semarang Barat": ["50141","50142"], "Semarang Timur": ["50121","50122"], "Semarang Selatan": ["50241","50242"], "Semarang Utara": ["50171","50172"], "Gayamsari": ["50161","50162"], "Genuk": ["50111","50112"], "Pedurungan": ["50191","50192"], "Tembalang": ["50271","50272"], "Banyumanik": ["50261","50262"] },
    "Surakarta": { "Laweyan": ["57141","57142"], "Serengan": ["57151","57152"], "Pasar Kliwon": ["57111","57112"], "Jebres": ["57121","57122"], "Banjarsari": ["57131","57132"] },
    "Magelang": { "Magelang Tengah": ["56111","56112"], "Magelang Utara": ["56115","56116"], "Magelang Selatan": ["56121","56122"] },
    "Pekalongan": { "Pekalongan Barat": ["51111","51112"], "Pekalongan Timur": ["51121","51122"], "Pekalongan Utara": ["51141","51142"] },
    "Salatiga": { "Sidorejo": ["50711","50712"], "Tingkir": ["50741","50742"], "Argomulyo": ["50731","50732"] }
  },
  "DI Yogyakarta": {
    "Yogyakarta": { "Danurejan": ["55211","55212"], "Gedongtengen": ["55271","55272"], "Gondokusuman": ["55221","55222"], "Gondomanan": ["55122","55123"], "Jetis": ["55231","55232"], "Kotagede": ["55171","55172"], "Kraton": ["55131","55132"], "Mantrijeron": ["55141","55142"], "Mergangsan": ["55151","55152"], "Ngampilan": ["55261","55262"], "Pakualaman": ["55166","55167"], "Tegalrejo": ["55241","55242"], "Umbulharjo": ["55161","55162"], "Wirobrajan": ["55251","55252"] },
    "Sleman": { "Depok": ["55281","55282"], "Mlati": ["55285","55286"], "Gamping": ["55291","55292"], "Godean": ["55264","55265"] },
    "Bantul": { "Bantul": ["55711","55712"], "Sewon": ["55185","55186"], "Kasihan": ["55181","55182"] }
  },
  "Jawa Timur": {
    "Surabaya": { "Tegalsari": ["60261","60262"], "Simokerto": ["60141","60142"], "Genteng": ["60271","60272"], "Bubutan": ["60171","60172"], "Bulak": ["60121","60122"], "Kenjeran": ["60131","60132"], "Semampir": ["60151","60152"], "Pabean Cantian": ["60161","60163"], "Krembangan": ["60175","60176"], "Wonokromo": ["60241","60242"], "Wonocolo": ["60237","60238"], "Wiyung": ["60227","60228"], "Karang Pilang": ["60221","60222"], "Jambangan": ["60231","60232"], "Gayungan": ["60235","60236"], "Dukuh Pakis": ["60225","60226"], "Sawahan": ["60251","60252"], "Sukomanunggal": ["60188","60189"], "Tandes": ["60185","60186"], "Asemrowo": ["60183","60184"], "Benowo": ["60191","60192"], "Pakal": ["60197","60198"], "Lakarsantri": ["60213","60214"], "Sambikerep": ["60216","60217"], "Mulyorejo": ["60115","60116"], "Sukolilo": ["60111","60112"], "Tambaksari": ["60133","60134"], "Gubeng": ["60281","60282"], "Tenggilis Mejoyo": ["60292","60293"], "Gunung Anyar": ["60294","60295"], "Rungkut": ["60293","60294"], "Wonocolo": ["60237","60238"] },
    "Malang": { "Klojen": ["65111","65112"], "Blimbing": ["65121","65122"], "Kedungkandang": ["65131","65132"], "Sukun": ["65141","65142"], "Lowokwaru": ["65141","65142"] },
    "Kediri": { "Kota": ["64111","64112"], "Mojoroto": ["64111","64112"], "Pesantren": ["64131","64132"] },
    "Blitar": { "Kepanjenkidul": ["66111","66112"], "Sananwetan": ["66137","66138"], "Sukorejo": ["66121","66122"] },
    "Madiun": { "Manguharjo": ["63111","63112"], "Taman": ["63131","63132"], "Kartoharjo": ["63121","63122"] },
    "Mojokerto": { "Prajurit Kulon": ["61311","61312"], "Magersari": ["61321","61322"] },
    "Pasuruan": { "Gadingrejo": ["67111","67112"], "Purworejo": ["67121","67122"], "Bugul Kidul": ["67131","67132"] },
    "Probolinggo": { "Mayangan": ["67211","67212"], "Kanigaran": ["67221","67222"], "Wonoasih": ["67231","67232"] },
    "Batu": { "Batu": ["65311","65312"], "Junrejo": ["65321","65322"], "Bumiaji": ["65331","65332"] }
  },
  "Bali": {
    "Denpasar": { "Denpasar Barat": ["80111","80112"], "Denpasar Timur": ["80231","80232"], "Denpasar Selatan": ["80221","80222"], "Denpasar Utara": ["80115","80116"] },
    "Badung": { "Kuta": ["80361","80362"], "Kuta Selatan": ["80361","80362"], "Kuta Utara": ["80351","80352"], "Mengwi": ["80351","80352"] },
    "Gianyar": { "Gianyar": ["80511","80512"], "Ubud": ["80571","80572"], "Sukawati": ["80581","80582"] }
  },
  "Nusa Tenggara Barat": {
    "Mataram": { "Ampenan": ["83111","83112"], "Mataram": ["83121","83122"], "Cakranegara": ["83231","83232"], "Sandubaya": ["83231","83232"], "Sekarbela": ["83115","83116"], "Selaparang": ["83125","83126"] },
    "Bima": { "Rasanae Barat": ["84111","84112"], "Rasanae Timur": ["84121","84122"], "Raba": ["84131","84132"] }
  },
  "Nusa Tenggara Timur": {
    "Kupang": { "Alak": ["85111","85112"], "Maulafa": ["85147","85148"], "Oebobo": ["85111","85112"], "Kota Raja": ["85111","85112"], "Kelapa Lima": ["85111","85112"] }
  },
  "Kalimantan Barat": {
    "Pontianak": { "Pontianak Kota": ["78111","78112"], "Pontianak Barat": ["78113","78114"], "Pontianak Selatan": ["78121","78122"], "Pontianak Timur": ["78231","78232"], "Pontianak Utara": ["78241","78242"], "Pontianak Tenggara": ["78115","78116"] },
    "Singkawang": { "Singkawang Tengah": ["79111","79112"], "Singkawang Barat": ["79121","79122"], "Singkawang Utara": ["79131","79132"] }
  },
  "Kalimantan Tengah": {
    "Palangka Raya": { "Pahandut": ["73111","73112"], "Jekan Raya": ["73112","73113"], "Bukit Batu": ["73117","73118"], "Sabangau": ["73116","73117"], "Rakumpit": ["73111","73112"] }
  },
  "Kalimantan Selatan": {
    "Banjarmasin": { "Banjarmasin Barat": ["70111","70112"], "Banjarmasin Timur": ["70231","70232"], "Banjarmasin Selatan": ["70241","70242"], "Banjarmasin Tengah": ["70111","70112"], "Banjarmasin Utara": ["70121","70122"] },
    "Banjarbaru": { "Landasan Ulin": ["70721","70722"], "Liang Anggang": ["70724","70725"], "Cempaka": ["70711","70712"], "Banjarbaru Utara": ["70711","70712"], "Banjarbaru Selatan": ["70714","70715"] }
  },
  "Kalimantan Timur": {
    "Samarinda": { "Samarinda Kota": ["75111","75112"], "Samarinda Ulu": ["75121","75122"], "Samarinda Ilir": ["75131","75132"], "Samarinda Seberang": ["75141","75142"], "Palaran": ["75151","75152"], "Loa Janan Ilir": ["75243","75244"], "Sungai Kunjang": ["75127","75128"], "Sambutan": ["75117","75118"] },
    "Balikpapan": { "Balikpapan Barat": ["76111","76112"], "Balikpapan Timur": ["76115","76116"], "Balikpapan Selatan": ["76114","76115"], "Balikpapan Utara": ["76125","76126"], "Balikpapan Tengah": ["76123","76124"], "Balikpapan Kota": ["76111","76112"] },
    "Bontang": { "Bontang Barat": ["75311","75312"], "Bontang Utara": ["75321","75322"], "Bontang Selatan": ["75331","75332"] }
  },
  "Kalimantan Utara": {
    "Tarakan": { "Tarakan Barat": ["77111","77112"], "Tarakan Timur": ["77121","77122"], "Tarakan Tengah": ["77131","77132"], "Tarakan Utara": ["77141","77142"] }
  },
  "Sulawesi Utara": {
    "Manado": { "Wenang": ["95111","95112"], "Sario": ["95111","95112"], "Wanea": ["95117","95118"], "Malalayang": ["95115","95116"], "Mapanget": ["95257","95258"], "Singkil": ["95121","95122"], "Tuminting": ["95131","95132"], "Bunaken": ["95141","95142"] },
    "Bitung": { "Maesa": ["95511","95512"], "Girian": ["95521","95522"], "Lembeh Utara": ["95531","95532"] },
    "Tomohon": { "Tomohon Utara": ["95361","95362"], "Tomohon Tengah": ["95362","95363"], "Tomohon Selatan": ["95365","95366"] }
  },
  "Sulawesi Tengah": {
    "Palu": { "Palu Barat": ["94111","94112"], "Palu Timur": ["94111","94112"], "Palu Selatan": ["94111","94112"], "Palu Utara": ["94111","94112"], "Tatanga": ["94111","94112"], "Ulujadi": ["94111","94112"], "Mantikulore": ["94111","94112"], "Tawaeli": ["94111","94112"] }
  },
  "Sulawesi Selatan": {
    "Makassar": { "Mariso": ["90111","90112"], "Mamajang": ["90131","90132"], "Tamalate": ["90221","90222"], "Rappocini": ["90222","90223"], "Makassar": ["90111","90112"], "Ujung Pandang": ["90111","90112"], "Wajo": ["90111","90112"], "Bontoala": ["90151","90152"], "Ujung Tanah": ["90141","90142"], "Tallo": ["90211","90212"], "Panakkukang": ["90231","90232"], "Manggala": ["90234","90235"], "Biringkanaya": ["90241","90242"], "Tamalanrea": ["90245","90246"] },
    "Parepare": { "Bacukiki": ["91111","91112"], "Ujung": ["91121","91122"], "Soreang": ["91131","91132"], "Bacukiki Barat": ["91115","91116"] },
    "Palopo": { "Wara": ["91911","91912"], "Wara Utara": ["91921","91922"], "Wara Selatan": ["91931","91932"], "Wara Timur": ["91941","91942"], "Mungkajang": ["91951","91952"], "Sendana": ["91961","91962"], "Bara": ["91971","91972"], "Telluwanua": ["91981","91982"], "Wara Barat": ["91991","91992"] }
  },
  "Sulawesi Tenggara": {
    "Kendari": { "Mandonga": ["93111","93112"], "Baruga": ["93116","93117"], "Puuwatu": ["93117","93118"], "Wua-Wua": ["93113","93114"], "Poasia": ["93231","93232"], "Abeli": ["93231","93232"], "Kambu": ["93231","93232"], "Kadia": ["93111","93112"], "Kendari Barat": ["93111","93112"], "Kendari": ["93111","93112"] },
    "Baubau": { "Wolio": ["93711","93712"], "Betoambari": ["93721","93722"], "Murhum": ["93731","93732"], "Batupoaro": ["93741","93742"] }
  },
  "Gorontalo": {
    "Gorontalo": { "Kota Barat": ["96111","96112"], "Dungingi": ["96128","96129"], "Kota Selatan": ["96115","96116"], "Kota Timur": ["96121","96122"], "Kota Tengah": ["96131","96132"], "Kota Utara": ["96135","96136"], "Hulonthalangi": ["96138","96139"], "Dumbo Raya": ["96141","96142"] }
  },
  "Sulawesi Barat": {
    "Mamuju": { "Mamuju": ["91511","91512"], "Simboro": ["91521","91522"], "Kalukku": ["91531","91532"], "Papalang": ["91541","91542"], "Tapalang": ["91551","91552"] }
  },
  "Maluku": {
    "Ambon": { "Nusaniwe": ["97111","97112"], "Sirimau": ["97128","97129"], "Teluk Ambon": ["97231","97232"], "Baguala": ["97234","97235"], "Leitimur Selatan": ["97111","97112"] }
  },
  "Maluku Utara": {
    "Ternate": { "Ternate Selatan": ["97711","97712"], "Ternate Tengah": ["97721","97722"], "Ternate Utara": ["97731","97732"], "Pulau Ternate": ["97741","97742"], "Moti": ["97751","97752"], "Pulau Batang Dua": ["97761","97762"], "Hiri": ["97771","97772"] }
  },
  "Papua": {
    "Jayapura": { "Abepura": ["99351","99352"], "Heram": ["99358","99359"], "Jayapura Selatan": ["99111","99112"], "Jayapura Utara": ["99111","99112"], "Muara Tami": ["99351","99352"] }
  },
  "Papua Barat": {
    "Manokwari": { "Manokwari Barat": ["98311","98312"], "Manokwari Timur": ["98321","98322"], "Manokwari Selatan": ["98331","98332"], "Manokwari Utara": ["98341","98342"] },
    "Sorong": { "Sorong": ["98411","98412"], "Sorong Barat": ["98421","98422"], "Sorong Timur": ["98431","98432"], "Sorong Utara": ["98441","98442"], "Sorong Manoi": ["98451","98452"], "Sorong Kepulauan": ["98461","98462"] }
  }
};
