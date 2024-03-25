<template>
  <div class="error-archive-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <BookHeart/>
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
        <el-select v-model="queryInfo.status" placeholder="请选择题目难度" style="width: 240px" clearable>
          <el-option key="1" label="简单" value="E"/>
          <el-option key="2" label="中等" value="M"/>
          <el-option key="3" label="困难" value="H"/>
        </el-select>
      </div>
      <div class="module-query-item-btn">
        <el-button type="primary">
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
        <el-table-column fixed prop="topic" label="试题标题" align="center" width="200"/>
        <el-table-column prop="type" label="试题类型" align="center" width="120">
          <template #default="scope">
            <span v-if="scope['row']['type'] === 'select'">选择题</span>
            <span v-else>判断题</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="试题状态" align="center" width="120">
          <template #default="scope">
            <el-tag size="small" v-if="scope['row']['status'] === true" type="success">
              <el-icon><Check/></el-icon>
              有 效
            </el-tag>
            <el-tag size="small" v-else type="danger">
              <el-icon><X/></el-icon>
              无 效
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="收藏时间" align="center" width="180"/>
        <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
        <el-table-column :resizable="false"/>
        <el-table-column fixed="right" label="操 作" align="center" width="210" :resizable="false">
          <template #default>
            <el-button link size="small" type="primary" :icon="Info">详情</el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="warning" :icon="SquarePen">编辑</el-button>
            <el-divider direction="vertical"/>
            <el-button link size="small" type="danger" :icon="Trash2">删除</el-button>
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
import { reactive, ref } from "vue";
import {BookHeart, Check, Info, Search, SquarePen, Trash2, X} from "lucide-vue-next";

// 查询条件
const queryInfo = reactive({
  topic: null,
  type: null,
  status: null,
  is_deleted: false,
})

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
</script>

<style scoped lang="scss">
.error-archive-main-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.error-archive-table-box {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 260px);
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
