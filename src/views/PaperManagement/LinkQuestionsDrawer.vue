<template>
  <el-drawer
      :size="800"
      title="关联试题"
      v-model="props.drawerVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :close-on-press-escape="false"
  >
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleClose">提交</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">

const props = defineProps({
  drawerVisible: Boolean,
  paperInfo: Object,
})

const emits = defineEmits(['close'])

// 处理关闭Dialog
const handleClose = () => {
  emits('close')
}
</script>

<style scoped lang="scss">

</style>