import { globalSave } from './database.js';
import { utils } from './utils.js';

let billings = JSON.parse(localStorage.getItem('ketick_billings')) || [];
let inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];
let auditLogs = JSON.parse(localStorage.getItem('ketick_audit_logs')) || [];

const ADMIN_PASS = "1234"; 
let pendingVoidIndex = null;

export function renderBilling() {
    const table = document.getElementById('billing-table-body');
    const auditTable = document.getElementById('billing-audit-log');
    const productSelect = document.getElementById('bill-product-select');
    const clientSelect = document.getElementById('bill-client-select');
    
    if(!table) return;

    // Refresh data
    inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];
    clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

    // 1. Load Dropdowns
    if(productSelect) {
        productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>' + 
            inventory.map(item => `<option value="${item.sku}">${item.name} (Baki: ${item.stock})</option>`).join('');
    }
    if(clientSelect) {
        clientSelect.innerHTML = clients.length === 0 ? '<option value="">Tiada CRM</option>' :
            '<option value="">-- Pilih Pelanggan CRM --</option>' + clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }

    // 2. Render Jadual Billing
    if (billings.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="p-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">Tiada rekod billing</td></tr>`;
    } else {
        table.innerHTML = billings.map((bill, index) => {
            const theme = getBillTheme(bill.type);
            return `
            <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td class="p-6 font-bold text-xs text-gray-400">#${bill.no}</td>
                <td class="p-6 font-bold text-sm text-gray-800">${bill.client}<br><span class="text-[9px] text-gray-400 font-medium">${bill.date}</span></td>
                <td class="p-6 font-black text-sm text-gray-700">${utils.formatRM(bill.total)}</td>
                <td class="p-6"><span class="px-3 py-1 rounded-full text-[9px] font-black uppercase ${theme.bg} ${theme.text}">${bill.type}</span></td>
                <td class="p-6 text-right flex justify-end gap-2">
                    <button onclick="shareWhatsApp(${index})" class="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                        <i class="fab fa-whatsapp text-[12px]"></i>
                    </button>
                    <button onclick="printBill(${index})" class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                        <i class="fas fa-print text-[10px]"></i>
                    </button>
                    <button onclick="askVoid(${index})" class="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        <i class="fas fa-trash text-[10px]"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');
    }

    // 3. Render Audit Log
    if(auditTable) {
        auditTable.innerHTML = auditLogs.map(log => `
            <tr class="border-b border-gray-50">
                <td class="p-4 text-gray-400 font-medium">${log.time}</td>
                <td class="p-4 font-bold ${log.action.includes('VOID') || log.action.includes('GAGAL') ? 'text-red-500' : 'text-emerald-500'}">${log.action}</td>
                <td class="p-4 text-gray-500">${log.details}</td>
            </tr>
        `).join('');
    }
    updateBillingSummary();
}

/**
 * Logik WhatsApp
 */
window.shareWhatsApp = (index) => {
    const bill = billings[index];
    const clientData = clients.find(c => c.name === bill.client);
    let phone = clientData ? clientData.phone : "";
    
    if(!phone) {
        phone = prompt("No. WhatsApp pelanggan tidak ditemui. Sila masukkan no. phone (cth: 60123456789):");
        if(!phone) return;
    }
    
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const finalPhone = cleanPhone.startsWith('6') ? cleanPhone : '6' + cleanPhone;
    
    const text = `*DOKUMEN ${bill.type.toUpperCase()} - KETICK OS*%0A%0A` +
                 `Hai *${bill.client}*, berikut adalah butiran dokumen anda:%0A` +
                 `--------------------------------%0A` +
                 `No. Rujukan: #${bill.no}%0A` +
                 `Tarikh: ${bill.date}%0A` +
                 `Jumlah: *${utils.formatRM(bill.total)}*%0A` +
                 `--------------------------------%0A` +
                 `Terima kasih kerana berurusan dengan kami.`;

    window.open(`https://wa.me/${finalPhone}?text=${text}`, '_blank');
    addAuditLog("WHATSAPP SENT", `Dokumen #${bill.no} dihantar ke ${bill.client}`);
};

window.saveBilling = () => {
    const type = document.getElementById('bill-type').value;
    const client = document.getElementById('bill-client-select').value;
    const sku = document.getElementById('bill-product-select').value;
    const qty = parseInt(document.getElementById('bill-qty').value);
    const price = parseFloat(document.getElementById('bill-price').value);

    if (!client || !sku || !qty || !price) return alert("Sila lengkapkan maklumat!");

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
        type, client, sku, qty, price, total: qty * price,
        date: new Date().toLocaleDateString('ms-MY')
    };

    billings.unshift(newBill);
    localStorage.setItem('ketick_billings', JSON.stringify(billings));
    addAuditLog("JANA DOKUMEN", `Berjaya jana ${type} #${newBill.no} untuk ${client}`);
    
    globalSave({ billings, inventory, auditLogs });
    renderBilling();
    toggleBillingModal(false);
};

window.askVoid = (index) => {
    pendingVoidIndex = index;
    document.getElementById('void-modal').classList.remove('hidden');
};

window.closeVoidModal = () => {
    document.getElementById('void-modal').classList.add('hidden');
    document.getElementById('admin-password').value = '';
};

window.confirmVoid = () => {
    const passInput = document.getElementById('admin-password').value;
    if(passInput !== ADMIN_PASS) {
        addAuditLog("CUBAN VOID GAGAL", `Pass salah untuk Bill #${billings[pendingVoidIndex].no}`);
        alert("Password Admin Salah!");
        return;
    }

    const bill = billings[pendingVoidIndex];
    if(bill.type === 'Receipt') {
        const itemIdx = inventory.findIndex(i => i.sku === bill.sku);
        if(itemIdx > -1) {
            inventory[itemIdx].stock += bill.qty;
            localStorage.setItem('ketick_inventory', JSON.stringify(inventory));
        }
    }

    addAuditLog("VOID BERJAYA", `Bill #${bill.no} dipadam. Stok dipulangkan.`);
    billings.splice(pendingVoidIndex, 1);
    localStorage.setItem('ketick_billings', JSON.stringify(billings));
    
    globalSave({ billings, inventory, auditLogs });
    renderBilling();
    closeVoidModal();
};

function addAuditLog(action, details) {
    auditLogs.unshift({ time: new Date().toLocaleTimeString(), action, details });
    if(auditLogs.length > 50) auditLogs.pop();
    localStorage.setItem('ketick_audit_logs', JSON.stringify(auditLogs));
}

window.autoFillPrice = () => {
    const sku = document.getElementById('bill-product-select').value;
    const item = inventory.find(i => i.sku === sku);
    if(item) document.getElementById('bill-price').value = item.price;
};

function updateBillingSummary() {
    const paid = billings.filter(b => b.type === 'Receipt').reduce((s, b) => s + b.total, 0);
    const pending = billings.filter(b => b.type === 'Invoice').reduce((s, b) => s + b.total, 0);
    if(document.getElementById('bill-total-paid')) document.getElementById('bill-total-paid').innerText = utils.formatRM(paid);
    if(document.getElementById('bill-total-pending')) document.getElementById('bill-total-pending').innerText = utils.formatRM(pending);
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
                .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 8rem; font-weight: 900; color: rgba(0,0,0,0.02); z-index: -1; text-transform: uppercase; }
            </style>
        </head>
        <body class="p-10">
            <div class="watermark">${bill.type}</div>
            <div class="flex justify-between mb-10">
                <div>
                    <h1 class="text-4xl font-black" style="color:${theme.color}">${theme.label}</h1>
                    <p class="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">ID: #${bill.no}</p>
                </div>
                <div class="text-right">
                    <h2 class="text-xl font-black">KETICK OS</h2>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mobile Cloud ERP</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-10 mb-10 border-y border-gray-100 py-8">
                <div><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pelanggan</p><p class="font-bold text-gray-800">${bill.client}</p></div>
                <div class="text-right"><p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tarikh</p><p class="font-bold text-gray-800">${bill.date}</p></div>
            </div>
            <table class="w-full mb-10">
                <tr class="text-[10px] font-black text-gray-400 uppercase border-b-2 border-gray-50">
                    <th class="text-left py-4">Perkara</th>
                    <th class="text-center">Kuantiti</th>
                    <th class="text-right">Jumlah</th>
                </tr>
                <tr>
                    <td class="py-6 font-bold text-gray-800">${product}<br><span class="text-[9px] text-gray-400 uppercase font-medium">SKU: ${bill.sku}</span></td>
                    <td class="text-center font-bold text-gray-600">${bill.qty}</td>
                    <td class="text-right font-black text-lg" style="color:${theme.color}">${utils.formatRM(bill.total)}</td>
                </tr>
            </table>
            <div class="flex justify-end pt-10 border-t border-gray-100">
                <div class="text-right bg-gray-50 p-6 rounded-3xl w-64">
                    <p class="text-[10px] font-black text-gray-400 uppercase mb-1">Jumlah Bersih</p>
                    <p class="text-3xl font-black text-gray-800">${utils.formatRM(bill.total)}</p>
                </div>
            </div>
            <p class="text-[10px] text-gray-300 mt-20 italic">Generated by Ketick OS. Dokumentasi ini sah mengikut perundangan digital.</p>
            <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };</script>
        </body>
        </html>
    `);
};
