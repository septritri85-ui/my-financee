/* =========================================================
   MY FINANCE
   DASHBOARD JAVASCRIPT
   Static Version - Tanpa PHP & Database
   ========================================================= */


/* =========================================================
   SAAT HALAMAN SELESAI DIMUAT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // Ambil data terbaru dari localStorage
    financeData = loadData();

    // Tampilkan seluruh isi dashboard
    tampilkanDashboard();

});


/* =========================================================
   TAMPILKAN DASHBOARD
========================================================= */

function tampilkanDashboard() {

    /* ---------------------------------------------
       HITUNG DATA
    --------------------------------------------- */

    const pemasukan = getTotalPemasukan();

    const pengeluaran = getTotalPengeluaran();

    const saldo = getSaldo();

    const tabungan = getTotalTabungan();

    const target = getTotalTargetTabungan();

    const progress = getProgressTabungan();


    /* ---------------------------------------------
       NAMA PENGGUNA
    --------------------------------------------- */

    const namaDashboard =
        document.getElementById("namaDashboard");

    if (namaDashboard) {

        namaDashboard.textContent =
            financeData.profile?.nama || "Pengguna";

    }


    /* ---------------------------------------------
       TOTAL PEMASUKAN
    --------------------------------------------- */

    const totalPemasukan =
        document.getElementById("totalPemasukan");

    if (totalPemasukan) {

        totalPemasukan.textContent =
            rupiah(pemasukan);

    }


    /* ---------------------------------------------
       TOTAL PENGELUARAN
    --------------------------------------------- */

    const totalPengeluaran =
        document.getElementById("totalPengeluaran");

    if (totalPengeluaran) {

        totalPengeluaran.textContent =
            rupiah(pengeluaran);

    }


    /* ---------------------------------------------
       SALDO
    --------------------------------------------- */

    const saldoElement =
        document.getElementById("saldo");

    if (saldoElement) {

        saldoElement.textContent =
            rupiah(saldo);

    }


    /* ---------------------------------------------
       TOTAL TABUNGAN
    --------------------------------------------- */

    const totalTabungan =
        document.getElementById("totalTabungan");

    if (totalTabungan) {

        totalTabungan.textContent =
            rupiah(tabungan);

    }


    /* ---------------------------------------------
       JUMLAH TRANSAKSI
    --------------------------------------------- */

    const jumlahTransaksi =
        document.getElementById("jumlahTransaksi");

    if (jumlahTransaksi) {

        jumlahTransaksi.textContent =
            financeData.transaksi.length
                .toLocaleString("id-ID");

    }


    /* ---------------------------------------------
       TOTAL TABUNGAN TERKUMPUL
    --------------------------------------------- */

    const dashboardTerkumpul =
        document.getElementById("dashboardTerkumpul");

    if (dashboardTerkumpul) {

        dashboardTerkumpul.textContent =
            rupiah(tabungan);

    }


    /* ---------------------------------------------
       TOTAL TARGET TABUNGAN
    --------------------------------------------- */

    const dashboardTarget =
        document.getElementById("dashboardTarget");

    if (dashboardTarget) {

        dashboardTarget.textContent =
            rupiah(target);

    }


    /* ---------------------------------------------
       PROGRESS BAR
    --------------------------------------------- */

    const progressBar =
        document.getElementById("progressBar");

    if (progressBar) {

        progressBar.style.width =
            progress + "%";

        progressBar.setAttribute(
            "aria-valuenow",
            progress
        );

    }


    /* ---------------------------------------------
       TEKS PROGRESS
    --------------------------------------------- */

    const progressText =
        document.getElementById("progressText");

    if (progressText) {

        progressText.textContent =
            progress.toFixed(1) + "%";

    }


    /* ---------------------------------------------
       PROGRESS CIRCLE
    --------------------------------------------- */

    const progressCircle =
        document.getElementById("progressCircle");

    if (progressCircle) {

        progressCircle.textContent =
            Math.round(progress) + "%";


        /*
         * CSS dashboard menggunakan:
         *
         * --progress
         *
         * untuk menentukan panjang lingkaran.
         */

        const circleContainer =
            progressCircle.parentElement?.parentElement;

        if (circleContainer) {

            circleContainer.style.setProperty(
                "--progress",
                progress
            );

        }

    }


    /* ---------------------------------------------
       TAMPILKAN TRANSAKSI TERBARU
    --------------------------------------------- */

    tampilkanTransaksiTerbaru();

}


/* =========================================================
   TRANSAKSI TERBARU
========================================================= */

function tampilkanTransaksiTerbaru() {

    const container =
        document.getElementById("tabelTransaksi");

    if (!container) {
        return;
    }


    /* ---------------------------------------------
       CEK DATA TRANSAKSI
    --------------------------------------------- */

    if (
        !financeData ||
        !Array.isArray(financeData.transaksi)
    ) {

        container.innerHTML = `
            <div class="empty-state">

                <i class="bi bi-receipt"></i>

                <h5>
                    Belum ada transaksi
                </h5>

                <p>
                    Yuk mulai mencatat transaksi
                    keuanganmu.
                </p>

                <a
                    href="keuangan.html"
                    class="btn btn-pink">

                    <i class="bi bi-plus-circle"></i>

                    Tambah Transaksi

                </a>

            </div>
        `;

        return;
    }


    /* ---------------------------------------------
       AMBIL 7 TRANSAKSI TERBARU
    --------------------------------------------- */

    const transaksi =
        [...financeData.transaksi]
            .sort(function (a, b) {

                /*
                 * Urutkan berdasarkan tanggal
                 */

                const tanggalA =
                    new Date(
                        a.tanggal + "T00:00:00"
                    );

                const tanggalB =
                    new Date(
                        b.tanggal + "T00:00:00"
                    );


                /*
                 * Jika tanggal berbeda
                 */

                if (
                    tanggalB.getTime() !==
                    tanggalA.getTime()
                ) {

                    return (
                        tanggalB.getTime() -
                        tanggalA.getTime()
                    );

                }


                /*
                 * Jika tanggal sama,
                 * gunakan ID terbaru.
                 */

                return (
                    Number(b.id || 0) -
                    Number(a.id || 0)
                );

            })
            .slice(0, 7);


    /* ---------------------------------------------
       JIKA BELUM ADA TRANSAKSI
    --------------------------------------------- */

    if (transaksi.length === 0) {

        container.innerHTML = `
            <div class="empty-state">

                <i class="bi bi-receipt"></i>

                <h5>
                    Belum ada transaksi
                </h5>

                <p>
                    Yuk mulai mencatat transaksi
                    keuanganmu.
                </p>

                <a
                    href="keuangan.html"
                    class="btn btn-pink">

                    <i class="bi bi-plus-circle"></i>

                    Tambah Transaksi

                </a>

            </div>
        `;

        return;
    }


    /* ---------------------------------------------
       BUAT TABEL
    --------------------------------------------- */

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
                            Metode
                        </th>

                        <th class="text-end">
                            Nominal
                        </th>

                    </tr>

                </thead>

                <tbody>
    `;


    /* ---------------------------------------------
       MASUKKAN DATA TRANSAKSI
    --------------------------------------------- */

    transaksi.forEach(function (item) {

        const pemasukan =
            item.jenis === "Pemasukan";


        const nominal =
            Number(item.nominal) || 0;


        html += `

            <tr>

                <td>
                    ${formatTanggal(item.tanggal)}
                </td>

                <td>

                    <strong
                        style="
                        color:#704653;
                        font-weight:600;
                        ">

                        ${escapeHTML(
                            item.keterangan || "-"
                        )}

                    </strong>

                </td>

                <td>

                    <span class="badge badge-blue">

                        ${escapeHTML(
                            item.kategori || "-"
                        )}

                    </span>

                </td>

                <td>

                    ${escapeHTML(
                        item.metode || "Cash"
                    )}

                </td>

                <td class="text-end">

                    ${
                        pemasukan

                        ? `
                            <span class="badge badge-pemasukan">
                                + ${rupiah(nominal)}
                            </span>
                          `

                        : `
                            <span class="badge badge-pengeluaran">
                                - ${rupiah(nominal)}
                            </span>
                          `
                    }

                </td>

            </tr>

        `;

    });


    /* ---------------------------------------------
       TUTUP TABEL
    --------------------------------------------- */

    html += `

                </tbody>

            </table>

        </div>

    `;


    /* ---------------------------------------------
       MASUKKAN KE HALAMAN
    --------------------------------------------- */

    container.innerHTML = html;

}


/* =========================================================
   UPDATE DASHBOARD
   Bisa dipanggil dari halaman lain jika diperlukan
========================================================= */

function refreshDashboard() {

    financeData = loadData();

    tampilkanDashboard();

}