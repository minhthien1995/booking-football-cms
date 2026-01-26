import React, { useState, useEffect } from 'react';
import { Menu, X, Users, Shield, Calendar, MapPin, TrendingUp, ChevronRight, LogOut, Plus, Edit, Trash2, Check, AlertCircle } from 'lucide-react';

// API Base URL
const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Data states
  const [stats, setStats] = useState({});
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [fields, setFields] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Auth check
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  // Fetch data based on active tab
  useEffect(() => {
    if (!token) return;
    
    switch(activeTab) {
      case 'dashboard':
        fetchStats();
        break;
      case 'roles':
        fetchRoles();
        fetchPermissions();
        break;
      case 'admins':
        fetchAdmins();
        fetchRoles();
        break;
      case 'fields':
        fetchFields();
        break;
      case 'bookings':
        fetchBookings();
        break;
    }
  }, [activeTab, token]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');
      return data;
    } catch (error) {
      showNotification(error.message, 'error');
      throw error;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await apiCall('/auth/me');
      setUser(data.data);
    } catch (error) {
      setToken(null);
      localStorage.removeItem('adminToken');
    }
  };

  const fetchStats = async () => {
    const data = await apiCall('/superadmin/stats');
    setStats(data.data);
  };

  const fetchRoles = async () => {
    const data = await apiCall('/roles');
    setRoles(data.data);
  };

  const fetchPermissions = async () => {
    const data = await apiCall('/permissions');
    setPermissions(data.data);
  };

  const fetchAdmins = async () => {
    const data = await apiCall('/superadmin/admins');
    setAdmins(data.data);
  };

  const fetchFields = async () => {
    const data = await apiCall('/fields');
    setFields(data.data);
  };

  const fetchBookings = async () => {
    const data = await apiCall('/bookings');
    setBookings(data.data);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);
      
      if (data.data.user.role !== 'superadmin' && data.data.user.role !== 'admin') {
        throw new Error('Bạn không có quyền truy cập trang admin');
      }
      
      setToken(data.data.token);
      localStorage.setItem('adminToken', data.data.token);
      setUser(data.data.user);
      showNotification('Đăng nhập thành công!');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    showNotification('Đã đăng xuất');
  };

  const createRole = async (roleData) => {
    try {
      await apiCall('/roles', {
        method: 'POST',
        body: JSON.stringify(roleData),
      });
      showNotification('Tạo role thành công!');
      fetchRoles();
      setShowRoleModal(false);
    } catch (error) {
      // Error handled by apiCall
    }
  };

  const updateRole = async (roleId, roleData) => {
    try {
      await apiCall(`/roles/${roleId}`, {
        method: 'PUT',
        body: JSON.stringify(roleData),
      });
      showNotification('Cập nhật role thành công!');
      fetchRoles();
      setShowRoleModal(false);
      setEditingRole(null);
    } catch (error) {
      // Error handled by apiCall
    }
  };

  const deleteRole = async (roleId) => {
    if (!confirm('Bạn có chắc muốn xóa role này?')) return;
    try {
      await apiCall(`/roles/${roleId}`, { method: 'DELETE' });
      showNotification('Xóa role thành công!');
      fetchRoles();
    } catch (error) {
      // Error handled by apiCall
    }
  };

  const assignRoleToAdmin = async (userId, roleId) => {
    try {
      await apiCall('/roles/assign', {
        method: 'POST',
        body: JSON.stringify({ userId, roleId }),
      });
      showNotification('Gán role thành công!');
      fetchAdmins();
    } catch (error) {
      // Error handled by apiCall
    }
  };

  // Login Screen
  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-700/20 via-transparent to-transparent"></div>
        
        <div className="relative w-full max-w-md p-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
              <p className="text-purple-200">Football Booking System</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="admin@footballbooking.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition disabled:opacity-50 shadow-lg"
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-purple-300">
              <p>Test accounts:</p>
              <p className="mt-1">Superadmin: superadmin@footballbooking.com / superadmin123</p>
              <p>Admin: admin1@footballbooking.com / 123456</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Dashboard
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'roles', label: 'User Roles', icon: Shield },
    { id: 'admins', label: 'Admins', icon: Users },
    { id: 'fields', label: 'Sân bóng', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border animate-slideIn ${
          notification.type === 'success' 
            ? 'bg-emerald-500/90 text-white border-emerald-400' 
            : 'bg-red-500/90 text-white border-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ${
        sidebarOpen ? 'w-72' : 'w-20'
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === item.id
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
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'} p-8`}>
        <div className="max-w-7xl mx-auto">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-slate-600 mt-1">Tổng quan hệ thống</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-slate-500">Total</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{stats.users?.total || 0}</h3>
                  <p className="text-slate-600 text-sm mt-1">Người dùng</p>
                  <div className="mt-4 flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">SA: {stats.users?.superadmins || 0}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">A: {stats.users?.admins || 0}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">C: {stats.users?.customers || 0}</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-slate-500">Active</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{stats.totalFields || 0}</h3>
                  <p className="text-slate-600 text-sm mt-1">Sân bóng</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-slate-500">Total</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{stats.totalBookings || 0}</h3>
                  <p className="text-slate-600 text-sm mt-1">Bookings</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm text-slate-500">VND</span>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">{Number(stats.totalRevenue || 0).toLocaleString()}</h3>
                  <p className="text-slate-600 text-sm mt-1">Doanh thu</p>
                </div>
              </div>

              {stats.bookingsByStatus && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Booking Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-yellow-50 rounded-xl">
                      <p className="text-2xl font-bold text-yellow-700">{stats.bookingsByStatus.pending}</p>
                      <p className="text-sm text-yellow-600 mt-1">Pending</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <p className="text-2xl font-bold text-blue-700">{stats.bookingsByStatus.confirmed}</p>
                      <p className="text-sm text-blue-600 mt-1">Confirmed</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <p className="text-2xl font-bold text-green-700">{stats.bookingsByStatus.completed}</p>
                      <p className="text-sm text-green-600 mt-1">Completed</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <p className="text-2xl font-bold text-red-700">{stats.bookingsByStatus.cancelled}</p>
                      <p className="text-sm text-red-600 mt-1">Cancelled</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Roles View */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    User Roles
                  </h1>
                  <p className="text-slate-600 mt-1">Quản lý roles và permissions</p>
                </div>
                <button
                  onClick={() => {
                    setEditingRole(null);
                    setShowRoleModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition"
                >
                  <Plus className="w-5 h-5" />
                  Tạo Role Mới
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                  <div key={role.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{role.displayName}</h3>
                        <p className="text-sm text-slate-500 mt-1">{role.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingRole(role);
                            setShowRoleModal(true);
                          }}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRole(role.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {role.description && (
                      <p className="text-sm text-slate-600 mb-4">{role.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700 uppercase">Permissions ({role.permissions?.length || 0})</p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions?.slice(0, 6).map(perm => (
                          <span key={perm.id} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg">
                            {perm.displayName}
                          </span>
                        ))}
                        {role.permissions?.length > 6 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                            +{role.permissions.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        {role.users?.length || 0} admin(s) đang sử dụng role này
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admins View */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Admin Users
                  </h1>
                  <p className="text-slate-600 mt-1">Quản lý admin và phân quyền</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Admin</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {admins.map(admin => (
                      <tr key={admin.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {admin.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{admin.fullName}</p>
                              <p className="text-sm text-slate-500">{admin.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{admin.email}</td>
                        <td className="px-6 py-4">
                          <select
                            value={admin.customRoleId || ''}
                            onChange={(e) => assignRoleToAdmin(admin.id, e.target.value)}
                            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option value="">No role</option>
                            {roles.map(role => (
                              <option key={role.id} value={role.id}>{role.displayName}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            admin.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Fields & Bookings - Simple list views */}
          {activeTab === 'fields' && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sân bóng
              </h1>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-slate-600">Danh sách {fields.length} sân bóng</p>
                {/* Add fields list here */}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bookings
              </h1>
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-slate-600">Tổng {bookings.length} bookings</p>
                {/* Add bookings list here */}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingRole ? 'Chỉnh sửa Role' : 'Tạo Role Mới'}
              </h2>
            </div>
            
            <RoleForm
              role={editingRole}
              permissions={permissions}
              onSubmit={editingRole ? (data) => updateRole(editingRole.id, data) : createRole}
              onCancel={() => {
                setShowRoleModal(false);
                setEditingRole(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Role Form Component
const RoleForm = ({ role, permissions, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    displayName: role?.displayName || '',
    description: role?.description || '',
    permissionIds: role?.permissions?.map(p => p.id) || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePermission = (permId) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permId)
        ? prev.permissionIds.filter(id => id !== permId)
        : [...prev.permissionIds, permId]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Name (Code)</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="fieldManager"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Display Name</label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Quản lý sân"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="Mô tả role..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Permissions</label>
        <div className="border border-slate-300 rounded-xl p-4 max-h-64 overflow-y-auto space-y-3">
          {Object.entries(permissions).map(([category, perms]) => (
            <div key={category}>
              <h4 className="font-semibold text-slate-900 mb-2 uppercase text-xs">{category}</h4>
              <div className="space-y-2">
                {perms.map(perm => (
                  <label key={perm.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissionIds.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{perm.displayName}</p>
                      <p className="text-xs text-slate-500">{perm.name}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition"
        >
          {role ? 'Cập nhật' : 'Tạo Role'}
        </button>
      </div>
    </form>
  );
};

export default AdminDashboard;
