const crypto = require('crypto');
const Settings = require('../models/Settings.model');

// SHA-256 hash — Google এর requirement for Enhanced Conversions
const hashData = (value) =>
    crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');

const sendConversion = async ({ transactionId, value, email, phone }) => {
    try {
        const settings = await Settings.findOne();

        // Credentials না থাকলে silently skip করো
        if (!settings?.google_ads_developer_token) {
            console.log('[GoogleAds] Not configured, skipping conversion.');
            return;
        }

        const { GoogleAdsApi } = require('google-ads-api');

        const client = new GoogleAdsApi({
            client_id: settings.google_ads_client_id,
            client_secret: settings.google_ads_client_secret,
            developer_token: settings.google_ads_developer_token,
        });

        const customer = client.Customer({
            customer_id: settings.google_ads_customer_id,
            refresh_token: settings.google_ads_refresh_token,
        });

        const conversionTime = new Date()
            .toISOString()
            .replace('T', ' ')
            .replace(/\.\d{3}Z/, '+0000');

        const userIdentifiers = [];
        if (email) userIdentifiers.push({ hashed_email: hashData(email) });
        if (phone) userIdentifiers.push({ hashed_phone_number: hashData(phone) });

        await customer.conversionUploads.uploadClickConversions({
            conversions: [{
                conversion_action: `customers/${settings.google_ads_customer_id}/conversionActions/${settings.google_ads_conversion_id}`,
                conversion_date_time: conversionTime,
                conversion_value: value,
                currency_code: 'BDT',
                order_id: transactionId,
                user_identifiers: userIdentifiers,
            }],
            partial_failure: true,
        });

        console.log('[GoogleAds] Conversion uploaded:', transactionId);
    } catch (err) {
        // Conversion fail হলেও main payment flow fail করবে না
        console.error('[GoogleAds] Conversion error:', err.message);
    }
};

module.exports = { sendConversion };