<template>
  <div class="exam-online-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <SwatchBook />
      </el-icon>
      <span style="margin-left: 10px">在线考试引导页</span>
    </div>
    <div class="exam-online-info-box">
      <div>
      </div>
      <div class="newest-exam-info">
        <div class="content-status" v-if="Object.keys(firstStartExam).length <= 0">
          <el-image style="width: 120px;opacity: 0.8" src="/src/images/NoExam.png" fit="cover"/>
          <span style="color: #84bbf4">您目前没有已经开始的考试</span>
        </div>
        <div class="content-status" v-else>
          <span style="margin: auto;font-size: 25px">《 {{ firstStartExam['title'] }} 》</span>
          <span style="margin-top: 20px;margin-bottom: 20px;font-size: 20px">考试已经开始，距离考试结束还有: {{ timeLeft }}</span>
          <el-button type="primary" :icon="Highlighter" style="width: 350px" @click="handleStartExam(firstStartExam)">进 入 考 试</el-button>
        </div>
      </div>
      <el-divider content-position="left">
        <div style="display: flex;align-items: center;color: #5e5e5e;font-size: 13px;font-weight: 400;">
          <el-icon><FileClock/></el-icon>
          <span style="margin-left: 6px">考试列表</span>
        </div>
      </el-divider>
      <div class="exam-list-box">
        <div style="width: 100%;display: flex;justify-content: center;" v-if="examWaitingList.length <= 0">
          <el-image style="width: 300px;opacity: 0.6" src="/src/images/noData.png" fit="cover"/>
        </div>
        <div class="exam-list-item"  v-else v-for="item in examWaitingList" :key="item.id">
          <div class="exam-list-item-icon">
            <el-image style="width: 40px;height: 40px;" src="/src/images/ExamCardIcon.png" fit="cover"/>
          </div>
          <div class="exam-list-item-wording">
            <span class="wording-title">考试标题：</span>
            <span class="wording-content" style="margin-bottom: 9px">{{ item.title }}</span>
            <span class="wording-title">开始时间：</span>
            <span class="wording-content" >{{ item.start_time }}</span>
            <span class="wording-title">结束时间：</span>
            <span>{{ item.end_time }}</span>
          </div>
          <div class="exam-list-item-btn exam-btn-state-go" v-if="item.is_start" @click="handleStartExam(item)">
            <el-icon><Highlighter/></el-icon>
            <span style="margin-left: 5px">进入考试</span>
          </div>
          <div class="exam-list-item-btn exam-btn-state-wait" v-else>
            <el-icon><Highlighter/></el-icon>
            <span style="margin-left: 5px">考试尚未开始</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { ExamOnline } from "../../api";
import { SwatchBook, FileClock, Highlighter } from "lucide-vue-next";
import {getCookie} from "../../utils/cookie.ts";
import {ElMessage} from "element-plus";
import {onMounted, ref, watch, onBeforeUnmount} from "vue";
import router from "../../router";

// 获取登录人信息
const userInfo = getCookie('UserInfo') ? JSON.parse(getCookie('UserInfo')) : {}

// 首个正在进行的考试
const firstStartExam = ref({})
// 待开始列表
const examWaitingList = ref([])

// 根据学生ID获取考试信息
const getExamsByStudentId = () => {
  ExamOnline.getExamsByStuIdApi(userInfo.userId).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    }
    const tempData: any = []
    response.data.map((item: any) => {
      tempData.push({
        id: item['id'],
        title: item['title'],
        start_time: item['start_time'],
        end_time: item['end_time'],
        is_start: item['is_start'],
        paper_id: item['paper_id']
      })
    })
    // 获取首个正在进行的考试
    if (tempData.length > 0 && tempData[0].is_start) {
      firstStartExam.value = tempData[0]
      tempData.shift()
    }
    examWaitingList.value = tempData
  })
}

// 初始化计时器
let timer = null;
// 倒计时显示
const timeLeft = ref("")
// 计算倒计时
const calculateTimeLeft = () => {
  // 获取当前时间
  const now = new Date();
  const targetTime = moment(firstStartExam.value.end_time, 'YYYY-MM-DD HH:mm:ss')
  // 计算差值
  let diff = targetTime - now
  // 判断是否已经结束
  if (diff < 0) {
    console.log('------👉 倒计时结束 👈------')
    clearInterval(timer)
    window.location.reload(); // 刷新页面
    return
  }
  const hours = Math.floor(diff / 1000 / 60 / 60);  // 小时
  diff -= hours * 1000 * 60 * 60
  const minutes = Math.floor(diff / 1000 / 60)  // 分钟
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000)  // 秒
  // 确保格式化输出：例如 01 : 05 : 09
  timeLeft.value = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
}

// 启动倒计时
const startCountdown = () => {
  calculateTimeLeft()  // 初次计算
  timer = setInterval(calculateTimeLeft, 1000)  // 每秒更新一次
};

onMounted(() => {
  getExamsByStudentId()
  // 确保倒计时在 firstStartExam 数据加载完之后再启动
  watch(() => firstStartExam.value, (newVal) => {
    if (newVal && newVal.end_time) {
      startCountdown()  // 启动倒计时
    }
  });
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

// 处理开始考试事件
const handleStartExam = (info: any) => {
  ElMessageBox.confirm(
      '您确定要开始考试吗？考试一旦开始后，无法暂停！',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }
  ).then(() => {
    // 获取考试记录ID
    ExamOnline.getStudentExamApi(info['id'], userInfo.userId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      } else {
        ElMessage.success('开始考试！祝你好运！')
        // 存储试卷ID，用户获取题目信息
        localStorage.setItem('EXAM_ONLINE_PAPER', info.paper_id)
        router.replace(`/examOnline/${response.data.id}`)
      }
    })

  }).catch(() => {
    ElMessage.info('取消开始考试')
  })
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.exam-online-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.exam-online-info-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.newest-exam-info {
  display: flex;
  flex-direction: column;
  margin: auto;
  align-content: center;
  color: #5e5e5e;

  .content-status {
    @include baseFlexStyle {
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}

.exam-list-box {
  width: 97%;
  height: 300px;
  display: flex;
  overflow-x: auto;
  padding: 10px;

  .exam-list-item {
    height: 260px;
    min-width: 220px;
    margin-right: 20px;
    box-shadow: #5e5e5e33 0 0 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    .exam-list-item-icon {
      width: 100%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .exam-list-item-wording {
      width: 100%;
      height: 150px;
      display: flex;
      margin-left: 20px;
      flex-direction: column;
      color: #5e5e5e;
      font-size: 14px;

      .wording-title {
        font-weight: bolder
      }

      .wording-content {
        width: 180px;
        margin-bottom: 8px;
        white-space: nowrap; /* 防止文字换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
      }
    }

    .exam-list-item-btn {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 14px;
      border-radius: 0 0 8px 8px;
    }

    .exam-btn-state-go {
      background-color: #409eff;
    }

    .exam-btn-state-go:hover {
      background-color: #64b1ff;
      cursor: pointer;
    }

    .exam-btn-state-wait {
      background-color: #818181;
    }


  }
}
</style>
