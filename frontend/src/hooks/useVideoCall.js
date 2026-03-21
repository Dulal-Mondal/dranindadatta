import { useState, useRef, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import { useSocket } from './useSocket';

export const useVideoCall = ({ receiverId, onCallEnd }) => {
    const { socket } = useSocket();

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const localStreamRef = useRef(null);

    const [callStatus, setCallStatus] = useState('idle');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const startCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;

            const peer = new SimplePeer({ initiator: true, trickle: false, stream });

            peer.on('signal', (offer) => {
                socket.emit('webrtc_offer', { to: receiverId, offer });
            });

            peer.on('stream', (remoteStream) => {
                if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
                setCallStatus('connected');
            });

            peerRef.current = peer;
            setCallStatus('calling');

            socket.on('webrtc_answer', ({ answer }) => peer.signal(answer));
            socket.on('call_ended', () => endCall());
        } catch (err) {
            console.error(err);
        }
    };

    const endCall = () => {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        peerRef.current?.destroy();
        socket?.emit('call_ended', { to: receiverId });
        setCallStatus('ended');
        onCallEnd?.();
    };

    const toggleMute = () => {
        const track = localStreamRef.current?.getAudioTracks()[0];
        if (track) { track.enabled = !track.enabled; setIsMuted(!track.enabled); }
    };

    const toggleVideo = () => {
        const track = localStreamRef.current?.getVideoTracks()[0];
        if (track) { track.enabled = !track.enabled; setIsVideoOff(!track.enabled); }
    };

    useEffect(() => () => endCall(), []);

    return {
        localVideoRef,
        remoteVideoRef,
        callStatus,
        isMuted,
        isVideoOff,
        startCall,
        endCall,
        toggleMute,
        toggleVideo,
    };
};