import React from 'react';

const AdminsPage = ({ admins, roles, onAssignRole }) => {
  return (
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
                    onChange={(e) => onAssignRole(admin.id, e.target.value)}
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
  );
};

export default AdminsPage;
