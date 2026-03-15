let clients = JSON.parse(localStorage.getItem('f6_clients')) || [];

export function renderBlast() {
    const listContainer = document.getElementById('blast-client-list');
    if(!listContainer) return;

    if (clients.length === 0) {
        listContainer.innerHTML = `<div class="p-20 text-center text-gray-300 font-bold text-xs">Sila tambah pelanggan di CRM dahulu</div>`;
        return;
    }

    listContainer.innerHTML = clients.map((c, index) => `
        <div class="p-6 flex items-center justify-between hover:bg-gray-50 transition">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 text-xs">
                    ${c.name.charAt(0)}
                </div>
                <div>
                    <p class="font-bold text-gray-800 text-sm">${c.name}</p>
                    <p class="text-[10px] text-gray-400 font-bold">${c.phone}</p>
                </div>
            </div>
            <div id="status-${index}">
                <button onclick="sendSingleBlast(${index})" class="text-emerald-500 hover:bg-emerald-50 p-3 rounded-xl transition">
                    <i class="fab fa-whatsapp text-xl"></i>
                </button>
            </div>
        </div>
    `).join('');
}

window.sendSingleBlast = (index) => {
    const client = clients[index];
    const rawMsg = document.getElementById('blast-msg').value;
    const platform = document.getElementById('blast-platform').value;

    if(!rawMsg) return alert("Sila tulis mesej terlebih dahulu.");

    // Personalisasi Nama
    const finalMsg = encodeURIComponent(rawMsg.replace('[NAMA]', client.name));
    
    let url = "";
    if(platform === 'wa') {
        // Format nombor Malaysia (buang simbol + jika ada)
        const phone = client.phone.startsWith('6') ? client.phone : `6${client.phone}`;
        url = `https://api.whatsapp.com/send?phone=${phone}&text=${finalMsg}`;
    } else {
        url = `https://t.me/share/url?url=${window.location.href}&text=${finalMsg}`;
    }

    // Buka pautan
    window.open(url, '_blank');
    
    // Kemaskini UI status
    document.getElementById(`status-${index}`).innerHTML = `<i class="fas fa-check-circle text-emerald-500"></i>`;
};

window.startBlast = () => {
    alert("Smart Blast Mode: Sila klik butang hijau pada senarai pelanggan untuk menghantar secara manual satu per satu bagi mengelakkan akaun di-banned.");
};
