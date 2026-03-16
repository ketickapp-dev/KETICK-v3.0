/**
 * KETICK OS - Utility Tools
 * Membantu menyeragamkan format data di seluruh sistem.
 */

export const utils = {
    /**
     * Format nombor ke Ringgit Malaysia (RM 0.00)
     */
    formatRM: (amount) => {
        const val = parseFloat(amount) || 0;
        return new Intl.NumberFormat('ms-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 2
        }).format(val);
    },

    /**
     * Format tarikh ke gaya Malaysia (16 Mac 2026)
     */
    formatDate: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ms-MY', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },

    /**
     * Menghasilkan ID unik untuk transaksi (Inv-XXXX)
     */
    generateID: (prefix = 'ID') => {
        return `${prefix}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    },

    /**
     * Memotong teks yang terlalu panjang (untuk UI mobile)
     */
    truncateText: (text, limit = 20) => {
        if (!text) return "";
        if (text.length <= limit) return text;
        return text.slice(0, limit) + '...';
    },

    /**
     * Membersihkan nombor telefon (buang +, -, space)
     * Contoh: +60 12-345 -> 6012345
     */
    cleanPhone: (phone) => {
        if (!phone) return "";
        return phone.replace(/[^0-9]/g, '');
    }
};
