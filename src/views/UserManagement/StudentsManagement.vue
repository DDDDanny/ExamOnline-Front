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
      <el-button color="#42b883" style="color: #fff" @click="handleOpenDialog('C')">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button color="#42b883" style="color: #fff" @click="handleOpenUploadDialog" :loading="uploadStatus">
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
        <el-table-column fixed="right" label="操 作" align="center" width="220" :resizable="false">
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
            <el-button
                link
                size="small"
                type="warning"
                :icon="SquarePen"
                @click="handleOpenDialog('E', scope['row'])">
              编辑
            </el-button>
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
      <common-pagination
          :handle-current-change="handleCurrentChange"
          :page-size="pageSize"
          :table-page-total="tablePageTotal"
      />
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
    <el-upload
        drag
        accept=".xlsx"
        :action="`${baseUrl}/uploadFileForStudent`"
        name="StudentTemplateFile"
        :on-success="handleUploadSuccess"
        :on-progress="handleUploadProgress"
        :before-upload="beforeUploadFile"
        v-model:file-list="fileList"
    >
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
      :title="optType === 'C' ? '新增学生用户' : '编辑学生用户'"
      draggable
      destroy-on-close
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose(formRef)"
  >
    <el-form :model="formData" ref="formRef">
      <el-form-item label="学号" :label-width="formLabelWidth" prop="student_id" required>
        <el-input v-model="formData.student_id" placeholder="请输入学号（唯一）" clearable/>
      </el-form-item>
      <el-form-item label="学生姓名" :label-width="formLabelWidth" prop="name" required>
        <el-input v-model="formData.name" placeholder="请输入学生姓名" clearable/>
      </el-form-item>
      <el-form-item label="登录账号" :label-width="formLabelWidth" prop="username">
        <el-input v-model="formData.username" placeholder="请输入登录账号（若为空，默认学号为登录账号）" clearable/>
      </el-form-item>
      <el-form-item label="性别" :label-width="formLabelWidth" prop="gender" required>
        <el-select v-model="formData.gender" placeholder="请选择性别">
          <el-option label="男" value="male"/>
          <el-option label="女" value="female"/>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入电话" clearable/>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="formData.email" placeholder="请输入邮箱" clearable/>
      </el-form-item>
      <el-form-item label="是否激活" :label-width="formLabelWidth" prop="is_active" required>
        <el-select v-model="formData.is_active" placeholder="请选择是否激活">
          <el-option label="是" :value="true"/>
          <el-option label="否" :value="false"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" :icon="Ban">取 消</el-button>
        <el-button type="primary" @click="handleSubmit(formRef)" :icon="Send">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import { User, Common } from "../../api"
import {ElMessage, ElMessageBox, ElNotification} from "element-plus";
import {getCookie} from "../../utils/cookie.ts";
import type {FormInstance} from 'element-plus'
import {
  Check, GraduationCap, Plus, Search, Trash2,
  Upload, X, Zap, SquarePen, Download, Ban, Send
} from "lucide-vue-next";
import CommonPagination from "../../components/CommonPagination.vue";

// 接口基础地址（用于上传文件）
const baseUrl = import.meta.env.VITE_APP_API_BASE_URL
// 获取UserID
const userId = JSON.parse(getCookie('UserInfo')).userId

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
  getStudents()
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
// 存储上传文件列表信息
const fileList = ref([])
// 控制上传按钮的Loading状态
const uploadStatus = ref(false)
// 处理打开上传Dialog
const handleOpenUploadDialog = () => {
  uploadDialogVisible.value = true
}

// 上传成功时的回调
const handleUploadSuccess = (response: any) => {
  let msg: string
  let noticeType: any

  if (response.code === 200) {
    noticeType = 'success'
    const failList = response.data['fail_list']
    const rowNumber = []
    for (const item of failList) {
      rowNumber.push(item['row_number'] + 2)
    }
    if (failList.length === 0) {
      msg = '上传的学生信息全部新增成功！'
    } else {
      msg = `上传的学生信息部分新增成功！有${failList.length}条数据新增失败！行号为：【${rowNumber.toString()}】`
    }
  } else if (response.code === 400) {
    noticeType = 'warning'
    msg = '上传的学生信息全部新增失败！'
  } else {
    noticeType = 'error'
    msg = response.msg
  }

  fileList.value = []
  ElNotification({ title: '上传结果', message: msg, type: noticeType })
  uploadStatus.value = false
}

// 上传中的回调逻辑
const handleUploadProgress = () => {
  ElMessage.info('数据处理中……')
  uploadDialogVisible.value = false
  uploadStatus.value = true
}

// 上传前进行文件大小校验
const beforeUploadFile = (rawFile: any) => {
  if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.warning('上传文件过大，必须小于1MB！请调整后重新上传！')
    return false
  }
  return true
}

// Dialog中Form Label的通用宽度
const formLabelWidth = '100px'
// 控制新增&编辑用户信息Dialog
const dialogVisible = ref(false)
// 控制是新增还是编辑
const optType = ref('C')
// 处理打开新增&编辑用户信息Dialog
const handleOpenDialog = (opt: string, itemData?: any) => {
  if (opt === 'E') {
    formData.value = itemData
  }
  optType.value = opt
  dialogVisible.value = true
}
// 新增试题表单的Ref
const formRef = ref<FormInstance>()
// FormData 初始化
const initFormData = {
  student_id: '',
  name: '',
  username: '',
  password: '123456',
  role: 'student',
  gender: '',
  phone: '',
  email: '',
  is_active: true,
  created_user: userId,
  updated_user: userId
}
// 试题 FormData
const formData = ref(initFormData)

// 处理关闭Dialog回调函数
const handleClose = (createFormEl: any) => {
  formData.value = initFormData
  createFormEl.resetFields()
  dialogVisible.value = false
}

// 处理提交学生信息
const handleSubmit = async (createFormEl: any) => {
  // 数据校验
  createFormEl.validate(async (result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的学生信息后重新提交！')
      return
    }
    try {
      if (!formData.value.username) {
        formData.value.username = formData.value.student_id
      }
      const response = optType.value === 'C'
          ? await User.createStudentApi(formData.value)
          : await User.editStudentApi({...formData.value, updated_user: userId})
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success(optType.value === 'C' ? '新增学生信息成功！' : '编辑学生信息成功！')
      getStudents()
      dialogVisible.value = false
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })
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
    console.error('下载文件失败！', error)
  }
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.students-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}
</style>
