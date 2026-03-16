export function initChatbox() {
    const templateContainer = document.getElementById('template-list');
    
    // 1. Render senarai template yang tersimpan
    renderTemplates();

    // 2. Fungsi untuk hantar WhatsApp
    window.sendWA = () => {
        const phone = document.getElementById('chat-phone').value;
        const message = document.getElementById('chat-msg').value;

        if (!phone || !message) return alert("Sila masukkan nombor dan mesej.");

        let cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '6' + cleanPhone;
        else if (!cleanPhone.startsWith('60')) cleanPhone = '60' + cleanPhone;

        // Rekod ke History
        addChatHistory(`Mesej dihantar ke +${cleanPhone}`);

        const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // 3. Fungsi simpan template baru
    window.saveTemplate = () => {
        const title = prompt("Nama Template (cth: Follow Up):");
        const body = document.getElementById('chat-msg').value;

        if (!title || !body) return alert("Sila tulis mesej dahulu.");

        const templates = JSON.parse(localStorage.getItem('ketick_templates')) || [];
        templates.push({ title, body });
        localStorage.setItem('ketick_templates', JSON.stringify(templates));
        renderTemplates();
    };
}

function renderTemplates() {
    const container = document.getElementById('template-list');
    const templates = JSON.parse(localStorage.getItem('ketick_templates')) || [
        { title: "Sapaan Mesra", body: "Salam tuan/puan, saya dari KETICK OS. Ada apa yang boleh saya bantu?" },
        { title: "Follow Up Bayaran", body: "Salam, ini adalah peringatan mesra mengenai invois anda yang belum dijelaskan. Terima kasih." }
    ];

    if (!container) return;

    container.innerHTML = templates.map((t, index) => `
        <button onclick="useTemplate(${index})" class="text-left p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition group">
            <p class="text-[10px] font-black text-blue-600 uppercase mb-1">${t.title}</p>
            <p class="text-xs text-gray-500 line-clamp-2 font-medium">${t.body}</p>
        </button>
    `).join('');

    window.useTemplate = (index) => {
        document.getElementById('chat-msg').value = templates[index].body;
    };
}

function addChatHistory(msg) {
    const logs = JSON.parse(localStorage.getItem('ketick_history')) || [];
    logs.unshift({ id: Date.now(), action: msg, type: 'CHAT', time: new Date().toLocaleString('ms-MY') });
    localStorage.setItem('ketick_history', JSON.stringify(logs.slice(0, 50)));
}
