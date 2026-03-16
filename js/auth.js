import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

// Ambil config dari LocalStorage (Setup Wizard)
const configData = JSON.parse(localStorage.getItem('ketick_config'));

let auth;

// Pastikan app hanya di-initialize jika config wujud
if (configData) {
    const app = initializeApp(configData);
    auth = getAuth(app);
}

/**
 * Pendaftaran Pengguna Baru
 */
export async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Daftar berjaya:", userCredential.user);
        window.location.href = 'index.html';
    } catch (error) {
        alert("Ralat Daftar: " + error.message);
    }
}

/**
 * Log Masuk Pengguna
 */
export async function loginUser(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html';
    } catch (error) {
        alert("Ralat Log Masuk: " + error.message);
    }
}

/**
 * Pantau Status Login & Konfigurasi (Guna di index.html)
 */
export function checkAuthStatus() {
    // 1. Jika config tiada, hantar ke Setup
    if (!configData) {
        window.location.href = 'setup.html';
        return;
    }

    // 2. Pantau sesi Firebase
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Jika tidak login, tendang ke login.html
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        } else {
            // Simpan UID untuk kegunaan database sync
            localStorage.setItem('ketick_uid', user.uid);
            console.log("Sesi Aktif:", user.email);
        }
    });
}

/**
 * Log Keluar
 */
export async function logoutUser() {
    try {
        await signOut(auth);
        localStorage.removeItem('ketick_uid');
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Gagal Logout:", error);
    }
}
