new Vue({
    el: '#app',

    data: {
        pengirimanList: [
            { kode: 'REG', nama: 'Reguler (3-5 hari)' },
            { kode: 'EXP', nama: 'Ekspres (1-2 hari)' }
        ],

        paket: [
            {
                kode: 'PAKET-UT-001',
                nama: 'PAKET IPS Dasar',
                isi: ['EKMA4116', 'EKMA4115'],
                harga: 120000
            },
            {
                kode: 'PAKET-UT-002',
                nama: 'PAKET IPA Dasar',
                isi: ['BIOL4201', 'FISIP4001'],
                harga: 140000
            }
        ],

        tracking: {
            'DO2026-001': {
                nim: '048881613',
                nama: 'Tuti Rahmawati',
                status: 'Dikirim',
                perusahaanEkspedisi: 'JNE',
                ekspedisi: 'Reguler (3-5 hari)',
                tanggalKirim: '2026-01-27',
                paket: 'PAKET-UT-001',
                total: 120000,
                color: '#198754',
                status_step: 3,
                perjalanan: [
                    {
                        waktu: '2026-05-20 10:12:20',
                        keterangan: 'Penerimaan di Loket: TANGSEL'
                    },
                    {
                        waktu: '2026-05-20 14:07:56',
                        keterangan: 'Tiba di Hub: JAKSEL'
                    },
                    {
                        waktu: '2026-05-21 08:44:01',
                        keterangan: 'Diteruskan ke Kantor Tujuan'
                    }
                ]
            },

            'DO2026-002': {
                nim: '048881613',
                nama: 'Tuti Rahmawati',
                status: 'Proses',
                perusahaanEkspedisi: 'JNE',
                ekspedisi: 'Ekspres (1-2 hari)',
                tanggalKirim: '2026-01-28',
                paket: 'PAKET-UT-002',
                total: 140000,
                color: '#ffc107',
                status_step: 2,
                perjalanan: [
                    {
                        waktu: '2026-05-20 10:12:20',
                        keterangan: 'Penerimaan di Loket: TANGSEL'
                    }
                ]
            },

            'DO2026-003': {
                nim: '048881613',
                nama: 'Tuti Rahmawati',
                status: 'Menunggu',
                perusahaanEkspedisi: 'JNE',
                ekspedisi: 'Reguler (3-5 hari)',
                tanggalKirim: '2026-01-29',
                paket: 'PAKET-UT-001',
                total: 120000,
                color: '#0dcaf0',
                status_step: 1,
                perjalanan: [
                    {
                        waktu: '2026-05-20 09:30:00',
                        keterangan: 'Order berhasil dibuat. Menunggu kurir pick-up.'
                    }
                ]
            }
        },

        sequenceCounter: 4,
        errTrack: '',
        inputSearchDO: '',
        orderSuksesDO: null,
        activeTrackingResult: null,

        formDO: {
            nim: '',
            nama: '',
            ekspedisi: '',
            selectedPaket: ''
        }
    },

    computed: {
        autoDoNumber() {
            const year = new Date().getFullYear();
            const sequence = String(this.sequenceCounter).padStart(3, '0');

            return `DO${year}-${sequence}`;
        },

        paketDetail() {
            return this.paket.find(
                item => item.kode === this.formDO.selectedPaket
            ) || null;
        }
    },

    watch: {
        'formDO.nim'(value) {
            this.formDO.nim = value.replace(/\D/g, '');
        },

        tracking: {
            deep: true,
            handler(data) {
                console.log(
                    '[Tracking System] Manifest berhasil diperbarui.',
                    data
                );
            }
        }
    },

    methods: {
        /**
         * Format tanggal hari ini
         */
        getCurrentDateTime() {
            const now = new Date();

            return {
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().split(' ')[0]
            };
        },

        /**
         * Reset form input
         */
        resetForm() {
            this.formDO = {
                nim: '',
                nama: '',
                ekspedisi: '',
                selectedPaket: ''
            };
        },

        /**
         * Validasi form
         */
        validateForm() {
            const {
                nim,
                nama,
                ekspedisi,
                selectedPaket
            } = this.formDO;

            if (!nim || !nama || !ekspedisi || !selectedPaket) {
                this.errTrack =
                    'Kesalahan: Mohon lengkapi data NIM, nama mahasiswa, ekspedisi, dan paket bahan ajar.';
                return false;
            }

            if (nim.length < 9) {
                this.errTrack =
                    'Kesalahan: Format NIM Universitas Terbuka minimal harus terdiri dari 9 digit angka.';
                return false;
            }

            this.errTrack = '';
            return true;
        },

        /**
         * Generate Delivery Order
         */
        generateDO() {
            if (!this.validateForm()) return;

            const { date, time } = this.getCurrentDateTime();
            const doNumber = this.autoDoNumber;

            const trackingData = {
                nim: this.formDO.nim,
                nama: this.formDO.nama,
                status: 'Menunggu',
                perusahaanEkspedisi: 'JNE',
                ekspedisi: this.formDO.ekspedisi,
                tanggalKirim: date,
                paket: this.formDO.selectedPaket,
                total: this.paketDetail.harga,
                color: '#0dcaf0',
                status_step: 1,
                perjalanan: [
                    {
                        waktu: `${date} ${time}`,
                        keterangan:
                            'Manifest Surat Jalan Delivery Order berhasil dibuat di Loket SITTA Utama.'
                    }
                ]
            };

            this.$set(this.tracking, doNumber, trackingData);

            this.orderSuksesDO = doNumber;
            this.activeTrackingResult = null;

            this.sequenceCounter++;
            this.resetForm();
        },

        /**
         * Tracking Delivery Order
         */
        handleVueTracking() {
            const searchKey =
                this.inputSearchDO.trim().toUpperCase();

            if (!searchKey) {
                alert(
                    'Silakan masukkan nomor Delivery Order terlebih dahulu!'
                );
                return;
            }

            const result = this.tracking[searchKey];

            if (!result) {
                alert(
                    'Nomor Delivery Order tidak ditemukan!'
                );

                this.activeTrackingResult = null;
                return;
            }

            this.activeTrackingResult = {
                no_do: searchKey,
                ...result
            };

            this.orderSuksesDO = null;
        }
    }
});