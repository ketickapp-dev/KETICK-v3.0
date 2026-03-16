# KETICK-v3.0
/ketick-os
├── /assets          (Imej, Logo, Ikon)
├── /css             (Gaya visual)
│   └── styles.css
├── /js              (Logik Sistem)
│   ├── auth.js      (Firebase Auth & Setup Wizard)
│   ├── database.js  (Firebase Firestore CRUD)
│   ├── ui.js        (Render Dashboard, Tables, Modal)
│   ├── billing.js   (Penjana PDF & Tax Logic)
│   └── main.js      (Inisialisasi & Navigation)
├── /modules         (Sub-folder untuk fungsi spesifik)
│   ├── inventory.html
│   ├── crm.html
│   └── billing.html
├── index.html       (Main Shell / Dashboard)
└── setup.html       (Setup Wizard untuk API)

Cara Guna Dalam Fail main.js atau Modul Lain
​Anda hanya perlu import fungsi globalSave ini setiap kali ada perubahan data. Contohnya dalam fungsi tambah stok:
import { globalSave } from './database.js';

function addInventoryItem() {
    db.inv.push({ id: Date.now(), name: 'Produk Baru', jual: 0 });
    
    // Gantikan save() lama dengan globalSave
    globalSave({ inv: db.inv }); 
    
    renderInventory();
}

# ⚡ KETICK OS - Flux Edition v1.0
**Sistem Pengurusan Perniagaan Modular (CRM, Billing, Inventory & Tax)**

KETICK OS adalah sistem pengurusan perniagaan berasaskan web yang direka khas untuk usahawan moden. Ia ringan, pantas, dan boleh diuruskan sepenuhnya hanya melalui telefon bimbit.

---

## 🚀 Ciri-Ciri Utama
* **CRM Database**: Urus pangkalan data pelanggan dengan sistem kategori (VIP, Corporate, Personal).
* **Smart Billing**: Jana invois profesional dan pantau status bayaran secara real-time.
* **Inventory Control**: Kawalan stok dengan sistem *Low Stock Alert*.
* **LHDN Tax Assistant**: Anggaran cukai pendapatan perniagaan secara automatik (Self-Assessment).
* **Social AutoHub**: Jadualkan konten pemasaran ke pelbagai platform media sosial.
* **Smart Blast**: Hantar mesej pukal personalisasi ke WhatsApp/Telegram pelanggan.

---

## 🛠️ Cara Pemasangan (Setup Wizard)

Sistem ini menggunakan **Firebase** sebagai pangkalan data awan (Cloud Sync). Ikuti langkah mudah ini:

1.  **Cipta Projek Firebase**:
    * Pergi ke [Firebase Console](https://console.firebase.google.com/).
    * Cipta projek baru (Contoh: `My-Business-OS`).
    * Aktifkan **Firestore Database** dan **Authentication** (Email/Password).

2.  **Dapatkan API Key**:
    * Pergi ke *Project Settings* (Ikon gear).
    * Cipta aplikasi web (`</>`) dan salin maklumat `apiKey`, `authDomain`, `projectId`, dan `storageBucket`.

3.  **Aktifkan Sistem**:
    * Buka URL KETICK OS anda.
    * Sistem akan membawa anda ke halaman **Setup Wizard**.
    * Masukkan maklumat API yang disalin tadi dan klik **"Aktifkan Sistem"**.

---

## 🛡️ Keselamatan Data
Semua data anda disimpan secara peribadi dalam akaun Firebase anda sendiri. Pemilik kod (developer) tidak mempunyai akses kepada data pelanggan atau kewangan anda. Sila pastikan **Security Rules** di Firebase Console anda telah dikonfigurasi seperti yang disarankan dalam dokumentasi teknikal.

---

## 📱 Keserasian Mobile
KETICK OS dioptimumkan sepenuhnya untuk penggunaan mudah alih. Anda boleh menambah sistem ini ke skrin utama telefon anda (*Add to Home Screen*) untuk pengalaman seperti aplikasi native.

---

## ⚖️ Lesen & Hak Cipta
© 2026 KETICK OS. Hak Cipta Terpelihara.
*Produk ini adalah sistem perisian untuk kegunaan perniagaan. Sebarang pengedaran semula kod tanpa izin adalah dilarang.*

