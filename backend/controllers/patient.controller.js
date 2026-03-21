const User = require('../models/User.model');
const Patient = require('../models/Patient.model');
const Appointment = require('../models/Appointment.model');
const Prescription = require('../models/Prescription.model');

// @GET /api/patients/profile/me
const getMyProfile = async (req, res) => {
    const patient = await Patient.findOne({ user: req.user._id }).populate(
        'user',
        'name email avatar phone'
    );

    if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient profile not found' });
    }

    res.status(200).json({ success: true, patient });
};

// @PUT /api/patients/profile/update
const updatePatientProfile = async (req, res) => {
    const { dateOfBirth, gender, bloodGroup, address } = req.body;

    const patient = await Patient.findOneAndUpdate(
        { user: req.user._id },
        { dateOfBirth, gender, bloodGroup, address },
        { new: true, runValidators: true }
    ).populate('user', 'name email avatar phone');

    // user info update
    if (req.body.name || req.body.phone) {
        await User.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
            phone: req.body.phone,
        });
    }

    res.status(200).json({ success: true, patient });
};

// @PUT /api/patients/avatar
const updateAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: req.file.path },
        { new: true }
    );

    res.status(200).json({ success: true, avatar: user.avatar });
};

// @POST /api/patients/medical-history
// Medical history add koro
const addMedicalHistory = async (req, res) => {
    const { condition, diagnosedAt, notes } = req.body;

    const patient = await Patient.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                medicalHistory: { condition, diagnosedAt, notes },
            },
        },
        { new: true }
    );

    res.status(200).json({ success: true, medicalHistory: patient.medicalHistory });
};

// @DELETE /api/patients/medical-history/:historyId
const deleteMedicalHistory = async (req, res) => {
    const patient = await Patient.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { medicalHistory: { _id: req.params.historyId } } },
        { new: true }
    );

    res.status(200).json({ success: true, medicalHistory: patient.medicalHistory });
};

// @GET /api/patients/dashboard/stats
const getPatientStats = async (req, res) => {
    const patientId = req.user._id;

    const [
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        totalPrescriptions,
    ] = await Promise.all([
        Appointment.countDocuments({ patient: patientId }),
        Appointment.countDocuments({ patient: patientId, status: 'completed' }),
        Appointment.countDocuments({
            patient: patientId,
            status: 'approved',
            appointmentDate: { $gte: new Date() },
        }),
        Prescription.countDocuments({ patient: patientId }),
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalAppointments,
            completedAppointments,
            upcomingAppointments,
            totalPrescriptions,
        },
    });
};

// @GET /api/patients/full-history
// Patient er complete medical history
const getFullHistory = async (req, res) => {
    const patientId = req.user._id;

    const [patient, appointments, prescriptions] = await Promise.all([
        Patient.findOne({ user: patientId }).populate('user', 'name email avatar'),
        Appointment.find({ patient: patientId })
            .populate('doctor', 'name avatar')
            .sort({ createdAt: -1 }),
        Prescription.find({ patient: patientId })
            .populate('doctor', 'name avatar')
            .sort({ createdAt: -1 }),
    ]);

    res.status(200).json({
        success: true,
        history: {
            profile: patient,
            appointments,
            prescriptions,
        },
    });
};

module.exports = {
    getMyProfile,
    updatePatientProfile,
    updateAvatar,
    addMedicalHistory,
    deleteMedicalHistory,
    getPatientStats,
    getFullHistory,
};