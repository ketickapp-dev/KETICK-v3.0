import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

// Ambil config dari LocalStorage (Setup Wizard)
const config = JSON.parse(localStorage.getItem('ketick_config'));
const app = initializeApp(config);
const auth = getAuth(app);

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
 * Pantau Status Login (Guna di index.html)
 */
export function checkAuthStatus() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Jika tidak login, tendang ke login.html
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        } else {
            // Simpan UID untuk kegunaan sync data
            localStorage.setItem('ketick_uid', user.uid);
        }
    });
}

/**
 * Log Keluar
 */
export async function logoutUser() {
    await signOut(auth);
    localStorage.removeItem('ketick_uid');
    window.location.href = 'login.html';
}
