<template>
  <div class="papers-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <FileHeart />
      </el-icon>
      <span style="margin-left: 10px">个人试卷库</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试卷标题: </span>
        <el-input v-model="queryInfo.title" placeholder="请输入试题标题" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item">
        <span class="module-query-item-title">发布类型: </span>
        <el-select v-model="queryInfo.is_published" placeholder="请选择发布类型" style="width: 240px" clearable>
          <el-option key="1" label="已发布" :value="true"/>
          <el-option key="2" label="未发布" :value="false"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="handleQuery">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
    <div class="common-module-opts-box">
      <el-button color="#42b883" style="color: #fff" @click="handleOpenDialog('C')">
        <Plus class="common-btn-icon-style"/>
        新 增
      </el-button>
    </div>
    <div class="papers-table-box">
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
        <el-table-column fixed prop="title" label="试卷标题" align="center" width="240">
          <template #default="scope">
            <el-button link size="small" type="primary" @click="handleViewPaper(scope['row'])">
              {{ scope['row']['title'] }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="试卷描述" align="center" width="240"/>
        <el-table-column prop="trial_type" label="试卷库类型" align="center" width="120">
          <template #default="scope">
            <span v-if="scope['row']['is_public']">公共</span>
            <span v-else>个人</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration_minutes" label="答题建议时长（分钟）" align="center" width="140"/>
        <el-table-column prop="total_marks" label="计划总分" align="center" width="80"/>
        <el-table-column prop="actual_total" label="实际总分" align="center" width="80"/>
        <el-table-column prop="is_published" label="发布状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['is_published']" type="success">
              <el-icon><Check /></el-icon>
              已发布
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><X /></el-icon>
              未发布
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="publish_date" label="发布时间" align="center" width="180">
          <template #default="scope">
            <span v-if="scope['row']['publish_date']">{{ scope['row']['publish_date'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
        <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="300" :resizable="false">
          <template #default="scope">
            <el-button
                link
                size="small"
                type="primary"
                :icon="Link"
                @click="openLinkDrawer(scope['row'])"
            >
              关联
            </el-button>
            <el-divider direction="vertical"/>
            <el-button
                link
                size="small"
                type="warning"
                :icon="SquarePen"
                @click="handleOpenDialog('E', scope['row'])"
            >
              编辑
            </el-button>
            <el-divider direction="vertical"/>
            <el-button
                link
                v-if="scope['row']['is_published']"
                size="small"
                type="danger"
                :icon="NavigationOff"
                @click="handleCancelPublishPaper(scope['row']['id'])"
            >
              取消
            </el-button>
            <el-button
                link
                v-else
                size="small"
                type="success"
                :icon="Navigation"
                @click="handlePublishPaper(scope['row']['id'])"
            >
              发布
            </el-button>
            <el-divider direction="vertical"/>
            <el-popover placement="bottom-start" :width="100" trigger="hover">
              <template #reference>
                <el-button link size="small" type="info" :icon="EllipsisVertical">更多</el-button>
              </template>
              <template #default>
                <div style="display: flex; gap: 8px; flex-direction: column">
                  <el-button
                      link
                      size="small"
                      type="primary"
                      :icon="ScanEye"
                      @click="handleViewPaper(scope['row'])"
                  >
                    预览试卷
                  </el-button>
                  <el-divider style="margin: 0"/>
                  <el-button
                      link
                      size="small"
                      type="success"
                      :icon="CopyPlus"
                      @click="handleCopy(scope['row'])"
                  >
                    复制试卷
                  </el-button>
                  <el-divider v-if="!scope['row']['is_published']" style="margin: 0"/>
                  <el-button
                      link
                      v-if="!scope['row']['is_published']"
                      size="small"
                      type="danger"
                      :icon="Trash2"
                      @click="handleDelete(scope['row']['id'])"
                  >
                    删除试卷
                  </el-button>
                </div>
              </template>
            </el-popover>

          </template>
        </el-table-column>
        <template #empty>
          <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        </template>
      </el-table>
      <div class="error-archive-main-pagination-box">
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
        :title="optType === 'C' ? '新增试卷' : '编辑试卷'"
        draggable
        destroy-on-close
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="handleClose(formRef)"
    >
      <el-form :model="formData" ref="formRef">
        <el-form-item label="试卷标题" :label-width="formLabelWidth" prop="title" required>
          <el-input v-model="formData.title" placeholder="请输入试卷标题" clearable/>
        </el-form-item>
        <el-form-item label="试卷描述" :label-width="formLabelWidth" prop="description" required>
          <el-input v-model="formData.description" placeholder="请输入试卷描述" clearable/>
        </el-form-item>
        <el-form-item label="建议时长" :label-width="formLabelWidth" prop="duration_minutes" required>
          <el-input v-model="formData.duration_minutes" placeholder="请输入考试时长" clearable>
            <template #append>分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="计划总分" :label-width="formLabelWidth" prop="total_marks" required>
          <el-input v-model="formData.total_marks" placeholder="请输入计划总分（仅做参考使用）" clearable/>
        </el-form-item>
        <el-form-item label="试卷库类型" :label-width="formLabelWidth" prop="is_public" required>
          <el-select v-model="formData.is_public" placeholder="请选择试卷库类型">
            <el-option label="个人试卷库" :value="false"/>
            <el-option label="公共试卷库" :value="true"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" :icon="Ban">取 消</el-button>
          <el-button type="primary" @click="handleSubmit(formRef)" :icon="Send">提 交</el-button>
        </div>
      </template>
    </el-dialog>
    <link-questions-drawer :paper-info="paperInfo"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import { useLinkQuestionStore } from "../../stores/DrawerCommonStore.ts";
import { usePaperViewStore } from "../../stores/PaperViewStore.ts";
import {getCookie} from "../../utils/cookie.ts";
import { Paper } from "../../api"
import {ElMessage, ElMessageBox} from "element-plus";
import type {FormInstance} from 'element-plus'
import router from "../../router";
import LinkQuestionsDrawer from "./LinkQuestionsDrawer.vue";
import {
  Plus, Search, FileHeart, Link, SquarePen, Trash2, ScanEye, CopyPlus,
  Check, NavigationOff, Navigation, X, Ban, Send, EllipsisVertical,
} from "lucide-vue-next";

// 获取登录用户ID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 查询条件
const queryInfo = reactive({
  title: null,
  is_published: null,
  is_deleted: false,
  is_public: null,
  created_user: userId,
})

// 处理查询
const handleQuery = () => {
  getPaperTableData()
}

// 存储表格数据
const tableData: any = ref([])
// 当前页
const currentPage = ref(1)
// 每页数量
const pageSize = ref(50)
// 数据总数
const tablePageTotal = ref(0)

// 处理分页时当前页的变更事件
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getPaperTableData()
}

// 获取试卷列表数据
const getPaperTableData = () => {
  Paper.getPapersApi(queryInfo, currentPage.value, pageSize.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData: any[] = []
      response.data.data.map((item: any) => {
        tempData.push({
          id: item.id,
          title: item.title,
          description: item.description,
          duration_minutes: item['duration_minutes'],
          total_marks: item['total_marks'],
          is_published: item['is_published'],
          is_public: item['is_public'],
          publish_date: item['publish_date'],
          created_at: item['created_at'],
          updated_at: item['updated_at'],
          actual_total: item['actual_total'] ? item['actual_total'] : 0,
          created_user: item['created_user']
        })
      })
      tableData.value = tempData
      tablePageTotal.value = response.data.total
    }
  })
}

onMounted(() => {
  currentPage.value = 1
  getPaperTableData()
})

// 处理发布试卷
const handlePublishPaper = (id: string) => {
  Paper.paperPublishApi(id).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      ElMessage.success('发布成功！')
      getPaperTableData()
    }
  })
}

// 处理取消发布试卷
const handleCancelPublishPaper = (id: string) => {
  ElMessageBox.confirm(
      '您确定要取消发布吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  ).then(() => {
    Paper.paperCancelPublishApi(id).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      } else {
        ElMessage.success('取消发布成功！')
        getPaperTableData()
      }
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

const optType = ref('C')
// Dialog中Form Label的通用宽度
const formLabelWidth = '120px'
// 控制Dialog是否显示
const dialogVisible = ref(false)
// 新增试卷表单的Ref
const formRef = ref<FormInstance>()
// FormData 初始化
const initFormData = {
  title: '',
  description: '',
  duration_minutes: '',
  total_marks: '',
  is_public: false,
  is_publish: true,
  created_user: userId,
  updated_user: userId
}
// 试卷 FormData
const formData = ref(initFormData)

// 处理关闭Dialog回调函数
const handleClose = (formEl: any) => {
  formData.value = initFormData
  formEl.resetFields()
  dialogVisible.value = false
}

// 处理打开新增、编辑Dialog
const handleOpenDialog = (opt: string, itemData?: any) => {
  if (opt === 'E') {
    formData.value = itemData
  }
  optType.value = opt
  dialogVisible.value = true
}

// 处理提交试卷信息
const handleSubmit = async (formEl: any) => {
  // 数据校验
  formEl.validate(async (result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的试卷信息后重新提交！')
      return
    }
    try {
      const response = optType.value === 'C'
          ? await Paper.createPaperApi(formData.value)
          : await Paper.editPaperApi({...formData.value, updated_user: userId})
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success(optType.value === 'C' ? '新增试卷成功！' : '编辑试卷成功！')
      getPaperTableData()
      dialogVisible.value = false
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })
}

// 处理删除试卷逻辑
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
    Paper.delPaperApi(rowId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('删除试卷成功！')
      getPaperTableData()
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

// 试卷信息（用于LinkDrawer子组件）
const paperInfo = ref({})
// 从Store中获取，控制关联试题Drawer是否显示
const linkQuestion = useLinkQuestionStore()
const { changeDrawerVisible } = linkQuestion
// 打开关联试题Drawer
const openLinkDrawer = (itemData: any) => {
  changeDrawerVisible()
  paperInfo.value = itemData
}

// 处理复制试卷逻辑
const handleCopy = (paperInfo: any) => {
  ElMessageBox.confirm(
      `您确定要复制「${paperInfo.title}」试卷吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }
  ).then(() => {
    Paper.copyPaperApi(paperInfo.id, userId).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('复制试卷成功！')
      getPaperTableData()
    })
  }).catch(() => {
    ElMessage.info('取消复制')
  })
}

const paperView = usePaperViewStore()
const { setPaperInfo } = paperView

// 处理预览试卷
const handleViewPaper = (paperInfo: any) => {
  setPaperInfo(paperInfo, '/personalPapers')
  router.replace('/paperDetailView')
}

</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.papers-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.papers-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}

.error-archive-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>