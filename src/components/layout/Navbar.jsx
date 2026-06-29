import { IoNotificationsOutline, IoMenu } from 'react-icons/io5';
import { useAuthContext } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuthContext();

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-card text-text-secondary cursor-pointer"
        >
          <IoMenu size={22} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-text hidden sm:block">
            Welcome back, {user?.name || 'Admin'}
          </h2>
          <p className="text-xs text-text-secondary hidden sm:block">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-card text-text-secondary transition-colors cursor-pointer">
          <IoNotificationsOutline size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <Avatar name={user?.name || 'Admin'} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-text">{user?.name || 'Admin'}</p>
            <p className="text-xs text-text-secondary capitalize">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
