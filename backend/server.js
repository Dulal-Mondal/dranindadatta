// // const express = require('express');
// // const http = require('http');
// // const { Server } = require('socket.io');
// // const cors = require('cors');
// // const dotenv = require('dotenv');
// // const connectDB = require('./config/db');
// // const errorMiddleware = require('./middleware/error.middleware');
// // const { initSocket } = require('./config/socket');
// // // routes
// // const authRoutes = require('./routes/auth.routes');
// // const doctorRoutes = require('./routes/doctor.routes');
// // const patientRoutes = require('./routes/patient.routes');
// // const appointmentRoutes = require('./routes/appointment.routes');
// // const prescriptionRoutes = require('./routes/prescription.routes');
// // const messageRoutes = require('./routes/message.routes');
// // const paymentRoutes = require('./routes/payment.routes');
// // const adminRoutes = require('./routes/admin.routes');

// // dotenv.config();
// // connectDB();

// // const app = express();
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //     cors: {
// //         origin: process.env.CLIENT_URL || 'http://localhost:5173',
// //         methods: ['GET', 'POST'],
// //     },
// // });

// // // http server create er পরে
// // const io = initSocket(server);

// // // controllers এ directly getIO() দিয়ে use করা যাবে
// // // req.io ছাড়াও
// // app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: true }));

// // // make io accessible in controllers
// // app.use((req, res, next) => {
// //     req.io = io;
// //     next();
// // });

// // // routes
// // app.use('/api/auth', authRoutes);
// // app.use('/api/doctors', doctorRoutes);
// // app.use('/api/patients', patientRoutes);
// // app.use('/api/appointments', appointmentRoutes);
// // app.use('/api/prescriptions', prescriptionRoutes);
// // app.use('/api/messages', messageRoutes);
// // app.use('/api/payments', paymentRoutes);
// // app.use('/api/admin', adminRoutes);

// // app.get('/', (req, res) => res.send('Telemedicine API running'));

// // // socket
// // require('./socket/chat.socket')(io);
// // require('./socket/videoCall.socket')(io);

// // // error handler
// // app.use(errorMiddleware);

// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const errorMiddleware = require('./middleware/error.middleware');
// const { initSocket } = require('./config/socket');

// // routes
// const authRoutes = require('./routes/auth.routes');
// const doctorRoutes = require('./routes/doctor.routes');
// const patientRoutes = require('./routes/patient.routes');
// const appointmentRoutes = require('./routes/appointment.routes');
// const prescriptionRoutes = require('./routes/prescription.routes');
// const messageRoutes = require('./routes/message.routes');
// const paymentRoutes = require('./routes/payment.routes');
// const adminRoutes = require('./routes/admin.routes');
// const uploadRoutes = require('./routes/upload.routes');
// const blogRoutes = require('./routes/blog.routes');
// const videoRoutes = require('./routes/video.routes');

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);

// // socket init — new Server() ar dorkar nei, initSocket() e sob ace
// const io = initSocket(server);

// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // io ke req e attach koro (controllers e req.io diye use kora jabe)
// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });

// // routes
// app.use('/api/auth', authRoutes);
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/patients', patientRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/prescriptions', prescriptionRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/payments', paymentRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/blogs', blogRoutes);
// app.use('/api/videos', videoRoutes);

// app.get('/', (req, res) => res.send('Telemedicine API running'));

// // socket handlers
// require('./socket/chat.socket')(io);
// require('./socket/videoCall.socket')(io);

// // global error handler
// app.use(errorMiddleware);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const path = require('path');

// // Production এ frontend serve করবে
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '../frontend/dist')));

//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
//     });
// }

