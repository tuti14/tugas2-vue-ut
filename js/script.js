// SCRIPT LUPA PASSWORD
document.addEventListener('DOMContentLoaded', () => {
    const lupaPasswordForm = document.getElementById('lupaPasswordForm');
    const emailLP = document.getElementById('emailLP');

    // Logika Validasi
    if (lupaPasswordForm) {
        lupaPasswordForm.addEventListener('submit', function(e) {
            // Cek apakah input kosong (pengganti empty)
            if (!emailLP.value.trim()) {
                e.preventDefault();
                alert('Silakan masukkan alamat email Anda.');
                return;
            }

            // Validasi format email (Regex sederhana)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailLP.value)) {
                e.preventDefault();
                alert('Format email tidak valid!');
            } else {
                e.preventDefault(); // Menahan reload untuk simulasi
                alert('Instruksi pemulihan telah dikirim ke: ' + emailLP.value);
                // logika pengiriman ke server
            }
        });
    }
});

// SCRIPT DAFTAR AKUN
document.addEventListener('DOMContentLoaded', () => {
    const daftarAkunForm = document.getElementById('daftarAkunForm');
    const togglePasswordDA = document.getElementById('togglePasswordDA');
    const toggleCPasswordDA = document.getElementById('toggleCPasswordDA');
    const passwordInputDA = document.getElementById('passwordDA');
    const cPasswordInputDA = document.getElementById('cpasswordDA');

    // 1. Logika Toggle Show/Hide Password Utama
    if (togglePasswordDA && passwordInputDA) {
        togglePasswordDA.addEventListener('click', function() {
            // Cek tipe saat ini
            const type = passwordInputDA.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInputDA.setAttribute('type', type);
            
            // Toggle icon Class (Ganti eye-slash ke eye)
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // 2. Logika Toggle Show/Hide Konfirmasi Password
    if (toggleCPasswordDA && cPasswordInputDA) {
        toggleCPasswordDA.addEventListener('click', function() {
            // Cek tipe saat ini
            const type = cPasswordInputDA.getAttribute('type') === 'password' ? 'text' : 'password';
            cPasswordInputDA.setAttribute('type', type);
            
            // Toggle icon Class
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // 3. Logika Validasi Kecocokan Password saat Submit
    if (daftarAkunForm) {
        daftarAkunForm.addEventListener('submit', function(e) {
            if (passwordInputDA.value !== cPasswordInputDA.value) {
                e.preventDefault(); // Batalkan pengiriman form
                alert('Kata sandi dan konfirmasi kata sandi tidak cocok!');
            } else {
                alert('Pendaftaran berhasil (simulasi)!');
                // proses pendaftaran...
            }
        });
    }
});


// SCRIPT LOGIN
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const btnLogin = document.querySelector('.btn-login');

    // 1. Logika Toggle Show/Hide Password
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon Class
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // 2. Logika Validasi Login & Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        // Visual: Ubah tombol menjadi status loading
        const originalBtnText = btnLogin.innerHTML;
        btnLogin.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses...';
        btnLogin.style.opacity = '0.7';
        btnLogin.style.pointerEvents = 'none';

        // Simulasi delay jaringan (1 detik) sebelum memeriksa data
        setTimeout(() => {
            // Mencari user di data.js
            const user = sittaUserData.users.find(u => u.email === email && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');

                // Simpan apa adanya dari data.js, jika kosong baru kasih default string
                const sessionData = {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    photo: (user.photo && user.photo !== "") ? user.photo : "assets/avatar.png"
                };

                localStorage.setItem('userActive', JSON.stringify(sessionData));

                alert(`Selamat Datang, ${user.name}!`);
                window.location.href = 'dashboard.html';
                
            } else {
                // KONDISI GAGAL
                alert('Email atau Password salah! Silakan coba lagi.');
                
                // Kembalikan status tombol
                btnLogin.innerHTML = originalBtnText;
                btnLogin.style.opacity = '1';
                btnLogin.style.pointerEvents = 'auto';
                
                // Reset input password
                passwordInput.value = '';
                passwordInput.focus();
            }
        }, 1000);
    });
});


// SCRIPT DASHBOARD
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleMenu');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
            const overlay = document.getElementById('sidebarOverlay');

    // --- RESPONSIVE SIDEBAR LOGIC ---
    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        } else {
            sidebar.classList.toggle('hide');
            mainContent.classList.toggle('full');
        }
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
                overlay.classList.remove('show');
    });

    // --- DROPDOWN LAPORAN ---
    const laporanGroup = document.getElementById('laporanGroup');
        laporanGroup.querySelector('.group-title').addEventListener('click', () => {
        laporanGroup.classList.toggle('active');
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // --- DYNAMIC DATA RENDER ---
    function renderDashboard() {
        // 1. Logika Ucapan Berdasarkan Waktu (Greeting)
        const now = new Date();
        const hour = now.getHours();
        let greeting = "Selamat Malam"; // Default

        if (hour >= 5 && hour < 11) {
            greeting = "Selamat Pagi";
        } else if (hour >= 11 && hour < 15) {
            greeting = "Selamat Siang";
        } else if (hour >= 15 && hour < 18) {
            greeting = "Selamat Sore";
        }

        // Render Informasi User
        const savedUser = localStorage.getItem('userActive');
        let currentUser = dashboardData.currentUser; // Default fallback ke data.js

        if (savedUser) {
            currentUser = JSON.parse(savedUser); // Gunakan data user yang baru saja login
        }

        // Render Informasi User
        const userNameElements = document.querySelectorAll('.user-info .name, .welcome-banner h1');
        const userRoleElement = document.querySelector('.user-info .role');
        const userPhotoElement = document.querySelector('.user-profile .avatar');

        if (currentUser) {
            // Update Nama di Topbar (elemen pertama)
            if(userNameElements[0]) userNameElements[0].innerText = currentUser.name;
            
            // Update Ucapan Dinamis di Banner Welcome (elemen kedua)
            if(userNameElements[1]) {
                userNameElements[1].innerText = `${greeting}, ${currentUser.name}! 👋`;
            }
            
            // Update Role dan Photo
            if(userRoleElement) {
                // Jika role tidak ada di data login, asumsikan berdasarkan email atau default
                userRoleElement.innerText = currentUser.email === "admin@ut.ac.id" ? "Administrator" : "Mahasiswa";
            }
            if(userPhotoElement) userPhotoElement.src = currentUser.photo || "assets/avatar.png";
        }

        // 2. Render Pesanan Terbaru
        const orderList = document.getElementById('orderList');
        if (orderList && dashboardData.pesananTerbaru) {
            orderList.innerHTML = ''; 
            dashboardData.pesananTerbaru.forEach(item => {
                orderList.innerHTML += `
                    <div class="order-item">
                        <div class="order-right">
                            <div class="order-icon"><i class="fa-solid fa-box"></i></div>
                            <div class="order-info">
                                <strong>${item.do}</strong>
                                <p>${item.perusahaanEkspedisi} - ${item.ekspedisi} | ${item.paket}</p>
                                <p><small>${item.tanggalKirim}</small></p>
                            </div>
                        </div>
                        <span class="status-badge" style="background: ${item.color}15; color: ${item.color}">${item.status}</span>
                    </div>
                `;
            });
        }

        // 3. Render Pengumuman
        const annList = document.getElementById('announcementList');
        if (annList && dashboardData.pengumuman) {
            annList.innerHTML = ''; 
            dashboardData.pengumuman.forEach(info => {
                annList.innerHTML += `
                    <div class="announce-item" style="align-items: flex-start; margin-bottom: 15px;">
                        <i class="fa-solid fa-circle-info" style="color: var(--accent-yellow); margin-top: 5px;"></i>
                        <div class="announce-info">
                            <strong style="font-size: 0.85rem; display: block;">${info.judul}</strong>
                            <p style="font-size: 0.75rem; color: var(--text-body); line-height: 1.4;">${info.isi}</p>
                            <small style="font-size: 0.65rem; color: var(--text-body-secondary);">${info.tgl}</small>
                        </div>
                    </div>
                `;
            });
        }
    }

    renderDashboard();

    // --- REALTIME CLOCK ---
    function updateClock() {
        const now = new Date();
        const options = {
            timeZone: 'Asia/Jakarta',
            hour: '2-digit', minute: '2-digit',
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        };
        const formatter = new Intl.DateTimeFormat('id-ID', options);
        const clockElement = document.getElementById('current-time');
        if(clockElement) {
            clockElement.innerText = formatter.format(now) + " WIB";
        }
    }
    
    setInterval(updateClock, 1000);
    updateClock();
});