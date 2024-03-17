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
        <el-button type="primary" @click="handleGetPersonalWarehouseData">
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
          <template #default>
            <el-button link size="small" type="primary" :icon="Info">详情</el-button>
            <el-divider direction="vertical" />
            <el-button link size="small" type="warning" :icon="SquarePen">编辑</el-button>
            <el-divider direction="vertical" />
            <el-button link size="small" type="danger" :icon="Trash2">删除</el-button>
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
          :total="55"
          class="mt-4"
          style="margin-top: 20px"
          :default-page-size="50"
          layout="total, prev, pager, next"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import {Questions} from "../../api";
import {getCookie} from "../../utils/cookie.ts";
import {ElMessage} from "element-plus";
import {
  BookHeart, Plus, Search, Info, SquarePen,
  Trash2, Check, X
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

// 处理获取个人题库列表数据
const handleGetPersonalWarehouseData = () => {
  Questions.getQuestions(queryInfo).then(response => {
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
    }
  })
}

onMounted(() => {
  handleGetPersonalWarehouseData()
})
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
