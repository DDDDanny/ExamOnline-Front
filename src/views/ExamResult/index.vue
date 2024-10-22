<template>
  <div class="exam-result-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <SearchCheck />
      </el-icon>
      <span style="margin-left: 10px">成绩查询</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">考试名称: </span>
        <el-input v-model="queryInfo.title" placeholder="请输入考试名称" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="getExamsTableData">
          <Search class="common-btn-icon-style"/>查 询</el-button>
      </div>
    </div>
    <div class="exam-result-table-box">
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
        <el-table-column fixed prop="title" label="考试标题" align="center" width="250"/>
        <el-table-column prop="start_time" label="考试开始时间" align="center" width="180"/>
        <el-table-column prop="end_time" label="考试结束时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="260" :resizable="false">
          <template #default="scope">
            <el-button link size="small" type="primary" :icon="FileSymlink" @click="goViewDetail(scope['row'])">查看成绩单</el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="success" :icon="CloudDownload" @click="openDownloadDialog(scope['row'])">下载成绩单</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="/src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <div class="exam-result-main-pagination-box">
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
      width="300"
      :show-close="false"
      destroy-on-close
      v-model="downloadDialogVisible"
      style="border-radius: 10px"
  >
    <div style="width: 100%;display: flex;flex-direction: column;align-items: center;justify-content: center;">
      <el-progress type="dashboard" :percentage="percentage" :status="percentageStatus" />
      <span style="font-size: 14px;margin-top: 8px;" v-if="percentage === 100">成绩单生成成功</span>
      <span style="font-size: 12px;margin-top: 8px;color: #ababab" v-if="percentage === 100">
        即将开始下载（ {{ countdownNumber }} ）
      </span>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useExamResultDetailStore } from "../../stores/ExamResultDetailStore.ts";
import { getCookie } from "../../utils/cookie.ts";
import { ElMessage } from "element-plus";
import { Exam, ExamResult, Common } from "../../api"
import router from "../../router";
import { SearchCheck, Search, CloudDownload, FileSymlink } from "lucide-vue-next";
import moment from "moment";

// 获取登录用户ID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 查询条件
const queryInfo = reactive({
  title: null,
  is_deleted: false,
  is_published: true,
  created_user: userId,
  current_time: moment().format('YYYY-MM-DD HH:mm:ss')
})

// 存储表格数据
const tableData: any = ref([{}])
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

// 获取考试表格数据
const getExamsTableData = () => {
  Exam.getExamsApi(queryInfo, currentPage.value, pageSize.value).then(response => {
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
  getExamsTableData()
})

// 从Store中获取，getExamInfo方法，用来获取考试信息
const examResultDetail = useExamResultDetailStore()
const { setExamInfo } = examResultDetail

// 处理查看考试成绩单详情的页面跳转
const goViewDetail = (item: any) => {
  setExamInfo(item, '/examResult')
  router.replace('/examResultDetail')
}

// 下载百分比
const percentage = ref(0)
// 下载状态
const percentageStatus = ref(null)
// 倒计时最大时长
const countdownNumber = ref(0)
// 控制下载Dialog是否可见
const downloadDialogVisible = ref(false)

// 下载倒计时计数器
const startCountdown = (duration) => {
  return new Promise(resolve => {
    countdownNumber.value = duration;

    const timer = setInterval(() => {
      countdownNumber.value -= 1;

      if (countdownNumber.value <= 0) {
        clearInterval(timer);
        downloadDialogVisible.value = false;
        resolve();
      }
    }, 1000);
  })
};

// 处理成绩单下载
const handleDownload = async (id: string) => {
  try {
    const response = await Common.downloadResultFileApi(`${id}.xlsx`)
    // 处理下载的文件
    const url = window.URL.createObjectURL(new Blob([response.data], {type: "application/xlsx"}))
    const link = document.createElement('a')
    link.href = url
    // 设置下载文件的文件名
    link.setAttribute('download', '成绩单.xlsx')
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载文件失败！', error)
  }
}

// 打开下载Dialog
const openDownloadDialog = (rowInfo: any) => {
  downloadDialogVisible.value = true
  ExamResult.generateExamResultExcelApi(rowInfo['id']).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    }
    percentage.value = 100
    percentageStatus.value = 'success'
    startCountdown(3).then(() => {
      handleDownload(rowInfo['id'])
    })
  })
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.exam-result-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.exam-result-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}

.exam-result-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>