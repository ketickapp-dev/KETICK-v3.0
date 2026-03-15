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


