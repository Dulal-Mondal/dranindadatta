// const User = require('../models/User.model');
// const Doctor = require('../models/Doctor.model');
// const Appointment = require('../models/Appointment.model');

// // @GET /api/doctors
// // Sob approved doctor er list (public)
// const getAllDoctors = async (req, res) => {
//     const { specialization, search, page = 1, limit = 10 } = req.query;

//     const filter = { isApproved: true };

//     if (specialization) {
//         filter.specialization = { $regex: specialization, $options: 'i' };
//     }

//     const doctors = await Doctor.find(filter)
//         .populate({
//             path: 'user',
//             select: 'name email avatar phone isActive',
//             match: search
//                 ? { name: { $regex: search, $options: 'i' } }
//                 : {},
//         })
//         .skip((page - 1) * limit)
//         .limit(parseInt(limit))
//         .sort({ rating: -1 });

//     // null populate filter koro
//     const filtered = doctors.filter((d) => d.user !== null && d.user.isActive);

//     res.status(200).json({
//         success: true,
//         total: filtered.length,
//         doctors: filtered,
//     });
// };

// // @GET /api/doctors/:id
// // Single doctor profile (public)
// const getDoctorById = async (req, res) => {
//     const doctor = await Doctor.findOne({ user: req.params.id }).populate(
//         'user',
//         'name email avatar phone'
//     );

//     if (!doctor) {
//         return res.status(404).json({ success: false, message: 'Doctor not found' });
//     }

//     res.status(200).json({ success: true, doctor });
// };

// // @GET /api/doctors/profile/me
// // Doctor nijer profile dekhe
// const getMyProfile = async (req, res) => {
//     const doctor = await Doctor.findOne({ user: req.user._id }).populate(
//         'user',
//         'name email avatar phone'
//     );

//     if (!doctor) {
//         return res.status(404).json({ success: false, message: 'Doctor profile not found' });
//     }

//     res.status(200).json({ success: true, doctor });
// };

// // @PUT /api/doctors/profile/update
// // Doctor profile update korbe
// const updateDoctorProfile = async (req, res) => {
//     const {
//         specialization,
//         qualifications,
//         experience,
//         consultationFee,
//         bio,
//         availableSlots,
//     } = req.body;

//     const doctor = await Doctor.findOneAndUpdate(
//         { user: req.user._id },
//         {
//             specialization,
//             qualifications,
//             experience,
//             consultationFee,
//             bio,
//             availableSlots,
//         },
//         { new: true, runValidators: true }
//     ).populate('user', 'name email avatar');

//     // user name/phone update
//     if (req.body.name || req.body.phone) {
//         await User.findByIdAndUpdate(req.user._id, {
//             name: req.body.name,
//             phone: req.body.phone,
//         });
//     }

//     res.status(200).json({ success: true, doctor });
// };

// // @PUT /api/doctors/avatar
// // Doctor avatar update
// const updateAvatar = async (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ success: false, message: 'No image uploaded' });
//     }

//     const user = await User.findByIdAndUpdate(
//         req.user._id,
//         { avatar: req.file.path },
//         { new: true }
//     );

//     res.status(200).json({ success: true, avatar: user.avatar });
// };

// // @POST /api/doctors/upload-images
// // Doctor images upload korbe
// const uploadImages = async (req, res) => {
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ success: false, message: 'No images uploaded' });
//     }

//     const imageUrls = req.files.map((file) => file.path);

//     const doctor = await Doctor.findOneAndUpdate(
//         { user: req.user._id },
//         { $push: { images: { $each: imageUrls } } },
//         { new: true }
//     );

//     res.status(200).json({ success: true, images: doctor.images });
// };

// // @POST /api/doctors/upload-videos
// // Doctor videos upload korbe
// const uploadVideos = async (req, res) => {
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ success: false, message: 'No videos uploaded' });
//     }

//     const videoUrls = req.files.map((file) => file.path);

//     const doctor = await Doctor.findOneAndUpdate(
//         { user: req.user._id },
//         { $push: { videos: { $each: videoUrls } } },
//         { new: true }
//     );

//     res.status(200).json({ success: true, videos: doctor.videos });
// };

// // @DELETE /api/doctors/delete-image
// // Doctor image delete korbe
// const deleteImage = async (req, res) => {
//     const { imageUrl } = req.body;

//     await Doctor.findOneAndUpdate(
//         { user: req.user._id },
//         { $pull: { images: imageUrl } }
//     );

//     // cloudinary theke delete
//     const publicId = imageUrl.split('/').pop().split('.')[0];
//     await require('../config/cloudinary').cloudinary.uploader.destroy(
//         `telemedicine/images/${publicId}`
//     );

//     res.status(200).json({ success: true, message: 'Image deleted' });
// };

// // @DELETE /api/doctors/delete-video
// const deleteVideo = async (req, res) => {
//     const { videoUrl } = req.body;

//     await Doctor.findOneAndUpdate(
//         { user: req.user._id },
//         { $pull: { videos: videoUrl } }
//     );

//     const publicId = videoUrl.split('/').pop().split('.')[0];
//     await require('../config/cloudinary').cloudinary.uploader.destroy(
//         `telemedicine/videos/${publicId}`,
//         { resource_type: 'video' }
//     );

//     res.status(200).json({ success: true, message: 'Video deleted' });
// };

// // @PUT /api/doctors/block-patient/:patientId
// // Doctor patient ke block korbe
// const blockPatient = async (req, res) => {
//     const { patientId } = req.params;

//     // patient er active appointments cancel koro
//     await Appointment.updateMany(
//         {
//             doctor: req.user._id,
//             patient: patientId,
//             status: { $in: ['pending', 'approved'] },
//         },
//         { status: 'cancelled' }
//     );

//     // patient ke block (isActive false)
//     await User.findByIdAndUpdate(patientId, { isActive: false });

//     res.status(200).json({ success: true, message: 'Patient blocked successfully' });
// };

// // @GET /api/doctors/dashboard/stats
// // Doctor dashboard stats
// const getDoctorStats = async (req, res) => {
//     const doctorId = req.user._id;

//     const [
//         totalAppointments,
//         pendingAppointments,
//         completedAppointments,
//         todayAppointments,
//     ] = await Promise.all([
//         Appointment.countDocuments({ doctor: doctorId }),
//         Appointment.countDocuments({ doctor: doctorId, status: 'pending' }),
//         Appointment.countDocuments({ doctor: doctorId, status: 'completed' }),
//         Appointment.countDocuments({
//             doctor: doctorId,
//             appointmentDate: {
//                 $gte: new Date().setHours(0, 0, 0, 0),
//                 $lte: new Date().setHours(23, 59, 59, 999),
//             },
//         }),
//     ]);

//     res.status(200).json({
//         success: true,
//         stats: {
//             totalAppointments,
//             pendingAppointments,
//             completedAppointments,
//             todayAppointments,
//         },
//     });
// };

// module.exports = {
//     getAllDoctors,
//     getDoctorById,
//     getMyProfile,
//     updateDoctorProfile,
//     updateAvatar,
//     uploadImages,
//     uploadVideos,
//     deleteImage,
//     deleteVideo,
//     blockPatient,
//     getDoctorStats,
// };



const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const Appointment = require('../models/Appointment.model');

// @GET /api/doctors
// Sob approved doctor er list (public)
const getAllDoctors = async (req, res) => {
    const { specialization, search, page = 1, limit = 10 } = req.query;

    const filter = { isApproved: true };

    if (specialization) {
        filter.specialization = { $regex: specialization, $options: 'i' };
    }

    const doctors = await Doctor.find(filter)
        .populate({
            path: 'user',
            select: 'name email avatar phone isActive',
            match: search
                ? { name: { $regex: search, $options: 'i' } }
                : {},
        })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ rating: -1 });

    // null populate filter koro
    const filtered = doctors.filter((d) => d.user !== null && d.user.isActive);

    res.status(200).json({
        success: true,
        total: filtered.length,
        doctors: filtered,
    });
};

// @GET /api/doctors/:id
// Single doctor profile (public)
// ✅ FIXED: findById দিয়ে doctor._id খুঁজছে (আগে user._id দিয়ে খুঁজত — ভুল ছিল)
const getDoctorById = async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).populate(
        'user',
        'name email avatar phone'
    );

    if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, doctor });
};

// @GET /api/doctors/profile/me
// Doctor nijer profile dekhe
const getMyProfile = async (req, res) => {
    const doctor = await Doctor.findOne({ user: req.user._id }).populate(
        'user',
        'name email avatar phone'
    );

    if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    res.status(200).json({ success: true, doctor });
};

// @PUT /api/doctors/profile/update
// Doctor profile update korbe
const updateDoctorProfile = async (req, res) => {
    const {
        specialization,
        qualifications,
        experience,
        consultationFee,
        bio,
        availableSlots,
    } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
        { user: req.user._id },
        {
            specialization,
            qualifications,
            experience,
            consultationFee,
            bio,
            availableSlots,
        },
        { new: true, runValidators: true }
    ).populate('user', 'name email avatar');

    // user name/phone update
    if (req.body.name || req.body.phone) {
        await User.findByIdAndUpdate(req.user._id, {
            name: req.body.name,
            phone: req.body.phone,
        });
    }

    res.status(200).json({ success: true, doctor });
};

// @PUT /api/doctors/avatar
// Doctor avatar update
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

// @POST /api/doctors/upload-images
// Doctor images upload korbe
const uploadImages = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const imageUrls = req.files.map((file) => file.path);

    const doctor = await Doctor.findOneAndUpdate(
        { user: req.user._id },
        { $push: { images: { $each: imageUrls } } },
        { new: true }
    );

    res.status(200).json({ success: true, images: doctor.images });
};

// @POST /api/doctors/upload-videos
// Doctor videos upload korbe
const uploadVideos = async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No videos uploaded' });
    }

    const videoUrls = req.files.map((file) => file.path);

    const doctor = await Doctor.findOneAndUpdate(
        { user: req.user._id },
        { $push: { videos: { $each: videoUrls } } },
        { new: true }
    );

    res.status(200).json({ success: true, videos: doctor.videos });
};

// @DELETE /api/doctors/delete-image
// Doctor image delete korbe
const deleteImage = async (req, res) => {
    const { imageUrl } = req.body;

    await Doctor.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { images: imageUrl } }
    );

    // cloudinary theke delete
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await require('../config/cloudinary').cloudinary.uploader.destroy(
        `telemedicine/images/${publicId}`
    );

    res.status(200).json({ success: true, message: 'Image deleted' });
};

// @DELETE /api/doctors/delete-video
const deleteVideo = async (req, res) => {
    const { videoUrl } = req.body;

    await Doctor.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { videos: videoUrl } }
    );

    const publicId = videoUrl.split('/').pop().split('.')[0];
    await require('../config/cloudinary').cloudinary.uploader.destroy(
        `telemedicine/videos/${publicId}`,
        { resource_type: 'video' }
    );

    res.status(200).json({ success: true, message: 'Video deleted' });
};

// @PUT /api/doctors/block-patient/:patientId
// Doctor patient ke block korbe
const blockPatient = async (req, res) => {
    const { patientId } = req.params;

    // patient er active appointments cancel koro
    await Appointment.updateMany(
        {
            doctor: req.user._id,
            patient: patientId,
            status: { $in: ['pending', 'approved'] },
        },
        { status: 'cancelled' }
    );

    // patient ke block (isActive false)
    await User.findByIdAndUpdate(patientId, { isActive: false });

    res.status(200).json({ success: true, message: 'Patient blocked successfully' });
};

// @GET /api/doctors/dashboard/stats
// Doctor dashboard stats
const getDoctorStats = async (req, res) => {
    const doctorId = req.user._id;

    const [
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        todayAppointments,
    ] = await Promise.all([
        Appointment.countDocuments({ doctor: doctorId }),
        Appointment.countDocuments({ doctor: doctorId, status: 'pending' }),
        Appointment.countDocuments({ doctor: doctorId, status: 'completed' }),
        Appointment.countDocuments({
            doctor: doctorId,
            appointmentDate: {
                $gte: new Date().setHours(0, 0, 0, 0),
                $lte: new Date().setHours(23, 59, 59, 999),
            },
        }),
    ]);

    res.status(200).json({
        success: true,
        stats: {
            totalAppointments,
            pendingAppointments,
            completedAppointments,
            todayAppointments,
        },
    });
};

module.exports = {
    getAllDoctors,
    getDoctorById,
    getMyProfile,
    updateDoctorProfile,
    updateAvatar,
    uploadImages,
    uploadVideos,
    deleteImage,
    deleteVideo,
    blockPatient,
    getDoctorStats,
};