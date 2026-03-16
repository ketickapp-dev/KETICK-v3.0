import { renderSidebar } from './ui.js';

// Import Logik Modul
import { renderDashboard } from './dashboard-logic.js';
import { renderInventory } from './inventory-logic.js';
import { renderCRM } from './crm-logic.js';
import { renderBilling } from './billing-logic.js';
import { renderTax } from './tax-logic.js';
import { renderSocial } from './social-logic.js';
import { renderBlast } from './blast-logic.js';
import { renderCoupons } from './coupon-logic.js';
import { initChatbox } from './chat-logic.js';
import { renderHistory } from './history-logic.js';

document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    loadModule('dashboard'); 
    window.loadModule = loadModule;
});

export async function loadModule(moduleName) {
    const viewport = document.getElementById('module-viewport');
    const loader = document.getElementById('loader');
    
    if (loader) loader.classList.remove('hidden');
    viewport.classList.add('opacity-0', 'translate-y-4');
    
    try {
        const response = await fetch(`modules/${moduleName}.html`);
        if (!response.ok) throw new Error(`Modul ${moduleName} tidak dijumpai.`);
        
        const html = await response.text();
        
        setTimeout(() => {
            viewport.innerHTML = html;
            viewport.classList.remove('opacity-0', 'translate-y-4');
            viewport.classList.add('opacity-100', 'translate-y-0');
            initModuleLogic(moduleName);
        }, 150);

    } catch (err) {
        console.error("Ralat:", err);
        viewport.innerHTML = `<div class="p-20 text-center bg-white rounded-[40px]"><h2 class="text-xl font-bold">Ralat Muat Turun Halaman</h2></div>`;
    } finally {
        if (loader) setTimeout(() => loader.classList.add('hidden'), 300);
    }
}

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
