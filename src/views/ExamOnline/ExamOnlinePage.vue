<template>
  <div class="exam-online-main-box">
    <div class="common-module-header-box">
      <el-icon >
        <MonitorCheck />
      </el-icon>
      <span style="margin-left: 10px">在线考试</span>
    </div>
    <div class="exam-online-tips-box">
      <el-icon style="margin-left: 20px;color: #0077e5;font-size: 15px"><CircleAlert /></el-icon>
      <span style="margin-left: 8px;letter-spacing: 1px">
        温馨提示：中途离开（包含且不限于切换菜单、刷新页面操作）都将被视为提交试卷，请谨慎操作!
      </span>
    </div>
    <div class="exam-online-operation-area">
      <div class="exam-online-questions-box">
        <h2>高中物理第一次测验</h2>
        <span>共6道题，祝大家好运</span>
        <div class="exam-online-paper-module-box" v-for="item in paperModuleQuestion">
          <div class="module-info-box">
            <span>{{ item.title }}（{{ item.description }}）</span>
          </div>
          <div class="paper-case-list-new" v-for="(question, index) in item['questions']">
            <span>{{ index + 1 }}. {{ question['question_detail']['topic'] }}（ {{ question['marks'] }}分 ）</span>
            <el-radio-group style="margin-top: 20px"
                            v-if="question['question_detail']['type'] === 'judge'"
                            v-model="answers[question['question_detail']['id']]">
              <el-radio value="T">对</el-radio>
              <el-radio value="F">错</el-radio>
            </el-radio-group>
            <el-radio-group v-else style="margin-top: 20px" v-model="answers[question['question_detail']['id']]">
              <el-radio :value="key" v-for="key in Object.keys(question['question_detail']['options'])">
                {{ key }}. {{ question['question_detail']['options'][key] }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="end-line-style" v-if="paperModuleQuestion.length !== 0">
          <span>----- 我是底线 -----</span>
        </div>
      </div>
      <div class="exam-online-other-box">
        <span class="exam-online-count-down-wording">距离考试结束还剩</span>
        <span class="exam-online-count-down">{{ countDown }}</span>
        <el-divider/>
        <div class="exam-online-overview-box">
          <div
              :class="answers[item] !== null ? 'overview-item-done' : 'overview-item-hang'"
              v-for="(item, index) in Object.keys(answers)">
            {{ index + 1 }}
          </div>
        </div>
        <div class="exam-online-submit-button">
          <el-button type="primary" style="width: 100%" :icon="Check" @click="handleSubmit">提 交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { Paper, Exam, ExamResult} from "../../api"
import { onMounted, ref, onBeforeUnmount, watch } from 'vue'
import { MonitorCheck, CircleAlert, Check } from "lucide-vue-next";
import { ElMessage } from "element-plus";
import router from "../../router";
import { useRoute } from 'vue-router'
import { useExamOnlineCallbackStore } from '../../stores/ExamOnlineCallbackStore.ts'
import {storeToRefs} from "pinia";

// 存储考试结束时间
const examDetail = ref({})

// 查询考试详情
const getExamDetail = () => {
  const id = localStorage.getItem('EXAM_ONLINE_EXAM')
  Exam.getExamDetailByIdApi(id).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      examDetail.value = response.data
    }
  })
}

// 存储答案
const answers = ref({})

// 试卷信息，渲染页面
const paperModuleQuestion: any = ref([])

// 获取完整试卷信息
const getCompletePaperInfo = () => {
  Paper.getCompletePaperApi(examDetail.value.paper_id).then((response: any) => {
    if (response.code !== 200) {
      ElMessage.error(response.message)
      return
    }
    const tempAnswers: any = {}
    // 处理试题选项
    response.data.forEach((item: any) => {
      item.questions.forEach((element: any) => {
        if (element.question_detail.options !== 'T&F') {
          element.question_detail.options = JSON.parse(element.question_detail.options)
        }
        tempAnswers[element['question_detail']['id']] = null
      })
    })
    paperModuleQuestion.value = response.data
    // 初始化答案信息
    answers.value = tempAnswers
  })
}

// 初始化计时器
let timer = null;
// 倒计时显示
const countDown = ref("")
// 计算倒计时
const calculateTimeLeft = () => {
  // 获取当前时间
  const now = new Date();
  const targetTime = moment(examDetail.value.end_time, 'YYYY-MM-DD HH:mm:ss')
  // 计算差值
  let diff = targetTime - now
  // 判断是否已经结束
  if (diff < 0) {
    console.log('------👉 倒计时结束 👈------')
    clearInterval(timer)
    // 倒计时结束，跳转到在线考试引导页
    router.replace('/examOnline')
    return
  }
  const hours = Math.floor(diff / 1000 / 60 / 60);  // 小时
  diff -= hours * 1000 * 60 * 60
  const minutes = Math.floor(diff / 1000 / 60)  // 分钟
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000)  // 秒
  // 确保格式化输出：例如 01 : 05 : 09
  countDown.value = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
}

// 启动倒计时
const startCountdown = () => {
  calculateTimeLeft()  // 初次计算
  timer = setInterval(calculateTimeLeft, 1000)  // 每秒更新一次
};

onMounted(() => {
  getExamDetail()
  // 确保倒计时和获取试卷在 examDetail 数据加载完之后再启动
  watch(() => examDetail.value, (newVal) => {
    getCompletePaperInfo()  // 获取试卷
    if (newVal && newVal.end_time) {
      startCountdown()  // 启动倒计时
    }
  });
})

onBeforeUnmount(() => {
  localStorage.removeItem('EXAM_ONLINE_EXAM')
  clearInterval(timer)
})

const route = useRoute()

const examEndCallback = useExamOnlineCallbackStore()
const { scoreInfo } = storeToRefs(examEndCallback)
const { changeDialogVisible } = examEndCallback

// 处理交卷
const handleSubmit = () => {
  ElMessageBox.confirm(
      '您确定要交卷吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '我再看看',
        type: 'warning',
        center: true
      }
  ).then(() => {
    const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
    // 组装&提交数据
    const submitData = { exam_result_id: route.params.id, answers: { ...answers.value } }
    ExamResult.createExamResultDetailApi(submitData).then(res => {
      if (res.code !== 200) {
        ElMessage.error(res.msg)
        return
      }
      // 更新考试结果数据（考试结束时间）
      ExamResult.updateExamResultApi(
          route.params.id, { end_time: endTime, result_mark: res.data.result_total_mark}
      ).then(response => {
        if (response.code !== 200) {
          ElMessage.error(response.msg)
          return
        }
        ElMessage.success('提交成功！')
        // 构建考试结果相关数据，作为回调数据
        scoreInfo.value = {
          score: res.data.result_total_mark,
          actual_total: res.data.sum_marks,
          pass_mark: res.data.pass_mark,
          percentage: res.data.percentage,
          start_time: response.data.start_time,
          end_time: response.data.end_time
        }
        router.replace('/examOnline')
        changeDialogVisible()
      })
    })
  }).catch(() => {
    ElMessage.info('取消交卷')
  })
}
</script>

<style scoped lang="scss">
$borderRadius: 4px;

.exam-online-tips-box {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  background-color: #9fceff;
  border-radius: $borderRadius;
  color: #454545;
  font-size: 13px;
}

.exam-online-operation-area {
  width: 100%;
  height: calc(100vh - 200px);
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.exam-online-questions-box {
  width: calc(100% - 320px);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  padding-bottom: 10px;

  .end-line-style {
    width: 100%;
    display: flex;
    margin-top: 20px;
    justify-content: center;
    font-size: 13px;
    color: #a4a4a4
  }
}

.exam-online-paper-module-box {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .module-info-box {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    background: #606060;
    color: #fff;
    font-size: 13px;
  }

  .paper-case-list-new {
    width: 90%;
    min-height: 70px;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 8px rgba(154, 154, 154, 0.5);
    border-radius: $borderRadius;
    color: #5e5e5e;
    padding: 20px 30px;
  }
}

.exam-online-other-box {
  width: 280px;
  height: 100%;
  display: flex;
  padding: 0 10px;
  flex-direction: column;
  align-items: center;
  background-color: rgba(239, 239, 239, 0.8);
  border-radius: $borderRadius;
  backdrop-filter: blur(10px);
  color: #5e5e5e;

  .exam-online-count-down-wording {
    font-size: 18px;
    margin-top: 20px
  }

  .exam-online-count-down {
    font-size: 20px;
    margin-top: 10px;
    letter-spacing: 1px
  }

  .exam-online-submit-button {
    width: 95%;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .exam-online-overview-box {
    width: 100%;
    max-height: calc(100% - 200px);
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;

    .overview-item-hang {
      width: 22px;
      height: 22px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 2px solid #606060;
      margin: 5px 5px
    }

    .overview-item-done {
      width: 25px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background-color: #41b883;
      color: white;
      margin: 5px 5px
    }
  }
}
</style>
