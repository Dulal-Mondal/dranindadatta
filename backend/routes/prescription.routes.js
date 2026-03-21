// const express = require('express');
// const router = express.Router();
// const {
//     createPrescription,
//     getMyPrescriptions,
//     getDoctorPrescriptions,
//     getPrescriptionById,
//     updatePrescription,
//     downloadPrescription,
// } = require('../controllers/prescription.controller');
// const { protect, authorize } = require('../middleware/auth.middleware');
// const { isDoctorApproved, isActiveUser } = require('../middleware/role.middleware');

// // ─── DOCTOR ROUTES ─────────────────────────────────────

// // prescription create (approved doctor only)
// router.post(
//     '/create',
//     protect,
//     isActiveUser,
//     authorize('doctor'),
//     isDoctorApproved,
//     createPrescription
// );

// // doctor er nijer dewa sob prescription
// router.get(
//     '/doctor',
//     protect,
//     isActiveUser,
//     authorize('doctor'),
//     getDoctorPrescriptions
// );

// // prescription update
// router.put(
//     '/:id',
//     protect,
//     isActiveUser,
//     authorize('doctor'),
//     isDoctorApproved,
//     updatePrescription
// );

// // ─── PATIENT ROUTES ────────────────────────────────────

// // patient er nijer sob prescription
// router.get(
//     '/my',
//     protect,
//     isActiveUser,
//     authorize('patient'),
//     getMyPrescriptions
// );

// // ─── SHARED ROUTES (patient + doctor + admin) ──────────

// // single prescription detail
// router.get(
//     '/:id',
//     protect,
//     isActiveUser,
//     getPrescriptionById
// );

// // PDF download URL
// router.get(
//     '/:id/download',
//     protect,
//     isActiveUser,
//     downloadPrescription
// );

// module.exports = router;







const express = require('express');
const router = express.Router();
const {
    createPrescription,
    getMyPrescriptions,
    getDoctorPrescriptions,
    getPrescriptionById,
    updatePrescription,
    downloadPrescription,
} = require('../controllers/prescription.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { isDoctorApproved, isActiveUser } = require('../middleware/role.middleware');

// ─── DOCTOR ROUTES ─────────────────────────────────────

router.post(
    '/create',
    protect,
    isActiveUser,
    authorize('doctor'),
    isDoctorApproved,
    createPrescription
);

router.get(
    '/doctor',
    protect,
    isActiveUser,
    authorize('doctor'),
    getDoctorPrescriptions
);

router.put(
    '/:id',
    protect,
    isActiveUser,
    authorize('doctor'),
    isDoctorApproved,
    updatePrescription
);

// ─── PATIENT ROUTES ────────────────────────────────────

router.get(
    '/my',
    protect,
    isActiveUser,
    authorize('patient'),
    getMyPrescriptions
);

// ─── SHARED ROUTES (patient + doctor + admin) ──────────

// ✅ FIX: /:id/download must come BEFORE /:id
// Otherwise Express treats "download" as the id param and this route is never reached
router.get(
    '/:id/download',
    protect,
    isActiveUser,
    downloadPrescription
);

// ✅ Wildcard param route always last
router.get(
    '/:id',
    protect,
    isActiveUser,
    getPrescriptionById
);

module.exports = router;