import { SPECIALIZATIONS } from '../../utils/constants';
import { FiSearch } from 'react-icons/fi';

const DoctorFilter = ({ search, setSearch, specialization, setSpecialization }) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                    type="text"
                    placeholder="Search by doctor name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                />
            </div>
            <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
        </div>
    );
};

export default DoctorFilter;