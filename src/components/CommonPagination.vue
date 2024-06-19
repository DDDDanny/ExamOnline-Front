<template>
  <div class="common-pagination-box">
    <el-pagination
        small
        background
        :total="props.tablePageTotal"
        class="mt-4"
        style="margin-top: 20px"
        :default-page-size="pageSize"
        layout="total, prev, pager, next"
        @current-change="props.handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  tablePageTotal: { type: Number, required: true },
  pageSize: { type: Number, required: true },
  handleCurrentChange: { type: Function, required: true },
})

</script>

<style scoped lang="scss">
.common-pagination-box {
  width: 100%;
  display: flex;
  justify-content: flex-end
}
</style>