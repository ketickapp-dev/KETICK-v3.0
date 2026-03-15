import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 1. Tarik konfigurasi dari Setup Wizard
const config = JSON.parse(localStorage.getItem('ketick_config'));

if (!config) {
    console.warn("Konfigurasi Firebase tidak dijumpai. Sila jalankan setup.html");
    // Jika tiada config, halakan pengguna ke setup
    if (window.location.pathname.includes('index.html')) {
        window.location.href = 'setup.html';
    }
}

// 2. Initialize Firebase
const app = initializeApp(config);
const db = getFirestore(app);

// Guna ID unik peranti jika belum ada Auth
const getClientId = () => {
    let id = localStorage.getItem('ketick_device_id');
    if (!id) {
        id = 'device_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ketick_device_id', id);
    }
    return id;
};

/**
 * Fungsi Sinkronisasi ke Cloud
 * @param {string} collectionName - Nama kategori (inv, cli, hist, dsb)
 * @param {object} data - Data yang hendak disimpan
 */
export async function syncToCloud(collectionName, data) {
    try {
        const docRef = doc(db, collectionName, getClientId());
        await setDoc(docRef, { 
            payload: data,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log(`Cloud Sync: ${collectionName} berjaya.`);
    } catch (error) {
        console.error("Ralat Cloud Sync:", error);
    }
}

/**
 * Fungsi Ambil Data dari Cloud (Masa Pertama Kali Load)
 * @param {string} collectionName 
 */
export async function fetchFromCloud(collectionName) {
    try {
        const docRef = doc(db, collectionName, getClientId());
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data().payload;
        }
        return null;
    } catch (error) {
        console.error("Ralat Ambil Data:", error);
        return null;
    }
}

/**
 * Global Save & Sync
 * Gantikan fungsi save() lama anda dengan ini
 */
export function globalSave(dataObject) {
    // 1. Simpan ke LocalStorage (Offline First)
    Object.keys(dataObject).forEach(key => {
        localStorage.setItem(`f6_${key}`, JSON.stringify(dataObject[key]));
        
        // 2. Sync ke Firebase (Background)
        syncToCloud(key, dataObject[key]);
    });
}
