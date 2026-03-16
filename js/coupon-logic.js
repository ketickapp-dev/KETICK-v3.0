// js/coupon-logic.js

export function renderCoupons() {
    const listContainer = document.getElementById('coupon-list');
    const savedCoupons = JSON.parse(localStorage.getItem('ketick_coupons')) || [];
    
    listContainer.innerHTML = savedCoupons.map((cp, index) => `
        <div class="bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">
                <button onclick="deleteCoupon(${index})" class="text-red-400"><i class="fas fa-trash"></i></button>
            </div>
            <p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Promo Code</p>
            <h3 class="text-xl font-black text-gray-800">${cp.code}</h3>
            <div class="mt-4 flex items-center justify-between">
                <span class="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
                    ${cp.type === 'RM' ? 'RM ' + cp.value : cp.value + '% OFF'}
                </span>
            </div>
        </div>
    `).join('');

    // Window Functions for Modal
    window.openCouponModal = () => document.getElementById('coupon-modal').classList.remove('hidden');
    window.closeCouponModal = () => document.getElementById('coupon-modal').classList.add('hidden');
    window.saveCoupon = () => {
        const code = document.getElementById('cp-code').value.toUpperCase();
        const value = document.getElementById('cp-value').value;
        const type = document.getElementById('cp-type').value;

        if(!code || !value) return alert("Sila lengkapkan maklumat.");

        savedCoupons.push({ code, value: parseFloat(value), type });
        localStorage.setItem('ketick_coupons', JSON.stringify(savedCoupons));
        closeCouponModal();
        renderCoupons();
    };

    window.deleteCoupon = (index) => {
        savedCoupons.splice(index, 1);
        localStorage.setItem('ketick_coupons', JSON.stringify(savedCoupons));
        renderCoupons();
    };
}

/**
 * Fungsi untuk digunakan dalam modul Billing
 * Guna: const discount = checkCoupon('RAYA2026', 100);
 */
export function applyCoupon(code, currentTotal) {
    const savedCoupons = JSON.parse(localStorage.getItem('ketick_coupons')) || [];
    const coupon = savedCoupons.find(c => c.code === code.toUpperCase());

    if (!coupon) return { error: "Kod tidak sah", discount: 0 };

    let discountValue = 0;
    if (coupon.type === 'RM') {
        discountValue = coupon.value;
    } else {
        discountValue = (coupon.value / 100) * currentTotal;
    }

    return { 
        success: true, 
        discount: discountValue, 
        newTotal: currentTotal - discountValue 
    };
}
