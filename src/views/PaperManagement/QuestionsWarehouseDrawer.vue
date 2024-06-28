<template>
  <el-drawer
      :size="700"
      title="题库"
      v-model="drawerVisibleQW"
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
  <el-dialog
      width="700"
      title="试题关联"
      draggable
      append-to-body
      destroy-on-close
      v-model="linkQuestionsDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseLinkQuestionsDialog"
  >
    <div class="link-questions-dialog-main">
      <div style="width: 100%;display: flex;align-items: center;">
        <span style="margin-right: 10px">所选试题总分：{{ sumMarks }} 分</span>
        <el-button link type="primary" :icon="RefreshCcw" @click="handleRefreshSumMarks"/>
      </div>
      <el-divider/>
      <el-form :model="formData" ref="formRef">
        <div class="link-questions-item" v-for="(item, index) in selectedQuestionsRef">
          <div style="color: #5e5e5e;margin-bottom: 10px;">
            <el-tag style="margin-right: 10px" :icon="Bookmark">
              <el-icon><Tag /></el-icon>
              {{ item['type'] === 'select' ? '选择题' : '判断题' }}
            </el-tag>
            <span style="line-height: 30px;">{{ index + 1 }}. {{ item['topic'] }}</span>
            <el-form-item
                required
                label="试题分数"
                style="margin-top: 20px"
                :prop="item['id']"
                :rules="[{ required: true, message: '请输入分数', trigger: 'blur' }]"
            >
              <el-input v-model="formData[item['id']]" placeholder="请输入试题分数" clearable>
                <template #append>分</template>
              </el-input>
            </el-form-item>
          </div>
          <el-divider v-if="index !== selectedQuestionsRef.length - 1" style="margin-top: 5px"/>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="linkQuestionsDialogVisible = false" :icon="Ban">取 消</el-button>
        <el-button type="primary" @click="handleSubmitLink(formRef)" :icon="Send">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import {storeToRefs} from "pinia";
import {Questions, Paper} from '../../api';
import {ElMessage, ElTable} from "element-plus";
import type {FormInstance} from 'element-plus'
import { getCookie } from "../../utils/cookie.ts";
import {Ban, Bookmark, Link, Send, Tag, RefreshCcw} from "lucide-vue-next";
import {useQuestionsWarehouseStore} from "../../stores/DrawerCommonStore.ts";

// 从Store中获取，控制关联试题-题库Drawer是否显示
const questionWarehouseStore = useQuestionsWarehouseStore()
const {drawerVisibleQW} = storeToRefs(questionWarehouseStore)
const { changeDrawerVisible } = questionWarehouseStore

const props = defineProps({
  module: { type: Object, required: true },
  linkQuestions: { type: Array, required: true },
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
      // 用于待选试题列表去重操作
      const linkedQuestionsIds: any = []
      props.linkQuestions.map((item: any) => {
        linkedQuestionsIds.push(item['question_id'])
      })
      const tempData: any = []
      response.data.map((item: any) => {
        // 进行去重操作
        if (!linkedQuestionsIds.includes(item['id'])) {
          tempData.push({
            id: item['id'],
            topic: item['topic'],
            type: item['type']
          })
        }
      })
      tableData.value = tempData
    }
  })
}

// 监听drawerVisible，当drawerVisible为true时，获取其他数据
watch(drawerVisibleQW, (newValue) => {
  if (newValue) {
    getQuestionsWarehouse()
  }
})

// 表格多选Ref
const multipleTableRef: any = ref<InstanceType<typeof ElTable>>()

// 控制填写关联试题信息Dialog是否可见
const linkQuestionsDialogVisible = ref(false)

// 存储被选中的试题信息
const selectedQuestionsRef = ref([])

// 处理点击试题关联
const handleClickQuestionsLink = () => {
  // 获取被选中的题目
  const selectedQuestions: [] = multipleTableRef.value.getSelectionRows()
  if (selectedQuestions.length === 0) {
    ElMessage.warning('未选择试题，无法进行关联！')
  } else {
    linkQuestionsDialogVisible.value = true
    selectedQuestionsRef.value = selectedQuestions
    // 初始化表单数据
    const tempData: any = {}
    for (const selectedQuestion of selectedQuestions) {
      tempData[selectedQuestion['id']] = 0
    }
    formData.value = tempData
  }
}

// 处理关闭填写关联试题的相关信息
const handleCloseLinkQuestionsDialog = () => {
  linkQuestionsDialogVisible.value = false
  // 关闭Dialog后，初始化总分
  sumMarks.value = 0
}

// 新增试卷表单的Ref
const formRef = ref<FormInstance>()
// 关联试题 FormData
const formData: any = ref({})
// 记录关联试题时的总分
const sumMarks = ref(0)
// 处理刷新总分
const handleRefreshSumMarks = () => {
  sumMarks.value = 0
  for (const key in formData.value) {
    if (formData.value[key] !== '') {
      sumMarks.value += parseFloat(formData.value[key])
    }
  }
  ElMessage.success('刷新成功！已计算最新总分！')
}

// 处理提交试题关联信息
const handleSubmitLink = (formEl: any) => {
  formEl.validate((result: boolean) => {
    if (!result) {
      ElMessage.warning('请填写完整的关联信息后重新提交！')
      return
    }
    const linkData: any = formData.value
    const requestData: any = []
    for (const key in linkData) {
      requestData.push({
        paper_id: props.module['paper_id'],
        question_id: key,
        marks: parseFloat(linkData[key]),
        module: props.module['id']
      })
    }
    Paper.linkQuestionsApi(requestData).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      } else {
        ElMessage.success('关联试题成功！')
        handleCloseLinkQuestionsDialog()
        changeDrawerVisible()
      }
    })
  })
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.link-questions-warehouse-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #5e5e5e;
}

.link-questions-dialog-main {
  display: flex;
  flex-direction: column;
  .link-questions-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>