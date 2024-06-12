<template>
  <div class="app-container-main">
    <div class="container-main-left-box">
      <div class="logo-box ">
        <el-image style="width: 35px;margin-right: 5px " src="src/images/ExamOnlineLogo.png" fit="cover" />
        <el-image style="width: 125px; " src="src/images/ExamOnline.png" fit="cover" />
      </div>
      <el-divider style="margin: 0;background: #79b0eb;width: 235px;border-color: #7ea4cd" />
      <el-menu
          unique-opened
          active-text-color="#ffd04b"
          background-color="#337ecc"
          style="height: 100%;"
          :default-active="activeMenuItem"
          text-color="#fff"
          router
      >
        <el-menu-item index="/homepage" style="margin-top: 20px">
          <el-icon style="margin-left: 10px"><LayoutTemplate /></el-icon>
          首页
        </el-menu-item>
        <template v-for="menuItem in menuInfo" :key="menuItem.id">
          <el-menu-item :index="menuItem.path" v-if="menuItem.child_menu.length === 0">
            <el-icon style="margin-left: 10px" >
              <component :is="menuIconEnum[menuItem.code]"/>
            </el-icon>
            {{ menuItem.name }}
          </el-menu-item>
          <el-sub-menu :index="menuItem.code" v-else>
            <template #title>
              <el-icon style="margin-left: 10px">
                <component :is="menuIconEnum[menuItem.code]"/>
              </el-icon>
              <span>{{ menuItem.name }}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in menuItem.child_menu">
              <el-icon style="margin-left: 10px">
                <component :is="menuIconEnum[item.code]"/>
              </el-icon>
              {{ item.name }}
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </div>
    <div class="container-main-right-box">
      <div class="container-top-box">
        <Bell class="header-item" style="margin-right: 30px;" />
        <el-popover placement="bottom" :width="180" trigger="hover">
          <template #reference>
            <el-icon size="25" class="header-item"><CircleUserRound /></el-icon>
          </template>
          <div style="width:100%;display: flex;flex-direction: column;align-items: center;">
            <span style="font-weight: bolder;font-size: 14px">{{ userName }}</span>
            <el-divider style="margin: 10px"/>
            <el-button link @click="changePwdDialogVisible = true">
              <el-icon size="18" style="margin-right: 18px"><Lock /></el-icon>
              修改密码
            </el-button>
            <el-divider style="margin: 10px"/>
            <el-button link @click="handleLogout">
              <el-icon size="18" style="margin-right: 18px"><LogOut/></el-icon>
              退出登录
            </el-button>
          </div>
        </el-popover>
      </div>
      <div class="container-main-content-box">
        <router-view/>
      </div>
    </div>
    <el-dialog v-model="changePwdDialogVisible" title="修改密码" width="500" center @close="handleClose(pwdFormRef)">
      <el-form :model="pwdFormData" ref="pwdFormRef">
        <el-form-item prop="old_password" required>
          <el-input v-model="pwdFormData.old_password" placeholder="请输入旧密码" clearable show-password/>
        </el-form-item>
        <el-form-item prop="new_password" required>
          <el-input v-model="pwdFormData.new_password" placeholder="请输入新密码" clearable show-password/>
        </el-form-item>
        <el-form-item prop="confirm_password" required>
          <el-input v-model="pwdFormData.confirm_password" placeholder="请再次输入新密码" clearable show-password/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="changePwdDialogVisible = false" :icon="Ban">取 消</el-button>
          <el-button type="primary" @click="handleSubmitChangePwd(pwdFormRef)" :icon="Send">提 交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Menu, UserLogin } from '../api';
import { router } from '../router'
import {onMounted, onBeforeMount, ref} from "vue";
import {
  BookMarked, Notebook, Files, FileCheck, FileTerminal,
  BookOpenCheck, Users, Laptop2, GraduationCap,
  CircleUserRound, Bell, LayoutTemplate, BookHeart,
  BookCheck, Lock, LogOut, Ban, Send, FileHeart
} from 'lucide-vue-next'
import {ElMessage} from "element-plus";
import {delCookie, getCookie} from "../utils/cookie.ts";
import type {FormInstance} from 'element-plus'

// 菜单对应的ICON
const menuIconEnum: any = {
  '10001': BookMarked, '10002': Notebook, '10003': Files,
  '10004': BookOpenCheck, '10005': FileCheck, '10006': GraduationCap,
  '10007': Users, '10008': Laptop2,
  '10001_1': BookHeart, '10001_2': BookCheck,
  '10003_1': FileHeart, '10003_2': FileTerminal,
}

// 获取用户姓名
const userName = JSON.parse(getCookie('UserInfo')).username

// 存放菜单信息
const menuInfo: any = ref([])

// 获取菜单信息
const getMenu = () => {
  const role: any = localStorage.getItem('ROLE')
  Menu.getMenuApi(role).then(response => {
    if (response.code !== 200) {
      ElMessage.error('获取菜单失败！')
      return
    }
    menuInfo.value = response.data.data
  })
}

// 激活的菜单项
const activeMenuItem = ref('/homepage')

// 确保页面刷新后，激活的菜单不变
onBeforeMount(() => {
  const currentUrl = window.location.href
  activeMenuItem.value = '/' + currentUrl.split('/')[3]
})

onMounted( () => {
  getMenu()
})

// 处理登出逻辑
const handleLogout = () => {
  delCookie()
  localStorage.removeItem('TOKEN')
  router.replace('/login')
}
// 控制修改密码Dialog是否显示
const changePwdDialogVisible = ref(false)
// 修改密码表单的Ref
const pwdFormRef = ref<FormInstance>()
// 修改密码Form Data
const pwdFormData = ref({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

// 处理关闭Dialog
const handleClose = (pwdFormRefEl: any) => {
  pwdFormRefEl.resetFields()
  changePwdDialogVisible.value = false
}

// 处理提交修改密码
const handleSubmitChangePwd = async (pwdFormRefEl: any) => {
  // 获取登录用户角色
  const role = localStorage.getItem('ROLE')
  // 获取登录用户信息
  const userInfo = getCookie('UserInfo')

  // 如果用户登录信息不存在，提示用户重新登录，并跳转到登录页面
  if (!role || !userInfo) {
    ElMessage.warning('用户登录信息不存在！请重新登录！')
    await router.push('/login')
    return
  }

  // 表单数据校验
  pwdFormRefEl.validate((result: boolean) => {
    // 如果校验不通过，直接返回
    if (!result) return

    // 解构获取新密码和确认密码
    const { new_password, confirm_password } = pwdFormData.value
    // 如果两次密码输入不一致，提示用户重新输入
    if (new_password !== confirm_password) {
      ElMessage.warning('两次新密码输入不一致，请重新输入后再次提交！')
      return
    }

    // 根据用户角色选择对应的修改密码函数
    const changeFunc = role === 'Student' ? UserLogin.studentChangePasswordApi : UserLogin.teacherChangePasswordApi;
    // 调用修改密码函数，并根据返回结果进行相应处理
    changeFunc(JSON.parse(userInfo)?.userId, pwdFormData.value).then(response => {
      if (response.code !== 200) {
        // 如果返回的响应码不为200，显示错误消息
        ElMessage.error(response.msg)
      } else {
        // 如果修改成功，显示成功消息，并关闭修改密码对话框
        ElMessage.success('密码修改成功！')
        changePwdDialogVisible.value = false
      }
    })
  })
}
</script>

<style scoped lang="scss">
.app-container-main {
  width: 100%;
  height: 100vh;
  display: flex;
}
.container-main-left-box {
  width: 236px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .logo-box {
    width:235px;
    height: 60px;
    background-color: #337ecc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.container-main-right-box {
  height: 100%;
  width: calc(100% - 236px);
  display: flex;
  flex-direction: column;
  .container-top-box {
    height: 50px;
    position: relative;
    background-color: #fff;
    color: #3E3E3E;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.20);
    padding: 5px 50px;
    display: flex;
    justify-content: end;
    align-items: center;
  }
  .container-main-content-box {
    height: calc(100% - 50px);
    background-color: #fff;
    padding: 20px;
  }
}
.header-item {
  &:hover {
    cursor: pointer; // hover后鼠标变手指
  }
}
</style>