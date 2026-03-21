const Settings = require('../models/Settings.model');

// @GET /api/settings/public — Frontend এর জন্য (protect নেই, sensitive data নেই)
const getPublicSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json({
            success: true,
            settings: {
                facebook_pixel_id: settings?.facebook_pixel_id || '',
                ga_measurement_id: settings?.ga_measurement_id || '',
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @GET /api/settings — Admin এর জন্য (সব data)
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        res.json({ success: true, settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @PUT /api/settings — Admin update
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create({});
        Object.assign(settings, req.body);
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getPublicSettings, getSettings, updateSettings };