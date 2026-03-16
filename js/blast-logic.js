import { utils } from './utils.js';

// Ambil data pelanggan dari LocalStorage
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

/**
 * Render utama untuk modul Smart Blast
 */
export function renderBlast() {
    const listContainer = document.getElementById('blast-client-list');
    if(!listContainer) return;

    // Paparkan jumlah penerima di header
    const headerTitle = document.querySelector('#blast-section h4');
    if(headerTitle) headerTitle.innerText = `Penerima dari CRM (${clients.length})`;

    if (clients.length === 0) {
        listContainer.innerHTML = `
            <div class="p-20 text-center text-gray-300 font-bold text-xs tracking-widest uppercase">
                <i class="fas fa-users-slash text-3xl mb-4 block"></i>
                Sila tambah pelanggan di CRM dahulu
            </div>`;
        return;
    }

    listContainer.innerHTML = clients.map((c, index) => `
        <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                    ${c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <p class="font-bold text-gray-800 text-sm">${utils.truncateText(c.name, 15)}</p>
                    <p class="text-[10px] text-gray-400 font-black tracking-widest">${c.phone}</p>
                </div>
            </div>
            <div id="status-${index}">
                <button onclick="sendSingleBlast(${index})" class="bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white p-3 rounded-2xl transition-all active:scale-90">
                    <i class="fab fa-whatsapp text-xl"></i>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * Fungsi penghantaran mesej individu (Semi-Auto)
 */
window.sendSingleBlast = (index) => {
    const client = clients[index];
    const rawMsg = document.getElementById('blast-msg').value;
    const platform = document.getElementById('blast-platform').value;

    if(!rawMsg) {
        alert("Sila tulis kandungan mesej terlebih dahulu.");
        return;
    }

    // Personalisasi Nama: Gantikan [NAMA] dengan nama pelanggan
    const personalizedMsg = rawMsg.replace(/\[NAMA\]/g, client.name);
    const encodedMsg = encodeURIComponent(personalizedMsg);
    
    let url = "";

    if(platform === 'wa') {
        // Gunakan utils untuk bersihkan nombor (buang +, space, -)
        const cleanNumber = utils.cleanPhone(client.phone);
        // Pastikan nombor bermula dengan kod negara 60
        const finalPhone = cleanNumber.startsWith('6') ? cleanNumber : `6${cleanNumber}`;
        url = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodedMsg}`;
    } else {
        // Format untuk Telegram Direct
        url = `https://t.me/share/url?url=${window.location.origin}&text=${encodedMsg}`;
    }

    // Buka tetingkap baru untuk menghantar
    window.open(url, '_blank');
    
    // Kemaskini UI status kepada 'Telah Dihantar'
    const statusEl = document.getElementById(`status-${index}`);
    statusEl.innerHTML = `
        <div class="flex items-center gap-2 text-emerald-500 font-bold text-[10px]">
            <i class="fas fa-check-double animate-bounce"></i> DIHANTAR
        </div>`;
};

/**
 * Makluman sebelum memulakan Blast
 */
window.startBlast = () => {
    const msg = document.getElementById('blast-msg').value;
    if(!msg) return alert("Sila sediakan mesej dahulu.");
    
    alert("Smart Blast KETICK: Sila klik ikon WhatsApp pada setiap pelanggan untuk menghantar. Cara ini paling selamat untuk mengelakkan nombor anda di-spam/ban oleh WhatsApp.");
};
