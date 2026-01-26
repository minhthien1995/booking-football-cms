import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CreditCard, MapPin } from 'lucide-react';

const BookFieldModal = ({ field, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Customer Info, 3: Review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');

  const [bookingData, setBookingData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    duration: 0,
    totalPrice: 0,
    notes: '',
    // Customer fields (if creating new)
    customerEmail: '',
    customerName: '',
    customerPhone: ''
  });

  // Fetch customers on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/superadmin/customers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setCustomers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  // Calculate duration and price when time changes
  useEffect(() => {
    if (bookingData.startTime && bookingData.endTime) {
      const start = parseTime(bookingData.startTime);
      const end = parseTime(bookingData.endTime);
      
      if (end > start) {
        const duration = (end - start) / 60; // hours
        const totalPrice = duration * field.pricePerHour;
        
        setBookingData(prev => ({
          ...prev,
          duration,
          totalPrice
        }));
      }
    }
  }, [bookingData.startTime, bookingData.endTime, field.pricePerHour]);

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!bookingData.bookingDate || !bookingData.startTime || !bookingData.endTime) {
        setError('Vui lòng chọn đầy đủ ngày và giờ');
        return;
      }
      if (bookingData.duration <= 0) {
        setError('Giờ kết thúc phải sau giờ bắt đầu');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!selectedCustomer && !bookingData.customerEmail) {
        setError('Vui lòng chọn khách hàng hoặc nhập email');
        return;
      }
      if (!selectedCustomer && (!bookingData.customerName || !bookingData.customerPhone)) {
        setError('Vui lòng nhập đầy đủ thông tin khách hàng mới');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // If creating new customer, register them first
      let userId = selectedCustomer;

      if (!selectedCustomer && bookingData.customerEmail) {
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: bookingData.customerEmail,
            password: 'defaultPassword123', // Default password
            fullName: bookingData.customerName,
            phone: bookingData.customerPhone,
            role: 'customer'
          })
        });

        const registerData = await registerResponse.json();
        
        if (!registerResponse.ok) {
          throw new Error(registerData.message || 'Không thể tạo khách hàng mới');
        }

        userId = registerData.data.user.id;
      }

      // Create booking
      const bookingResponse = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          userId: userId,
          fieldId: field.id,
          bookingDate: bookingData.bookingDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          notes: bookingData.notes
        })
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(bookingResult.message || 'Không thể đặt sân');
      }

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Đặt Sân</h2>
            <p className="text-sm text-slate-600 mt-1">{field.name} - {field.fieldType}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-8">
            {[
              { num: 1, label: 'Chọn giờ' },
              { num: 2, label: 'Khách hàng' },
              { num: 3, label: 'Xác nhận' }
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step >= s.num 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    step >= s.num ? 'text-purple-600' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className={`flex-1 h-1 mx-4 rounded transition ${
                    step > s.num ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Date and Time */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-purple-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{field.name}</p>
                    <p className="text-sm text-slate-600">{field.location}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-200">
                  <span className="text-sm text-slate-600">Giá thuê:</span>
                  <span className="text-lg font-bold text-purple-600">
                    {formatCurrency(field.pricePerHour)}/giờ
                  </span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Ngày đặt sân <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={bookingData.bookingDate}
                  onChange={(e) => setBookingData({ ...bookingData, bookingDate: e.target.value })}
                  min={getTodayDate()}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Clock className="w-4 h-4" />
                    Giờ bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Clock className="w-4 h-4" />
                    Giờ kết thúc <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={bookingData.endTime}
                    onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              {bookingData.duration > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Thời gian thuê:</p>
                      <p className="text-xl font-bold text-blue-900">{bookingData.duration} giờ</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Tổng tiền:</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(bookingData.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Customer Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4" />
                  Chọn khách hàng có sẵn
                </label>
                <select
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Hoặc tạo khách hàng mới --</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.fullName} - {customer.email} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>

              {!selectedCustomer && (
                <>
                  <div className="border-t border-slate-200 pt-6">
                    <p className="text-sm font-semibold text-slate-700 mb-4">Hoặc tạo khách hàng mới:</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={bookingData.customerEmail}
                      onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="customer@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Họ tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bookingData.customerName}
                      onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={bookingData.customerPhone}
                      onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="0123456789"
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Lưu ý:</p>
                    <p>Mật khẩu mặc định cho khách hàng mới là: <code className="bg-yellow-100 px-2 py-1 rounded">defaultPassword123</code></p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Review and Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Thông tin đặt sân</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-purple-200">
                    <span className="text-slate-600">Sân:</span>
                    <span className="font-semibold text-slate-900">{field.name} ({field.fieldType})</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-purple-200">
                    <span className="text-slate-600">Địa điểm:</span>
                    <span className="font-medium text-slate-900">{field.location}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-purple-200">
                    <span className="text-slate-600">Ngày:</span>
                    <span className="font-medium text-slate-900">
                      {new Date(bookingData.bookingDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-purple-200">
                    <span className="text-slate-600">Giờ:</span>
                    <span className="font-medium text-slate-900">
                      {bookingData.startTime} - {bookingData.endTime} ({bookingData.duration}h)
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-purple-200">
                    <span className="text-slate-600">Khách hàng:</span>
                    <span className="font-medium text-slate-900">
                      {selectedCustomer 
                        ? customers.find(c => c.id == selectedCustomer)?.fullName
                        : bookingData.customerName
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-purple-300">
                    <span className="text-lg font-semibold text-slate-900">Tổng thanh toán:</span>
                    <span className="text-3xl font-bold text-purple-600">
                      {formatCurrency(bookingData.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="Thêm ghi chú cho booking..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-6 border-t border-slate-200 flex gap-3 sticky bottom-0 bg-white">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition disabled:opacity-50"
            >
              Quay lại
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 shadow-lg transition"
            >
              Tiếp theo
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg transition disabled:opacity-50"
            >
              {loading ? 'Đang đặt sân...' : 'Xác nhận đặt sân'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookFieldModal;