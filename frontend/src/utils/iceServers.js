// frontend/src/utils/iceServers.js
// এই file টা PatientVideoCall আর DoctorVideoCall দুটোতেই import করো

const ICE_SERVERS = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
        urls: 'turn:global.turn.metered.live:80',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
    {
        urls: 'turn:global.turn.metered.live:80?transport=tcp',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
    {
        urls: 'turn:global.turn.metered.live:443',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
    {
        urls: 'turns:global.turn.metered.live:443',
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL,
    },
];

export default ICE_SERVERS;