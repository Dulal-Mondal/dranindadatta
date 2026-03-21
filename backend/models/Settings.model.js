const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        // Google Analytics
        ga_measurement_id: { type: String, default: '' },

        // Facebook Pixel + Conversions API
        facebook_pixel_id: { type: String, default: '' },
        facebook_access_token: { type: String, default: '' }, // CAPI access token
        fb_test_event_code: { type: String, default: '' },  // Test Events এ verify করতে

        // Site URL — FB CAPI event_source_url এর জন্য
        site_url: { type: String, default: '' },

        // Google Ads Conversion API
        google_ads_client_id: { type: String, default: '' },
        google_ads_client_secret: { type: String, default: '' },
        google_ads_developer_token: { type: String, default: '' },
        google_ads_refresh_token: { type: String, default: '' },
        google_ads_customer_id: { type: String, default: '' },
        google_ads_conversion_id: { type: String, default: '' },

        // SSLCommerz
        ssl_store_id: { type: String, default: '' },
        ssl_store_password: { type: String, default: '' },
        ssl_is_live: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);