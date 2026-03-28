// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// // public
// import Home from '../pages/public/Home';
// import Login from '../pages/public/Login';
// import Register from '../pages/public/Register';
// import DoctorList from '../pages/public/DoctorList';
// import DoctorDetail from '../pages/public/DoctorDetail';
// import Blogs from '../pages/public/Blogs';
// import BlogDetail from '../pages/public/BlogDetail';
// import Videos from '../pages/public/Videos';

// // patient
// import PatientDashboard from '../pages/patient/PatientDashboard';
// import BookAppointment from '../pages/patient/BookAppointment';
// import MyAppointments from '../pages/patient/MyAppointments';
// import MyPrescriptions from '../pages/patient/MyPrescriptions';
// import PatientChat from '../pages/patient/PatientChat';
// import PatientMessages from '../pages/patient/PatientMessages';
// import PatientVideoCall from '../pages/patient/PatientVideoCall';
// import PaymentSuccess from '../pages/patient/PaymentSuccess';
// import PaymentFail from '../pages/patient/PaymentFail';

// // doctor
// import DoctorDashboard from '../pages/doctor/DoctorDashboard';
// import ManageAppointments from '../pages/doctor/ManageAppointments';
// import WritePrescription from '../pages/doctor/WritePrescription';
// import DoctorChat from '../pages/doctor/DoctorChat';
// import DoctorMessages from '../pages/doctor/DoctorMessages';
// import DoctorVideoCall from '../pages/doctor/DoctorVideoCall';
// import DoctorProfile from '../pages/doctor/DoctorProfile';
// import UploadMedia from '../pages/doctor/UploadMedia';

// // admin
// import AdminDashboard from '../pages/admin/AdminDashboard';
// import ManageDoctors from '../pages/admin/ManageDoctors';
// import ManagePatients from '../pages/admin/ManagePatients';
// import ManageSlider from '../pages/admin/ManageSlider';
// import ManageBlogs from '../pages/admin/ManageBlogs';
// import ManageVideos from '../pages/admin/ManageVideos';
// import AdminSettings from '../pages/admin/AdminSettings'; // ✅ নতুন
// import NoticeManager from '../pages/admin/NoticeManager';

// const Loader = () => (
//     <div className="flex items-center justify-center h-screen">
//         <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
//     </div>
// );

// const RoleRoute = ({ children, roles }) => {
//     const { user, loading } = useAuth();
//     if (loading) return <Loader />;
//     if (!user) return <Navigate to="/login" />;
//     if (!roles.includes(user.role)) return <Navigate to="/" />;
//     return children;
// };

// const AppRoutes = () => (
//     <Routes>
//         {/* public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/doctors" element={<DoctorList />} />
//         <Route path="/doctors/:id" element={<DoctorDetail />} />
//         <Route path="/blogs" element={<Blogs />} />
//         <Route path="/blogs/:slug" element={<BlogDetail />} />
//         <Route path="/videos" element={<Videos />} />

//         {/* patient */}
//         <Route path="/patient/dashboard" element={<RoleRoute roles={['patient']}><PatientDashboard /></RoleRoute>} />
//         <Route path="/patient/book/:doctorId" element={<RoleRoute roles={['patient']}><BookAppointment /></RoleRoute>} />
//         <Route path="/patient/appointments" element={<RoleRoute roles={['patient']}><MyAppointments /></RoleRoute>} />
//         <Route path="/patient/prescriptions" element={<RoleRoute roles={['patient']}><MyPrescriptions /></RoleRoute>} />
//         <Route path="/patient/messages" element={<RoleRoute roles={['patient']}><PatientMessages /></RoleRoute>} />
//         <Route path="/patient/chat/:doctorId" element={<RoleRoute roles={['patient']}><PatientChat /></RoleRoute>} />
//         <Route path="/patient/video-call/:roomId" element={<RoleRoute roles={['patient']}><PatientVideoCall /></RoleRoute>} />
//         <Route path="/payment/success" element={<RoleRoute roles={['patient']}><PaymentSuccess /></RoleRoute>} />
//         <Route path="/payment/fail" element={<RoleRoute roles={['patient']}><PaymentFail /></RoleRoute>} />

//         {/* doctor */}
//         <Route path="/doctor/dashboard" element={<RoleRoute roles={['doctor']}><DoctorDashboard /></RoleRoute>} />
//         <Route path="/doctor/appointments" element={<RoleRoute roles={['doctor']}><ManageAppointments /></RoleRoute>} />
//         <Route path="/doctor/prescribe/:appointmentId" element={<RoleRoute roles={['doctor']}><WritePrescription /></RoleRoute>} />
//         <Route path="/doctor/messages" element={<RoleRoute roles={['doctor']}><DoctorMessages /></RoleRoute>} />
//         <Route path="/doctor/chat/:patientId" element={<RoleRoute roles={['doctor']}><DoctorChat /></RoleRoute>} />
//         <Route path="/doctor/video-call/:roomId" element={<RoleRoute roles={['doctor']}><DoctorVideoCall /></RoleRoute>} />
//         <Route path="/doctor/profile" element={<RoleRoute roles={['doctor']}><DoctorProfile /></RoleRoute>} />
//         <Route path="/doctor/upload" element={<RoleRoute roles={['doctor']}><UploadMedia /></RoleRoute>} />

//         {/* admin */}
//         <Route path="/admin/dashboard" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
//         <Route path="/admin/doctors" element={<RoleRoute roles={['admin']}><ManageDoctors /></RoleRoute>} />
//         <Route path="/admin/patients" element={<RoleRoute roles={['admin']}><ManagePatients /></RoleRoute>} />

//         <Route path="/admin/slider" element={<RoleRoute roles={['admin']}><ManageSlider /></RoleRoute>} />
//         <Route path="/admin/blogs" element={<RoleRoute roles={['admin']}><ManageBlogs /></RoleRoute>} />
//         <Route path="/admin/videos" element={<RoleRoute roles={['admin']}><ManageVideos /></RoleRoute>} />
//         <Route path="/admin/settings" element={<RoleRoute roles={['admin']}><AdminSettings /></RoleRoute>} /> {/* ✅ নতুন */}

//         <Route path="*" element={<Navigate to="/" />} />
//         <Route path="/admin/notices" element={<NoticeManager />} />
//     </Routes>
// );

// export default AppRoutes;


import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// public
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import DoctorList from '../pages/public/DoctorList';
import DoctorDetail from '../pages/public/DoctorDetail';
import Blogs from '../pages/public/Blogs';
import BlogDetail from '../pages/public/BlogDetail';
import Videos from '../pages/public/Videos';

// patient
import PatientDashboard from '../pages/patient/PatientDashboard';
import BookAppointment from '../pages/patient/BookAppointment';
import MyAppointments from '../pages/patient/MyAppointments';
import MyPrescriptions from '../pages/patient/MyPrescriptions';
import PatientChat from '../pages/patient/PatientChat';
import PatientMessages from '../pages/patient/PatientMessages';
import PatientVideoCall from '../pages/patient/PatientVideoCall';
import PaymentSuccess from '../pages/patient/PaymentSuccess';
import PaymentFail from '../pages/patient/PaymentFail';

// doctor
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import ManageAppointments from '../pages/doctor/ManageAppointments';
import WritePrescription from '../pages/doctor/WritePrescription';
import DoctorChat from '../pages/doctor/DoctorChat';
import DoctorMessages from '../pages/doctor/DoctorMessages';
import DoctorVideoCall from '../pages/doctor/DoctorVideoCall';
import DoctorProfile from '../pages/doctor/DoctorProfile';
import UploadMedia from '../pages/doctor/UploadMedia';

// admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageDoctors from '../pages/admin/ManageDoctors';
import ManagePatients from '../pages/admin/ManagePatients';
import ManageSlider from '../pages/admin/ManageSlider';
import ManageBlogs from '../pages/admin/ManageBlogs';
import ManageVideos from '../pages/admin/ManageVideos';
import AdminSettings from '../pages/admin/AdminSettings';
import NoticeManager from '../pages/admin/NoticeManager'; // ✅ import আছে

const Loader = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
);

const RoleRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    if (loading) return <Loader />;
    if (!user) return <Navigate to="/login" />;
    if (!roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

const AppRoutes = () => (
    <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/videos" element={<Videos />} />

        {/* patient */}
        <Route path="/patient/dashboard" element={<RoleRoute roles={['patient']}><PatientDashboard /></RoleRoute>} />
        <Route path="/patient/book/:doctorId" element={<RoleRoute roles={['patient']}><BookAppointment /></RoleRoute>} />
        <Route path="/patient/appointments" element={<RoleRoute roles={['patient']}><MyAppointments /></RoleRoute>} />
        <Route path="/patient/prescriptions" element={<RoleRoute roles={['patient']}><MyPrescriptions /></RoleRoute>} />
        <Route path="/patient/messages" element={<RoleRoute roles={['patient']}><PatientMessages /></RoleRoute>} />
        <Route path="/patient/chat/:doctorId" element={<RoleRoute roles={['patient']}><PatientChat /></RoleRoute>} />
        <Route path="/patient/video-call/:roomId" element={<RoleRoute roles={['patient']}><PatientVideoCall /></RoleRoute>} />
        <Route path="/payment/success" element={<RoleRoute roles={['patient']}><PaymentSuccess /></RoleRoute>} />
        <Route path="/payment/fail" element={<RoleRoute roles={['patient']}><PaymentFail /></RoleRoute>} />

        {/* doctor */}
        <Route path="/doctor/dashboard" element={<RoleRoute roles={['doctor']}><DoctorDashboard /></RoleRoute>} />
        <Route path="/doctor/appointments" element={<RoleRoute roles={['doctor']}><ManageAppointments /></RoleRoute>} />
        <Route path="/doctor/prescribe/:appointmentId" element={<RoleRoute roles={['doctor']}><WritePrescription /></RoleRoute>} />
        <Route path="/doctor/messages" element={<RoleRoute roles={['doctor']}><DoctorMessages /></RoleRoute>} />
        <Route path="/doctor/chat/:patientId" element={<RoleRoute roles={['doctor']}><DoctorChat /></RoleRoute>} />
        <Route path="/doctor/video-call/:roomId" element={<RoleRoute roles={['doctor']}><DoctorVideoCall /></RoleRoute>} />
        <Route path="/doctor/profile" element={<RoleRoute roles={['doctor']}><DoctorProfile /></RoleRoute>} />
        <Route path="/doctor/upload" element={<RoleRoute roles={['doctor']}><UploadMedia /></RoleRoute>} />

        {/* admin */}
        <Route path="/admin/dashboard" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
        <Route path="/admin/doctors" element={<RoleRoute roles={['admin']}><ManageDoctors /></RoleRoute>} />
        <Route path="/admin/patients" element={<RoleRoute roles={['admin']}><ManagePatients /></RoleRoute>} />
        <Route path="/admin/slider" element={<RoleRoute roles={['admin']}><ManageSlider /></RoleRoute>} />
        <Route path="/admin/blogs" element={<RoleRoute roles={['admin']}><ManageBlogs /></RoleRoute>} />
        <Route path="/admin/videos" element={<RoleRoute roles={['admin']}><ManageVideos /></RoleRoute>} />
        <Route path="/admin/settings" element={<RoleRoute roles={['admin']}><AdminSettings /></RoleRoute>} />
        {/* ✅ FIXED: RoleRoute দিয়ে wrap করা হয়েছে */}
        <Route path="/admin/notices" element={<RoleRoute roles={['admin']}><NoticeManager /></RoleRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);

export default AppRoutes;