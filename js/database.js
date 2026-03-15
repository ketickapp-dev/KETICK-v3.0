import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = JSON.parse(localStorage.getItem('ketick_config'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fungsi untuk Simpan Data ke Cloud
async function syncToCloud(collection, data) {
    const userId = "USER_ID_DARI_AUTH"; 
    await setDoc(doc(db, collection, userId), { data: data });
}
