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
          <span style="margin-left: 10px">模块信息</span>
        </div>
      </el-divider>
      <div class="paper-module-box">
        <div class="module-card-box">
          <div class="module-card-item" v-for="item in paperModules">
            <span class="del-module-icon"><el-icon><X/></el-icon></span>
            <span style="margin-bottom: 5px">{{ item['title'] }}</span>
            <span>{{ item['description'] }}</span>
          </div>
          <div class="add-module-card" v-if="paperModules.length < 4">
            <el-icon size="16" style="margin-bottom: 5px">
              <PackagePlus/>
            </el-icon>
            <span>新增模块</span>
          </div>
        </div>
        <el-button v-if="paperModules.length !== 0" type="primary" size="small" class="change-module-btn">
          <el-icon>
            <Combine/>
          </el-icon>
          <span style="font-size: 13px;margin-left: 10px">变 更 模 块</span>
        </el-button>
      </div>
      <el-divider content-position="left" style="margin: 20px 0 20px 0">
        <div class="divider-box">
          <el-icon>
            <Link/>
          </el-icon>
          <span style="margin-left: 10px">关联试题</span>
        </div>
      </el-divider>
      <div class="paper-link-box">
        <span class="paper-link-empty">暂无关联试题</span>
        <el-button type="primary" size="small" style="width: 400px;border-radius: 5px;">
          <el-icon>
            <Link/>
          </el-icon>
          <span style="font-size: 13px;margin-left: 10px">关 联 试 题</span>
        </el-button>
      </div>
    </div>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="changeDrawerVisible">取消</el-button>
        <el-button type="primary" @click="changeDrawerVisible">提交</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {onBeforeUpdate, ref, watch} from 'vue'
import {Paper} from '../../api';
import {ElMessage} from "element-plus";
import {Combine, Link, Package, PackagePlus, Smile, X} from "lucide-vue-next";
import {useLinkQuestionStore} from "../../stores/DrawerCommonStore.ts";

const props = defineProps({
  paperInfo: {
    type: Object,
    required: true
  },
})

// 从Store中获取，控制关联试题Drawer是否显示
const linkQuestionStore = useLinkQuestionStore()
const {changeDrawerVisible} = linkQuestionStore
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
    {key: '答题建议时长：', value: props.paperInfo['duration_minutes']},
    {key: '计划总分：', value: props.paperInfo['total_marks']},
  ]
  // 初始化实际分数
  actual_total.value = props.paperInfo['actual_total']
})

// 试卷模块信息
const paperModules = ref([])

// 获取试卷模块信息
const getPaperModule = () => {
  Paper.getPaperModuleApi(props.paperInfo['id']).then(response => {
    if (response.code !== 200) {
      ElMessage.error(response.msg)
    } else {
      paperModules.value = response.data
    }
  })
}

// 监听drawerVisible，当drawerVisible为true时，获取其他数据
watch(drawerVisible, (newValue) => {
  if (newValue) {
    getPaperModule()
  }
})
</script>

<style scoped lang="scss">
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
    align-items: center;

    .change-module-btn {
      width: 400px;
      border-radius: 5px;
    }

    .paper-module-empty {
      color: #b2b2b2;
      font-size: 13px;
      margin-bottom: 20px;
    }

    .module-card-box {
      width: 100%;
      display: grid;
      overflow: auto;
      margin-top: 10px;
      margin-bottom: 20px;
      grid-row-gap: 50px;
      grid-column-gap: 20px;
      justify-content: space-around;
      grid-template-columns: repeat(auto-fill, 160px);
      grid-template-rows: repeat(auto-fill, 60px);

      .add-module-card {
        width: 160px;
        height: 56px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        border-radius: 8px;
        border: 2px dashed rgba(34, 149, 255, 0.75);
        color: rgba(34, 149, 255);

        &:hover {
          cursor: pointer; // hover后鼠标变手指
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
        color: #fff;
        border-radius: 8px;
        background-color: rgba(34, 149, 255, 0.75);

        .del-module-icon {
          position: absolute;
          top: 8px;
          right: 8px;

          &:hover {
            cursor: pointer; // hover后鼠标变手指
          }
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

    .paper-link-empty {
      color: #b2b2b2;
      font-size: 13px;
      margin-bottom: 20px;
    }
  }
}
</style>