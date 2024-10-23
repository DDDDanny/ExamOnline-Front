<template>
  <div class="homepage-main-box">
    <div class="homepage-left-box">
      <div class="homepage-login-info-box">
        <span class="homepage-login-info-zh">{{ homePageLoginWording }}</span>
        <span style="font-size: 15px">
          May each day bring you closer to your dreams and fill your life with beautiful moments.
        </span>
      </div>
      <div class="homepage-left-main-box" style="padding-bottom: 0">
        <div class="homepage-card-title">
          <el-icon color="#66b1ff"><BookOpenCheck /></el-icon>
          <span>考试信息</span>
        </div>
        <el-divider style="margin-top: 8px" />
        <el-calendar class="calendar-style">
          <template #date-cell="{ data }">
            <div style="display: flex;align-items: center;">
              <span>{{ data.day.split('-')[2] }}</span>
              <el-icon v-if="examDates.includes(data.day)" style="margin-left: 10px;" color="#ff4d36">
                <el-popover placement="top-start" title="考试列表" :width="250" trigger="hover">
                  <template #reference><Star /></template>
                  <div v-if="examInfo[data.day] && Object.keys(examInfo[data.day]).length !== 0">
                    <div v-for="(item, index) in examInfo[data.day]" :key="index" class="calendar-popover-content">
                      <span style="margin-bottom: 3px;">考试名称: {{ item.title }}</span>
                      <span>{{ item.start_time.split(' ')[1] }} - {{ item.end_time.split(' ')[1] }}</span>
                      <el-divider v-if="index + 1 !== examInfo[data.day].length" style="margin: 8px 0"/>
                    </div>
                  </div>
                </el-popover>
              </el-icon>
            </div>
          </template>
        </el-calendar>
      </div>
    </div>
<!--    <div class="homepage-right-box" v-if="role === 'Student'">-->
<!--      <div class="homepage-card-title">-->
<!--        <el-icon color="#66b1ff"><Notebook /></el-icon>-->
<!--        <span>错题信息</span>-->
<!--      </div>-->
<!--      <el-divider style="margin-top: 8px" />-->
<!--    </div>-->
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import {onMounted, ref} from 'vue'
import {BookOpenCheck, Notebook, Star} from 'lucide-vue-next'
import {getCookie} from "../../utils/cookie.ts";
import { HomePage } from "../../api"
import { ElMessage } from "element-plus";

// 获取当前日期
const currentDate = moment().format('YYYY-MM-DD');
// 获取当前登录人姓名
const userInfo = getCookie('UserInfo') ? JSON.parse(getCookie('UserInfo')) : {}

// 角色信息
const role = localStorage.getItem('ROLE')

// 首页登录信息展示
const homePageLoginWording = ref('')

// 存储存在考试安排的日期
const examDates: any = ref([])

// 存储每天具体考试内容
const examInfo: any = ref({})

// 获取考试信息
const getExamInfo = () => {
  HomePage.getExamStatisticsApi(role, userInfo.userId).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      if (role === 'Student') {
        homePageLoginWording.value = `欢迎 ${userInfo.username} 登录！今天是 ${currentDate}，您有 ${response.data.count} 场考试需要参加！`
      } else {
        homePageLoginWording.value = `欢迎 ${userInfo.username} 登录！今天是 ${currentDate}，您安排了 ${response.data.count} 场考试！`
      }
      examDates.value = response.data.exam_dates
      examInfo.value = response.data.exam_info
    }
  })
}

onMounted(() => {
  getExamInfo()
})

</script>

<style scoped lang="scss">
@import '../../style.scss';

.homepage-main-box {
  @include baseFlexStyle;
}
.homepage-left-box {
  @include baseFlexStyle {
    flex-direction: column;
  }

  .homepage-login-info-box {
    height: 120px;
    box-shadow: 0 0 8px rgba(136, 136, 136, 0.5);
    border-radius: 8px;
    margin-bottom: 30px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #3E3E3E;
    .homepage-login-info-zh {
      font-size: 18px;
      letter-spacing: 2px;
      margin-bottom: 8px
    }
  }
  .homepage-left-main-box {
    height: calc(100vh - 300px);
    box-shadow: 0 0 8px rgba(136, 136, 136, 0.5);
    border-radius: 8px;
    padding: 20px;
  }
}
.homepage-right-box {
  width: 500px;
  height: calc(100% - 52px);
  box-shadow: 0 0 8px rgba(136, 136, 136, 0.5);
  border-radius: 8px;
  margin-left: 30px;
  padding: 20px;
}
.homepage-card-title {
  margin-left: 10px;
  display: flex;
  align-items: center;
  span {
    margin-left: 8px;
    color: #3E3E3E
  }
}

.calendar-popover-content {
  font-size: 13px;
  display: flex;
  flex-direction: column;
}

:deep(.calendar-style .el-calendar-table .el-calendar-day) {
  height: calc((100vh - 520px) / 6);
  padding: 0 8px;
}

:deep(.calendar-style .el-calendar-table) {
  padding-bottom: 0;
}

:deep(.calendar-style .el-calendar__body) {
  padding-bottom: 0;
}
</style>
