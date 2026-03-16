import { globalSave } from './database.js';
import { utils } from './utils.js';

// Ambil data pelanggan dari LocalStorage
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

/**
 * Render utama untuk modul CRM
 */
export function renderCRM() {
    const table = document.getElementById('crm-table-body');
    if(!table) return;

    if (clients.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-gray-300 font-bold uppercase text-xs">Tiada data pelanggan</td></tr>`;
        return;
    }

    const searchTerm = document.getElementById('crm-search')?.value.toLowerCase() || '';

    // Filter data berdasarkan carian
    const filteredClients = clients.filter(c => 
        c.name.toLowerCase().includes(searchTerm) || 
        c.phone.includes(searchTerm)
    );

    table.innerHTML = filteredClients.map((c, index) => `
        <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
            <td class="p-6">
                <p class="font-bold text-gray-800">${utils.truncateText(c.name, 25)}</p>
                <p class="text-[10px] font-black text-blue-500 tracking-widest">${c.phone}</p>
            </td>
            <td class="p-6">
                <span class="text-[10px] font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500 uppercase tracking-tighter">${c.category}</span>
            </td>
            <td class="p-6">
                <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span class="text-[10px] font-black text-emerald-600 uppercase">Aktif</span>
                </div>
            </td>
            <td class="p-6 text-right">
                <button onclick="deleteClient(${index})" class="w-8 h-8 rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Fungsi Carian (Dipanggil dari oninput)
 */
window.searchClient = () => {
    renderCRM();
};

/**
 * Simpan Pelanggan Baru
 */
window.saveNewClient = () => {
    const nameInput = document.getElementById('cli-name');
    const phoneInput = document.getElementById('cli-phone');
    const categoryInput = document.getElementById('cli-cat');

    if (!nameInput.value || !phoneInput.value) {
        alert("Sila masukkan nama dan nombor telefon.");
        return;
    }

    // Gunakan utils.cleanPhone untuk bersihkan input nombor telefon
    const cleanedPhone = utils.cleanPhone(phoneInput.value);

    const newClient = { 
        id: utils.generateID('CLI'), // Gunakan utils untuk ID unik
        name: nameInput.value, 
        phone: cleanedPhone, 
        category: categoryInput.value,
        createdAt: new Date().toISOString()
    };

    clients.push(newClient);

    // Simpan ke LocalStorage & Firebase Cloud
    globalSave({ clients: clients });

    // Refresh UI & Tutup Modal
    renderCRM();
    closeCrmModal();

    // Kosongkan form
    nameInput.value = '';
    phoneInput.value = '';
};

/**
 * Padam Pelanggan
 */
window.deleteClient = (index) => {
    if (confirm("Adakah anda pasti mahu memadam pelanggan ini?")) {
        clients.splice(index, 1);
        globalSave({ clients: clients });
        renderCRM();
    }
};

// Fungsi Kontrol Modal
window.openCrmModal = () => document.getElementById('crm-modal').classList.remove('hidden');
window.closeCrmModal = () => document.getElementById('crm-modal').classList.add('hidden');
