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
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeOrderById(scope.row.id)"></el-button>
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
            <el-input v-model="addForm.order_no" size="mini" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="snap_address">
            <el-input v-model="addForm.snap_address" size="mini" placeholder="请输入收货地址"></el-input>
          </el-form-item>
          <el-form-item label="收货人姓名" prop="contacts">
            <el-input v-model="addForm.contacts" size="mini" placeholder="请输入收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="收货人手机" prop="phone">
            <el-input v-model="addForm.phone" size="mini" placeholder="请输入收货人手机号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select placeholder="请选择" v-model="addForm.status" size="mini">
              <el-option v-for="item in status" :key="item.id" :value="item.id" :label="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货人" prop="user_id">
            <el-row>
              <el-col :span="6">
                <el-select v-model="addForm.province_id" @change="getCityList($event)" size="mini">
                  <el-option v-for="item in provincelist" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select v-model="addForm.user_id" @change="getUserByCity($event)" size="mini">
                  <el-option v-for="item in citylist" :key="item.id" :value="item.user_id" :label="item.name"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6"><el-input v-model="addForm.user_truename" :disabled="true" size="mini"></el-input></el-col>
              <el-col :span="6"><el-input v-model="addForm.user_phone" :disabled="true" size="mini"></el-input></el-col>
            </el-row>
          </el-form-item>
          <div v-for="(item, index) in addForm.snap_items" :key="index">
            <el-form-item label="订单详情">
              <el-input v-model="item.proName" size="mini" placeholder="商品名称、规格等重要信息"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" style="display: inline-block">
              <el-input v-model="item.proCount" size="mini" placeholder="数量"></el-input>
            </el-form-item>
            <el-form-item label="商品单价" style="display: inline-block">
              <el-input v-model="item.proPrice" size="mini" placeholder="单价"></el-input>
            </el-form-item>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" style="margin-left: 36px;" @click="delItemRow(index)"></el-button>
          </div>
          <el-button size="mini" type="primary" @click="addItemRow">添加</el-button>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="addOrder()" size="mini">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 订单详情对话框 -->
      <el-dialog title="订单详情" :visible.sync="infoDialogVisible" width="50%">

        <!-- 详情主体 -->
        <el-form :model="orderInfo" label-width="100px">
          <el-form-item label="订单号：">{{ orderInfo.order_no }}</el-form-item>
          <el-form-item label="订单详情：">
            <div v-for="(item, index) in orderInfo.snap_items" :key="index">
              <el-row>
                <el-col :span="6"><div>商品名称：{{ item.proName }}</div></el-col>
                <el-col :span="6"><div>商品数量：{{ item.proCount }}</div></el-col>
                <el-col :span="6"><div>商品单价：￥{{ item.proPrice }}</div></el-col>
                <el-col :span="6"><div>小计：￥{{ ((item.proPrice*100)*item.proCount)/100 }}</div></el-col>
              </el-row>
            </div>
            <div>总计：￥{{ orderInfo.total_price }}</div>
          </el-form-item>
          <el-form-item label="收货人地址：">{{ orderInfo.snap_address }}</el-form-item>
          <el-form-item label="收货人姓名：">{{ orderInfo.contacts }}</el-form-item>
          <el-form-item label="收货人手机：">{{ orderInfo.phone }}</el-form-item>
          <el-form-item label="发货人：">{{ orderInfo.user.true_name+'  '+orderInfo.user.phone }}</el-form-item>
          <el-form-item label="订单状态：">{{ orderInfo.status.text }}</el-form-item>
          <el-form-item label="退款备注：">{{ orderInfo.refund_notes }}</el-form-item>
          <el-form-item label="发货信息：">{{ orderInfo.send_info }}</el-form-item>
          <el-form-item label="发货时间：">{{ orderInfo.send_time }}</el-form-item>
        </el-form>

      </el-dialog>

      <!-- 修改订单对话框 -->
      <el-dialog title="订单修改" :visible.sync="editDialogVisible" width="50%">

        <!-- 内容主体区域 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="订单号" prop="order_no">
            <el-input v-model="editForm.order_no" size="mini" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="收货地址" prop="snap_address">
            <el-input v-model="editForm.snap_address" size="mini" placeholder="请输入收货地址"></el-input>
          </el-form-item>
          <el-form-item label="收货人姓名" prop="contacts">
            <el-input v-model="editForm.contacts" size="mini" placeholder="请输入收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="收货人手机" prop="phone">
            <el-input v-model="editForm.phone" size="mini" placeholder="请输入收货人手机号"></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select placeholder="请选择" v-model="editForm.status_val" size="mini">
              <el-option v-for="item in status" :key="item.id" :value="item.id" :label="item.value" :disabled="true"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货人" prop="user_id">
            <el-row>
              <el-col :span="6">
                <el-select v-model="editForm.province_id" @change="getCityList($event)" size="mini">
                  <el-option v-for="item in provincelist" :key="item.id" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select v-model="editForm.city_id" @change="getUserByCity($event)" size="mini">
                  <el-option v-for="item in citylist" :key="item.id" :value="item.user_id" :label="item.name"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6"><el-input v-model="editUser.true_name" :disabled="true" size="mini"></el-input></el-col>
              <el-col :span="6"><el-input v-model="editUser.phone" :disabled="true" size="mini"></el-input></el-col>
            </el-row>
          </el-form-item>
          <div v-for="(item, index) in editForm.snap_items" :key="index">
            <el-form-item label="商品详情" prop="proName">
              <el-input v-model="item.proName" size="mini" placeholder="商品名称、规格等重要信息"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="proCount" style="display: inline-block">
              <el-input v-model="item.proCount" size="mini" placeholder="数量"></el-input>
            </el-form-item>
            <el-form-item label="商品单价" prop="proPrice" style="display: inline-block">
              <el-input v-model="item.proPrice" size="mini" placeholder="单价"></el-input>
            </el-form-item>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" style="margin-left: 36px;" @click="delItemRow(index)"></el-button>
          </div>
          <el-button size="mini" type="primary" @click="addItemRow">添加</el-button>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="editOrder" size="mini">确 定</el-button>
        </span>

      </el-dialog>

    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    // 自定义验证规则
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regPhone.test(value)) {
        return cb()
      } else {
        cb(new Error('请输入合法的手机号'))
      }
    }
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
      // 同省份城市信息存储对象
      citylist: [],
      // 对应供货仓人员信息存储对象
      user: null,
      status: [
        { id: 1, value: '已付款' },
        { id: 2, value: '已接单' },
        { id: 3, value: '已发货' },
        { id: 4, value: '已退款' }
      ],
      // 数据总条数
      total: 0,
      // 控制添加订单对话框的显示与隐藏
      addDialogVisible: false,
      // 控制订单详情对话框的显示与隐藏
      infoDialogVisible: false,
      // 控制修改订单对话框的显示与隐藏
      editDialogVisible: false,
      // 添加订单的表单数据
      addForm: {
        order_no: '',
        snap_items: [{ proName: '', proCount: null, proPrice: null }],
        totalCount: 0,
        totalPrice: null,
        snap_address: '',
        contacts: '',
        phone: '',
        province_id: '',
        user_id: '',
        user_truename: '',
        user_phone: '',
        status: ''
      },
      // 订单详情信息存储对象
      orderInfo: {
        order_no: '',
        snap_items: [{ proName: '', proCount: null, proPrice: null }],
        totalCount: 0,
        totalPrice: null,
        snap_address: '',
        contacts: '',
        phone: '',
        province_id: '',
        city_id: '',
        user_id: '',
        user_truename: '',
        user_phone: '',
        status: [{ val: '', text: '' }],
        user: [{ true_name: '', phone: '' }]
      },
      // 修改订单信息存储对象
      editForm: {},
      editUser: {},
      // 添加城市的表单规则验证对象
      addFormRules: {
        order_no: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        snap_items: [{ required: true, message: '请输入订单详情', trigger: 'blur' }],
        snap_address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        contacts: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入收货人手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择订单状态', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择发货人', trigger: 'blur' }]
      },
      // 修改城市的表单规则验证对象
      editFormRules: {
        order_no: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
        proName: [{ required: true, message: '请输入商品详细', trigger: 'blur' }],
        proCount: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        proPrice: [{ required: true, message: '请输入商品单价', trigger: 'blur' }],
        snap_address: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
        contacts: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入收货人手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择订单状态', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择发货人', trigger: 'blur' }]
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
      const { data: res } = await this.$http.get('order/getOrders', { params: this.queryInfo })
      // console.log(res)
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
        return this.$message.error('获取省份列表信息失败')
      }
    },
    // 获取对应城市列表
    async getCityList (province) {
      const { data: res } = await this.$http.get('country/getCityByProvince?province=' + province)
      if (res.meta.status === 200) {
        this.citylist = res.data
      } else {
        return this.$message.error('获取城市列表信息失败')
      }
    },
    // 获取城市负责人信息
    async getUserByCity (id) {
      const { data: res } = await this.$http.get('user/getUserByCity?user_id=' + id)
      if (res.meta.status === 200) {
        this.addForm.user_truename = res.data.true_name
        this.addForm.user_phone = res.data.phone
        this.editUser.true_name = res.data.true_name
        this.editUser.phone = res.data.phone
      } else {
        this.$message.error(res.meta.msg)
      }
    },
    // 获取单一订单信息
    async getOrderOne (id) {
      const { data: res } = await this.$http.get('order/getOrderById?id=' + id)
      if (res.meta.status === 200) {
        this.orderInfo = res.data
        this.editForm = res.data
        this.editForm.status_val = res.data.status.val
        this.editUser = res.data.user
      } else {
        this.$message.error(res.meta.msg)
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
    // 监听添加订单对话框的关闭事件
    addDialogClosed () {
      this.addForm = {
        order_no: '',
        snap_items: [{ proName: '', proCount: null, proPrice: null }],
        totalCount: 0,
        totalPrice: null,
        snap_address: '',
        contacts: '',
        phone: '',
        province_id: '',
        user_id: '',
        user_truename: '',
        user_phone: '',
        status: ''
      }
    },
    // 点击添加商品详情行事件
    addItemRow () {
      this.addForm.snap_items.push({
        proName: '',
        proCount: null,
        proPrice: null
      })
      this.$message.success('添加一行')
    },
    // 点击删除商品详情行事件
    delItemRow (row) {
      if (row === 0) {
        return this.$message.error('最后一行，不可删除')
      } else {
        this.addForm.snap_items.pop(row)
        this.$message.success('删除一行')
      }
    },
    // 添加订单
    addOrder () {
      var items = this.addForm.snap_items
      for (var i = 0; i < items.length; i++) {
        items[i].proCount = items[i].proCount - 0
        items[i].proPrice = items[i].proPrice - 0
        this.addForm.totalCount += items[i].proCount
        this.addForm.totalPrice += ((items[i].proPrice * 100) * items[i].proCount) / 100
      }

      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证信息不通过，请重新填写')
        // 发起添加请求
        else {
          const { data: res } = await this.$http.post('order/addOrder', this.addForm)
          if (!res) {
            this.$message.error('添加订单失败，请重试')
          } else {
            this.$message.success('添加订单成功')
            // 隐藏添加的对话框
            this.addDialogVisible = false
            // 刷新订单列表
            this.getOrderList()
          }
        }
      })
    },
    // 订单详情对话框
    showInfoDialog (id) {
      this.getOrderOne(id)
      this.infoDialogVisible = true
    },
    // 展示编辑订单对话框
    showEditDialog (id) {
      this.getOrderOne(id)
      this.editDialogVisible = true
    },
    // 修改订单
    async editOrder () {
      var items = this.editForm.snap_items
      for (var i = 0; i < items.length; i++) {
        items[i].proCount = items[i].proCount - 0
        items[i].proPrice = items[i].proPrice - 0
        this.editForm.totalCount += items[i].proCount
        this.editForm.totalPrice += (items[i].proPrice * 100) * items[i].proCount
        this.editForm.totalPrice /= 100
      }
      const { data: res } = await this.$http.post('order/editOrder', this.editForm)
      console.log(res)
      console.log(this.editForm)
    },
    // 删除订单
    removeOrderById (id) {
      this.$message.error('不可删除')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
