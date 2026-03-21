import ReactPixel from 'react-facebook-pixel';

let initialized = false;

// Admin panel থেকে আসা pixelId দিয়ে init করো
export const initPixel = (pixelId) => {
    if (!pixelId || initialized) return;
    ReactPixel.init(pixelId, {}, { autoConfig: true, debug: false });
    initialized = true;
    console.log('[Pixel] Initialized:', pixelId);
};

export const trackPageView = () => {
    if (!initialized) return;
    ReactPixel.pageView();
};

export const trackEvent = (event, data = {}) => {
    if (!initialized) return;
    ReactPixel.track(event, data);
};

// ─── Preset Events ───────────────────────────────────

export const pixelRegistration = () =>
    trackEvent('CompleteRegistration', { content_name: 'Patient Registration' });

export const pixelAppointment = (fee) =>
    trackEvent('Schedule', { content_name: 'Doctor Appointment', value: fee, currency: 'BDT' });

export const pixelPurchase = (amount, transactionId) =>
    trackEvent('Purchase', { value: amount, currency: 'BDT', content_name: 'Appointment Payment', order_id: transactionId });

export const pixelViewDoctor = (doctorName, specialization) =>
    trackEvent('ViewContent', { content_name: doctorName, content_type: specialization });