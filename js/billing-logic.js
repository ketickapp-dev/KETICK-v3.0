import { globalSave } from './database.js';
import { utils } from './utils.js';

let billings = JSON.parse(localStorage.getItem('ketick_billings')) || [];
let inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];
let auditLogs = JSON.parse(localStorage.getItem('ketick_audit_logs')) || [];

const ADMIN_PASS = "1234"; 
let pendingVoidIndex = null;

// --- FUNGSI PROFIL BISNES (BARU) ---
window.toggleProfileModal = (show) => {
    const modal = document.getElementById('profile-modal');
    if (show) {
        const biz = JSON.parse(localStorage.getItem('ketick_business_profile')) || {};
        document.getElementById('edit-biz-name').value = biz.name || '';
        document.getElementById('edit-biz-ssm').value = biz.ssm || '';
        document.getElementById('edit-biz-phone').value = biz.phone || '';
        document.getElementById('edit-biz-address').value = biz.address || '';
        document.getElementById('edit-biz-bank').value = biz.bankName || '';
        document.getElementById('edit-biz-acc').value = biz.bankAcc || '';
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
};

window.updateBusinessProfile = () => {
    const newProfile = {
        name: document.getElementById('edit-biz-name').value.toUpperCase(),
        ssm: document.getElementById('edit-biz-ssm').value,
        phone: document.getElementById('edit-biz-phone').value,
        address: document.getElementById('edit-biz-address').value,
        bankName: document.getElementById('edit-biz-bank').value.toUpperCase(),
        bankAcc: document.getElementById('edit-biz-acc').value,
        logo: "https://cdn-icons-png.flaticon.com/512/6211/6211181.png"
    };

    localStorage.setItem('ketick_business_profile', JSON.stringify(newProfile));
    alert("Profil Berjaya Dikemaskini!");
    toggleProfileModal(false);
    if(typeof renderBilling === "function") renderBilling();
};

// --- FUNGSI RENDER BILLING ---
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
 * MODUL PREVIEW & CETAK (Kekal Seperti Sebelum Ini)
 */
window.printBill = (index) => {
    const bill = billings[index];
    const product = inventory.find(i => i.sku === bill.sku)?.name || "Produk/Servis";
    const biz = JSON.parse(localStorage.getItem('ketick_business_profile')) || {
        name: "KETICK SOLUTION", ssm: "SA0123456-X", address: "Sila kemaskini alamat.",
        phone: "60123456789", bankName: "MAYBANK", bankAcc: "000000000000",
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
            </div>
    `;

    document.getElementById('btn-print-now').onclick = () => actualPrint(index);
    document.getElementById('btn-wa-now').onclick = () => window.shareWhatsApp(index);
    previewModal.classList.remove('hidden');
};

// ... (Baki fungsi actualPrint, saveBilling, shareWhatsApp, askVoid, confirmVoid dikekalkan) ...
// Pastikan semua fungsi tersebut ada di dalam fail ini.

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
