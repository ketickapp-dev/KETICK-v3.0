// Data Global (Sepatutnya ditarik dari localStorage/Cloud)
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

function renderCRM() {
    const table = document.getElementById('crm-table-body');
    table.innerHTML = clients.map((c, index) => `
        <tr class="border-b border-gray-50 hover:bg-gray-50 transition">
            <td class="p-6">
                <p class="font-bold text-gray-800">${c.name}</p>
                <p class="text-xs text-gray-400">${c.phone}</p>
            </td>
            <td class="p-6">
                <span class="text-[10px] font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500 uppercase">${c.category}</span>
            </td>
            <td class="p-6">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span class="text-xs font-bold text-emerald-600">Aktif</span>
                </div>
            </td>
            <td class="p-6 text-right">
                <button onclick="deleteClient(${index})" class="text-gray-300 hover:text-red-500 transition">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function saveNewClient() {
    const name = document.getElementById('cli-name').value;
    const phone = document.getElementById('cli-phone').value;
    const category = document.getElementById('cli-cat').value;

    if (!name || !phone) return alert("Sila lengkapkan maklumat.");

    const newClient = { name, phone, category, id: Date.now() };
    clients.push(newClient);

    // Guna fungsi globalSave dari database.js untuk Sync ke Cloud
    import('./database.js').then(db => {
        db.globalSave({ clients: clients });
        renderCRM();
        closeCrmModal();
    });
}

// Fungsi Modal
window.openCrmModal = () => document.getElementById('crm-modal').classList.remove('hidden');
window.closeCrmModal = () => document.getElementById('crm-modal').classList.add('hidden');
