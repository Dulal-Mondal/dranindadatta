import { useSocket } from '../../context/SocketContext';

const IncomingCall = ({ callData, onAccept, onReject }) => {
    const { socket } = useSocket();

    const handleAccept = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            onAccept(stream, callData);
        } catch (err) {
            console.error('Camera error:', err);
        }
    };

    const handleReject = () => {
        socket?.emit('call_rejected', { to: callData.from });
        onReject();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center shadow-2xl w-80 mx-4">
                <div className="w-20 h-20 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center text-4xl animate-bounce">
                    📞
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Incoming Video Call</h3>
                <p className="text-gray-500 mb-6">{callData?.callerName || 'Unknown'}</p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={handleReject}
                        className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white text-2xl flex items-center justify-center transition shadow-md"
                    >
                        📵
                    </button>
                    <button
                        onClick={handleAccept}
                        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white text-2xl flex items-center justify-center transition shadow-md"
                    >
                        📞
                    </button>
                </div>

                <p className="text-xs text-gray-400 mt-4">Tap to accept or decline</p>
            </div>
        </div>
    );
};

export default IncomingCall;