import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const RolesPage = ({ roles, onCreateRole, onEditRole, onDeleteRole }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            User Roles
          </h1>
          <p className="text-slate-600 mt-1">Quản lý roles và permissions</p>
        </div>
        <button
          onClick={onCreateRole}
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
                  onClick={() => onEditRole(role)}
                  className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRole(role.id)}
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
  );
};

export default RolesPage;
