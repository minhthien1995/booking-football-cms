import React, { useState } from 'react';
import { Calendar, Search, Filter, Edit, X, Check, Eye } from 'lucide-react';

const BookingsPage = ({ 
  bookings, 
  onUpdateStatus, 
  onUpdatePayment, 
  onCancelBooking,
  onRefresh 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.field?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Status badge colors
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentColor = (status) => {
    const colors = {
      unpaid: 'bg-red-100 text-red-700',
      paid: 'bg-green-100 text-green-700',
      refunded: 'bg-orange-100 text-orange-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Bookings
          </h1>
          <p className="text-slate-600 mt-1">Quản lý đặt sân</p>
        </div>
        <button
          onClick={onRefresh}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition"
        >
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow border border-slate-200">
          <p className="text-sm text-slate-600">Total Bookings</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{bookings.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 shadow border border-yellow-200">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow border border-blue-200">
          <p className="text-sm text-blue-700">Confirmed</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {bookings.filter(b => b.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow border border-red-200">
          <p className="text-sm text-red-700">Unpaid</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {bookings.filter(b => b.paymentStatus === 'unpaid').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-slate-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, field..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Payments</option>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
          <span>Showing {filteredBookings.length} of {bookings.length} bookings</span>
          {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPaymentFilter('all');
              }}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Field</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Payment</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium">No bookings found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-slate-600">#{booking.id}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">{booking.user?.fullName}</p>
                        <p className="text-sm text-slate-500">{booking.user?.email}</p>
                        <p className="text-xs text-slate-400">{booking.user?.phone}</p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{booking.field?.name}</p>
                        <p className="text-sm text-slate-500">{booking.field?.fieldType}</p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{formatDate(booking.bookingDate)}</p>
                        <p className="text-sm text-slate-500">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{formatCurrency(booking.totalPrice)}</p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => onUpdateStatus(booking.id, e.target.value)}
                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 ${getStatusColor(booking.status)} ${
                          (booking.status === 'cancelled' || booking.status === 'completed') ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    
                    <td className="px-6 py-4">
                      <select
                        value={booking.paymentStatus}
                        onChange={(e) => onUpdatePayment(booking.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 ${getPaymentColor(booking.paymentStatus)}`}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => onCancelBooking(booking.id)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                            title="Cancel booking"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-slate-900">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Booking ID</p>
                  <p className="font-mono font-bold text-slate-900">#{selectedBooking.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Created At</p>
                  <p className="font-medium text-slate-900">{formatDate(selectedBooking.createdAt)}</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-900">{selectedBooking.user?.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-medium text-slate-900">{selectedBooking.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Phone:</span>
                    <span className="font-medium text-slate-900">{selectedBooking.user?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Field Info */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Field Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Field:</span>
                    <span className="font-medium text-slate-900">{selectedBooking.field?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-900">{selectedBooking.field?.fieldType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Location:</span>
                    <span className="font-medium text-slate-900">{selectedBooking.field?.location}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Booking Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium text-slate-900">{formatDate(selectedBooking.bookingDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time:</span>
                    <span className="font-medium text-slate-900">
                      {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Duration:</span>
                    <span className="font-medium text-slate-900">{selectedBooking.duration} hours</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                    <span className="font-semibold text-slate-900">Total Price:</span>
                    <span className="text-2xl font-bold text-purple-600">{formatCurrency(selectedBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-2">Status</p>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-500 mb-2">Payment</p>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getPaymentColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">Notes</h3>
                  <p className="text-slate-700">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button
                onClick={() => setSelectedBooking(null)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition"
              >
                Close
              </button>
              {selectedBooking.status !== 'cancelled' && selectedBooking.status !== 'completed' && (
                <button
                  onClick={() => {
                    onCancelBooking(selectedBooking.id);
                    setSelectedBooking(null);
                  }}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;