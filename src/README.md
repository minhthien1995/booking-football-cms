# ⚽ Football Booking Admin Dashboard - Refactored

Admin dashboard được tách thành nhiều components để dễ quản lý và bảo trì.

## 📁 Cấu trúc thư mục

```
src/
├── App.js                      # Main app component
├── services/
│   └── api.js                  # API service (centralized API calls)
├── components/
│   ├── Notification.jsx        # Toast notification
│   ├── Sidebar.jsx             # Navigation sidebar
│   └── RoleModal.jsx           # Create/Edit role modal
├── pages/
│   ├── LoginPage.jsx           # Login page
│   ├── DashboardPage.jsx       # Dashboard with stats
│   ├── RolesPage.jsx           # User roles management
│   └── AdminsPage.jsx          # Admin users management
└── utils/                      # (Future: helper functions)
```

## 🎯 Ưu điểm của cấu trúc mới

### ✅ Tách biệt rõ ràng:
- **Services**: Logic API riêng biệt
- **Components**: UI components tái sử dụng
- **Pages**: Các trang chính
- **Utils**: Helper functions (future)

### ✅ Dễ maintain:
- Mỗi file có trách nhiệm rõ ràng
- Dễ tìm và sửa bugs
- Dễ thêm features mới

### ✅ Reusable:
- Components có thể dùng lại
- API service dùng chung
- Consistent code style

### ✅ Scalable:
- Dễ thêm pages mới
- Dễ thêm components mới
- Dễ refactor

## 🚀 Setup

### 1. Copy files vào project

```bash
cd football-admin/src

# Copy từng folder
cp -r /path/to/services ./
cp -r /path/to/components ./
cp -r /path/to/pages ./
cp /path/to/App.js ./
```

### 2. Cấu trúc đầy đủ

```
football-admin/
├── public/
├── src/
│   ├── services/
│   │   └── api.js
│   ├── components/
│   │   ├── Notification.jsx
│   │   ├── Sidebar.jsx
│   │   └── RoleModal.jsx
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── RolesPage.jsx
│   │   └── AdminsPage.jsx
│   ├── App.js              ← Replace this
│   ├── index.js
│   └── index.css
├── package.json
└── tailwind.config.js
```

### 3. Run

```bash
npm start
```

## 📦 Giải thích từng file

### 🔧 services/api.js
**Mục đích**: Centralized API service
**Chức năng**:
- Quản lý token
- Tất cả API calls
- Error handling tập trung

**Sử dụng**:
```javascript
import api from './services/api';

// Login
const data = await api.login(email, password);

// Get roles
const roles = await api.getRoles();

// Create role
await api.createRole(roleData);
```

---

### 🎨 components/Notification.jsx
**Mục đích**: Toast notification component
**Props**:
- `notification`: { message, type }
- `onClose`: callback

---

### 🎨 components/Sidebar.jsx
**Mục đích**: Navigation sidebar
**Props**:
- `sidebarOpen`: boolean
- `setSidebarOpen`: function
- `activeTab`: string
- `setActiveTab`: function
- `user`: user object
- `onLogout`: function

---

### 🎨 components/RoleModal.jsx
**Mục đích**: Create/Edit role modal
**Props**:
- `role`: role object (null for create)
- `permissions`: permissions object
- `onSubmit`: function
- `onCancel`: function

---

### 📄 pages/LoginPage.jsx
**Mục đích**: Login form
**Props**:
- `onLogin`: function(email, password)
- `loading`: boolean

---

### 📄 pages/DashboardPage.jsx
**Mục đích**: Dashboard with statistics
**Props**:
- `stats`: stats object

---

### 📄 pages/RolesPage.jsx
**Mục đích**: User roles management
**Props**:
- `roles`: roles array
- `onCreateRole`: function
- `onEditRole`: function(role)
- `onDeleteRole`: function(roleId)

---

### 📄 pages/AdminsPage.jsx
**Mục đích**: Admin users management
**Props**:
- `admins`: admins array
- `roles`: roles array
- `onAssignRole`: function(userId, roleId)

---

### 🎯 App.js
**Mục đích**: Main application logic
**Chức năng**:
- State management
- Route logic (tab-based)
- Data fetching
- Event handlers

## 🔄 Workflow

### Login Flow:
```
LoginPage → api.login() → setUser() → Show Dashboard
```

### Create Role Flow:
```
RolesPage → Open RoleModal → Submit → api.createRole() → fetchRoles() → Update UI
```

### Assign Role Flow:
```
AdminsPage → Select role → api.assignRole() → fetchAdmins() → Update UI
```

## 🎨 Thêm page mới

### 1. Tạo file page

```javascript
// pages/FieldsPage.jsx
import React from 'react';

const FieldsPage = ({ fields, onCreateField, onEditField, onDeleteField }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Sân bóng</h1>
      {/* Your content */}
    </div>
  );
};

export default FieldsPage;
```

### 2. Import vào App.js

```javascript
import FieldsPage from './pages/FieldsPage';
```

### 3. Add state và fetch function

```javascript
const [fields, setFields] = useState([]);

const fetchFields = async () => {
  try {
    const data = await api.getFields();
    setFields(data.data);
  } catch (error) {
    showNotification(error.message, 'error');
  }
};
```

### 4. Add vào render

```javascript
{activeTab === 'fields' && (
  <FieldsPage
    fields={fields}
    onCreateField={handleCreateField}
    onEditField={handleEditField}
    onDeleteField={handleDeleteField}
  />
)}
```

## 🎯 Next Steps

### Features cần thêm:
- [ ] FieldsPage - Quản lý sân bóng
- [ ] BookingsPage - Quản lý bookings
- [ ] CustomersPage - Quản lý khách hàng
- [ ] Charts - Thống kê với charts
- [ ] Search & Filters
- [ ] Pagination
- [ ] Export data

### Improvements:
- [ ] React Router (URL-based routing)
- [ ] Context API (Global state)
- [ ] Error boundaries
- [ ] Loading skeletons
- [ ] Form validation
- [ ] Unit tests

## 📚 Libraries đã dùng

- **React**: UI framework
- **Tailwind CSS**: Styling
- **Lucide React**: Icons
- **Fetch API**: HTTP requests

## 🐛 Common Issues

### API không connect được:
- Check backend đang chạy: `docker compose ps`
- Check API_BASE trong `services/api.js`
- Check CORS settings

### Styling không hiển thị:
- Check Tailwind đã setup chưa
- Check `index.css` có `@tailwind` directives
- Restart dev server

### Token expired:
- Clear localStorage: `localStorage.clear()`
- Login lại

## 💡 Tips

1. **Tái sử dụng components**: Tạo components nhỏ, reusable
2. **Centralize logic**: Đặt API calls vào service
3. **Error handling**: Always use try-catch
4. **Loading states**: Show loading khi fetch data
5. **Notifications**: Show feedback cho mọi actions

## 📞 Support

Nếu có vấn đề, check:
1. Console errors (F12)
2. Network tab (API calls)
3. Backend logs

---

Made with 💜 for better code organization!
