import { globalSave } from './database.js';
import { utils } from './utils.js';

let invoices = JSON.parse(localStorage.getItem('f6_invoices')) || [];
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

/**
 * Render utama untuk modul Billing
 */
export function renderBilling() {
    // 1. Kemaskini Dropdown Pelanggan (Guna nama dari CRM)
    const select = document.getElementById('bill-client-select');
    if(select) {
        select.innerHTML = clients.map(c => `<option value="${c.name}">${c.name} (${c.phone})</option>`).join('');
    }

    // 2. Render Jadual Invois
    const table = document.getElementById('billing-table-body');
    if(!table) return;

    if (invoices.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="p-10 text-center text-gray-300 font-bold uppercase text-xs">Tiada rekod invois</td></tr>`;
    } else {
        table.innerHTML = invoices.map((inv, index) => `
            <tr class="border-b border-gray-50 hover:bg-gray-50/80 transition text-sm">
                <td class="p-6 text-center font-bold text-gray-400">#${inv.id.toString().slice(-4)}</td>
                <td class="p-6 font-bold text-gray-800">${inv.client}</td>
                <td class="p-6 text-gray-500 font-medium">${inv.date}</td>
                <td class="p-6 font-black text-blue-600">${utils.formatRM(inv.total)}</td>
                <td class="p-6">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}">
                        ${inv.status.toUpperCase()}
                    </span>
                </td>
                <td class="p-6 text-right">
                    <button class="text-blue-500 hover:scale-110 transition" title="Cetak Invois">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).reverse().join('');
    }

    updateBillingSummary();
}

/**
 * Mengira ringkasan statistik di bahagian atas
 */
function updateBillingSummary() {
    const totalPaid = invoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + parseFloat(inv.total), 0);

    const totalPending = invoices
        .filter(inv => inv.status === 'Unpaid')
        .reduce((sum, inv) => sum + parseFloat(inv.total), 0);

    document.getElementById('bill-total-paid').innerText = utils.formatRM(totalPaid);
    document.getElementById('bill-total-pending').innerText = utils.formatRM(totalPending);
    document.getElementById('bill-count').innerText = invoices.length;
}

/**
 * Simpan Invois Baru
 */
window.saveInvoice = () => {
    const client = document.getElementById('bill-client-select').value;
    const qty = document.getElementById('bill-qty').value;
    const price = document.getElementById('bill-price').value;
    const desc = document.getElementById('bill-desc').value;

    if (!price || !desc) return alert("Sila lengkapkan maklumat harga dan keterangan.");

    const newInvoice = {
        id: Date.now(),
        client,
        total: parseFloat(qty) * parseFloat(price),
        desc,
        date: utils.formatDate(new Date()), // Guna utils untuk format tarikh seragam
        status: 'Unpaid'
    };

    invoices.push(newInvoice);
    
    // Simpan & Sync
    globalSave({ invoices: invoices });
    
    // Refresh UI
    renderBilling();
    closeBillingModal();
    
    // Reset form
    document.getElementById('bill-price').value = '';
    document.getElementById('bill-desc').value = '';
};

// Fungsi Kontrol Modal (Global)
window.openBillingModal = () => document.getElementById('billing-modal').classList.remove('hidden');
window.closeBillingModal = () => document.getElementById('billing-modal').classList.add('hidden');
