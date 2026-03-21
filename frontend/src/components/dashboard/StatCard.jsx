const StatCard = ({ title, value, icon, color = 'blue', trend }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        red: 'bg-red-50 text-red-600',
    };

    return (
        <div className="card flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 mb-0.5">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {trend && (
                    <p className="text-xs text-green-500 mt-0.5">{trend}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;