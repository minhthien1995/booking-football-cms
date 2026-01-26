import React, { useState, useEffect } from 'react';

// Services
import api from './services/api';

// Components
import Notification from './components/Notification';
import Sidebar from './components/Sidebar';
import RoleModal from './components/RoleModal';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import AdminsPage from './pages/AdminsPage';
import BookingsPage from './pages/Bookingspage';
import FieldsPage from './pages/FieldsPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [fields, setFields] = useState([]);



  // Data states
  const [stats, setStats] = useState({});
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [admins, setAdmins] = useState([]);

  // Modal states
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetchUserProfile();
    }
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (!user) return;
    
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
      case 'bookings':
        fetchBookings();
        break;
      case 'fields':
        fetchFields();
        break;
      default:
        break;
    }
  }, [activeTab, user]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUserProfile = async () => {
    try {
      const data = await api.getProfile();
      setUser(data.data);
    } catch (error) {
      handleLogout();
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data.data);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data.data);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  

  const fetchPermissions = async () => {
    try {
      const data = await api.getPermissions();
      setPermissions(data.data);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const fetchAdmins = async () => {
    try {
      const data = await api.getAdmins();
      setAdmins(data.data);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await api.getBookings();
      setBookings(data.data);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const fetchFields = async () => {
    try {
      const data = await api.getFields();
      setFields(data.data);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleLogin = async (email, password) => {
    try {
      setLoading(true);
      const data = await api.login(email, password);
      setUser(data.user);
      showNotification('Đăng nhập thành công!');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    api.setToken(null);
    setUser(null);
    showNotification('Đã đăng xuất');
  };

  const handleCreateRole = async (roleData) => {
    try {
      await api.createRole(roleData);
      showNotification('Tạo role thành công!');
      fetchRoles();
      setShowRoleModal(false);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleUpdateRole = async (roleData) => {
    try {
      await api.updateRole(editingRole.id, roleData);
      showNotification('Cập nhật role thành công!');
      fetchRoles();
      setShowRoleModal(false);
      setEditingRole(null);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
  try {
    await api.updateBookingStatus(bookingId, status);
    showNotification('Cập nhật trạng thái thành công!');
    fetchBookings();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

const handleUpdatePaymentStatus = async (bookingId, paymentStatus) => {
  try {
    await api.updatePaymentStatus(bookingId, paymentStatus);
    showNotification('Cập nhật thanh toán thành công!');
    fetchBookings();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

const handleCancelBooking = async (bookingId) => {
  if (!window.confirm('Bạn có chắc muốn hủy booking này?')) return;
  
  try {
    await api.cancelBooking(bookingId);
    showNotification('Hủy booking thành công!');
    fetchBookings();
  } catch (error) {
    showNotification(error.message, 'error');
  }
};

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Bạn có chắc muốn xóa role này?')) return;
    
    try {
      await api.deleteRole(roleId);
      showNotification('Xóa role thành công!');
      fetchRoles();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleAssignRole = async (userId, roleId) => {
    try {
      if (roleId) {
        await api.assignRole(userId, roleId);
        showNotification('Gán role thành công!');
      } else {
        await api.unassignRole(userId);
        showNotification('Gỡ role thành công!');
      }
      fetchAdmins();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  // If not logged in, show login page
  if (!user) {
    return <LoginPage onLogin={handleLogin} loading={loading} />;
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Notification notification={notification} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'ml-72' : 'ml-20'} p-8`}>
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardPage stats={stats} />}
          
          {activeTab === 'roles' && (
            <RolesPage
              roles={roles}
              onCreateRole={() => {
                setEditingRole(null);
                setShowRoleModal(true);
              }}
              onEditRole={(role) => {
                setEditingRole(role);
                setShowRoleModal(true);
              }}
              onDeleteRole={handleDeleteRole}
            />
          )}

          {activeTab === 'admins' && (
            <AdminsPage
              admins={admins}
              roles={roles}
              onAssignRole={handleAssignRole}
            />
          )}

          {activeTab === 'fields' && (
            <FieldsPage
              fields={fields}
              onRefresh={fetchFields}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsPage
              bookings={bookings}
              onUpdateStatus={handleUpdateBookingStatus}
              onUpdatePayment={handleUpdatePaymentStatus}
              onCancelBooking={handleCancelBooking}
              onRefresh={fetchBookings}
            />
          )}
        </div>
      </main>

      {showRoleModal && (
        <RoleModal
          role={editingRole}
          permissions={permissions}
          onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
          onCancel={() => {
            setShowRoleModal(false);
            setEditingRole(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
