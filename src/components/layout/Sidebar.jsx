import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoGridOutline,
  IoPeopleOutline,
  IoWalletOutline,
  IoCalendarOutline,
  IoBarChartOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import { ROUTES } from "../../constants/routes";
import { COMPANY } from "../../constants/company";
import { useAuthContext } from "../../context/AuthContext";
import CompanyLogo from "../ui/CompanyLogo";

const menuItems = [
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: IoGridOutline },
  { path: ROUTES.EMPLOYEES, label: "Employees", icon: IoPeopleOutline },
  { path: ROUTES.SALARY, label: "Salary Slips", icon: IoWalletOutline },
  { path: ROUTES.LEAVES, label: "Leaves", icon: IoCalendarOutline },
  { path: ROUTES.REPORTS, label: "Reports", icon: IoBarChartOutline },
  { path: ROUTES.SETTINGS, label: "Settings", icon: IoSettingsOutline },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-full bg-primary z-40 flex flex-col shadow-xl"
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <CompanyLogo
          variant="icon"
          boxed
          boxClassName="w-13 h-13 p-1 rounded-lg"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overflow-hidden"
            >
              <h1 className="text-white font-bold text-lg leading-tight">
                {COMPANY.name}
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all w-full cursor-pointer"
        >
          <IoLogOutOutline size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        <button
          onClick={onToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
        >
          {collapsed ? (
            <IoChevronForward size={18} />
          ) : (
            <IoChevronBack size={18} />
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
