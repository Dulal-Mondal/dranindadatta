const crypto = require('crypto');
const axios = require('axios');
const Settings = require('../models/Settings.model');

// SHA-256 hash — Facebook এর requirement
const hashData = (value) => {
    if (!value) return null;
    return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
};

// Phone normalize — +880 format এ convert করো
const normalizePhone = (phone) => {
    if (!phone) return null;
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('0')) p = '880' + p.slice(1);
    if (!p.startsWith('880')) p = '880' + p;
    return '+' + p;
};

// ─── Main function ────────────────────────────────────

const sendFBEvent = async ({ eventName, userData = {}, customData = {}, eventSourceUrl = '' }) => {
    try {
        const settings = await Settings.findOne();

        if (!settings?.facebook_pixel_id || !settings?.facebook_access_token) {
            console.log('[FB CAPI] Not configured, skipping.');
            return;
        }

        const pixelId = settings.facebook_pixel_id;
        const accessToken = settings.facebook_access_token;

        const payload = {
            data: [{
                event_name: eventName,
                event_time: Math.floor(Date.now() / 1000),
                event_source_url: eventSourceUrl || settings.site_url || '',
                action_source: 'website',
                user_data: {
                    em: userData.email ? [hashData(userData.email)] : undefined,
                    ph: userData.phone ? [hashData(normalizePhone(userData.phone))] : undefined,
                    fn: userData.firstName ? [hashData(userData.firstName)] : undefined,
                    ln: userData.lastName ? [hashData(userData.lastName)] : undefined,
                    ct: userData.city ? [hashData(userData.city)] : undefined,
                    country: userData.country ? [hashData(userData.country)] : ['bd'],
                    client_ip_address: userData.ip || undefined,
                    client_user_agent: userData.ua || undefined,
                    fbc: userData.fbc || undefined, // fb click id cookie
                    fbp: userData.fbp || undefined, // fb browser id cookie
                },
                custom_data: customData,
            }],
            test_event_code: settings.fb_test_event_code || undefined,
        };

        // undefined values সরিয়ে দাও
        payload.data[0].user_data = Object.fromEntries(
            Object.entries(payload.data[0].user_data).filter(([_, v]) => v !== undefined)
        );

        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`,
            payload
        );

        console.log('[FB CAPI] Event sent:', eventName, '| Events received:', response.data.events_received);
    } catch (err) {
        console.error('[FB CAPI] Error:', err.response?.data || err.message);
    }
};

// ─── Preset Events ────────────────────────────────────

// Registration
const fbRegistration = async ({ email, phone, firstName, lastName, ip, ua }) => {
    await sendFBEvent({
        eventName: 'CompleteRegistration',
        userData: { email, phone, firstName, lastName, ip, ua },
        customData: { content_name: 'Patient Registration', status: true },
    });
};

// Appointment scheduled
const fbAppointment = async ({ email, phone, fee, doctorName, ip, ua, fbc, fbp }) => {
    await sendFBEvent({
        eventName: 'Schedule',
        userData: { email, phone, ip, ua, fbc, fbp },
        customData: {
            content_name: 'Doctor Appointment',
            content_category: 'Healthcare',
            value: fee,
            currency: 'BDT',
            content_ids: [doctorName],
        },
    });
};

// Payment / Purchase
const fbPurchase = async ({ email, phone, amount, transactionId, ip, ua, fbc, fbp }) => {
    await sendFBEvent({
        eventName: 'Purchase',
        userData: { email, phone, ip, ua, fbc, fbp },
        customData: {
            value: amount,
            currency: 'BDT',
            content_name: 'Appointment Payment',
            order_id: transactionId,
        },
    });
};

// Doctor profile view
const fbViewContent = async ({ email, phone, doctorName, specialization, fee, ip, ua }) => {
    await sendFBEvent({
        eventName: 'ViewContent',
        userData: { email, phone, ip, ua },
        customData: {
            content_name: doctorName,
            content_category: specialization,
            value: fee,
            currency: 'BDT',
        },
    });
};

module.exports = { fbRegistration, fbAppointment, fbPurchase, fbViewContent, sendFBEvent };