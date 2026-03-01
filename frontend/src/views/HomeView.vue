<template>
  <div class="home-container">
    <el-card shadow="hover" class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>系统概览</span>
        </div>
      </template>
      <div class="welcome-content">
        <h1>欢迎使用南亚陆港饮用水领用系统</h1>
        <p>本系统用于管理企业内部饮用水的配送、领用和库存，帮助企业提高饮用水管理效率，减少资源浪费。</p>
        <div class="stats-grid">
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ todayDeliveryCount }}</div>
              <div class="stat-label">今日送水记录</div>
            </div>
          </el-card>
          <el-card shadow="hover" class="stat-card">
            <div class="stat-content">
              <div class="stat-number">{{ todayConsumptionCount }}</div>
              <div class="stat-label">今日领用记录</div>
            </div>
          </el-card>
        </div>
        <div class="chart-section">
          <el-card shadow="hover" class="chart-card">
            <template #header>
              <div class="card-header">
                <span>仓库库存分布</span>
              </div>
            </template>
            <div class="chart-container">
              <div ref="pieChartRef" class="pie-chart"></div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
    <el-card shadow="hover" class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <span>快速操作</span>
        </div>
      </template>
      <div class="quick-actions">
        <el-button type="primary" @click="navigateTo('/delivery')">
          <el-icon><Plus /></el-icon>
          新增送水记录
        </el-button>
        <el-button type="success" @click="navigateTo('/consumption')">
          <el-icon><TakeawayBox /></el-icon>
          提交领用申请
        </el-button>
        <el-button type="warning" @click="navigateTo('/inventory')">
          <el-icon><DataLine /></el-icon>
          查看库存状态
        </el-button>
        <el-button type="info" @click="navigateTo('/statistics')">
          <el-icon><PieChart /></el-icon>
          查看统计报表
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, TakeawayBox, DataLine, PieChart } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import api from '../utils/api'

const router = useRouter()
const pieChartRef = ref(null)
const pieChart = ref(null)
const todayDeliveryCount = ref(0)
const todayConsumptionCount = ref(0)

const navigateTo = (path) => {
  router.push(path)
}

// 获取今日日期
const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// 获取今日送水记录
const getTodayDelivery = async () => {
  try {
    const today = getTodayDate()
    const data = await api.get('/statistics/delivery', { startDate: today, endDate: today })
    todayDeliveryCount.value = data.totalQuantity || 0
  } catch (error) {
    console.error('获取今日送水记录失败:', error)
    todayDeliveryCount.value = 0
  }
}

// 获取今日领用记录
const getTodayConsumption = async () => {
  try {
    const today = getTodayDate()
    const data = await api.get('/statistics/consumption', { startDate: today, endDate: today })
    todayConsumptionCount.value = data.totalQuantity || 0
  } catch (error) {
    console.error('获取今日领用记录失败:', error)
    todayConsumptionCount.value = 0
  }
}

// 获取仓库库存数据并绘制饼图
const getWarehouseInventory = async () => {
  try {
    const data = await api.get('/statistics/inventory')
    const warehouseStats = data.warehouseStats || []
    
    // 准备饼图数据
    const pieData = warehouseStats.map(warehouse => {
      // 计算该仓库的总桶装水数量
      const totalQuantity = warehouse.categoryStats.reduce((sum, category) => sum + category.quantity, 0)
      return {
        name: warehouse.name,
        value: totalQuantity
      }
    })
    
    // 绘制饼图
    if (pieChartRef.value) {
      if (pieChart.value) {
        pieChart.value.dispose()
      }
      pieChart.value = echarts.init(pieChartRef.value)
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 10,
          data: pieData.map(item => item.name)
        },
        series: [
          {
            name: '仓库库存',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: pieData
          }
        ]
      }
      
      pieChart.value.setOption(option)
      
      // 响应式调整
      window.addEventListener('resize', () => {
        pieChart.value.resize()
      })
    }
  } catch (error) {
    console.error('获取仓库库存数据失败:', error)
  }
}

// 初始化数据
onMounted(async () => {
  await Promise.all([
    getTodayDelivery(),
    getTodayConsumption(),
    getWarehouseInventory()
  ])
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 100%;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content h1 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.welcome-content p {
  font-size: 16px;
  margin-bottom: 24px;
  color: #666;
  line-height: 1.5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.chart-section {
  margin-top: 30px;
}

.chart-card {
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
}

.chart-container {
  margin-top: 20px;
}

.pie-chart {
  width: 100%;
  height: 400px;
}

.quick-actions-card {
  margin-top: 20px;
}

.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quick-actions .el-button {
  flex: 1;
  min-width: 150px;
  justify-content: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .pie-chart {
    height: 300px;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .quick-actions .el-button {
    width: 100%;
  }
}
</style>