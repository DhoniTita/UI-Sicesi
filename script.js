let students = JSON.parse(localStorage.getItem('students')) || {};
        let currentNIS = null;
        let currentGuruNIK = null;
        let currentGuruKelas = null;

        // NIK -> kelas yang diajar (semua subkelas)
        const guruData = {
            '123456': ['10 DKV 1', '10 DKV 2', '10 DKV 3'],
            '789012': ['10 BR 1', '10 BR 2', '10 BR 3'],
            '345678': ['10 LP 1', '10 LP 2', '10 LP 3'],
            '901234': ['10 AKL 1', '10 AKL 2', '10 AKL 3'],
            '567890': ['10 MPLB 1', '10 MPLB 2', '10 MPLB 3'],
            '112233': ['10 ULW 1', '10 ULW 2', '10 ULW 3']
        };
        function showError(inputId, errorId, message) {
            document.getElementById(inputId).classList.add('error');
            const errorElement = document.getElementById(errorId);
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        function clearError(inputId, errorId) {
            document.getElementById(inputId).classList.remove('error');
            document.getElementById(errorId).style.display = 'none';
        }
        function validateNumber(input) {
            return /^\d+$/.test(input);
        }
        function selectRole(role) {
            const siswaBtn = document.querySelector('.role-btn[onclick="selectRole(\'siswa\')"]');
            const guruBtn = document.querySelector('.role-btn[onclick="selectRole(\'guru\')"]');
            if (role === 'siswa') {
                siswaBtn.classList.add('active');
                guruBtn.classList.remove('active');
                document.getElementById('siswaLoginForm').style.display = 'block';
                document.getElementById('guruLoginForm').style.display = 'none';
                hideAllForms();
            } else {
                siswaBtn.classList.remove('active');
                guruBtn.classList.add('active');
                document.getElementById('siswaLoginForm').style.display = 'none';
                document.getElementById('guruLoginForm').style.display = 'block';
                hideAllForms();
            }
        }
        function hideAllForms() {
            document.getElementById('studentForm').style.display = 'none';
            document.getElementById('dataDisplay').style.display = 'none';
            document.getElementById('guruDashboard').style.display = 'none';
        }
        function handleSiswaLogin() {
            const nis = document.getElementById('nisLogin').value.trim();
            const nisn = document.getElementById('nisnLogin').value.trim();
            let isValid = true;
            clearError('nisLogin', 'nisLoginError');
            clearError('nisnLogin', 'nisnLoginError');
            if (!nis || !validateNumber(nis) || nis.length !== 9) {
                showError('nisLogin', 'nisLoginError', 'NIS harus diisi dan berupa tepat 9 angka');
                isValid = false;
            }
            if (!nisn || !validateNumber(nisn) || nisn.length !== 10) {
                showError('nisnLogin', 'nisnLoginError', 'NISN harus diisi dan berupa tepat 10 angka');
                isValid = false;
            }
            if (isValid) {
                if (!students[nis]) {
                    students[nis] = { nisn: nisn, nama: null, kelas: null };
                    localStorage.setItem('students', JSON.stringify(students));
                }
                if (students[nis] && students[nis].nisn === nisn) {
                    currentNIS = nis;
                    // (LANJUT KE DHONI)
                    document.getElementById('siswaLoginForm').style.display = 'none';
                    if (students[nis].nama && students[nis].kelas) {
                        displayStudentData();
                        document.getElementById('phone').style.display = 'block';
                    } 
                    else {
                        document.getElementById('phone').style.display = 'block';
                        document.getElementById('login').style.display = 'none';
                    }
                } else {
                    showError('nisnLogin', 'nisnLoginError', 'NISN tidak cocok dengan NIS');
                }
            }
        }
        function handleSiswaLogout() {
            currentNIS = null;
            document.getElementById('studentForm').style.display = 'none';
            document.getElementById('dataDisplay').style.display = 'none';
            document.getElementById('siswaLoginForm').style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
        }
        function handleEdit() {
            document.getElementById('dataDisplay').style.display = 'none';
            document.getElementById('studentForm').style.display = 'block';
        }
        function handleSubmit() {
            const nama = document.getElementById('nama').value.trim();
            const kelas = document.getElementById('kelas').value.trim();
            let isValid = true;
            clearError('nama', 'namaError');
            clearError('kelas', 'kelasError');
            if (!nama) {
                showError('nama', 'namaError', 'Nama harus diisi');
                isValid = false;
            }
            if (!kelas) {
                showError('kelas', 'kelasError', 'Kelas harus dipilih');
                isValid = false;
            }
            if (isValid && currentNIS) {
                students[currentNIS].nama = nama;
                students[currentNIS].kelas = kelas;
                localStorage.setItem('students', JSON.stringify(students));
                displayStudentData();
                document.getElementById('studentForm').style.display = 'none';
                document.getElementById('dataDisplay').style.display = 'block';
            }
        }
        function displayStudentData() {
            if (currentNIS && students[currentNIS]) {
                document.getElementById('displayNama').textContent = students[currentNIS].nama || '-';
                document.getElementById('displayKelas').textContent = students[currentNIS].kelas || '-';
                document.getElementById('displayNIS').textContent = currentNIS;
                document.getElementById('displayNISN').textContent = students[currentNIS].nisn || '-';
            }
        }
        function handleGuruLogin() {
            const nik = ""; // Add logic to get NIK value, e.g., from an input field
            // Add your login logic here
        }

        // DHONI
    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click',()=>{
      hamburger.classList.toggle('open');
    });

    const nowEl = document.getElementById('now-time');
    const absenBtn = document.getElementById('absen-btn');
    const infoMsg = document.getElementById('info-msg');

    const dotDatang = document.getElementById('dot-datang');
    const dotPulang = document.getElementById('dot-pulang');
    const labelDatang = document.getElementById('label-datang');
    const labelPulang = document.getElementById('label-pulang');
    const timeDatang = document.getElementById('time-datang');
    const timePulang = document.getElementById('time-pulang');

    // persistent storage keys
    const KEY_DATANG = 'absen_datang_time';
    const KEY_PULANG = 'absen_pulang_time';

    // allowed windows
    // BATAS WAKTU YEY
    const datangCutoff = {hour:6, minute:30}; // before or equal allowed
    const pulangCutoff = {hour:15, minute:0}; // after or equal allowed

    function pad(n){return n.toString().padStart(2,'0')}
    function now(){return new Date();}

    function formatTime(d){return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`}
    function formatTimeShort(d){return `${pad(d.getHours())}:${pad(d.getMinutes())}`}

    function loadStatus(){
      const d = localStorage.getItem(KEY_DATANG);
      const p = localStorage.getItem(KEY_PULANG);
      if(d){
        dotDatang.classList.add('present');
        labelDatang.textContent = 'Sudah';
        timeDatang.textContent = d;
      } else {dotDatang.classList.remove('present');labelDatang.textContent='Belum';timeDatang.textContent='-'}
      if(p){dotPulang.classList.add('present');labelPulang.textContent='Sudah';timePulang.textContent=p}else{dotPulang.classList.remove('present');labelPulang.textContent='Belum';timePulang.textContent='-'}
    }

    function allowedToAbsen(curr){
      // returns {allowed:boolean, type: 'datang'|'pulang'|'none', reason}
      const h = curr.getHours(), m = curr.getMinutes();
      const isBeforeDatangCutoff = (h < datangCutoff.hour) || (h === datangCutoff.hour && m <= datangCutoff.minute);
      const isAfterPulangCutoff = (h > pulangCutoff.hour) || (h === pulangCutoff.hour && m >= pulangCutoff.minute);
      if(isBeforeDatangCutoff) return {allowed:true,type:'datang'};
      if(isAfterPulangCutoff) return {allowed:true,type:'pulang'};
      return {allowed:false,type:'none',reason:`Waktu absen belum sesuai. Datang hanya sampai ${pad(datangCutoff.hour)}:${pad(datangCutoff.minute)} dan pulang mulai ${pad(pulangCutoff.hour)}:${pad(pulangCutoff.minute)}.`}
    }

    function updateNow(){
      const d = now();
      nowEl.textContent = formatTime(d);
      // update button availability
      const a = allowedToAbsen(d);
      if(a.allowed){
        absenBtn.disabled = false;
        absenBtn.textContent = 'Absen Sekarang';
        infoMsg.textContent = (a.type==='datang')?`Bisa absen datang sampai ${pad(datangCutoff.hour)}:${pad(datangCutoff.minute)}.`:`Bisa absen pulang mulai ${pad(pulangCutoff.hour)}:${pad(pulangCutoff.minute)}.`;
      } else {
        absenBtn.disabled = true;
        absenBtn.textContent = 'Absen (tidak tersedia)';
        infoMsg.textContent = a.reason;
      }
    }

    absenBtn.addEventListener('click',async()=>{
      const d = now();
      const a = allowedToAbsen(d);
      if(!a.allowed){
        alert(a.reason);
        return;
      }
      if(a.type==='datang'){
        if(localStorage.getItem(KEY_DATANG)){
          alert('Anda sudah absen datang.');
          return;
        }
        localStorage.setItem(KEY_DATANG, formatTimeShort(d));
        loadStatus();
        alert('Absen datang berhasil: '+formatTimeShort(d));
      } else if(a.type==='pulang'){
        if(localStorage.getItem(KEY_PULANG)){
          alert('Anda sudah absen pulang.');
          return;
        }
        localStorage.setItem(KEY_PULANG, formatTimeShort(d));
        loadStatus();
        alert('Absen pulang berhasil: '+formatTimeShort(d));
      }
      updateNow();
    });

    // init
    loadStatus();
    updateNow();
    setInterval(updateNow,1000);

    // GEO
    const latEl = document.getElementById('lat');
    const lonEl = document.getElementById('lon');
    const mapFrame = document.getElementById('map-frame');
    const locToggle = document.getElementById('loc-toggle');
    let watchId = null;

    function setMap(lat,lon){
      latEl.textContent = lat.toFixed(6);
      lonEl.textContent = lon.toFixed(6);
      // openstreetmap viewer link centered at coords
      const src = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;
      mapFrame.src = src;
    }

    locToggle.addEventListener('click',()=>{
      if(watchId==null){
        if('geolocation' in navigator){
          watchId = navigator.geolocation.watchPosition((pos)=>{
            const {latitude:lat,longitude:lon} = pos.coords;
            setMap(lat,lon);
          },(err)=>{
            alert('Gagal mendapatkan lokasi: '+err.message);
          },{enableHighAccuracy:true,maximumAge:5000,timeout:7000});
          locToggle.textContent='Nonaktifkan';
        } else alert('Geolocation tidak didukung di peramban Anda');
      } else {
        navigator.geolocation.clearWatch(watchId);
        watchId=null;locToggle.textContent='Aktifkan';
        latEl.textContent='-';lonEl.textContent='-';mapFrame.src='about:blank';
      }
    });

    // start with attempting to show saved last known coords if available
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((p)=>{setMap(p.coords.latitude,p.coords.longitude)},()=>{});
    }

    function beranda(){
        document.querySelector('.onpage').classList.remove('onpage');
        document.querySelector('.beranda').classList.add('onpage');
    }
    function izin(){
        document.querySelector('.onpage').classList.remove('onpage');
        document.querySelector('.izin').classList.add('onpage');
    }
    function statistik(){
        document.querySelector('.onpage').classList.remove('onpage');
        document.querySelector('.statistik').classList.add('onpage');
    }