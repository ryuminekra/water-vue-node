// utils/api.js
const BASE_URL = 'http://localhost:8080/api';

// 登录
function login(qrData) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${BASE_URL}/mini-app/login`,
      method: 'POST',
      data: qrData,
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

// 添加送水记录
function addDelivery(data) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `${BASE_URL}/delivery`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data,
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

// 添加领用记录
function addConsumption(data) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `${BASE_URL}/consumption`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: data,
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

// 获取部门列表
function getDepartments() {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    wx.request({
      url: `${BASE_URL}/consumption/department`,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

module.exports = {
  login,
  addDelivery,
  addConsumption,
  getDepartments
};