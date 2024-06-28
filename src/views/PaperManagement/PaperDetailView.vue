<template>
  <div class="exam-result-detail-main">
    <el-page-header class="page-header-wording" @back="goBack" :icon="ChevronLeft">
      <template #content>
        <span class="page-header-wording">{{ paperInfo['title'] }}试卷预览</span>
      </template>
    </el-page-header>
    <el-divider style="margin: 15px 0"/>
    <div class="case-list-main">
      <div id="paperTitle" class="paper-title-info">
        <span style="font-size: 25px;font-weight: bolder;">{{ paperInfo['title'] }}</span>
        <span style="font-size: 18px;color: #5e5e5e;margin-top: 15px">{{ paperInfo['description'] }}</span>
      </div>
      <div v-if="paperModuleQuestion.length === 0" style="display: flex;width:98%;justify-content: center;margin-top: 50px">
        <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
      </div>
      <div v-else class="paper-module-box" v-for="(item) in paperModuleQuestion ">
        <div class="module-info-box">
          <span>{{ item['title'] }}（{{ item['description'] }}）</span>
        </div>
        <div v-if="item['questions'].length === 0">
          <el-image style="width: 250px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        </div>
        <div v-else class="paper-case-list" v-for="(question, index) in item['questions']">
          <span>{{ index + 1 }}. {{ question['question_detail']['topic'] }}（ {{ question['marks'] }}分 ）</span>
          <el-radio-group v-if="question['question_detail']['type'] === 'judge'" style="margin-top: 20px" >
            <el-radio :value="true">对</el-radio>
            <el-radio :value="false">错</el-radio>
          </el-radio-group>
          <el-radio-group v-else style="margin-top: 20px" >
            <el-radio v-for="key in Object.keys(question['question_detail']['options'])" :value="key">
              {{ key }}. {{ question['question_detail']['options'][key] }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="end-line-style" v-if="paperModuleQuestion.length !== 0">
        <span>----- 我是底线 -----</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Paper } from "../../api"
import { storeToRefs } from 'pinia'
import { usePaperViewStore } from "../../stores/PaperViewStore.ts";
import { ChevronLeft } from "lucide-vue-next";
import router from "../../router";
import { ElMessage } from "element-plus";

// 从Store中获取考试信息
const paperView = usePaperViewStore()
const { paperInfo, sourceUrl } = storeToRefs(paperView)
paperView.getPaperInfo()

// 存储试卷模块试题信息
const paperModuleQuestion: any = ref([])

// 获取完整试卷信息
const getCompletePaperInfo = () => {
  Paper.getCompletePaperApi(paperInfo.value['id']).then((response: any) => {
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

onMounted(() => {
  getCompletePaperInfo()
})

// 处理页面返回
const goBack = () => {
  router.replace(sourceUrl.value)
}

</script>

<style scoped lang="scss">
@import "../../style.scss";

.exam-result-detail-main {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.page-header-wording {
  color:#5e5e5e;
  font-size: 14px;
}

.case-list-main {
  width: 100%;
  height: calc(100vh - 180px);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.paper-title-info {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.paper-case-list {
  width: 94%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: 0 0 8px rgba(154, 154, 154, 0.5);
  border-radius: 10px;
  padding: 20px 30px;
  color: #5e5e5e;
}

.paper-module-box {
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
    background: #0077e5;
    color: #fff;
    font-size: 13px;
  }
}
.end-line-style {
  width: 100%;
  display: flex;
  margin-top: 20px;
  justify-content: center;
  font-size: 13px;
  color: #a4a4a4
}
</style>
