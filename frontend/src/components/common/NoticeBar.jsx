import { useState, useEffect } from 'react';
import { getPublicNotices } from '../../services/noticeService';

const NoticeBar = () => {
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const { data } = await getPublicNotices();
            setNotices(data.notices || []);
        } catch (err) {
            // silently fail — notice না থাকলে bar দেখাবে না
        }
    };

    if (notices.length === 0) return null;

    // সব active notice এর text একসাথে জোড়া লাগাও (separator দিয়ে)
    const marqueeText = notices.map((n) => n.text).join('   ✦   ');

    // প্রথম notice এর color ব্যবহার করো (অথবা default)
    const bgColor = notices[0]?.bgColor || '#eff6ff';
    const textColor = notices[0]?.color || '#0ea5e9';

    return (
        <div
            className="w-full overflow-hidden py-2 border-b"
            style={{ backgroundColor: bgColor, borderColor: textColor + '33' }}
        >
            <div
                className="flex whitespace-nowrap"
                style={{ animation: 'marquee 30s linear infinite' }}
            >
                {/* দুইবার repeat করা হচ্ছে seamless loop এর জন্য */}
                <span
                    className="text-sm font-medium px-8"
                    style={{ color: textColor }}
                >
                    {marqueeText}
                    &nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;
                    {marqueeText}
                </span>
            </div>

            <style>{`
                @keyframes marquee {
                    0%   { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default NoticeBar;