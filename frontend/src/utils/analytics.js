let GA_ID = '';
let initialized = false;

// Admin panel থেকে আসা measurementId দিয়ে init করো
export const initGA = (measurementId) => {
    if (!measurementId || initialized) return;

    // Dynamically script inject করো
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    GA_ID = measurementId;
    initialized = true;
    console.log('[GA4] Initialized:', measurementId);
};

export const trackPageView = (path) => {
    if (!initialized || !window.gtag) return;
    window.gtag('config', GA_ID, { page_path: path });
};

export const trackEvent = (action, category, label = '', value = 0) => {
    if (!initialized || !window.gtag) return;
    window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value,
    });
};

// ─── Preset Events ───────────────────────────────────

export const gaRegistration = () =>
    trackEvent('sign_up', 'User', 'Patient Registration');

export const gaLogin = () =>
    trackEvent('login', 'User', 'Patient Login');

export const gaAppointment = (doctorName, fee) =>
    trackEvent('schedule', 'Appointment', doctorName, fee);

export const gaPurchase = (amount, transactionId) => {
    if (!window.gtag) return;
    window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: amount,
        currency: 'BDT',
        items: [{
            item_name: 'Doctor Appointment',
            item_category: 'Healthcare',
            price: amount,
            quantity: 1,
        }],
    });
};

export const gaViewDoctor = (doctorName, fee) => {
    if (!window.gtag) return;
    window.gtag('event', 'view_item', {
        currency: 'BDT',
        value: fee,
        items: [{
            item_name: doctorName,
            item_category: 'Doctor',
            price: fee,
        }],
    });
};