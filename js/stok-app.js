new Vue({
  el: '#app',
  data: {
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      }
    ],
    filters: {
      upbjj: '',
      kategori: '',
      butuhReorder: false
    },
    sortBy: 'judul',
    editingIndex: null,
    showModal: false,
    errorMessage: '',
    formInput: {
      kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0
    },
    currentPage: 1,
    itemsPerPage: 10,
  },
  computed: {
    // Semua filter di-set dalam computed property agar tidak memicu re-computation berulang yang tidak perlu
    filteredAndSortedStok() {
      let result = this.stok.filter(item => {
        let matchUpbjj = !this.filters.upbjj || item.upbjj === this.filters.upbjj;
        let matchKategori = !this.filters.kategori || item.kategori === this.filters.kategori;
        let matchReorder = !this.filters.butuhReorder || (item.qty < item.safety || item.qty === 0);
        return matchUpbjj && matchKategori && matchReorder;
      });

      return result.sort((a, b) => {
        if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
        return a[this.sortBy] - b[this.sortBy];
      });
    },
    totalPages() {
    return Math.ceil(this.filteredAndSortedStok.length / this.itemsPerPage);
    },
    paginatedStok() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredAndSortedStok.slice(start, end);
    },
    startItem() {
        return this.filteredAndSortedStok.length === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
        const end = this.currentPage * this.itemsPerPage;
        return end > this.filteredAndSortedStok.length ? this.filteredAndSortedStok.length : end;
    }
  },
  watch: {
    // Watcher 1: Dependent options - Mengosongkan filter kategori secara otomatis bila filter utama UPBJJ dicopot
    'filters.upbjj'(newVal) {
      if (!newVal) {
        this.filters.kategori = '';
      }
    },
    // Watcher 2: Memantau isi total array gudang stok utama
    stok: {
      deep: true,
      handler(updatedStok) {
        let criticalCount = updatedStok.filter(item => item.qty < item.safety).length;
        console.log(`[System Watcher] Deteksi perubahan data gudang. Kategori reorder kritis: ${criticalCount} item.`);
      }
    }
  },
  methods: {
    editStok(index) {
      this.editingIndex = index;
    },
    saveStok() {
      this.editingIndex = null;
    },
    resetFilter() {
      this.filters.upbjj = '';
      this.filters.kategori = '';
      this.filters.butuhReorder = false;
      this.sortBy = 'judul';
    },
    tambahBahanAjar() {
      // Validasi sederhana
      if (!this.formInput.kode || !this.formInput.judul || !this.formInput.kategori || !this.formInput.upbjj) {
        this.errorMessage = "Peringatan: Mohon lengkapi seluruh kolom isian teks dan pilihan!";
        return;
      }
      if (this.formInput.harga <= 0 || this.formInput.qty < 0 || this.formInput.safety <= 0) {
        this.errorMessage = "Peringatan: Angka nominal Stok, Harga, dan Safety tidak boleh negatif/kosong!";
        return;
      }

      this.stok.push({
        kode: this.formInput.kode.toUpperCase(),
        judul: this.formInput.judul,
        kategori: this.formInput.kategori,
        upbjj: this.formInput.upbjj,
        lokasiRak: this.formInput.lokasiRak || "Unassigned",
        harga: this.formInput.harga,
        qty: this.formInput.qty,
        safety: this.formInput.safety,
        catatanHTML: "<span>Buku baru ditambahkan lewat form web</span>"
      });

      // Reset form penampung dan tutup modal box
      this.formInput = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', harga: 0, qty: 0, safety: 0 };
      this.errorMessage = '';
      this.showModal = false;
    },
    getOriginalIndex(index) {
      return (this.currentPage - 1) * this.itemsPerPage + index;
    }
  }
});