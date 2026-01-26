import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border animate-slideIn ${
      notification.type === 'success' 
        ? 'bg-emerald-500/90 text-white border-emerald-400' 
        : 'bg-red-500/90 text-white border-red-400'
    }`}>
      <div className="flex items-center gap-2">
        {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;
