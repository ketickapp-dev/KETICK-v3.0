import { loadModule } from './main.js';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', color: 'text-gray-500' },
    { id: 'inventory', label: 'Inventory', icon: 'fa-th-large', color: 'text-gray-500' },
    { id: 'crm', label: 'CRM Database', icon: 'fa-user-friends', color: 'text-gray-500' },
    { id: 'billing', label: 'Billing', icon: 'fa-receipt', color: 'text-gray-500' },
    { id: 'coupons', label: 'Coupon Manager', icon: 'fa-ticket-alt', color: 'text-indigo-600' },
    { id: 'chatbox', label: 'Direct Chat', icon: 'fa-comments', color: 'text-emerald-600' },
    { id: 'social', label: 'Social Hub', icon: 'fa-share-nodes', color: 'text-pink-600' },
    { id: 'blast', label: 'Smart Blast', icon: 'fa-paper-plane', color: 'text-blue-600' },
    { id: 'lhdn', label: 'LHDN Tax', icon: 'fa-file-invoice-dollar', color: 'text-orange-600' },
    { id: 'history', label: 'History Log', icon: 'fa-history', color: 'text-gray-400' }
];

export function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    
    const sidebarHTML = `
        <aside class="w-72 bg-white/70 backdrop-blur-xl border-r border-gray-200 p-6 flex flex-col h-screen sticky top-0">
            <div class="mb-10 flex items-center gap-3 px-2">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><i class="fas fa-bolt text-white"></i></div>
                <div>
                    <h1 class="font-extrabold text-xl tracking-tighter">KETICK OS</h1>
                    <span class="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">V6 FLUX</span>
                </div>
            </div>

            <nav class="space-y-1 flex-1 overflow-y-auto pr-1" id="nav-menu">
                ${menuItems.map(item => `
                    <button data-module="${item.id}" class="nav-btn w-full text-left p-4 rounded-2xl flex items-center gap-4 font-semibold text-sm transition-all duration-200 hover:bg-gray-100 ${item.color}">
                        <i class="fas ${item.icon} w-5"></i> ${item.label}
                    </button>
                `).join('')}
            </nav>

            <div class="pt-6 border-t border-gray-100 space-y-3">
                <p class="text-[9px] text-center font-bold text-gray-300 uppercase">System by AzlanMymo</p>
                <button onclick="location.href='setup.html'" class="w-full p-3 text-xs font-bold text-gray-400 hover:text-blue-600 transition flex items-center justify-center gap-2">
                    <i class="fas fa-cog"></i> API SETTINGS
                </button>
            </div>
        </aside>
    `;

    container.innerHTML = sidebarHTML;
    setupNavListeners();
}

function setupNavListeners() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const moduleId = e.currentTarget.dataset.module;
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-200'));
            btn.classList.add('bg-blue-600', 'text-white', 'shadow-lg', 'shadow-blue-200');
            loadModule(moduleId);
        });
    });
}
