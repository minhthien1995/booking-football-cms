import React from 'react';
import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';

const DashboardPage = ({ stats }) => {
  return (
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
  );
};

export default DashboardPage;
