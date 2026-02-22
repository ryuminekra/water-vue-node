<template>
  <div class="statistics-container">
    <h1>统计分析</h1>
    
    <!-- 筛选栏 -->
    <el-card shadow="hover" class="mb-4">
      <div class="filter-section">
        <h3>筛选条件</h3>
        <div class="filter-controls">
          <div class="date-range">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="handleDateChange"
            />
          </div>
          
          <div class="filter-buttons">
            <el-button @click="filterByToday">今日</el-button>
            <el-button @click="filterByWeek">本周</el-button>
            <el-button @click="filterByMonth">本月</el-button>
            <el-button @click="filterByYear">本年</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </div>
        </div>
      </div>
    </el-card>
    
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="送水统计" name="delivery">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>送水统计</span>
              <div class="view-toggle">
                <el-button-group>
                  <el-button :type="deliveryViewType === 'table' ? 'primary' : ''" @click="deliveryViewType = 'table'">表格</el-button>
                  <el-button :type="deliveryViewType === 'chart' ? 'primary' : ''" @click="deliveryViewType = 'chart'">图表</el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <div class="stats-content">
            <div class="stats-summary">
              <el-statistic title="总送水量" :value="deliveryStats.totalQuantity" suffix="单位" />
              <el-statistic title="总金额" :value="deliveryStats.totalAmount" prefix="¥" />
            </div>
            
            <!-- 表格视图 -->
            <div v-if="deliveryViewType === 'table'" class="stats-detail">
              <div v-for="warehouse in deliveryStats.warehouseStats" :key="warehouse.id" class="warehouse-section mb-4">
                <h4>{{ warehouse.name }} (总计: {{ warehouse.totalQuantity }} 单位, ¥{{ warehouse.totalAmount }})</h4>
                <el-table :data="warehouse.categoryStats" style="width: 100%; margin-top: 10px">
                  <el-table-column prop="name" label="饮用水品类" />
                  <el-table-column prop="quantity" label="数量" />
                  <el-table-column prop="amount" label="金额" />
                </el-table>
              </div>
            </div>
            
            <!-- 图表视图 -->
            <div v-else class="chart-container">
              <div ref="deliveryChartRef" style="width: 100%; height: 100%;"></div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="领用统计" name="consumption">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>领用统计</span>
              <div class="view-toggle">
                <el-button-group>
                  <el-button :type="consumptionViewType === 'table' ? 'primary' : ''" @click="consumptionViewType = 'table'">表格</el-button>
                  <el-button :type="consumptionViewType === 'chart' ? 'primary' : ''" @click="consumptionViewType = 'chart'">图表</el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <div class="stats-content">
            <div class="stats-summary">
              <el-statistic title="总领用量" :value="consumptionStats.totalQuantity" suffix="单位" />
              <el-statistic title="总金额" :value="consumptionStats.totalAmount" prefix="¥" />
            </div>
            
            <!-- 表格视图 -->
            <div v-if="consumptionViewType === 'table'" class="stats-detail">
              <div v-for="department in consumptionStats.departmentStats" :key="department.id" class="department-section mb-4">
                <h4>{{ department.name }} (总计: {{ department.totalQuantity }} 单位, ¥{{ department.totalAmount }})</h4>
                <el-table :data="department.categoryStats" style="width: 100%; margin-top: 10px">
                  <el-table-column prop="name" label="饮用水品类" />
                  <el-table-column prop="quantity" label="数量" />
                  <el-table-column prop="amount" label="金额" />
                </el-table>
              </div>
            </div>
            
            <!-- 图表视图 -->
            <div v-else class="chart-container">
              <div ref="consumptionChartRef" style="width: 100%; height: 100%;"></div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="库存统计" name="inventory">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>库存统计</span>
              <div class="view-toggle">
                <el-button-group>
                  <el-button :type="inventoryViewType === 'table' ? 'primary' : ''" @click="inventoryViewType = 'table'">表格</el-button>
                  <el-button :type="inventoryViewType === 'chart' ? 'primary' : ''" @click="inventoryViewType = 'chart'">图表</el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <div class="stats-content">
            <div class="stats-summary">
              <el-statistic title="总库存价值" :value="inventoryStats.totalValue" prefix="¥" />
              <el-statistic title="总空桶数量" :value="inventoryStats.totalEmptyBuckets" suffix="个" />
            </div>
            
            <!-- 表格视图 -->
            <div v-if="inventoryViewType === 'table'" class="stats-detail">
              <div v-for="warehouse in inventoryStats.warehouseStats" :key="warehouse.id" class="warehouse-section mb-4">
                <h4>{{ warehouse.name }} (总价值: ¥{{ warehouse.totalValue }}, 空桶数量: {{ warehouse.totalEmptyBuckets }}个)</h4>
                <el-table :data="warehouse.categoryStats" style="width: 100%; margin-top: 10px">
                  <el-table-column prop="name" label="饮用水品类" />
                  <el-table-column prop="quantity" label="数量" />
                  <el-table-column prop="emptyBucketQuantity" label="空桶数量" />
                  <el-table-column prop="value" label="价值" />
                  <el-table-column prop="isAlert" label="状态">
                    <template #default="scope">
                      <el-tag :type="scope.row.isAlert ? 'danger' : 'success'">
                        {{ scope.row.isAlert ? '预警' : '正常' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            
            <!-- 图表视图 -->
            <div v-else class="chart-container">
              <div ref="inventoryChartRef" style="width: 100%; height: 100%;"></div>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="结算统计" name="billing">
        <el-card shadow="hover" class="mb-4">
          <template #header>
            <div class="card-header">
              <span>结算统计</span>
            </div>
          </template>
          <div class="stats-content">
            <div class="stats-summary">
              <el-statistic title="总金额" :value="billingStats.totalAmount" prefix="¥" />
              <el-statistic title="已支付金额" :value="billingStats.paidAmount" prefix="¥" />
            </div>
            <div class="stats-detail">
              <el-table :data="billingStatusStats" style="width: 100%">
                <el-table-column prop="status" label="状态" />
                <el-table-column prop="count" label="数量" />
              </el-table>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import axios from 'axios'
import api from '../utils/api'
import * as echarts from 'echarts'

const activeTab = ref('delivery')
const dateRange = ref([])

// 视图类型
const deliveryViewType = ref('table')
const consumptionViewType = ref('table')
const inventoryViewType = ref('table')

// 图表引用
const deliveryChartRef = ref(null)
const consumptionChartRef = ref(null)
const inventoryChartRef = ref(null)

// 图表实例
const deliveryChart = ref(null)
const consumptionChart = ref(null)
const inventoryChart = ref(null)

const deliveryStats = ref({ totalQuantity: 0, totalAmount: 0, categoryStats: [] })
const consumptionStats = ref({ totalQuantity: 0, totalAmount: 0, categoryStats: [] })
const inventoryStats = ref({ totalValue: 0, categoryStats: [] })
const billingStats = ref({ totalAmount: 0, paidAmount: 0, statusStats: {} })
const billingStatusStats = ref([])

// 计算开始和结束日期
const startDate = computed(() => dateRange.value[0] || '')
const endDate = computed(() => dateRange.value[1] || '')

// 加载送水统计
const loadDeliveryStats = async () => {
  try {
    const params = {}
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    
    const data = await api.get('/statistics/delivery', params)
    deliveryStats.value = data
  } catch (error) {
    console.error('获取送水统计失败:', error)
  }
}

// 加载领用统计
const loadConsumptionStats = async () => {
  try {
    const params = {}
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    
    const data = await api.get('/statistics/consumption', params)
    consumptionStats.value = data
  } catch (error) {
    console.error('获取领用统计失败:', error)
  }
}

// 加载库存统计
const loadInventoryStats = async () => {
  try {
    const data = await api.get('/statistics/inventory')
    inventoryStats.value = data
  } catch (error) {
    console.error('获取库存统计失败:', error)
  }
}

// 加载结算统计
const loadBillingStats = async () => {
  try {
    const params = {}
    if (startDate.value) params.startDate = startDate.value
    if (endDate.value) params.endDate = endDate.value
    
    const data = await api.get('/statistics/billing', params)
    billingStats.value = data
    
    // 转换状态统计为表格数据
    billingStatusStats.value = Object.entries(billingStats.value.statusStats).map(([status, count]) => ({
      status: status === 'PAID' ? '已支付' : status === 'UNPAID' ? '未支付' : '已取消',
      count
    }))
  } catch (error) {
    console.error('获取结算统计失败:', error)
  }
}

// 加载所有统计数据
const loadAllStats = () => {
  loadDeliveryStats()
  loadConsumptionStats()
  loadInventoryStats()
  loadBillingStats()
}

// 处理日期范围变化
const handleDateChange = () => {
  loadAllStats()
}

// 处理标签页切换
const handleTabChange = () => {
  // 切换标签页时重新加载对应数据
  switch (activeTab.value) {
    case 'delivery':
      loadDeliveryStats()
      break
    case 'consumption':
      loadConsumptionStats()
      break
    case 'inventory':
      loadInventoryStats()
      break
    case 'billing':
      loadBillingStats()
      break
  }
}

// 按今日筛选
const filterByToday = () => {
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  dateRange.value = [todayStr, todayStr]
  handleDateChange()
}

// 按本周筛选
const filterByWeek = () => {
  const today = new Date()
  const dayOfWeek = today.getDay() || 7 // 周日为7
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - dayOfWeek + 1)
  const endOfWeek = new Date(today)
  endOfWeek.setDate(today.getDate() + (7 - dayOfWeek))
  
  dateRange.value = [
    startOfWeek.toISOString().split('T')[0],
    endOfWeek.toISOString().split('T')[0]
  ]
  handleDateChange()
}

// 按本月筛选
const filterByMonth = () => {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  
  dateRange.value = [
    startOfMonth.toISOString().split('T')[0],
    endOfMonth.toISOString().split('T')[0]
  ]
  handleDateChange()
}

// 按本年筛选
const filterByYear = () => {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const endOfYear = new Date(today.getFullYear(), 11, 31)
  
  dateRange.value = [
    startOfYear.toISOString().split('T')[0],
    endOfYear.toISOString().split('T')[0]
  ]
  handleDateChange()
}

// 重置筛选
const resetFilter = () => {
  dateRange.value = []
  handleDateChange()
}

// 初始化送水统计图表
const initDeliveryChart = () => {
  if (deliveryChartRef.value) {
    if (deliveryChart.value) {
      deliveryChart.value.dispose()
    }
    deliveryChart.value = echarts.init(deliveryChartRef.value)
    updateDeliveryChart()
  }
}

// 更新送水统计图表
const updateDeliveryChart = () => {
  if (deliveryChart.value) {
    // 准备图表数据
    const categories = [];
    const series = [];
    
    // 收集所有饮用水品类
    const categorySet = new Set();
    deliveryStats.value.warehouseStats?.forEach(warehouse => {
      warehouse.categoryStats?.forEach(category => {
        categorySet.add(category.name);
      });
    });
    categories.push(...categorySet);
    
    // 按仓库准备数据系列
    deliveryStats.value.warehouseStats?.forEach((warehouse, index) => {
      // 颜色数组
      const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
      
      // 准备该仓库的各品类数据
      const data = categories.map(categoryName => {
        const category = warehouse.categoryStats?.find(c => c.name === categoryName);
        return category ? category.quantity : 0;
      });
      
      // 添加系列
      series.push({
        name: warehouse.name,
        type: 'bar',
        data: data,
        itemStyle: {
          color: colors[index % colors.length]
        }
      });
    });
    
    const option = {
      title: {
        text: '各仓库送水量统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: deliveryStats.value.warehouseStats?.map(warehouse => warehouse.name) || [],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '数量'
      },
      series: series
    }
    deliveryChart.value.setOption(option)
  }
}

// 初始化领用统计图表
const initConsumptionChart = () => {
  if (consumptionChartRef.value) {
    if (consumptionChart.value) {
      consumptionChart.value.dispose()
    }
    consumptionChart.value = echarts.init(consumptionChartRef.value)
    updateConsumptionChart()
  }
}

// 更新领用统计图表
const updateConsumptionChart = () => {
  if (consumptionChart.value) {
    // 准备图表数据
    const data = [];
    let totalQuantity = 0;
    
    // 计算总领用量
    consumptionStats.value.departmentStats?.forEach(department => {
      totalQuantity += department.totalQuantity;
    });
    
    // 按部门准备饼图数据
    consumptionStats.value.departmentStats?.forEach(department => {
      // 计算百分比
      const percentage = totalQuantity > 0 ? ((department.totalQuantity / totalQuantity) * 100).toFixed(2) : 0;
      
      data.push({
        name: department.name,
        value: department.totalQuantity,
        percentage: `${percentage}%`
      });
    });
    
    // 颜色数组
    const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
    
    const option = {
      title: {
        text: '各部门领用量统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: consumptionStats.value.departmentStats?.map(department => department.name) || []
      },
      series: [{
        name: '领用量',
        type: 'pie',
        radius: '50%',
        center: ['50%', '60%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          color: function(params) {
            return colors[params.dataIndex % colors.length];
          }
        },
        label: {
          formatter: '{b}: {d}%'
        }
      }]
    }
    consumptionChart.value.setOption(option)
  }
}

// 初始化库存统计图表
const initInventoryChart = () => {
  if (inventoryChartRef.value) {
    if (inventoryChart.value) {
      inventoryChart.value.dispose()
    }
    inventoryChart.value = echarts.init(inventoryChartRef.value)
    updateInventoryChart()
  }
}

// 更新库存统计图表
const updateInventoryChart = () => {
  if (inventoryChart.value) {
    // 准备图表数据
    const categories = [];
    const series = [];
    
    // 收集所有饮用水品类
    const categorySet = new Set();
    inventoryStats.value.warehouseStats?.forEach(warehouse => {
      warehouse.categoryStats?.forEach(category => {
        categorySet.add(category.name);
      });
    });
    categories.push(...categorySet);
    
    // 按仓库准备数据系列
    inventoryStats.value.warehouseStats?.forEach((warehouse, index) => {
      // 颜色数组
      const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
      
      // 准备该仓库的各品类数据
      const data = categories.map(categoryName => {
        const category = warehouse.categoryStats?.find(c => c.name === categoryName);
        return category ? category.quantity : 0;
      });
      
      // 添加系列
      series.push({
        name: warehouse.name,
        type: 'bar',
        data: data,
        itemStyle: {
          color: colors[index % colors.length]
        }
      });
    });
    
    const option = {
      title: {
        text: '各仓库库存量统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: inventoryStats.value.warehouseStats?.map(warehouse => warehouse.name) || [],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '数量'
      },
      series: series
    }
    inventoryChart.value.setOption(option)
  }
}

// 监听视图类型变化
watch(deliveryViewType, (newType) => {
  if (newType === 'chart') {
    // 延迟初始化，确保DOM已经更新
    setTimeout(initDeliveryChart, 0)
  }
})

watch(consumptionViewType, (newType) => {
  if (newType === 'chart') {
    setTimeout(initConsumptionChart, 0)
  }
})

watch(inventoryViewType, (newType) => {
  if (newType === 'chart') {
    setTimeout(initInventoryChart, 0)
  }
})

// 监听数据变化
watch(() => deliveryStats.value, () => {
  if (deliveryViewType.value === 'chart') {
    updateDeliveryChart()
  }
}, { deep: true })

watch(() => consumptionStats.value, () => {
  if (consumptionViewType.value === 'chart') {
    updateConsumptionChart()
  }
}, { deep: true })

watch(() => inventoryStats.value, () => {
  if (inventoryViewType.value === 'chart') {
    updateInventoryChart()
  }
}, { deep: true })

// 监听窗口大小变化，调整图表大小
window.addEventListener('resize', () => {
  if (deliveryChart.value) deliveryChart.value.resize()
  if (consumptionChart.value) consumptionChart.value.resize()
  if (inventoryChart.value) inventoryChart.value.resize()
})

// 初始化数据
onMounted(() => {
  loadAllStats()
})

// 当组件卸载时销毁图表
onUnmounted(() => {
  if (deliveryChart.value) deliveryChart.value.dispose()
  if (consumptionChart.value) consumptionChart.value.dispose()
  if (inventoryChart.value) inventoryChart.value.dispose()
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.statistics-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 10px;
}

.filter-section {
  padding: 10px 0;
}

.filter-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: bold;
}

.filter-controls {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.date-range {
  flex: 1;
  min-width: 300px;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.stats-content {
  padding: 20px 0;
}

.stats-summary {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.stats-detail {
  margin-top: 20px;
}

.chart-container {
  margin-top: 20px;
  height: 400px;
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-range {
    min-width: 100%;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .stats-summary {
    flex-direction: column;
    gap: 20px;
  }
}
</style>