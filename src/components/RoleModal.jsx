import React, { useState } from 'react';

const RoleModal = ({ role, permissions, onSubmit, onCancel }) => {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">
            {role ? 'Chỉnh sửa Role' : 'Tạo Role Mới'}
          </h2>
        </div>
        
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

          <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t border-slate-200">
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
      </div>
    </div>
  );
};

export default RoleModal;
