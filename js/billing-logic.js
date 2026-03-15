import { globalSave } from './database.js';

let invoices = JSON.parse(localStorage.getItem('f6_invoices')) || [];
let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

export function renderBilling() {
    // 1. Update Dropdown Pelanggan
    const select = document.getElementById('bill-client-select');
    if(select) {
        select.innerHTML = clients.map(c => `<option value="${c.name}">${c.name} (${c.phone})</option>`).join('');
    }

    // 2. Render Table Invois
    const table = document.getElementById('billing-table-body');
    if(!table) return;

    table.innerHTML = invoices.map((inv, index) => `
        <tr class="border-b border-gray-50 hover:bg-gray-50/80 transition text-sm">
            <td class="p-6 text-center font-bold text-gray-400">#${inv.id.toString().slice(-4)}</td>
            <td class="p-6 font-bold text-gray-800">${inv.client}</td>
            <td class="p-6 text-gray-500 font-medium">${inv.date}</td>
            <td class="p-6 font-black text-blue-600">RM ${parseFloat(inv.total).toFixed(2)}</td>
            <td class="p-6">
                <span class="px-3 py-1 rounded-full text-[10px] font-black ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}">
                    ${inv.status.toUpperCase()}
                </span>
            </td>
            <td class="p-6 text-right">
                <button class="text-blue-500 hover:scale-110 transition"><i class="fas fa-print"></i></button>
            </td>
        </tr>
    `).reverse().join('');

    updateBillingSummary();
}

function updateBillingSummary() {
    const total = invoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
    document.getElementById('bill-total-paid').innerText = `RM ${total.toFixed(2)}`;
    document.getElementById('bill-count').innerText = invoices.length;
}

window.saveInvoice = () => {
    const client = document.getElementById('bill-client-select').value;
    const qty = document.getElementById('bill-qty').value;
    const price = document.getElementById('bill-price').value;
    const desc = document.getElementById('bill-desc').value;

    const newInvoice = {
        id: Date.now(),
        client,
        total: qty * price,
        desc,
        date: new Date().toLocaleDateString('ms-MY'),
        status: 'Unpaid'
    };

    invoices.push(newInvoice);
    globalSave({ invoices: invoices }); // Auto-sync ke Cloud
    renderBilling();
    closeBillingModal();
};

window.openBillingModal = () => document.getElementById('billing-modal').classList.remove('hidden');
window.closeBillingModal = () => document.getElementById('billing-modal').classList.add('hidden');
