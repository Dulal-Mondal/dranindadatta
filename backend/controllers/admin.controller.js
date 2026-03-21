const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const Patient = require('../models/Patient.model');
const Appointment = require('../models/Appointment.model');
const Payment = require('../models/Payment.model');
const Slider = require('../models/Slider.model');

// ─── DASHBOARD ─────────────────────────────────────────

// @GET /api/admin/stats
const getAdminStats = async (req, res) => {
    const [
        totalDoctors,
        pendingDoctors,
        totalPatients,
        totalAppointments,
        totalRevenue,
    ] = await Promise.all([
        Doctor.countDocuments({ isApproved: true }),
        Doctor.countDocuments({ isApproved: false }),
        Patient.countDocuments(),
        Appointment.countDocuments(),
        Payment.aggregate([
            { $match: { status: 'success' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalDoctors,
            pendingDoctors,
            totalPatients,
            totalAppointments,
            totalRevenue: totalRevenue[0]?.total || 0,
        },
    });
};

// ─── DOCTOR MANAGEMENT ─────────────────────────────────

// @GET /api/admin/doctors
const getAllDoctors = async (req, res) => {
    const { status } = req.query; // 'pending' | 'approved' | 'all'

    const filter = {};
    if (status === 'pending') filter.isApproved = false;
    if (status === 'approved') filter.isApproved = true;

    const doctors = await Doctor.find(filter)
        .populate('user', 'name email avatar phone isActive createdAt')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, doctors });
};

// @PUT /api/admin/doctors/:id/approve
const approveDoctor = async (req, res) => {
    const doctor = await Doctor.findOneAndUpdate(
        { user: req.params.id },
        { isApproved: true },
        { new: true }
    ).populate('user', 'name email');

    if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // doctor ke email notification pathano (optional)
    // await sendEmail(doctor.user.email, 'Account Approved', 'Your account has been approved!')

    res.status(200).json({ success: true, message: 'Doctor approved', doctor });
};

// @PUT /api/admin/doctors/:id/reject
const rejectDoctor = async (req, res) => {
    const doctor = await Doctor.findOneAndUpdate(
        { user: req.params.id },
        { isApproved: false },
        { new: true }
    );

    if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, message: 'Doctor rejected' });
};

// ─── USER MANAGEMENT ───────────────────────────────────

// @GET /api/admin/users
const getAllUsers = async (req, res) => {
    const { role, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const users = await User.find(filter)
        .select('-password')
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({ success: true, total, users });
};

// @PUT /api/admin/users/:id/block
const blockUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // user er active appointments cancel koro
    await Appointment.updateMany(
        {
            $or: [{ patient: req.params.id }, { doctor: req.params.id }],
            status: { $in: ['pending', 'approved'] },
        },
        { status: 'cancelled' }
    );

    res.status(200).json({ success: true, message: 'User blocked' });
};

// @PUT /api/admin/users/:id/unblock
const unblockUser = async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: true },
        { new: true }
    );

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User unblocked' });
};

// @DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    // related data delete
    if (user.role === 'doctor') await Doctor.findOneAndDelete({ user: req.params.id });
    if (user.role === 'patient') await Patient.findOneAndDelete({ user: req.params.id });

    await Appointment.deleteMany({
        $or: [{ patient: req.params.id }, { doctor: req.params.id }],
    });

    await user.deleteOne();

    res.status(200).json({ success: true, message: 'User deleted' });
};

// ─── SLIDER MANAGEMENT ─────────────────────────────────

// @GET /api/admin/sliders (public)
const getSliders = async (req, res) => {
    const sliders = await Slider.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, sliders });
};

// @POST /api/admin/sliders
const createSlider = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image is required' });
    }

    const { title, subtitle, buttonText, buttonLink, order } = req.body;

    const slider = await Slider.create({
        title,
        subtitle,
        imageUrl: req.file.path,
        buttonText,
        buttonLink,
        order: order || 0,
    });

    res.status(201).json({ success: true, slider });
};

// @PUT /api/admin/sliders/:id
const updateSlider = async (req, res) => {
    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = req.file.path;

    const slider = await Slider.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!slider) {
        return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    res.status(200).json({ success: true, slider });
};

// @DELETE /api/admin/sliders/:id
const deleteSlider = async (req, res) => {
    const slider = await Slider.findByIdAndDelete(req.params.id);

    if (!slider) {
        return res.status(404).json({ success: false, message: 'Slider not found' });
    }

    // cloudinary theke image delete
    const publicId = slider.imageUrl.split('/').pop().split('.')[0];
    await require('../config/cloudinary').cloudinary.uploader.destroy(
        `telemedicine/images/${publicId}`
    );

    res.status(200).json({ success: true, message: 'Slider deleted' });
};

// ─── PAYMENT MANAGEMENT ────────────────────────────────

// @GET /api/admin/payments
const getAllPayments = async (req, res) => {
    const payments = await Payment.find()
        .populate('patient', 'name email')
        .populate('doctor', 'name email')
        .populate('appointment', 'appointmentDate timeSlot')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
};

module.exports = {
    getAdminStats,
    getAllDoctors,
    approveDoctor,
    rejectDoctor,
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getSliders,
    createSlider,
    updateSlider,
    deleteSlider,
    getAllPayments,
};