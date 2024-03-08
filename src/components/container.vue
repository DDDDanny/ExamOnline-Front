<template>
  <div class="app-container-main">
    <div class="container-main-left-box">
      <div class="logo-box ">
        <el-image style="width: 40px; " src="src/images/ExamOnlineLogo.png" fit="cover" />
      </div>
      <el-menu
          active-text-color="#ffd04b"
          background-color="#337ecc"
          style="height: 100%;"
          default-active="2"
          text-color="#fff"
      >
        <el-menu-item index="1" style="margin-top: 20px">
          <el-icon style="margin-left: 10px"><BookMarked /></el-icon>
          试题管理
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon style="margin-left: 10px"><Notebook /></el-icon>
          错题集
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon style="margin-left: 10px"><ScrollText /></el-icon>
          试卷管理
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon style="margin-left: 10px"><BookOpenCheck /></el-icon>
          考试管理
        </el-menu-item>
        <el-menu-item index="6">
          <el-icon style="margin-left: 10px"><FileCheck /></el-icon>
          成绩管理
        </el-menu-item>
        <el-menu-item index="7">
          <el-icon style="margin-left: 10px"><Users /></el-icon>
          用户管理
        </el-menu-item>
        <el-menu-item index="8">
          <el-icon style="margin-left: 10px"><Laptop2 /></el-icon>
          在线考试
        </el-menu-item>
      </el-menu>
    </div>
    <div class="container-main-right-box">
      <div class="container-top-box">123</div>
      <div class="container-main-content-box">456</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookMarked, Notebook, ScrollText, FileCheck,
  BookOpenCheck, Users, Laptop2
} from 'lucide-vue-next'
</script>

<style scoped lang="scss">
.app-container-main {
  width: 100%;
  height: 100vh;
  display: flex;
}
.container-main-left-box {
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .logo-box {
    width:199px;
    height: 60px;
    background-color: #337ecc;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.container-main-right-box {
  height: 100%;
  width: calc(100% - 200px);
  display: flex;
  flex-direction: column;
  .container-top-box {
    height: 50px;
    position: relative;
    background-color: #fff;
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.20);
    padding: 5px 20px;
  }
  .container-main-content-box {
    height: calc(100% - 50px);
    background-color: #fff;
    padding: 20px;
  }
}

</style>