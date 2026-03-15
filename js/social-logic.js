import { globalSave } from './database.js';

let socialSchedules = JSON.parse(localStorage.getItem('f6_social')) || [];
let selectedPlatforms = [];

export function renderSocial() {
    const container = document.getElementById('social-queue-list');
    if(!container) return;

    if (socialSchedules.length === 0) {
        container.innerHTML = `<div class="p-20 text-center text-gray-300 font-bold uppercase text-xs tracking-widest">Tiada jadual aktif</div>`;
        return;
    }

    container.innerHTML = socialSchedules.map((item, index) => `
        <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition">
            <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                    ${item.platforms.map(p => `
                        <div class="w-8 h-8 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] shadow-sm">
                            <i class="${getIcon(p)}"></i>
                        </div>
                    `).join('')}
                </div>
                <div>
                    <p class="font-bold text-gray-800 line-clamp-1 text-sm">${item.message}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">${item.time}</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-[9px] font-black px-2 py-1 bg-blue-50 text-blue-600 rounded-md">PENDING</span>
                <button onclick="deleteSchedule(${index})" class="text-gray-300 hover:text-red-500 transition"><i class="fas fa-times"></i></button>
            </div>
        </div>
    `).reverse().join('');
}

function getIcon(p) {
    if(p === 'fb') return 'fab fa-facebook-f text-blue-600';
    if(p === 'tt') return 'fab fa-tiktok text-black';
    if(p === 'tg') return 'fab fa-telegram-plane text-sky-500';
    return 'fas fa-share-alt';
}

window.togglePlatform = (p) => {
    const btn = document.getElementById(`btn-${p}`);
    if (selectedPlatforms.includes(p)) {
        selectedPlatforms = selectedPlatforms.filter(item => item !== p);
        btn.classList.remove('bg-black', 'text-white');
    } else {
        selectedPlatforms.push(p);
        btn.classList.add('bg-black', 'text-white');
    }
}

window.saveSchedule = () => {
    const message = document.getElementById('social-msg').value;
    const time = document.getElementById('social-time').value;

    if(selectedPlatforms.length === 0 || !message) return alert("Sila pilih platform dan isi mesej.");

    const newSchedule = {
        id: Date.now(),
        platforms: [...selectedPlatforms],
        message,
        time: new Date(time).toLocaleString('ms-MY'),
        status: 'queued'
    };

    socialSchedules.push(newSchedule);
    globalSave({ social: socialSchedules });
    
    // Reset & Close
    selectedPlatforms = [];
    renderSocial();
    closeScheduleModal();
};

window.openScheduleModal = () => document.getElementById('social-modal').classList.remove('hidden');
window.closeScheduleModal = () => document.getElementById('social-modal').classList.add('hidden');
