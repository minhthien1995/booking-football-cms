const API_BASE = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('adminToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.data.user.role !== 'superadmin' && data.data.user.role !== 'admin') {
      throw new Error('Bạn không có quyền truy cập trang admin');
    }
    
    this.setToken(data.data.token);
    return data.data;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // Stats
  async getStats() {
    return this.request('/superadmin/stats');
  }

  // Roles
  async getRoles() {
    return this.request('/roles');
  }

  async getRole(id) {
    return this.request(`/roles/${id}`);
  }

  async createRole(roleData) {
    return this.request('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  }

  async updateRole(id, roleData) {
    return this.request(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
  }

  async deleteRole(id) {
    return this.request(`/roles/${id}`, {
      method: 'DELETE',
    });
  }

  async assignRole(userId, roleId) {
    return this.request('/roles/assign', {
      method: 'POST',
      body: JSON.stringify({ userId, roleId }),
    });
  }

  async unassignRole(userId) {
    return this.request('/roles/unassign', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async cloneRole(id, newName, newDisplayName) {
    return this.request(`/roles/${id}/clone`, {
      method: 'POST',
      body: JSON.stringify({ newName, newDisplayName }),
    });
  }

  // Permissions
  async getPermissions() {
    return this.request('/permissions');
  }

  async getUserPermissions(userId) {
    return this.request(`/permissions/user/${userId}`);
  }

  // Admins
  async getAdmins() {
    return this.request('/superadmin/admins');
  }

  async createAdmin(adminData) {
    return this.request('/superadmin/admins', {
      method: 'POST',
      body: JSON.stringify(adminData),
    });
  }

  async updateAdmin(id, adminData) {
    return this.request(`/superadmin/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adminData),
    });
  }

  async deleteAdmin(id) {
    return this.request(`/superadmin/admins/${id}`, {
      method: 'DELETE',
    });
  }

  // Customers
  async getCustomers() {
    return this.request('/superadmin/customers');
  }

  // Fields
  async getFields() {
    return this.request('/fields');
  }

  async getField(id) {
    return this.request(`/fields/${id}`);
  }

  async createField(fieldData) {
    return this.request('/fields', {
      method: 'POST',
      body: JSON.stringify(fieldData),
    });
  }

  async updateField(id, fieldData) {
    return this.request(`/fields/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fieldData),
    });
  }

  async deleteField(id) {
    return this.request(`/fields/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async getBookings() {
    return this.request('/bookings');
  }

  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBookingStatus(id, status) {
    return this.request(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updatePaymentStatus(id, paymentStatus) {
    return this.request(`/bookings/${id}/payment`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentStatus }),
    });
  }

  async cancelBooking(id) {
    return this.request(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  }
}

export default new ApiService();
