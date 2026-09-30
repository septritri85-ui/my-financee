/* =====================================================
   MY FINANCE
   APP CORE
   SISTEM KEUANGAN PER BULAN
   ===================================================== */

const defaultData = {
    transaksi: [],
    tabungan: [],
    kategori: {
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
    },
    profile: {
        nama: "Pengguna",
        username: "pengguna",
        foto: ""
    }
};


/* =====================================================
   LOAD DATA
   ===================================================== */

function loadData() {
    const data = localStorage.getItem("myFinanceData");

    if (!data) {
        localStorage.setItem(
            "myFinanceData",
            JSON.stringify(defaultData)
        );

        return JSON.parse(
            JSON.stringify(defaultData)
        );
    }

    try {

        const hasil = JSON.parse(data);

        if (!Array.isArray(hasil.transaksi)) {
            hasil.transaksi = [];
        }

        if (!Array.isArray(hasil.tabungan)) {
            hasil.tabungan = [];
        }

        if (!hasil.kategori) {
            hasil.kategori = {
                pemasukan: [],
                pengeluaran: []
            };
        }

        if (!Array.isArray(hasil.kategori.pemasukan)) {
            hasil.kategori.pemasukan = [];
        }

        if (!Array.isArray(hasil.kategori.pengeluaran)) {
            hasil.kategori.pengeluaran = [];
        }

        if (!hasil.profile) {
            hasil.profile = {
                nama: "Pengguna",
                username: "pengguna",
                foto: ""
            };
        }

        return hasil;

    } catch (error) {

        console.error(
            "Data My Finance rusak:",
            error
        );

        localStorage.setItem(
            "myFinanceData",
            JSON.stringify(defaultData)
        );

        return JSON.parse(
            JSON.stringify(defaultData)
        );
    }
}


/* =====================================================
   SAVE DATA
   ===================================================== */

function saveData(data) {
    localStorage.setItem(
        "myFinanceData",
        JSON.stringify(data)
    );
}


let financeData = loadData();


/* =====================================================
   RUPIAH
   ===================================================== */

function rupiah(nominal) {

    nominal = Number(nominal) || 0;

    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(nominal);
}


/* =====================================================
   FORMAT TANGGAL
   ===================================================== */

function formatTanggal(tanggal) {

    if (!tanggal) {
        return "-";
    }

    const date = new Date(
        tanggal + "T00:00:00"
    );

    return date.toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =====================================================
   GENERATE ID
   ===================================================== */

function generateId() {

    return Date.now() +
        Math.floor(
            Math.random() * 1000
        );
}


/* =====================================================
   ESCAPE HTML
   ===================================================== */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


/* =====================================================
   COMMIT DATA
   ===================================================== */

function commitData() {

    saveData(financeData);
}


/* =====================================================
   BULAN
   ===================================================== */

function getMonthKey(tanggal) {

    if (!tanggal) {

        const sekarang = new Date();

        return (
            sekarang.getFullYear() +
            "-" +
            String(
                sekarang.getMonth() + 1
            ).padStart(2, "0")
        );
    }

    return String(tanggal).substring(0, 7);
}


function getCurrentMonthKey() {

    const sekarang = new Date();

    return (
        sekarang.getFullYear() +
        "-" +
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0")
    );
}


function namaBulan(monthKey) {

    if (!monthKey) {
        return "";
    }

    const bagian =
        monthKey.split("-");

    const tahun =
        Number(bagian[0]);

    const bulan =
        Number(bagian[1]) - 1;

    const tanggal =
        new Date(
            tahun,
            bulan,
            1
        );

    return tanggal.toLocaleDateString(
        "id-ID",
        {
            month: "long",
            year: "numeric"
        }
    );
}


/* =====================================================
   TRANSAKSI PER BULAN
   ===================================================== */

function getTransaksiBulan(monthKey) {

    return financeData.transaksi.filter(
        item =>
            getMonthKey(item.tanggal) ===
            monthKey
    );
}


function getTotalPemasukanBulan(monthKey) {

    return getTransaksiBulan(monthKey)
        .filter(
            item =>
                item.jenis === "Pemasukan"
        )
        .reduce(
            (total, item) =>
                total +
                Number(item.nominal || 0),
            0
        );
}


function getTotalPengeluaranBulan(monthKey) {

    return getTransaksiBulan(monthKey)
        .filter(
            item =>
                item.jenis === "Pengeluaran"
        )
        .reduce(
            (total, item) =>
                total +
                Number(item.nominal || 0),
            0
        );
}


/* =====================================================
   SALDO SEBELUM BULAN
   ===================================================== */

function getSaldoSebelumBulan(monthKey) {

    let saldo = 0;

    financeData.transaksi.forEach(
        item => {

            const transaksiMonth =
                getMonthKey(
                    item.tanggal
                );

            if (
                transaksiMonth <
                monthKey
            ) {

                if (
                    item.jenis ===
                    "Pemasukan"
                ) {

                    saldo +=
                        Number(
                            item.nominal || 0
                        );

                } else if (
                    item.jenis ===
                    "Pengeluaran"
                ) {

                    saldo -=
                        Number(
                            item.nominal || 0
                        );
                }
            }
        }
    );

    return saldo;
}


/* =====================================================
   SALDO BULAN
   ===================================================== */

function getSaldoBulan(monthKey) {

    const saldoAwal =
        getSaldoSebelumBulan(
            monthKey
        );

    const pemasukan =
        getTotalPemasukanBulan(
            monthKey
        );

    const pengeluaran =
        getTotalPengeluaranBulan(
            monthKey
        );

    return (
        saldoAwal +
        pemasukan -
        pengeluaran
    );
}


/* =====================================================
   RINGKASAN BULAN
   ===================================================== */

function getRingkasanBulan(monthKey) {

    const transaksi =
        getTransaksiBulan(
            monthKey
        );

    const saldoAwal =
        getSaldoSebelumBulan(
            monthKey
        );

    const pemasukan =
        getTotalPemasukanBulan(
            monthKey
        );

    const pengeluaran =
        getTotalPengeluaranBulan(
            monthKey
        );

    const saldoAkhir =
        saldoAwal +
        pemasukan -
        pengeluaran;

    return {

        bulan: monthKey,

        namaBulan:
            namaBulan(monthKey),

        saldoAwal:

            saldoAwal,

        pemasukan:

            pemasukan,

        pengeluaran:

            pengeluaran,

        saldoAkhir:

            saldoAkhir,

        jumlahTransaksi:

            transaksi.length
    };
}


/* =====================================================
   TOTAL SEMUA TRANSAKSI
   ===================================================== */

function getTotalPemasukan() {

    return financeData.transaksi

        .filter(
            item =>
                item.jenis ===
                "Pemasukan"
        )

        .reduce(
            (total, item) =>
                total +
                Number(
                    item.nominal || 0
                ),
            0
        );
}


function getTotalPengeluaran() {

    return financeData.transaksi

        .filter(
            item =>
                item.jenis ===
                "Pengeluaran"
        )

        .reduce(
            (total, item) =>
                total +
                Number(
                    item.nominal || 0
                ),
            0
        );
}


function getSaldo() {

    return (
        getTotalPemasukan() -
        getTotalPengeluaran()
    );
}


/* =====================================================
   TABUNGAN
   ===================================================== */

function getTotalTabungan() {

    return financeData.tabungan.reduce(
        (total, item) =>
            total +
            Number(
                item.nominal_terkumpul ||
                0
            ),
        0
    );
}


function getTotalTargetTabungan() {

    return financeData.tabungan.reduce(
        (total, item) =>
            total +
            Number(
                item.target_nominal ||
                0
            ),
        0
    );
}


function getProgressTabungan() {

    const target =
        getTotalTargetTabungan();

    const terkumpul =
        getTotalTabungan();

    if (target <= 0) {
        return 0;
    }

    let progress =
        (
            terkumpul /
            target
        ) * 100;

    if (progress > 100) {
        progress = 100;
    }

    return progress;
}


/* =====================================================
   DAFTAR BULAN
   ===================================================== */

function getDaftarBulan() {

    const bulan =
        new Set();

    bulan.add(
        getCurrentMonthKey()
    );

    financeData.transaksi.forEach(
        item => {

            if (item.tanggal) {

                bulan.add(
                    getMonthKey(
                        item.tanggal
                    )
                );
            }
        }
    );

    return Array.from(bulan)
        .sort()
        .reverse();
}


/* =====================================================
   NOTIFIKASI CANTIK
   ===================================================== */

function showNotification(
    message,
    type = "success",
    title = ""
) {

    const oldNotification =
        document.getElementById(
            "financeNotification"
        );

    if (oldNotification) {
        oldNotification.remove();
    }

    let icon = "bi-check-circle-fill";
    let defaultTitle =
        "Berhasil!";

    if (type === "danger") {

        icon =
            "bi-trash3-fill";

        defaultTitle =
            "Berhasil dihapus!";

    } else if (type === "warning") {

        icon =
            "bi-exclamation-circle-fill";

        defaultTitle =
            "Perhatian";

    } else if (type === "info") {

        icon =
            "bi-info-circle-fill";

        defaultTitle =
            "Informasi";
    }

    const notification =
        document.createElement(
            "div"
        );

    notification.id =
        "financeNotification";

    notification.className =
        "finance-notification " +
        "notification-" +
        type;

    notification.innerHTML = `

        <div class="finance-notification-icon">
            <i class="bi ${icon}"></i>
        </div>

        <div class="finance-notification-content">

            <strong>
                ${
                    title ||
                    defaultTitle
                }
            </strong>

            <span>
                ${escapeHTML(message)}
            </span>

        </div>

        <button
            type="button"
            class="finance-notification-close"
            aria-label="Tutup"
        >
            <i class="bi bi-x-lg"></i>
        </button>

    `;

    document.body.appendChild(
        notification
    );

    const closeButton =
        notification.querySelector(
            ".finance-notification-close"
        );

    closeButton.addEventListener(
        "click",
        function () {

            tutupNotifikasi(
                notification
            );
        }
    );

    setTimeout(
        function () {

            tutupNotifikasi(
                notification
            );

        },
        3500
    );
}


/* =====================================================
   TUTUP NOTIFIKASI
   ===================================================== */

function tutupNotifikasi(
    notification
) {

    if (!notification) {
        return;
    }

    notification.classList.add(
        "notification-hide"
    );

    setTimeout(
        function () {

            if (
                notification &&
                notification.parentNode
            ) {

                notification.remove();
            }

        },
        300
    );
}


/* =====================================================
   NOTIFIKASI HAPUS
   ===================================================== */

function notifyDeleted(
    namaData
) {

    showNotification(
        `${namaData} berhasil dihapus.`,
        "danger",
        "Berhasil dihapus!"
    );
}


/* =====================================================
   RESET SEMUA DATA
   ===================================================== */

function resetFinanceData() {

    const yakin =
        window.confirm(
            "Yakin ingin menghapus semua data My Finance?"
        );

    if (!yakin) {
        return;
    }

    localStorage.removeItem(
        "myFinanceData"
    );

    location.reload();
}