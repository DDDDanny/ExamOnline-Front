<template>
  <el-drawer
      :size="800"
      title="关联试题"
      v-model="props.drawerVisible"
      destroy-on-close
      :close-on-click-modal="false"
  >
    <div class="link-question-drawer-main">
      <el-divider content-position="left" style="margin: 0 0 20px 0">
        <div class="divider-box">
          <el-icon><Smile /></el-icon>
          <span style="margin-left: 10px">基础信息</span>
        </div>
      </el-divider>
      <div class="paper-base-info-box">
        <div class="paper-base-info-item" v-for="item in paperBaseInfo">
          <span>{{ item.key }}</span>
          <span>{{ item.value }}</span>
        </div>
        <div class="paper-base-info-item">
          <span>实际总分（会随着试题分数的变化而变化）：</span>
          <span>{{ actual_total }} 分</span>
        </div>
      </div>
      <el-divider content-position="left" style="margin: 20px 0 20px 0">
        <div class="divider-box">
          <el-icon><Package /></el-icon>
          <span style="margin-left: 10px">模块信息</span>
        </div>
      </el-divider>
      <div class="paper-module-box">
        <span class="paper-module-empty">暂无模块</span>
        <el-button type="primary" size="small" style="width: 400px;border-radius: 5px;" >
          <el-icon ><PackagePlus /></el-icon>
          <span style="font-size: 13px;margin-left: 10px">新 增 模 块</span>
        </el-button>
      </div>
      <el-divider content-position="left" style="margin: 20px 0 20px 0">
        <div class="divider-box">
          <el-icon><Link /></el-icon>
          <span style="margin-left: 10px">关联试题</span>
        </div>
      </el-divider>
      <div class="paper-link-box">
        <span class="paper-link-empty">暂无关联试题</span>
        <el-button type="primary" size="small" style="width: 400px;border-radius: 5px;" >
          <el-icon ><Link /></el-icon>
          <span style="font-size: 13px;margin-left: 10px">关 联 试 题</span>
        </el-button>
      </div>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleClose">提交</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {onBeforeUpdate, ref} from 'vue'
import {Smile, Package, Link, PackagePlus} from "lucide-vue-next";

const props = defineProps({
  drawerVisible: Boolean,
  paperInfo: {
    type: Object,
    required: true
  },
})

const emits = defineEmits(['close'])

// 处理关闭Drawer
const handleClose = () => {
  emits('close')
}

// 试卷基础信息
const paperBaseInfo: any = ref([])
// 试卷实际总分
const actual_total = ref(0)
onBeforeUpdate(() => {
  // 更新试卷基础信息
  paperBaseInfo.value = [
    { key: '试卷标题：', value: props.paperInfo['title']},
    { key: '试卷描述：', value: props.paperInfo['description']},
    { key: '答题建议时长：', value: props.paperInfo['duration_minutes']},
    { key: '计划总分：', value: props.paperInfo['total_marks']},
  ]
  // 初始化实际分数
  actual_total.value = props.paperInfo['actual_total']
})
</script>

<style scoped lang="scss">
.link-question-drawer-main {
  width: 100%;
  display: flex;
  flex-direction: column;

  .divider-box {
    display: flex;
    align-items: center;
    color: #5e5e5e;
  }

  .paper-base-info-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: #5e5e5e;
    font-size: 13px;

    .paper-base-info-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }

  .paper-module-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .paper-module-empty {
      color: #b2b2b2;
      font-size: 13px;
      margin-bottom: 20px;
    }
  }

  .paper-link-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .paper-link-empty {
      color: #b2b2b2;
      font-size: 13px;
      margin-bottom: 20px;
    }
  }
}
</style>