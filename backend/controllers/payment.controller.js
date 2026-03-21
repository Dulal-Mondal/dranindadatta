// const Payment = require('../models/Payment.model');
// const Appointment = require('../models/Appointment.model');

// // SSLCommerz success callback
// const paymentSuccess = async (req, res) => {
//     const { appointmentId, transactionId } = req.query;

//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//         return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
//     }

//     // payment update
//     await Payment.findOneAndUpdate(
//         { transactionId },
//         { status: 'success', paidAt: new Date() }
//     );

//     // appointment update
//     appointment.isPaid = true;
//     appointment.paymentInfo = {
//         transactionId,
//         method: 'sslcommerz',
//         paidAt: new Date(),
//     };
//     await appointment.save();

//     res.redirect(`${process.env.CLIENT_URL}/payment/success?appointmentId=${appointmentId}`);
// };

// // SSLCommerz fail callback
// const paymentFail = async (req, res) => {
//     const { appointmentId } = req.query;

//     await Appointment.findByIdAndDelete(appointmentId);

//     res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
// };

// // SSLCommerz cancel callback
// const paymentCancel = async (req, res) => {
//     const { appointmentId } = req.query;

//     await Appointment.findByIdAndDelete(appointmentId);

//     res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
// };

// // Patient er payment history
// const getMyPayments = async (req, res) => {
//     const payments = await Payment.find({ patient: req.user._id })
//         .populate('doctor', 'name')
//         .populate('appointment', 'appointmentDate timeSlot status')
//         .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, payments });
// };

// module.exports = { paymentSuccess, paymentFail, paymentCancel, getMyPayments };



const Payment = require('../models/Payment.model');
const Appointment = require('../models/Appointment.model');
const { fbPurchase } = require('../services/facebookService');
const { sendConversion } = require('../services/conversionService');

// SSLCommerz success callback
const paymentSuccess = async (req, res) => {
    try {
        const { appointmentId, transactionId } = req.query;

        const appointment = await Appointment.findById(appointmentId)
            .populate('patient', 'name email phone');

        if (!appointment) {
            return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
        }

        // Payment update
        await Payment.findOneAndUpdate(
            { transactionId },
            { status: 'success', paidAt: new Date() }
        );

        // Appointment update
        appointment.isPaid = true;
        appointment.paymentInfo = {
            transactionId,
            method: 'sslcommerz',
            paidAt: new Date(),
        };
        await appointment.save();

        // ✅ Facebook Conversions API — Purchase event
        await fbPurchase({
            email: appointment.patient?.email,
            phone: appointment.patient?.phone,
            amount: appointment.fee,
            transactionId,
            ip: req.ip,
            ua: req.headers['user-agent'],
            fbc: req.cookies?._fbc,
            fbp: req.cookies?._fbp,
        });

        // ✅ Google Ads Conversion API
        await sendConversion({
            transactionId,
            value: appointment.fee,
            email: appointment.patient?.email,
            phone: appointment.patient?.phone,
        });

        res.redirect(`${process.env.CLIENT_URL}/payment/success?appointmentId=${appointmentId}`);
    } catch (err) {
        console.error('paymentSuccess error:', err);
        res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    }
};

// SSLCommerz fail callback
const paymentFail = async (req, res) => {
    try {
        const { appointmentId } = req.query;
        await Appointment.findByIdAndDelete(appointmentId);
        res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    } catch (err) {
        console.error('paymentFail error:', err);
        res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    }
};

// SSLCommerz cancel callback
const paymentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.query;
        await Appointment.findByIdAndDelete(appointmentId);
        res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
    } catch (err) {
        console.error('paymentCancel error:', err);
        res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
    }
};

// Patient er payment history
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ patient: req.user._id })
            .populate('doctor', 'name')
            .populate('appointment', 'appointmentDate timeSlot status')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, payments });
    } catch (err) {
        console.error('getMyPayments error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

module.exports = { paymentSuccess, paymentFail, paymentCancel, getMyPayments };