<template>
  <div class="papers-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <FileTerminal />
      </el-icon>
      <span style="margin-left: 10px">公共试卷库</span>
    </div>
    <div class="common-module-query-box">
      <div class="module-query-item">
        <span class="module-query-item-title">试卷标题: </span>
        <el-input v-model="queryInfo.title" placeholder="请输入试题标题" style="width: 220px" clearable/>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary" @click="handleQuery">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
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
        <el-table-column prop="duration_minutes" label="答题建议时长（分钟）" align="center" width="140"/>
        <el-table-column prop="total_marks" label="计划总分" align="center" width="80"/>
        <el-table-column prop="actual_total" label="实际总分" align="center" width="80"/>
        <el-table-column prop="publish_date" label="发布时间" align="center" width="180">
          <template #default="scope">
            <span v-if="scope['row']['publish_date']">{{ scope['row']['publish_date'] }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
        <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="150" :resizable="false">
          <template #default="scope">
            <el-button link size="small" type="primary" :icon="ScanEye" @click="handleViewPaper(scope['row'])">
              预览试卷
            </el-button>
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
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import { Paper } from "../../api"
import {ElMessage} from "element-plus";
import {Search, FileTerminal, ScanEye} from "lucide-vue-next";
import {usePaperViewStore} from "../../stores/PaperViewStore.ts";
import router from "../../router";

// 查询条件
const queryInfo = reactive({
  title: null,
  is_published: true,
  is_deleted: false,
  is_public: true,
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

const paperView = usePaperViewStore()
const { setPaperInfo } = paperView

// 处理预览试卷
const handleViewPaper = (paperInfo: any) => {
  setPaperInfo(paperInfo, '/publicPapers')
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