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
              <div class="select-role-item select-active-item" @click="handleActiveStudent">学生</div>
              <div class="select-role-item" style="padding-left:17px;" @click="handleActiveTeacher">教师</div>
            </div>
            <div style="width: 85%; margin-top: 20px;">
              <el-form label-position="top" label-width="auto" :model="formLogin">
                <el-form-item label="用户名">
                  <el-input v-model="formLogin.username" size="large">
                    <template #prefix>
                      <UserRound style="width: 16px"/>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="密码">
                  <el-input v-model="formLogin.password" show-password size="large">
                    <template #prefix>
                      <LockKeyhole style="width: 16px"/>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="login-right-common login-right-end"></div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { reactive } from "vue";
import { LockKeyhole, UserRound } from 'lucide-vue-next';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// 处理激活的登录角色
const handleActiveRole = (index) => {
  const roleItems = document.getElementsByClassName('select-role-item');
  const activeItemClass = 'select-active-item';
  // 添加 select-active-item 类到指定索引的元素
  roleItems[index].classList.add(activeItemClass);
  // 移除 select-active-item 类从另一个元素
  const otherIndex = index === 0 ? 1 : 0;
  roleItems[otherIndex].classList.remove(activeItemClass);
};

// 处理学生角色
const handleActiveStudent = () => {
  handleActiveRole(0); // 角色类型索引为 0 表示学生
};

// 处理老师角色
const handleActiveTeacher = () => {
  handleActiveRole(1); // 角色类型索引为 1 表示老师
};

// 登录信息Form表单
const formLogin = reactive({
  username: '',
  password: ''
})

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
      padding: 0 15px 8px 15px;
      position: relative;
      cursor: pointer;
    }
  }
}
.login-right-end {
  flex: 3 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.select-active-item {
  &::after {
    position: absolute;
    content: "";
    width: 50px;
    height: 3px;
    background: #2F725D;
    left: calc(50% - 27px);
    bottom: 0;
    border-radius: 4px;
  }
}
</style>
