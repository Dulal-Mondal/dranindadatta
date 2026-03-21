// const User = require('../models/User.model');
// const Doctor = require('../models/Doctor.model');
// const Patient = require('../models/Patient.model');
// const generateToken = require('../utils/generateToken');
// const { fbRegistration } = require('../services/facebookService');

// // @POST /api/auth/register
// const register = async (req, res) => {
//     const { name, email, password, role, phone, specialization, consultationFee } = req.body;

//     // already exist check
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//         return res.status(400).json({ success: false, message: 'Email already registered' });
//     }

//     // user create
//     const user = await User.create({ name, email, password, role: role || 'patient', phone });

//     // role onujayi profile create
//     if (user.role === 'doctor') {
//         await Doctor.create({
//             user: user._id,
//             specialization: specialization || 'General',
//             consultationFee: consultationFee || 500,
//         });
//     } else if (user.role === 'patient') {
//         await Patient.create({ user: user._id });
//     }

//     const token = generateToken(user._id, user.role);

//     res.status(201).json({
//         success: true,
//         token,
//         user: {
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             avatar: user.avatar,
//         },
//     });
// };

// // @POST /api/auth/login
// const login = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ success: false, message: 'Please provide email and password' });
//     }

//     const user = await User.findOne({ email }).select('+password');

//     if (!user || !(await user.matchPassword(password))) {
//         return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }

//     if (!user.isActive) {
//         return res.status(403).json({ success: false, message: 'Your account has been blocked' });
//     }

//     const token = generateToken(user._id, user.role);

//     res.status(200).json({
//         success: true,
//         token,
//         user: {
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             avatar: user.avatar,
//         },
//     });
// };

// // @GET /api/auth/me
// const getMe = async (req, res) => {
//     const user = await User.findById(req.user._id);
//     res.status(200).json({ success: true, user });
// };

// // @PUT /api/auth/update-profile
// const updateProfile = async (req, res) => {
//     const { name, phone } = req.body;

//     const user = await User.findByIdAndUpdate(
//         req.user._id,
//         { name, phone },
//         { new: true, runValidators: true }
//     );

//     res.status(200).json({ success: true, user });
// };

// // @PUT /api/auth/change-password
// const changePassword = async (req, res) => {
//     const { currentPassword, newPassword } = req.body;

//     const user = await User.findById(req.user._id).select('+password');

//     if (!(await user.matchPassword(currentPassword))) {
//         return res.status(400).json({ success: false, message: 'Current password is incorrect' });
//     }

//     user.password = newPassword;
//     await user.save();

//     res.status(200).json({ success: true, message: 'Password updated successfully' });
// };

// module.exports = { register, login, getMe, updateProfile, changePassword };



const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const Patient = require('../models/Patient.model');
const generateToken = require('../utils/generateToken');
const { fbRegistration } = require('../services/facebookService');

// @POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, role, phone, specialization, consultationFee } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password, role: role || 'patient', phone });

        if (user.role === 'doctor') {
            await Doctor.create({
                user: user._id,
                specialization: specialization || 'General',
                consultationFee: consultationFee || 500,
            });
        } else if (user.role === 'patient') {
            await Patient.create({ user: user._id });
        }

        // ✅ Facebook Conversions API — Registration event
        await fbRegistration({
            email: user.email,
            phone: user.phone,
            firstName: user.name.split(' ')[0],
            lastName: user.name.split(' ')[1] || '',
            ip: req.ip,
            ua: req.headers['user-agent'],
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        console.error('register error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Your account has been blocked' });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        console.error('login error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @PUT /api/auth/update-profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @PUT /api/auth/change-password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

module.exports = { register, login, getMe, updateProfile, changePassword };