// js/chatbox-logic.js
import { utils } from './utils.js';

const defaultTemplates = [
    { 
        title: "Sapaan Leads Baru", 
        body: "Salam Tuan/Puan, terima kasih kerana berminat dengan produk kami. Boleh saya tahu, Tuan/Puan berminat untuk tahu tentang pakej yang mana satu ya? 😊" 
    },
    { 
        title: "Soft Sell / Edukasi", 
        body: "Salam! Tahukah anda, ramai usahawan mula beralih kepada sistem automatik untuk jimatkan masa 4 jam sehari? Nak saya kongsikan caranya?" 
    },
    { 
        title: "Closing / Info Bank", 
        body: "Baik, Tuan/Puan. Untuk pengesahan order, boleh buat pembayaran ke akaun berikut:\n\nMaybank: 1234567890 (KETICK SOLUTIONS)\n\nSila lampirkan resit selepas bayaran dibuat ya. Terima kasih!" 
    },
    { 
        title: "Follow Up (No Response)", 
        body: "Salam, maaf mengganggu. Saya cuma nak pastikan Tuan/Puan ada terima info pakej yang saya hantar kelmarin? Jika ada soalan, tanya saja ya." 
    },
    { 
        title: "Resit & Penghantaran", 
        body: "Terima kasih atas pembelian! Order anda sedang diproses. Kami akan hantar nombor tracking dalam masa 24 jam. Harap maklum." 
    }
];

export function initChatbox() {
    // 1. Render senarai template yang tersimpan atau default
    renderTemplates();

    // 2. Fungsi untuk hantar WhatsApp
    window.sendWA = () => {
        const phone = document.getElementById('chat-phone').value;
        const message = document.getElementById('chat-msg').value;

        if (!phone || !message) return alert("Sila masukkan nombor dan mesej.");

        // MENGGUNAKAN UTILS UNTUK BERSIHKAN NOMBOR
        let cleanPhone = utils.cleanPhone(phone);
        
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '6' + cleanPhone;
        } else if (!cleanPhone.startsWith('6')) {
            // Jika user terus taip 123..., kita tambah 60
            cleanPhone = '60' + cleanPhone;
        }

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

        const templates = JSON.parse(localStorage.getItem('ketick_templates')) || defaultTemplates;
        templates.push({ title, body });
        localStorage.setItem('ketick_templates', JSON.stringify(templates));
        renderTemplates();
        alert("Template berjaya disimpan!");
    };
}

function renderTemplates() {
    const container = document.getElementById('template-list');
    const templates = JSON.parse(localStorage.getItem('ketick_templates')) || defaultTemplates;

    if (!container) return;

    container.innerHTML = templates.map((t, index) => `
        <button onclick="useTemplate(${index})" class="text-left p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition group mb-2 w-full">
            <p class="text-[10px] font-black text-blue-600 uppercase mb-1">${t.title}</p>
            <p class="text-xs text-gray-500 line-clamp-2 font-medium">${t.body}</p>
        </button>
    `).join('');

    window.useTemplate = (index) => {
        const currentTemplates = JSON.parse(localStorage.getItem('ketick_templates')) || defaultTemplates;
        document.getElementById('chat-msg').value = currentTemplates[index].body;
        
        const textarea = document.getElementById('chat-msg');
        textarea.focus();
        textarea.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => textarea.classList.remove('ring-2', 'ring-blue-500'), 400);
    };
}

function addChatHistory(msg) {
    const logs = JSON.parse(localStorage.getItem('ketick_history')) || [];
    logs.unshift({ 
        id: Date.now(), 
        action: msg, 
        type: 'CHAT', 
        time: new Date().toLocaleString('ms-MY') 
    });
    localStorage.setItem('ketick_history', JSON.stringify(logs.slice(0, 50)));
}
