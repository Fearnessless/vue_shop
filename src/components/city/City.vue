<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>城市管理</el-breadcrumb-item>
      <el-breadcrumb-item>城市/市区管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getCityList()">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加城市</el-button>
        </el-col>
      </el-row>

      <!-- 城市列表区域 -->
      <el-table :data="citylist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="城市名称" prop="name"></el-table-column>
        <el-table-column label="所属省份" prop="city.name"></el-table-column>
        <el-table-column label="联系人" prop="user.true_name"></el-table-column>
        <el-table-column label="手机号" prop="user.phone"></el-table-column>
        <el-table-column label="创建时间" prop="create_time"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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

      <!--添加城市对话框 -->
      <el-dialog title="添加城市" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item label="城市名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属省份" prop="province">
            <el-select placeholder="请选择" v-model="addForm.province">
              <el-option v-for="item in provincelist" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="user">
            <el-select placeholder="请选择" v-model="addForm.user">
              <el-option v-for="item in userlist" :key="item.id" :value="item.id" :label="item.phone+' '+item.true_name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCity()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改城市的对话框 -->
      <el-dialog title="修改城市信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 表单主体 -->
        <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="城市名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属省份" prop="city_id">
            <el-select placeholder="请选择" v-model="editForm.city_id">
              <el-option v-for="item in provincelist" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系人" prop="user_id">
            <el-select placeholder="请选择" v-model="editForm.user_id">
              <el-option v-for="item in userlist" :key="item.id" :value="item.id" :label="item.phone+' '+item.true_name"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCityInfo">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取城市信息列表的参数对象
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      // 城市列表数据存储对象
      citylist: [],
      // 省份列表数据存储对象
      provincelist: [],
      // 供货仓用户数据存储列表
      userlist: [],
      // 数据总条数
      total: 0,
      // 控制添加城市对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改城市对话框的显示与隐藏
      editDialogVisible: false,
      // 添加城市的表单数据
      addForm: {
        name: '',
        province: '',
        user: ''
      },
      // 查询到的城市信息对象
      editForm: {},
      // 添加城市的表单规则验证对象
      addFormRules: {
        name: [{ required: true, message: '请输入城市名称', trigger: 'blur' }],
        province: [{ required: true, message: '请选择所属省份', trigger: 'blur' }],
        user: [{ required: true, message: '请选择联系人', trigger: 'blur' }]
      },
      // 修改城市的表单规则验证对象
      editFormRules: {
        name: [{ required: true, message: '请输入城市名称', trigger: 'blur' }],
        city_id: [{ required: true, message: '请选择所属省份', trigger: 'blur' }],
        user_id: [{ required: true, message: '请选择联系人', trigger: 'blur' }]
      }
    }
  },
  // 生命周期函数
  created () {
    this.getCityList()
    this.getUserList()
    this.getProvinceList()
  },
  methods: {
    // 获取城市列表
    async getCityList () {
      const { data: res } = await this.$http.get('country/getCities', {
        params: this.queryInfo
      })
      if (res.meta.status === 200) {
        this.citylist = res.data.cities
        this.total = res.data.total
      } else {
        return this.$mesaage.error('获取省份列表信息失败')
      }
    },
    // 获取供货仓用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('user/getUser')
      if (!res.status) {
        return this.$message.error('获取供货仓用户列表失败')
      } else {
        this.userlist = res.data
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
      this.getCityList()
    },
    // 监听页码的值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getCityList()
    },
    // 监听添加城市对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定执行添加城市事件
    addCity () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return '信息验证不通过'
        // 发起添加请求
        else {
          const { data: res } = await this.$http.post('country/addCity', this.addForm)
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            // 隐藏添加的对话框
            this.addDialogVisible = false
            // 刷新用户列表
            this.getUserList()
          }
        }
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('country/getCountryOne?id=' + id)
      if (!res.status) return this.$message.error('获取城市信息失败')
      else {
        this.editForm = res.data
        this.editDialogVisible = true
      }
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editCityInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return '信息验证不通过'
        } else {
          const { data: res } = await this.$http.post('country/countryUpdate',
            {
              id: this.editForm.id,
              name: this.editForm.name,
              city_id: this.editForm.city_id,
              user_id: this.editForm.user_id
            })
          if (res) {
            // 关闭对话框
            this.editDialogVisible = false
            // 刷新数据列表
            this.getCityList()
            // 提示修改成功
            this.$message.success('更新用户信息成功')
          } else {
            return this.$message.error('更新用户信息失败')
          }
        }
      })
    },
    // 根据 id 删除对应的用户信息
    async removeCityById (id, user) {
      // 判断是否已绑定市区，绑定市区不可删除，否则才可以进行删除
      if (user === '') {
        // 弹框询问是否要进行删除操作
        const confirmRes = await this.$confirm('此操作将永久删除该供货仓信息, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
        ).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消删除，则返回值为字符串 cancel
        if (confirmRes === 'confirm') {
          const { data: res } = await this.$http.post('user/delUser', { id: id })
          if (res.meta.status === 200) {
            this.getUserList()
            this.$message.success(res.meta.msg)
          } else {
            return this.$message.error(res.meta.msg)
          }
        } else {
          return this.$message.info('删除操作已取消')
        }
      } else {
        return this.$message.error('请先解绑该城市后再删除！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
