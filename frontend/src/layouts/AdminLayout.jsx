import SidebarAdmin from "../components/dashboard/SidebarAdmin";


const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <SidebarAdmin></SidebarAdmin>
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;