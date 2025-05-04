<template>
  <div class="hazard-info">
    <Toast />
  </div>
</template>

<script setup>
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { watch } from 'vue'
import { useHazardStore } from '@/stores/pipelineStore'

const toast = useToast()
const hazardStore = useHazardStore()

// 监听 dataHazard 和 controlHazard 的变化
watch(
  () => hazardStore.dataHazard,
  (newValue) => {
    if (newValue > 0) {
      for (let i = 0; i < newValue; i++) {
        toast.add({
          severity: 'warn',
          summary: 'Data Hazard',
          detail: `Register ${hazardStore.dataHazardRegister[i]} encountered a data hazard`,
          life: 3000,
        })
      }
      hazardStore.clearDataHazard()
    }
  },
)

watch(
  () => hazardStore.controlHazard,
  (newValue) => {
    if (newValue > 0) {
      for (let i = 0; i < newValue; i++) {
        toast.add({
          severity: 'error',
          summary: 'Control Hazard',
          detail: `Control hazard detected, jumping to PC: ${hazardStore.controlHazardPC[i]}`,
          life: 3000,
        })
      }
      hazardStore.clearControlHazard()
    }
  },
)
</script>

<style lang="scss">
.hazard-info {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
