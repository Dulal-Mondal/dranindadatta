const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// ─── OPTION 1: Custom WebRTC Room ID (Free - Default) ──
// Amader nijer WebRTC system e use hobe
const generateRoomId = () => {
    return `room_${uuidv4().replace(/-/g, '').substring(0, 12)}`;
};

// ─── OPTION 2: Zoom Meeting (Production) ───────────────
// .env e ZOOM_API_KEY, ZOOM_API_SECRET, ZOOM_USER_ID lagbe

const generateZoomMeeting = async () => {
    try {
        const jwt = require('jsonwebtoken');

        // Zoom JWT token generate
        const payload = {
            iss: process.env.ZOOM_API_KEY,
            exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        };

        const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);

        // Zoom meeting create
        const response = await axios.post(
            `https://api.zoom.us/v2/users/${process.env.ZOOM_USER_ID}/meetings`,
            {
                topic: 'Doctor Consultation',
                type: 2, // scheduled meeting
                duration: 30,
                settings: {
                    host_video: true,
                    participant_video: true,
                    waiting_room: false,
                    join_before_host: false,
                    mute_upon_entry: false,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return {
            meetingId: response.data.id,
            joinUrl: response.data.join_url,
            startUrl: response.data.start_url,
            password: response.data.password,
        };
    } catch (error) {
        console.error('Zoom meeting creation failed:', error.message);
        // fallback to custom room
        return { roomId: generateRoomId(), joinUrl: null };
    }
};

// ─── MAIN EXPORT ───────────────────────────────────────
// Default: custom WebRTC room use kore
// Zoom use korte chaile generateZoomMeeting() call koro
const generateVideoRoom = async (useZoom = false) => {
    if (useZoom && process.env.ZOOM_API_KEY) {
        return await generateZoomMeeting();
    }

    // Custom WebRTC room
    const roomId = generateRoomId();
    return {
        roomId,
        joinUrl: `${process.env.CLIENT_URL}/video-call/${roomId}`,
    };
};

module.exports = { generateVideoRoom, generateRoomId };