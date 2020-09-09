<template>
  <div>

    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>财务结算</el-breadcrumb-item>
      <el-breadcrumb-item>财务结算记录</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getFinanceList()">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加财务结算记录</el-button>
        </el-col>
      </el-row>

      <!-- 财务列表区域 -->
      <el-table :data="financelist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="销售金额" prop="sell_out"></el-table-column>
        <el-table-column label="货物成本" prop="principal"></el-table-column>
        <el-table-column label="平台扣点" prop="cut"></el-table-column>
        <el-table-column label="退单损失" prop="loss"></el-table-column>
        <el-table-column label="刷单成本" prop="invest"></el-table-column>
        <el-table-column label="分成" prop="share"></el-table-column>
        <el-table-column label="结算时间" prop="settle_time"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeFinanceById(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum" :page-sizes="[8, 10, 15, 20]" :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <el-dialog title="添加结算记录" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="销售金额" prop="sell_out">
            <el-input v-model="addForm.sell_out" type="number"></el-input>
          </el-form-item>
          <el-form-item label="货物成本" prop="principal">
            <el-input v-model="addForm.principal" type="number"></el-input>
          </el-form-item>
          <el-form-item label="平台抽点"  prop="cut">
            <el-input v-model="addForm.cut" type="number"></el-input>
          </el-form-item>
          <el-form-item label="退单损失"  prop="loss">
            <el-input v-model="addForm.loss" type="number"></el-input>
          </el-form-item>
          <el-form-item label="刷单成本"  prop="invest">
            <el-input v-model="addForm.invest" type="number"></el-input>
          </el-form-item>
          <el-form-item label="结算时间" prop="settle_time">
            <div class="block">
              <el-date-picker v-model="addForm.settle_time" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"
              format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFinance()">确 定</el-button>
        </span>

      </el-dialog>

    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取财务结算信息列表的参数对象
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      // 财务结算信息存储对象
      financelist: [],
      // 数据总条数
      total: 0,
      // 省份信息存储列表
      provincelist: [],
      // 城市信息存储列表
      citylist: [],
      // 控制添加结算记录对话框的显示与隐藏
      addDialogVisible: false,
      // 添加结算记录的表单数据
      addForm: {
        sell_out: null,
        principal: null,
        cut: null,
        loss: null,
        invest: null,
        settle_time: null
      },
      // 添加结算记录的表单规则验证对象
      addFormRules: {
        sell_out: [{ required: true, message: '请输入销售金额', trigger: 'blur' }],
        principal: [{ required: true, message: '请输入货物成本', trigger: 'blur' }],
        cut: [{ required: true, message: '请输入平台扣点', trigger: 'blur' }],
        loss: [{ required: true, message: '请输入退单损失', trigger: 'blur' }],
        invest: [{ required: true, message: '请输入刷单成本', trigger: 'blur' }],
        settle_time: [{ required: true, message: '请选择结算日期', trigger: 'blur' }]
      },
      // 设定时间
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created () {
    this.getFinanceList()
  },
  methods: {
    // 初始化财务结算列表
    async getFinanceList () {
      const { data: res } = await this.$http.get('finance/getFinance', { params: this.queryInfo })
      if (res.meta.status === 200) {
        this.financelist = res.data.finance
        this.total = res.data.total
      } else {
        this.$message.error('获取列表失败')
      }
    },
    // 监听添加城市对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getCityList()
    },
    // 监听页码的值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getCityList()
    },
    // 添加结算信息
    async addFinance () {
      this.addForm.settle_time += ''
      this.addForm.cut = parseFloat(this.addForm.cut)
      this.addForm.loss = parseFloat(this.addForm.loss)
      this.addForm.invest = parseFloat(this.addForm.invest)
      this.addForm.sell_out = parseFloat(this.addForm.sell_out)
      this.addForm.principal = parseFloat(this.addForm.principal)
      console.log(this.addForm)
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('验证信息不通过，请重新填写')
        // 发起添加请求
        else {
          const { data: res } = await this.$http.post('finance/addFinance', this.addForm)
          if (!res) {
            this.$message.error('添加结算失败，请重试')
          } else {
            this.$message.success('添加结算成功')
            // 隐藏添加的对话框
            this.addDialogVisible = false
            // 刷新订单列表
            this.getFinanceList()
          }
        }
      })
    },
    // 删除结算信息
    async removeFinanceById (id) {
      // 弹框询问是否要进行删除操作
      const confirmRes = await this.$confirm('此操作将永久删除该结算信息, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
      ).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (confirmRes === 'confirm') {
        const { data: res } = await this.$http.post('finance/delFinance', { id: id })
        if (res.meta.status === 200) {
          this.getFinanceList()
          this.$message.success(res.meta.msg)
        } else {
          return this.$message.error(res.meta.msg)
        }
      } else {
        return this.$message.info('删除操作已取消')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
