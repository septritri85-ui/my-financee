/* =====================================================
   MY FINANCE
   PROFILE
   Tanpa PHP & Database
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    financeData = loadData();

    tampilkanProfil();

    pasangEvent();

});


/* =====================================================
   TAMPILKAN PROFIL
   ===================================================== */

function tampilkanProfil() {

    const profile = financeData.profile || {};

    const nama = profile.nama || "Pengguna";
    const username = profile.username || "pengguna";
    const foto = profile.foto || "";


    /* ===============================
       INPUT
       =============================== */

    const inputNama = document.getElementById("namaProfile");
    const inputUsername = document.getElementById("usernameProfile");

    if (inputNama) {
        inputNama.value = nama;
    }

    if (inputUsername) {
        inputUsername.value = username;
    }


    /* ===============================
       HEADER
       =============================== */

    const namaHeader = document.getElementById("profileNamaHeader");
    const usernameHeader = document.getElementById("profileUsernameHeader");

    if (namaHeader) {
        namaHeader.textContent = nama;
    }

    if (usernameHeader) {
        usernameHeader.textContent = "@" + username;
    }


    /* ===============================
       FOTO
       =============================== */

    tampilkanFoto(foto);

}


/* =====================================================
   TAMPILKAN FOTO
   ===================================================== */

function tampilkanFoto(foto) {

    const container = document.getElementById("photoDisplay");

    if (!container) return;


    if (foto) {

        container.innerHTML = `
            <img
                src="${foto}"
                alt="Foto Profil"
                class="profile-photo"
            >
        `;

    } else {

        container.innerHTML = `
            <div class="profile-photo-placeholder">
                <i class="bi bi-person-fill"></i>
            </div>
        `;

    }

}


/* =====================================================
   EVENT
   ===================================================== */

function pasangEvent() {

    const formProfile = document.getElementById("formProfile");

    const fileFoto = document.getElementById("fileFoto");

    const btnHapusFoto = document.getElementById("btnHapusFoto");

    const btnHapusSemuaData =
        document.getElementById("btnHapusSemuaData");


    /* ===============================
       SIMPAN PROFIL
       =============================== */

    if (formProfile) {

        formProfile.addEventListener("submit", function (e) {

            e.preventDefault();


            const nama =
                document.getElementById("namaProfile")
                .value
                .trim();

            const username =
                document.getElementById("usernameProfile")
                .value
                .trim();


            if (!nama) {

                tampilkanToast(
                    "Nama lengkap belum diisi."
                );

                return;
            }


            if (!username) {

                tampilkanToast(
                    "Username belum diisi."
                );

                return;
            }


            financeData.profile.nama = nama;

            financeData.profile.username = username;


            commitData();


            tampilkanProfil();


            tampilkanToast(
                "Profil berhasil diperbarui 💕"
            );

        });

    }


    /* ===============================
       PILIH FOTO
       =============================== */

    if (fileFoto) {

        fileFoto.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;


            /* ===============================
               CEK FILE
               =============================== */

            if (!file.type.startsWith("image/")) {

                tampilkanToast(
                    "File yang dipilih harus berupa gambar."
                );

                this.value = "";

                return;
            }


            /* ===============================
               BATAS UKURAN
               =============================== */

            if (file.size > 5 * 1024 * 1024) {

                tampilkanToast(
                    "Ukuran foto maksimal 5 MB."
                );

                this.value = "";

                return;
            }


            const reader = new FileReader();


            reader.onload = function (event) {

                const image = new Image();


                image.onload = function () {

                    kompresFoto(image);

                };


                image.src = event.target.result;

            };


            reader.readAsDataURL(file);

        });

    }


    /* ===============================
       HAPUS FOTO
       =============================== */

    if (btnHapusFoto) {

        btnHapusFoto.addEventListener(
            "click",
            function () {

                const fotoAda =
                    financeData.profile &&
                    financeData.profile.foto;


                if (!fotoAda) {

                    tampilkanToast(
                        "Belum ada foto profil."
                    );

                    return;
                }


                const yakin = confirm(
                    "Yakin ingin menghapus foto profil?"
                );


                if (!yakin) return;


                financeData.profile.foto = "";


                commitData();


                tampilkanProfil();


                const fileInput =
                    document.getElementById("fileFoto");

                if (fileInput) {
                    fileInput.value = "";
                }


                const previewContainer =
                    document.getElementById(
                        "previewContainer"
                    );

                if (previewContainer) {
                    previewContainer.style.display = "none";
                }


                tampilkanToast(
                    "Foto profil berhasil dihapus."
                );

            }
        );

    }


    /* ===============================
       HAPUS SEMUA DATA
       =============================== */

    if (btnHapusSemuaData) {

        btnHapusSemuaData.addEventListener(
            "click",
            function () {

                const yakin = confirm(
                    "PERINGATAN!\n\n" +
                    "Semua transaksi, tabungan, kategori, " +
                    "dan data profil akan dihapus dari browser ini.\n\n" +
                    "Apakah kamu benar-benar yakin?"
                );


                if (!yakin) return;


                localStorage.removeItem(
                    "myFinanceData"
                );


                alert(
                    "Semua data My Finance berhasil dihapus."
                );


                window.location.href =
                    "dashboard.html";

            }
        );

    }

}


/* =====================================================
   KOMPRES FOTO
   ===================================================== */

function kompresFoto(image) {

    const MAX_SIZE = 600;


    let width = image.width;
    let height = image.height;


    /* ===============================
       RESIZE
       =============================== */

    if (width > height) {

        if (width > MAX_SIZE) {

            height =
                Math.round(
                    height *
                    (MAX_SIZE / width)
                );

            width = MAX_SIZE;

        }

    } else {

        if (height > MAX_SIZE) {

            width =
                Math.round(
                    width *
                    (MAX_SIZE / height)
                );

            height = MAX_SIZE;

        }

    }


    /* ===============================
       CANVAS
       =============================== */

    const canvas =
        document.createElement("canvas");


    canvas.width = width;

    canvas.height = height;


    const ctx =
        canvas.getContext("2d");


    ctx.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    /* ===============================
       JADI JPEG
       =============================== */

    const hasil =
        canvas.toDataURL(
            "image/jpeg",
            0.78
        );


    /* ===============================
       SIMPAN
       =============================== */

    financeData.profile.foto = hasil;


    commitData();


    tampilkanProfil();


    /* ===============================
       PREVIEW
       =============================== */

    const preview =
        document.getElementById(
            "previewFoto"
        );

    const previewContainer =
        document.getElementById(
            "previewContainer"
        );


    if (preview) {

        preview.src = hasil;

    }


    if (previewContainer) {

        previewContainer.style.display =
            "block";

    }


    tampilkanToast(
        "Foto profil berhasil diperbarui 💕"
    );

}


/* =====================================================
   TOAST
   ===================================================== */

function tampilkanToast(pesan) {

    const toastElement =
        document.getElementById(
            "profileToast"
        );

    const messageElement =
        document.getElementById(
            "profileToastMessage"
        );


    if (!toastElement || !messageElement) {

        alert(pesan);

        return;
    }


    messageElement.textContent = pesan;


    const toast =
        bootstrap.Toast.getOrCreateInstance(
            toastElement,
            {
                delay: 2500
            }
        );


    toast.show();

}