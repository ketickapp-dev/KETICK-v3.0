import { renderSidebar } from './ui.js';
// Import fungsi render dari fail logik masing-masing jika anda pecahkan logik
// import { renderInventory } from './inventory-logic.js'; 

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    
    // Load Dashboard secara default bila buka sistem
    loadModule('dashboard'); 
});

/**
 * Fungsi Utama memuatkan modul secara dinamik (SPA)
 */
export async function loadModule(moduleName) {
    const viewport = document.getElementById('module-viewport');
    const loader = document.getElementById('loader');
    
    if (loader) loader.classList.remove('hidden');
    
    try {
        const response = await fetch(`modules/${moduleName}.html`);
        if (!response.ok) throw new Error(`Modul ${moduleName} tidak dijumpai.`);
        
        const html = await response.text();
        viewport.innerHTML = html;
        
        // Jalankan logik JavaScript spesifik untuk modul tersebut
        initModuleLogic(moduleName);
        
        console.log(`Modul ${moduleName} aktif.`);
    } catch (err) {
        console.error("Gagal memuatkan modul:", err);
        viewport.innerHTML = `
            <div class="p-20 text-center">
                <i class="fas fa-exclamation-triangle text-4xl text-orange-400 mb-4"></i>
                <h2 class="text-xl font-bold">Ralat Muat Turun Halaman</h2>
                <p class="text-gray-500 text-sm">${err.message}</p>
            </div>
        `;
    } finally {
        if (loader) loader.classList.add('hidden');
    }
}

/**
 * Menghubungkan HTML yang baru di-load dengan fungsi JavaScript
 */
function initModuleLogic(name) {
    // Pastikan fungsi-fungsi ini wujud secara global atau di-import
    switch(name) {
        case 'dashboard':
            if (typeof renderDashboard === 'function') renderDashboard();
            break;
        case 'inventory':
            if (typeof renderInventory === 'function') renderInventory();
            break;
        case 'crm':
            if (typeof renderCRM === 'function') renderCRM();
            break;
        case 'billing':
            if (typeof populateBillingClients === 'function') {
                populateBillingClients();
                updateBillingTheme();
            }
            break;
        case 'lhdn':
            if (typeof renderTax === 'function') renderTax();
            break;
        case 'social':
            if (typeof renderSchedule === 'function') renderSchedule();
            break;
        case 'blast':
            if (typeof renderBlastClientList === 'function') renderBlastClientList();
            break;
        case 'autoreply':
            if (typeof renderAR === 'function') renderAR();
            break;
    }
}
