<template>
  <div class="teacher-main-box">
    <div class="common-module-header-box">
      <el-icon><Users /></el-icon>
      <span style="margin-left: 10px">教师管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">教师姓名: </span>
        <el-input v-model="queryInfo.name" placeholder="请输入教师姓名" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">激活状态: </span>
        <el-select v-model="queryInfo.is_active" placeholder="请选择激活状态" style="width: 240px" clearable>
          <el-option key="1" label="已激活" :value="true"/>
          <el-option key="2" label="未激活" :value="false"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="getTeachers">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
    <div class="common-module-opts-box">
      <el-button color="#42b883" style="color: #fff">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button color="#42b883" style="color: #fff">
        <Upload class="common-btn-icon-style"/>
        批量上传
      </el-button>
      <el-button color="#42b883" style="color: #fff">
        <Zap class="common-btn-icon-style"/>
        批量激活
      </el-button>
    </div>
    <div class="papers-table-box">
      <el-table
          border
          stripe
          size="small"
          :data="tableData"
          show-overflow-tooltip
          class="common-table-base-style"
          header-cell-class-name="table-header-row-style"
      >
        <el-table-column fixed type="selection" width="40"/>
        <el-table-column fixed type="index" align="center" width="60" label="序号"/>
        <el-table-column fixed prop="teacher_id" label="教师编号" align="center" width="180"/>
        <el-table-column prop="name" label="姓名" align="center" width="180"/>
        <el-table-column prop="username" label="登录账号" align="center" width="180"/>
        <el-table-column prop="gender" label="性别" align="center" width="120">
          <template #default="scope">
            <span v-if="scope['row']['gender'] === 'male'">男</span>
            <span v-else>女</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_active" label="激活状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['is_active']" type="success">
              <el-icon><Check /></el-icon>
              已激活
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><X /></el-icon>
              未激活
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" align="center" width="180">
          <template #default="scope">
            <span v-if="scope['row']['phone']">{{ scope['row']['phone'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center" width="180">
          <template #default="scope">
            <span v-if="scope['row']['email']">{{ scope['row']['email'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="年级" align="center" width="180">
          <template #default="scope">
            <span v-if="scope['row']['grade']">{{ scope['row']['grade'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
        <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="220" :resizable="false">
          <template #default="scope">
            <el-button
                v-if="!scope['row']['is_active']"
                link
                size="small"
                type="success"
                :icon="Zap"
            >
              激活
            </el-button>
            <el-divider v-if="!scope['row']['is_active']" direction="vertical"/>
            <el-button
                link
                size="small"
                type="warning"
                :icon="SquarePen"
            >
              编辑
            </el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="danger" :icon="Trash2">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <div class="teachers-management-main-pagination-box">
        <el-pagination
            small
            background
            :total="tablePageTotal"
            class="mt-4"
            style="margin-top: 20px"
            :default-page-size="pageSize"
            layout="total, prev, pager, next"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import { User } from "../../api"
import {ElMessage} from "element-plus";
import {
  Users, Plus, Search, Upload, Zap,
  SquarePen, Trash2, X, Check
} from "lucide-vue-next";

// 查询条件
const queryInfo = reactive({
  name: null,
  student_id: null,
  is_deleted: false,
  is_active: null
})

// 存储表格数据
const tableData: any = ref([])
// 当前页
const currentPage = ref(1)
// 每页数量
const pageSize = ref(50)
// 数据总数
const tablePageTotal = ref(0)

// 处理分页时当前页的变更事件
const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

// 获取教师信息
const getTeachers = () => {
  User.getTeachersApi(queryInfo, currentPage.value, pageSize.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      tableData.value = response.data.data
      tablePageTotal.value = response.data.total
    }
  })
}

onMounted(() => {
  getTeachers()
})

</script>

<style scoped lang="scss">
.teacher-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.table-header-row-style) {
  background-color: #3483d1 !important;;
  color: #ffffff !important;;
}
.teachers-management-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>
