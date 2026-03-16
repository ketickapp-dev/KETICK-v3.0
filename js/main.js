import { renderSidebar } from './ui.js';

// Import semua fungsi render dari fail logik masing-masing
import { renderDashboard } from './dashboard-logic.js';
import { renderInventory } from './inventory-logic.js';
import { renderCRM } from './crm-logic.js';
import { renderBilling } from './billing-logic.js';
import { renderTax } from './tax-logic.js';
import { renderSocial } from './social-logic.js';
import { renderBlast } from './blast-logic.js';

/**
 * Event Listener semasa aplikasi mula dimuatkan
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Bina Sidebar UI
    renderSidebar();
    
    // 2. Load Dashboard secara default bila mula-mula buka sistem
    loadModule('dashboard'); 
    
    // 3. Simpan loadModule ke dalam window supaya boleh diakses oleh onclick di HTML
    window.loadModule = loadModule;
});

/**
 * Fungsi Utama memuatkan modul secara dinamik (Single Page Application)
 */
export async function loadModule(moduleName) {
    const viewport = document.getElementById('module-viewport');
    const loader = document.getElementById('loader');
    
    // Paparkan animasi loading
    if (loader) loader.classList.remove('hidden');
    
    // Tambah sedikit kesan transisi keluar
    viewport.classList.add('opacity-0', 'translate-y-4');
    
    try {
        const response = await fetch(`modules/${moduleName}.html`);
        if (!response.ok) throw new Error(`Modul ${moduleName} tidak dijumpai.`);
        
        const html = await response.text();
        
        // Masukkan HTML ke dalam viewport selepas delay kecil untuk kelicinan
        setTimeout(() => {
            viewport.innerHTML = html;
            viewport.classList.remove('opacity-0', 'translate-y-4');
            viewport.classList.add('opacity-100', 'translate-y-0');
            
            // Jalankan logik JavaScript spesifik untuk modul tersebut
            initModuleLogic(moduleName);
        }, 150);

        console.log(`KETICK OS: Modul ${moduleName} diaktifkan.`);
    } catch (err) {
        console.error("Gagal memuatkan modul:", err);
        viewport.innerHTML = `
            <div class="p-20 text-center bg-white rounded-[40px] border border-red-50">
                <i class="fas fa-exclamation-circle text-5xl text-red-500 mb-6 animate-pulse"></i>
                <h2 class="text-2xl font-black text-gray-800">Ralat Muat Turun</h2>
                <p class="text-gray-400 font-medium mt-2">${err.message}</p>
                <button onclick="location.reload()" class="mt-8 bg-black text-white px-8 py-3 rounded-2xl font-bold">Cuba Lagi</button>
            </div>
        `;
    } finally {
        if (loader) {
            setTimeout(() => loader.classList.add('hidden'), 300);
        }
    }
}

/**
 * Menghubungkan HTML yang baru di-load dengan fungsi JavaScript (init)
 */
function initModuleLogic(name) {
    switch(name) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'inventory':
            renderInventory();
            break;
        case 'crm':
            renderCRM();
            break;
        case 'billing':
            renderBilling();
            break;
        case 'lhdn':
            renderTax();
            break;
        case 'social':
            renderSocial();
            break;
        case 'blast':
            renderBlast();
            break;
        // Modul-modul lain boleh ditambah di sini
    }
}
