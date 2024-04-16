<template>
  <el-drawer
      :size="800"
      title="关联试题"
      v-model="drawerVisible"
      destroy-on-close
      :close-on-click-modal="false"
  >
    <div class="link-question-drawer-main">
      <el-divider content-position="left" style="margin: 0 0 20px 0">
        <div class="divider-box">
          <el-icon>
            <Smile/>
          </el-icon>
          <span style="margin-left: 10px">基础信息</span>
        </div>
      </el-divider>
      <div class="paper-base-info-box">
        <div class="paper-base-info-item" v-for="item in paperBaseInfo">
          <span>{{ item.key }}</span>
          <span>{{ item.value }}</span>
        </div>
        <div class="paper-base-info-item">
          <span>实际总分（会随着试题分数的变化而变化）：</span>
          <span>{{ actual_total }} 分</span>
        </div>
      </div>
      <el-divider content-position="left" style="margin: 20px 0 20px 0">
        <div class="divider-box">
          <el-icon>
            <Package/>
          </el-icon>
          <span style="margin-left: 10px;">模块信息</span>
          <span style="font-size: 13px;color: #7d7d7d">（ 最多增加4个模块 ）</span>
        </div>
      </el-divider>
      <div class="paper-module-box">
        <el-button
            v-if="paperModules.length !== 0 && !props.paperInfo['is_published']"
            type="primary"
            size="small"
            :icon="Repeat"
            @click="handleOpenChangeModuleDialog"
        >
          变 更 模 块
        </el-button>
        <div class="module-card-box">
          <div class="module-card-item" v-for="(item, index) in paperModules">
            <span v-if="!props.paperInfo['is_published']" class="del-module-icon" @click="handleDeleteModule(item)">
              <el-icon><X class="x-animation"/></el-icon>
            </span>
            <span class="module-number" style="left: 8px;top: 8px;">
              <el-image style="width: 15px; " src="src/images/Number.png" fit="cover" />
              <span style="margin-left: 3px">{{ index + 1 }}</span>
            </span>
            <span style="margin-bottom: 5px">{{ item['title'] }}</span>
            <span>{{ item['description'] }}</span>
          </div>
          <div
              v-if="paperModules.length < 4 && !props.paperInfo['is_published']"
              class="add-module-card"
              @click="handleOpenModuleDialog('C')"
          >
            <el-icon size="16" style="margin-bottom: 5px">
              <PackagePlus/>
            </el-icon>
            <span>新增模块</span>
          </div>
        </div>
      </div>
      <el-divider content-position="left" style="margin: 20px 0 20px 0">
        <div class="divider-box">
          <el-icon>
            <Link/>
          </el-icon>
          <span style="margin-left: 10px">关联试题</span>
          <span style="font-size: 13px;color: #7d7d7d">（ 模块为空时，无法关联试题 ）</span>
        </div>
      </el-divider>
      <div class="paper-link-box">
        <el-image v-if="paperModules.length === 0" style="width: 250px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
        <el-tabs v-else v-model="linkActivePane" style="width: 100%;" @tab-change="getPaperQuestionsByModule">
          <el-tab-pane v-for="(item, index) in paperModules" :name="index">
            <template #label>
              <span class="custom-tabs-label">
                <el-icon><Box/></el-icon>
                <span style="margin-left: 8px;">{{ item['title'] }}</span>
              </span>
            </template>
            <div class="module-link-pane-main">
              <div class="link-btn" v-if="!props.paperInfo['is_published']">
                <el-button type="primary" size="small" :icon="Link" @click="handleOpenQuestionWarehouseDialog(item)">关 联 试 题</el-button>
              </div>
              <el-image v-if="paperQuestionsByModule.length === 0" style="width: 250px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
              <draggable
                  v-else
                  :list="paperQuestionsByModule"
                  item-key="name"
                  class="paper-module-questions-list"
                  ghost-class="ghost"
                  handle=".handle"
                  @end="handleDragEndForQuestion"
              >
                <template #item="{ element, index }">
                  <div class="list-group-item">
                    <el-icon style="margin: 0 20px" :class="props.paperInfo['is_published'] ? '' : 'handle'"><AlignJustify /></el-icon>
                    <el-divider direction="vertical" style="height: 50%;margin: 0" />
                    <div style="width:40px; display: flex;justify-content: center">
                      <el-tooltip v-if="element['question_detail']['type'] === 'judge'" content="判断题" placement="top">
                        <el-image style="width: 18px;" src="src/images/JudgeIcon.png" fit="cover"/>
                      </el-tooltip>
                      <el-tooltip v-else content="选择题" placement="top">
                        <el-image style="width: 18px;" src="src/images/SelectIcon.png" fit="cover"/>
                      </el-tooltip>
                    </div>
                    <span class="item-content-box">{{ index + 1 }}. {{ element['question_detail']['topic'] }}</span>
                    <el-divider direction="vertical"  style="height: 50%;margin: 0" />
                    <div style="width: 70px;display: flex;justify-content: center">
                      <span>{{ element['marks'] }} 分</span>
                    </div>
                    <el-divider direction="vertical"  style="height: 50%;margin: 0"  v-if="!props.paperInfo['is_published']" />
                    <div class="item-opt-box" v-if="!props.paperInfo['is_published']">
                      <el-tooltip content="编辑" placement="top">
                        <el-button link class="item-opt-box-item" :icon="PencilLine" type="primary" @click="handleOpenEditQuestionDialog(element)"/>
                      </el-tooltip>
                      <el-tooltip content="取消关联" placement="top">
                        <el-button link class="item-opt-box-item" :icon="Unlink" type="danger" @click="handleCancelLink(element)"/>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <questions-warehouse-drawer :module="activeModulePane" :link-questions="paperQuestionsByModule"/>
  </el-drawer>
  <el-dialog
      width="800"
      :title="optType === 'C' ? '新增模块' : '编辑模块'"
      draggable
      destroy-on-close
      v-model="moduleDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseModuleDialog(moduleFormRef)"
  >
    <el-form :model="moduleFormData" ref="moduleFormRef">
      <el-form-item label="模块名称" :label-width="formLabelWidth" prop="title" required>
        <el-input v-model="moduleFormData.title" placeholder="请输入模块名称" clearable/>
      </el-form-item>
      <el-form-item label="模块描述" :label-width="formLabelWidth" prop="description" required>
        <el-input v-model="moduleFormData.description" placeholder="请输入模块描述" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="moduleDialogVisible = false" :icon="Ban">取 消</el-button>
        <el-button type="primary" @click="handleSubmitModule(moduleFormRef)" :icon="Send">提 交</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      width="800"
      title="模块变更"
      draggable
      destroy-on-close
      v-model="moduleChangeDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseChangeModuleDialog"
  >
    <draggable
        v-if="sortModuleListData.length !== 0"
        :list="sortModuleListData"
        item-key="name"
        class="list-group"
        ghost-class="ghost"
        handle=".handle"
        @end="handleDragEnd"
    >
      <template #item="{ element, index }">
        <div class="list-group-item">
          <el-icon style="margin: 0 20px" class="handle"><AlignJustify /></el-icon>
          <el-divider direction="vertical" style="height: 50%;margin: 0" />
          <span class="item-content-box">{{ index + 1 }}. {{ element.title }} ( {{ element.description }} )</span>
          <el-divider direction="vertical"  style="height: 50%;margin: 0" />
          <div class="item-opt-box">
            <el-button
                link
                class="item-opt-box-item"
                :icon="PencilLine"
                type="primary"
                @click="handleOpenModuleDialog('E', element)"
            />
            <el-button
                link
                class="item-opt-box-item"
                :icon="Trash2"
                type="danger"
                @click="handleDeleteModule(element)"
            />
          </div>
        </div>
      </template>
    </draggable>
    <div v-else class="module-change-empty">
      <el-image style="width: 300px;opacity: 0.8" src="src/images/noData.png" fit="cover"/>
    </div>
  </el-dialog>
  <el-dialog
      width="600"
      title="编辑试题分数"
      draggable
      destroy-on-close
      v-model="editQuestionDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="editQuestionDialogVisible = false"
  >
    <el-form :model="editQuestionFormData" ref="editQuestionFormRef">
      <el-form-item label="试题分数" :label-width="formLabelWidth" prop="marks" required>
        <el-input v-model="editQuestionFormData.marks" placeholder="请输入试题分数" clearable>
          <template #append>分</template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editQuestionDialogVisible = false" :icon="Ban">取 消</el-button>
        <el-button type="primary" @click="handleSubmitEditQuestion(editQuestionFormRef)" :icon="Send">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import {storeToRefs} from 'pinia'
import {onBeforeUpdate, ref, watch} from 'vue'
import {Paper} from '../../api';
import {ElMessage, ElMessageBox} from "element-plus";
import type {FormInstance} from 'element-plus'
import { getCookie } from "../../utils/cookie.ts";
import {
  Repeat, Link, Package, PackagePlus, Smile, X, Ban,
  Send, AlignJustify, Trash2, PencilLine, Box, Unlink
} from "lucide-vue-next";
import {useQuestionsWarehouseStore, useLinkQuestionStore} from "../../stores/DrawerCommonStore.ts";
import QuestionsWarehouseDrawer from "./QuestionsWarehouseDrawer.vue";

// 获取登录用户ID
const userId = JSON.parse(getCookie('UserInfo')).userId

const props = defineProps({
  paperInfo: {
    type: Object,
    required: true
  },
})

// 从Store中获取，控制关联试题Drawer是否显示
const linkQuestionStore = useLinkQuestionStore()
const {drawerVisible} = storeToRefs(linkQuestionStore)

// 试卷基础信息
const paperBaseInfo: any = ref([])
// 试卷实际总分
const actual_total = ref(0)
onBeforeUpdate(() => {
  // 更新试卷基础信息
  paperBaseInfo.value = [
    {key: '试卷标题：', value: props.paperInfo['title']},
    {key: '试卷描述：', value: props.paperInfo['description']},
    {key: '答题建议时长：', value: props.paperInfo['duration_minutes']  + ' 分钟'},
    {key: '计划总分：', value: props.paperInfo['total_marks'] + ' 分'},
  ]
  // 初始化实际分数
  actual_total.value = props.paperInfo['actual_total']
})

// 试卷模块信息
const paperModules = ref([])

// 获取试卷模块信息
const getPaperModule = async () => {
  await Paper.getPaperModuleApi(props.paperInfo['id']).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
    } else {
      paperModules.value = response.data
      sortModuleListData.value = response.data
    }
  })
}

// 存储模块下试题信息
const paperQuestionsByModule = ref([])

// 根据模块获取试卷关联的试题信息
const getPaperQuestionsByModule = (moduleIndex: number) => {
  Paper.getPaperQuestionsApi(props.paperInfo['id']).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      // 重新计算关联后的分数总和
      actual_total.value = 0
      for (const item of response.data) {
        actual_total.value += item['marks']
      }
      // 筛选出激活模块下关联的试题信息
      paperQuestionsByModule.value = response.data.filter((item: any) =>
          item['module'] == paperModules.value[moduleIndex]['id']
      )
    }
  })
}

// 监听drawerVisible，当drawerVisible为true时，获取其他数据
watch(drawerVisible, (newValue) => {
  if (newValue) {
    // 初始化关联用例的默认tab
    linkActivePane.value = 0
    // 获取试卷-模块信息
    getPaperModule().then(() => {
      // 根据模块获取试题信息（初始化）
      getPaperQuestionsByModule(0)
    })
  }
})

// 处理删除模块逻辑
const handleDeleteModule = (itemData: any) => {
  ElMessageBox.confirm(
      '您确定要删除模块吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  ).then(() => {
    const { id, paper_id } = itemData
    Paper.delPaperModuleApi(id, paper_id).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('删除模块成功！')
      // 刷新模块数据
      getPaperModule()
    })
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

// Dialog中Form Label的通用宽度
const formLabelWidth = '90px'
// 控制新增&编辑模块Dialog是否显示
const moduleDialogVisible = ref(false)
// 新增模块表单的Ref
const moduleFormRef = ref<FormInstance>()
// FormData 初始化
const initFormData = {
  title: '',
  description: '',
  paper_id: '',
  created_user: userId
}
const optType = ref('C')
// 试卷模块 FormData
const moduleFormData = ref(initFormData)
// 处理打开Module Dialog
const handleOpenModuleDialog = (opt: string, itemData?: any) => {
  if (opt === 'E') {
    moduleFormData.value = itemData
  } else {
    moduleFormData.value.paper_id = props.paperInfo['id']
  }
  optType.value = opt
  moduleDialogVisible.value = true
}
// 处理关闭Module Dialog
const handleCloseModuleDialog = (moduleFormEl: any) => {
  moduleDialogVisible.value = false
  moduleFormData.value = initFormData
  moduleFormEl.resetFields()
}
// 处理提交模块信息
const handleSubmitModule = (moduleFormEl: any) => {
  moduleFormEl.validate(async (result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的模块信息后重新提交！')
      return
    }
    try {
      const response = optType.value === 'C'
          ? await Paper.createPaperModuleApi(moduleFormData.value)
          : await Paper.editPaperModuleApi({...moduleFormData.value, updated_user: userId})
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      moduleDialogVisible.value = false
      ElMessage.success(optType.value === 'C' ? '新增模块成功！' : '编辑模块成功！')
      await getPaperModule()
    } catch (error) {
      console.error('An error occurred:', error)
    }
  })
}

// 控制变更模块Dialog是否显示
const moduleChangeDialogVisible = ref(false)
// 处理打开变更模块Dialog
const handleOpenChangeModuleDialog = () => {
  moduleChangeDialogVisible.value = true
}
// 处理关闭变更模块Dialog
const handleCloseChangeModuleDialog = () => {
  moduleChangeDialogVisible.value = false
}

// 存储模块排序的模块信息
const sortModuleListData = ref([])
// 拖拽结束，更新数据
const handleDragEnd = () => {
  const modules: any = []
  // 重构模块数据
  for (let [index, value] of sortModuleListData.value.entries()) {
    modules.push({
      id: value['id'],
      index: index + 1,
      updated_user: userId
    })
  }
  // 更新模块顺序
  Paper.paperModuleSortApi(modules).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      ElMessage.success('模块重新排序成功')
      getPaperModule()
    }
  })
}

// 关联试题的激活页签
const linkActivePane = ref(0)
// 激活的Tab页签模块信息
const activeModulePane = ref({})

// 处理拖拽关联的试题信息
const handleDragEndForQuestion = () => {
  const linkQuestions: any = []
  // 重构关联的试题数据
  for (let [index, value] of paperQuestionsByModule.value.entries()) {
    linkQuestions.push({
      id: value['id'],
      index: index + 1
    })
  }
  // 更新关联的试题顺序
  Paper.linkQuestionsSortApi(linkQuestions).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
      return
    } else {
      ElMessage.success('试题重新排序成功')
      // 刷新激活模块的试题数据
      getPaperQuestionsByModule(linkActivePane.value)
    }
  })
}

// 处理取消关联
const handleCancelLink = (questionInfo: any) => {
  ElMessageBox.confirm(
      '您确定要取消关联吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }
  ).then(() => {
    const { id } = questionInfo
    Paper.deletePaperQuestionApi(id).then(response => {
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      }
      ElMessage.success('取消关联成功！')
      // 刷新激活模块的试题数据
      getPaperQuestionsByModule(linkActivePane.value)
    })
  }).catch(() => {})
}

// 从Store中获取，控制关联试题-题库Drawer是否显示
const questionsWarehouse = useQuestionsWarehouseStore()
const { changeDrawerVisible } = questionsWarehouse
const { drawerVisibleQW } = storeToRefs(questionsWarehouse)

// 处理打开关联试题题库Drawer
const handleOpenQuestionWarehouseDialog = (moduleInfo: any) => {
  if (paperModules.value.length === 0) {
    ElMessage.warning('没有模块无法关联试题！请添加模块后重试！')
    return
  } else {
    activeModulePane.value = moduleInfo
    changeDrawerVisible()
  }
}

watch(drawerVisibleQW, (newValue) => {
  // 监听关联试题Drawer状态，当关闭时，刷新已绑定试题列表
  if (!newValue) {
    getPaperQuestionsByModule(linkActivePane.value)
  }
})

const editQuestionDialogVisible = ref(false)
// 编辑试题信息Ref
const editQuestionFormRef = ref<FormInstance>()
// 编辑试题信息FormData
const editQuestionFormData: any = ref({})
// 处理打开编辑试题Dialog
const handleOpenEditQuestionDialog = (questionInfo: any) => {
  editQuestionFormData.value = questionInfo
  editQuestionDialogVisible.value = true
}
// 处理提交编辑后的试题信息
const handleSubmitEditQuestion = (formEl: any) => {
  formEl.validate(async (result: boolean) => {
    if (!result) {
      ElMessage.warning('请输入完整的模块信息后重新提交！')
      return
    }
    const requestData = editQuestionFormData.value
    Paper.editPaperQuestionApi(requestData).then(response =>{
      if (response.code !== 200) {
        ElMessage.error(response.msg)
        return
      } else {
        ElMessage.success('试题信息编辑成功！')
        getPaperQuestionsByModule(linkActivePane.value)
        editQuestionDialogVisible.value = false
      }
    })
  })
}
</script>

<style scoped lang="scss">
.list-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  .handle {
    &:hover {
      cursor: move; // hover后鼠标变十字拖动ICON
    }
  }
  .list-group-item {
    width: 100%;
    height: 40px;
    display: flex;
    margin-bottom: 15px;
    border-radius: 8px;
    box-shadow: #cccccc 0 0 5px;
    align-items: center;
    color: #5e5e5e;
    .item-content-box {
      width: 580px;
      margin: 0 20px;
      white-space: nowrap; /* 防止文字换行 */
      overflow: hidden; /* 隐藏溢出的内容 */
      text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
    }
    .item-opt-box {
      display: flex;
      margin: 0 20px;
      .item-opt-box-item {
        margin: 0 15px;
        &:hover {
          cursor: pointer; // hover后鼠标变手指
        }
      }
    }
  }
}
.link-question-drawer-main {
  width: 100%;
  display: flex;
  flex-direction: column;

  .divider-box {
    display: flex;
    align-items: center;
    color: #5e5e5e;
  }

  .paper-base-info-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: #5e5e5e;
    font-size: 13px;

    .paper-base-info-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }

  .paper-module-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: end;

    .module-card-box {
      width: 100%;
      display: grid;
      overflow: auto;
      margin-top: 10px;
      margin-bottom: 20px;
      grid-row-gap: 50px;
      grid-column-gap: 20px;
      justify-content: space-around;
      align-items: center;
      grid-template-columns: repeat(auto-fill, 160px);
      grid-template-rows: repeat(auto-fill, 72px);

      .add-module-card {
        width: 160px;
        height: 56px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        border-radius: 8px;
        border: 2px dashed rgba(34, 149, 255);
        color: rgba(34, 149, 255);

        &:hover {
          cursor: pointer; // hover后鼠标变手指
          border: 2px dashed rgb(116, 187, 255);
          color: rgb(116, 187, 255);
        }
      }

      .module-card-item {
        position: relative;
        width: 160px;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        color: #5e5e5e;
        border-radius: 8px;
        box-shadow: #cccccc 0 0 5px;

        .del-module-icon {
          position: absolute;
          top: 8px;
          right: 8px;

          &:hover {
            cursor: pointer; // hover后鼠标变手指
          }
        }

        .module-number {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
        }
      }
    }
  }

  .paper-link-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .custom-tabs-label {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .module-link-pane-main {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .link-btn {
        width: 100%;
        display: flex;
        margin-top: 10px;
        justify-content: end;
      }

      .paper-module-questions-list {
        width: 100%;
        height: calc(100vh - 600px);
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        margin-top: 20px;

        .list-group-item {
          width: 97%;
          min-height: 40px;
          display: flex;
          margin: 6px 0;
          border-radius: 8px;
          box-shadow: #cccccc 0 0 5px;
          align-items: center;
          color: #5e5e5e;
          font-size: 13px;

          .handle {
            &:hover {
              cursor: move; // hover后鼠标变十字拖动ICON
            }
          }

          .item-content-box {
            width: 505px;
            margin: 0 10px;
            white-space: nowrap; /* 防止文字换行 */
            overflow: hidden; /* 隐藏溢出的内容 */
            text-overflow: ellipsis; /* 使用省略号表示溢出的文本 */
          }

          .item-opt-box {
            display: flex;
            margin: 0 10px;
            .item-opt-box-item {
              margin: 0 10px;
              &:hover {
                cursor: pointer; // hover后鼠标变手指
              }
            }
          }
        }
      }
    }
  }
}

.x-animation {
  &:hover {
    animation: rotate 500ms linear;
  }

  /* 旋转动画 */
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(90deg);
    }
  }
}

.module-change-empty {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center
}

:deep(.el-tabs__item) {
  font-size: 13px;
  color: #5e5e5e;
}

:deep(.is-active) {
  color: #409eff;
}
</style>