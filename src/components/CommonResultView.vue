<template>
  <div class="common-result-view-main-main">
    <div id="paperTitle" class="common-result-view-paper-title">
      <span style="font-size: 25px;font-weight: bolder;">{{ props.paperInfo['title'] }}</span>
      <span style="font-size: 18px;color: #5e5e5e;margin-top: 15px">{{ props.paperInfo['description'] }}</span>
    </div>
    <div v-if="paperModuleQuestion.length === 0" class="common-result-view-module-empty">
      <el-image style="width: 300px;opacity: 0.8" src="/src/images/noData.png" fit="cover"/>
    </div>
    <div v-else class="common-result-view-module-box" v-for="(item) in paperModuleQuestion ">
      <div class="module-info-box">
        <span>{{ item['title'] }}（{{ item['description'] }}）</span>
      </div>
      <div v-if="item['questions'].length === 0">
        <el-image style="width: 250px;opacity: 0.8" src="/src/images/noData.png" fit="cover"/>
      </div>
      <div v-else class="common-result-view-case-list" :style="getIsTrue(question['question_id'])" v-for="(question, index) in item['questions']">
        <div style="width: 100%;display: flex;justify-content: space-between;align-items: center;">
          <span>{{ index + 1 }}. {{ question['question_detail']['topic'] }}（ {{ question['marks'] }}分 ）</span>
          <div v-if="props.isCollect">
            <el-tooltip class="box-item" effect="dark" content="取消收藏至错题集" placement="bottom" v-if="getCollectBtn(question['question_id'])">
              <el-button type="danger" :icon="Heart" circle size="small" />
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="收藏至错题集" placement="bottom" v-else>
              <el-button :icon="Heart" circle size="small" />
            </el-tooltip>
          </div>
        </div>
        <el-radio-group
            v-if="question['question_detail']['type'] === 'judge'"
            :model-value="getStudentAnswer(question['question_id'])"
            style="margin-top: 20px"
        >
          <el-radio value="T">对</el-radio>
          <el-radio value="F">错</el-radio>
        </el-radio-group>
        <el-radio-group v-else style="margin-top: 20px" :model-value="getStudentAnswer(question['question_id'])">
          <el-radio v-for="key in Object.keys(question['question_detail']['options'])" :value="key">
            {{ key }}. {{ question['question_detail']['options'][key] }}
          </el-radio>
        </el-radio-group>
        <el-divider/>
        <div style="width: auto;display: flex;align-items: center">
          <span style="font-size: 15px">参考答案：</span>
          <span style="font-size: 15px;display: flex;align-items: center"  v-if="question['question_detail']['type'] === 'judge'">
            <Check v-if="getReferenceAnswer(question['question_id']) == 'T'" style="height: 17px"/>
            <X v-else style="height: 17px"/>
          </span>
          <span style="font-size: 15px" v-else>{{ getReferenceAnswer(question['question_id']) }}</span>
        </div>
      </div>
    </div>
    <div class="common-result-view-end-line-style" v-if="paperModuleQuestion.length !== 0">
      <span>----- 我是底线 -----</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch} from "vue";
import { Paper } from "../api";
import { ElMessage } from "element-plus";
import { Check, X, Heart } from "lucide-vue-next";

const props = defineProps({
  paperInfo: { type: Object, required: true, default: () => ({}) },
  examResultAnswers: { type: Array, required: true },
  isCollect: { type: Boolean, required: true },
})

const paperModuleQuestion = ref([])

const getExamResultInfo = () => {
  // 获取试题模块信息
  Paper.getCompletePaperApi(props.paperInfo.id).then((response: any) => {
    if (response.code !== 200) {
      ElMessage.error(response.message)
      return
    }
    // 处理试题选项
    response.data.forEach((item: any) => {
      item.questions.forEach((element: any) => {
        if (element.question_detail.options !== 'T&F') {
          element.question_detail.options = JSON.parse(element.question_detail.options)
        }
      })
    })
    paperModuleQuestion.value = response.data
  })
}

// 获取答案
const getStudentAnswer = (q_id: string) => {
  return props.examResultAnswers?.find(item => item['question_id'] === q_id).solution
}

// 获取试题作答是否正确
const getIsTrue = (q_id: string) => {
  const isTrue = props.examResultAnswers?.find(item => item['question_id'] === q_id).is_true
  return !isTrue ? 'box-shadow: 0 0 8px #F56C6C;' : ''
}

// 获取参考答案
const getReferenceAnswer = (q_id: string) => {
  return props.examResultAnswers?.find(item => item['question_id'] === q_id).reference_answer
}

// 获取试题是否已经被收藏错题
const getCollectBtn = (q_id: string) => {
  return props.examResultAnswers?.find(item => item['question_id'] === q_id).is_error_archive
}

watch(() => props.paperInfo, (newValue) => {
  if (newValue && Object.keys(newValue).length > 0) {
    getExamResultInfo()
  }
}, { immediate: true })
</script>


<style scoped lang="scss">
.common-result-view-main-main {
  width: 100%;
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.common-result-view-paper-title {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.common-result-view-module-empty {
  width:98%;
  display: flex;
  justify-content: center;
  margin-top: 50px
}

.common-result-view-case-list {
  width: 90%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0 0 8px rgba(154, 154, 154, 0.5);
  border-radius: 10px;
  padding: 20px 30px;
  color: #5e5e5e;
}

.common-result-view-module-box {
  width: 98%;
  margin-top: 30px;
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
}
.common-result-view-end-line-style {
  width: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: center;
  font-size: 13px;
  color: #a4a4a4
}
</style>