import { globalSave } from './database.js';
import { utils } from './utils.js';

let billings = JSON.parse(localStorage.getItem('ketick_billings')) || [];
let inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

export function renderBilling() {
    const table = document.getElementById('billing-table-body');
    const productSelect = document.getElementById('bill-product-select');
    const clientSelect = document.getElementById('bill-client-select');
    
    if(!table) return;

    // Refresh data dari storage
    inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];
    clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

    // 1. Load Produk
    if(productSelect) {
        productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>' + 
            inventory.map(item => `<option value="${item.sku}">${item.name} (Baki: ${item.stock})</option>`).join('');
    }

    // 2. Load Pelanggan dari CRM
    if(clientSelect) {
        if(clients.length === 0) {
            clientSelect.innerHTML = '<option value="">Tiada Data CRM</option>';
        } else {
            clientSelect.innerHTML = '<option value="">-- Pilih Pelanggan CRM --</option>' +
                clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
        }
    }

    // 3. Render Jadual
    if (billings.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="p-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">Tiada rekod billing</td></tr>`;
    } else {
        table.innerHTML = billings.map((bill, index) => {
            const theme = getBillTheme(bill.type);
            return `
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td class="p-6 font-bold text-xs text-gray-400">#${bill.no}</td>
                <td class="p-6">
                    <p class="font-bold text-sm text-gray-800">${bill.client}</p>
                    <p class="text-[9px] text-gray-400 font-medium">${bill.date}</p>
                </td>
                <td class="p-6 font-black text-sm text-gray-700">${utils.formatRM(bill.total)}</td>
                <td class="p-6">
                    <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase ${theme.bg} ${theme.text}">
                        ${bill.type}
                    </span>
                </td>
                <td class="p-6 text-right">
                    <button onclick="printBill(${index})" class="w-8 h-8 rounded-full bg-gray-50 text-blue-500 hover:bg-blue-600 hover:text-white transition-all active:scale-90">
                        <i class="fas fa-print text-[10px]"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');
    }
    updateBillingSummary();
}

window.saveBilling = () => {
    const type = document.getElementById('bill-type').value;
    const client = document.getElementById('bill-client-select').value;
    const sku = document.getElementById('bill-product-select').value;
    const qty = parseInt(document.getElementById('bill-qty').value);
    const price = parseFloat(document.getElementById('bill-price').value);

    if (!client || !sku || !qty || !price) {
        alert("Ralat: Sila pastikan Pelanggan, Produk, Kuantiti dan Harga telah diisi.");
        return;
    }

    // Tolak stok jika Resit
    if (type === 'Receipt') {
        const itemIdx = inventory.findIndex(i => i.sku === sku);
        if (itemIdx > -1) {
            if (inventory[itemIdx].stock < qty) return alert("Stok tidak cukup!");
            inventory[itemIdx].stock -= qty;
            localStorage.setItem('ketick_inventory', JSON.stringify(inventory));
        }
    }

    const newBill = {
        no: (type[0] + Date.now().toString().slice(-6)).toUpperCase(),
        type, client, sku, qty, price,
        total: qty * price,
        date: new Date().toLocaleDateString('ms-MY')
    };

    billings.unshift(newBill);
    localStorage.setItem('ketick_billings', JSON.stringify(billings));
    
    // Simpan ke cloud
    globalSave({ billings, inventory });
    
    renderBilling();
    toggleBillingModal(false);
    alert("Berjaya! Dokumen telah disimpan.");
};

window.autoFillPrice = () => {
    const sku = document.getElementById('bill-product-select').value;
    const item = inventory.find(i => i.sku === sku);
    if(item) document.getElementById('bill-price').value = item.price;
};

function updateBillingSummary() {
    const totalPaid = billings.filter(b => b.type === 'Receipt').reduce((s, b) => s + b.total, 0);
    const totalPending = billings.filter(b => b.type === 'Invoice').reduce((s, b) => s + b.total, 0);
    
    if(document.getElementById('bill-total-paid')) document.getElementById('bill-total-paid').innerText = utils.formatRM(totalPaid);
    if(document.getElementById('bill-total-pending')) document.getElementById('bill-total-pending').innerText = utils.formatRM(totalPending);
    if(document.getElementById('bill-count')) document.getElementById('bill-count').innerText = billings.length;
}

function getBillTheme(type) {
    if(type === 'Quotation') return { bg: 'bg-blue-50', text: 'text-blue-600', color: '#2563eb', label: 'SEBUT HARGA' };
    if(type === 'Invoice') return { bg: 'bg-orange-50', text: 'text-orange-600', color: '#ea580c', label: 'INVOIS' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-600', color: '#10b981', label: 'RESIT RASMI' };
}

window.toggleBillingModal = (show) => {
    const modal = document.getElementById('billing-modal');
    const content = document.getElementById('bill-modal-content');
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => content.classList.remove('translate-x-full'), 10);
        renderBilling(); 
    } else {
        content.classList.add('translate-x-full');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
};

// ... Fungsi printBill dikekalkan sama ...
