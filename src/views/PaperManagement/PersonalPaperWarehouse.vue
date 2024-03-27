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
      <el-button color="#42b883" style="color: #fff">
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
            <el-button link size="small" type="primary">{{ scope['row']['title'] }}</el-button>
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
        <el-table-column fixed="right" label="操 作" align="center" width="280" :resizable="false">
          <template #default="scope">
            <el-button link size="small" type="primary" :icon="Link">关联试题</el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="warning" :icon="SquarePen">编辑</el-button>
            <el-divider direction="vertical"/>
            <el-button
                link
                v-if="scope['row']['is_published']"
                size="small"
                type="info"
                :icon="NavigationOff"
                @click="handleCancelPublishPaper(scope['row']['id'])"
            >
              取消发布
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
            <el-divider v-if="!scope['row']['is_published']" direction="vertical"/>
            <el-button v-if="!scope['row']['is_published']" link size="small" type="danger" :icon="Trash2">删除</el-button>
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
import {getCookie} from "../../utils/cookie.ts";
import { Paper } from "../../api"
import {ElMessage} from "element-plus";
import {Plus, Search, FileHeart, Link, SquarePen, Trash2, Check, NavigationOff, Navigation, X} from "lucide-vue-next";

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
          actual_total: item['actual_total'] ? item['actual_total'] : 0
        })
      })
      tableData.value = tempData
      tablePageTotal.value = response.data.total
    }
  })
}

onMounted(() => {
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
  Paper.paperCancelPublishApi(id).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      ElMessage.success('取消发布成功！')
      getPaperTableData()
    }
  })
}
</script>

<style scoped lang="scss">
.papers-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.papers-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 380px);
}

:deep(.table-header-row-style) {
  background-color: #3483d1 !important;;
  color: #ffffff !important;;
}

.error-archive-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>