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
              <el-radio :value="true">对</el-radio>
              <el-radio :value="false">错</el-radio>
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
        <span class="exam-online-count-down">00:00:00</span>
        <el-divider/>
        <div class="exam-online-overview-box">
          <div
              :class="answers[item] !== null ? 'overview-item-done' : 'overview-item-hang'"
              v-for="(item, index) in Object.keys(answers)">
            {{ index + 1 }}
          </div>
        </div>
        <div class="exam-online-submit-button">
          <el-button type="primary" style="width: 100%">提 交</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { Paper } from "../../api"
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { MonitorCheck, CircleAlert } from "lucide-vue-next";

// 存储答案
const answers = ref({})

// 试卷信息，渲染页面
const paperModuleQuestion: any = ref([])

// 获取完整试卷信息
const getCompletePaperInfo = () => {
  Paper.getCompletePaperApi(localStorage.getItem('EXAM_ONLINE_PAPER')).then((response: any) => {
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

onMounted(() => {
  getCompletePaperInfo()
})

onBeforeUnmount(() => {
  localStorage.removeItem('EXAM_ONLINE_PAPER')
})
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
