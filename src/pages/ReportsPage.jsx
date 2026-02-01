import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  BarChart3,
  Download,
  RefreshCw,
  MapPin,
  Clock
} from 'lucide-react';
import api from '../services/api';

const ReportsPage = () => {
  const [period, setPeriod] = useState('this_month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [overviewData, setOverviewData] = useState(null);
  const [revenueByDate, setRevenueByDate] = useState([]);
  const [fieldPerformance, setFieldPerformance] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const start = period === 'custom' ? customStartDate : null;
      const end = period === 'custom' ? customEndDate : null;

      const [overview, revenue, fields, customers, slots] = await Promise.all([
        api.getOverviewReport(period, start, end),
        api.getRevenueByDate(period, start, end),
        api.getFieldPerformance(period, start, end),
        api.getCustomerReport(period, 10, start, end),
        api.getTimeSlotAnalysis(period, start, end)
      ]);

      if (overview.success) setOverviewData(overview.data);
      if (revenue.success) setRevenueByDate(revenue.data.revenueByDate);
      if (fields.success) setFieldPerformance(fields.data.fieldPerformance);
      if (customers.success) setTopCustomers(customers.data.topCustomers);
      if (slots.success) setTimeSlots(slots.data.timeSlots);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setCustomStartDate('');
      setCustomEndDate('');
      fetchAllReports();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const periodButtons = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'yesterday', label: 'Hôm qua' },
    { value: 'this_week', label: 'Tuần này' },
    { value: 'last_week', label: 'Tuần trước' },
    { value: 'this_month', label: 'Tháng này' },
    { value: 'last_month', label: 'Tháng trước' },
    { value: 'this_year', label: 'Năm nay' },
    { value: 'custom', label: 'Tùy chọn' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Báo cáo & Thống kê
          </h1>
          <p className="text-gray-600 mt-2">Phân tích dữ liệu kinh doanh</p>
        </div>
        <button
          onClick={() => alert('Xuất báo cáo')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Period Selector */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Chọn khoảng thời gian</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {periodButtons.map(p => (
            <button
              key={p.value}
              onClick={() => handlePeriodChange(p.value)}
              className={`px-4 py-3 rounded-2xl font-semibold transition-all ${
                period === p.value
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {period === 'custom' && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-purple-50 rounded-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Từ ngày</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Đến ngày</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAllReports}
                className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Áp dụng
              </button>
            </div>
          </div>
        )}

        {overviewData && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <p>
              Báo cáo từ <span className="font-semibold">{formatDate(overviewData.period.startDate)}</span>
              {' đến '}
              <span className="font-semibold">{formatDate(overviewData.period.endDate)}</span>
            </p>
            <button
              onClick={fetchAllReports}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      )}

      {!loading && overviewData && (
        <>
          {/* Overview Cards - Giống Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Bookings */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm text-gray-500">Tổng số</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {overviewData.overview.totalBookings}
              </h3>
              <p className="text-gray-600">Bookings</p>
            </div>

            {/* Revenue */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm text-gray-500">Doanh thu</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {formatCurrency(overviewData.overview.totalRevenue)}
              </h3>
              <p className="text-gray-600">VNĐ</p>
            </div>

            {/* Average */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm text-gray-500">Trung bình</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {formatCurrency(overviewData.overview.averageBookingValue)}
              </h3>
              <p className="text-gray-600">VNĐ/booking</p>
            </div>

            {/* New Customers */}
            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm text-gray-500">Khách hàng</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {overviewData.overview.newCustomers}
              </h3>
              <p className="text-gray-600">Mới</p>
            </div>
          </div>

          {/* Booking Status - Giống Dashboard */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Trạng thái Booking</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {overviewData.bookingsByStatus.map(item => {
                const colors = {
                  pending: { bg: 'bg-yellow-50', text: 'text-yellow-600', label: 'Pending' },
                  confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Confirmed' },
                  completed: { bg: 'bg-green-50', text: 'text-green-600', label: 'Completed' },
                  cancelled: { bg: 'bg-red-50', text: 'text-red-600', label: 'Cancelled' }
                };
                const color = colors[item.status];
                
                return (
                  <div key={item.status} className={`${color.bg} rounded-2xl p-4 text-center`}>
                    <h3 className={`text-3xl font-bold ${color.text} mb-2`}>{item.count}</h3>
                    <p className={`text-sm ${color.text} font-medium`}>{color.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Trạng thái Thanh toán</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {overviewData.bookingsByPayment.map(item => {
                const colors = {
                  unpaid: { bg: 'bg-red-50', text: 'text-red-600', label: 'Unpaid' },
                  paid: { bg: 'bg-green-50', text: 'text-green-600', label: 'Paid' },
                  refunded: { bg: 'bg-orange-50', text: 'text-orange-600', label: 'Refunded' }
                };
                const color = colors[item.paymentStatus];
                
                return (
                  <div key={item.paymentStatus} className={`${color.bg} rounded-2xl p-4 text-center`}>
                    <h3 className={`text-3xl font-bold ${color.text} mb-2`}>{item.count}</h3>
                    <p className={`text-sm ${color.text} font-medium`}>{color.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue Table */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Doanh thu theo ngày</h2>
            {revenueByDate.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 px-4 text-gray-600 font-semibold">Ngày</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-semibold">Bookings</th>
                      <th className="text-right py-3 px-4 text-gray-600 font-semibold">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueByDate.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{formatDate(item.date)}</td>
                        <td className="py-3 px-4 text-right">{item.bookingCount}</td>
                        <td className="py-3 px-4 text-right font-bold text-green-600">
                          {formatCurrency(item.revenue)} VNĐ
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Không có dữ liệu</p>
            )}
          </div>

          {/* Field Performance & Top Customers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Field Performance */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Hiệu suất sân</h2>
              {fieldPerformance.length > 0 ? (
                <div className="space-y-3">
                  {fieldPerformance.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.field.name}</p>
                          <p className="text-sm text-gray-600">{item.totalBookings} bookings</p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">{formatCurrency(item.totalRevenue)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Không có dữ liệu</p>
              )}
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Top khách hàng</h2>
              {topCustomers.length > 0 ? (
                <div className="space-y-3">
                  {topCustomers.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{item.customer.fullName}</p>
                          <p className="text-sm text-gray-600">{item.totalBookings} bookings</p>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">{formatCurrency(item.totalSpent)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Không có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Phân tích khung giờ</h2>
            {timeSlots.length > 0 ? (
              <div className="space-y-2">
                {timeSlots.filter(t => t.bookings > 0).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-20 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-700">{item.timeSlot}</span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-end pr-3 text-white font-semibold text-sm"
                        style={{ 
                          width: `${(item.bookings / Math.max(...timeSlots.map(t => t.bookings))) * 100}%`,
                          minWidth: '80px'
                        }}
                      >
                        {item.bookings} booking
                      </div>
                    </div>
                    <span className="text-green-600 font-bold w-24 text-right">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Không có dữ liệu</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsPage;