/* =====================================================
   MY FINANCE
   LAPORAN.JS
   ===================================================== */

let chartKeuangan = null;
let chartKategori = null;


/* =====================================================
   SAAT HALAMAN DIBUKA
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    financeData = loadData();

    if (!Array.isArray(financeData.transaksi)) {
        financeData.transaksi = [];
    }

    const periode =
        document.getElementById("periodeLaporan");

    if (periode) {

        periode.addEventListener(
            "change",
            function () {

                aturCustomTanggal();

                tampilkanLaporan();

            }
        );

    }


    const mulai =
        document.getElementById("tanggalMulai");

    const akhir =
        document.getElementById("tanggalAkhir");


    if (mulai) {

        mulai.addEventListener(
            "change",
            tampilkanLaporan
        );

    }


    if (akhir) {

        akhir.addEventListener(
            "change",
            tampilkanLaporan
        );

    }


    tampilkanLaporan();

});


/* =====================================================
   FILTER CUSTOM
   ===================================================== */

function aturCustomTanggal() {

    const periode =
        document.getElementById(
            "periodeLaporan"
        ).value;


    const mulaiBox =
        document.getElementById(
            "tanggalMulaiBox"
        );

    const akhirBox =
        document.getElementById(
            "tanggalAkhirBox"
        );


    if (periode === "custom") {

        mulaiBox.style.display =
            "block";

        akhirBox.style.display =
            "block";

    } else {

        mulaiBox.style.display =
            "none";

        akhirBox.style.display =
            "none";

    }

}


/* =====================================================
   TAMPILKAN LAPORAN
   ===================================================== */

function tampilkanLaporan() {

    const transaksi =
        ambilTransaksiTerfilter();


    const pemasukan =
        transaksi
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


    const pengeluaran =
        transaksi
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


    const saldo =
        pemasukan -
        pengeluaran;


    /* ==========================================
       STATISTIK
       ========================================== */

    document.getElementById(
        "laporanPemasukan"
    ).textContent =
        rupiah(pemasukan);


    document.getElementById(
        "laporanPengeluaran"
    ).textContent =
        rupiah(pengeluaran);


    document.getElementById(
        "laporanSaldo"
    ).textContent =
        rupiah(saldo);


    document.getElementById(
        "laporanJumlahTransaksi"
    ).textContent =
        transaksi.length
            .toLocaleString("id-ID");


    /* ==========================================
       TABEL
       ========================================== */

    tampilkanTabelLaporan(
        transaksi
    );


    /* ==========================================
       REKAP
       ========================================== */

    tampilkanRekapKategori(
        transaksi,
        "Pemasukan",
        "rekapPemasukan"
    );


    tampilkanRekapKategori(
        transaksi,
        "Pengeluaran",
        "rekapPengeluaran"
    );


    /* ==========================================
       GRAFIK
       ========================================== */

    buatChartKeuangan(
        pemasukan,
        pengeluaran
    );


    buatChartKategori(
        transaksi
    );

}


/* =====================================================
   AMBIL TRANSAKSI SESUAI FILTER
   ===================================================== */

function ambilTransaksiTerfilter() {

    let transaksi =
        [...financeData.transaksi];


    const periode =
        document.getElementById(
            "periodeLaporan"
        ).value;


    const sekarang =
        new Date();


    let tanggalMulai = null;
    let tanggalAkhir = null;


    /* ==========================================
       SEMUA DATA
       ========================================== */

    if (periode === "semua") {

        return transaksi;

    }


    /* ==========================================
       BULAN INI
       ========================================== */

    if (periode === "bulanIni") {

        const tahun =
            sekarang.getFullYear();

        const bulan =
            sekarang.getMonth();


        tanggalMulai =
            new Date(
                tahun,
                bulan,
                1
            );


        tanggalAkhir =
            new Date(
                tahun,
                bulan + 1,
                0
            );

    }


    /* ==========================================
       BULAN LALU
       ========================================== */

    else if (periode === "bulanLalu") {

        const tahun =
            sekarang.getFullYear();

        const bulan =
            sekarang.getMonth();


        tanggalMulai =
            new Date(
                tahun,
                bulan - 1,
                1
            );


        tanggalAkhir =
            new Date(
                tahun,
                bulan,
                0
            );

    }


    /* ==========================================
       TAHUN INI
       ========================================== */

    else if (periode === "tahunIni") {

        const tahun =
            sekarang.getFullYear();


        tanggalMulai =
            new Date(
                tahun,
                0,
                1
            );


        tanggalAkhir =
            new Date(
                tahun,
                11,
                31
            );

    }


    /* ==========================================
       CUSTOM
       ========================================== */

    else if (periode === "custom") {

        const mulai =
            document.getElementById(
                "tanggalMulai"
            ).value;


        const akhir =
            document.getElementById(
                "tanggalAkhir"
            ).value;


        if (!mulai || !akhir) {

            return [];

        }


        tanggalMulai =
            new Date(
                mulai +
                "T00:00:00"
            );


        tanggalAkhir =
            new Date(
                akhir +
                "T23:59:59"
            );


        if (
            tanggalMulai >
            tanggalAkhir
        ) {

            return [];

        }

    }


    if (
        !tanggalMulai ||
        !tanggalAkhir
    ) {

        return transaksi;

    }


    return transaksi.filter(
        function (item) {

            if (!item.tanggal) {
                return false;
            }


            const tanggal =
                new Date(
                    item.tanggal +
                    "T00:00:00"
                );


            return (
                tanggal >= tanggalMulai &&
                tanggal <= tanggalAkhir
            );

        }
    );

}


/* =====================================================
   TABEL LAPORAN
   ===================================================== */

function tampilkanTabelLaporan(
    transaksi
) {

    const container =
        document.getElementById(
            "tabelLaporan"
        );


    if (!container) return;


    transaksi.sort(
        function (a, b) {

            const tanggalA =
                new Date(
                    (a.tanggal || "") +
                    "T00:00:00"
                );


            const tanggalB =
                new Date(
                    (b.tanggal || "") +
                    "T00:00:00"
                );


            if (
                tanggalB -
                tanggalA !== 0
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


    if (transaksi.length === 0) {

        container.innerHTML = `
            <div class="empty-report">

                <i class="bi bi-file-earmark-x"></i>

                <h5>
                    Tidak ada data
                </h5>

                <p>
                    Belum ada transaksi pada periode yang dipilih.
                </p>

            </div>
        `;

        return;

    }


    let html = `
        <table class="report-table">

            <thead>

                <tr>

                    <th>No</th>
                    <th>Tanggal</th>
                    <th>Jenis</th>
                    <th>Kategori</th>
                    <th>Keterangan</th>
                    <th>Metode</th>
                    <th class="text-end">
                        Nominal
                    </th>

                </tr>

            </thead>

            <tbody>
    `;


    transaksi.forEach(
        function (item, index) {

            const pemasukan =
                item.jenis === "Pemasukan";


            html += `
                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${formatTanggal(
                            item.tanggal
                        )}
                    </td>

                    <td>

                        ${
                            pemasukan
                            ?
                            `<span class="income-badge">
                                Pemasukan
                            </span>`
                            :
                            `<span class="expense-badge">
                                Pengeluaran
                            </span>`
                        }

                    </td>

                    <td>
                        ${escapeHTML(
                            item.kategori
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.keterangan
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            item.metode || "-"
                        )}
                    </td>

                    <td class="text-end">

                        ${
                            pemasukan
                            ?
                            `<span class="nominal-income">
                                + ${rupiah(item.nominal)}
                            </span>`
                            :
                            `<span class="nominal-expense">
                                - ${rupiah(item.nominal)}
                            </span>`
                        }

                    </td>

                </tr>
            `;

        }
    );


    html += `
            </tbody>

        </table>
    `;


    container.innerHTML =
        html;

}


/* =====================================================
   REKAP KATEGORI
   ===================================================== */

function tampilkanRekapKategori(
    transaksi,
    jenis,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) return;


    const data =
        {};


    transaksi
        .filter(
            item =>
                item.jenis === jenis
        )
        .forEach(
            function (item) {

                const kategori =
                    item.kategori ||
                    "Tanpa Kategori";


                if (!data[kategori]) {

                    data[kategori] = 0;

                }


                data[kategori] +=
                    Number(
                        item.nominal || 0
                    );

            }
        );


    const daftar =
        Object.entries(data)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    if (daftar.length === 0) {

        container.innerHTML = `
            <div class="empty-report">

                <i class="bi bi-tags"></i>

                <p>
                    Belum ada data kategori.
                </p>

            </div>
        `;

        return;

    }


    const total =
        daftar.reduce(
            (sum, item) =>
                sum + item[1],
            0
        );


    let html = "";


    daftar.forEach(
        function ([kategori, nominal]) {

            const persen =
                total > 0
                ? (nominal / total) * 100
                : 0;


            html += `
                <div class="category-summary-item">

                    <div class="category-summary-top">

                        <span class="category-summary-name">
                            ${escapeHTML(
                                kategori
                            )}
                        </span>

                        <span class="category-summary-value">
                            ${rupiah(nominal)}
                        </span>

                    </div>

                    <div class="category-progress">

                        <div
                            class="category-progress-bar"
                            style="width:${persen}%"
                        ></div>

                    </div>

                    <small
                        style="color:#9b7b7b;"
                    >
                        ${persen.toFixed(1)}%
                    </small>

                </div>
            `;

        }
    );


    container.innerHTML =
        html;

}


/* =====================================================
   CHART KEUANGAN
   ===================================================== */

function buatChartKeuangan(
    pemasukan,
    pengeluaran
) {

    const canvas =
        document.getElementById(
            "chartKeuangan"
        );


    if (!canvas) return;


    if (chartKeuangan) {

        chartKeuangan.destroy();

    }


    chartKeuangan =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: [
                        "Pemasukan",
                        "Pengeluaran"
                    ],

                    datasets: [

                        {
                            label:
                                "Nominal",

                            data: [
                                pemasukan,
                                pengeluaran
                            ],

                            borderRadius: 10,

                            backgroundColor: [
                                "#9bc7ad",
                                "#dfadbb"
                            ]

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display: false
                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        return rupiah(
                                            context.raw
                                        );

                                    }

                            }

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            ticks: {

                                callback:
                                    function (
                                        value
                                    ) {

                                        return rupiah(
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* =====================================================
   CHART KATEGORI
   ===================================================== */

function buatChartKategori(
    transaksi
) {

    const canvas =
        document.getElementById(
            "chartKategori"
        );


    if (!canvas) return;


    if (chartKategori) {

        chartKategori.destroy();

    }


    const data = {};


    transaksi
        .filter(
            item =>
                item.jenis ===
                "Pengeluaran"
        )
        .forEach(
            function (item) {

                const kategori =
                    item.kategori ||
                    "Tanpa Kategori";


                if (!data[kategori]) {

                    data[kategori] = 0;

                }


                data[kategori] +=
                    Number(
                        item.nominal || 0
                    );

            }
        );


    const labels =
        Object.keys(data);


    const values =
        Object.values(data);


    if (labels.length === 0) {

        chartKategori =
            new Chart(
                canvas,
                {

                    type: "doughnut",

                    data: {

                        labels: [
                            "Belum ada data"
                        ],

                        datasets: [
                            {
                                data: [1],
                                backgroundColor: [
                                    "#eadbd5"
                                ]
                            }
                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                position: "bottom"
                            }

                        }

                    }

                }
            );

        return;

    }


    const warna = [
        "#c77d92",
        "#9bc7ad",
        "#8eb7c7",
        "#d8a3b2",
        "#b89aa2",
        "#d5b78a",
        "#9c8290",
        "#b9a8d0"
    ];


    chartKategori =
        new Chart(
            canvas,
            {

                type: "doughnut",

                data: {

                    labels: labels,

                    datasets: [

                        {

                            data: values,

                            backgroundColor:
                                labels.map(
                                    function (
                                        item,
                                        index
                                    ) {

                                        return warna[
                                            index %
                                            warna.length
                                        ];

                                    }
                                ),

                            borderWidth: 2,

                            borderColor:
                                "#fffaf8"

                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    plugins: {

                        legend: {

                            position:
                                "bottom"

                        },

                        tooltip: {

                            callbacks: {

                                label:
                                    function (
                                        context
                                    ) {

                                        const value =
                                            context.raw;


                                        return (
                                            " " +
                                            context.label +
                                            ": " +
                                            rupiah(
                                                value
                                            )
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );

}


/* =====================================================
   RESET LAPORAN
   ===================================================== */

function resetLaporan() {

    document.getElementById(
        "periodeLaporan"
    ).value =
        "semua";


    document.getElementById(
        "tanggalMulai"
    ).value = "";


    document.getElementById(
        "tanggalAkhir"
    ).value = "";


    aturCustomTanggal();

    tampilkanLaporan();

}