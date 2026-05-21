// PROTEKSI HALAMAN
(function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    // Jika belum login dan sedang TIDAK di halaman login, tendang ke index.html
    if (!isLoggedIn && !isLoginPage) {
        alert('Anda harus login terlebih dahulu!');
        window.location.replace('index.html');
    }
})();

// 2. TEMPLATE KOMPONEN (Sidebar, Topbar, dll)
const components = {
    // Template Sidebar
    sidebar: `
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="assets/logo-putih.png" alt="Logo UT" width="50">
                <div>
                    <h2>SITTA</h2>
                    <p>Sistem Informasi Terintegrasi<br>Bahan Ajar</p>
                </div>
            </div>

            <nav class="sidebar-nav">
                <a href="dashboard.html" class="nav-item active"><i class="fa-solid fa-house"></i> Dashboard</a>
                <a href="stok.html" class="nav-item"><i class="fa-solid fa-book"></i> Informasi Bahan Ajar</a>
                <a href="track.html" class="nav-item"><i class="fa-solid fa-truck-fast"></i> Tracking Pengiriman</a>
                
                <div class="nav-group" id="laporanGroup">
                    <div class="group-title">
                      <span><i class="fa-solid fa-chart-pie"></i> Laporan</span> 
                      <i class="fa-solid fa-chevron-up"></i>
                    </div>
                    <a href="#" class="nav-sub-item">Monitoring Progress DO</a>
                    <a href="#" class="nav-sub-item">Rekap Bahan Ajar</a>
                </div>

                <a href="#" class="nav-item"><i class="fa-solid fa-history"></i> Histori Transaksi</a>
            </nav>

            <div class="sidebar-footer">
                <a href="index.html" class="btn-logout"><i class="fa-solid fa-right-from-bracket"></i> Keluar</a>
            </div>
        </aside>
    `,

    // Template Topbar
    topbar: `
        <header class="top-bar">
            <div class="nav-left">
                <button id="toggleMenu"><i class="fa-solid fa-bars"></i></button>
                <div class="page-title">Dashboard</div>
            </div>
                
            <div class="user-profile">
                <div class="notif-bell">
                    <i class="fa-regular fa-bell"></i>
                    <span class="badge">3</span>
                </div>
                <span style="font-size: 0.7rem; color: var(--text-light);">|</span>
                <div class="user-info">
                    <span class="name"></span>
                    <span class="role"></span>
                </div>
                <img src="" alt="Avatar" class="avatar">
                <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; var(--text-light);"></i>
            </div>
         </header>
    `,

    // Template Footer
    footer: `
        <footer class="footer-credit">
            &copy; 2026 Universitas Terbuka • SITTA
        </footer>
    `,
};


// 3. FUNGSI INJECT
function injectComponents() {
    const sidebarContainer = document.getElementById('sidebar-container');
    const topbarContainer = document.getElementById('topbar-container');
    const footerContainer = document.getElementById('footer-container');

    // 3.1 INJECT TEMPLATE KE CONTAINER
    if (sidebarContainer) sidebarContainer.innerHTML = components.sidebar;
    if (topbarContainer) topbarContainer.innerHTML = components.topbar;
    if (footerContainer) footerContainer.innerHTML = components.footer;

    // 3.2 LOGIKA LOGOUT
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah pindah halaman sebelum data dihapus
            
            // Hapus session dari localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userActive');
            
            alert('Anda telah keluar dari sistem.');
            window.location.href = 'index.html';
        });
    }

    // 3.3 LOGIKA MENU NAVIGASI AKTIF
    const currentPage = window.location.pathname.split("/").pop() || 'dashboard.html';
    const navLinks = document.querySelectorAll('.nav-item');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // 3.4 RENDER DATA USER DARI LOCALSTORAGE (DINAMIS)
    // Mengambil data user yang disimpan saat login di script.js
    const savedUser = localStorage.getItem('userActive');
    
    if (savedUser) {
        const userData = JSON.parse(savedUser);

        // Isi Nama
        document.querySelectorAll('.user-info .name').forEach(el => {
            el.innerText = userData.name;
        });

        // Isi Role (Default Mahasiswa jika tidak ada di data)
        document.querySelectorAll('.user-info .role').forEach(el => {
            el.innerText = userData.role || "Mahasiswa";
        });

        // Isi Foto/Avatar di components.js
        document.querySelectorAll('.user-profile .avatar').forEach(img => {
            const userData = JSON.parse(localStorage.getItem('userActive'));
            const photoPath = (userData && userData.photo) ? userData.photo : "assets/avatar.png";

            img.src = photoPath;
            img.alt = userData ? userData.name : "User";

            // --- PENGAMAN UTAMA ---
            // Jika file photoPath di atas tidak ditemukan/error, ganti ke avatar.png
            img.onerror = function() {
                this.src = "assets/avatar.png";
                this.onerror = null; // Menghindari looping jika avatar.png juga tidak ada
            };
        });
        
    } else if (typeof dashboardData !== 'undefined') {
        // Fallback ke data.js jika localStorage kosong (untuk testing)
        document.querySelectorAll('.user-info .name').forEach(el => {
            el.innerText = dashboardData.currentUser.name;
        });
        document.querySelectorAll('.user-info .role').forEach(el => {
            el.innerText = dashboardData.currentUser.role;
        });
        document.querySelectorAll('.user-profile .avatar').forEach(img => {
            img.src = dashboardData.currentUser.photo;
        });
    }
}

// Jalankan fungsi saat DOM siap
document.addEventListener('DOMContentLoaded', injectComponents);