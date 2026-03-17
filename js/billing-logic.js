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

    inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];
    clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

    if(productSelect) {
        productSelect.innerHTML = '<option value="">-- Pilih Produk --</option>' + 
            inventory.map(item => `<option value="${item.sku}">${item.name} (Baki: ${item.stock})</option>`).join('');
    }
    if(clientSelect) {
        clientSelect.innerHTML = clients.length === 0 ? '<option value="">Tiada CRM</option>' :
            '<option value="">-- Pilih Pelanggan CRM --</option>' + clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }

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
                    <button onclick="printBill(${index})" class="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                        <i class="fas fa-eye text-[10px]"></i>
                    </button>
                    <button onclick="askVoid(${index})" class="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        <i class="fas fa-trash text-[10px]"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');
    }

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
 * MODUL PREVIEW & CETAK PREMIUM (DARK MODE UI)
 */
window.printBill = (index) => {
    const bill = billings[index];
    const product = inventory.find(i => i.sku === bill.sku)?.name || "Produk/Servis";
    
    // Ambil info perniagaan dari localStorage (Data dari Setup Wizard)
    const biz = JSON.parse(localStorage.getItem('ketick_business_profile')) || {
        name: "KETICK SOLUTION",
        ssm: "SA0123456-X",
        address: "Sila kemaskini alamat di profil anda.",
        phone: "60123456789",
        bankName: "MAYBANK",
        bankAcc: "000000000000",
        logo: "https://cdn-icons-png.flaticon.com/512/6211/6211181.png"
    };

    const previewModal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');

    previewContent.innerHTML = `
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="flex justify-between items-start gap-4">
                <div class="flex items-center gap-4">
                    <img src="${biz.logo}" class="w-14 h-14 rounded-2xl object-cover border border-white/10 p-1 bg-white/5 shadow-xl">
                    <div>
                        <h2 class="text-lg font-black text-white leading-none tracking-tight">${biz.name}</h2>
                        <p class="text-[8px] text-blue-400 font-bold tracking-[0.2em] mt-1">${biz.ssm}</p>
                        <p class="text-[9px] text-gray-500 mt-2 leading-tight max-w-[160px] font-medium">${biz.address}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="inline-block px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-2">
                        <span class="text-[8px] font-black text-blue-400 uppercase tracking-widest">${bill.type}</span>
                    </div>
                    <h1 class="text-xl font-black text-white tracking-tighter">#${bill.no}</h1>
                    <p class="text-[9px] text-gray-500 font-bold">${bill.date}</p>
                </div>
            </div>

            <div class="bg-white/5 rounded-[1.5rem] p-5 border border-white/5 grid grid-cols-2 gap-4">
                <div>
                    <p class="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-1">Kepada:</p>
                    <p class="font-bold text-sm text-white">${bill.client}</p>
                </div>
                <div class="text-right">
                    <p class="text-[7px] font-black text-gray-500 uppercase tracking-widest mb-1">Hubungi Syarikat:</p>
                    <p class="font-bold text-sm text-white">${biz.phone}</p>
                </div>
            </div>

            <div class="px-1">
                <div class="flex justify-between text-[8px] font-black text-gray-600 uppercase tracking-widest mb-3 px-2">
                    <span>Butiran Item</span>
                    <span>Subtotal</span>
                </div>
                
                <div class="bg-gradient-to-r from-blue-600/10 to-transparent p-5 rounded-2xl border-l-4 border-blue-600 mb-2">
                    <div class="flex justify-between items-center">
                        <div>
                            <p class="font-bold text-white text-base">${product}</p>
                            <p class="text-[9px] text-gray-400 mt-1 uppercase font-medium">${bill.qty} Unit @ ${utils.formatRM(bill.price)}</p>
                        </div>
                        <p class="font-black text-xl text-white">${utils.formatRM(bill.total)}</p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 items-end pt-2">
                <div class="space-y-2">
                    <p class="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Informasi Bank:</p>
                    <div class="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                        <p class="text-[8px] text-gray-400 font-bold uppercase mb-0.5">${biz.bankName}</p>
                        <p class="text-xs font-black text-white tracking-widest">${biz.bankAcc}</p>
                    </div>
                </div>

                <div class="text-right">
                    <p class="text-[9px] font-black text-gray-500 uppercase mb-1">Jumlah Bersih</p>
                    <p class="text-4xl font-black text-white tracking-tighter">${utils.formatRM(bill.total)}</p>
                </div>
            </div>

            <div class="relative mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <div class="text-[8px] text-gray-600 font-medium leading-relaxed italic">
                    * Dokumen dijana melalui KETICK OS.<br>
                    * Sah tanpa tandatangan fizikal.
                </div>
                
                <div class="absolute right-0 -top-4 opacity-20 transform rotate-12 pointer-events-none">
                    <div class="w-20 h-20 border-4 border-blue-500 rounded-full flex items-center justify-center text-center p-2">
                        <p class="text-blue-500 font-black text-[8px] uppercase leading-tight">Verified<br>Digital<br>Seal</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('btn-print-now').onclick = () => actualPrint(index);
    document.getElementById('btn-wa-now').onclick = () => window.shareWhatsApp(index);
    previewModal.classList.remove('hidden');
};

window.closePreview = () => {
    document.getElementById('preview-modal').classList.add('hidden');
};

function actualPrint(index) {
    const bill = billings[index];
    const theme = getBillTheme(bill.type);
    const product = inventory.find(i => i.sku === bill.sku)?.name || "Produk/Servis";
    const biz = JSON.parse(localStorage.getItem('ketick_business_profile')) || { name: "KETICK OS" };

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>${bill.type} - ${bill.no}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-print-color-adjust: exact; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body class="p-10 text-gray-800">
            <div class="flex justify-between items-start mb-10">
                <div>
                    <h1 class="text-4xl font-black uppercase mb-2" style="color:${theme.color}">${bill.type}</h1>
                    <p class="text-sm font-bold text-gray-400">NO: #${bill.no}</p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-black">${biz.name}</p>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-widest">Digital Invoice System</p>
                </div>
            </div>
            <div class="grid grid-cols-2 border-y border-gray-100 py-8 mb-10">
                <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Kepada:</p>
                    <p class="font-black text-lg">${bill.client}</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">Tarikh:</p>
                    <p class="font-black text-lg">${bill.date}</p>
                </div>
            </div>
            <table class="w-full mb-10">
                <thead>
                    <tr class="border-b-2 border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                        <th class="text-left py-4">Deskripsi Item</th>
                        <th class="text-right py-4">Jumlah (RM)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="py-6">
                            <p class="font-black text-gray-800">${product}</p>
                            <p class="text-xs text-gray-400">${bill.qty} Unit x ${utils.formatRM(bill.price)}</p>
                        </td>
                        <td class="text-right font-black text-2xl">${utils.formatRM(bill.total)}</td>
                    </tr>
                </tbody>
            </table>
            <div class="flex justify-between items-end pt-10 border-t border-gray-100">
                <div class="text-xs text-gray-400 font-medium">
                    Terima kasih atas urusan anda.<br>Sila simpan dokumen ini sebagai rujukan rasmi.
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-bold text-gray-400 uppercase">Jumlah Besar</p>
                    <p class="text-4xl font-black text-gray-900">${utils.formatRM(bill.total)}</p>
                </div>
            </div>
            <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); };</script>
        </body>
        </html>
    `);
}

/**
 * LOGIK SIMPAN & WHATSAPP
 */
window.saveBilling = () => {
    const type = document.getElementById('bill-type').value;
    const clientName = document.getElementById('bill-client-select').value;
    const sku = document.getElementById('bill-product-select').value;
    const qty = parseInt(document.getElementById('bill-qty').value);
    const price = parseFloat(document.getElementById('bill-price').value);

    if (!clientName || !sku || !qty || !price) return alert("Sila lengkapkan maklumat!");

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
        type, client: clientName, sku, qty, price, total: qty * price,
        date: new Date().toLocaleDateString('ms-MY')
    };

    billings.unshift(newBill);
    localStorage.setItem('ketick_billings', JSON.stringify(billings));
    addAuditLog("JANA DOKUMEN", `Berjaya jana ${type} #${newBill.no} untuk ${clientName}`);
    
    globalSave({ billings, inventory, auditLogs });
    renderBilling();
    toggleBillingModal(false);
    
    // Auto-tunjuk preview selepas simpan
    setTimeout(() => window.printBill(0), 400);
};

window.shareWhatsApp = (index) => {
    const bill = billings[index];
    const clientData = clients.find(c => c.name === bill.client);
    const biz = JSON.parse(localStorage.getItem('ketick_business_profile')) || { name: "KETICK OS" };
    let phone = clientData ? clientData.phone : "";
    
    if(!phone) {
        phone = prompt("Masukkan no. WhatsApp (cth: 60123456789):");
        if(!phone) return;
    }
    
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const finalPhone = cleanPhone.startsWith('6') ? cleanPhone : '6' + cleanPhone;
    const text = `*DOKUMEN ${bill.type.toUpperCase()} - ${biz.name}*%0A%0ANo: #${bill.no}%0APelanggan: ${bill.client}%0AJumlah: *${utils.formatRM(bill.total)}*%0A%0ATerima kasih!`;
    window.open(`https://wa.me/${finalPhone}?text=${text}`, '_blank');
};

/**
 * LOGIK VOID & UTILITY
 */
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

    billings.splice(pendingVoidIndex, 1);
    localStorage.setItem('ketick_billings', JSON.stringify(billings));
    addAuditLog("VOID BERJAYA", `Bill #${bill.no} dipadam.`);
    
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
    if(type === 'Quotation') return { bg: 'bg-blue-50', text: 'text-blue-600', color: '#2563eb' };
    if(type === 'Invoice') return { bg: 'bg-orange-50', text: 'text-orange-600', color: '#ea580c' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-600', color: '#10b981' };
}

window.toggleBillingModal = (show) => {
    const modal = document.getElementById('billing-modal');
    const content = document.getElementById('bill-modal-content');
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => content.classList.remove('translate-x-full'), 10);
    } else {
        content.classList.add('translate-x-full');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
};
