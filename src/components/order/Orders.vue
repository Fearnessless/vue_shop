<template>
  <div>

    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看所有订单</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getOrderList()">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加订单</el-button>
        </el-col>
      </el-row>

      <!-- 订单列表区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单号" prop="order_no"></el-table-column>
        <el-table-column label="订单状态" prop="status.text"></el-table-column>
        <el-table-column label="发货人" prop="user.true_name"></el-table-column>
        <el-table-column label="发货人手机号" prop="user.phone"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 详情按钮 -->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-info" size="mini" @click="showInfoDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCityById(scope.row.id, scope.row.user.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum" :page-sizes="[8, 10, 15, 20]" :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <!--添加订单对话框 -->
      <el-dialog title="添加订单" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="订单号" prop="order_no">
            <el-input v-model="addForm.order_no" size="mini"></el-input>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCity()">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取订单信息列表的参数对象
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      // 订单数据列表存储对象
      orderlist: [],
      // 省份数据列表存储对象
      provincelist: [],
      // 数据总条数
      total: 0,
      // 控制添加订单对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改订单对话框的显示与隐藏
      editDialogVisible: false,
      // 添加订单的表单数据
      addForm: {
        order_no: '',
        snap_items: [{
          name: '',
          num: null,
          price: null
        }],
        total_count: null,
        total_price: null,
        snap_address: '',
        contacts: '',
        phone: null,
        user_id: null,
        status: null
      },
      // 查询到的订单信息对象
      editForm: {},
      // 添加城市的表单规则验证对象
      addFormRules: {
        order_no: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        snap_items: [{ required: true, message: '请输入订单详情', trigger: 'blur' }],
        snap_address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        contacts: [{ required: true, message: '请选择负责人', trigger: 'blur' }]
      },
      // 修改城市的表单规则验证对象
      editFormRules: {
        name: [{ required: true, message: '请输入城市名称', trigger: 'blur' }],
        city_id: [{ required: true, message: '请选择所属省份', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择联系人', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getOrderList()
    this.getProvinceList()
  },
  methods: {
    // 获取订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('order/getOrders', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status === 200) {
        this.orderlist = res.data.orders
        this.total = res.data.total
      } else {
        return this.$mesaage.error('获取省份列表信息失败')
      }
    },
    // 获取省份列表
    async getProvinceList () {
      const { data: res } = await this.$http.get('city/getCity')
      if (res.status) {
        this.provincelist = res.data
      } else {
        return this.$mesaage.error('获取省份列表信息失败')
      }
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getOrderList()
    },
    // 监听页码的值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getOrderList()
    },
    // 监听添加城市对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听 input 改变事件
    change (e) {
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
