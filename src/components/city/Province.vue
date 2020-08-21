<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>城市管理</el-breadcrumb-item>
      <el-breadcrumb-item>省份管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getProvinceList()">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 省份列表区域 -->
      <el-table :data="provincelist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum" :page-sizes="[8, 10, 15, 20]" :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取省份列表的参数对象
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 8
      },
      // 省份列表数据存储对象
      provincelist: [],
      // 数据总条数
      total: 0
    }
  },
  created () {
    this.getProvinceList()
  },
  methods: {
    // 获取省份列表
    async getProvinceList () {
      const { data: res } = await this.$http.get('city/getProvinces', {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        this.provincelist = res.data.provinces
        this.total = res.data.total
      } else {
        return this.$mesaage.error('获取省份列表信息失败')
      }
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getProvinceList()
    },
    // 监听页码的值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getProvinceList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
