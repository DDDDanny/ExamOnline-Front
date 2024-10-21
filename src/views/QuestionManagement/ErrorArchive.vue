<template>
  <div class="error-archive-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <Notebook/>
      </el-icon>
      <span style="margin-left: 10px">错题集</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试题标题: </span>
        <el-input v-model="queryInfo.topic" placeholder="请输入试题标题" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题类型: </span>
        <el-select v-model="queryInfo.type" placeholder="请选择题目类型" style="width: 240px" clearable>
          <el-option key="1" label="选择题" value="select"/>
          <el-option key="2" label="判断题" value="judge"/>
        </el-select>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题难度: </span>
        <el-select v-model="queryInfo.difficulty" placeholder="请选择题目难度" style="width: 240px" clearable>
          <el-option key="1" label="简单" value="E"/>
          <el-option key="2" label="中等" value="M"/>
          <el-option key="3" label="困难" value="H"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="handleQuery">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
    <div class="error-archive-table-box">
      <el-table
          border
          stripe
          size="small"
          :data="tableData"
          show-overflow-tooltip
          class="common-table-base-style"
          header-cell-class-name="table-header-row-style"
      >
        <el-table-column fixed type="index" align="center" width="60" label="序号"/>
        <el-table-column fixed prop="topic" label="试题标题" align="center" width="300"/>
        <el-table-column prop="type" label="试题类型" align="center" width="120">
          <template #default="scope">
            <span v-if="scope['row']['type'] === 'select'">选择题</span>
            <span v-else>判断题</span>
          </template>
        </el-table-column>
        <el-table-column prop="difficulty" label="试题难度" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['difficulty'] === 'E'" type="success">
              <el-icon><Sun /></el-icon>
              简 单
            </el-tag>
            <el-tag size="small" v-else-if="scope['row']['difficulty'] === 'M'" type="warning">
              <el-icon><CloudSun /></el-icon>
              中 等
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><CloudRain /></el-icon>
              困 难
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="收藏时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="210" :resizable="false">
          <template #default="scope">
            <el-button
                link
                size="small"
                type="primary"
                :icon="Info"
                @click="handleOpenDetailDialog(scope['row'])"
            >
              详情
            </el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="warning" :icon="SquarePen" @click="handleOpenEditDialog(scope['row'])">编辑</el-button>
            <el-divider direction="vertical"/>
            <el-button
                link
                size="small"
                type="danger"
                :icon="Trash2"
                @click="handleDelete(scope['row']['id'])"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="/src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <common-pagination
          :handle-current-change="handleCurrentChange"
          :page-size="pageSize"
          :table-page-total="tablePageTotal"
      />
    </div>
    <el-dialog
        width="800"
        title="试题详情"
        draggable
        destroy-on-close
        v-model="detailDialogVisible"
        :close-on-click-modal="false"
    >
      <div class="question-detail-box">
        <div class="detail-tag-box detail-common">
          <el-tag style="margin-right: 10px">
            <el-icon><Tag /></el-icon>
            {{ detailData['type'] === 'select' ? '选择题' : '判断题' }}
          </el-tag>
          <el-tag v-if="detailData['difficulty'] === 'E'" type="success">
            <el-icon><Sun /></el-icon>
            简 单
          </el-tag>
          <el-tag v-else-if="detailData['difficulty'] === 'M'" type="warning">
            <el-icon><CloudSun /></el-icon>
            中 等
          </el-tag>
          <el-tag v-else type="danger">
            <el-icon><CloudRain /></el-icon>
            困 难
          </el-tag>
        </div>
        <div class="detail-common detail-topic-box">
          <span style="font-weight: bolder;">题目：</span>
          <span style="margin-top: 10px; letter-spacing: 1px;">{{ detailData['topic'] }}</span>
        </div>
        <div class="detail-options-box detail-common" v-if="detailData['type'] === 'select'">
          <span style="font-weight: bolder;">选项：</span>
          <div v-for="(value, key) in detailData['optionsJson']" :key="key" style="margin-top: 10px">
            <span>{{ key }}: {{ value }}</span>
          </div>
        </div>
        <div class="detail-common detail-answer-box">
          <span style="font-weight: bolder;">参考答案：</span>
          <span v-if="detailData['type'] === 'select'">{{ detailData['answer'] }}</span>
          <span v-else style="display: flex;align-items: center;">
            <Check v-if="detailData['answer'] == 'T'" style="height: 16px"/>
            <X v-else style="height: 15px"/>
          </span>
        </div>
        <div class="detail-common detail-topic-box">
          <span style="font-weight: bolder;">试题解析：</span>
          <span style="margin-top: 10px; letter-spacing: 1px;">{{ detailData['explanation'] }}</span>
        </div>
        <el-divider style="margin: 0"/>
        <div class="detail-base-info-box">
          <div class="base-info">
            <div class="base-info-item">
              <span style="margin-right: 10px">收藏时间：</span>
              <span>{{ detailData['created_at'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        width="800"
        title="编辑收藏信息"
        draggable
        destroy-on-close
        v-model="editDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="handleCloseEditDialog(formRef)"
    >
      <el-form :model="formData" ref="formRef">
        <el-form-item label="错题解析" :label-width="formLabelWidth" prop="explanation" required>
          <el-input v-model="formData.explanation" placeholder="请输入错题解析" clearable/>
        </el-form-item>
        <el-form-item label="难度" :label-width="formLabelWidth" prop="difficulty" required>
          <el-select v-model="formData.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="E" key="E"/>
            <el-option label="中等" value="M" key="M"/>
            <el-option label="困难" value="H" key="H"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCloseEditDialog(formRef)" :icon="Ban">取 消</el-button>
          <el-button type="primary" @click="handleSubmitEditCollect(formRef)" :icon="Send">提 交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {
  Notebook, Sun, Info, Search, SquarePen, Trash2,
  CloudSun, CloudRain, Check, X, Tag, Ban, Send
} from "lucide-vue-next";
import {Questions} from "../../api";
import {ElMessage, ElMessageBox} from "element-plus";
import { getCookie } from "../../utils/cookie.ts";
import CommonPagination from "../../components/CommonPagination.vue";

// 获取用户ID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 查询条件
const queryInfo = reactive({
  topic: null,
  type: null,
  status: null,
  difficulty: null
})
// 处理查询
const handleQuery = () => {
  getErrorArchive()
}

// 存储表格数据
const tableData: any = ref([])
// 当前页
const currentPage = ref(1)
// 每页数量
const pageSize = ref(50)
// 数据总数
const tablePageTotal = ref(0)
// 获取错题集数据
const getErrorArchive = () => {
  Questions.getErrorArchiveApi(userId, queryInfo, currentPage.value, pageSize.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData: any[] = []
      response.data.data.map((item: any) => {
        tempData.push({
          id: item['question_info'].id,
          record_id: item.id,
          topic: item['question_info'].topic,
          type: item['question_info'].type,
          trial_type: item['question_info']['trial_type'],
          options: item['question_info']['options'],
          answer: item['question_info']['answer'],
          status: item['question_info']['status'],
          difficulty: item['difficulty'],
          explanation: item['explanation'],
          created_at: item['created_at'],
          collector: item['collector'],
        })
      })
      tableData.value = tempData
      tablePageTotal.value = response.data.total
    }
  })
}

// 处理分页时当前页的变更事件
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getErrorArchive()
}

onMounted(() => {
  getErrorArchive()
})

// 控制详情Dialog是否可见
const detailDialogVisible = ref(false)
// 存储详情数据信息
const detailData: any = ref(null)
// 处理打开详情Dialog
const handleOpenDetailDialog = (itemData: any) => {
  if (itemData.type === 'select') {
    itemData['optionsJson'] = JSON.parse(itemData['options'])
  }
  detailData.value = itemData
  detailDialogVisible.value = true
}

// 处理取消收藏（删除）错误试题
const handleDelete = (questionsId: string) => {
  ElMessageBox.confirm(
      '您确定要把这道题从错题集中移除吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  ).then(() => {
    Questions.delErrorArchiveQuestionApi(userId, questionsId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('删除错题成功！')
      getErrorArchive()
    })
  }).catch(() => {
    ElMessage.info('取消删除!')
  })
}

// 控制编辑收藏信息Dialog是否可见
const editDialogVisible = ref(false)
// Dialog中Form Label的通用宽度
const formLabelWidth = '100px'
// 新增试题表单的Ref
const formRef = ref<FormInstance>()

// 试题 FormData
const formData = ref({})

// 处理关闭收藏错题Dialog
const handleCloseEditDialog = (formEl: any) => {
  formData.value = {}
  formEl.resetFields()
  editDialogVisible.value = false
}

// 处理打开编辑收藏信息Dialog
const handleOpenEditDialog = (item: any) => {
  editDialogVisible.value = true
  formData.value = {
    id:           item.record_id,
    collector:    item.collector,
    difficulty:   item.difficulty,
    explanation:  item.explanation,
    question_id:  item.id
  }
}
// 提交错题收藏
const handleSubmitEditCollect = (formEl: any) => {
  formEl.validate(async (result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的信息！')
      return
    }
    try {
      Questions.updateErrorArchiveApi(formData.value).then(response => {
        if (response.code !== 200) {
          ElMessage.error(response.msg)
          return
        }
        ElMessage.success('编辑成功！')
        getErrorArchive()
        editDialogVisible.value = false
      })
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.error-archive-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.error-archive-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 260px);
}
</style>
