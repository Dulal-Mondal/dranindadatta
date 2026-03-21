const express = require('express');
const router = express.Router();
const {
    paymentSuccess,
    paymentFail,
    paymentCancel,
    getMyPayments,
} = require('../controllers/payment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// SSLCommerz callbacks (public - no auth needed)
router.get('/success', paymentSuccess);
router.get('/fail', paymentFail);
router.get('/cancel', paymentCancel);

// patient payment history
router.get('/my', protect, authorize('patient'), getMyPayments);

module.exports = router;
