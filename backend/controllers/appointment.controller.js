// const Appointment = require('../models/Appointment.model');
// const Payment = require('../models/Payment.model');
// const Doctor = require('../models/Doctor.model');
// const SSLCommerzPayment = require('sslcommerz-lts');
// const { v4: uuidv4 } = require('uuid');

// // ─── PATIENT ───────────────────────────────────────────

// // @POST /api/appointments/book
// // Patient appointment book kore + payment initiate kore
// const bookAppointment = async (req, res) => {
//     const { doctorId, appointmentDate, timeSlot, symptoms, type } = req.body;

//     // doctor er fee ber koro
//     const doctorProfile = await Doctor.findOne({ user: doctorId });
//     if (!doctorProfile) {
//         return res.status(404).json({ success: false, message: 'Doctor not found' });
//     }

//     if (!doctorProfile.isApproved) {
//         return res.status(400).json({ success: false, message: 'Doctor is not approved yet' });
//     }

//     // same slot e already appointment ache kina check
//     const existing = await Appointment.findOne({
//         doctor: doctorId,
//         appointmentDate,
//         timeSlot,
//         status: { $in: ['pending', 'approved'] },
//     });

//     if (existing) {
//         return res.status(400).json({ success: false, message: 'This time slot is already booked' });
//     }

//     // appointment create (unpaid)
//     const appointment = await Appointment.create({
//         patient: req.user._id,
//         doctor: doctorId,
//         appointmentDate,
//         timeSlot,
//         symptoms,
//         type: type || 'video',
//         fee: doctorProfile.consultationFee,
//         isPaid: false,
//     });

//     // SSLCommerz payment initiate
//     const transactionId = uuidv4();

//     const data = {
//         total_amount: doctorProfile.consultationFee,
//         currency: 'BDT',
//         tran_id: transactionId,
//         success_url: `${process.env.SERVER_URL}/api/payments/success?appointmentId=${appointment._id}&transactionId=${transactionId}`,
//         fail_url: `${process.env.SERVER_URL}/api/payments/fail?appointmentId=${appointment._id}`,
//         cancel_url: `${process.env.SERVER_URL}/api/payments/cancel?appointmentId=${appointment._id}`,
//         ipn_url: `${process.env.SERVER_URL}/api/payments/ipn`,
//         shipping_method: 'No',
//         product_name: 'Doctor Consultation',
//         product_category: 'Healthcare',
//         product_profile: 'general',
//         cus_name: req.user.name,
//         cus_email: req.user.email,
//         cus_add1: 'Dhaka',
//         cus_city: 'Dhaka',
//         cus_country: 'Bangladesh',
//         cus_phone: req.user.phone || '01700000000',
//     };

//     const sslcz = new SSLCommerzPayment(
//         process.env.SSLCOMMERZ_STORE_ID,
//         process.env.SSLCOMMERZ_STORE_PASSWORD,
//         process.env.SSLCOMMERZ_IS_LIVE === 'true'
//     );

//     const apiResponse = await sslcz.init(data);

//     if (apiResponse?.GatewayPageURL) {
//         // payment record create koro
//         await Payment.create({
//             patient: req.user._id,
//             doctor: doctorId,
//             appointment: appointment._id,
//             amount: doctorProfile.consultationFee,
//             transactionId,
//             method: 'sslcommerz',
//             status: 'pending',
//         });

//         return res.status(200).json({
//             success: true,
//             message: 'Redirecting to payment',
//             paymentUrl: apiResponse.GatewayPageURL,
//             appointmentId: appointment._id,
//         });
//     } else {
//         await Appointment.findByIdAndDelete(appointment._id);
//         return res.status(500).json({ success: false, message: 'Payment initiation failed' });
//     }
// };

// // @GET /api/appointments/my
// // Patient er nijer sob appointments
// const getMyAppointments = async (req, res) => {
//     const appointments = await Appointment.find({ patient: req.user._id })
//         .populate('doctor', 'name email avatar')
//         .populate({ path: 'doctor', populate: { path: 'doctor', model: 'Doctor', select: 'specialization consultationFee' } })
//         .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, appointments });
// };

// // @DELETE /api/appointments/:id/cancel
// // Patient appointment cancel korbe
// const cancelAppointment = async (req, res) => {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.patient.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ success: false, message: 'Not authorized' });
//     }

//     if (appointment.status === 'completed') {
//         return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' });
//     }

//     appointment.status = 'cancelled';
//     await appointment.save();

//     res.status(200).json({ success: true, message: 'Appointment cancelled' });
// };

// // ─── DOCTOR ────────────────────────────────────────────

// // @GET /api/appointments/doctor
// // Doctor er sob appointments
// const getDoctorAppointments = async (req, res) => {
//     const appointments = await Appointment.find({ doctor: req.user._id })
//         .populate('patient', 'name email avatar phone')
//         .sort({ appointmentDate: 1 });

//     res.status(200).json({ success: true, appointments });
// };

// // @PUT /api/appointments/:id/approve
// // Doctor appointment approve korbe
// const approveAppointment = async (req, res) => {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.doctor.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ success: false, message: 'Not authorized' });
//     }

//     if (!appointment.isPaid) {
//         return res.status(400).json({ success: false, message: 'Payment not completed yet' });
//     }

//     // video room id generate koro
//     const roomId = uuidv4();

//     appointment.status = 'approved';
//     appointment.videoRoomId = roomId;
//     await appointment.save();

//     // appointment.controller.js এ
//     const { generateVideoRoom } = require('../utils/generateZoomLink');

//     // approve এর সময়
//     const { roomId, joinUrl } = await generateVideoRoom();

//     appointment.status = 'approved';
//     appointment.videoRoomId = roomId;
//     appointment.videoJoinUrl = joinUrl;
//     await appointment.save();

//     // real-time notification patient ke
//     req.io.to(appointment.patient.toString()).emit('appointment_approved', {
//         appointmentId: appointment._id,
//         roomId,
//         message: 'Your appointment has been approved!',
//     });

//     res.status(200).json({ success: true, message: 'Appointment approved', appointment });
// };

// // @PUT /api/appointments/:id/reject
// // Doctor appointment reject korbe
// const rejectAppointment = async (req, res) => {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.doctor.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ success: false, message: 'Not authorized' });
//     }

//     appointment.status = 'rejected';
//     await appointment.save();

//     req.io.to(appointment.patient.toString()).emit('appointment_rejected', {
//         appointmentId: appointment._id,
//         message: 'Your appointment has been rejected.',
//     });

//     res.status(200).json({ success: true, message: 'Appointment rejected' });
// };

// // @PUT /api/appointments/:id/complete
// const completeAppointment = async (req, res) => {
//     const appointment = await Appointment.findById(req.params.id);

//     if (!appointment) {
//         return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     appointment.status = 'completed';
//     await appointment.save();

//     res.status(200).json({ success: true, message: 'Appointment marked as completed' });
// };

// // ─── ADMIN ─────────────────────────────────────────────

// // @GET /api/appointments/all (admin only)
// const getAllAppointments = async (req, res) => {
//     const appointments = await Appointment.find()
//         .populate('patient', 'name email')
//         .populate('doctor', 'name email')
//         .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, appointments });
// };

// module.exports = {
//     bookAppointment,
//     getMyAppointments,
//     cancelAppointment,
//     getDoctorAppointments,
//     approveAppointment,
//     rejectAppointment,
//     completeAppointment,
//     getAllAppointments,
// };




const Appointment = require('../models/Appointment.model');
const Payment = require('../models/Payment.model');
const Doctor = require('../models/Doctor.model');
const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
const { generateVideoRoom } = require('../utils/generateZoomLink');

// ─── PATIENT ───────────────────────────────────────────

// @POST /api/appointments/book
const bookAppointment = async (req, res) => {
    const { doctorId, appointmentDate, timeSlot, symptoms, type } = req.body;

    const doctorProfile = await Doctor.findOne({ user: doctorId });
    if (!doctorProfile) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    if (!doctorProfile.isApproved) {
        return res.status(400).json({ success: false, message: 'Doctor is not approved yet' });
    }

    const existing = await Appointment.findOne({
        doctor: doctorId,
        appointmentDate,
        timeSlot,
        status: { $in: ['pending', 'approved'] },
    });

    if (existing) {
        return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        appointmentDate,
        timeSlot,
        symptoms,
        type: type || 'video',
        fee: doctorProfile.consultationFee,
        isPaid: false,
    });

    const transactionId = uuidv4();

    const data = {
        total_amount: doctorProfile.consultationFee,
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.SERVER_URL}/api/payments/success?appointmentId=${appointment._id}&transactionId=${transactionId}`,
        fail_url: `${process.env.SERVER_URL}/api/payments/fail?appointmentId=${appointment._id}`,
        cancel_url: `${process.env.SERVER_URL}/api/payments/cancel?appointmentId=${appointment._id}`,
        ipn_url: `${process.env.SERVER_URL}/api/payments/ipn`,
        shipping_method: 'No',
        product_name: 'Doctor Consultation',
        product_category: 'Healthcare',
        product_profile: 'general',
        cus_name: req.user.name,
        cus_email: req.user.email,
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
        cus_phone: req.user.phone || '01700000000',
    };

    const sslcz = new SSLCommerzPayment(
        process.env.SSLCOMMERZ_STORE_ID,
        process.env.SSLCOMMERZ_STORE_PASSWORD,
        process.env.SSLCOMMERZ_IS_LIVE === 'true'
    );

    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
        await Payment.create({
            patient: req.user._id,
            doctor: doctorId,
            appointment: appointment._id,
            amount: doctorProfile.consultationFee,
            transactionId,
            method: 'sslcommerz',
            status: 'pending',
        });

        return res.status(200).json({
            success: true,
            message: 'Redirecting to payment',
            paymentUrl: apiResponse.GatewayPageURL,
            appointmentId: appointment._id,
        });
    } else {
        await Appointment.findByIdAndDelete(appointment._id);
        return res.status(500).json({ success: false, message: 'Payment initiation failed' });
    }
};

// @GET /api/appointments/my
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name email avatar phone')
            .populate('patient', 'name email avatar')
            .sort({ createdAt: -1 });

        // doctor er specialization ber koro
        const result = await Promise.all(
            appointments.map(async (apt) => {
                const doctorProfile = await Doctor.findOne({ user: apt.doctor?._id }).select('specialization consultationFee');
                return {
                    ...apt.toObject(),
                    doctorProfile,
                };
            })
        );

        res.status(200).json({ success: true, appointments: result });
    } catch (error) {
        console.error('getMyAppointments error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @PUT /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (appointment.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment cancelled' });
};

// ─── DOCTOR ────────────────────────────────────────────

// @GET /api/appointments/doctor
const getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id })
            .populate('patient', 'name email avatar phone')
            .sort({ appointmentDate: 1 });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        console.error('getDoctorAppointments error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @PUT /api/appointments/:id/approve
const approveAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // development e payment check skip
    // if (!appointment.isPaid) {
    //   return res.status(400).json({ success: false, message: 'Payment not completed yet' });
    // }

    const { roomId, joinUrl } = await generateVideoRoom();

    appointment.status = 'approved';
    appointment.videoRoomId = roomId;
    appointment.videoJoinUrl = joinUrl;
    await appointment.save();

    try {
        req.io.to(appointment.patient.toString()).emit('appointment_approved', {
            appointmentId: appointment._id,
            roomId,
            joinUrl,
            message: 'Your appointment has been approved!',
        });
    } catch (err) {
        console.error('Socket error:', err.message);
    }

    res.status(200).json({ success: true, message: 'Appointment approved', appointment });
};

// @PUT /api/appointments/:id/reject
const rejectAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = 'rejected';
    await appointment.save();

    try {
        req.io.to(appointment.patient.toString()).emit('appointment_rejected', {
            appointmentId: appointment._id,
            message: 'Your appointment has been rejected.',
        });
    } catch (err) {
        console.error('Socket error:', err.message);
    }

    res.status(200).json({ success: true, message: 'Appointment rejected' });
};

// @PUT /api/appointments/:id/complete
const completeAppointment = async (req, res) => {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment marked as completed' });
};

// ─── ADMIN ─────────────────────────────────────────────

// @GET /api/appointments/all
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('patient', 'name email')
            .populate('doctor', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    cancelAppointment,
    getDoctorAppointments,
    approveAppointment,
    rejectAppointment,
    completeAppointment,
    getAllAppointments,
};