// DATA USER
const sittaUserData = {
    users: [
        { 
            email: "mahasiswa@ut.ac.id", 
            password: "password123", 
            name: "Tuti Rahmawati", 
            role: "Mahasiswa",
            photo: "assets/user-avatar.png"
        }
    ]
};


// DATA DASHBOARD
const dashboardData = {
    currentUser: {},
    pesananTerbaru: [
        { 
            do: "DO2026-001",
            paket: 'PAKET-UT-001', 
            perusahaanEkspedisi: 'JNE', 
            ekspedisi: 'Reguler (3-5 hari)', 
            status: "Dikirim",
            tanggalKirim: '2026-01-27',
            color: "#198754" 
        },
        { 
            do: "DO2026-002", 
            paket: 'PAKET-UT-002',
            perusahaanEkspedisi: 'JNE',
            ekspedisi: 'Ekspres (1-2 hari)',
            status: "Proses", 
            tanggalKirim: '2026-01-28',
            color: "#ffc107" },
        { 
            do: "DO2026-003", 
            paket: 'PAKET-UT-001',
            perusahaanEkspedisi: 'JNE',
            ekspedisi: 'Reguler (3-5 hari)',
            tanggalKirim: '2026-01-29',
            status: "Menunggu", 
            tgl: "28 Januari 2026", 
            color: "#0dcaf0" 
        }
    ],
    pengumuman: [
        { judul: "Pengiriman Wilayah 3T", isi: "Mungkin mengalami keterlambatan.", tgl: "22 Januari 2026" },
        { judul: "Libur Nasional", isi: "Pengiriman tidak dilakukan pada 23 Januari 2026.", tgl: "23 Januari 2026" }
    ]
};