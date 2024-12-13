<template>
  <div class="questions-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <BookHeart/>
      </el-icon>
      <span style="margin-left: 10px">个人题库管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试题标题: </span>
        <el-input v-model="queryInfo.topic" placeholder="请输入试题标题" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题类型: </span>
        <el-select v-model="queryInfo.type" placeholder="请选择题目类型" style="width: 240px" clearable>
          <el-option key="1" label="选择题" value="select"/>
          <el-option key="2" label="判断题" value="judge"/>
        </el-select>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题状态: </span>
        <el-select v-model="queryInfo.status" placeholder="请选择题目状态" style="width: 240px" clearable>
          <el-option key="1" label="有效" :value="true"/>
          <el-option key="2" label="无效" :value="false"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="getPersonalWarehouseData">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
    <div class="common-module-opts-box">
      <el-button color="#42b883" style="color: #fff" @click="handleOpenDialog('C')">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button color="#42b883" style="color: #fff" @click="uploadDialogVisible = true">
        <Upload class="common-btn-icon-style"/>
        批量上传
      </el-button>
    </div>
    <div class="questions-main-table-box">
      <el-table
          border
          stripe
          size="small"
          :data="tableData"
          show-overflow-tooltip
          class="common-table-base-style"
          header-cell-class-name="table-header-row-style"
      >
        <el-table-column fixed type="index" align="center" width="60" label="序号"/>
        <el-table-column fixed prop="topic" label="试题标题" align="center" width="200"/>
        <el-table-column prop="type" label="试题类型" align="center" width="120">
          <template #default="scope">
            <span v-if="scope['row']['type'] === 'select'">选择题</span>
            <span v-else>判断题</span>
          </template>
        </el-table-column>
        <el-table-column prop="trial_type" label="所属题库类型" align="center" width="120">
          <template #default="scope">
            <span v-if="scope['row']['trial_type'] === 'public'">公共</span>
            <span v-else>个人</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="试题状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['status'] === true" type="success">
              <el-icon><Check/></el-icon>
              有 效
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><X/></el-icon>
              无 效
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
        <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="210" :resizable="false">
          <template #default="scope">
            <el-button
                link
                size="small"
                type="primary"
                :icon="Info"
                @click="handleOpenDetailDialog(scope['row'])"
            >
              详情
            </el-button>
            <el-divider direction="vertical"/>
            <el-button
                link
                size="small"
                type="warning"
                :icon="SquarePen"
                @click="handleOpenDialog('E', scope['row'])"
            >
              编辑
            </el-button>
            <el-divider direction="vertical"/>
            <el-button
                link
                size="small"
                type="danger"
                :icon="Trash2"
                @click="handleDelete(scope['row']['id'])"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="/src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <common-pagination
          :handle-current-change="handleCurrentChange"
          :page-size="pageSize"
          :table-page-total="tablePageTotal"
      />
    </div>
    <el-dialog
        width="800"
        :title="optType === 'C' ? '新增试题' : '编辑试题'"
        draggable
        destroy-on-close
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="handleClose(formRef)"
    >
      <el-form :model="formData" ref="formRef">
        <el-form-item label="试题题目" :label-width="formLabelWidth" prop="topic" required>
          <el-input v-model="formData.topic" placeholder="请输入题目" clearable/>
        </el-form-item>
        <el-form-item label="试题类型" :label-width="formLabelWidth" prop="type" required>
          <el-select v-model="formData.type" placeholder="请选择类型">
            <el-option label="选择题" value="select"/>
            <el-option label="判断题" value="judge"/>
          </el-select>
        </el-form-item>
        <el-form-item label="试题选项" :label-width="formLabelWidth" required v-if="formData.type === 'select'" :validate-event="false">
          <div class="question-options-box" v-for="(item, index) in Object.keys(questionOptions)">
            <span class="option-key">{{ item }}</span>
            <el-input style="width: 520px;" v-model="questionOptions[item]" placeholder="请输入试题选项" clearable/>
            <div style="margin-left: 20px" v-if="index === 0">
              <el-button link type="success" :icon="Plus" style="font-size: 18px;" @click="handleAddOption"/>
              <el-button link type="danger" :icon="Minus" style="font-size: 18px" @click="handleDelOption"/>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="参考答案" :label-width="formLabelWidth" prop="answer" required>
          <el-input v-if="formData.type == 'select'" v-model="formData.answer" placeholder="请输入参考答案" clearable/>
          <el-radio-group v-else v-model="formData.answer">
            <el-radio value="T">对</el-radio>
            <el-radio value="F">错</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属题库" :label-width="formLabelWidth" prop="trial_type" required>
          <el-select v-model="formData.trial_type" placeholder="请选择所属题库">
            <el-option label="个人题库" value="private"/>
            <el-option label="公共题库" value="public"/>
          </el-select>
        </el-form-item>
        <el-form-item label="试题状态" :label-width="formLabelWidth" prop="status" required>
          <el-select v-model="formData.status" placeholder="请选择题目状态">
            <el-option label="有效" :value="true"/>
            <el-option label="无效" :value="false"/>
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
    <el-dialog
        width="800"
        title="试题详情"
        draggable
        destroy-on-close
        v-model="detailDialogVisible"
        :close-on-click-modal="false"
    >
      <div class="question-detail-box">
        <div class="detail-tag-box detail-common">
          <el-tag style="margin-right: 10px" :icon="Bookmark">
            <el-icon><Tag /></el-icon>
            {{ detailData['type'] === 'select' ? '选择题' : '判断题' }}
          </el-tag>
          <el-tag style="margin-right: 10px" :icon="Bookmark">
            <el-icon><Tag /></el-icon>
            {{ detailData['trial_type'] === 'public' ? '公共题库' : '个人题库' }}
          </el-tag>
          <el-tag style="margin-right: 10px" :type="detailData['status'] ? 'success' : 'danger'">
            <el-icon><Tag /></el-icon>
            {{ detailData['status'] ? '有效' : '无效' }}
          </el-tag>
        </div>
        <div class="detail-common detail-topic-box">
          <span style="font-weight: bolder;">题目：</span>
          <span style="margin-top: 10px; letter-spacing: 1px;">{{ detailData['topic'] }}</span>
        </div>
        <div class="detail-options-box detail-common" v-if="detailData['type'] === 'select'">
          <span style="font-weight: bolder;">选项：</span>
          <div v-for="(value, key) in detailData['optionsJson']" :key="key" style="margin-top: 10px">
            <span>{{ key }}: {{ value }}</span>
          </div>
        </div>
        <div class="detail-common detail-answer-box">
          <span style="font-weight: bolder;">参考答案：</span>
          <span v-if="detailData['type'] === 'select'">{{ detailData['answer'] }}</span>
          <span v-else style="display: flex;align-items: center;">
            <Check v-if="detailData['answer'] == 'T'" style="height: 16px"/>
            <X v-else style="height: 15px"/>
          </span>
        </div>
        <el-divider style="margin: 0"/>
        <div class="detail-base-info-box">
          <div class="base-info">
            <div class="base-info-item">
              <span style="margin-right: 10px">创建时间：</span>
              <span>{{ detailData['created_at'] }}</span>
            </div>
            <div class="base-info-item">
              <span style="margin-right: 10px">更新时间: </span>
              <span>{{ detailData['updated_at'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
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
          :action="`${baseUrl}/uploadFileForQuestions`"
          name="QuestionsTemplateFile"
          :on-success="handleUploadSuccess"
          :on-progress="handleUploadProgress"
          :before-upload="beforeUploadFile"
          v-model:file-list="fileList"
          :data="{ userId }"
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
  </div>
</template>

<script setup lang="ts">
import './common.scss';
import { onMounted, reactive, ref, watch } from 'vue';
import { Questions, Common } from "../../api";
import { getCookie } from "../../utils/cookie.ts";
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Ban, BookHeart, Check, Info, Plus, Search, Minus,
  Send, SquarePen, Bookmark, Trash2, X, Tag, Upload, Download,
} from "lucide-vue-next";
import CommonPagination from "../../components/CommonPagination.vue";

// 接口基础地址（用于上传文件）
const baseUrl = import.meta.env.VITE_APP_API_BASE_URL

// 获取UserID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 查询条件
const queryInfo = reactive({
  topic: null,
  type: null,
  status: null,
  is_deleted: false,
  created_user: userId,
})
// 存储表格数据
const tableData: any = ref([])
// 当前页
const currentPage = ref(1)
// 每页数量
const pageSize = ref(50)
// 数据总数
const tablePageTotal = ref(0)

// 处理获取个人题库列表数据
const getPersonalWarehouseData = () => {
  Questions.getQuestionsApi(queryInfo, currentPage.value, pageSize.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData: any[] = []
      response.data.data.map((item: any) => {
        tempData.push({
          id: item.id,
          topic: item.topic,
          type: item.type,
          trial_type: item['trial_type'],
          options: item['options'],
          answer: item['answer'],
          status: item.status,
          created_at: item['created_at'],
          created_user: item['created_user'],
          updated_at: item['updated_at'],
        })
      })
      tableData.value = tempData
      tablePageTotal.value = response.data.total
    }
  })
}

// 处理分页时当前页的变更事件
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getPersonalWarehouseData()
}

// 处理删除试题逻辑
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
    Questions.delQuestionApi(rowId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('删除试题成功！')
      getPersonalWarehouseData()
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

onMounted(() => {
  currentPage.value = 1
  getPersonalWarehouseData()
})

// 试题选项
const questionOptions = ref({ 'A': '', 'B': '', 'C': '', 'D': '' })

// 处理新增选项
const handleAddOption = () => {
  if (Object.keys(questionOptions.value).length < 8) {
    const lastOptionKey = Object.keys(questionOptions.value).slice(-1)[0]
    const nextOptionKey = String.fromCharCode(lastOptionKey.charCodeAt(0) + 1);
    questionOptions.value[nextOptionKey] = ''
  } else {
    ElMessage.warning('无法新增！最多提供8个选项！')
  }
}
// 处理删除选项
const handleDelOption = () => {
  if (Object.keys(questionOptions.value).length > 1) {
    const lastOptionKey = Object.keys(questionOptions.value).slice(-1)[0]
    delete questionOptions.value[lastOptionKey]
  } else {
    ElMessage.warning('无法删除！至少保留1个选项！')
  }
}

// Dialog中Form Label的通用宽度
const formLabelWidth = '100px'
// 控制Dialog是否显示
const dialogVisible = ref(false)
// 新增试题表单的Ref
const formRef = ref<FormInstance>()
// FormData 初始化
const initFormData = {
  topic: '',
  answer: '',
  type: 'select',
  trial_type: 'private',
  options: '',
  status: true,
  created_user: userId,
  updated_user: userId
}
// 试题 FormData
const formData = ref(initFormData)

// 监听试题类型的变化
watch(() => formData.value.type, (newQuestion) => {
  if (newQuestion !== 'judge') {
    formData.value.answer = '';
    formData.value.options = '';
  }
})

const optType = ref('C')
const handleOpenDialog = (opt: string, itemData?: any) => {
  if (opt === 'E') {
    formData.value = itemData
    // 回写选项
    questionOptions.value = itemData.type === 'select' ? JSON.parse(itemData.options) : itemData.options
  }
  optType.value = opt
  dialogVisible.value = true
}
// 处理关闭Dialog回调函数
const handleClose = (createFormEl: any) => {
  formData.value = initFormData
  createFormEl.resetFields()
  dialogVisible.value = false
  // 初始化选项
  questionOptions.value = { 'A': '', 'B': '', 'C': '', 'D': '' }
}
// 处理提交试题信息
const handleSubmit = async (createFormEl: any) => {
  // 判断题预处理
  if (formData.value.type === 'judge') {
    formData.value.options = 'T&F'
  }
  // 数据校验
  createFormEl.validate(async (result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的试题信息后重新提交！')
      return
    }
    // 选择题时，对questionOptions进行处理
    if (formData.value.type === 'select') {
      // 选项校验
      const optionsData = questionOptions.value
      for (const item in optionsData) {
        if (!optionsData[item]) {
          ElMessage.warning('请输入完整的试题选项后重新提交！')
          return
        }
      }
      // 将处理完成的选项数据回写到formData
      formData.value.options = JSON.stringify(optionsData)
    }
    try {
      const response = optType.value === 'C'
          ? await Questions.createQuestionApi(formData.value)
          : await Questions.editQuestionApi({...formData.value, updated_user: userId})
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      dialogVisible.value = false
      // 初始化选项
      questionOptions.value = { 'A': '', 'B': '', 'C': '', 'D': '' }
      ElMessage.success(optType.value === 'C' ? '新增试题成功！' : '编辑试题成功！')
      getPersonalWarehouseData()
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })
}

// 控制详情Dialog是否展示
const detailDialogVisible = ref(false)
// 存储详情数据信息
const detailData: any = ref(null)
// 处理打开详情Dialog
const handleOpenDetailDialog = (itemData: any) => {
  if (itemData.type === 'select') {
    itemData['optionsJson'] = JSON.parse(itemData['options'])
  }
  detailData.value = itemData
  detailDialogVisible.value = true
}

// 控制批量上传试题Dialog是否显示
const uploadDialogVisible = ref(false)
// 存储上传文件列表信息
const fileList = ref([])
// 控制上传按钮的Loading状态
const uploadStatus = ref(false)

// 处理下载批量上传试题模版
const handleDownload = async () => {
  try {
    const response = await Common.downloadFileApi('UploadQuestionsTemplates.xlsx')
    // 处理下载的文件
    const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/xlsx"}))
    const link = document.createElement('a')
    link.href = url
    // 设置下载文件的文件名
    link.setAttribute('download', '上传模版-试题.xlsx')
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载文件失败！', error)
  }
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
      msg = '全部新增成功！'
    } else {
      msg = `部分新增成功！有${failList.length}条数据新增失败！行号为：【${rowNumber.toString()}】`
    }
  } else if (response.code === 400) {
    noticeType = 'warning'
    msg = '全部新增失败！'
  } else {
    noticeType = 'error'
    msg = response.msg
  }

  fileList.value = []
  ElNotification({ title: '上传结果', message: msg, type: noticeType })
  uploadStatus.value = false
  getPersonalWarehouseData()
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
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.questions-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.questions-main-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}

.question-options-box {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .option-key {
    width: 50px;
    display: flex;
    justify-content: center
  }
}
</style>
