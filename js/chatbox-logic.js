<section class="section-animate">
    <div class="mb-8">
        <h2 class="text-3xl font-black tracking-tight text-gray-800">Direct Chatbox</h2>
        <p class="text-gray-500 text-sm font-medium">Gunakan template professional untuk respon pantas kepada pelanggan.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <div class="space-y-4">
                    <div class="relative group">
                        <label class="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 block group-focus-within:text-emerald-500 transition">Nombor Telefon</label>
                        <div class="flex gap-3">
                            <div class="bg-gray-100 px-5 py-4 rounded-2xl font-bold text-gray-500 flex items-center">+60</div>
                            <input type="number" id="chat-phone" placeholder="123456789" class="flex-1 p-5 bg-gray-50 rounded-2xl border-none outline-none font-bold text-lg focus:ring-2 focus:ring-emerald-500 transition-all">
                        </div>
                    </div>

                    <div class="relative group">
                        <label class="text-[10px] font-black text-gray-400 uppercase ml-4 mb-2 block group-focus-within:text-blue-500 transition">Isi Mesej</label>
                        <textarea id="chat-msg" placeholder="Pilih template di sebelah atau tulis mesej manual di sini..." class="w-full p-6 bg-gray-50 rounded-[30px] border-none outline-none font-medium h-72 focus:ring-2 focus:ring-blue-500 transition-all leading-relaxed"></textarea>
                    </div>
                </div>
                
                <div class="flex flex-col md:flex-row gap-4 mt-8">
                    <button onclick="saveTemplate()" class="flex-1 bg-gray-100 text-gray-600 py-5 rounded-[25px] font-bold active:scale-95 transition hover:bg-gray-200">
                        <i class="fas fa-save mr-2"></i> SIMPAN SEBAGAI TEMPLATE
                    </button>
                    <button onclick="sendWA()" class="flex-[2] bg-emerald-500 text-white py-5 rounded-[25px] font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 active:scale-95 transition hover:bg-emerald-600">
                        <i class="fab fa-whatsapp text-2xl"></i> HANTAR WHATSAPP
                    </button>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <div class="flex justify-between items-center px-2">
                <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest">Quick Templates</h4>
                <span id="temp-count" class="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">5</span>
            </div>
            
            <div id="template-list" class="grid grid-cols-1 gap-3 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar">
                </div>
        </div>
    </div>
</section>

<style>
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
    }
</style>

<script>
    // Data Template Professional yang anda berikan
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

    // Fungsi untuk render template ke dalam sidebar chatbox
    function displayTemplates() {
        const container = document.getElementById('template-list');
        const saved = JSON.parse(localStorage.getItem('ketick_templates')) || defaultTemplates;
        
        document.getElementById('temp-count').innerText = saved.length;

        container.innerHTML = saved.map((t, index) => `
            <button onclick="useTemplate(${index})" class="text-left p-5 rounded-3xl bg-white border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group relative">
                <p class="text-[10px] font-black text-blue-600 uppercase mb-1 tracking-tight">${t.title}</p>
                <p class="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">${t.body}</p>
                <div class="absolute right-4 top-5 opacity-0 group-hover:opacity-100 transition">
                    <i class="fas fa-chevron-right text-blue-300 text-xs"></i>
                </div>
            </button>
        `).join('');

        window.useTemplate = (idx) => {
            const selected = saved[idx];
            document.getElementById('chat-msg').value = selected.body;
            // Kesan visual sikit bila pilih
            document.getElementById('chat-msg').classList.add('ring-2', 'ring-blue-500');
            setTimeout(() => document.getElementById('chat-msg').classList.remove('ring-2', 'ring-blue-500'), 500);
        };
    }

    // Jalankan render sebaik sahaja modul dimuatkan
    displayTemplates();
</script>
