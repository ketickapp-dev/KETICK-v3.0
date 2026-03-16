import { utils } from './utils.js';

export function initChatbox() {
    console.log("Chatbox Module Ready.");
    
    // Bind fungsi ke window supaya butang onclick dalam HTML boleh jumpa
    window.sendWA = () => {
        const phoneInput = document.getElementById('chat-phone').value;
        const message = document.getElementById('chat-msg').value;

        if (!phoneInput || !message) {
            alert("Sila masukkan nombor telefon dan mesej.");
            return;
        }

        // Gunakan utils untuk bersihkan nombor (buang dash, space, dll)
        const cleanPhone = utils.cleanPhone(phoneInput);
        
        // Pastikan nombor bermula dengan 60 (Malaysia) jika pengguna lupa taip
        let finalPhone = cleanPhone;
        if (finalPhone.startsWith('0')) {
            finalPhone = '6' + finalPhone;
        } else if (!finalPhone.startsWith('60')) {
            finalPhone = '60' + finalPhone;
        }

        // Encode mesej supaya URL-friendly
        const encodedMsg = encodeURIComponent(message);

        // Link WhatsApp API (Bekerja pada Desktop & Mobile)
        const waUrl = `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodedMsg}`;

        // Buka aplikasi WhatsApp
        window.open(waUrl, '_blank');
        
        // Rekod ke history (opsional)
        console.log(`Mesej dihantar ke: ${finalPhone}`);
    };
}
