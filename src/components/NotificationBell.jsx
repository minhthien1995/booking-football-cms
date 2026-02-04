import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Calendar, Clock } from 'lucide-react';
import socketService from '../services/socket';

const NotificationBell = ({ onNewBooking }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Connect socket when component mounts
    socketService.connect();

    // Listen for new bookings
    const handleNewBooking = (data) => {
      console.log('🔔 New booking notification:', data);
      
      const notification = {
        id: Date.now(),
        ...data,
        read: false,
        timestamp: new Date().toISOString()
      };

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Play notification sound
      playNotificationSound();

      // Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🔔 Booking mới!', {
          body: `${data.customerName} đã đặt sân ${data.fieldName}`,
          icon: '/logo192.png',
          badge: '/logo192.png'
        });
      }

      // Callback to parent
      if (onNewBooking) {
        onNewBooking(data);
      }
    };

    socketService.on('new-booking', handleNewBooking);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socketService.off('new-booking', handleNewBooking);
    };
  }, [onNewBooking]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(err => console.log('Sound play failed:', err));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notif = notifications.find(n => n.id === id);
    if (notif && !notif.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-white hover:bg-white/10 rounded-xl transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 max-h-[600px] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                  Thông báo ({unreadCount})
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-white hover:underline"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có thông báo mới</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                      !notif.read ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {notif.customerName}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatTime(notif.timestamp)}
                            </p>
                          </div>
                        </div>

                        <div className="ml-12 space-y-1">
                          <p className="text-sm text-gray-700">
                            📞 {notif.customerPhone}
                          </p>
                          <p className="text-sm text-gray-700">
                            ⚽ <span className="font-semibold">{notif.fieldName}</span>
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>📅 {new Date(notif.bookingDate).toLocaleDateString('vi-VN')}</span>
                            <span>🕐 {notif.startTime} - {notif.endTime}</span>
                          </div>
                          <p className="text-sm font-bold text-green-600">
                            💰 {formatCurrency(notif.totalPrice)} VNĐ
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Đánh dấu đã đọc"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Xóa"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;