/* =====================================================
   MY FINANCE
   KEUANGAN
   ===================================================== */

let bulanAktif = getCurrentMonthKey();
let halamanSekarang = 1;
const jumlahPerHalaman = 10;


/* =====================================================
   INIT
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        financeData = loadData();

        siapkanData();

        tampilkanDaftarBulan();

        const select =
            document.getElementById(
                "pilihBulan"
            );

        if (select) {

            select.value =
                bulanAktif;

            select.addEventListener(
                "change",
                function () {

                    bulanAktif =
                        this.value;

                    halamanSekarang =
                        1;

                    tampilkanSemua();
                }
            );
        }

        pasangEventForm();

        tampilkanSemua();
    }
);


/* =====================================================
   SIAPKAN DATA
   ===================================================== */

function siapkanData() {

    if (!Array.isArray(
        financeData.transaksi
    )) {

        financeData.transaksi = [];
    }

    if (!financeData.kategori) {

        financeData.kategori = {
            pemasukan: [],
            pengeluaran: []
        };
    }
}


/* =====================================================
   DAFTAR BULAN
   ===================================================== */

function tampilkanDaftarBulan() {

    const select =
        document.getElementById(
            "pilihBulan"
        );

    if (!select) {
        return;
    }

    const daftar =
        getDaftarBulan();

    select.innerHTML = "";

    daftar.forEach(
        bulan => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                bulan;

            option.textContent =
                namaBulan(bulan);

            select.appendChild(
                option
            );
        }
    );

    if (
        daftar.includes(
            bulanAktif
        )
    ) {

        select.value =
            bulanAktif;
    }
}


/* =====================================================
   TAMPILKAN SEMUA
   ===================================================== */

function tampilkanSemua() {

    tampilkanNamaBulan();

    tampilkanRingkasan();

    tampilkanKategori();

    tampilkanTransaksi();
}


/* =====================================================
   NAMA BULAN
   ===================================================== */

function tampilkanNamaBulan() {

    const el =
        document.getElementById(
            "namaBulanAktif"
        );

    if (el) {

        el.textContent =
            namaBulan(
                bulanAktif
            );
    }
}


/* =====================================================
   RINGKASAN
   ===================================================== */

function tampilkanRingkasan() {

    const ringkasan =
        getRingkasanBulan(
            bulanAktif
        );

    const saldo =
        document.getElementById(
            "summarySaldo"
        );

    const pemasukan =
        document.getElementById(
            "summaryPemasukan"
        );

    const pengeluaran =
        document.getElementById(
            "summaryPengeluaran"
        );

    const jumlah =
        document.getElementById(
            "summaryJumlah"
        );

    if (saldo) {

        saldo.textContent =
            rupiah(
                ringkasan.saldoAkhir
            );
    }

    if (pemasukan) {

        pemasukan.textContent =
            rupiah(
                ringkasan.pemasukan
            );
    }

    if (pengeluaran) {

        pengeluaran.textContent =
            rupiah(
                ringkasan.pengeluaran
            );
    }

    if (jumlah) {

        jumlah.textContent =
            ringkasan.jumlahTransaksi;
    }
}


/* =====================================================
   KATEGORI
   ===================================================== */

function tampilkanKategori() {

    const select =
        document.getElementById(
            "filterKategori"
        );

    if (!select) {
        return;
    }

    const nilaiLama =
        select.value;

    select.innerHTML = `
        <option value="">
            Semua Kategori
        </option>
    `;

    const semua = [
        ...financeData.kategori.pemasukan,
        ...financeData.kategori.pengeluaran
    ];

    [
        ...new Set(semua)
    ].forEach(
        kategori => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                kategori;

            option.textContent =
                kategori;

            select.appendChild(
                option
            );
        }
    );

    if (
        semua.includes(
            nilaiLama
        )
    ) {

        select.value =
            nilaiLama;
    }
}


/* =====================================================
   FORM EVENT
   ===================================================== */

function pasangEventForm() {

    const form =
        document.getElementById(
            "formTransaksi"
        );

    if (form) {

        form.addEventListener(
            "submit",
            simpanTransaksi
        );
    }

    const btnBuka =
        document.getElementById(
            "btnBukaForm"
        );

    if (btnBuka) {

        btnBuka.addEventListener(
            "click",
            bukaFormTambah
        );
    }

    const btnTutup =
        document.getElementById(
            "btnTutupForm"
        );

    if (btnTutup) {

        btnTutup.addEventListener(
            "click",
            tutupForm
        );
    }

    const btnBatal =
        document.getElementById(
            "btnBatalEdit"
        );

    if (btnBatal) {

        btnBatal.addEventListener(
            "click",
            tutupForm
        );
    }

    const jenis =
        document.querySelectorAll(
            'input[name="jenisTransaksi"]'
        );

    jenis.forEach(
        radio => {

            radio.addEventListener(
                "change",
                tampilkanKategoriForm
            );
        }
    );

    const search =
        document.getElementById(
            "searchTransaksi"
        );

    if (search) {

        search.addEventListener(
            "input",
            function () {

                halamanSekarang =
                    1;

                tampilkanTransaksi();
            }
        );
    }

    const filterJenis =
        document.getElementById(
            "filterJenis"
        );

    if (filterJenis) {

        filterJenis.addEventListener(
            "change",
            function () {

                halamanSekarang =
                    1;

                tampilkanTransaksi();
            }
        );
    }

    const filterKategori =
        document.getElementById(
            "filterKategori"
        );

    if (filterKategori) {

        filterKategori.addEventListener(
            "change",
            function () {

                halamanSekarang =
                    1;

                tampilkanTransaksi();
            }
        );
    }

    const reset =
        document.getElementById(
            "btnResetFilter"
        );

    if (reset) {

        reset.addEventListener(
            "click",
            function () {

                const search =
                    document.getElementById(
                        "searchTransaksi"
                    );

                const jenis =
                    document.getElementById(
                        "filterJenis"
                    );

                const kategori =
                    document.getElementById(
                        "filterKategori"
                    );

                if (search)
                    search.value = "";

                if (jenis)
                    jenis.value = "";

                if (kategori)
                    kategori.value = "";

                halamanSekarang =
                    1;

                tampilkanTransaksi();
            }
        );
    }
}


/* =====================================================
   BUKA FORM TAMBAH
   ===================================================== */

function bukaFormTambah() {

    const card =
        document.getElementById(
            "formCard"
        );

    if (card) {

        card.style.display =
            "block";
    }

    resetIsiForm();
}


/* =====================================================
   TUTUP FORM
   ===================================================== */

function tutupForm() {

    const card =
        document.getElementById(
            "formCard"
        );

    if (card) {

        card.style.display =
            "none";
    }

    resetIsiForm();
}


/* =====================================================
   RESET FORM
   ===================================================== */

function resetIsiForm() {

    const form =
        document.getElementById(
            "formTransaksi"
        );

    if (form) {
        form.reset();
    }

    const edit =
        document.getElementById(
            "editTransaksiId"
        );

    if (edit) {
        edit.value = "";
    }

    const radio =
        document.getElementById(
            "optionPemasukan"
        );

    if (radio) {
        radio.checked = true;
    }

    const tanggal =
        document.getElementById(
            "tanggalTransaksi"
        );

    if (tanggal) {

        tanggal.value =
            new Date()
                .toISOString()
                .substring(
                    0,
                    10
                );
    }

    const button =
        document.getElementById(
            "btnSimpanTransaksi"
        );

    if (button) {

        button.innerHTML = `
            <i class="bi bi-check-circle"></i>
            Simpan Transaksi
        `;
    }

    tampilkanKategoriForm();
}


/* =====================================================
   KATEGORI FORM
   ===================================================== */

function tampilkanKategoriForm() {

    const kategori =
        document.getElementById(
            "kategoriTransaksi"
        );

    if (!kategori) {
        return;
    }

    const radio =
        document.querySelector(
            'input[name="jenisTransaksi"]:checked'
        );

    const jenis =
        radio
            ? radio.value
            : "Pemasukan";

    const daftar =
        jenis === "Pemasukan"
            ? financeData.kategori.pemasukan
            : financeData.kategori.pengeluaran;

    kategori.innerHTML =
        `<option value="">
            Pilih kategori
        </option>`;

    daftar.forEach(
        nama => {

            kategori.innerHTML += `
                <option value="${escapeHTML(nama)}">
                    ${escapeHTML(nama)}
                </option>
            `;
        }
    );
}


/* =====================================================
   SIMPAN TRANSAKSI
   ===================================================== */

function simpanTransaksi(e) {

    e.preventDefault();

    const editId =
        document.getElementById(
            "editTransaksiId"
        ).value;

    const radio =
        document.querySelector(
            'input[name="jenisTransaksi"]:checked'
        );

    const jenis =
        radio
            ? radio.value
            : "Pemasukan";

    const tanggal =
        document.getElementById(
            "tanggalTransaksi"
        ).value;

    const kategori =
        document.getElementById(
            "kategoriTransaksi"
        ).value;

    const nominal =
        Number(
            document.getElementById(
                "nominalTransaksi"
            ).value
        );

    const keterangan =
        document.getElementById(
            "keteranganTransaksi"
        ).value.trim();

    const metode =
        document.getElementById(
            "metodeTransaksi"
        ).value;

    const catatanEl =
        document.getElementById(
            "catatanTransaksi"
        );

    const catatan =
        catatanEl
            ? catatanEl.value.trim()
            : "";

    if (
        !tanggal ||
        !kategori ||
        !keterangan ||
        nominal <= 0
    ) {

        showNotification(
            "Lengkapi data transaksi terlebih dahulu.",
            "warning",
            "Data belum lengkap"
        );

        return;
    }


    if (editId) {

        const index =
            financeData.transaksi.findIndex(
                item =>
                    String(item.id) ===
                    String(editId)
            );

        if (index !== -1) {

            financeData.transaksi[index] = {

                ...financeData.transaksi[index],

                jenis,
                tanggal,
                kategori,
                nominal,
                keterangan,
                metode,
                catatan
            };

            commitData();

            bulanAktif =
                getMonthKey(
                    tanggal
                );

            tampilkanDaftarBulan();

            tampilkanSemua();

            tutupForm();

            showNotification(
                "Perubahan transaksi berhasil disimpan."
            );

            return;
        }
    }


    financeData.transaksi.push({

        id:
            generateId(),

        jenis,

        tanggal,

        kategori,

        nominal,

        keterangan,

        metode,

        catatan
    });


    commitData();

    bulanAktif =
        getMonthKey(
            tanggal
        );

    tampilkanDaftarBulan();

    tampilkanSemua();

    tutupForm();

    showNotification(
        "Transaksi berhasil ditambahkan."
    );
}


/* =====================================================
   FILTER TRANSAKSI
   ===================================================== */

function ambilTransaksiTerfilter() {

    const searchEl =
        document.getElementById(
            "searchTransaksi"
        );

    const jenisEl =
        document.getElementById(
            "filterJenis"
        );

    const kategoriEl =
        document.getElementById(
            "filterKategori"
        );

    const search =
        searchEl
            ? searchEl.value
                .toLowerCase()
                .trim()
            : "";

    const jenis =
        jenisEl
            ? jenisEl.value
            : "";

    const kategori =
        kategoriEl
            ? kategoriEl.value
            : "";

    let data =
        getTransaksiBulan(
            bulanAktif
        );

    if (search) {

        data =
            data.filter(
                item =>

                    String(
                        item.keterangan
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        item.kategori
                    )
                    .toLowerCase()
                    .includes(search)
            );
    }

    if (jenis) {

        data =
            data.filter(
                item =>
                    item.jenis ===
                    jenis
            );
    }

    if (kategori) {

        data =
            data.filter(
                item =>
                    item.kategori ===
                    kategori
            );
    }

    data.sort(
        (a, b) => {

            const tanggalA =
                new Date(
                    a.tanggal
                );

            const tanggalB =
                new Date(
                    b.tanggal
                );

            if (
                tanggalB -
                tanggalA !==
                0
            ) {

                return (
                    tanggalB -
                    tanggalA
                );
            }

            return (
                Number(b.id) -
                Number(a.id)
            );
        }
    );

    return data;
}


/* =====================================================
   TAMPILKAN TRANSAKSI
   ===================================================== */

function tampilkanTransaksi() {

    const container =
        document.getElementById(
            "tabelTransaksi"
        );

    if (!container) {
        return;
    }

    const semua =
        ambilTransaksiTerfilter();

    const total =
        semua.length;

    const totalHalaman =
        Math.max(
            1,
            Math.ceil(
                total /
                jumlahPerHalaman
            )
        );

    if (
        halamanSekarang >
        totalHalaman
    ) {

        halamanSekarang =
            totalHalaman;
    }

    const mulai =
        (
            halamanSekarang -
            1
        ) *
        jumlahPerHalaman;

    const data =
        semua.slice(
            mulai,
            mulai +
            jumlahPerHalaman
        );


    if (data.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-receipt"></i>

                <h5>
                    Belum ada transaksi
                </h5>

                <p>
                    Belum ada transaksi
                    pada bulan ini.
                </p>
            </div>
        `;

    } else {

        let html = `
            <div class="table-wrapper">

            <table class="table">

                <thead>

                    <tr>

                        <th>
                            Tanggal
                        </th>

                        <th>
                            Keterangan
                        </th>

                        <th>
                            Kategori
                        </th>

                        <th>
                            Jenis
                        </th>

                        <th>
                            Metode
                        </th>

                        <th class="text-end">
                            Nominal
                        </th>

                        <th class="text-center">
                            Aksi
                        </th>

                    </tr>

                </thead>

                <tbody>
        `;


        data.forEach(
            item => {

                const pemasukan =
                    item.jenis ===
                    "Pemasukan";


                html += `

                    <tr>

                        <td>
                            ${formatTanggal(
                                item.tanggal
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.keterangan
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                item.kategori
                            )}
                        </td>

                        <td>
                            ${
                                pemasukan
                                ?
                                `<span class="badge badge-pemasukan">
                                    Pemasukan
                                </span>`
                                :
                                `<span class="badge badge-pengeluaran">
                                    Pengeluaran
                                </span>`
                            }
                        </td>

                        <td>
                            ${escapeHTML(
                                item.metode ||
                                "-"
                            )}
                        </td>

                        <td class="text-end">

                            ${
                                pemasukan
                                ?
                                `<span class="text-success fw-bold">
                                    + ${rupiah(
                                        item.nominal
                                    )}
                                </span>`
                                :
                                `<span class="text-danger fw-bold">
                                    - ${rupiah(
                                        item.nominal
                                    )}
                                </span>`
                            }

                        </td>

                        <td class="text-center">

                            <button
                                type="button"
                                class="btn btn-sm btn-blue me-1"
                                onclick="editTransaksi('${item.id}')"
                                title="Edit"
                            >
                                <i class="bi bi-pencil"></i>
                            </button>

                            <button
                                type="button"
                                class="btn btn-sm btn-danger-soft"
                                onclick="hapusTransaksi('${item.id}')"
                                title="Hapus"
                            >
                                <i class="bi bi-trash3"></i>
                            </button>

                        </td>

                    </tr>

                `;
            }
        );


        html += `
                </tbody>

            </table>

            </div>
        `;

        container.innerHTML =
            html;
    }


    const jumlahHasil =
        document.getElementById(
            "jumlahHasil"
        );

    if (jumlahHasil) {

        jumlahHasil.textContent =
            total;
    }

    tampilkanPagination(
        total
    );
}


/* =====================================================
   EDIT TRANSAKSI
   ===================================================== */

function editTransaksi(id) {

    const item =
        financeData.transaksi.find(
            data =>
                String(data.id) ===
                String(id)
        );

    if (!item) {
        return;
    }

    const formCard =
        document.getElementById(
            "formCard"
        );

    if (formCard) {

        formCard.style.display =
            "block";
    }

    document.getElementById(
        "editTransaksiId"
    ).value = item.id;


    const radio =
        document.querySelector(
            `input[name="jenisTransaksi"][value="${item.jenis}"]`
        );

    if (radio) {
        radio.checked = true;
    }

    tampilkanKategoriForm();


    document.getElementById(
        "tanggalTransaksi"
    ).value =
        item.tanggal;


    document.getElementById(
        "kategoriTransaksi"
    ).value =
        item.kategori;


    document.getElementById(
        "nominalTransaksi"
    ).value =
        item.nominal;


    document.getElementById(
        "keteranganTransaksi"
    ).value =
        item.keterangan;


    document.getElementById(
        "metodeTransaksi"
    ).value =
        item.metode || "Cash";


    const catatan =
        document.getElementById(
            "catatanTransaksi"
        );

    if (catatan) {

        catatan.value =
            item.catatan || "";
    }


    const button =
        document.getElementById(
            "btnSimpanTransaksi"
        );

    if (button) {

        button.innerHTML = `
            <i class="bi bi-check-circle"></i>
            Simpan Perubahan
        `;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =====================================================
   HAPUS TRANSAKSI
   ===================================================== */

function hapusTransaksi(id) {

    const index =
        financeData.transaksi.findIndex(
            item =>
                String(item.id) ===
                String(id)
        );

    if (index === -1) {
        return;
    }

    financeData.transaksi.splice(
        index,
        1
    );

    commitData();

    tampilkanDaftarBulan();

    tampilkanSemua();

    showNotification(
        "Transaksi berhasil dihapus.",
        "danger",
        "Berhasil dihapus!"
    );
}


/* =====================================================
   PAGINATION
   ===================================================== */

function tampilkanPagination(
    total
) {

    const pagination =
        document.getElementById(
            "pagination"
        );

    const info =
        document.getElementById(
            "paginationInfo"
        );

    if (!pagination) {
        return;
    }

    const totalHalaman =
        Math.ceil(
            total /
            jumlahPerHalaman
        );

    pagination.innerHTML =
        "";

    if (
        totalHalaman <= 1
    ) {

        if (info) {
            info.textContent =
                total +
                " transaksi";
        }

        return;
    }


    for (
        let i = 1;
        i <= totalHalaman;
        i++
    ) {

        const li =
            document.createElement(
                "li"
            );

        li.className =
            "page-item " +
            (
                i ===
                halamanSekarang
                    ? "active"
                    : ""
            );

        li.innerHTML = `
            <button
                type="button"
                class="page-link"
            >
                ${i}
            </button>
        `;

        li.querySelector(
            "button"
        ).addEventListener(
            "click",
            function () {

                halamanSekarang =
                    i;

                tampilkanTransaksi();
            }
        );

        pagination.appendChild(
            li
        );
    }


    if (info) {

        const awal =
            total === 0
                ? 0
                :
                (
                    (
                        halamanSekarang -
                        1
                    ) *
                    jumlahPerHalaman
                ) + 1;

        const akhir =
            Math.min(
                halamanSekarang *
                jumlahPerHalaman,
                total
            );

        info.textContent =
            `${awal}-${akhir} dari ${total} transaksi`;
    }
}