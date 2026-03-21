import { createSlice } from '@reduxjs/toolkit';

const appointmentSlice = createSlice({
    name: 'appointment',
    initialState: { appointments: [], loading: false },
    reducers: {
        setAppointments: (state, action) => {
            state.appointments = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        updateAppointmentStatus: (state, action) => {
            const { id, status } = action.payload;
            const apt = state.appointments.find((a) => a._id === id);
            if (apt) apt.status = status;
        },
    },
});

export const { setAppointments, setLoading, updateAppointmentStatus } = appointmentSlice.actions;
export default appointmentSlice.reducer;