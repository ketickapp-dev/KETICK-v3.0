// js/inventory-logic.js
import { utils } from './utils.js';
import { globalSave } from './database.js';

// Ambil data dari LocalStorage (Gunakan kunci yang konsisten: ketick_inventory)
let inventory = JSON.parse(localStorage.getItem('ketick_inventory')) || [];

export function renderInventory() {
    const table = document.getElementById('inventory-table-body');
    if(!table) return;

    if (inventory.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="p-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">Tiada rekod stok dalam gudang</td></tr>`;
        return;
    }

    table.innerHTML = inventory.map((item, index) => {
        const isLowStock = item.stock <= 5;
        
        return `
        <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition group">
            <td class="p-6">
                <p class="font-bold text-gray-800 text-sm">${utils.truncateText(item.name, 30)}</p>
                <p class="text-[9px] font-black text-blue-500 uppercase tracking-tighter">${item.sku || 'NO-SKU'}</p>
            </td>
            <td class="p-6 text-center font-bold text-xs text-gray-400">
                ${utils.formatRM(item.cost)}
            </td>
            <td class="p-6 text-center font-bold text-xs text-emerald-600">
                ${utils.formatRM(item.price)}
            </td>
            <td class="p-6 text-center">
                <div class="flex flex-col items-center">
                    <span class="px-3 py-1 ${isLowStock ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'} rounded-full text-[10px] font-black">
                        ${item.stock} UNIT
                    </span>
                    ${isLowStock ? '<span class="text-[8px] font-black text-red-400 mt-1 uppercase animate-pulse">Low Stock</span>' : ''}
                </div>
            </td>
            <td class="p-6 text-right">
                <button onclick="deleteProduct(${index})" class="w-8 h-8 rounded-full bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90">
                    <i class="fas fa-trash-alt text-[10px]"></i>
                </button>
            </td>
        </tr>
        `;
    }).join('');
}

// Kawalan Modal (Slide-over)
window.toggleInventoryModal = (show) => {
    const modal = document.getElementById('inv-modal');
    const content = document.getElementById('modal-content');
    
    if (show) {
        modal.classList.remove('hidden');
        setTimeout(() => content.classList.remove('translate-x-full'), 10);
    } else {
        content.classList.add('translate-x-full');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
};

// Simpan Produk & Sync
window.saveProduct = () => {
    const name = document.getElementById('inv-name').value;
    const cost = document.getElementById('inv-cost').value;
    const price = document.getElementById('inv-price').value;
    const stock = document.getElementById('inv-stock').value;

    if (!name || !price || !stock) return alert("Sila lengkapkan maklumat produk.");

    const newItem = {
        sku: 'INV-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
        name,
        cost: parseFloat(cost) || 0,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        updatedAt: new Date().toISOString()
    };

    inventory.push(newItem);
    
    // Simpan Local & Cloud
    localStorage.setItem('ketick_inventory', JSON.stringify(inventory));
    if (typeof globalSave === "function") {
        globalSave({ inventory: inventory });
    }

    // Reset UI
    document.querySelectorAll('#inv-modal input').forEach(input => input.value = '');
    toggleInventoryModal(false);
    renderInventory();
};

window.deleteProduct = (index) => {
    if (!confirm("Padam produk ini dari pangkalan data?")) return;
    inventory.splice(index, 1);
    localStorage.setItem('ketick_inventory', JSON.stringify(inventory));
    
    if (typeof globalSave === "function") {
        globalSave({ inventory: inventory });
    }
    renderInventory();
};
