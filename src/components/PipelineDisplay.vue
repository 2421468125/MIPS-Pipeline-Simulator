<template>
  <div class="pipeline-display" v-if="showdInstructionState" :style="gridStyle">
    <div class="time-steps">
      <div v-for="step in time" :key="step" style="width: 100px; height: 50px; text-align: center">
        {{ step }}
      </div>
    </div>
    <PipelineStage
      v-for="(stat, index) in instructions.status"
      :key="index"
      :t="time"
      :code="instructions.code[index]"
      :codeindex="instructions.index[index]"
      :status="stat"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PipelineStage from './PipelineStage.vue'
import { useCodeStore } from '@/stores/pipelineStore'
import { storeToRefs } from 'pinia'
const CodeState = useCodeStore()
const { instructionState, breakpoints, time } = storeToRefs(CodeState)
const showdInstructionState = computed(() => {
  console.log(
    'instructionState',
    instructionState.value.filter((inst) => inst[1] !== 0),
  )
  return instructionState.value.filter((inst) => inst[1] !== 0)
})
const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: '1fr', // 单列布局
    gridAutoRows: '50px', // 每行高度固定为 50px
    gap: '10px', // 间隔固定为 10px
    height: `${(showdInstructionState.value.length + 2) * 60}px`, // 动态高度：每个指令占 50px 高度 + 10px 间隔
    width: `${(time.value + 2) * 100}px`,
    padding: '20px',
  }
})

let instructions = computed(() => {
  return parserInstruction(showdInstructionState.value)
})

// function addInstruction(newInstruction) {
//   instructions.value.push(newInstruction)
// }

// function incrementTimeStep() {
//   instructions.value.forEach((instruction) => {
//     instruction.status.push('')
//   })
// }

function parserInstruction(instructionArg) {
  if (instructionArg.length === 0 || instructionArg === null) return { code: [], status: [] }
  return {
    code: instructionArg.map((inst) => inst[0]),
    status: instructionArg.map((inst) => inst.slice(1)),
    index: instructionArg.map((inst) => instructionState.value.indexOf(inst) + 1),
  }
}
</script>

<style lang="scss" scoped>
.pipeline-display {
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: scroll scroll; /* 添加滚动条 */
  white-space: nowrap; /* 禁止内容换行 */
  max-width: 1000px; /* 最大宽度 */
  max-height: 480px; /* 最大高度 */
}

.time-steps {
  width: auto;
  display: flex;
  gap: 4px;
  box-sizing: border-box;
  padding-top: 10px;
  padding-left: 120px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  .p {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
