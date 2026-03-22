import { useEffect } from 'react';

const pageTitles = {
    home: 'Dr. Aninda Datta | Online Telemedicine Bangladesh',
    login: 'Login | Dr. Aninda Datta Telemedicine',
    register: 'Register | Dr. Aninda Datta Telemedicine',
    doctors: 'Find Doctors | Dr. Aninda Datta Telemedicine',
    blogs: 'Health Blogs | Dr. Aninda Datta Telemedicine',
    videos: 'Health Videos | Dr. Aninda Datta Telemedicine',
    patientDashboard: 'Patient Dashboard | Dr. Aninda Datta',
    doctorDashboard: 'Doctor Dashboard | Dr. Aninda Datta',
    adminDashboard: 'Admin Dashboard | Dr. Aninda Datta',
    appointments: 'My Appointments | Dr. Aninda Datta',
    prescriptions: 'My Prescriptions | Dr. Aninda Datta',
    messages: 'Messages | Dr. Aninda Datta',
    bookAppointment: 'Book Appointment | Dr. Aninda Datta',
};

const usePageTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = pageTitles[title] || title + ' | Dr. Aninda Datta';
        } else {
            document.title = pageTitles.home;
        }
    }, [title]);
};

export default usePageTitle;