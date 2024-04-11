<template>
  <el-drawer
      :size="700"
      title="题库"
      v-model="drawerVisible"
      destroy-on-close
      :append-to-body="true"
      :close-on-click-modal="false"
  >
    <div class="link-questions-warehouse-main">
        <span style="font-size: 13px;margin-bottom: 10px">
          Tips：您正在为「{{ props.module['title'] }}」模块添加试题，勾选试题后提交，进行批量配置
        </span>
      <div>Content</div>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button :icon="Ban" @click="changeDrawerVisible">取 消</el-button>
        <el-button type="primary" :icon="Link" @click="changeDrawerVisible">关 联</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {storeToRefs} from "pinia";
import {Ban, Link} from "lucide-vue-next";
import {useQuestionsWarehouseStore} from "../../stores/DrawerCommonStore.ts";

// 从Store中获取，控制关联试题-题库Drawer是否显示
const questionWarehouseStore = useQuestionsWarehouseStore()
const {drawerVisible} = storeToRefs(questionWarehouseStore)
const { changeDrawerVisible } = questionWarehouseStore

const props = defineProps({
  module: { type: Object, required: true }
})

</script>


<style scoped lang="scss">
.link-questions-warehouse-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #5e5e5e;
}
</style>