// 1. Import Kawalan Keselamatan & UI Utama
import { checkAuthStatus } from './auth.js';
import { renderSidebar } from './ui.js';

// 2. Import Logik Modul (Business Logic)
import { renderDashboard } from './dashboard-logic.js';
import { renderInventory } from './inventory-logic.js';
import { renderCRM } from './crm-logic.js';
import { renderBilling } from './billing-logic.js';
import { renderTax } from './tax-logic.js';
import { renderSocial } from './social-logic.js';
import { renderBlast } from './blast-logic.js';
import { renderCoupons } from './coupon-logic.js';
import { renderHistory } from './history-logic.js';
import { initChatbox } from './chatbox-logic.js'; 

/**
 * PROSES PERMULAAN SISTEM (BOOTSTRAP)
 */
// Semak konfigurasi Firebase sebelum aplikasi bermula
const config = localStorage.getItem('ketick_config');

if (!config) {
    // Jika tiada config, paksa pengguna ke halaman setup
    window.location.href = 'setup.html';
} else {
    // Jika ada config, teruskan dengan semakan login
    document.addEventListener('DOMContentLoaded', () => {
        checkAuthStatus(); // Pastikan user dah login
        renderSidebar();   // Bina menu tepi
        loadModule('dashboard'); // Paparan asal
        
        // Simpan ke window supaya boleh dipanggil dari HTML (onclick)
        window.loadModule = loadModule;
    });
}

/**
 * FUNGSI MUAT TURUN MODUL (SPA ENGINE)
 */
export async function loadModule(moduleName) {
    const viewport = document.getElementById('module-viewport');
    const loader = document.getElementById('loader');
    
    if (loader) loader.classList.remove('hidden');
    
    // Animasi keluar
    viewport.classList.add('opacity-0', 'translate-y-4');
    
    try {
        const response = await fetch(`modules/${moduleName}.html`);
        if (!response.ok) throw new Error(`Modul "${moduleName}" tidak dijumpai.`);
        
        const html = await response.text();
        
        setTimeout(() => {
            viewport.innerHTML = html;
            // Animasi masuk
            viewport.classList.remove('opacity-0', 'translate-y-4');
            viewport.classList.add('opacity-100', 'translate-y-0');
            
            // Jalankan logik JS khusus untuk modul tersebut
            initModuleLogic(moduleName);
        }, 150);

        console.log(`KETICK OS: Modul ${moduleName} dimuatkan.`);
    } catch (err) {
        console.error("Ralat Muat Modul:", err);
        viewport.innerHTML = `
            <div class="p-20 text-center bg-white rounded-[40px] border border-red-50 shadow-sm">
                <i class="fas fa-exclamation-triangle text-red-500 mb-4 text-4xl"></i>
                <h2 class="text-xl font-black text-gray-800">Gagal Memuatkan Modul</h2>
                <p class="text-sm text-gray-400 mt-2 font-medium">${err.message}</p>
                <button onclick="location.reload()" class="mt-8 bg-black text-white px-8 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest">Cuba Lagi</button>
            </div>`;
    } finally {
        if (loader) {
            setTimeout(() => loader.classList.add('hidden'), 300);
        }
    }
}

/**
 * INITIALIZATION LOGIC (PENGHUBUNG JS & HTML MODUL)
 */
function initModuleLogic(name) {
    switch(name) {
        case 'dashboard': renderDashboard(); break;
        case 'inventory': renderInventory(); break;
        case 'crm': renderCRM(); break;
        case 'billing': renderBilling(); break;
        case 'lhdn': renderTax(); break;
        case 'social': renderSocial(); break;
        case 'blast': renderBlast(); break;
        case 'coupons': renderCoupons(); break;
        case 'chatbox': initChatbox(); break;
        case 'history': renderHistory(); break;
    }
}
