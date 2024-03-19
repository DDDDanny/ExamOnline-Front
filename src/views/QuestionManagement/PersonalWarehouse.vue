<template>
  <div class="questions-main-box">
    <div class="common-module-header-box">
      <el-icon><BookHeart /></el-icon>
      <span style="margin-left: 10px">个人题库管理</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试题标题: </span>
        <el-input v-model="queryInfo.topic" placeholder="请输入试题标题" style="width: 220px" clearable />
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题类型: </span>
        <el-select v-model="queryInfo.type" placeholder="请选择题目类型" style="width: 240px" clearable>
          <el-option key="1" label="选择题" value="select" />
          <el-option key="2" label="判断题" value="judge" />
        </el-select>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">试题状态: </span>
        <el-select v-model="queryInfo.status" placeholder="请选择题目状态" style="width: 240px" clearable>
          <el-option key="1" label="有效" :value="true" />
          <el-option key="2" label="无效" :value="false" />
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="getPersonalWarehouseData">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
    <div class="common-module-opts-box">
      <el-button color="#42b883" style="color: #fff" @click="creatDialogFormVisible = true">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
    </div>
    <div class="questions-main-table-box" style="">
      <el-table
        border
        stripe
        size="small"
        :data="tableData"
        class="common-table-base-style"
        header-cell-class-name="table-header-row-style"
      >
        <el-table-column fixed type="index" align="center" width="60" label="序号"/>
        <el-table-column fixed prop="topic" label="试题标题" align="center" width="200" />
        <el-table-column prop="qType" label="试题类型" align="center" width="120" />
        <el-table-column prop="trialType" label="所属题库类型" align="center" width="120" />
        <el-table-column prop="status" label="试题状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['status'] === '有效'" type="success">
              <el-icon><Check /></el-icon>
              {{ scope['row']['status'] }}
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><X /></el-icon>
              {{ scope['row']['status'] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" align="center" width="180" />
        <el-table-column prop="updatedAt" label="更新时间" align="center" width="180" />
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="210" :resizable="false">
          <template #default="scope">
            <el-button link size="small" type="primary" :icon="Info">详情</el-button>
            <el-divider direction="vertical" />
            <el-button link size="small" type="warning" :icon="SquarePen">编辑</el-button>
            <el-divider direction="vertical" />
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
          <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover" />
        </template>
      </el-table>
      <div class="questions-main-pagination-box">
        <el-pagination
          small
          background
          :total="tablePageTotal"
          class="mt-4"
          style="margin-top: 20px"
          :default-page-size="pageSize"
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <el-dialog
      width="800"
      title="新增试题"
      draggable
      destroy-on-close
      v-model="creatDialogFormVisible"
      :close-on-click-modal="false"
      @close="handleClose(createFormRef)"
    >
      <el-form :model="createForm" ref="createFormRef">
        <el-form-item label="试题题目" :label-width="formLabelWidth" prop="topic" required >
          <el-input v-model="createForm.topic" placeholder="请输入题目" clearable />
        </el-form-item>
        <el-form-item label="试题类型" :label-width="formLabelWidth" prop="type" required>
          <el-select v-model="createForm.type" placeholder="请选择类型">
            <el-option label="选择题" value="select" />
            <el-option label="判断题" value="judge" />
          </el-select>
        </el-form-item>
        <el-form-item label="参考答案" :label-width="formLabelWidth" prop="answer" required>
          <el-input v-model="createForm.answer" placeholder="请输入参考答案" clearable />
        </el-form-item>
        <el-form-item label="所属题库" :label-width="formLabelWidth" prop="trial_type" required>
          <el-select v-model="createForm.trial_type" placeholder="请选择所属题库">
            <el-option label="个人题库" value="private" />
            <el-option label="公共题库" value="public" />
          </el-select>
        </el-form-item>
        <el-form-item label="试题状态" :label-width="formLabelWidth" prop="status" required>
          <el-select v-model="createForm.status" placeholder="请选择题目状态">
            <el-option label="有效" :value="true" />
            <el-option label="无效" :value="false" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="creatDialogFormVisible = false" :icon="Ban">取 消</el-button>
          <el-button type="primary" @click="handleSubmit(createFormRef)" :icon="Send">提 交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { Questions } from "../../api";
import { getCookie } from "../../utils/cookie.ts";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from 'element-plus'
import {
  BookHeart, Plus, Search, Info, SquarePen,
  Trash2, Check, X, Ban, Send
} from "lucide-vue-next";

// 获取UserID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 查询条件
const queryInfo = reactive({
  topic: null,
  type: null,
  status: null,
  is_deleted: false,
  created_user: userId,
})
// 存储表格数据
const tableData: any = ref([])
// 当前页
const currentPage = ref(1)
// 每页数量
const pageSize = ref(50)
// 数据总数
const tablePageTotal = ref(0)

// 处理获取个人题库列表数据
const getPersonalWarehouseData = () => {
  Questions.getQuestionsApi(queryInfo, currentPage.value, pageSize.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData: any[] = []
      response.data.data.map((item: any) => {
        tempData.push({
          id: item.id,
          topic: item.topic,
          qType: item.type === 'select' ? '选择题' : '判断题',
          trialType: item['trial_type'] === 'public' ? '公共' : '个人',
          status: item.status ? '有效' : '无效',
          createdAt: item['created_at'],
          updatedAt: item['updated_at'],
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
  getPersonalWarehouseData()
}

// 处理删除试题逻辑
const handleDelete = (rowId: string) => {
  ElMessageBox.confirm(
    '您确定要删除吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
    }
  ).then(() => {
    Questions.delQuestionApi(rowId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('删除试题成功！')
      getPersonalWarehouseData()
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

onMounted(() => {
  currentPage.value = 1
  getPersonalWarehouseData()
})

// Dialog中Form Label的通用宽度
const formLabelWidth = '100px'
// 控制新增Dialog是否显示
const creatDialogFormVisible = ref(false)
// 新增试题表单的Ref
const createFormRef = ref<FormInstance>()
// 新增试题Form
const createForm = reactive({
  topic: '',
  answer: '',
  type: 'select',
  trial_type: 'private',
  status: true,
  created_user: userId
})
// 处理关闭Dialog回调函数
const handleClose = (createFormEl: any) => {
  createFormEl.resetFields()
  creatDialogFormVisible.value = false
}
// 处理提交试题信息
const handleSubmit = (createFormEl: any) => {
  createFormEl.validate((result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的试题信息后重新提交！')
      return
    } else {
      Questions.createQuestionApi(createForm).then(response => {
        if (response.code !== 200) {
          ElMessage.error(response.msg)
          return
        }
        creatDialogFormVisible.value = false
        ElMessage.success('新增试题成功！')
        getPersonalWarehouseData()
      })
    }
  })
}
</script>

<style scoped lang="scss">
.questions-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
:deep(.table-header-row-style) {
  background-color: #3483d1 !important;;
  color: #ffffff !important;;
}
.questions-main-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}
.questions-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>
