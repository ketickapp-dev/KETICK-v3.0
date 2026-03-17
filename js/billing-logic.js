// js/billing-logic.js
import { globalSave } from './database.js';
import { utils } from './utils.js';

// Ambil data dari LocalStorage dengan kunci konsisten
let billings = JSON.parse(localStorage.getItem('ketick_billings')) || [];
let inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

/**
 * Render utama untuk modul Billing
 */
export function renderBilling() {
    const table = document.getElementById('billing-table-body');
    const productSelect = document.getElementById('bill-product-select');
    const clientSelect = document.getElementById('bill-client-select');
    
    if(!table) return;

    // 1. Kemaskini Dropdown Produk (Dari Inventori)
    if(productSelect) {
        productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>' + 
            inventory.map(item => `<option value="${item.sku}">${item.name} (Stok: ${item.stock})</option>`).join('');
    }

    // 2. Kemaskini Dropdown Pelanggan (Dari CRM)
    if(clientSelect) {
        clientSelect.innerHTML = '<option value="">-- Pilih Pelanggan --</option>' +
            clients.map(c => `<option value="${c.name}">${c.name} (${c.phone})</option>`).join('');
    }

    // 3. Render Jadual Billing
    if (billings.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="p-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">Tiada rekod billing buat masa ini</td></tr>`;
    } else {
        table.innerHTML = billings.map((bill, index) => {
            const theme = getBillTheme(bill.type);
            return `
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition group">
                <td class="p-6">
                    <p class="font-bold text-xs text-gray-400">#${bill.no}</p>
                </td>
                <td class="p-6">
                    <p class="font-bold text-sm text-gray-800">${bill.client}</p>
                    <p class="text-[9px] text-gray-400 font-medium">${bill.date}</p>
                </td>
                <td class="p-6 font-black text-sm text-gray-700">
                    ${utils.formatRM(bill.total)}
                </td>
                <td class="p-6">
                    <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase ${theme.bg} ${theme.text}">
                        ${bill.type}
                    </span>
                </td>
                <td class="p-6 text-right">
                    <button onclick="printBill(${index})" class="w-8 h-8 rounded-full bg-gray-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-90">
                        <i class="fas fa-print text-[10px]"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');
    }

    updateBillingSummary();
}

/**
 * Statistik & Ringkasan
 */
function updateBillingSummary() {
    const totalPaid = billings
        .filter(b => b.type === 'Receipt')
        .reduce((sum, b) => sum + parseFloat(b.total), 0);

    const totalPending = billings
        .filter(b => b.type === 'Invoice')
        .reduce((sum, b) => sum + parseFloat(b.total), 0);

    const paidEl = document.getElementById('bill-total-paid');
    const pendingEl = document.getElementById('bill-total-pending');
    const countEl = document.getElementById('bill-count');

    if(paidEl) paidEl.innerText = utils.formatRM(totalPaid);
    if(pendingEl) pendingEl.innerText = utils.formatRM(totalPending);
    if(countEl) countEl.innerText = billings.length;
}

/**
 * Tema Warna mengikut Jenis Dokumen
 */
function getBillTheme(type) {
    if(type === 'Quotation') return { bg: 'bg-blue-50', text: 'text-blue-600', color: '#2563eb', label: 'SEBUT HARGA' };
    if(type === 'Invoice') return { bg: 'bg-orange-50', text: 'text-orange-600', color: '#ea580c', label: 'INVOIS' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-600', color: '#10b981', label: 'RESIT RASMI' };
}

/**
 * Auto-fill Harga apabila produk dipilih
 */
window.autoFillPrice = () => {
    const sku = document.getElementById('bill-product-select').value;
    const item = inventory.find(i => i.sku === sku);
    if(item) {
        document.getElementById('bill-price').value = item.price;
    }
};

/**
 * Simpan Dokumen Baru (Quotation / Invoice / Receipt)
 */
window.saveBilling = () => {
    const type = document.getElementById('bill-type').value;
    const client = document.getElementById('bill-client-select').value || document.getElementById('bill-client-manual')?.value;
    const sku = document.getElementById('bill-product-select').value;
    const qty = parseInt(document.getElementById('bill-qty').value);
    const price = parseFloat(document.getElementById('bill-price').value);

    if (!sku || !qty || !price || !client) return alert("Sila lengkapkan semua maklumat billing.");

    // LOGIK TOLAK STOK: Hanya jika status adalah 'Receipt'
    if (type === 'Receipt') {
        const itemIdx = inventory.findIndex(i => i.sku === sku);
        if (itemIdx > -1) {
            if (inventory[itemIdx].stock < qty) {
                return alert(`Stok tidak mencukupi! Baki semasa: ${inventory[itemIdx].stock}`);
            }
            inventory[itemIdx].stock -= qty;
            localStorage.setItem('ketick_inventory', JSON.stringify(inventory));
        }
    }

    const newBill = {
        no: (type[0] + Date.now().toString().slice(-6)).toUpperCase(),
        type,
        client,
        sku,
        qty,
        price,
        total: qty * price,
        date: utils.formatDate(new Date()),
        timestamp: new Date().toISOString()
    };

    billings.unshift(newBill);
    
    // Simpan ke LocalStorage & Cloud Sync
    localStorage.setItem('ketick_billings', JSON.stringify(billings));
    globalSave({ 
        billings: billings,
        inventory: inventory 
    });
    
    // Refresh UI
    renderBilling();
    toggleBillingModal(false);
    
    // Reset Form
    document.getElementById('bill-qty').value = 1;
    document.getElementById('bill-price').value = '';
};

/**
 * Fungsi Cetak dengan Template Modern & Watermark
 */
window.printBill = (index) => {
    const bill = billings[index];
    const theme = getBillTheme(bill.type);
    const product = inventory.find(i => i.sku === bill.sku)?.name || "Produk/Servis";

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>${bill.type} - ${bill.no}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-print-color-adjust: exact; }
                .watermark { 
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
                    font-size: 7rem; font-weight: 900; color: rgba(0,0,0,0.03); z-index: -1; white-space: nowrap;
                    text-transform: uppercase;
                }
            </style>
        </head>
        <body class="p-12 text-gray-800">
            <div class="watermark">${bill.type}</div>
            
            <div class="flex justify-between items-start mb-20">
                <div>
                    <h1 class="text-5xl font-black tracking-tighter" style="color: ${theme.color}">${theme.label}</h1>
                    <p class="font-bold text-gray-400 mt-2 tracking-widest uppercase text-xs">No. Rujukan: #${bill.no}</p>
                </div>
                <div class="text-right">
                    <div class="w-12 h-12 bg-black rounded-2xl flex items-center justify-center ml-auto mb-2">
                        <span class="text-white font-black text-xl">K</span>
                    </div>
                    <h2 class="font-black text-xl tracking-tighter">KETICK OS</h2>
                    <p class="text-[9px] text-gray-400 uppercase font-black tracking-widest">Flux Business Suite</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-12 mb-20">
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Disediakan Untuk:</p>
                    <p class="font-black text-xl text-gray-900">${bill.client}</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest">Tarikh Dokumen:</p>
                    <p class="font-black text-xl text-gray-900">${bill.date}</p>
                </div>
            </div>

            <table class="w-full mb-12">
                <thead>
                    <tr class="border-b-2 border-gray-100 text-[10px] uppercase font-black text-gray-400 tracking-widest">
                        <th class="py-5 text-left">Deskripsi Perkara</th>
                        <th class="py-5 text-center">Unit</th>
                        <th class="py-5 text-right">Harga (RM)</th>
                        <th class="py-5 text-right">Jumlah (RM)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="border-b border-gray-50">
                        <td class="py-8">
                            <p class="font-black text-gray-800">${product}</p>
                            <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">SKU: ${bill.sku}</p>
                        </td>
                        <td class="py-8 text-center font-bold text-gray-700">${bill.qty}</td>
                        <td class="py-8 text-right font-bold text-gray-700">${utils.formatRM(bill.price)}</td>
                        <td class="py-8 text-right font-black text-xl" style="color: ${theme.color}">${utils.formatRM(bill.total)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="flex justify-end mt-12">
                <div class="w-72 bg-gray-50 p-8 rounded-[32px] text-right border border-gray-100">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Jumlah Bersih</p>
                    <h3 class="text-4xl font-black text-gray-900">${utils.formatRM(bill.total)}</h3>
                </div>
            </div>

            <div class="mt-32 pt-10 border-t border-dashed border-gray-200">
                <div class="flex justify-between items-center">
                    <p class="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Generated by Ketick OS Flux Edition</p>
                    <p class="text-xs font-bold text-gray-500 italic">Dokumen ini adalah cetakan komputer.</p>
                </div>
            </div>
            
            <script>
                window.onload = () => { 
                    setTimeout(() => { window.print(); window.close(); }, 500);
                };
            </script>
        </body>
        </html>
    `);
};

/**
 * Modal Controls
 */
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

window.closeBillingModal = () => toggleBillingModal(false);
window.openBillingModal = () => toggleBillingModal(true);
