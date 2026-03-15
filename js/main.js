// js/main.js
export async function loadModule(moduleName) {
    const viewport = document.getElementById('module-viewport');
    const loader = document.getElementById('loader');
    
    loader.classList.remove('hidden');
    
    try {
        const response = await fetch(`modules/${moduleName}.html`);
        const html = await response.text();
        viewport.innerHTML = html;
        
        // Inisialisasi fungsi spesifik modul selepas load
        initModuleLogic(moduleName);
        
    } catch (err) {
        console.error("Gagal memuatkan modul:", err);
        viewport.innerHTML = "<h2>Ralat memuatkan halaman.</h2>";
    } finally {
        loader.classList.add('hidden');
    }
}

function initModuleLogic(name) {
    if (name === 'inventory') renderInventory();
    if (name === 'dashboard') renderDashboard();
    // Tambah logic lain di sini
}

// Event listener untuk menu
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.currentTarget.dataset.module;
        loadModule(target);
    });
});
