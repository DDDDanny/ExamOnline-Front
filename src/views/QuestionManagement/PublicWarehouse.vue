<template>
  <div class="questions-main-box">
    <div class="common-module-header-box">
      <el-icon>
        <BookCheck/>
      </el-icon>
      <span style="margin-left: 10px">公共题库管理</span>
    </div>
    <div class="common-module-query-box" style="margin-bottom: 10px">
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
      <div class="module-query-item-btn">
        <el-button type="primary" @click="handleQuery">
          <Search class="common-btn-icon-style"/>
          查 询
        </el-button>
      </div>
    </div>
    <div class="public-main-box">
      <el-tabs v-model="activeTab" @tab-change="handleTableChange">
        <el-tab-pane name="public">
          <template #label>
            <el-icon size="15" style="margin-right: 5px">
              <BookCheck/>
            </el-icon>
            <span>公共题库</span>
          </template>
          <div class="public-box">
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
              <el-table-column prop="trial_type" label="所属题库类型" align="center" width="120">
                <template #default="scope">
                  <span v-if="scope['row']['trial_type'] === 'public'">公共</span>
                  <span v-else>个人</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="试题状态" align="center" width="120">
                <template #default="scope">
                  <el-tag size="small" v-if="scope['row']['status'] === true" type="success">
                    <el-icon>
                      <Check/>
                    </el-icon>
                    有 效
                  </el-tag>
                  <el-tag size="small" v-else type="danger">
                    <el-icon>
                      <X/>
                    </el-icon>
                    无 效
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="created_user" label="创建人" align="center" width="120"/>
              <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
              <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
              <el-table-column :resizable="false"/>
              <el-table-column fixed="right" label="操 作" align="center" width="180" :resizable="false">
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
                  <el-button
                      link
                      v-if="scope['row']['favorite'] === false"
                      size="small"
                      type="info"
                      :icon="HeartOff"
                      @click="handleCollectQuestion(scope['row'])"
                  >
                    未收藏
                  </el-button>
                  <el-button
                      link
                      v-else
                      size="small"
                      type="danger"
                      :icon="Heart"
                      @click="handleCancelCollectQuestion(scope['row'])"
                  >
                    已收藏
                  </el-button>
                </template>
              </el-table-column>
              <template #empty>
                <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
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
        </el-tab-pane>
        <el-tab-pane name="favorite">
          <template #label>
            <el-icon size="15" style="margin-right: 5px">
              <Heart/>
            </el-icon>
            <span>我的收藏</span>
          </template>
          <div class="public-box">
            <el-table
                border
                stripe
                size="small"
                :data="collectTableData"
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
              <el-table-column prop="trial_type" label="所属题库类型" align="center" width="120">
                <template #default="scope">
                  <span v-if="scope['row']['trial_type'] === 'public'">公共</span>
                  <span v-else>个人</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="试题状态" align="center" width="120">
                <template #default="scope">
                  <el-tag size="small" v-if="scope['row']['status'] === true" type="success">
                    <el-icon>
                      <Check/>
                    </el-icon>
                    有 效
                  </el-tag>
                  <el-tag size="small" v-else type="danger">
                    <el-icon>
                      <X/>
                    </el-icon>
                    无 效
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="created_user" label="创建人" align="center" width="120"/>
              <el-table-column prop="created_at" label="创建时间" align="center" width="180"/>
              <el-table-column prop="updated_at" label="更新时间" align="center" width="180"/>
              <el-table-column :resizable="false"/>
              <el-table-column fixed="right" label="操 作" align="center" width="180" :resizable="false">
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
                  <el-button
                      link
                      size="small"
                      type="info"
                      :icon="Heart"
                      @click="handleCancelCollectQuestion(scope['row'])"
                  >
                    取消收藏
                  </el-button>
                </template>
              </el-table-column>
              <template #empty>
                <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
              </template>
            </el-table>
            <div class="questions-main-pagination-box">
              <el-pagination
                  small
                  background
                  :total="collectTablePageTotal"
                  class="mt-4"
                  style="margin-top: 20px"
                  :default-page-size="collectPageSize"
                  layout="total, prev, pager, next"
                  @current-change="handleCollectCurrentChange"
              />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
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
          <el-tag style="margin-right: 10px" :icon="Bookmark">
            <el-icon><Tag /></el-icon>
            {{ detailData['type'] === 'select' ? '选择题' : '判断题' }}
          </el-tag>
          <el-tag style="margin-right: 10px" :icon="Bookmark">
            <el-icon><Tag /></el-icon>
            {{ detailData['trial_type'] === 'public' ? '公共题库' : '个人题库' }}
          </el-tag>
          <el-tag style="margin-right: 10px" :type="detailData['status'] ? 'success' : 'danger'">
            <el-icon><Tag /></el-icon>
            {{ detailData['status'] ? '有效' : '无效' }}
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
        <el-divider style="margin: 0"/>
        <div class="detail-base-info-box">
          <div class="base-info">
            <div class="base-info-item">
              <span style="margin-right: 10px">创建时间：</span>
              <span>{{ detailData['created_at'] }}</span>
            </div>
            <div class="base-info-item">
              <span style="margin-right: 10px">更新时间: </span>
              <span>{{ detailData['updated_at'] }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import './common.scss';
import {onMounted, reactive, ref} from "vue";
import {Questions} from "../../api";
import {ElMessage} from "element-plus";
import {BookCheck, Bookmark, Check, Heart, HeartOff, Info, Search, Tag, X} from "lucide-vue-next";
import {getCookie} from "../../utils/cookie.ts";

// 获取用户ID
const userId = JSON.parse(getCookie('UserInfo')).userId

// 处理切换页签时的请求变化
const handleTableChange = (tableName: string) => {
  const fetchData = tableName === 'public' ? getPublicWarehouseData : getFavoriteData;
  fetchData();
}

// 查询条件
const queryInfo = reactive({
  topic: null,
  type: null,
  status: true,
  is_deleted: false,
  created_user: null,
  trial_type: 'public',
  collector: userId
})
// 控制被激活的页签
const activeTab = ref('public')

// 处理查询逻辑
const handleQuery = () => {
  const fetchData = activeTab.value === 'public' ? getPublicWarehouseData : getFavoriteData;
  fetchData();
}

/**
 * 「 公共题库 」页签
 */

// 存储表格数据
const tableData: any = ref([])
// 当前页
const currentPage = ref(1)
// 每页数量
const pageSize = ref(50)
// 数据总数
const tablePageTotal = ref(0)

// 处理获取公共题库列表数据
const getPublicWarehouseData = () => {
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
          type: item.type,
          trial_type: item['trial_type'],
          options: item['options'],
          answer: item['answer'],
          status: item.status,
          favorite: item.favorite,
          created_at: item['created_at'],
          created_user: item['created_user_info']['name'],
          updated_at: item['updated_at'],
          updated_user: item['updated_user_info']['name'],
        })
      })
      tableData.value = tempData
      tablePageTotal.value = response.data.total
    }
  })
}

// 处理分页时当前页的变更事件（公共题库页签）
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getPublicWarehouseData()
}

onMounted(() => {
  getPublicWarehouseData()
})

// 处理收藏试题
const handleCollectQuestion = (itemData: any) => {
  Questions.collectQuestionApi(userId, itemData.id).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
    } else {
      ElMessage.success('试题收藏成功！')
      getPublicWarehouseData()
    }
  })
}

// 处理取消收藏试题
const handleCancelCollectQuestion = (itemData: any) => {
  Questions.cancelCollectQuestionApi(userId, itemData.id).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
    } else {
      ElMessage.success('取消收藏成功！')
      getPublicWarehouseData()
      getFavoriteData()
    }
  })
}

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

/**
 * 「 我的收藏 」页签
 */

// 存储表格数据
const collectTableData: any = ref([])
// 当前页
const collectCurrentPage = ref(1)
// 每页数量
const collectPageSize = ref(50)
// 数据总数
const collectTablePageTotal = ref(0)

// 处理获取我的收藏数据
const getFavoriteData = () => {
  Questions.getCollectQuestionsApi(userId, queryInfo, collectCurrentPage.value, collectPageSize.value).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      const tempData: any[] = []
      response.data.data.map((item: any) => {
        tempData.push({
          id: item['question_info'].id,
          topic: item['question_info'].topic,
          type: item['question_info'].type,
          trial_type: item['question_info']['trial_type'],
          options: item['question_info']['options'],
          answer: item['question_info']['answer'],
          status: item['question_info']['status'],
          created_at: item['question_info']['created_at'],
          created_user: item['question_info']['created_user_info']['name'],
          updated_at: item['question_info']['updated_at'],
          updated_user: item['question_info']['updated_user_info']['name'],
        })
      })
      collectTableData.value = tempData
      collectTablePageTotal.value = response.data.total
    }
  })
}

// 处理分页时当前页的变更事件（我的收藏页签）
const handleCollectCurrentChange = (val: any) => {
  collectCurrentPage.value = val
  getFavoriteData()
}
</script>

<style scoped lang="scss">
@import "../../style.scss";

@include tableHeaderStyle;

.questions-main-box {
  @include baseFlexStyle {
    flex-direction: column;
  }
}

.public-main-box {
  width: 100%;

  .public-box {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 300px);
  }
}

.questions-main-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}

:deep(.el-tabs__item) {
  font-size: 13px;
  color: #5e5e5e;
}

:deep(.is-active) {
  color: #409eff;
}
</style>