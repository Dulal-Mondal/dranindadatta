import { formatTime } from '../../utils/formatDate';

const MessageBubble = ({ message, isMe }) => {
    return (
        <div className={'flex ' + (isMe ? 'justify-end' : 'justify-start')}>
            <div className={'flex flex-col max-w-xs lg:max-w-md ' + (isMe ? 'items-end' : 'items-start')}>
                {message.fileUrl && message.fileType === 'image' && (
                    <img
                        src={message.fileUrl}
                        alt="attachment"
                        className="rounded-xl max-w-full mb-1 cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(message.fileUrl, '_blank')}
                    />
                )}
                {message.fileUrl && message.fileType === 'pdf' && (
                    <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 text-sm text-primary-500 hover:bg-gray-200 transition mb-1"
                    >
                        📄 View PDF
                    </a>
                )}
                {message.text && (
                    <div
                        className={
                            'px-4 py-2.5 rounded-2xl text-sm break-words ' +
                            (isMe
                                ? 'bg-primary-500 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-800 rounded-bl-sm')
                        }
                    >
                        {message.text}
                    </div>
                )}
                <span className="text-xs text-gray-400 mt-1 px-1">
                    {formatTime(message.createdAt)}
                    {isMe && (
                        <span className="ml-1">{message.isRead ? '✓✓' : '✓'}</span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;