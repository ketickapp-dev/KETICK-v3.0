import { globalSave } from './database.js';
import { utils } from './utils.js';

// Ambil data dari LocalStorage
let expenses = JSON.parse(localStorage.getItem('f6_expenses')) || [];
let invoices = JSON.parse(localStorage.getItem('f6_invoices')) || [];

/**
 * Render utama untuk modul LHDN Tax
 */
export function renderTax() {
    // 1. Kira Total Pendapatan dari modul Billing
    const grossIncome = invoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
    
    // 2. Kira Total Perbelanjaan (Deductible)
    const totalExpense = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    // 3. Kira Pendapatan Bersih (Bercukai)
    const netIncome = grossIncome - totalExpense;
    
    // 4. Anggaran Cukai (Contoh tangga cukai ringkas)
    let taxEstimate = 0;
    if (netIncome > 50000) {
        taxEstimate = netIncome * 0.15;
    } else if (netIncome > 5000) {
        taxEstimate = netIncome * 0.03;
    }

    // Kemaskini UI menggunakan utils.formatRM
    document.getElementById('tax-gross-income').innerText = utils.formatRM(grossIncome);
    document.getElementById('tax-total-expense').innerText = utils.formatRM(totalExpense);
    document.getElementById('tax-net-income').innerText = utils.formatRM(netIncome);
    document.getElementById('tax-estimate').innerText = utils.formatRM(taxEstimate);

    renderExpenseTable();
}

/**
 * Render jadual perbelanjaan
 */
function renderExpenseTable() {
    const table = document.getElementById('tax-expense-body');
    if(!table) return;

    if (expenses.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-gray-300 font-bold uppercase text-xs">Tiada rekod perbelanjaan</td></tr>`;
        return;
    }

    table.innerHTML = expenses.map(exp => `
        <tr class="border-b border-gray-50 hover:bg-gray-50 transition text-xs">
            <td class="p-6">
                <span class="font-bold text-gray-800 uppercase tracking-tighter text-[10px] bg-gray-100 px-2 py-1 rounded-md">
                    ${exp.category}
                </span>
            </td>
            <td class="p-6 text-gray-500 font-medium">
                ${utils.truncateText(exp.desc, 30)}
            </td>
            <td class="p-6 font-bold text-gray-400">
                ${exp.date}
            </td>
            <td class="p-6 text-right font-black text-red-500">
                ${utils.formatRM(exp.amount)}
            </td>
        </tr>
    `).reverse().join('');
}

/**
 * Simpan Perbelanjaan Baru
 */
window.saveExpense = () => {
    const category = document.getElementById('exp-cat').value;
    const desc = document.getElementById('exp-desc').value;
    const amount = document.getElementById('exp-amount').value;

    if(!amount || !desc) {
        alert("Sila masukkan jumlah dan keterangan belanja.");
        return;
    }

    const newExpense = {
        id: utils.generateID('EXP'),
        category,
        desc,
        amount: parseFloat(amount),
        date: utils.formatDate(new Date()) // Simpan tarikh dalam format seragam
    };

    expenses.push(newExpense);
    
    // Simpan & Sync ke Cloud
    globalSave({ expenses: expenses });
    
    // Refresh & Tutup
    renderTax();
    closeExpenseModal();
    
    // Reset input
    document.getElementById('exp-desc').value = '';
    document.getElementById('exp-amount').value = '';
};

// Fungsi Kontrol Modal
window.openExpenseModal = () => document.getElementById('expense-modal').classList.remove('hidden');
window.closeExpenseModal = () => document.getElementById('expense-modal').classList.add('hidden');
