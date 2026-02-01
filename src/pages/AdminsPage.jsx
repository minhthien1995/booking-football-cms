import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, X, Eye, EyeOff } from 'lucide-react';

const AdminsPage = ({ admins, roles, onAssignRole }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin',
    customRoleId: null
  });

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'admin',
      customRoleId: null
    });
    setShowModal(true);
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      password: '',
      phone: admin.phone || '',
      role: admin.role,
      customRoleId: admin.customRoleId || null
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName || !formData.email) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!editingAdmin && !formData.password) {
      alert('Vui lòng nhập mật khẩu');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Email không hợp lệ');
      return;
    }

    try {
      const api = require('../services/api').default;

      if (editingAdmin) {
        // Update admin
        await api.updateAdmin(editingAdmin.id, formData);
        alert('✅ Cập nhật admin thành công!');
      } else {
        // Create new admin
        await api.createAdmin(formData);
        alert('✅ Tạo admin thành công!');
      }

      setShowModal(false);
      window.location.reload(); // Reload to fetch new data
    } catch (error) {
      alert(`❌ Lỗi: ${error.message}`);
    }
  };

  const handleDelete = async (adminId, adminName) => {
    if (!window.confirm(`Xác nhận xóa admin "${adminName}"?`)) return;

    try {
      const api = require('../services/api').default;
      await api.deleteAdmin(adminId);
      alert('✅ Xóa admin thành công!');
      window.location.reload();
    } catch (error) {
      alert(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Quản lý Admin</h1>
          <p className="text-gray-600 mt-2">Quản lý tài khoản quản trị viên</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition font-semibold"
        >
          <Plus className="w-5 h-5" />
          Tạo Admin Mới
        </button>
      </div>

      {/* Admin List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Họ tên</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Số điện thoại</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Custom Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Trạng thái</th>
                <th className="text-center py-4 px-6 font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, idx) => (
                <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium">{admin.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {admin.fullName?.charAt(0)}
                      </div>
                      <span className="font-medium">{admin.fullName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{admin.email}</td>
                  <td className="py-4 px-6 text-gray-600">{admin.phone || '-'}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${admin.role === 'superadmin'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {admin.customRoleId ? (
                      <select
                        value={admin.customRoleId || ''}
                        onChange={(e) => onAssignRole(admin.id, e.target.value || null)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Không có</option>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.displayName}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${admin.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(admin)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {admin.role !== 'superadmin' && (
                        <button
                          onClick={() => handleDelete(admin.id, admin.fullName)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingAdmin ? '✏️ Chỉnh sửa Admin' : '➕ Tạo Admin Mới'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="admin@example.com"
                  required
                  disabled={editingAdmin} // Can't change email when editing
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0901234567"
                  maxLength="10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu {!editingAdmin && '*'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={editingAdmin ? 'Để trống nếu không đổi' : 'Tối thiểu 6 ký tự'}
                    required={!editingAdmin}
                    minLength="6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                  </button>
                </div>
              </div>

              {/* Role - System Role
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                  <option value="customer">Customer</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Role hệ thống cơ bản (admin, superadmin, customer)
                </p>
              </div> */}

              {/* Custom Role - From User Roles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Role (Tùy chọn)
                </label>
                <select
                  value={formData.customRoleId || ''}
                  onChange={(e) => setFormData({ ...formData, customRoleId: e.target.value || null })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Không chọn --</option>
                  {roles && roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.displayName} ({role.name})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Role tùy chỉnh từ trang User Roles với các quyền cụ thể
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition font-semibold"
                >
                  {editingAdmin ? 'Cập nhật' : 'Tạo Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsPage;