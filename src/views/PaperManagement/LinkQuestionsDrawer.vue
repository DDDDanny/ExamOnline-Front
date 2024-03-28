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
        <div style="color: #5e5e5e">
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
        <div style="color: #5e5e5e">
          <el-icon><Blocks /></el-icon>
          <span style="margin-left: 10px">模块信息</span>
        </div>
      </el-divider>
      <div>456</div>
      <el-divider content-position="left" style="margin: 20px 0 20px 0">
        <div style="color: #5e5e5e">
          <el-icon><Link /></el-icon>
          <span style="margin-left: 10px">关联试题</span>
        </div>
      </el-divider>
      <div>789</div>
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
import {Smile, Blocks, Link} from "lucide-vue-next";

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
  paperBaseInfo.value = [
    { key: '试卷标题：', value: props.paperInfo['title']},
    { key: '试卷描述：', value: props.paperInfo['description']},
    { key: '答题建议时长：', value: props.paperInfo['duration_minutes']},
    { key: '计划总分：', value: props.paperInfo['total_marks']},
  ]
  actual_total.value = props.paperInfo['actual_total']
})
</script>

<style scoped lang="scss">
.link-question-drawer-main {
  width: 100%;
  display: flex;
  flex-direction: column;
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
}
</style>