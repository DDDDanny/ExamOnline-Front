<template>
  <div class="students-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <GraduationCap />
      </el-icon>
      <span style="margin-left: 10px">学生管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">学生姓名: </span>
        <el-input v-model="queryInfo.name" placeholder="请输入学生姓名" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">学号: </span>
        <el-input v-model="queryInfo.student_id" placeholder="请输入学号" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">激活状态: </span>
        <el-select v-model="queryInfo.is_active" placeholder="请选择激活状态" style="width: 240px" clearable>
          <el-option key="1" label="已激活" :value="true"/>
          <el-option key="2" label="未激活" :value="false"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="getStudents">
          <Search class="common-btn-icon-style"/>查 询</el-button>
      </div>
    </div>
    <div class="common-module-opts-box">
      <el-button color="#42b883" style="color: #fff" @click="handleOpenDialog">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button color="#42b883" style="color: #fff" @click="handleOpenUploadDialog">
        <Upload class="common-btn-icon-style"/>
        批量上传
      </el-button>
      <el-button color="#42b883" style="color: #fff" @click="handleBatchActive()">
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
          @selectionChange="handleGetSelected"
      >
        <el-table-column fixed type="selection" width="40"/>
        <el-table-column fixed type="index" align="center" width="60" label="序号"/>
        <el-table-column fixed prop="student_id" label="学号" align="center" width="180"/>
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
        <el-table-column fixed="right" label="操 作" align="center" width="240" :resizable="false">
          <template #default="scope">
            <el-button
                v-if="!scope['row']['is_active']"
                link
                size="small"
                type="success"
                :icon="Zap"
                @click="handleBatchActive(scope['row']['id'])"
            >
              激活
            </el-button>
            <el-divider v-if="!scope['row']['is_active']" direction="vertical"/>
            <el-button link size="small" type="warning" :icon="SquarePen">编辑</el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="danger" :icon="Trash2" @click="handleDelete(scope['row']['id'])">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <div class="students-management-main-pagination-box">
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
  <el-dialog
      width="600"
      title="批量上传"
      draggable
      destroy-on-close
      v-model="uploadDialogVisible"
      :close-on-click-modal="false"
  >
    <el-upload drag accept=".xlsx" action="https://127.0.0.1">
      <el-icon class="el-icon--upload"><Upload /></el-icon>
      <div class="el-upload__text">
        将文件拖放到此处或<em>单击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          文件限制：小于 1MB 的 xlsx 文件
        </div>
      </template>
    </el-upload>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" :icon="Download" @click="handleDownload">下载模版</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      width="800"
      title="新增学生用户"
      draggable
      destroy-on-close
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" :icon="Ban">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" :icon="Send">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import { User, Common } from "../../api"
import {ElMessage, ElMessageBox} from "element-plus";
import {
  Check, GraduationCap, Plus, Search, Trash2,
  Upload, X, Zap, SquarePen, Download, Ban, Send
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

// 获取学生信息
const getStudents = () => {
  User.getStudentsApi(queryInfo, currentPage.value, pageSize.value).then(response => {
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
  currentPage.value = 1
  getStudents()
})

// 存储被选中的学生IDs（用于批量激活）
const selectedStudentsIds: any = ref([])

// 获取表格中选中的项
const handleGetSelected = (selected: any[]) => {
  const tempData: string[] = []
  for (const selectedElement of selected) {
    tempData.push(selectedElement.id)
  }
  selectedStudentsIds.value = tempData
}

// 处理批量激活
const handleBatchActive = (studentId?: string) => {
  // 如果有传入学生ID，则直接使用该ID，否则使用选中的学生ID数组
  const ids: string[] = studentId ? [studentId] : selectedStudentsIds.value
  // 如果没有选择任何学生，则提示并返回
  if (ids.length === 0) {
    ElMessage.warning('没有选择任何学生，无法进行批量激活！');
    return;
  }
  // 调用批量激活学生的 API
  User.batchActiveStudentsApi(ids).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg);
      return;
    }
    ElMessage.success('激活成功！');
    getStudents();
  });
}

// 处理删除学生信息
const handleDelete = (rowId: string) => {
  ElMessageBox.confirm(
      '您确定要删除吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  ).then(() => {
    User.deleteStudentApi(rowId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('删除成功！')
      getStudents()
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

// 控制上传Dialog展示
const uploadDialogVisible = ref(false)
// 处理打开上传Dialog
const handleOpenUploadDialog = () => {
  uploadDialogVisible.value = true
}

// 控制新增&编辑用户信息Dialog
const dialogVisible = ref(false)
// 处理打开新增&编辑用户信息Dialog
const handleOpenDialog = () => {
  dialogVisible.value = true
}

// 处理下载批量上传学生模版
const handleDownload = async () => {
  try {
    const response = await Common.downloadFileApi('UploadStudentTemplates.xlsx')
    // 处理下载的文件
    const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/xlsx"}))
    const link = document.createElement('a')
    link.href = url
    // 设置下载文件的文件名
    link.setAttribute('download', '上传模版-学生.xlsx')
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载文件失败', error)
  }
}
</script>

<style scoped lang="scss">
.students-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.table-header-row-style) {
  background-color: #3483d1 !important;;
  color: #ffffff !important;;
}
.students-management-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>
