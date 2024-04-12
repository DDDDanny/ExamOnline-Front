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
        Tips：您正在为「 {{ props.module['title'] }} 」模块添加试题，勾选试题后提交，进行批量配置
      </span>
      <el-table
          ref="multipleTableRef"
          border
          stripe
          size="small"
          :data="tableData"
          show-overflow-tooltip
          class="common-table-base-style"
          header-cell-class-name="table-header-row-style"
          max-height="calc(100vh - 210px)"
      >
        <el-table-column type="selection" width="40"/>
        <el-table-column type="index" align="center" width="50" label="序号"/>
        <el-table-column prop="type" label="试题类型" align="center" width="80">
          <template #default="scope">
            <span v-if="scope['row']['type'] === 'select'">选择题</span>
            <span v-else>判断题</span>
          </template>
        </el-table-column>
        <el-table-column prop="topic" label="试题标题" header-align="center" />
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button :icon="Ban" @click="changeDrawerVisible">取 消</el-button>
        <el-button type="primary" :icon="Link" @click="handleClickQuestionsLink">关 联</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import {storeToRefs} from "pinia";
import {Ban, Link} from "lucide-vue-next";
import {Questions} from '../../api';
import {ElMessage, ElTable} from "element-plus";
import { getCookie } from "../../utils/cookie.ts";
import {useQuestionsWarehouseStore} from "../../stores/DrawerCommonStore.ts";

// 从Store中获取，控制关联试题-题库Drawer是否显示
const questionWarehouseStore = useQuestionsWarehouseStore()
const {drawerVisible} = storeToRefs(questionWarehouseStore)
const { changeDrawerVisible } = questionWarehouseStore

const props = defineProps({
  module: { type: Object, required: true }
})

// 获取登录用户ID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 存储表格数据
const tableData: any = ref([])
const getQuestionsWarehouse = () => {
  Questions.getQuestionsWarehouseForPaper(userId).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData = []
      response.data.map(item => {
        tempData.push({
          id: item['id'],
          topic: item['topic'],
          type: item['type']
        })
      })
      tableData.value = tempData
    }
  })
}

// 监听drawerVisible，当drawerVisible为true时，获取其他数据
watch(drawerVisible, (newValue) => {
  if (newValue) {
    getQuestionsWarehouse()
  }
})

// 表格多选Ref
const multipleTableRef = ref<InstanceType<typeof ElTable>>()

// 处理点击试题关联
const handleClickQuestionsLink = () => {
  const selectedQuestions = multipleTableRef.value.getSelectionRows()
  console.log(selectedQuestions)
  changeDrawerVisible()
}
</script>


<style scoped lang="scss">
.link-questions-warehouse-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #5e5e5e;
}
:deep(.table-header-row-style) {
  background-color: #3483d1 !important;;
  color: #ffffff !important;;
}
</style>