// import { useEffect, useRef, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';

// const PatientVideoCall = () => {
//     const { roomId } = useParams();
//     const { user } = useAuth();
//     const navigate = useNavigate();

//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);
//     const peerRef = useRef(null);
//     const localStreamRef = useRef(null);

//     const [callStatus, setCallStatus] = useState('waiting');
//     const [isMuted, setIsMuted] = useState(false);
//     const [isVideoOff, setIsVideoOff] = useState(false);

//     useEffect(() => {
//         startCall();
//         return () => cleanup();
//     }, []);

//     const startCall = async () => {
//         try {
//             const { Peer } = await import('peerjs');
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//             localStreamRef.current = stream;
//             if (localVideoRef.current) localVideoRef.current.srcObject = stream;

//             const peer = new Peer('patient-' + roomId);
//             peerRef.current = peer;

//             peer.on('open', () => setCallStatus('waiting'));

//             peer.on('call', (call) => {
//                 call.answer(stream);
//                 call.on('stream', (remoteStream) => {
//                     if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
//                     setCallStatus('connected');
//                 });
//             });

//             peer.on('error', (err) => console.error('Peer error:', err));
//         } catch (err) {
//             console.error('Media error:', err);
//         }
//     };

//     const cleanup = () => {
//         localStreamRef.current?.getTracks().forEach((t) => t.stop());
//         peerRef.current?.destroy();
//     };

//     const endCall = () => { cleanup(); navigate('/patient/appointments'); };
//     const toggleMute = () => {
//         const track = localStreamRef.current?.getAudioTracks()[0];
//         if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled); }
//     };
//     const toggleVideo = () => {
//         const track = localStreamRef.current?.getVideoTracks()[0];
//         if (track) { track.enabled = !track.enabled; setIsVideoOff(!track.enabled); }
//     };

//     return (
//         <div className="fixed inset-0 bg-gray-900 flex flex-col">
//             <div className="flex-1 relative">
//                 <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
//                 {callStatus === 'waiting' && (
//                     <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
//                         <div className="text-center text-white">
//                             <div className="w-20 h-20 rounded-full bg-primary-500 mx-auto mb-4 flex items-center justify-center text-3xl animate-pulse">📞</div>
//                             <p className="text-xl font-semibold">Waiting for doctor...</p>
//                             <p className="text-gray-400 text-sm mt-2">Room: {roomId}</p>
//                         </div>
//                     </div>
//                 )}
//                 <div className="absolute bottom-4 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg">
//                     <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//                 </div>
//             </div>
//             <div className="bg-gray-800 py-4 px-6 flex items-center justify-center gap-6">
//                 <button onClick={toggleMute} className={'w-12 h-12 rounded-full flex items-center justify-center text-white transition ' + (isMuted ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500')}>
//                     {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
//                 </button>
//                 <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition">
//                     <FiPhoneOff size={24} />
//                 </button>
//                 <button onClick={toggleVideo} className={'w-12 h-12 rounded-full flex items-center justify-center text-white transition ' + (isVideoOff ? 'bg-red-500' : 'bg-gray-600 hover:bg-gray-500')}>
//                     {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PatientVideoCall;



import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';

const PatientVideoCall = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const ringIntervalRef = useRef(null);

    const [callStatus, setCallStatus] = useState('waiting');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);

    // ring sound using Web Audio API
    const playRing = () => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const playBeep = () => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.frequency.value = 440;
                g.gain.value = 0.3;
                o.start();
                setTimeout(() => o.stop(), 400);
            };
            playBeep();
            ringIntervalRef.current = setInterval(playBeep, 1500);
        } catch (e) { console.log('Audio error:', e); }
    };

    const stopRing = () => {
        clearInterval(ringIntervalRef.current);
    };

    useEffect(() => {
        playRing();
        startCall();
        return () => {
            stopRing();
            cleanup();
        };
    }, []);

    useEffect(() => {
        let timer;
        if (callStatus === 'connected') {
            stopRing();
            timer = setInterval(() => setCallDuration((p) => p + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [callStatus]);

    const formatDuration = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return m + ':' + sec;
    };

    const startCall = async () => {
        try {
            const { Peer } = await import('peerjs');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const peer = new Peer('patient-' + roomId);
            peerRef.current = peer;

            peer.on('call', (call) => {
                call.answer(stream);
                call.on('stream', (remoteStream) => {
                    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                    setCallStatus('connected');
                });
            });

            peer.on('error', (err) => console.error('Peer error:', err));
        } catch (err) {
            console.error('Media error:', err);
        }
    };

    const cleanup = () => {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        peerRef.current?.destroy();
    };

    const endCall = () => {
        stopRing();
        cleanup();
        navigate('/patient/appointments');
    };

    const toggleMute = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled); }
    };

    const toggleVideo = () => {
        const track = localStreamRef.current?.getVideoTracks()[0];
        if (track) { track.enabled = !track.enabled; setIsVideoOff(!track.enabled); }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: '#0f172a', display: 'flex', flexDirection: 'column',
            zIndex: 99999, overflow: 'hidden',
        }}>

            {/* Remote video — takes remaining space above controls */}
            <div style={{ position: 'relative', flex: 1, overflow: 'hidden', background: '#1e293b' }}>
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Waiting */}
                {callStatus === 'waiting' && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', color: 'white',
                    }}>
                        <div style={{
                            width: 90, height: 90, borderRadius: '50%', background: '#0ea5e9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 36, marginBottom: 20,
                            boxShadow: '0 0 0 12px rgba(14,165,233,0.2)',
                            animation: 'pulse 1.5s infinite',
                        }}>
                            📞
                        </div>
                        <p style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Waiting for doctor...</p>
                        <p style={{ fontSize: 13, color: '#94a3b8' }}>Please keep this page open</p>
                    </div>
                )}

                {/* Duration */}
                {callStatus === 'connected' && (
                    <div style={{
                        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.6)', color: 'white',
                        padding: '5px 18px', borderRadius: 20, fontSize: 14,
                        display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                        {formatDuration(callDuration)}
                    </div>
                )}

                {/* Local PIP */}
                <div style={{
                    position: 'absolute', bottom: 16, right: 16,
                    width: 120, height: 90, borderRadius: 10,
                    overflow: 'hidden', border: '2px solid rgba(255,255,255,0.7)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                }}>
                    <video
                        ref={localVideoRef}
                        autoPlay playsInline muted
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {isVideoOff && (
                        <div style={{
                            position: 'absolute', inset: 0, background: '#1e293b',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 28,
                        }}>👤</div>
                    )}
                </div>
            </div>

            {/* Controls bar — fixed at bottom, always visible */}
            <div style={{
                position: 'relative', zIndex: 100,
                background: '#1e293b',
                borderTop: '1px solid #334155',
                padding: '16px 24px 10px',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>

                    {/* Mute button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <button onClick={toggleMute} style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: isMuted ? '#ef4444' : '#334155',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white',
                        }}>
                            {isMuted ? <FiMicOff size={22} /> : <FiMic size={22} />}
                        </button>
                        <span style={{ color: '#94a3b8', fontSize: 11 }}>{isMuted ? 'Unmute' : 'Mute'}</span>
                    </div>

                    {/* End call button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <button onClick={endCall} style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: '#dc2626',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', boxShadow: '0 4px 16px rgba(220,38,38,0.5)',
                        }}>
                            <FiPhoneOff size={26} />
                        </button>
                        <span style={{ color: '#94a3b8', fontSize: 11 }}>End Call</span>
                    </div>

                    {/* Video button */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <button onClick={toggleVideo} style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: isVideoOff ? '#ef4444' : '#334155',
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white',
                        }}>
                            {isVideoOff ? <FiVideoOff size={22} /> : <FiVideo size={22} />}
                        </button>
                        <span style={{ color: '#94a3b8', fontSize: 11 }}>{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 12px rgba(14,165,233,0.2); }
          50% { box-shadow: 0 0 0 20px rgba(14,165,233,0.05); }
        }
      `}</style>
        </div>
    );
};

export default PatientVideoCall;