<template>
  <div class="control-panel">
    <div class="button-group">
      <Button label="单步执行" @click="stepExecute" severity="success" raised />
      <Button label="执行到断点" @click="runToBreakpoint" severity="success" raised />
      <Button label="重置" @click="resetPipeline" severity="success" raised />
      <div class="toggle-switch">
        <p style="font-weight: bold">开启数据定向</p>
        <ToggleSwitch v-model="forwardingOpen" />
      </div>
      <Button label="Show" @click="visible = true" />
    </div>
    <table class="instruction-table">
      <thead>
        <tr>
          <th>行号</th>
          <th>指令</th>
          <th>断点</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(instruction, index) in instructionState"
          :key="index"
          @click="toggleBreakpoint(index)"
          :class="{ breakpoint: breakpoints.includes(index * 4) }"
          :style="{ color: getInstructionColor(index) }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ instruction[0] }}</td>
          <td>
            <span v-if="breakpoints.includes(index * 4)" class="red-dot"></span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <Dialog
    v-model:visible="visible"
    maximizable
    modal
    header="性能统计分析"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <p class="m-0" style="white-space: pre-wrap">
      {{ pipeline.getStatistics() }}
    </p>
  </Dialog>
</template>

<script setup>
import Button from 'primevue/button'
import ToggleSwitch from 'primevue/toggleswitch'
import Dialog from 'primevue/dialog'
import { useCodeStore, useHazardStore } from '@/stores/pipelineStore.js'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import Pipeline from '@/core/pipeline.js'

const CodeState = useCodeStore()
let { instructionState, breakpoints } = storeToRefs(CodeState)
let { forwardingOpen } = storeToRefs(useHazardStore())
let { addBreakpoint, removeBreakpoint, clearBreakpoint } = CodeState
const pipeline = Pipeline.getInstance()
const visible = ref(false)

let instuctionCompleted = computed(() => {
  // 0：未进行， 1：正在进行，2:已完成
  let result = []
  instructionState.value.forEach((item) => {
    if (item[item.length - 1] > 0) {
      result.push(2)
    } else if (item[1] === 0) {
      result.push(0)
    } else {
      result.push(1)
    }
  })
  return result
})

const stepExecute = () => {
  pipeline.runOneCycle()
}

const runToBreakpoint = () => {
  pipeline.runTillBreakpoint()
}

const resetPipeline = () => {
  pipeline.reset()
}

function toggleBreakpoint(index) {
  const pc = index * 4
  if (breakpoints.value.includes(pc)) {
    removeBreakpoint(pc)
  } else {
    addBreakpoint(pc)
  }
}

function getInstructionColor(index) {
  const status = instuctionCompleted.value[index]
  if (status === 2) return 'gray' // 已完成
  if (status === 1) return 'green' // 正在进行
  return 'black' // 未进行
}
</script>

<style lang="scss" scoped>
.control-panel {
  max-height: 350px;
  overflow: auto;
  padding: 16px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  .toggle-switch {
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.instruction-table {
  width: 100%;
  border-collapse: collapse;
}

.instruction-table th,
.instruction-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.instruction-table tr {
  cursor: pointer;
}

.instruction-table tr.breakpoint {
  background-color: #ffe6e6;
}

.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}
</style>
