import { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";
import { IoMenu, IoClose, IoPieChartSharp } from "react-icons/io5";
import { FaFilePrescription } from "react-icons/fa";
import { RiFileAddFill } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";

function MainLayout() {
  const { logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile view

  const toggleCollapse = () => setCollapsed(!collapsed);
  const toggleSidebarMobile = () => setSidebarOpen(!sidebarOpen);

  const sidebarWidth = collapsed ? 80 : 256; // in px
  const mainStyle = {
    marginLeft: sidebarWidth,
    padding: "1rem",
    transition: "margin-left 0.3s ease",
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive ? "bg-black text-white" : "text-green-100 hover:bg-[#0a0a0a]"
    } ${collapsed ? "justify-center" : ""}`;

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-[#1CAC78] text-white transition-all duration-300 fixed inset-y-0 left-0 z-30 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:flex flex-col shadow-xl overflow-y-auto`}
      >
        {/* Header & Toggle */}
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && <h1 className="text-2xl font-bold">South Vision</h1>}
          <button
            onClick={
              collapsed
                ? toggleCollapse
                : sidebarOpen
                ? toggleSidebarMobile
                : toggleCollapse
            }
            className="lg:hidden text-white"
          >
            <IoClose size={24} />
          </button>
          <button
            onClick={toggleCollapse}
            className="hidden lg:block text-white"
          >
            <IoMenu size={24} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-2 space-y-2 mt-4">
          <NavLink to="/" className={linkClass}>
            <IoPieChartSharp size={22} />
            {!collapsed && <span>Create Invoice</span>}
          </NavLink>
          <NavLink to="/patient-info" className={linkClass}>
            <FaFilePrescription size={22} />
            {!collapsed && <span>Patient Information</span>}
          </NavLink>
          <NavLink to="/invoices" className={linkClass}>
            <RiFileAddFill size={22} />
            {!collapsed && <span>Invoices</span>}
          </NavLink>
          <NavLink to="/add-tests" className={linkClass}>
            <RiFileAddFill size={22} />
            {!collapsed && <span>Add Tests</span>}
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            <RiFileAddFill size={22} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button
            onClick={logout}
            className="flex items-center w-full gap-3 px-4 py-2 bg-rose-600 hover:bg-rose-700 rounded-lg"
          >
            <CiLogout size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebarMobile}
        ></div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 min-h-screen flex flex-col items-center justify-start transition-all duration-300`}
        style={mainStyle}
      >
        {/* Mobile menu button */}
        <div className="lg:hidden w-full p-4">
          <button onClick={toggleSidebarMobile}>
            <IoMenu size={24} />
          </button>
        </div>

        <div className="w-full max-w-7xl mx-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
