<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>供货仓管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看所有供货仓</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加供货仓</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="true_name" width="70px"></el-table-column>
        <el-table-column label="账号/手机号" prop="username" width="100px"></el-table-column>
        <el-table-column label="密码" prop="password" width="80px"></el-table-column>
        <el-table-column label="管辖区域" prop="city"></el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="150px"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id, scope.row.city)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum" :page-sizes="[8, 10, 15, 20]" :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <!--添加用户对话框 -->
      <el-dialog title="添加供货仓" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="姓名" prop="true_name">
            <el-input v-model="addForm.true_name"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="addForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog title="修改供货仓" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <!-- 表单主体 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
          <el-form-item label="姓名" prop="true_name">
            <el-input v-model="editForm.true_name"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="username">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="editForm.password"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
      // 获取供货仓用户列表的参数对象
      queryInfo: {
        query: '',
        pageNum: 1,
        pageSize: 10
      },
      // 用户列表数据存储对象
      userlist: [],
      // 数据总条数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 添加供货仓的表单数据
      addForm: {
        name: '',
        username: '',
        password: '',
        phone: ''
      },
      // 查询到的用户信息对象
      editForm: {},
      // 添加供货仓的表单规则验证对象
      addFormRules: {
        true_name: [
          { required: true, message: '请输入供货仓管理人姓名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入供货仓管理人账号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入供货仓管理人密码', trigger: 'blur' },
          { min: 3, max: 15, message: '密码应为3~15个字符之间', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入供货仓管理人手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 修改供货仓的表单规则验证对象
      editFormRules: {
        true_name: [
          { required: true, message: '请输入供货仓管理人姓名', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入供货仓管理人账号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入供货仓管理人密码', trigger: 'blur' },
          { min: 3, max: 15, message: '密码应为3~15个字符之间', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入供货仓管理人手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('user/getUsers', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取供货仓用户列表失败')
      } else {
        this.userlist = res.data.users
        this.total = res.data.total
      }
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.getUserList()
    },
    // 监听页码的值改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getUserList()
    },
    // 监听添加供货仓对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定执行添加供货仓事件
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return '信息验证不通过'
        // 发起添加请求
        else {
          const { data: res } = await this.$http.post('user/addUser', this.addForm)
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
      const { data: res } = await this.$http.get('user/getUserOne?id=' + id)
      if (!res.status) return this.$message.error('获取用户信息失败')
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
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return '信息验证不通过'
        } else {
          const { data: res } = await this.$http.post('user/userUpdate', this.editForm)
          if (res) {
            // 关闭对话框
            this.editDialogVisible = false
            // 刷新数据列表
            this.getUserList()
            // 提示修改成功
            this.$message.success('更新用户信息成功')
          } else {
            return this.$message.error('更新用户信息失败')
          }
        }
      })
    },
    // 根据 id 删除对应的用户信息
    async removeUserById (id, city) {
      // 判断是否已绑定市区，绑定市区不可删除，否则才可以进行删除
      if (city === '') {
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
        return this.$message.error('请先解绑该用户后再删除！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
