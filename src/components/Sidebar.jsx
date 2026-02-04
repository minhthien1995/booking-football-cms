import React from 'react';
import { Menu, X, Users, Shield, Calendar, MapPin, TrendingUp, LogOut, BarChart3 } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  user,
  onLogout
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'roles', label: 'User Roles', icon: Shield },
    { id: 'admins', label: 'Admins', icon: Users },
    { id: 'fields', label: 'Sân bóng', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'
      } shadow-2xl z-40`}>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-xs text-slate-400">Football Booking</p>
              </div>
            </div>
          )}
          {/* ⭐ THÊM NOTIFICATION BELL */}
          {sidebarOpen && <NotificationBell />}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {navigationItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === item.id
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
              : 'hover:bg-white/10'
              }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold">
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <p className="font-medium text-sm truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
