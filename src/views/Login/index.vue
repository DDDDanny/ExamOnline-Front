<template>
  <div class="main">
    <div class="login-main-box">
      <div class="login-left-box">
        <el-carousel height="calc(100vh - 200px)" style="width: 100%; ">
          <el-carousel-item v-for="item in carouseGroup" :key="item.id">
            <div class="carousel-item-box">
              <div class="carousel-item-desc-box">
                <span class="carousel-item-desc-title">{{ item.title }}</span>
                <span class="carousel-item-desc-content">{{ item.content }}</span>
              </div>
              <el-image style="width: 60%; " :src="item.imagePath" fit="cover" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="login-right-box">
        <div class="login-right-common login-right-logo-box">
          <div class="logo-content">
            <el-image style="width: 70px; " src="src/images/ExamOnlineLogo.png" fit="cover" />
            <div style="display: flex;flex-direction: column;margin-left: 5px">
              <span class="logo-wording-item">在线考试系统</span>
              <span class="logo-wording-item-en">ExamOnline</span>
            </div>
          </div>
        </div>
        <div class="login-right-common login-right-form-box">
          <span class="form-title-wording">欢迎登录</span>
          <div class="login-select-role-group" v-if="!isAdministrator">
            <div class="select-role-item select-active-item" @click="handleActiveStudent">学生</div>
            <div class="select-role-item" style="padding-left:20px;" @click="handleActiveTeacher">教师</div>
          </div>
          <div class="login-select-role-group" v-else>
            <div class="select-role-item select-active-item">管理员</div>
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
              <el-form-item>
                <el-checkbox v-model="formLogin.rememberPass">记住密码</el-checkbox>
              </el-form-item>
            </el-form>
            <el-button type="primary" style="width: 100%;margin-top: 15px;" size="large" @click="handleLogin">
              <LogIn class="common-btn-icon-style"/>
              登 录
            </el-button>
          </div>
        </div>
        <div class="login-right-common login-right-end"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { router } from '../../router'
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { UserLogin } from "../../api/index.ts";
import { LockKeyhole, UserRound, LogIn } from 'lucide-vue-next';
import {setCookie} from "../../utils/cookie.ts";

// 从当前路由获取是否为管理员登录标志
const isAdministrator = router.currentRoute.value.query?.admin

// 轮播图信息组
const carouseGroup = [
  {
    id: 0,
    imagePath: 'src/images/CarouselImg1.png',
    title: '灵活性与便利性',
    content: '在线考试系统允许学生根据自己的时间表和地点参加考试，' +
        '不再受限于特定的考试时间和地点。这种灵活性使得学生可以根据自己的学习进度和个人时间安排进行考试，增加了便利性和可及性。'
  },
  {
    id: 1,
    imagePath: 'src/images/CarouselImg2.png',
    title: '自动化和即时反馈',
    content: '在线考试系统可以自动评分并提供即时反馈，减少了教师在评分和反馈方面的工作量，同时使学生能够立即了解他们的成绩和表现。' +
        '这种即时反馈对于学生改进学习策略和弥补知识漏洞非常重要。'
  },
  {
    id: 2,
    imagePath: 'src/images/CarouselImg3.png',
    title: '数据统计和分析功能',
    content: '在线考试系统具有强大的数据统计和分析功能，能够收集和分析大量的考试数据，包括学生的答题情况、得分分布、常见错误模式等。' +
        '通过这些数据，教师和教育管理者可以深入了解学生的学习情况和考试表现，发现学生的学习需求和问题，从而采取针对性的教学和干预措施。'
  }
]

// 登录信息Form表单
const formLogin = reactive({
  username: '',
  password: '',
  rememberPass: false,
  isAdmin: false,  // 标志是否为管理员
})

const loginRole = ref('Student')

// 处理记住密码时的数据回写
const handleRemember = () => {
  if (!isAdministrator) {
    formLogin.isAdmin = false
    const { ROLE, LOGIN_INFO } = localStorage; // 解构出 localStorage 对象中的 ROLE 和 LOGIN_INFO 属性
    if (ROLE && LOGIN_INFO) { // 如果 ROLE 和 LOGIN_INFO 存在
      const role = ROLE; // 读取 ROLE
      const loginInfo = JSON.parse(LOGIN_INFO); // 解析 LOGIN_INFO 字符串为对象
      if (role === 'Student') {
        handleActiveStudent();
      } else {
        handleActiveTeacher();
      }
      Object.assign(formLogin, loginInfo); // 将解析后的登录信息合并到 formLogin 对象中
    }
  } else {
    loginRole.value = 'Admin';
    formLogin.isAdmin = true
  }
};

onMounted(() => {
  handleRemember()
})

// 处理激活的登录角色
const handleActiveRole = (index: any) => {
  if (!isAdministrator) {
    const roleItems = document.getElementsByClassName('select-role-item');
    const activeItemClass = 'select-active-item';
    // 添加 select-active-item 类到指定索引的元素
    roleItems[index].classList.add(activeItemClass);
    // 移除 select-active-item 类从另一个元素
    const otherIndex = index === 0 ? 1 : 0;
    roleItems[otherIndex].classList.remove(activeItemClass);
  }
};

// 处理学生角色
const handleActiveStudent = () => {
  handleActiveRole(0); // 角色类型索引为 0 表示学生
  loginRole.value = 'Student'
};

// 处理老师角色
const handleActiveTeacher = () => {
  handleActiveRole(1); // 角色类型索引为 1 表示老师
  loginRole.value = 'Teacher'
};

// 处理登录
const handleLogin = () => {
  // 根据用户选择的角色确定调用的登录函数
  const loginFunction = loginRole.value === 'Student' ? UserLogin.studentLoginApi : UserLogin.teacherLoginApi;

  // 调用相应的登录函数
  loginFunction(formLogin).then(response => {
    // 如果返回的响应状态码不是200，则显示错误信息并结束函数
    if (response.code !== 200) {
      ElMessage.error(response.msg);
      return;
    }
    // 显示登录成功的消息
    ElMessage.success('登录成功');
    // 存储Access Token
    localStorage.setItem('TOKEN', response.data['access'])
    // 存储角色信息
    localStorage.setItem('ROLE', loginRole.value);
    // 存储登录信息（登录人的姓名）
    const userInfo = { userId: response.data['userId'], username: response.data['name'] }
    setCookie('UserInfo', JSON.stringify(userInfo))
    // 如果用户选择了记住密码，则将登录信息存储到localStorage中，否则清除localStorage中的登录信息
    if (formLogin.rememberPass) {
      localStorage.setItem('LOGIN_INFO', JSON.stringify(formLogin));
    } else {
      localStorage.removeItem('LOGIN_INFO');
    }
    router.replace('/homepage')
  });
};

</script>

<style scoped lang="scss">
@import "../../style.scss";

.login-main-box {
  width: 100%;
  height: 100vh;
  display: flex;
}
.login-left-box {
  @include baseFlexStyle {
    background-color: #fff;
    align-items: center;
  }
  .carousel-item-box {
    @include baseFlexStyle {
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
    .carousel-item-desc-box {
      width: 80%;
      display: flex;
      color: #3E3E3E;
      flex-direction: column;
      letter-spacing: 3px;
      .carousel-item-desc-title {
        font-size: 36px;
        margin-bottom: 8px;
      }
      .carousel-item-desc-content {
        font-size: 18px;
      }
    }
  }
}
.login-right-box {
  width: 35%;
  min-width: 580px;
  flex: 0 0 auto;
  background-color: #d9ecff;
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
    color: #337ecc;
    letter-spacing: 3px;
    font-weight: bolder
  }
  .login-select-role-group {
    display: flex;
    margin-top: 28px;
    letter-spacing: 3px;
    .select-role-item {
      color: #3E3E3E;
      font-size: 18px;
      padding: 0 18px 8px 18px;
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
    background: #79bbff;
    left: calc(50% - 27px);
    bottom: 0;
    border-radius: 4px;
  }
}
</style>
