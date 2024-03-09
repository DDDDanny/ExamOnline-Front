<template>
  <div class="homepage-main-box">
    <div class="homepage-left-box">
      <div class="homepage-login-info-box">
        <span class="homepage-login-info-zh">
          欢迎 xxx 登录！今天是{{ currentDate }}，今天您有x场考试需要参加！
        </span>
        <span style="font-size: 15px">
          Welcome xxx to log in! Today is {{ currentDate }}. You have x exams to take today!
        </span>
      </div>
      <div class="homepage-left-main-box">
        <div class="homepage-card-title">
          <el-icon color="#66b1ff"><BookOpenCheck /></el-icon>
          <span>考试信息</span>
        </div>
        <el-divider style="margin-top: 8px" />
      </div>
    </div>
    <div class="homepage-right-box">
      <div class="homepage-card-title">
        <el-icon color="#66b1ff"><Notebook /></el-icon>
        <span>错题信息</span>
      </div>
      <el-divider style="margin-top: 8px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import {BookOpenCheck, Notebook} from 'lucide-vue-next'

// 获取当前日期
const currentDate = moment().format('YYYY-MM-DD');

</script>

<style scoped lang="scss">
.homepage-main-box {
  width: 100%;
  height: 100%;
  display: flex;
}
.homepage-left-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
    height: 100%;
    box-shadow: 0 0 8px rgba(136, 136, 136, 0.5);
    border-radius: 8px;
    padding: 20px;
  }
}
.homepage-right-box {
  width: 500px;
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
</style>