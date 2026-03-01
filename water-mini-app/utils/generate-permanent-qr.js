// 生成永久二维码数据（不包含timestamp）

// 生成送水员永久二维码数据
function generatePermanentDeliverymanQR(warehouseId) {
  return {
    role: 'deliveryman',
    warehouseId: warehouseId.toString(),
    signature: 'permanent-signature-deliveryman'
  };
}

// 生成领用人永久二维码数据
function generatePermanentUserQR(warehouseId) {
  return {
    role: 'user',
    warehouseId: warehouseId.toString(),
    signature: 'permanent-signature-user'
  };
}

// 示例：生成仓库1的送水员永久二维码数据
const deliverymanQR = generatePermanentDeliverymanQR(1);
console.log('送水员永久二维码数据:', JSON.stringify(deliverymanQR));

// 示例：生成仓库1的领用人永久二维码数据
const userQR = generatePermanentUserQR(1);
console.log('领用人永久二维码数据:', JSON.stringify(userQR));

module.exports = {
  generatePermanentDeliverymanQR,
  generatePermanentUserQR
};