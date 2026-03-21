// Multiple role check middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
            });
        }

        next();
    };
};

// Specific role middlewares (shorthand)
const isPatient = (req, res, next) => {
    if (req.user?.role !== 'patient') {
        return res.status(403).json({ success: false, message: 'Patient access only' });
    }
    next();
};

const isDoctor = (req, res, next) => {
    if (req.user?.role !== 'doctor') {
        return res.status(403).json({ success: false, message: 'Doctor access only' });
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access only' });
    }
    next();
};

// Doctor approved kina check
const isDoctorApproved = async (req, res, next) => {
    try {
        const Doctor = require('../models/Doctor.model');
        const doctor = await Doctor.findOne({ user: req.user._id });

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }

        if (!doctor.isApproved) {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending admin approval',
            });
        }

        req.doctorProfile = doctor;
        next();
    } catch (error) {
        next(error);
    }
};

// User active kina check (blocked hole block korbe)
const isActiveUser = (req, res, next) => {
    if (!req.user?.isActive) {
        return res.status(403).json({
            success: false,
            message: 'Your account has been blocked. Contact support.',
        });
    }
    next();
};

module.exports = {
    authorizeRoles,
    isPatient,
    isDoctor,
    isAdmin,
    isDoctorApproved,
    isActiveUser,
};