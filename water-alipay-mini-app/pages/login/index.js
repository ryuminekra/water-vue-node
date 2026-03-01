// login/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    scanning: false
  },
  
  // 扫码按钮点击事件
  scanCode: function() {
    console.log('点击扫码登录按钮');
    if (this.data.scanning) {
      console.log('正在扫描中，请勿重复点击');
      return;
    }
    
    console.log('开始显示操作菜单');
    
    // 先测试简单的Toast，确认my对象可用
    my.showToast({
      type: 'none',
      content: '点击扫码登录',
      duration: 1000,
      success: function() {
        console.log('Toast显示成功');
        
        // 显示操作菜单，让用户选择扫码方式
        my.showActionSheet({
          items: ['摄像头扫码', '从相册选择二维码'],
          success: function(res) {
            console.log('选择扫码方式成功:', res);
            if (res.index === 0) {
              // 摄像头扫码
              this.cameraScan();
            } else if (res.index === 1) {
              // 从相册选择二维码
              this.albumScan();
            }
          }.bind(this),
          fail: function(error) {
            console.error('选择扫码方式失败:', error);
            my.showToast({
              type: 'none',
              content: '操作失败，请重试'
            });
          }
        });
      }.bind(this),
      fail: function(error) {
        console.error('Toast显示失败:', error);
      }
    });
  },
  
  // 摄像头扫码
  cameraScan: function() {
    console.log('开始摄像头扫码');
    this.setData({ scanning: true });
    
    my.scan({
      type: 'qr',
      success: function(res) {
        console.log('摄像头扫码成功:', res);
        this.processQrCode(res.code);
      }.bind(this),
      fail: function(error) {
        console.error('摄像头扫码失败:', error);
        my.showToast({
          type: 'none',
          content: '扫码失败'
        });
      },
      complete: function() {
        this.setData({ scanning: false });
      }.bind(this)
    });
  },
  
  // 从相册选择二维码
  albumScan: function() {
    console.log('开始从相册选择二维码');
    this.setData({ scanning: true });
    
    // 选择图片
    my.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function(res) {
        console.log('选择图片成功:', res);
        const tempFilePaths = res.apFilePaths;
        if (tempFilePaths && tempFilePaths.length > 0) {
          // 使用OCR识别图片中的二维码
          my.ocr({
            ocrType: 'qrCode',
            imgType: 'file',
            imgUrl: tempFilePaths[0],
            success: function(ocrRes) {
              console.log('OCR识别成功:', ocrRes);
              if (ocrRes.code === 1000 && ocrRes.qrCodeResults && ocrRes.qrCodeResults.length > 0) {
                const qrCodeContent = ocrRes.qrCodeResults[0].content;
                this.processQrCode(qrCodeContent);
              } else {
                my.showToast({
                  type: 'none',
                  content: '识别二维码失败'
                });
              }
            }.bind(this),
            fail: function(error) {
              console.error('OCR识别失败:', error);
              my.showToast({
                type: 'none',
                content: '识别二维码失败'
              });
            },
            complete: function() {
              this.setData({ scanning: false });
            }.bind(this)
          });
        }
      }.bind(this),
      fail: function(error) {
        console.error('选择图片失败:', error);
        my.showToast({
          type: 'none',
          content: '选择图片失败'
        });
        this.setData({ scanning: false });
      }.bind(this)
    });
  },
  
  // 处理二维码内容
  processQrCode: function(qrCodeContent) {
    console.log('开始处理二维码内容:', qrCodeContent);
    try {
      // 解析二维码内容
      const qrData = JSON.parse(qrCodeContent);
      console.log('解析二维码成功:', qrData);
      
      // 验证二维码数据
      if (!qrData.role || !qrData.warehouseId || !qrData.signature) {
        console.log('二维码格式错误');
        my.showToast({
          type: 'none',
          content: '二维码格式错误'
        });
        return;
      }
      
      console.log('开始调用登录API');
      // 调用登录API
      my.request({
        url: 'http://localhost:8080/api/mini-app/login',
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: qrData,
        success: function(response) {
          console.log('登录API调用成功:', response);
          if (response.data.code === 200) {
            // 存储登录状态
            my.setStorageSync({ key: 'token', data: response.data.data.token });
            my.setStorageSync({ key: 'role', data: qrData.role });
            my.setStorageSync({ key: 'warehouse', data: response.data.data.warehouse });
            
            my.showToast({
              type: 'success',
              content: '登录成功'
            });
            
            // 根据角色跳转
            setTimeout(function() {
              if (qrData.role === 'deliveryman') {
                my.navigateTo({ url: '/pages/delivery/index' });
              } else if (qrData.role === 'user') {
                my.navigateTo({ url: '/pages/consumption/index' });
              }
            }, 1000);
          } else {
            my.showToast({
              type: 'none',
              content: response.data.message
            });
          }
        },
        fail: function(error) {
          console.error('登录API调用失败:', error);
          my.showToast({
            type: 'none',
            content: '登录失败'
          });
        },
        complete: function() {
          this.setData({ scanning: false });
        }.bind(this)
      });
    } catch (e) {
      console.error('二维码解析失败:', e);
      my.showToast({
        type: 'none',
        content: '二维码解析失败'
      });
    } finally {
      this.setData({ scanning: false });
    }
  }
});