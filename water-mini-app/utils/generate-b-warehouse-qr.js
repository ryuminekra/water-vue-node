// 生成B仓库领用人的二维码参数

// 生成领用人二维码数据
function generateUserQR(warehouseId, warehouseName) {
  return {
    role: 'user',
    warehouseId: warehouseId.toString(),
    timestamp: Date.now().toString(),
    signature: 'test-signature-user-' + warehouseName.toLowerCase()
  };
}

// 生成B仓库领用人二维码数据
const userQR = generateUserQR(2, 'B仓库');
console.log('B仓库领用人二维码数据:', JSON.stringify(userQR));

// 同时生成二维码HTML页面
const fs = require('fs');
const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>B仓库领用人二维码</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .container {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    h1 {
      text-align: center;
      color: #1890ff;
    }
    .qrcode-section {
      margin: 20px 0;
    }
    .qrcode-container {
      text-align: center;
      margin: 20px 0;
    }
    #qrcode {
      display: inline-block;
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .data-section {
      background-color: white;
      padding: 15px;
      border-radius: 5px;
      margin: 10px 0;
    }
    .data-section h3 {
      margin-top: 0;
      color: #333;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: monospace;
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 5px;
      margin: 0;
    }
    .instructions {
      background-color: #e6f7ff;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .instructions h3 {
      margin-top: 0;
      color: #1890ff;
    }
    ul {
      margin: 10px 0;
      padding-left: 20px;
    }
  </style>
</head>
<body>
  <h1>饮用水领用系统 - 二维码生成器</h1>
  
  <div class="container">
    <h2>B仓库领用人二维码</h2>
    
    <div class="qrcode-section">
      <div class="qrcode-container">
        <div id="qrcode"></div>
      </div>
    </div>
    
    <div class="data-section">
      <h3>二维码数据</h3>
      <pre id="qrcode-data">${JSON.stringify(userQR)}</pre>
    </div>
    
    <div class="instructions">
      <h3>使用说明</h3>
      <ul>
        <li>使用微信扫描上方二维码</li>
        <li>小程序会自动识别为领用人角色</li>
        <li>进入领用操作页面后，选择部门，输入领用人和数量</li>
        <li>点击提交按钮完成领用申请</li>
      </ul>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
  <script>
    // 领用人二维码数据
    const qrData = '${JSON.stringify(userQR)}';
    
    // 生成二维码
    QRCode.toCanvas(document.getElementById('qrcode'), qrData, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }, function (error) {
      if (error) console.error(error);
      console.log('QR code generated successfully');
    });
  </script>
</body>
</html>`;

// 写入HTML文件
fs.writeFileSync('../b-warehouse-user-qrcode.html', htmlContent);
console.log('B仓库领用人二维码页面已生成: ../b-warehouse-user-qrcode.html');
