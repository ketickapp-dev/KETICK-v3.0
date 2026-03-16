export function renderHistory() {
    const container = document.getElementById('history-list');
    const logs = JSON.parse(localStorage.getItem('ketick_history')) || [];

    if (logs.length === 0) {
        container.innerHTML = `
            <div class="p-20 text-center">
                <i class="fas fa-clock-rotate-left text-4xl text-gray-100 mb-4"></i>
                <p class="text-gray-400 font-bold">Tiada rekod aktiviti setakat ini.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = logs.map(log => `
        <div class="p-5 flex justify-between items-center hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 ${getLogColor(log.type)} rounded-xl flex items-center justify-center text-xs">
                    <i class="${getLogIcon(log.type)}"></i>
                </div>
                <div>
                    <p class="text-sm font-bold text-gray-800">${log.action}</p>
                    <p class="text-[9px] text-gray-400 font-black uppercase">${log.time}</p>
                </div>
            </div>
            <span class="text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-1 rounded uppercase">${log.type}</span>
        </div>
    `).join('');

    window.clearHistory = () => {
        if (confirm("Adakah anda pasti mahu memadam semua log aktiviti?")) {
            localStorage.removeItem('ketick_history');
            renderHistory();
        }
    };
}

function getLogIcon(type) {
    switch(type) {
        case 'CHAT': return 'fab fa-whatsapp';
        case 'BILLING': return 'fas fa-file-invoice';
        case 'COUPON': return 'fas fa-ticket-alt';
        default: return 'fas fa-info-circle';
    }
}

function getLogColor(type) {
    switch(type) {
        case 'CHAT': return 'bg-emerald-50 text-emerald-600';
        case 'BILLING': return 'bg-blue-50 text-blue-600';
        case 'COUPON': return 'bg-indigo-50 text-indigo-600';
        default: return 'bg-gray-50 text-gray-600';
    }
}
