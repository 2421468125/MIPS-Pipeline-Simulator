<template>
  <div class="pipeline-block" :class="stageClass">
    <span class="stage">{{ stage }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  stage: {
    type: String,
    required: true,
  },
})

const stageClass = computed(() => {
  switch (props.stage) {
    case 'IF':
      return 'stage-fetch'
    case 'ID':
      return 'stage-decode'
    case 'EX':
      return 'stage-execute'
    case 'MEM':
      return 'stage-memory'
    case 'WB':
      return 'stage-writeback'
    default:
      return ''
  }
})
</script>

<style scoped lang="scss">
.pipeline-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 50px; /* 调整高度以适配横向布局 */
  border: 2px solid #ec7cdb;
  border-radius: 8px;
  background-color: #f4eaf4;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #ebe2e8;
  text-align: center;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.pipeline-block:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.stage {
  text-transform: uppercase;
}

.stage-fetch {
  background-color: #e3f2fd;
  border-color: #2196f3;
  color: #1565c0;
}

.stage-decode {
  background-color: #ede7f6;
  border-color: #673ab7;
  color: #4527a0;
}

.stage-execute {
  background-color: #fff3e0;
  border-color: #ff9800;
  color: #ef6c00;
}

.stage-memory {
  background-color: #fbe9e7;
  border-color: #e64a19;
  color: #bf360c;
}

.stage-writeback {
  background-color: #e8f5e9;
  border-color: #4caf50;
  color: #2e7d32;
}
</style>
