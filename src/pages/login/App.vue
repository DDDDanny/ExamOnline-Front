<template>
  <el-config-provider :locale="zhCn">
    <div id="app">
      <div class="login-main-box">
        <div class="login-left-box">Part One</div>
        <div class="login-right-box">
          <div class="login-right-common login-right-logo-box">
            <div class="logo-content">
              <el-image style="width: 70px; " src="src/images/ExamOnlineLogo.svg" fit="cover" />
              <div style="display: flex;flex-direction: column">
                <span class="logo-wording-item">在线考试系统</span>
                <span class="logo-wording-item-en">ExamOnline</span>
              </div>
            </div>
          </div>
          <div class="login-right-common login-right-form-box">
            <span class="form-title-wording">欢迎登录</span>
            <div class="login-select-role-group" >
              <div class="select-role-item">学生</div>
              <div class="select-role-item" style="padding-left:17px;">教师</div>
            </div>
          </div>
          <div class="login-right-common login-right-end"></div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<style scoped lang="scss">
.login-main-box {
  width: 100%;
  height: 100vh;
  display: flex;
}
.login-left-box {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
}
.login-right-box {
  width: 35%;
  min-width: 580px;
  flex: 0 0 auto;
  background-color: #c5dcd5;
  display: flex;
  flex-direction: column;
  padding: 0 50px;
  .login-right-common {
    width: 100%;
  }
}
.login-right-logo-box {
  display: flex;
  flex: 2 1 auto;
  position: relative;
  flex-direction: column;
  &::before {
    height: 80px;
    display: block;
    content: "";
  }
  &::after {
    flex: 2 1 auto;
    display: block;
    content: "";
  }
  .logo-content {
    display: flex;
    align-items: center;
    .logo-wording-item {
      font-size: 20px;
      color: #3E3E3E;
      letter-spacing: 2px;
    }
    .logo-wording-item-en {
      font-size: 13px;
      color: #3E3E3E;
      letter-spacing: 2px;
    }
  }
}
.login-right-form-box {
  height: 550px;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  .form-title-wording {
    font-size: 18px;
    color: #2F725D;
    letter-spacing: 3px;
    font-weight: bolder
  }
  .login-select-role-group {
    display: flex;
    margin-top: 24px;
    letter-spacing: 3px;
    .select-role-item {
      color: #3E3E3E;
      font-size: 18px;
      padding: 0 15px 13px 15px;
    }
  }
}
.login-right-end {
  flex: 3 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
