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
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 省份列表区域 -->
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

    </el-card>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>

</style>
