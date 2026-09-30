/* =====================================================
   MY FINANCE
   KATEGORI.JS
   ===================================================== */

let modalKategori;


/* =====================================================
   SAAT HALAMAN DIBUKA
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    financeData = loadData();

    // Pastikan struktur kategori tersedia
    if (!financeData.kategori) {
        financeData.kategori = {
            pemasukan: [
                "Gaji",
                "Bonus",
                "Penjualan",
                "Uang Jajan"
            ],
            pengeluaran: [
                "Makanan",
                "Transportasi",
                "Belanja",
                "Tagihan",
                "Hiburan",
                "Kesehatan",
                "Pendidikan",
                "Lainnya"
            ]
        };
    }

    if (!Array.isArray(financeData.kategori.pemasukan)) {
        financeData.kategori.pemasukan = [];
    }

    if (!Array.isArray(financeData.kategori.pengeluaran)) {
        financeData.kategori.pengeluaran = [];
    }

    commitData();

    // Inisialisasi modal Bootstrap
    const modalElement = document.getElementById("modalKategori");

    if (modalElement) {
        modalKategori = new bootstrap.Modal(modalElement);
    }

    tampilkanKategori();

    // Form submit
    const form = document.getElementById("formKategori");

    if (form) {
        form.addEventListener("submit", simpanKategori);
    }

});


/* =====================================================
   TAMPILKAN SEMUA KATEGORI
   ===================================================== */

function tampilkanKategori() {

    tampilkanDaftarKategori(
        "pemasukan",
        "daftarKategoriPemasukan",
        "jumlahKategoriPemasukan"
    );

    tampilkanDaftarKategori(
        "pengeluaran",
        "daftarKategoriPengeluaran",
        "jumlahKategoriPengeluaran"
    );

}


/* =====================================================
   TAMPILKAN DAFTAR KATEGORI
   ===================================================== */

function tampilkanDaftarKategori(
    jenis,
    containerId,
    countId
) {

    const container = document.getElementById(containerId);
    const countElement = document.getElementById(countId);

    if (!container) return;

    const daftar = financeData.kategori[jenis] || [];

    // Jumlah kategori
    if (countElement) {

        countElement.textContent =
            `${daftar.length} kategori`;

    }


    // Jika kosong
    if (daftar.length === 0) {

        container.innerHTML = `
            <div class="category-empty">

                <i class="bi bi-tags"></i>

                <p>
                    Belum ada kategori
                </p>

            </div>
        `;

        return;
    }


    let html = "";


    daftar.forEach(function (nama) {

        html += `
            <div class="category-item">

                <div class="category-name">

                    <i class="bi bi-tag-fill"></i>

                    <span>
                        ${escapeHTML(nama)}
                    </span>

                </div>


                <div class="category-actions">

                    <button
                        type="button"
                        class="category-btn edit"
                        title="Edit kategori"
                        onclick='editKategori(${JSON.stringify(jenis)}, ${JSON.stringify(nama)})'
                    >
                        <i class="bi bi-pencil-fill"></i>
                    </button>


                    <button
                        type="button"
                        class="category-btn delete"
                        title="Hapus kategori"
                        onclick='hapusKategori(${JSON.stringify(jenis)}, ${JSON.stringify(nama)})'
                    >
                        <i class="bi bi-trash-fill"></i>
                    </button>

                </div>

            </div>
        `;

    });


    container.innerHTML = html;

}


/* =====================================================
   BUKA FORM TAMBAH
   ===================================================== */

function bukaFormKategori() {

    const form = document.getElementById("formKategori");

    if (form) {
        form.reset();
    }

    document.getElementById("modalKategoriTitle").textContent =
        "Tambah Kategori";

    document.getElementById("kategoriLama").value = "";

    document.getElementById("jenisKategori").value =
        "pemasukan";

    document.getElementById("namaKategori").value = "";

    if (modalKategori) {
        modalKategori.show();
    }

}


/* =====================================================
   EDIT KATEGORI
   ===================================================== */

function editKategori(jenis, namaLama) {

    document.getElementById("modalKategoriTitle").textContent =
        "Edit Kategori";

    document.getElementById("kategoriLama").value =
        namaLama;

    document.getElementById("jenisKategori").value =
        jenis;

    document.getElementById("namaKategori").value =
        namaLama;

    if (modalKategori) {
        modalKategori.show();
    }

}


/* =====================================================
   SIMPAN KATEGORI
   ===================================================== */

function simpanKategori(event) {

    event.preventDefault();


    const jenis =
        document.getElementById("jenisKategori").value;

    const namaBaru =
        document.getElementById("namaKategori").value.trim();

    const namaLama =
        document.getElementById("kategoriLama").value.trim();


    // Validasi nama
    if (!namaBaru) {

        alert("Nama kategori wajib diisi.");

        return;
    }


    // Minimal 2 karakter
    if (namaBaru.length < 2) {

        alert("Nama kategori minimal 2 karakter.");

        return;
    }


    // Pastikan jenis benar
    if (
        jenis !== "pemasukan" &&
        jenis !== "pengeluaran"
    ) {

        alert("Jenis kategori tidak valid.");

        return;
    }


    const daftar =
        financeData.kategori[jenis];


    /* ==========================================
       MODE EDIT
       ========================================== */

    if (namaLama) {

        // Cek apakah nama sama
        if (
            namaLama.toLowerCase() !==
            namaBaru.toLowerCase()
        ) {

            const sudahAda = daftar.some(function (item) {

                return item.toLowerCase() ===
                    namaBaru.toLowerCase();

            });


            if (sudahAda) {

                alert(
                    "Kategori tersebut sudah tersedia."
                );

                return;
            }

        }


        // Cari index
        const index =
            daftar.findIndex(function (item) {

                return item === namaLama;

            });


        if (index === -1) {

            alert("Kategori tidak ditemukan.");

            return;
        }


        // Ubah nama kategori
        daftar[index] = namaBaru;


        /* ======================================
           UPDATE TRANSAKSI LAMA
           ====================================== */

        financeData.transaksi.forEach(function (transaksi) {

            if (
                transaksi.jenis === formatJenis(jenis) &&
                transaksi.kategori === namaLama
            ) {

                transaksi.kategori = namaBaru;

            }

        });


        commitData();

        tampilkanKategori();

        if (modalKategori) {
            modalKategori.hide();
        }

        alert(
            `Kategori "${namaLama}" berhasil diubah menjadi "${namaBaru}".`
        );

        return;
    }


    /* ==========================================
       MODE TAMBAH
       ========================================== */

    const sudahAda = daftar.some(function (item) {

        return item.toLowerCase() ===
            namaBaru.toLowerCase();

    });


    if (sudahAda) {

        alert(
            "Kategori tersebut sudah tersedia."
        );

        return;
    }


    // Tambahkan kategori
    daftar.push(namaBaru);


    // Simpan
    commitData();


    // Refresh
    tampilkanKategori();


    // Tutup modal
    if (modalKategori) {
        modalKategori.hide();
    }


    alert(
        `Kategori "${namaBaru}" berhasil ditambahkan.`
    );

}


/* =====================================================
   HAPUS KATEGORI
   ===================================================== */

function hapusKategori(jenis, nama) {

    /* ==========================================
       CEK APAKAH KATEGORI MASIH DIGUNAKAN
       ========================================== */

    const jenisTransaksi =
        formatJenis(jenis);


    const digunakan =
        financeData.transaksi.some(function (transaksi) {

            return (
                transaksi.jenis === jenisTransaksi &&
                transaksi.kategori === nama
            );

        });


    if (digunakan) {

        alert(
            `Kategori "${nama}" tidak dapat dihapus karena masih digunakan oleh transaksi.`
        );

        return;
    }


    /* ==========================================
       KONFIRMASI
       ========================================== */

    const yakin = confirm(
        `Yakin ingin menghapus kategori "${nama}"?`
    );


    if (!yakin) {
        return;
    }


    /* ==========================================
       CARI INDEX
       ========================================== */

    const daftar =
        financeData.kategori[jenis];


    const index =
        daftar.findIndex(function (item) {

            return item === nama;

        });


    if (index === -1) {

        alert("Kategori tidak ditemukan.");

        return;
    }


    /* ==========================================
       HAPUS
       ========================================== */

    daftar.splice(index, 1);


    /* ==========================================
       SIMPAN
       ========================================== */

    commitData();


    /* ==========================================
       REFRESH
       ========================================== */

    tampilkanKategori();


    alert(
        `Kategori "${nama}" berhasil dihapus.`
    );

}


/* =====================================================
   FORMAT JENIS
   pemasukan -> Pemasukan
   pengeluaran -> Pengeluaran
   ===================================================== */

function formatJenis(jenis) {

    if (jenis === "pemasukan") {
        return "Pemasukan";
    }

    if (jenis === "pengeluaran") {
        return "Pengeluaran";
    }

    return jenis;

}