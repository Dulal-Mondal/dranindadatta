export const formatCurrency = (amount, currency = 'BDT') => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
};

export const formatBDT = (amount) => `৳ ${amount?.toLocaleString('en-BD')}`;