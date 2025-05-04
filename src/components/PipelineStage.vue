<template>
  <div class="pipeline-stage">
    <div class="code">{{ props.codeindex + '  ' + props.code }}</div>
    <div class="row" v-for="(stage, index) in stages" :key="index">
      <PipelineBlock :stage="stage" :code="props.code" />
    </div>
  </div>
</template>

<script setup>
import PipelineBlock from './PipelineBlock.vue'
import { computed } from 'vue'
const props = defineProps({
  t: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: Array,
    required: true,
  },
  codeindex: {
    type: Number,
    required: true,
  },
})

const stages = computed(() => {
  if (props.status.length === 0) return []
  let stage = Array(props.t).fill('')
  const stageNames = ['IF', 'ID', 'EX', 'MEM', 'WB']
  for (let i = 0; i < props.status.length; i++) {
    if (props.status[i] > 0) {
      stage[props.status[i] - 1] = stageNames[i]
    }
  }
  return stage
})
</script>

<style scoped>
.container {
  white-space: nowrap; /* 防止换行 */
  display: inline-block;
  vertical-align: top;
  width: 100%;
}

.pipeline-stage {
  white-space: nowrap;
  width: auto;
  display: flex;
  /* grid-template-columns: repeat(auto-fill, 100px); */
  /* grid-auto-rows: 50px; */
  gap: 4px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.row {
  display: contents;
}

.code {
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}
</style>
