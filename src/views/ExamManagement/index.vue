<template>
  <div class="exam-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <BookOpenCheck />
      </el-icon>
      <span style="margin-left: 10px">考试管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">考试名称: </span>
        <el-input v-model="queryInfo.title" placeholder="请输入考试名称" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">考试状态: </span>
        <el-select v-model="queryInfo.exam_status" placeholder="请选择考试状态" style="width: 240px" clearable>
          <el-option key="1" label="进行中" value="进行中"/>
          <el-option key="2" label="已结束" value="已结束"/>
          <el-option key="3" label="未开始" value="未开始"/>
        </el-select>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">发布类型: </span>
        <el-select v-model="queryInfo.is_published" placeholder="请选择发布类型" style="width: 240px" clearable>
          <el-option key="1" label="已发布" :value="true"/>
          <el-option key="2" label="未发布" :value="false"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="handleQueryExams">
          <Search class="common-btn-icon-style"/>查 询</el-button>
      </div>
    </div>
    <div class="common-module-opts-box">
      <el-button color="#42b883" style="color: #fff" @click="handleOpenDialog('C')">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
      <el-button type="primary" style="color: #fff" @click="handleOpenExamScheduleDrawer">
        <CalendarRange class="common-btn-icon-style"/>
        查看考试安排
      </el-button>
    </div>
    <div class="exam-table-box">
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
        <el-table-column fixed prop="title" label="考试标题" align="center" width="240"/>
        <el-table-column prop="paper_title" label="试卷标题" align="center" width="240"/>
        <el-table-column prop="exam_status" label="考试状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['exam_status'] === '已结束'" type="success">
              <el-icon><Flag /></el-icon>
              已完成
            </el-tag>
            <el-tag size="small" v-else-if="scope['row']['exam_status'] === '进行中'" type="primary">
              <el-icon><Rocket /></el-icon>
              进行中
            </el-tag>
            <el-tag size="small" v-else-if="scope['row']['exam_status'] === '未开始'" type="warning">
              <el-icon><Ban /></el-icon>
              未开始
            </el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_datetime" label="考试开始时间" align="center" width="180"/>
        <el-table-column prop="end_datetime" label="考试结束时间" align="center" width="180"/>
        <el-table-column prop="is_published" label="发布状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['is_published']" type="success">
              <el-icon><Check /></el-icon>
              已发布
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><X /></el-icon>
              未发布
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publish_date" label="发布时间" align="center" width="180">
          <template #default="scope">
            <span v-if="scope['row']['publish_date']">{{ scope['row']['publish_date'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="pass_mark" label="及格分数" align="center" width="80"/>
        <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
        <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
        <el-table-column prop="remark" label="备注" align="center" width="200">
          <template #default="scope">
            <span v-if="scope['row']['remark']">{{ scope['row']['remark'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="260" :resizable="false">
          <template #default="scope">
            <div v-if="!scope['row']['is_published']">
              <el-button
                  link
                  size="small"
                  type="success"
                  :icon="Navigation"
                  @click="handlePublishExam(scope['row'])"
              >
                发布
              </el-button>
              <el-divider direction="vertical"/>
              <el-button link size="small" type="warning" :icon="SquarePen" @click="handleOpenDialog('E', scope['row'])">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button link size="small" type="primary" :icon="UserRoundPlus" @click="openCorrelationDialog(scope['row'])">关联</el-button>
              <el-divider direction="vertical"/>
              <el-button link size="small" type="danger" :icon="Trash2" @click="handleDelete(scope['row']['id'])">
                删除
              </el-button>
            </div>
            <div v-else>
              <div v-if="scope['row']['exam_status'] === EXAM_STATUS.NOT_STARTED">
                <el-button
                    link
                    size="small"
                    type="info"
                    :icon="NavigationOff"
                    @click="handleCancelPublishExam(scope['row'])"
                >
                  取消发布
                </el-button>
                <el-divider direction="vertical"/>
                <el-button link size="small" type="primary" :icon="UserRoundPlus" @click="openCorrelationDialog(scope['row'])">关联考生</el-button>
              </div>
              <el-button
                  link
                  v-else-if="scope['row']['exam_status'] === EXAM_STATUS.ENDED"
                  size="small"
                  type="primary"
                  :icon="Award"
                  @click="goExamResultDetail(scope['row'])"
              >
                查看成绩
              </el-button>
              <span v-else>--</span>
            </div>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <div class="exam-main-pagination-box">
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
      width="800"
      :title="optType === 'C' ? '新增考试' : '编辑考试'"
      draggable
      destroy-on-close
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleClose(formRef)"
  >
    <el-form :model="formData" ref="formRef">
      <el-form-item label="考试标题" :label-width="formLabelWidth" prop="title" required>
        <el-input v-model="formData.title" placeholder="请输入考试标题" clearable/>
      </el-form-item>
      <el-form-item label="试卷" :label-width="formLabelWidth" prop="paper_id" required>
        <el-select v-model="formData.paper_id" placeholder="请选择试卷">
          <el-option v-for="item in paperInfoForSelector" :label="item['title']" :value="item['id']" :key="item['id']"/>
        </el-select>
      </el-form-item>
      <el-form-item label="考试日期" :label-width="formLabelWidth" prop="exam_date" required>
        <el-date-picker
            v-model="formData.exam_date"
            type="date"
            placeholder="请选择考试日期"
            format="YYYY-MM-DD"
            date-format="YYYY-MM-DD"
            :disabledDate="disabledDate"
            style="width: 100%;"
            @change="handleChangeDate"
        />
      </el-form-item>
        <div style="width:100%;display: flex;justify-content: space-between">
          <el-form-item label="考试时间" :label-width="formLabelWidth" prop="start_time" required>
            <el-time-select
                v-model="formData.start_time"
                style="width: 320px"
                :min-time="getCurrentTime()"
                :max-time="formData.end_time"
                placeholder="请输入考试开始时间"
                format="HH:mm:00"
                step="00:10:00"
                start="00:00:00"
                end="23:59:00"
            />
          </el-form-item>
          <el-form-item prop="end_time" required>
            <el-time-select
                v-model="formData.end_time"
                style="width: 320px"
                :min-time="formData.start_time"
                placeholder="请输入考试结束时间"
                format="HH:mm:00"
                step="00:10:00"
                start="00:00:00"
                end="23:59:00"
            />
          </el-form-item>
        </div>
      <el-form-item label="及格分数" :label-width="formLabelWidth" prop="pass_mark" required>
        <el-input v-model="formData.pass_mark" placeholder="请输入考试及格分数" clearable>
          <template #append>分</template>
        </el-input>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注信息" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false" :icon="Ban">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExamInfo(formRef)" :icon="Send">提 交</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      width="800"
      title="关联考生"
      draggable
      destroy-on-close
      v-model="correlationDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <div class="dialog-transfer-box">
      <el-transfer
          filterable
          v-model="correlationStudents"
          :titles="['待选考生', '已选考生']"
          filter-placeholder="请输入学生姓名"
          :data="studentsInfo"
          :props="{key: 'id', label: 'name'}"
          style="margin-top: 15px;"
          @change="handleTransferChange"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="correlationDialogVisible = false" :icon="Ban">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCorrelation" :icon="Send">提 交</el-button>
      </div>
    </template>
  </el-dialog>
  <el-drawer
      :size="700"
      v-model="examScheduleDrawerVisible"
      title="查看考试安排"
      destroy-on-close
      :close-on-click-modal="false"
  >
    <div class="exam-schedule-main-box">
      <div class="exam-schedule-date-selector">
        <span style="color: #5e5e5e;font-size: 14px; margin-right: 10px;">日期:</span>
        <el-date-picker
            v-model="examScheduleDate"
            type="date"
            placeholder="选择日期"
            size="small"
            :clearable="false"
            @change="handleChangeScheduleData"
        />
      </div>
      <el-divider />
      <div v-if="examScheduleData.length === 0" class="exam-schedule-empty">
        <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
      </div>
      <div v-else class="exam-schedule-timeline">
        <el-timeline style="max-width: 600px">
          <el-timeline-item
              v-for="item in examScheduleData"
              :timestamp="item['start_time']"
              hollow
              size="large"
              placement="top"
              :color="item['color']"
          >
            <el-card style="color: #5e5e5e">
              <h4>考试名称：{{ item['title'] }}</h4>
              <p>考试时间为： {{ item['start_time'] }} - {{ item['end_time'] }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import moment from 'moment'
import {onMounted, reactive, ref} from "vue";
import { Exam, Paper, User, ExamResult } from "../../api"
import type {FormInstance} from 'element-plus'
import {ElMessage, ElMessageBox} from "element-plus";
import {getCookie} from "../../utils/cookie.ts";
import router from "../../router";
import {useExamResultDetailStore} from "../../stores/ExamResultDetailStore.ts";
import {
  BookOpenCheck, Check, Navigation, NavigationOff, Award, UserRoundPlus,
  Plus, Search, SquarePen, Trash2, X, Flag, Rocket, Ban, Send, CalendarRange
} from "lucide-vue-next";

// 获取登录用户ID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 查询条件
const queryInfo = reactive({
  title: null,
  is_published: null,
  exam_status: null,
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

// 处理分页时当前页的变更事件
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getExamsTableData()
}

const EXAM_STATUS = {
  ENDED: '已结束',
  ONGOING: '进行中',
  NOT_STARTED: '未开始',
  UNPUBLISHED: '--'
};

// 获取考试状态
const getExamStatus = (item: any, currentTime: number, startTime: number, endTime: number) => {
  if (!item.is_published) {
    return EXAM_STATUS.UNPUBLISHED;
  }
  if (currentTime >= endTime) {
    return EXAM_STATUS.ENDED;
  } else if (currentTime < endTime && currentTime >= startTime) {
    return EXAM_STATUS.ONGOING;
  } else {
    return EXAM_STATUS.NOT_STARTED;
  }
};

// 获取考试表格数据
const getExamsTableData = () => {
  Exam.getExamsApi(queryInfo, currentPage.value, pageSize.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData: any = []
      response.data.data.map((item: any) => {
        // 计算考试状态
        let examStatus: string
        const currentTime = moment().unix()
        const startTime = moment(item['start_time'], 'YYYY-MM-DD HH:mm:ss').unix()
        const endTime = moment(item['end_time'], 'YYYY-MM-DD HH:mm:ss').unix()
        examStatus = getExamStatus(item, currentTime, startTime, endTime)
        tempData.push({
          id: item.id,
          title: item.title,
          paper_id: item['paper_id'],
          paper_title: item['paper_info']['title'],
          exam_status: examStatus,
          start_datetime: item['start_time'],
          end_datetime: item['start_time'],
          exam_date: moment(item['start_time'], 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD'),
          start_time: moment(item['start_time'], 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'),
          end_time: moment(item['end_time'], 'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss'),
          is_published: item['is_published'],
          publish_date: item['publish_date'],
          pass_mark: item['pass_mark'],
          created_user: item['created_user'],
          created_at: item['created_at'],
          updated_at: item['updated_at'],
          remark: item['remark'],
        })
      })
      if (queryInfo.exam_status) {
        const filterData = tempData.filter((item: any) => item['exam_status'] === queryInfo.exam_status)
        tableData.value = filterData
        tablePageTotal.value = filterData.length
      } else {
        tableData.value = tempData
        tablePageTotal.value = response.data.total
      }
    }
  })
}

// 处理查询考试信息
const handleQueryExams = () => {
  getExamsTableData()
}

// 控制日期选择
const disabledDate = (date: any) => {
  return date <= moment().subtract(1, 'days')
}

// 获取当前时间，用作时间选择的限制
const getCurrentTime = () => {
  const examDate = moment(formData.value.exam_date).format('YYYY-MM-DD')
  if (examDate === moment().format('YYYY-MM-DD')) {
    return moment().add(1, 'minute').format('HH:mm:00')
  }
}

// 处理日期变化时时间的清除逻辑
const handleChangeDate = () => {
  formData.value['start_time'] = ''
  formData.value['end_time'] = ''
}

// 存储试卷信息（用于选择器）
const paperInfoForSelector = ref([])
// 获取试卷信息
const getPaperInfo = () => {
  Paper.getPapersForSelectorApi(userId).then(response => {
    if (response.code !== 200) {
      ElMessage.error('获取试卷信息失败！')
      return
    } else {
      paperInfoForSelector.value = response.data.data
    }
  })
}

// 获取学生信息，用于考试关联考生
const studentsInfo = ref([])
const getStudentsInfo = () => {
  User.getStudentsApi({is_deleted: false, is_active: true}, 1, 100000).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    }
    const tempData: any = []
    response.data.data.map((item: any) => {
      tempData.push({
        id: item.id,
        name: `${item.name}（ ${item.student_id} ）`,
      })
    })
    studentsInfo.value = tempData
  })
}

onMounted(() => {
  currentPage.value = 1
  getExamsTableData()
  getPaperInfo()
})

// 处理删除考试逻辑
const handleDelete = (rowId: string) => {
  ElMessageBox.confirm(
      '您确定要删除本场考试吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  ).then(() => {
    Exam.deleteExamApi(rowId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      } else {
        ElMessage.success('删除成功！')
        getExamsTableData()
      }
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

// 处理发布考试信息
const handlePublishExam = (rowInfo: any) => {
  const thirtyMinutesLater = moment().add(30, 'minutes').unix()
  const startTime = moment(rowInfo['start_datetime'], 'YYYY-MM-DD HH:mm:ss').unix()
  // 发布增加判断：距离考试开始时间小于30分钟，无法发布考试
  if (thirtyMinutesLater >= startTime) {
    ElMessage.warning('距离考试开始小于30分钟，无法发布考试！')
    return
  }
  Exam.publishExamApi(rowInfo['id']).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      ElMessage.success('发布考试成功！')
      getExamsTableData()
    }
  })
}

// 处理取消发布考试逻辑
const handleCancelPublishExam = (rowInfo: any) => {
  const twoHoursLater = moment().add(2, 'hours').unix()
  const startTime = moment(rowInfo['start_datetime'], 'YYYY-MM-DD HH:mm:ss').unix()
  // 取消发布增加判断：距离考试开始时间小于2小时，无法取消发布
  if (twoHoursLater >= startTime) {
    ElMessage.warning('距离考试开始小于2小时，无法取消发布！')
    return
  }
  ElMessageBox.confirm(
      '您确定要取消发布本场考试吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  ).then(() => {
    Exam.cancelPublishExamApi(rowInfo['id']).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      } else {
        ElMessage.success('取消发布成功！')
        getExamsTableData()
      }
    })
  }).catch(() => {
    ElMessage.info('取消操作')
  })
}

// 控制新增、编辑Dialog是否显示
const dialogVisible = ref(false)

// Dialog中Form Label的通用宽度
const formLabelWidth = '100px'
// 新增试题表单的Ref
const formRef = ref<FormInstance>()
// FormData 初始化
const initFormData = {
  title: '',
  paper_id: '',
  exam_date: '',
  start_time: '',
  end_time: '',
  pass_mark: '',
  remark: '',
  created_user: userId,
  updated_user: userId
}
// 试题 FormData
const formData = ref(initFormData)

// 控制判断是新增OR编辑
const optType = ref('C')

// 处理打开Dialog
const handleOpenDialog = (opt: string, itemData?: any) => {
  if (opt === 'E') {
    formData.value = itemData
  }
  optType.value = opt
  dialogVisible.value = true
}

// 处理关闭Dialog回调函数
const handleClose = (formEl: any) => {
  formData.value = initFormData
  formEl.resetFields()
  dialogVisible.value = false
}

// 处理提交考试信息
const handleSubmitExamInfo = (formEl: any) => {
  formEl.validate(async (result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的考试信息后重新提交！')
      return
    }
    try {
      const current_time = moment().format('YYYY-MM-DD HH:mm:ss')
      const start_time = moment(formData.value['exam_date']).format('YYYY-MM-DD ') + formData.value['start_time']
      const end_time = moment(formData.value['exam_date']).format('YYYY-MM-DD ') + formData.value['end_time']
      // 判断考试开始时间是否已经超过当前时间（编辑过去未发布的考试）
      if (start_time <= current_time) {
        ElMessage.warning('考试开始时间已经超过当前时间！请重新选择考试时间！')
        return
      }
      const response = optType.value === 'C'
          ? await Exam.createExamApi({ ...formData.value, start_time, end_time })
          : await Exam.editExamApi({ ...formData.value, start_time, end_time, updated_user: userId })
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      dialogVisible.value = false
      ElMessage.success(optType.value === 'C' ? '新增考试成功！' : '编辑考试成功！')
      getExamsTableData()
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })
}

// 从Store中获取，getExamInfo方法，用来获取考试信息
const examResultDetail = useExamResultDetailStore()
const { setExamInfo } = examResultDetail

// 跳转至考试成绩详情页面
const goExamResultDetail = (item: any) => {
  setExamInfo(item, '/examManagement')
  router.replace('/examResultDetail')
}

// 控制关联考生Dialog是否可见
const correlationDialogVisible = ref(false)
const examId: any = ref('')
// 打开关联学生Dialog
const openCorrelationDialog = (rowInfo: any) => {
  examId.value = rowInfo['id']
  // 获取已经关联的考生信息
  getExamResultStudentsInfo(rowInfo['id'])
  // 获取所有的考生信息
  getStudentsInfo()
  correlationDialogVisible.value = true
}
// 存储已经关联的学生信息
const correlationStudents: any = ref([])
const getExamResultStudentsInfo = (id: string) => {
  ExamResult.getExamResultApi({ exam_id: id }).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    }
    const tempData: any = []
    response.data.data.map((item: any) => {
      tempData.push(item['student_info']['id'])
    })
    correlationStudents.value = tempData
  })
}

// 处理已选考生变化逻辑
const handleTransferChange = (rightValue: any) => {
  correlationStudents.value = rightValue
}

// 处理提交考试-考生关联关系
const handleSubmitCorrelation = () => {
  ExamResult.createExamResultApi(examId.value, correlationStudents.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    }
    ElMessage.success('关联考生成功！')
    correlationDialogVisible.value = false
  })
}

// 控制考试安排Drawer是否显示
const examScheduleDrawerVisible = ref(false)
// 考试安排的数据
const examScheduleData = ref([])
// 考试安排日期选择
const examScheduleDate = ref(moment().format('YYYY-MM-DD'))

// 获取考试安排数据
const getExamSchedule = () => {
  const querySet = { is_deleted: false, is_published: true, start_time: examScheduleDate.value }
  Exam.getExamScheduleApi(querySet).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    }
    const tempData = response.data.data
    const currentTime = moment().unix()
    tempData.map((item: any) => {
      const startTime = moment(item['start_time'], 'YYYY-MM-DD HH:mm:ss').unix()
      const endTime = moment(item['end_time'], 'YYYY-MM-DD HH:mm:ss').unix()
      if (currentTime >= endTime) {
        item['color'] = '#67C23A'
      } else if (currentTime < endTime && currentTime >= startTime) {
        item['color'] = '#409EFF'
      } else {
        item['color'] = '#E6A23C'
      }
    })
    examScheduleData.value = tempData
  })
}

// 打开考试安排Drawer
const handleOpenExamScheduleDrawer = () => {
  getExamSchedule()
  examScheduleDrawerVisible.value = true
}

// 处理考试安排日期变更
const handleChangeScheduleData = (val: any) => {
  examScheduleDate.value = moment(val).format('YYYY-MM-DD')
  getExamSchedule()
  ElMessage.success('考试安排已刷新！')
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.exam-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.exam-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}

.dialog-transfer-box {
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.el-transfer-panel) {
  width: 290px !important;
}

:deep(.el-transfer-panel .el-checkbox__label) {
  color: #5e5e5e !important;
  font-size: 13px !important;
}

.exam-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}

.exam-schedule-main-box {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.exam-schedule-timeline {
  height: calc(100vh - 210px);
  overflow-y: auto;
}
.exam-schedule-empty {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>