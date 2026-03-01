// API工具类
class Api {
  constructor() {
    // 使用环境变量中的API基础URL
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  // 获取token
  getToken() {
    return localStorage.getItem('token');
  }

  // 构建请求头
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // GET请求
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(`网络请求失败: ${error.message}`);
    }
  }

  // POST请求
  async post(endpoint, data = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(`网络请求失败: ${error.message}`);
    }
  }

  // PUT请求
  async put(endpoint, data = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(`网络请求失败: ${error.message}`);
    }
  }

  // DELETE请求
  async delete(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      
      return this.handleResponse(response);
    } catch (error) {
      throw new Error(`网络请求失败: ${error.message}`);
    }
  }

  // 处理响应
  async handleResponse(response) {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        // 如果是401错误，清除登录状态并跳转到登录页
        if (data.code === 401) {
          this.logout();
          window.location.href = '/login';
        }
        throw new Error(data.message || '请求失败');
      }
      
      // 返回data.data，因为后端API返回的格式是 { code: 200, message: '成功', data: [...] }
      return data.data;
    } catch (error) {
      throw new Error(`响应处理失败: ${error.message}`);
    }
  }

  // 登录
  async login(username, password) {
    const url = `${this.baseUrl}/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  // 退出登录
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // 获取当前用户信息
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // 检查是否已登录
  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new Api();