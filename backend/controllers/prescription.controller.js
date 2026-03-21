// const Prescription = require('../models/Prescription.model');
// const Appointment = require('../models/Appointment.model');
// const User = require('../models/User.model');
// const Doctor = require('../models/Doctor.model');
// const PDFDocument = require('pdfkit');
// const streamifier = require('streamifier');
// const { cloudinary } = require('../config/cloudinary');
// const { getIO } = require('../config/socket');

// // ─── PDF GENERATE HELPER ───────────────────────────────

// const generatePrescriptionPDF = (data) => {
//     return new Promise((resolve, reject) => {
//         const {
//             doctorName,
//             doctorSpecialization,
//             patientName,
//             diagnosis,
//             medicines,
//             tests,
//             advice,
//             followUpDate,
//             createdAt,
//         } = data;

//         const doc = new PDFDocument({ margin: 50, size: 'A4' });
//         const buffers = [];

//         doc.on('data', (chunk) => buffers.push(chunk));
//         doc.on('error', reject);
//         doc.on('end', async () => {
//             const pdfBuffer = Buffer.concat(buffers);

//             // cloudinary te stream kore upload
//             const uploadStream = cloudinary.uploader.upload_stream(
//                 {
//                     folder: 'telemedicine/prescriptions',
//                     resource_type: 'raw',
//                     format: 'pdf',
//                     public_id: `prescription_${Date.now()}`,
//                 },
//                 (error, result) => {
//                     if (error) return reject(error);
//                     resolve(result.secure_url);
//                 }
//             );

//             streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
//         });

//         // ── HEADER ──────────────────────────────────────────
//         doc
//             .rect(0, 0, doc.page.width, 80)
//             .fill('#0ea5e9');

//         doc
//             .fillColor('#ffffff')
//             .fontSize(24)
//             .font('Helvetica-Bold')
//             .text('TELEMEDICINE', 50, 20, { align: 'center' });

//         doc
//             .fontSize(11)
//             .font('Helvetica')
//             .text('Online Healthcare Platform | www.telemedicine.com', 50, 50, { align: 'center' });

//         doc.fillColor('#000000');

//         // ── DOCTOR & DATE INFO ──────────────────────────────
//         doc.moveDown(2);

//         doc
//             .fontSize(11)
//             .font('Helvetica-Bold')
//             .text(`Dr. ${doctorName}`, 50, 100)
//             .font('Helvetica')
//             .fontSize(10)
//             .fillColor('#555555')
//             .text(doctorSpecialization || 'General Physician', 50, 116);

//         doc
//             .fillColor('#000000')
//             .fontSize(10)
//             .text(
//                 `Date: ${new Date(createdAt || Date.now()).toLocaleDateString('en-GB', {
//                     day: '2-digit',
//                     month: 'long',
//                     year: 'numeric',
//                 })}`,
//                 400,
//                 100,
//                 { align: 'right', width: 145 }
//             );

//         // ── DIVIDER ─────────────────────────────────────────
//         doc
//             .moveTo(50, 140)
//             .lineTo(545, 140)
//             .lineWidth(1)
//             .stroke('#0ea5e9');

//         // ── PATIENT INFO ────────────────────────────────────
//         doc
//             .fontSize(10)
//             .fillColor('#555555')
//             .text('Patient Name:', 50, 155)
//             .fillColor('#000000')
//             .font('Helvetica-Bold')
//             .text(patientName, 140, 155);

//         doc
//             .moveTo(50, 175)
//             .lineTo(545, 175)
//             .lineWidth(0.5)
//             .stroke('#dddddd');

//         // ── DIAGNOSIS ───────────────────────────────────────
//         doc.moveDown(1);
//         let yPos = 185;

//         doc
//             .fontSize(12)
//             .font('Helvetica-Bold')
//             .fillColor('#0ea5e9')
//             .text('Diagnosis', 50, yPos);

//         yPos += 20;

//         doc
//             .fontSize(11)
//             .font('Helvetica')
//             .fillColor('#000000')
//             .text(diagnosis, 50, yPos, { width: 495 });

//         yPos += doc.heightOfString(diagnosis, { width: 495 }) + 15;

//         // ── MEDICINES ───────────────────────────────────────
//         doc
//             .fontSize(12)
//             .font('Helvetica-Bold')
//             .fillColor('#0ea5e9')
//             .text('Medicines', 50, yPos);

//         yPos += 20;

//         medicines.forEach((med, i) => {
//             // medicine row background
//             if (i % 2 === 0) {
//                 doc
//                     .rect(50, yPos - 5, 495, 50)
//                     .fill('#f8fafc');
//             }

//             doc
//                 .fontSize(11)
//                 .font('Helvetica-Bold')
//                 .fillColor('#000000')
//                 .text(`${i + 1}. ${med.name}`, 60, yPos);

//             doc
//                 .fontSize(10)
//                 .font('Helvetica')
//                 .fillColor('#333333')
//                 .text(`Dosage: ${med.dosage}`, 60, yPos + 16, { continued: true })
//                 .text(`   Frequency: ${med.frequency}`, { continued: true })
//                 .text(`   Duration: ${med.duration}`);

//             if (med.notes) {
//                 doc
//                     .fontSize(9)
//                     .fillColor('#777777')
//                     .text(`Note: ${med.notes}`, 60, yPos + 30);
//                 yPos += 55;
//             } else {
//                 yPos += 45;
//             }

//             // page overflow check
//             if (yPos > 700) {
//                 doc.addPage();
//                 yPos = 50;
//             }
//         });

//         yPos += 10;

//         // ── TESTS ───────────────────────────────────────────
//         if (tests && tests.length > 0) {
//             doc
//                 .fontSize(12)
//                 .font('Helvetica-Bold')
//                 .fillColor('#0ea5e9')
//                 .text('Investigations / Tests', 50, yPos);

//             yPos += 20;

//             tests.forEach((test) => {
//                 doc
//                     .fontSize(11)
//                     .font('Helvetica')
//                     .fillColor('#000000')
//                     .text(`• ${test}`, 60, yPos);
//                 yPos += 18;
//             });

//             yPos += 10;
//         }

//         // ── ADVICE ──────────────────────────────────────────
//         if (advice) {
//             if (yPos > 680) {
//                 doc.addPage();
//                 yPos = 50;
//             }

//             doc
//                 .fontSize(12)
//                 .font('Helvetica-Bold')
//                 .fillColor('#0ea5e9')
//                 .text('Advice', 50, yPos);

//             yPos += 20;

//             doc
//                 .fontSize(11)
//                 .font('Helvetica')
//                 .fillColor('#000000')
//                 .text(advice, 50, yPos, { width: 495 });

//             yPos += doc.heightOfString(advice, { width: 495 }) + 15;
//         }

//         // ── FOLLOW UP ───────────────────────────────────────
//         if (followUpDate) {
//             doc
//                 .fontSize(11)
//                 .font('Helvetica-Bold')
//                 .fillColor('#000000')
//                 .text('Follow-up Date: ', 50, yPos, { continued: true })
//                 .font('Helvetica')
//                 .text(
//                     new Date(followUpDate).toLocaleDateString('en-GB', {
//                         day: '2-digit',
//                         month: 'long',
//                         year: 'numeric',
//                     })
//                 );
//         }

//         // ── SIGNATURE ───────────────────────────────────────
//         const signatureY = doc.page.height - 120;

//         doc
//             .moveTo(50, signatureY)
//             .lineTo(545, signatureY)
//             .lineWidth(0.5)
//             .stroke('#dddddd');

//         doc
//             .fontSize(11)
//             .font('Helvetica-Bold')
//             .fillColor('#000000')
//             .text(`Dr. ${doctorName}`, 380, signatureY + 15, { align: 'right', width: 165 });

//         doc
//             .fontSize(9)
//             .font('Helvetica')
//             .fillColor('#555555')
//             .text(doctorSpecialization || 'General Physician', 380, signatureY + 30, {
//                 align: 'right',
//                 width: 165,
//             });

//         // ── FOOTER ──────────────────────────────────────────
//         doc
//             .rect(0, doc.page.height - 40, doc.page.width, 40)
//             .fill('#f1f5f9');

//         doc
//             .fontSize(8)
//             .fillColor('#888888')
//             .font('Helvetica')
//             .text(
//                 'This is a digitally generated prescription. Verify with your doctor before use.',
//                 50,
//                 doc.page.height - 28,
//                 { align: 'center' }
//             );

//         doc.end();
//     });
// };

// // ─── CONTROLLERS ──────────────────────────────────────

// // @POST /api/prescriptions/create
// const createPrescription = async (req, res) => {
//     const {
//         appointmentId,
//         patientId,
//         diagnosis,
//         medicines,
//         tests,
//         advice,
//         followUpDate,
//     } = req.body;

//     if (!diagnosis || !medicines || medicines.length === 0) {
//         return res.status(400).json({
//             success: false,
//             message: 'Diagnosis and at least one medicine are required',
//         });
//     }

//     // appointment verify
//     const appointment = await Appointment.findById(appointmentId);
//     if (!appointment) {
//         return res.status(404).json({ success: false, message: 'Appointment not found' });
//     }

//     if (appointment.doctor.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ success: false, message: 'Not authorized' });
//     }

//     if (!appointment.isPaid) {
//         return res.status(400).json({ success: false, message: 'Appointment is not paid yet' });
//     }

//     // already prescription ache kina check
//     const existing = await Prescription.findOne({ appointment: appointmentId });
//     if (existing) {
//         return res.status(400).json({
//             success: false,
//             message: 'Prescription already created for this appointment',
//         });
//     }

//     // doctor + patient info PDF er jonno
//     const [doctorUser, patientUser, doctorProfile] = await Promise.all([
//         User.findById(req.user._id),
//         User.findById(patientId),
//         Doctor.findOne({ user: req.user._id }),
//     ]);

//     // PDF generate + cloudinary upload
//     const pdfUrl = await generatePrescriptionPDF({
//         doctorName: doctorUser.name,
//         doctorSpecialization: doctorProfile?.specialization || 'General Physician',
//         patientName: patientUser.name,
//         diagnosis,
//         medicines,
//         tests: tests || [],
//         advice,
//         followUpDate,
//         createdAt: new Date(),
//     });

//     // prescription save
//     const prescription = await Prescription.create({
//         appointment: appointmentId,
//         patient: patientId,
//         doctor: req.user._id,
//         diagnosis,
//         medicines,
//         tests: tests || [],
//         advice,
//         followUpDate,
//         pdfUrl,
//     });

//     // appointment complete mark
//     appointment.status = 'completed';
//     await appointment.save();

//     // patient ke real-time notify
//     try {
//         const io = getIO();
//         io.to(patientId.toString()).emit('prescription_ready', {
//             prescriptionId: prescription._id,
//             doctorName: doctorUser.name,
//             message: `Dr. ${doctorUser.name} has sent you a prescription`,
//         });
//     } catch (err) {
//         console.error('Socket notification error:', err.message);
//     }

//     await prescription.populate([
//         { path: 'doctor', select: 'name avatar' },
//         { path: 'patient', select: 'name avatar' },
//         { path: 'appointment', select: 'appointmentDate timeSlot' },
//     ]);

//     res.status(201).json({ success: true, prescription });
// };

// // @GET /api/prescriptions/my
// // Patient er sob prescription
// const getMyPrescriptions = async (req, res) => {
//     const prescriptions = await Prescription.find({ patient: req.user._id })
//         .populate('doctor', 'name avatar email')
//         .populate('appointment', 'appointmentDate timeSlot')
//         .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
// };

// // @GET /api/prescriptions/doctor
// // Doctor er dewa prescriptions
// const getDoctorPrescriptions = async (req, res) => {
//     const prescriptions = await Prescription.find({ doctor: req.user._id })
//         .populate('patient', 'name avatar email')
//         .populate('appointment', 'appointmentDate timeSlot')
//         .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
// };

// // @GET /api/prescriptions/:id
// // Single prescription (patient, doctor, admin)
// const getPrescriptionById = async (req, res) => {
//     const prescription = await Prescription.findById(req.params.id)
//         .populate('doctor', 'name avatar email')
//         .populate('patient', 'name avatar email')
//         .populate('appointment', 'appointmentDate timeSlot type');

//     if (!prescription) {
//         return res.status(404).json({ success: false, message: 'Prescription not found' });
//     }

//     const isPatient = prescription.patient._id.toString() === req.user._id.toString();
//     const isDoctor = prescription.doctor._id.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === 'admin';

//     if (!isPatient && !isDoctor && !isAdmin) {
//         return res.status(403).json({ success: false, message: 'Not authorized' });
//     }

//     res.status(200).json({ success: true, prescription });
// };

// // @PUT /api/prescriptions/:id
// // Doctor prescription update korte parbe (completed appointment er age)
// const updatePrescription = async (req, res) => {
//     const prescription = await Prescription.findById(req.params.id);

//     if (!prescription) {
//         return res.status(404).json({ success: false, message: 'Prescription not found' });
//     }

//     if (prescription.doctor.toString() !== req.user._id.toString()) {
//         return res.status(403).json({ success: false, message: 'Not authorized' });
//     }

//     const { diagnosis, medicines, tests, advice, followUpDate } = req.body;

//     // naya PDF generate koro updated data diye
//     const [doctorUser, patientUser, doctorProfile] = await Promise.all([
//         User.findById(req.user._id),
//         User.findById(prescription.patient),
//         Doctor.findOne({ user: req.user._id }),
//     ]);

//     const pdfUrl = await generatePrescriptionPDF({
//         doctorName: doctorUser.name,
//         doctorSpecialization: doctorProfile?.specialization,
//         patientName: patientUser.name,
//         diagnosis: diagnosis || prescription.diagnosis,
//         medicines: medicines || prescription.medicines,
//         tests: tests || prescription.tests,
//         advice: advice || prescription.advice,
//         followUpDate: followUpDate || prescription.followUpDate,
//         createdAt: prescription.createdAt,
//     });

//     const updated = await Prescription.findByIdAndUpdate(
//         req.params.id,
//         { diagnosis, medicines, tests, advice, followUpDate, pdfUrl },
//         { new: true, runValidators: true }
//     ).populate([
//         { path: 'doctor', select: 'name avatar' },
//         { path: 'patient', select: 'name avatar' },
//     ]);

//     res.status(200).json({ success: true, prescription: updated });
// };

// // @GET /api/prescriptions/:id/download
// // PDF download URL return korbe
// const downloadPrescription = async (req, res) => {
//     const prescription = await Prescription.findById(req.params.id);

//     if (!prescription) {
//         return res.status(404).json({ success: false, message: 'Prescription not found' });
//     }

//     const isPatient = prescription.patient.toString() === req.user._id.toString();
//     const isDoctor = prescription.doctor.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === 'admin';

//     if (!isPatient && !isDoctor && !isAdmin) {
//         return res.status(403).json({ success: false, message: 'Not authorized' });
//     }

//     if (!prescription.pdfUrl) {
//         return res.status(404).json({ success: false, message: 'PDF not found' });
//     }

//     res.status(200).json({
//         success: true,
//         pdfUrl: prescription.pdfUrl,
//     });
// };

// module.exports = {
//     createPrescription,
//     getMyPrescriptions,
//     getDoctorPrescriptions,
//     getPrescriptionById,
//     updatePrescription,
//     downloadPrescription,
// };







// const Prescription = require('../models/Prescription.model');
// const Appointment = require('../models/Appointment.model');
// const User = require('../models/User.model');
// const Doctor = require('../models/Doctor.model');
// const PDFDocument = require('pdfkit');
// const streamifier = require('streamifier');
// const { cloudinary } = require('../config/cloudinary');
// const { getIO } = require('../config/socket');

// // ─── PDF GENERATE HELPER ───────────────────────────────

// const generatePrescriptionPDF = (data) => {
//     return new Promise((resolve, reject) => {
//         const {
//             doctorName,
//             doctorSpecialization,
//             patientName,
//             patientAge,
//             patientSex,
//             diagnosis,
//             medicines,
//             tests,
//             advice,
//             followUpDate,
//             createdAt,
//         } = data;

//         const doc = new PDFDocument({ margin: 50, size: 'A4' });
//         const buffers = [];

//         doc.on('data', (chunk) => buffers.push(chunk));
//         doc.on('error', reject);
//         doc.on('end', async () => {
//             const pdfBuffer = Buffer.concat(buffers);

//             const uploadStream = cloudinary.uploader.upload_stream(
//                 {
//                     folder: 'telemedicine/prescriptions',
//                     resource_type: 'raw',
//                     format: 'pdf',
//                     public_id: `prescription_${Date.now()}`,
//                 },
//                 (error, result) => {
//                     if (error) return reject(error);
//                     resolve(result.secure_url);
//                 }
//             );

//             streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
//         });

//         // ── HEADER ──────────────────────────────────────────
//         // doc.rect(0, 0, doc.page.width, 95).fill('#0ea5e9');

//         // doc
//         //     .fillColor('#ffffff')
//         //     .fontSize(24)
//         //     .font('Helvetica-Bold')
//         //     .text('Dr.ANINDADATTA', 50, 20, { align: 'center' });

//         // doc
//         //     .fontSize(11)
//         //     .font('Helvetica')
//         //     .text('Online Healthcare Platform | www.dranindadatta.com', 50, 50, { align: 'center' });

//         // doc.fillColor('#000000');



//         doc.rect(0, 0, doc.page.width, 90).fill('#0ea5e9');

//         doc
//             .fillColor('#ffffff')
//             .fontSize(24)
//             .font('Helvetica-Bold')
//             .text('Dr.ANINDADATTA', 50, 15, { align: 'center' });

//         doc
//             .fontSize(11)
//             .font('Helvetica')
//             .text('Online Healthcare Platform | www.dranindadatta.com', 50, 45, { align: 'center' });

//         // ✅ Phone number
//         doc
//             .fontSize(10)
//             .font('Helvetica')
//             .text('Phone: 01234-567890', 50, 60, { align: 'center' });

//         doc.fillColor('#000000');


//         // ── DOCTOR & DATE INFO ──────────────────────────────
//         doc.moveDown(2);

//         doc
//             .fontSize(11)
//             .font('Helvetica-Bold')
//             .text(`Dr. ${doctorName}`, 50, 100)
//             .font('Helvetica')
//             .fontSize(10)
//             .fillColor('#555555')
//             .text(doctorSpecialization || 'General Physician', 50, 116);

//         doc
//             .fillColor('#000000')
//             .fontSize(10)
//             .text(
//                 `Date: ${new Date(createdAt || Date.now()).toLocaleDateString('en-GB', {
//                     day: '2-digit',
//                     month: 'long',
//                     year: 'numeric',
//                 })}`,
//                 400, 100,
//                 { align: 'right', width: 145 }
//             );

//         // ── DIVIDER ─────────────────────────────────────────
//         doc.moveTo(50, 140).lineTo(545, 140).lineWidth(1).stroke('#0ea5e9');

//         // ── PATIENT INFO ────────────────────────────────────
//         doc
//             .fontSize(10)
//             .fillColor('#555555')
//             .text('Patient Name:', 50, 155)
//             .fillColor('#000000')
//             .font('Helvetica-Bold')
//             .text(patientName, 140, 155);

//         // ✅ Age and Sex
//         doc
//             .fontSize(10)
//             .font('Helvetica')
//             .fillColor('#555555')
//             .text('Age:', 50, 170)
//             .fillColor('#000000')
//             .font('Helvetica-Bold')
//             .text(patientAge ? `${patientAge} yrs` : 'N/A', 90, 170)
//             .font('Helvetica')
//             .fillColor('#555555')
//             .text('Sex:', 180, 170)
//             .fillColor('#000000')
//             .font('Helvetica-Bold')
//             .text(patientSex || 'N/A', 210, 170);

//         doc.moveTo(50, 190).lineTo(545, 190).lineWidth(0.5).stroke('#dddddd');

//         // ── DIAGNOSIS ───────────────────────────────────────
//         doc.moveDown(1);
//         let yPos = 200;

//         doc.fontSize(12).font('Helvetica-Bold').fillColor('#0ea5e9').text('Diagnosis', 50, yPos);
//         yPos += 20;
//         doc.fontSize(11).font('Helvetica').fillColor('#000000').text(diagnosis, 50, yPos, { width: 495 });
//         yPos += doc.heightOfString(diagnosis, { width: 495 }) + 15;

//         // ── MEDICINES ───────────────────────────────────────
//         doc.fontSize(12).font('Helvetica-Bold').fillColor('#0ea5e9').text('Medicines', 50, yPos);
//         yPos += 20;

//         medicines.forEach((med, i) => {
//             if (i % 2 === 0) {
//                 doc.rect(50, yPos - 5, 495, 50).fill('#f8fafc');
//             }

//             doc.fontSize(11).font('Helvetica-Bold').fillColor('#000000').text(`${i + 1}. ${med.name}`, 60, yPos);
//             doc
//                 .fontSize(10)
//                 .font('Helvetica')
//                 .fillColor('#333333')
//                 .text(`Dosage: ${med.dosage}`, 60, yPos + 16, { continued: true })
//                 .text(`   Frequency: ${med.frequency}`, { continued: true })
//                 .text(`   Duration: ${med.duration}`);

//             if (med.notes) {
//                 doc.fontSize(9).fillColor('#777777').text(`Note: ${med.notes}`, 60, yPos + 30);
//                 yPos += 55;
//             } else {
//                 yPos += 45;
//             }

//             if (yPos > 700) {
//                 doc.addPage();
//                 yPos = 50;
//             }
//         });

//         yPos += 10;

//         // ── TESTS ───────────────────────────────────────────
//         if (tests && tests.length > 0) {
//             doc.fontSize(12).font('Helvetica-Bold').fillColor('#0ea5e9').text('Investigations / Tests', 50, yPos);
//             yPos += 20;

//             tests.forEach((test) => {
//                 doc.fontSize(11).font('Helvetica').fillColor('#000000').text(`• ${test}`, 60, yPos);
//                 yPos += 18;
//             });

//             yPos += 10;
//         }

//         // ── ADVICE ──────────────────────────────────────────
//         if (advice) {
//             if (yPos > 680) { doc.addPage(); yPos = 50; }

//             doc.fontSize(12).font('Helvetica-Bold').fillColor('#0ea5e9').text('Advice', 50, yPos);
//             yPos += 20;
//             doc.fontSize(11).font('Helvetica').fillColor('#000000').text(advice, 50, yPos, { width: 495 });
//             yPos += doc.heightOfString(advice, { width: 495 }) + 15;
//         }

//         // ── FOLLOW UP ───────────────────────────────────────
//         if (followUpDate) {
//             doc
//                 .fontSize(11)
//                 .font('Helvetica-Bold')
//                 .fillColor('#000000')
//                 .text('Follow-up Date: ', 50, yPos, { continued: true })
//                 .font('Helvetica')
//                 .text(
//                     new Date(followUpDate).toLocaleDateString('en-GB', {
//                         day: '2-digit', month: 'long', year: 'numeric',
//                     })
//                 );
//         }

//         // ── SIGNATURE ───────────────────────────────────────
//         const signatureY = doc.page.height - 120;

//         doc.moveTo(50, signatureY).lineTo(545, signatureY).lineWidth(0.5).stroke('#dddddd');

//         doc
//             .fontSize(11).font('Helvetica-Bold').fillColor('#000000')
//             .text(`Dr. ${doctorName}`, 380, signatureY + 15, { align: 'right', width: 165 });

//         doc
//             .fontSize(9).font('Helvetica').fillColor('#555555')
//             .text(doctorSpecialization || 'General Physician', 380, signatureY + 30, { align: 'right', width: 165 });

//         // ── FOOTER ──────────────────────────────────────────
//         doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill('#f1f5f9');

//         doc
//             .fontSize(8).fillColor('#888888').font('Helvetica')
//             .text(
//                 'This is a digitally generated prescription. Verify with your doctor before use.',
//                 50, doc.page.height - 28,
//                 { align: 'center' }
//             );

//         doc.end();
//     });
// };

// // ─── CONTROLLERS ──────────────────────────────────────

// // @POST /api/prescriptions/create
// const createPrescription = async (req, res) => {
//     // ✅ FIX: Wrapped entire controller in try/catch
//     try {
//         const { appointmentId, patientId, diagnosis, medicines, tests, advice, followUpDate, patientAge, patientSex } = req.body;

//         if (!diagnosis || !medicines || medicines.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Diagnosis and at least one medicine are required',
//             });
//         }

//         const appointment = await Appointment.findById(appointmentId);
//         if (!appointment) {
//             return res.status(404).json({ success: false, message: 'Appointment not found' });
//         }

//         if (appointment.doctor.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ success: false, message: 'Not authorized' });
//         }

//         if (!appointment.isPaid) {
//             return res.status(400).json({ success: false, message: 'Appointment is not paid yet' });
//         }

//         const existing = await Prescription.findOne({ appointment: appointmentId });
//         if (existing) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Prescription already created for this appointment',
//             });
//         }

//         const [doctorUser, patientUser, doctorProfile] = await Promise.all([
//             User.findById(req.user._id),
//             User.findById(patientId),
//             Doctor.findOne({ user: req.user._id }),
//         ]);

//         // ✅ FIX: Guard against null patientUser to prevent TypeError crash
//         if (!patientUser) {
//             return res.status(404).json({ success: false, message: 'Patient not found' });
//         }

//         const pdfUrl = await generatePrescriptionPDF({
//             doctorName: doctorUser.name,
//             doctorSpecialization: doctorProfile?.specialization || 'General Physician',
//             patientName: patientUser.name,
//             patientAge,
//             patientSex,
//             diagnosis,
//             medicines,
//             tests: tests || [],
//             advice,
//             followUpDate,
//             createdAt: new Date(),
//         });

//         const prescription = await Prescription.create({
//             appointment: appointmentId,
//             patient: patientId,
//             doctor: req.user._id,
//             diagnosis,
//             medicines,
//             tests: tests || [],
//             advice,
//             followUpDate,
//             patientAge,
//             patientSex,
//             pdfUrl,
//         });

//         appointment.status = 'completed';
//         await appointment.save();

//         // Socket errors should never fail the whole request
//         try {
//             const io = getIO();
//             io.to(patientId.toString()).emit('prescription_ready', {
//                 prescriptionId: prescription._id,
//                 doctorName: doctorUser.name,
//                 message: `Dr. ${doctorUser.name} has sent you a prescription`,
//             });
//         } catch (socketErr) {
//             console.error('Socket notification error:', socketErr.message);
//         }

//         await prescription.populate([
//             { path: 'doctor', select: 'name avatar' },
//             { path: 'patient', select: 'name avatar' },
//             { path: 'appointment', select: 'appointmentDate timeSlot' },
//         ]);

//         res.status(201).json({ success: true, prescription });

//     } catch (err) {
//         console.error('createPrescription error:', err);
//         res.status(500).json({ success: false, message: err.message || 'Server error' });
//     }
// };

// // @GET /api/prescriptions/my
// const getMyPrescriptions = async (req, res) => {
//     // ✅ FIX: Added try/catch
//     try {
//         const prescriptions = await Prescription.find({ patient: req.user._id })
//             .populate('doctor', 'name avatar email')
//             .populate('appointment', 'appointmentDate timeSlot')
//             .sort({ createdAt: -1 });

//         res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
//     } catch (err) {
//         console.error('getMyPrescriptions error:', err);
//         res.status(500).json({ success: false, message: err.message || 'Server error' });
//     }
// };

// // @GET /api/prescriptions/doctor
// const getDoctorPrescriptions = async (req, res) => {
//     // ✅ FIX: Added try/catch
//     try {
//         const prescriptions = await Prescription.find({ doctor: req.user._id })
//             .populate('patient', 'name avatar email')
//             .populate('appointment', 'appointmentDate timeSlot')
//             .sort({ createdAt: -1 });

//         res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
//     } catch (err) {
//         console.error('getDoctorPrescriptions error:', err);
//         res.status(500).json({ success: false, message: err.message || 'Server error' });
//     }
// };

// // @GET /api/prescriptions/:id
// const getPrescriptionById = async (req, res) => {
//     // ✅ FIX: Added try/catch
//     try {
//         const prescription = await Prescription.findById(req.params.id)
//             .populate('doctor', 'name avatar email')
//             .populate('patient', 'name avatar email')
//             .populate('appointment', 'appointmentDate timeSlot type');

//         if (!prescription) {
//             return res.status(404).json({ success: false, message: 'Prescription not found' });
//         }

//         const isPatient = prescription.patient._id.toString() === req.user._id.toString();
//         const isDoctor = prescription.doctor._id.toString() === req.user._id.toString();
//         const isAdmin = req.user.role === 'admin';

//         if (!isPatient && !isDoctor && !isAdmin) {
//             return res.status(403).json({ success: false, message: 'Not authorized' });
//         }

//         res.status(200).json({ success: true, prescription });
//     } catch (err) {
//         console.error('getPrescriptionById error:', err);
//         res.status(500).json({ success: false, message: err.message || 'Server error' });
//     }
// };

// // @PUT /api/prescriptions/:id
// const updatePrescription = async (req, res) => {
//     // ✅ FIX: Added try/catch
//     try {
//         const prescription = await Prescription.findById(req.params.id);

//         if (!prescription) {
//             return res.status(404).json({ success: false, message: 'Prescription not found' });
//         }

//         if (prescription.doctor.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ success: false, message: 'Not authorized' });
//         }

//         const { diagnosis, medicines, tests, advice, followUpDate, patientAge, patientSex } = req.body;

//         const [doctorUser, patientUser, doctorProfile] = await Promise.all([
//             User.findById(req.user._id),
//             User.findById(prescription.patient),
//             Doctor.findOne({ user: req.user._id }),
//         ]);

//         const pdfUrl = await generatePrescriptionPDF({
//             doctorName: doctorUser.name,
//             doctorSpecialization: doctorProfile?.specialization,
//             patientName: patientUser.name,
//             patientAge: patientAge || prescription.patientAge,
//             patientSex: patientSex || prescription.patientSex,
//             diagnosis: diagnosis || prescription.diagnosis,
//             medicines: medicines || prescription.medicines,
//             tests: tests || prescription.tests,
//             advice: advice || prescription.advice,
//             followUpDate: followUpDate || prescription.followUpDate,
//             createdAt: prescription.createdAt,
//         });

//         const updated = await Prescription.findByIdAndUpdate(
//             req.params.id,
//             { diagnosis, medicines, tests, advice, followUpDate, patientAge, patientSex, pdfUrl },
//             { new: true, runValidators: true }
//         ).populate([
//             { path: 'doctor', select: 'name avatar' },
//             { path: 'patient', select: 'name avatar' },
//         ]);

//         res.status(200).json({ success: true, prescription: updated });
//     } catch (err) {
//         console.error('updatePrescription error:', err);
//         res.status(500).json({ success: false, message: err.message || 'Server error' });
//     }
// };

// // @GET /api/prescriptions/:id/download
// const downloadPrescription = async (req, res) => {
//     // ✅ FIX: Added try/catch
//     try {
//         const prescription = await Prescription.findById(req.params.id);

//         if (!prescription) {
//             return res.status(404).json({ success: false, message: 'Prescription not found' });
//         }

//         const isPatient = prescription.patient.toString() === req.user._id.toString();
//         const isDoctor = prescription.doctor.toString() === req.user._id.toString();
//         const isAdmin = req.user.role === 'admin';

//         if (!isPatient && !isDoctor && !isAdmin) {
//             return res.status(403).json({ success: false, message: 'Not authorized' });
//         }

//         if (!prescription.pdfUrl) {
//             return res.status(404).json({ success: false, message: 'PDF not found' });
//         }

//         res.status(200).json({ success: true, pdfUrl: prescription.pdfUrl });
//     } catch (err) {
//         console.error('downloadPrescription error:', err);
//         res.status(500).json({ success: false, message: err.message || 'Server error' });
//     }
// };

// module.exports = {
//     createPrescription,
//     getMyPrescriptions,
//     getDoctorPrescriptions,
//     getPrescriptionById,
//     updatePrescription,
//     downloadPrescription,
// };









const Prescription = require('../models/Prescription.model');
const Appointment = require('../models/Appointment.model');
const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const PDFDocument = require('pdfkit');
const streamifier = require('streamifier');
const { cloudinary } = require('../config/cloudinary');
const { getIO } = require('../config/socket');

// ─── PDF GENERATE HELPER ───────────────────────────────

const generatePrescriptionPDF = (data) => {
    return new Promise((resolve, reject) => {
        const {
            doctorName,
            doctorSpecialization,
            patientName,
            patientAge,
            patientSex,
            diagnosis,
            medicines,
            tests,
            advice,
            followUpDate,
            createdAt,
        } = data;

        const W = 595.28;
        const H = 841.89;
        const pad = 36;

        const doc = new PDFDocument({ margin: 0, size: 'A4' });
        const buffers = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('error', reject);
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'telemedicine/prescriptions',
                    resource_type: 'auto',
                    format: 'pdf',
                    public_id: `prescription_${Date.now()}`,
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            );
            streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
        });

        // ═══════════════════════════════════════════════════
        // HEADER  (3 columns: left credentials | center logo | right credentials)
        // ═══════════════════════════════════════════════════
        const colW = 175;
        const leftX = pad;
        const cx = W / 2;
        const rightX = W - pad - colW;
        let lY = 22, rY = 22;

        // ── LEFT column ──────────────────────────────────
        doc.fontSize(6.5).font('Helvetica').fillColor('#1a6b3a')
            .text('Gov.registered A Category Holistic Medicine physician', leftX, lY, { width: colW });
        lY += 12;
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
            .text(doctorName, leftX, lY, { width: colW });
        lY += 15;
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#000000')
            .text('BUMS(Finalist), DUMS(HSEMCH)', leftX, lY, { width: colW });
        lY += 10;
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#000000')
            .text('DPMC (Dhaka), CPM(BTEB)', leftX, lY, { width: colW });
        lY += 10;
        doc.fontSize(7).font('Helvetica').fillColor('#1a6b3a')
            .text('BUASM Reg.No -4047', leftX, lY, { width: colW });
        lY += 12;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000')
            .text('Lecturer', leftX, lY, { width: colW });
        lY += 10;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Oxford Unani Ayurvedic Medical College & Hospital.', leftX, lY, { width: colW });
        lY += 10;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000')
            .text('Honorary FT', leftX, lY, { width: colW });
        lY += 10;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Dhaka Medical College Hospital.', leftX, lY, { width: colW });
        lY += 9;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Shaheed Suhrawardy Medical College & Hospital.', leftX, lY, { width: colW });
        lY += 9;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Dr.MR Khan Sheshi Hospital Mirpur -2, Dhaka.', leftX, lY, { width: colW });
        lY += 9;

        // ── CENTER logo ───────────────────────────────────
        const logoTop = 22;
        // Cross shape
        doc.rect(cx - 7, logoTop, 14, 40).fill('#2e7d32');
        doc.rect(cx - 20, logoTop + 13, 40, 14).fill('#2e7d32');
        // Heartbeat
        doc.moveTo(cx - 20, logoTop + 20)
            .lineTo(cx - 9, logoTop + 20)
            .lineTo(cx - 4, logoTop + 9)
            .lineTo(cx, logoTop + 32)
            .lineTo(cx + 4, logoTop + 17)
            .lineTo(cx + 9, logoTop + 20)
            .lineTo(cx + 20, logoTop + 20)
            .lineWidth(1.5).stroke('#ffffff');
        // Name
        doc.fontSize(13).font('Helvetica-Bold').fillColor('#2e7d32')
            .text('Dr.AnindaDatta', cx - 32, logoTop + 44, { width: 64, align: 'center' });
        // doc.fontSize(4.5).font('Helvetica').fillColor('#777777')
        //     .text('— HEALTHCARE —', cx - 36, logoTop + 58, { width: 72, align: 'center' });

        // ── RIGHT column ──────────────────────────────────
        doc.fontSize(6.5).font('Helvetica').fillColor('#1a6b3a')
            .text('Gov.registered A Category Holistic Medicine physician', rightX, rY, { width: colW });
        rY += 12;
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000')
            .text(`${doctorName}`, rightX, rY, { width: colW });
        rY += 15;
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#000000')
            .text('BUMS(Finalist), DUMS(HSEMCH)', rightX, rY, { width: colW });
        rY += 10;
        doc.fontSize(7).font('Helvetica-Bold').fillColor('#000000')
            .text('DPMC (Dhaka), CPM(BTEB)', rightX, rY, { width: colW });
        rY += 10;
        doc.fontSize(7).font('Helvetica').fillColor('#1a6b3a')
            .text('BUASM Reg.No -4047', rightX, rY, { width: colW });
        rY += 12;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000')
            .text('Lecturer', rightX, rY, { width: colW });
        rY += 10;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Oxford Unani Ayurvedic Medical College & Hospital.', rightX, rY, { width: colW });
        rY += 10;
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000')
            .text('Honorary FT', rightX, rY, { width: colW });
        rY += 10;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Dhaka Medical College Hospital.', rightX, rY, { width: colW });
        rY += 9;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Shaheed Suhrawardy Medical College & Hospital.', rightX, rY, { width: colW });
        rY += 9;
        doc.fontSize(6.5).font('Helvetica').fillColor('#1565c0')
            .text('Dr.MR Khan Sheshi Hospital Mirpur -2, Dhaka.', rightX, rY, { width: colW });
        rY += 9;

        // ── Header bottom divider ─────────────────────────
        const headerEnd = Math.max(lY, rY) + 8;
        doc.moveTo(pad, headerEnd).lineTo(W - pad, headerEnd).lineWidth(1).stroke('#000000');

        // ═══════════════════════════════════════════════════
        // PATIENT INFO BAR
        // ═══════════════════════════════════════════════════
        const pY = headerEnd + 10;
        const dateStr = new Date(createdAt || Date.now()).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
        });

        doc.fontSize(8.5).font('Helvetica').fillColor('#555555').text('Patient:', pad, pY);
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#000000').text(patientName, pad + 44, pY);
        doc.fontSize(8.5).font('Helvetica').fillColor('#555555').text('Age:', 240, pY);
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#000000')
            .text(patientAge ? `${patientAge} yrs` : '-', 262, pY);
        doc.fontSize(8.5).font('Helvetica').fillColor('#555555').text('Sex:', 320, pY);
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor('#000000')
            .text(patientSex || '-', 342, pY);
        doc.fontSize(8.5).font('Helvetica').fillColor('#555555')
            .text(`Date: ${dateStr}`, W - pad - 130, pY, { width: 130, align: 'right' });

        doc.moveTo(pad, pY + 16).lineTo(W - pad, pY + 16).lineWidth(0.5).stroke('#cccccc');

        // ═══════════════════════════════════════════════════
        // CONTENT  (yPos tracks vertical position)
        // ═══════════════════════════════════════════════════
        const footerH = 68;  // footer height reserved at bottom
        const maxY = H - footerH - 10;
        let yPos = pY + 26;
        const contentW = W - pad * 2;

        // ── Diagnosis ─────────────────────────────────────
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').text('Diagnosis:', pad, yPos);
        yPos += 13;
        doc.fontSize(9).font('Helvetica').fillColor('#333333')
            .text(diagnosis, pad + 8, yPos, { width: contentW - 8 });
        yPos += doc.heightOfString(diagnosis, { width: contentW - 8, fontSize: 9 }) + 12;

        // ── Medicines ─────────────────────────────────────
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').text('Medicines:', pad, yPos);
        yPos += 13;

        medicines.forEach((med, i) => {
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
                .text(`${i + 1}.  ${med.name}`, pad + 8, yPos);
            yPos += 12;
            doc.fontSize(8).font('Helvetica').fillColor('#444444')
                .text(`Dosage: ${med.dosage}   |   Frequency: ${med.frequency}   |   Duration: ${med.duration}`, pad + 18, yPos);
            yPos += 11;
            if (med.notes) {
                doc.fontSize(7.5).fillColor('#777777').text(`Note: ${med.notes}`, pad + 18, yPos);
                yPos += 10;
            }
            yPos += 4;
        });

        yPos += 6;

        // ── Tests ─────────────────────────────────────────
        if (tests && tests.length > 0) {
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
                .text('Investigations / Tests:', pad, yPos);
            yPos += 13;
            tests.forEach((test) => {
                doc.fontSize(9).font('Helvetica').fillColor('#333333')
                    .text(`• ${test}`, pad + 8, yPos);
                yPos += 12;
            });
            yPos += 6;
        }

        // ── Advice ────────────────────────────────────────
        if (advice) {
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000').text('Advice:', pad, yPos);
            yPos += 13;
            doc.fontSize(9).font('Helvetica').fillColor('#333333')
                .text(advice, pad + 8, yPos, { width: contentW - 8 });
            yPos += doc.heightOfString(advice, { width: contentW - 8, fontSize: 9 }) + 12;
        }

        // ── Follow-up ─────────────────────────────────────
        if (followUpDate) {
            doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000')
                .text('Follow-up Date: ', pad, yPos, { continued: true })
                .font('Helvetica')
                .text(new Date(followUpDate).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'long', year: 'numeric',
                }));
            yPos += 14;
        }

        // ── Signature line ────────────────────────────────
        const sigY = maxY - 28;
        doc.moveTo(W - pad - 130, sigY).lineTo(W - pad, sigY).lineWidth(0.5).stroke('#999999');
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#000000')
            .text(`Dr. ${doctorName}`, W - pad - 130, sigY + 5, { width: 130, align: 'center' });
        doc.fontSize(7).font('Helvetica').fillColor('#555555')
            .text(doctorSpecialization || 'General Physician', W - pad - 130, sigY + 16, { width: 130, align: 'center' });

        // ═══════════════════════════════════════════════════
        // FOOTER
        // ═══════════════════════════════════════════════════
        const fY = H - footerH;
        doc.moveTo(0, fY).lineTo(W, fY).lineWidth(0.8).stroke('#cccccc');
        doc.rect(0, fY, W, footerH).fill('#f7f7f7');

        // Left — address
        doc.fontSize(7.5).font('Helvetica').fillColor('#333333')
            .text('Rupayan Trade Center, 3rd Floor,', pad, fY + 10)
            .text('114 Kazi Nazrul Islam Avenue', pad, fY + 20)
            .text('Banglamotor, Dhaka 1000', pad, fY + 30);

        // Center — phone circle
        doc.circle(W / 2, fY + 22, 14).fill('#2e7d32');
        doc.fontSize(8).font('Helvetica-Bold').fillColor('#ffffff')
            .text('Dr.AD', W / 2 - 4, fY + 17);
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#000000')
            .text('01630079099', W / 2 - 38, fY + 40, { width: 76, align: 'center' });

        // Right — web & email
        doc.fontSize(7.5).font('Helvetica').fillColor('#333333')
            .text('dranindadatta.com', W - pad - 150, fY + 10, { width: 150, align: 'right' })
            .text('dranindadatta@gmail.com', W - pad - 150, fY + 22, { width: 150, align: 'right' });

        // Disclaimer
        doc.fontSize(6.5).font('Helvetica').fillColor('#aaaaaa')
            .text('This is a digitally generated prescription. Verify with your doctor before use.',
                pad, fY + 54, { width: W - pad * 2, align: 'center' });

        doc.end();
    });
};

// ─── CONTROLLERS ──────────────────────────────────────

// @POST /api/prescriptions/create
const createPrescription = async (req, res) => {
    // ✅ FIX: Wrapped entire controller in try/catch
    try {
        const { appointmentId, patientId, diagnosis, medicines, tests, advice, followUpDate, patientAge, patientSex } = req.body;

        if (!diagnosis || !medicines || medicines.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Diagnosis and at least one medicine are required',
            });
        }

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointment.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (!appointment.isPaid) {
            return res.status(400).json({ success: false, message: 'Appointment is not paid yet' });
        }

        const existing = await Prescription.findOne({ appointment: appointmentId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Prescription already created for this appointment',
            });
        }

        const [doctorUser, patientUser, doctorProfile] = await Promise.all([
            User.findById(req.user._id),
            User.findById(patientId),
            Doctor.findOne({ user: req.user._id }),
        ]);

        // ✅ FIX: Guard against null patientUser to prevent TypeError crash
        if (!patientUser) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }

        const pdfUrl = await generatePrescriptionPDF({
            doctorName: doctorUser.name,
            doctorSpecialization: doctorProfile?.specialization || 'General Physician',
            patientName: patientUser.name,
            patientAge,
            patientSex,
            diagnosis,
            medicines,
            tests: tests || [],
            advice,
            followUpDate,
            createdAt: new Date(),
        });

        const prescription = await Prescription.create({
            appointment: appointmentId,
            patient: patientId,
            doctor: req.user._id,
            diagnosis,
            medicines,
            tests: tests || [],
            advice,
            followUpDate,
            patientAge,
            patientSex,
            pdfUrl,
        });

        appointment.status = 'completed';
        await appointment.save();

        // Socket errors should never fail the whole request
        try {
            const io = getIO();
            io.to(patientId.toString()).emit('prescription_ready', {
                prescriptionId: prescription._id,
                doctorName: doctorUser.name,
                message: `Dr. ${doctorUser.name} has sent you a prescription`,
            });
        } catch (socketErr) {
            console.error('Socket notification error:', socketErr.message);
        }

        await prescription.populate([
            { path: 'doctor', select: 'name avatar' },
            { path: 'patient', select: 'name avatar' },
            { path: 'appointment', select: 'appointmentDate timeSlot' },
        ]);

        res.status(201).json({ success: true, prescription });

    } catch (err) {
        console.error('createPrescription error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @GET /api/prescriptions/my
const getMyPrescriptions = async (req, res) => {
    // ✅ FIX: Added try/catch
    try {
        const prescriptions = await Prescription.find({ patient: req.user._id })
            .populate('doctor', 'name avatar email')
            .populate('appointment', 'appointmentDate timeSlot')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
    } catch (err) {
        console.error('getMyPrescriptions error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @GET /api/prescriptions/doctor
const getDoctorPrescriptions = async (req, res) => {
    // ✅ FIX: Added try/catch
    try {
        const prescriptions = await Prescription.find({ doctor: req.user._id })
            .populate('patient', 'name avatar email')
            .populate('appointment', 'appointmentDate timeSlot')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
    } catch (err) {
        console.error('getDoctorPrescriptions error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @GET /api/prescriptions/:id
const getPrescriptionById = async (req, res) => {
    // ✅ FIX: Added try/catch
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate('doctor', 'name avatar email')
            .populate('patient', 'name avatar email')
            .populate('appointment', 'appointmentDate timeSlot type');

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        const isPatient = prescription.patient._id.toString() === req.user._id.toString();
        const isDoctor = prescription.doctor._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({ success: true, prescription });
    } catch (err) {
        console.error('getPrescriptionById error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @PUT /api/prescriptions/:id
const updatePrescription = async (req, res) => {
    // ✅ FIX: Added try/catch
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        if (prescription.doctor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { diagnosis, medicines, tests, advice, followUpDate, patientAge, patientSex } = req.body;

        const [doctorUser, patientUser, doctorProfile] = await Promise.all([
            User.findById(req.user._id),
            User.findById(prescription.patient),
            Doctor.findOne({ user: req.user._id }),
        ]);

        const pdfUrl = await generatePrescriptionPDF({
            doctorName: doctorUser.name,
            doctorSpecialization: doctorProfile?.specialization,
            patientName: patientUser.name,
            patientAge: patientAge || prescription.patientAge,
            patientSex: patientSex || prescription.patientSex,
            diagnosis: diagnosis || prescription.diagnosis,
            medicines: medicines || prescription.medicines,
            tests: tests || prescription.tests,
            advice: advice || prescription.advice,
            followUpDate: followUpDate || prescription.followUpDate,
            createdAt: prescription.createdAt,
        });

        const updated = await Prescription.findByIdAndUpdate(
            req.params.id,
            { diagnosis, medicines, tests, advice, followUpDate, patientAge, patientSex, pdfUrl },
            { new: true, runValidators: true }
        ).populate([
            { path: 'doctor', select: 'name avatar' },
            { path: 'patient', select: 'name avatar' },
        ]);

        res.status(200).json({ success: true, prescription: updated });
    } catch (err) {
        console.error('updatePrescription error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

// @GET /api/prescriptions/:id/download
const downloadPrescription = async (req, res) => {
    // ✅ FIX: Added try/catch
    try {
        const prescription = await Prescription.findById(req.params.id);

        if (!prescription) {
            return res.status(404).json({ success: false, message: 'Prescription not found' });
        }

        const isPatient = prescription.patient.toString() === req.user._id.toString();
        const isDoctor = prescription.doctor.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isPatient && !isDoctor && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (!prescription.pdfUrl) {
            return res.status(404).json({ success: false, message: 'PDF not found' });
        }

        res.status(200).json({ success: true, pdfUrl: prescription.pdfUrl });
    } catch (err) {
        console.error('downloadPrescription error:', err);
        res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
};

module.exports = {
    createPrescription,
    getMyPrescriptions,
    getDoctorPrescriptions,
    getPrescriptionById,
    updatePrescription,
    downloadPrescription,
};