import { globalSave } from './database.js';

let expenses = JSON.parse(localStorage.getItem('f6_expenses')) || [];
let invoices = JSON.parse(localStorage.getItem('f6_invoices')) || [];

export function renderTax() {
    // 1. Kira Total Pendapatan dari Invois
    const grossIncome = invoices.reduce((sum, inv) => sum + parseFloat(inv.total), 0);
    
    // 2. Kira Total Perbelanjaan
    const totalExpense = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    // 3. Pendapatan Bersih (Bercukai)
    const netIncome = grossIncome - totalExpense;
    
    // 4. Anggaran Cukai (Contoh: 15% jika pendapatan > 50,000)
    let taxEstimate = 0;
    if (netIncome > 50000) {
        taxEstimate = netIncome * 0.15;
    } else if (netIncome > 5000) {
        taxEstimate = netIncome * 0.03;
    }

    // Update UI
    document.getElementById('tax-gross-income').innerText = `RM ${grossIncome.toFixed(2)}`;
    document.getElementById('tax-total-expense').innerText = `RM ${totalExpense.toFixed(2)}`;
    document.getElementById('tax-net-income').innerText = `RM ${netIncome.toFixed(2)}`;
    document.getElementById('tax-estimate').innerText = `RM ${taxEstimate.toFixed(2)}`;

    renderExpenseTable();
}

function renderExpenseTable() {
    const table = document.getElementById('tax-expense-body');
    if(!table) return;

    table.innerHTML = expenses.map(exp => `
        <tr class="border-b border-gray-50 hover:bg-gray-50 transition text-xs">
            <td class="p-6 font-bold text-gray-800">${exp.category}</td>
            <td class="p-6 text-gray-500">${exp.desc}</td>
            <td class="p-6 font-medium text-gray-400">${exp.date}</td>
            <td class="p-6 text-right font-black text-red-500">RM ${parseFloat(exp.amount).toFixed(2)}</td>
        </tr>
    `).reverse().join('');
}

window.saveExpense = () => {
    const category = document.getElementById('exp-cat').value;
    const desc = document.getElementById('exp-desc').value;
    const amount = document.getElementById('exp-amount').value;

    if(!amount) return alert("Sila masukkan jumlah.");

    const newExpense = {
        id: Date.now(),
        category,
        desc,
        amount,
        date: new Date().toLocaleDateString('ms-MY')
    };

    expenses.push(newExpense);
    globalSave({ expenses: expenses });
    renderTax();
    closeExpenseModal();
};

window.openExpenseModal = () => document.getElementById('expense-modal').classList.remove('hidden');
window.closeExpenseModal = () => document.getElementById('expense-modal').classList.add('hidden');
