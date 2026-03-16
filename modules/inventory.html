import { globalSave } from './database.js';
import { utils } from './utils.js';

// Tarik data stok dari LocalStorage
let inventory = JSON.parse(localStorage.getItem('f6_inventory')) || [];

/**
 * Render utama untuk modul Inventori
 */
export function renderInventory() {
    const table = document.getElementById('inventory-table-body');
    if(!table) return;

    if (inventory.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="p-10 text-center text-gray-300 font-bold uppercase text-xs tracking-widest">Tiada rekod stok dalam gudang</td></tr>`;
        return;
    }

    table.innerHTML = inventory.map((item, index) => {
        // Logik amaran stok rendah (Alert)
        const isLowStock = item.stock <= 5;
        
        return `
        <tr class="border-b border-gray-50 hover:bg-gray-50/50 transition">
            <td class="p-6">
                <p class="font-bold text-gray-800">${utils.truncateText(item.name, 25)}</p>
                <p class="text-[9px] font-black text-gray-400 uppercase tracking-tighter">${item.sku || 'NO-SKU'}</p>
            </td>
            <td class="p-6 text-sm font-medium text-gray-500">
                ${utils.formatRM(item.cost)}
            </td>
            <td class="p-6 text-sm font-black text-blue-600">
                ${utils.formatRM(item.price)}
            </td>
            <td class="p-6">
                <div class="flex flex-col items-center">
                    <span class="text-lg font-black ${isLowStock ? 'text-red-500' : 'text-gray-800'}">${item.stock}</span>
                    ${isLowStock ? '<span class="text-[8px] font-black bg-red-100 text-red-500 px-2 py-0.5 rounded-full uppercase">Low Stock</span>' : ''}
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

/**
 * Fungsi Tambah Produk (Manual Input)
 * Boleh dipanggil dari modal UI anda
 */
window.addInventoryItem = () => {
    // Contoh prompt ringkas (Boleh diganti dengan Modal HTML yang cantik)
    const name = prompt("Nama Produk:");
    if (!name) return;
    
    const cost = prompt("Kos Unit (RM):", "0");
    const price = prompt("Harga Jual (RM):", "0");
    const stock = prompt("Kuantiti Stok:", "0");

    const newItem = {
        id: utils.generateID('SKU'),
        sku: utils.generateID('INV').split('-')[1], // Generate mini SKU
        name,
        cost: parseFloat(cost),
        price: parseFloat(price),
        stock: parseInt(stock),
        updatedAt: new Date().toISOString()
    };

    inventory.push(newItem);
    
    // Simpan & Sync ke Cloud
    globalSave({ inventory: inventory });
    
    // Refresh paparan
    renderInventory();
};

/**
 * Fungsi Update Stok Cepat
 */
window.updateStock = (index, newAmount) => {
    inventory[index].stock = parseInt(newAmount);
    globalSave({ inventory: inventory });
    renderInventory();
};
