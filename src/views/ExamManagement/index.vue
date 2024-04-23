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
      <el-button color="#42b883" style="color: #fff" @click="handleOpenDialog">
        <Plus class="common-btn-icon-style"/>
        新 增
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
        <el-table-column prop="paper_title" label="试卷标题" align="center" width="240">
          <template #default="scope">
            <el-button link size="small" type="primary">{{ scope['row']['paper_title'] }}</el-button>
          </template>
        </el-table-column>
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
        <el-table-column prop="start_time" label="考试开始时间" align="center" width="180"/>
        <el-table-column prop="end_time" label="考试结束时间" align="center" width="180"/>
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
        <el-table-column prop="remark" label="备注" align="center" width="200"/>
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
              <el-button link size="small" type="warning" :icon="SquarePen">编辑</el-button>
              <el-divider direction="vertical"/>
              <el-button link size="small" type="primary" :icon="UserRoundPlus">关联</el-button>
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
                <el-button link size="small" type="primary" :icon="UserRoundPlus">关联考生</el-button>
              </div>
              <el-button
                  link
                  v-else-if="scope['row']['exam_status'] === EXAM_STATUS.ENDED"
                  size="small"
                  type="primary"
                  :icon="Award"
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
      title="新增考试"
      draggable
      destroy-on-close
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="dialogVisible = false"
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
import moment from 'moment'
import {onMounted, reactive, ref} from "vue";
import { Exam } from "../../api"
import {ElMessage, ElMessageBox} from "element-plus";
import {getCookie} from "../../utils/cookie.ts";
import {
  BookOpenCheck, Check, Navigation, NavigationOff, Award, UserRoundPlus,
  Plus, Search, SquarePen, Trash2, X, Flag, Rocket, Ban, Send
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
          start_time: item['start_time'],
          end_time: item['end_time'],
          is_published: item['is_published'],
          publish_date: item['publish_date'],
          pass_mark: item['pass_mark'],
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

onMounted(() => {
  currentPage.value = 1
  getExamsTableData()
})

// 处理删除考试逻辑
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
  const startTime = moment(rowInfo['start_time'], 'YYYY-MM-DD HH:mm:ss').unix()
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
  const startTime = moment(rowInfo['start_time'], 'YYYY-MM-DD HH:mm:ss').unix()
  // 取消发布增加判断：距离考试开始时间小于2小时，无法取消发布
  if (twoHoursLater >= startTime) {
    ElMessage.warning('距离考试开始小于2小时，无法取消发布！')
    return
  }
  ElMessageBox.confirm(
      '您确定要取消发布吗？',
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

// 处理打开Dialog
const handleOpenDialog = () => {
  dialogVisible.value = true
}
</script>

<style scoped lang="scss">
.exam-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.exam-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}

:deep(.table-header-row-style) {
  background-color: #3483d1 !important;;
  color: #ffffff !important;;
}

.exam-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>