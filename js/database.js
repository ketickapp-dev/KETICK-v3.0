import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// 1. Tarik konfigurasi dari Setup Wizard
const config = JSON.parse(localStorage.getItem('ketick_config'));

if (!config) {
    console.warn("Konfigurasi Firebase tidak dijumpai. Sila jalankan setup.html");
    if (window.location.pathname.includes('index.html')) {
        window.location.href = 'setup.html';
    }
}

// 2. Initialize Firebase
const app = initializeApp(config);
const db = getFirestore(app);

/**
 * Mendapatkan UID pengguna yang sedang login
 */
const getClientId = () => {
    const uid = localStorage.getItem('ketick_uid');
    if (!uid) {
        // Jika tiada UID, bermakna belum login
        if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('setup.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    return uid;
};

/**
 * Fungsi Sinkronisasi ke Cloud
 */
export async function syncToCloud(collectionName, data) {
    const uid = getClientId();
    if (!uid) return;

    try {
        const docRef = doc(db, collectionName, uid);
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
 * Fungsi Ambil Data dari Cloud
 */
export async function fetchFromCloud(collectionName) {
    const uid = getClientId();
    if (!uid) return null;

    try {
        const docRef = doc(db, collectionName, uid);
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
 * Global Save & Sync (Sesuai untuk Mobile/Acode)
 */
export function globalSave(dataObject) {
    Object.keys(dataObject).forEach(key => {
        // Simpan Offline
        localStorage.setItem(`f6_${key}`, JSON.stringify(dataObject[key]));
        // Simpan Online
        syncToCloud(key, dataObject[key]);
    });
}
