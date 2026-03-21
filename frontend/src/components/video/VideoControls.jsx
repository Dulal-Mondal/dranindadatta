import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPhoneOff } from 'react-icons/fi';

const VideoControls = ({ isMuted, isVideoOff, onToggleMute, onToggleVideo, onEndCall }) => {
    return (
        <div className="bg-gray-800 py-4 px-6 flex items-center justify-center gap-6">
            <button
                onClick={onToggleMute}
                className={'w-12 h-12 rounded-full flex items-center justify-center text-white transition ' + (isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500')}
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
            </button>

            <button
                onClick={onEndCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition"
                title="End Call"
            >
                <FiPhoneOff size={24} />
            </button>

            <button
                onClick={onToggleVideo}
                className={'w-12 h-12 rounded-full flex items-center justify-center text-white transition ' + (isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500')}
                title={isVideoOff ? 'Turn on video' : 'Turn off video'}
            >
                {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
            </button>
        </div>
    );
};

export default VideoControls;