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
        <div class="content-status" style="display: none;">
          <el-image style="width: 120px;opacity: 0.8" src="src/images/NoExam.png" fit="cover"/>
          <span style="color: #84bbf4">您目前没有已经开始的考试</span>
        </div>
        <div class="content-status" >
          <span style="margin: auto;font-size: 25px">《xxx上半学期期末考试》</span>
          <span style="margin-top: 20px;margin-bottom: 20px;font-size: 20px">考试已经开始，距离考试结束还有: 01:01:30</span>
          <el-button type="primary" :icon="Highlighter" style="width: 350px" @click="handleStartExam">进 入 考 试</el-button>
        </div>
      </div>
      <el-divider content-position="left">
        <div style="display: flex;align-items: center;color: #5e5e5e;font-size: 13px;font-weight: 400;">
          <el-icon><FileClock/></el-icon>
          <span style="margin-left: 6px">考试列表</span>
        </div>
      </el-divider>
      <div class="exam-list-box">
        <div style="width: 100%;display: none;justify-content: center;">
          <el-image style="width: 300px;opacity: 0.6" src="src/images/noData.png" fit="cover"/>
        </div>
        <div class="exam-list-item" v-for="item in examWaitingList" :key="item.id">
          <div class="exam-list-item-icon">
            <el-image style="width: 40px;height: 40px;" src="src/images/ExamCardIcon.png" fit="cover"/>
          </div>
          <div class="exam-list-item-wording">
            <span class="wording-title">考试标题：</span>
            <span class="wording-content" style="margin-bottom: 9px">{{ item.title }}</span>
            <span class="wording-title">开始时间：</span>
            <span class="wording-content" >{{ item.start_time }}</span>
            <span class="wording-title">结束时间：</span>
            <span>{{ item.end_time }}</span>
          </div>
          <div :class="'exam-list-item-btn ' + item.btn_style_cls" >
            <el-icon><Highlighter/></el-icon>
            <span style="margin-left: 5px">{{ item.is_start ? '进入考试' : '考试尚未开始' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExamOnline } from "../../api";
import { SwatchBook, FileClock, Highlighter } from "lucide-vue-next";
import {getCookie} from "../../utils/cookie.ts";
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue";

// 获取登录人信息
const userInfo = getCookie('UserInfo') ? JSON.parse(getCookie('UserInfo')) : {}

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
        btn_style_cls: item['is_start'] ? 'exam-btn-state-go' : 'exam-btn-state-wait'
      })
    })
    examWaitingList.value = tempData
  })
}

onMounted(() => {
  getExamsByStudentId()
})

// 处理开始考试事件
const handleStartExam = () => {
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
    ElMessage.success('开始考试！祝你好运！')
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
