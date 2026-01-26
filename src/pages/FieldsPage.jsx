import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Search, X, Calendar } from 'lucide-react';
import BookFieldModal from '../components/BookFieldModal';

const FieldsPage = ({ fields = [], onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldTypeFilter, setFieldTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [bookingField, setBookingField] = useState(null);

  // Safe check
  const safeFields = Array.isArray(fields) ? fields : [];

  // Filter fields
  const filteredFields = safeFields.filter(field => {
    const matchesSearch =
      field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = fieldTypeFilter === 'all' || field.fieldType === fieldTypeFilter;

    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleCreate = () => {
    setEditingField(null);
    setShowModal(true);
  };

  const handleEdit = (field) => {
    setEditingField(field);
    setShowModal(true);
  };

  const handleBook = (field) => {
    setBookingField(field);
    setShowBookModal(true);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Sân Bóng
          </h1>
          <p className="text-slate-600 mt-1">Quản lý sân bóng đá</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition"
        >
          <Plus className="w-5 h-5" />
          Tạo Sân Mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow border border-slate-200">
          <p className="text-sm text-slate-600">Tổng Sân</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{safeFields.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow border border-green-200">
          <p className="text-sm text-green-700">Sân 5vs5</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {safeFields.filter(f => f.fieldType === '5vs5').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow border border-blue-200">
          <p className="text-sm text-blue-700">Sân 7vs7</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {safeFields.filter(f => f.fieldType === '7vs7').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 shadow border border-purple-200">
          <p className="text-sm text-purple-700">Sân 11vs11</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {safeFields.filter(f => f.fieldType === '11vs11').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên sân hoặc địa điểm..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={fieldTypeFilter}
            onChange={(e) => setFieldTypeFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất cả loại sân</option>
            <option value="5vs5">Sân 5vs5</option>
            <option value="7vs7">Sân 7vs7</option>
            <option value="11vs11">Sân 11vs11</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Hiển thị {filteredFields.length} trong tổng số {safeFields.length} sân</span>
          {(searchTerm || fieldTypeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFieldTypeFilter('all');
              }}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFields.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-900">Không tìm thấy sân bóng</p>
            <p className="text-sm text-slate-500 mt-2">Thử điều chỉnh bộ lọc hoặc tạo sân mới</p>
          </div>
        ) : (
          filteredFields.map(field => (
            <FieldCard
              key={field.id}
              field={field}
              onEdit={handleEdit}
              onBook={handleBook}
              formatCurrency={formatCurrency}
            />
          ))
        )}
      </div>

      {/* Field Modal */}
      {showModal && (
        <FieldModal
          field={editingField}
          onClose={() => {
            setShowModal(false);
            setEditingField(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingField(null);
            onRefresh();
          }}
        />

      )}
      {/* Book Field Modal */}
      {showBookModal && bookingField && (
        <BookFieldModal
          field={bookingField}
          onClose={() => {
            setShowBookModal(false);
            setBookingField(null);
          }}
          onSuccess={() => {
            setShowBookModal(false);
            setBookingField(null);
            onRefresh();
            alert('Đặt sân thành công!');
          }}
        />
      )}
    </div>
  );
};

// Field Card Component
const FieldCard = ({ field, onEdit, onBook, formatCurrency }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await fetch(`http://localhost:5000/api/fields/${field.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) throw new Error('Xóa sân thất bại');

      window.location.reload(); // Refresh page
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      '5vs5': 'bg-green-100 text-green-700',
      '7vs7': 'bg-blue-100 text-blue-700',
      '11vs11': 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition">
            {field.name}
          </h3>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getTypeColor(field.fieldType)}`}>
            {field.fieldType}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(field)}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-slate-600">
          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
          <p className="text-sm">{field.location}</p>
        </div>

        {field.description && (
          <p className="text-sm text-slate-600 line-clamp-2">{field.description}</p>
        )}

        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Giá thuê/giờ:</span>
            <span className="text-lg font-bold text-purple-600">
              {formatCurrency(field.pricePerHour)}
            </span>
          </div>
          <button
            onClick={() => onBook(field)}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg transition"
          >
            <Calendar className="w-5 h-5" />
            Đặt sân ngay
          </button>
          {/* Tiếp tục với div ID/status */}
          <div className="flex items-center justify-between text-xs text-slate-500 mt-3"></div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>ID: #{field.id}</span>
          <span className={field.isActive ? 'text-green-600' : 'text-red-600'}>
            {field.isActive ? '● Hoạt động' : '○ Không hoạt động'}
          </span>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Xác nhận xóa</h3>
            <p className="text-slate-600 mb-6">
              Bạn có chắc muốn xóa sân <span className="font-semibold">{field.name}</span>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? 'Đang xóa...' : 'Xóa sân'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Field Modal Component
const FieldModal = ({ field, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: field?.name || '',
    fieldType: field?.fieldType || '5vs5',
    location: field?.location || '',
    pricePerHour: field?.pricePerHour || '',
    description: field?.description || '',
    isActive: field?.isActive !== undefined ? field.isActive : true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = field
        ? `http://localhost:5000/api/fields/${field.id}`
        : 'http://localhost:5000/api/fields';

      const response = await fetch(url, {
        method: field ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          ...formData,
          pricePerHour: Number(formData.pricePerHour)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi lưu sân');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">
            {field ? 'Chỉnh sửa Sân' : 'Tạo Sân Mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tên sân <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Sân số 1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loại sân <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.fieldType}
                onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="5vs5">Sân 5vs5</option>
                <option value="7vs7">Sân 7vs7</option>
                <option value="11vs11">Sân 11vs11</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Địa điểm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Quận 1, TP.HCM"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Giá thuê/giờ (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.pricePerHour}
              onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="300000"
              min="0"
              step="10000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              placeholder="Mô tả về sân..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
              Sân đang hoạt động
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : (field ? 'Cập nhật' : 'Tạo sân')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldsPage;