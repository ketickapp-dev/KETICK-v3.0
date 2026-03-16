import { globalSave } from './database.js';
import { utils } from './utils.js';

let socialSchedules = JSON.parse(localStorage.getItem('f6_social')) || [];
let selectedPlatforms = [];

/**
 * Render utama untuk modul Social AutoHub
 */
export function renderSocial() {
    const container = document.getElementById('social-queue-list');
    if(!container) return;

    if (socialSchedules.length === 0) {
        container.innerHTML = `
            <div class="p-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-[0.2em]">
                <i class="fas fa-share-alt text-2xl mb-3 block opacity-20"></i>
                Tiada jadual aktif
            </div>`;
        return;
    }

    container.innerHTML = socialSchedules.map((item, index) => `
        <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition border-l-4 border-transparent hover:border-pink-500">
            <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                    ${item.platforms.map(p => `
                        <div class="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] shadow-sm">
                            <i class="${getIcon(p)}"></i>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <p class="font-bold text-gray-800 line-clamp-1 text-sm">${utils.truncateText(item.message, 35)}</p>
                    <p class="text-[10px] text-gray-400 font-black uppercase tracking-tighter">${item.time}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-[9px] font-black px-2 py-1 bg-blue-50 text-blue-600 rounded-md">QUEUED</span>
                <button onclick="deleteSchedule(${index})" class="text-gray-200 hover:text-red-500 transition p-2">
                    <i class="fas fa-trash-alt text-xs"></i>
                </button>
            </div>
        </div>
    `).reverse().join('');
}

/**
 * Helper untuk ikon platform
 */
function getIcon(p) {
    const icons = {
        'fb': 'fab fa-facebook-f text-blue-600',
        'tt': 'fab fa-tiktok text-black',
        'tg': 'fab fa-telegram-plane text-sky-500'
    };
    return icons[p] || 'fas fa-share-alt text-gray-400';
}

/**
 * Toggle platform pilihan dalam modal
 */
window.togglePlatform = (p) => {
    const btn = document.getElementById(`btn-${p}`);
    if (selectedPlatforms.includes(p)) {
        selectedPlatforms = selectedPlatforms.filter(item => item !== p);
        btn.classList.remove('bg-black', 'text-white', 'border-black');
    } else {
        selectedPlatforms.push(p);
        btn.classList.add('bg-black', 'text-white', 'border-black');
    }
};

/**
 * Simpan jadual pemasaran baru
 */
window.saveSchedule = () => {
    const message = document.getElementById('social-msg').value;
    const timeInput = document.getElementById('social-time').value;

    if(selectedPlatforms.length === 0 || !message || !timeInput) {
        alert("Sila pilih platform, tulis mesej dan tetapkan masa.");
        return;
    }

    const newSchedule = {
        id: utils.generateID('SOC'),
        platforms: [...selectedPlatforms],
        message,
        // Gunakan formatDate untuk simpanan tarikh yang cantik
        time: new Date(timeInput).toLocaleString('ms-MY', { 
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
        }),
        status: 'queued',
        createdAt: new Date().toISOString()
    };

    socialSchedules.push(newSchedule);
    
    // Sync ke Cloud & LocalStorage
    globalSave({ social: socialSchedules });
    
    // Reset state & UI
    selectedPlatforms = [];
    renderSocial();
    closeScheduleModal();
    
    // Reset form fields
    document.getElementById('social-msg').value = '';
    document.getElementById('social-time').value = '';
    ['fb', 'tt', 'tg'].forEach(p => {
        document.getElementById(`btn-${p}`).classList.remove('bg-black', 'text-white', 'border-black');
    });
};

/**
 * Padam jadual
 */
window.deleteSchedule = (index) => {
    if(confirm("Padam jadual konten ini?")) {
        socialSchedules.splice(index, 1);
        globalSave({ social: socialSchedules });
        renderSocial();
    }
};

// Modal Controls
window.openScheduleModal = () => document.getElementById('social-modal').classList.remove('hidden');
window.closeScheduleModal = () => document.getElementById('social-modal').classList.add('hidden');
