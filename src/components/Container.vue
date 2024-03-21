<template>
  <div class="app-container-main">
    <div class="container-main-left-box">
      <div class="logo-box ">
        <el-image style="width: 35px;margin-right: 5px " src="src/images/ExamOnlineLogo.png" fit="cover" />
        <el-image style="width: 125px; " src="src/images/ExamOnline.png" fit="cover" />
      </div>
      <el-divider style="margin: 0;background: #79b0eb;width: 235px;border-color: #7ea4cd" />
      <el-menu
          active-text-color="#ffd04b"
          background-color="#337ecc"
          style="height: 100%;"
          default-active="/homepage"
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
            <el-button link>
              <el-icon size="18" style="margin-right: 18px"><Lock /></el-icon>
              修改密码
            </el-button>
            <el-divider style="margin: 10px"/>
            <el-button link>
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
  </div>
</template>

<script setup lang="ts">
import { Menu } from '../api';
import {onMounted, ref} from "vue";
import {
  BookMarked, Notebook, ScrollText, FileCheck,
  BookOpenCheck, Users, Laptop2, GraduationCap,
  CircleUserRound, Bell, LayoutTemplate, BookHeart,
  BookCheck, Lock, LogOut
} from 'lucide-vue-next'
import {ElMessage} from "element-plus";

// 菜单对应的ICON
const menuIconEnum: any = {
  '10001': BookMarked, '10002': Notebook, '10003': ScrollText,
  '10004': BookOpenCheck, '10005': FileCheck, '10006': GraduationCap,
  '10007': Users, '10008': Laptop2,
  '10001_1': BookHeart, '10001_2': BookCheck,
}

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

onMounted( () => {
  getMenu()
})

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