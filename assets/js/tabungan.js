/* =========================================================
   MY FINANCE
   TABUNGAN JAVASCRIPT
   Static Version - Tanpa PHP & Database
   ========================================================= */


let tabunganAktifId = null;


/* =========================================================
   SAAT HALAMAN DIBUKA
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    financeData = loadData();

    pastikanStrukturTabungan();

    isiTanggalMulai();

    isiTanggalSetoran();

    tampilkanRingkasanTabungan();

    tampilkanDaftarTabungan();

    pasangEventTabungan();

});


/* =========================================================
   PASTIKAN STRUKTUR DATA
========================================================= */

function pastikanStrukturTabungan() {

    if (!Array.isArray(financeData.tabungan)) {

        financeData.tabungan = [];

        commitData();

    }


    financeData.tabungan.forEach(function (item) {

        if (!Array.isArray(item.setoran)) {

            item.setoran = [];

        }

        if (!item.status) {

            item.status = "Aktif";

        }

    });

    commitData();

}


/* =========================================================
   EVENT
========================================================= */

function pasangEventTabungan() {

    const form =
        document.getElementById(
            "formTabungan"
        );

    if (form) {

        form.addEventListener(
            "submit",
            simpanTabungan
        );

    }

}


/* =========================================================
   TANGGAL HARI INI
========================================================= */

function tanggalHariIni() {

    const sekarang = new Date();

    const tahun =
        sekarang.getFullYear();

    const bulan =
        String(
            sekarang.getMonth() + 1
        ).padStart(2, "0");

    const hari =
        String(
            sekarang.getDate()
        ).padStart(2, "0");

    return `${tahun}-${bulan}-${hari}`;

}


/* =========================================================
   TANGGAL MULAI
========================================================= */

function isiTanggalMulai() {

    const input =
        document.getElementById(
            "tanggalMulai"
        );

    if (
        input &&
        !input.value
    ) {

        input.value =
            tanggalHariIni();

    }

}


/* =========================================================
   TANGGAL SETORAN
========================================================= */

function isiTanggalSetoran() {

    const input =
        document.getElementById(
            "setoranTanggal"
        );

    if (
        input &&
        !input.value
    ) {

        input.value =
            tanggalHariIni();

    }

}


/* =========================================================
   BUKA FORM
========================================================= */

function bukaFormTabungan() {

    const box =
        document.getElementById(
            "formTabunganBox"
        );

    if (!box) {
        return;
    }


    box.style.display =
        "block";


    box.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });


    setTimeout(function () {

        const nama =
            document.getElementById(
                "namaTabungan"
            );

        if (nama) {

            nama.focus();

        }

    }, 400);

}


/* =========================================================
   TUTUP FORM
========================================================= */

function tutupFormTabungan() {

    const box =
        document.getElementById(
            "formTabunganBox"
        );

    if (box) {

        box.style.display =
            "none";

    }


    resetFormTabungan();

}


/* =========================================================
   RESET FORM
========================================================= */

function resetFormTabungan() {

    const form =
        document.getElementById(
            "formTabungan"
        );

    if (form) {

        form.reset();

    }


    const editId =
        document.getElementById(
            "editTabunganId"
        );

    if (editId) {

        editId.value = "";

    }


    const judul =
        document.getElementById(
            "judulFormTabungan"
        );

    if (judul) {

        judul.textContent =
            "Tambah Target Tabungan";

    }


    const tombol =
        document.getElementById(
            "tombolTabunganText"
        );

    if (tombol) {

        tombol.textContent =
            "Simpan Tabungan";

    }


    isiTanggalMulai();

}


/* =========================================================
   SIMPAN TABUNGAN
========================================================= */

function simpanTabungan(event) {

    event.preventDefault();


    const nama =
        document.getElementById(
            "namaTabungan"
        ).value.trim();


    const target =
        Number(
            document.getElementById(
                "targetNominal"
            ).value
        );


    const tanggalMulai =
        document.getElementById(
            "tanggalMulai"
        ).value;


    const deadline =
        document.getElementById(
            "deadline"
        ).value;


    const deskripsi =
        document.getElementById(
            "deskripsi"
        ).value.trim();


    const editId =
        document.getElementById(
            "editTabunganId"
        ).value;


    /* ---------------------------------------------
       VALIDASI
    --------------------------------------------- */

    if (!nama) {

        alert(
            "Nama tabungan wajib diisi."
        );

        return;

    }


    if (!target || target <= 0) {

        alert(
            "Target nominal harus lebih dari 0."
        );

        return;

    }


    if (!tanggalMulai) {

        alert(
            "Tanggal mulai wajib diisi."
        );

        return;

    }


    if (
        deadline &&
        deadline < tanggalMulai
    ) {

        alert(
            "Deadline tidak boleh sebelum tanggal mulai."
        );

        return;

    }


    /* ---------------------------------------------
       EDIT
    --------------------------------------------- */

    if (editId) {

        const index =
            financeData.tabungan.findIndex(
                function (item) {

                    return Number(item.id) ===
                        Number(editId);

                }
            );


        if (index !== -1) {

            financeData.tabungan[index].nama_tabungan =
                nama;

            financeData.tabungan[index].target_nominal =
                target;

            financeData.tabungan[index].tanggal_mulai =
                tanggalMulai;

            financeData.tabungan[index].deadline =
                deadline;

            financeData.tabungan[index].deskripsi =
                deskripsi;


            /* Update status */

            const terkumpul =
                Number(
                    financeData.tabungan[index]
                        .nominal_terkumpul || 0
                );


            if (terkumpul >= target) {

                financeData.tabungan[index].status =
                    "Selesai";

            } else {

                financeData.tabungan[index].status =
                    "Aktif";

            }

        }

    }


    /* ---------------------------------------------
       TAMBAH
    --------------------------------------------- */

    else {

        const tabunganBaru = {

            id: generateId(),

            nama_tabungan: nama,

            target_nominal: target,

            nominal_terkumpul: 0,

            tanggal_mulai: tanggalMulai,

            deadline: deadline,

            deskripsi: deskripsi,

            status: "Aktif",

            setoran: []

        };


        financeData.tabungan.push(
            tabunganBaru
        );

    }


    /* ---------------------------------------------
       SIMPAN
    --------------------------------------------- */

    commitData();


    tampilkanRingkasanTabungan();

    tampilkanDaftarTabungan();


    /* ---------------------------------------------
       PESAN
    --------------------------------------------- */

    if (editId) {

        alert(
            "Target tabungan berhasil diperbarui. 💕"
        );

    } else {

        alert(
            "Target tabungan berhasil dibuat. 🎀"
        );

    }


    tutupFormTabungan();

}


/* =========================================================
   RINGKASAN
========================================================= */

function tampilkanRingkasanTabungan() {

    let totalTerkumpul = 0;

    let totalTarget = 0;


    financeData.tabungan.forEach(
        function (item) {

            totalTerkumpul +=
                Number(
                    item.nominal_terkumpul || 0
                );

            totalTarget +=
                Number(
                    item.target_nominal || 0
                );

        }
    );


    let progress = 0;


    if (totalTarget > 0) {

        progress =
            (
                totalTerkumpul /
                totalTarget
            ) * 100;

    }


    if (progress > 100) {

        progress = 100;

    }


    const terkumpul =
        document.getElementById(
            "totalTerkumpul"
        );

    if (terkumpul) {

        terkumpul.textContent =
            rupiah(totalTerkumpul);

    }


    const target =
        document.getElementById(
            "totalTarget"
        );

    if (target) {

        target.textContent =
            rupiah(totalTarget);

    }


    const progressElement =
        document.getElementById(
            "progressKeseluruhan"
        );

    if (progressElement) {

        progressElement.textContent =
            progress.toFixed(1) + "%";

    }


    const jumlah =
        document.getElementById(
            "jumlahTabungan"
        );

    if (jumlah) {

        jumlah.textContent =
            financeData.tabungan.length;

    }


    const badge =
        document.getElementById(
            "badgeJumlahTabungan"
        );

    if (badge) {

        badge.textContent =
            `${financeData.tabungan.length} target`;

    }

}


/* =========================================================
   DAFTAR TABUNGAN
========================================================= */

function tampilkanDaftarTabungan() {

    const container =
        document.getElementById(
            "daftarTabungan"
        );


    if (!container) {
        return;
    }


    if (
        !financeData.tabungan ||
        financeData.tabungan.length === 0
    ) {

        container.innerHTML = `

            <div class="col-12">

                <div class="empty-state">

                    <i class="bi bi-piggy-bank"></i>

                    <h5>
                        Belum ada target tabungan
                    </h5>

                    <p>
                        Yuk buat target tabungan
                        pertamamu.
                    </p>

                    <button
                        type="button"
                        class="btn btn-pink"
                        onclick="bukaFormTabungan()">

                        <i class="bi bi-plus-circle"></i>

                        Buat Target Tabungan

                    </button>

                </div>

            </div>

        `;

        return;

    }


    let html = "";


    financeData.tabungan.forEach(
        function (item) {

            const target =
                Number(
                    item.target_nominal || 0
                );


            const terkumpul =
                Number(
                    item.nominal_terkumpul || 0
                );


            let progress = 0;


            if (target > 0) {

                progress =
                    (
                        terkumpul /
                        target
                    ) * 100;

            }


            if (progress > 100) {

                progress = 100;

            }


            const sisa =
                Math.max(
                    target - terkumpul,
                    0
                );


            const selesai =
                progress >= 100;


            html += `

                <div class="col-lg-6">

                    <div class="saving-card">

                        <!-- HEADER -->

                        <div
                            class="d-flex
                                   justify-content-between
                                   align-items-start
                                   gap-2">

                            <div>

                                <h5>
                                    ${escapeHTML(
                                        item.nama_tabungan
                                    )}
                                </h5>

                                <div class="saving-target">

                                    Target
                                    ${rupiah(target)}

                                </div>

                            </div>


                            <span
                                class="badge
                                ${
                                    selesai
                                    ? "badge-pemasukan"
                                    : "badge-pink"
                                }">

                                ${
                                    selesai
                                    ? "Selesai"
                                    : "Aktif"
                                }

                            </span>

                        </div>


                        <!-- NOMINAL -->

                        <div class="saving-amount">

                            ${rupiah(terkumpul)}

                            <span
                                style="
                                color:#927b7b;
                                font-size:11px;
                                font-weight:500;
                                ">

                                /
                                ${rupiah(target)}

                            </span>

                        </div>


                        <!-- PROGRESS -->

                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="
                                width:${progress}%;
                                ">

                            </div>

                        </div>


                        <div class="progress-info">

                            <span>
                                ${progress.toFixed(1)}% tercapai
                            </span>

                            <span>
                                Sisa ${rupiah(sisa)}
                            </span>

                        </div>


                        <!-- INFO -->

                        <div
                            style="
                            margin-top:16px;
                            display:grid;
                            grid-template-columns:1fr 1fr;
                            gap:8px;
                            ">


                            <div
                                style="
                                background:#fff8f6;
                                padding:10px;
                                border-radius:10px;
                                ">

                                <small
                                    style="
                                    color:#927b7b;
                                    font-size:10px;
                                    ">

                                    Mulai

                                </small>

                                <strong
                                    style="
                                    display:block;
                                    margin-top:2px;
                                    color:#704653;
                                    font-size:11px;
                                    ">

                                    ${formatTanggal(
                                        item.tanggal_mulai
                                    )}

                                </strong>

                            </div>


                            <div
                                style="
                                background:#eaf5f8;
                                padding:10px;
                                border-radius:10px;
                                ">

                                <small
                                    style="
                                    color:#927b7b;
                                    font-size:10px;
                                    ">

                                    Deadline

                                </small>

                                <strong
                                    style="
                                    display:block;
                                    margin-top:2px;
                                    color:#5f8999;
                                    font-size:11px;
                                    ">

                                    ${
                                        item.deadline
                                        ? formatTanggal(
                                            item.deadline
                                          )
                                        : "Tidak ada"
                                    }

                                </strong>

                            </div>

                        </div>


                        <!-- ACTION -->

                        <div
                            class="d-flex
                                   gap-2
                                   mt-3">


                            <button
                                type="button"
                                class="btn btn-pink flex-grow-1"
                                onclick="lihatTabungan(${Number(item.id)})">

                                <i class="bi bi-eye"></i>

                                Detail

                            </button>


                            <button
                                type="button"
                                class="btn btn-blue btn-action"
                                onclick="editTabungan(${Number(item.id)})"
                                title="Edit">

                                <i class="bi bi-pencil"></i>

                            </button>


                            <button
                                type="button"
                                class="btn btn-danger-soft btn-action"
                                onclick="hapusTabungan(${Number(item.id)})"
                                title="Hapus">

                                <i class="bi bi-trash"></i>

                            </button>

                        </div>


                    </div>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


/* =========================================================
   EDIT TABUNGAN
========================================================= */

function editTabungan(id) {

    const item =
        financeData.tabungan.find(
            function (tabungan) {

                return Number(tabungan.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Data tabungan tidak ditemukan."
        );

        return;

    }


    bukaFormTabungan();


    document.getElementById(
        "editTabunganId"
    ).value =
        item.id;


    document.getElementById(
        "namaTabungan"
    ).value =
        item.nama_tabungan;


    document.getElementById(
        "targetNominal"
    ).value =
        item.target_nominal;


    document.getElementById(
        "tanggalMulai"
    ).value =
        item.tanggal_mulai;


    document.getElementById(
        "deadline"
    ).value =
        item.deadline || "";


    document.getElementById(
        "deskripsi"
    ).value =
        item.deskripsi || "";


    document.getElementById(
        "judulFormTabungan"
    ).textContent =
        "Edit Target Tabungan";


    document.getElementById(
        "tombolTabunganText"
    ).textContent =
        "Perbarui Tabungan";


    document.getElementById(
        "formTabunganBox"
    ).scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* =========================================================
   HAPUS TABUNGAN
========================================================= */

function hapusTabungan(id) {

    const item =
        financeData.tabungan.find(
            function (tabungan) {

                return Number(tabungan.id) ===
                    Number(id);

            }
        );


    if (!item) {
        return;
    }


    const yakin =
        confirm(
            `Yakin ingin menghapus tabungan "${item.nama_tabungan}" beserta seluruh riwayat setorannya?`
        );


    if (!yakin) {
        return;
    }


    financeData.tabungan =
        financeData.tabungan.filter(
            function (tabungan) {

                return Number(tabungan.id) !==
                    Number(id);

            }
        );


    commitData();


    tampilkanRingkasanTabungan();

    tampilkanDaftarTabungan();


    alert(
        "Tabungan berhasil dihapus."
    );

}


/* =========================================================
   LIHAT DETAIL
========================================================= */

function lihatTabungan(id) {

    const item =
        financeData.tabungan.find(
            function (tabungan) {

                return Number(tabungan.id) ===
                    Number(id);

            }
        );


    if (!item) {

        alert(
            "Data tabungan tidak ditemukan."
        );

        return;

    }


    tabunganAktifId =
        Number(id);


    document.getElementById(
        "modalTabunganTitle"
    ).textContent =
        item.nama_tabungan;


    document.getElementById(
        "modalTabunganSubtitle"
    ).textContent =
        item.deskripsi || "Detail target tabungan";


    const target =
        Number(
            item.target_nominal || 0
        );


    const terkumpul =
        Number(
            item.nominal_terkumpul || 0
        );


    let progress = 0;


    if (target > 0) {

        progress =
            (
                terkumpul /
                target
            ) * 100;

    }


    if (progress > 100) {

        progress = 100;

    }


    document.getElementById(
        "detailTarget"
    ).textContent =
        rupiah(target);


    document.getElementById(
        "detailTerkumpul"
    ).textContent =
        rupiah(terkumpul);


    document.getElementById(
        "detailProgress"
    ).textContent =
        progress.toFixed(1) + "%";


    document.getElementById(
        "detailProgressBar"
    ).style.width =
        progress + "%";


    tampilkanRiwayatSetoran(
        item
    );


    isiTanggalSetoran();


    document.getElementById(
        "setoranNominal"
    ).value = "";


    document.getElementById(
        "setoranKeterangan"
    ).value = "";


    const modalElement =
        document.getElementById(
            "modalTabungan"
        );


    const modal =
        new bootstrap.Modal(
            modalElement
        );


    modal.show();

}


/* =========================================================
   SIMPAN SETORAN
========================================================= */

function simpanSetoran() {

    if (
        tabunganAktifId === null
    ) {

        return;

    }


    const item =
        financeData.tabungan.find(
            function (tabungan) {

                return Number(tabungan.id) ===
                    Number(tabunganAktifId);

            }
        );


    if (!item) {

        alert(
            "Data tabungan tidak ditemukan."
        );

        return;

    }


    if (!Array.isArray(item.setoran)) {

        item.setoran = [];

    }


    const tanggal =
        document.getElementById(
            "setoranTanggal"
        ).value;


    const nominal =
        Number(
            document.getElementById(
                "setoranNominal"
            ).value
        );


    const keterangan =
        document.getElementById(
            "setoranKeterangan"
        ).value.trim();


    if (!tanggal) {

        alert(
            "Tanggal setoran wajib diisi."
        );

        return;

    }


    if (!nominal || nominal <= 0) {

        alert(
            "Nominal setoran harus lebih dari 0."
        );

        return;

    }


    /* ---------------------------------------------
       TAMBAHKAN SETORAN
    --------------------------------------------- */

    item.setoran.push({

        id: generateId(),

        tanggal: tanggal,

        nominal: nominal,

        keterangan:
            keterangan || "Setoran tabungan"

    });


    /* ---------------------------------------------
       HITUNG ULANG TOTAL
    --------------------------------------------- */

    item.nominal_terkumpul =
        item.setoran.reduce(
            function (total, setoran) {

                return total +
                    Number(
                        setoran.nominal || 0
                    );

            },

            0
        );


    /* ---------------------------------------------
       UPDATE STATUS
    --------------------------------------------- */

    if (
        item.nominal_terkumpul >=
        Number(item.target_nominal)
    ) {

        item.status =
            "Selesai";

    } else {

        item.status =
            "Aktif";

    }


    commitData();


    tampilkanRingkasanTabungan();

    tampilkanDaftarTabungan();

    lihatTabungan(tabunganAktifId);


    alert(
        "Setoran berhasil ditambahkan. 💰"
    );

}


/* =========================================================
   RIWAYAT SETORAN
========================================================= */

function tampilkanRiwayatSetoran(item) {

    const container =
        document.getElementById(
            "riwayatSetoran"
        );


    if (!container) {
        return;
    }


    const setoran =
        Array.isArray(item.setoran)
            ? [...item.setoran]
            : [];


    setoran.sort(function (a, b) {

        const tanggalA =
            new Date(
                a.tanggal + "T00:00:00"
            );


        const tanggalB =
            new Date(
                b.tanggal + "T00:00:00"
            );


        if (
            tanggalB.getTime() !==
            tanggalA.getTime()
        ) {

            return (
                tanggalB.getTime() -
                tanggalA.getTime()
            );

        }


        return (
            Number(b.id || 0) -
            Number(a.id || 0)
        );

    });


    if (setoran.length === 0) {

        container.innerHTML = `

            <div
                class="empty-state"
                style="padding:25px 10px;">

                <i
                    class="bi bi-wallet2"
                    style="font-size:30px;">
                </i>

                <h5>
                    Belum ada setoran
                </h5>

                <p>
                    Tambahkan setoran pertama
                    untuk target ini.
                </p>

            </div>

        `;

        return;

    }


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


    setoran.forEach(function (data) {

        html += `

            <tr>

                <td>
                    ${formatTanggal(data.tanggal)}
                </td>

                <td>
                    ${escapeHTML(
                        data.keterangan ||
                        "Setoran tabungan"
                    )}
                </td>

                <td class="text-end">

                    <strong
                        style="color:#6f9d83;">

                        + ${rupiah(
                            data.nominal
                        )}

                    </strong>

                </td>

                <td class="text-center">

                    <button
                        type="button"
                        class="btn btn-danger-soft btn-action"
                        onclick="hapusSetoran(${Number(data.id)})"
                        title="Hapus Setoran">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });


    html += `

                </tbody>

            </table>

        </div>

    `;


    container.innerHTML =
        html;

}


/* =========================================================
   HAPUS SETORAN
========================================================= */

function hapusSetoran(id) {

    if (
        tabunganAktifId === null
    ) {

        return;

    }


    const item =
        financeData.tabungan.find(
            function (tabungan) {

                return Number(tabungan.id) ===
                    Number(tabunganAktifId);

            }
        );


    if (!item) {
        return;
    }


    const setoran =
        item.setoran.find(
            function (data) {

                return Number(data.id) ===
                    Number(id);

            }
        );


    if (!setoran) {
        return;
    }


    const yakin =
        confirm(
            `Hapus setoran ${rupiah(setoran.nominal)}?`
        );


    if (!yakin) {
        return;
    }


    item.setoran =
        item.setoran.filter(
            function (data) {

                return Number(data.id) !==
                    Number(id);

            }
        );


    /* ---------------------------------------------
       HITUNG ULANG
    --------------------------------------------- */

    item.nominal_terkumpul =
        item.setoran.reduce(
            function (total, data) {

                return total +
                    Number(
                        data.nominal || 0
                    );

            },

            0
        );


    /* ---------------------------------------------
       STATUS
    --------------------------------------------- */

    if (
        item.nominal_terkumpul >=
        Number(item.target_nominal)
    ) {

        item.status =
            "Selesai";

    } else {

        item.status =
            "Aktif";

    }


    commitData();


    tampilkanRingkasanTabungan();

    tampilkanDaftarTabungan();

    lihatTabungan(
        tabunganAktifId
    );


    alert(
        "Setoran berhasil dihapus."
    );

}