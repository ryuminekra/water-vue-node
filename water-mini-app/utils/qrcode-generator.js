// utils/qrcode-generator.js
// 用于生成测试用的二维码数据

// 生成送水员二维码数据
function generateDeliverymanQR(warehouseId) {
  return {
    role: 'deliveryman',
    warehouseId: warehouseId.toString(),
    timestamp: Date.now().toString(),
    signature: 'test-signature-deliveryman'
  };
}

// 生成领用人二维码数据
function generateUserQR(warehouseId) {
  return {
    role: 'user',
    warehouseId: warehouseId.toString(),
    timestamp: Date.now().toString(),
    signature: 'test-signature-user'
  };
}

// 示例：生成仓库1的送水员二维码数据
const deliverymanQR = generateDeliverymanQR(1);
console.log('送水员二维码数据:', JSON.stringify(deliverymanQR));

// 示例：生成仓库1的领用人二维码数据
const userQR = generateUserQR(1);
console.log('领用人二维码数据:', JSON.stringify(userQR));

module.exports = {
  generateDeliverymanQR,
  generateUserQR
};