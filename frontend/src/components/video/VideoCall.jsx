import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import VideoControls from './VideoControls';

const VideoCall = ({ receiverId, receiverName, roomId, role = 'doctor', onCallEnd }) => {
    const { user } = useAuth();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);
    const callRef = useRef(null);

    const [callStatus, setCallStatus] = useState('calling');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        startCall();
        return () => cleanup();
    }, []);

    const startCall = async () => {
        try {
            const { Peer } = await import('peerjs');
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const peerId = role + '-' + roomId;
            const peer = new Peer(peerId);
            peerRef.current = peer;

            peer.on('open', () => {
                if (role === 'doctor') {
                    const call = peer.call('patient-' + roomId, stream);
                    callRef.current = call;
                    call.on('stream', (remoteStream) => {
                        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                        setCallStatus('connected');
                    });
                }
            });

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
        callRef.current?.close();
        peerRef.current?.destroy();
    };

    const endCall = () => { cleanup(); onCallEnd?.(); };
    const toggleMute = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled); }
    };
    const toggleVideo = () => {
        const track = localStreamRef.current?.getVideoTracks()[0];
        if (track) { track.enabled = !track.enabled; setIsVideoOff(!track.enabled); }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
            <div className="flex-1 relative">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                {callStatus === 'calling' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <div className="text-center text-white">
                            <div className="w-20 h-20 rounded-full bg-primary-500 mx-auto mb-4 flex items-center justify-center text-3xl animate-pulse">📞</div>
                            <p className="text-xl font-semibold">Calling {receiverName}...</p>
                        </div>
                    </div>
                )}
                <div className="absolute bottom-4 right-4 w-32 h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                </div>
            </div>
            <VideoControls
                isMuted={isMuted}
                isVideoOff={isVideoOff}
                onToggleMute={toggleMute}
                onToggleVideo={toggleVideo}
                onEndCall={endCall}
            />
        </div>
    );
};

export default VideoCall;