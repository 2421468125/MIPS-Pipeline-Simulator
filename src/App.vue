<template>
  <div class="app-container">
    <header class="app-header">
      <h1>MIPS Pipeline Simulator</h1>
    </header>
    <main class="app-main">
      <section class="pipeline-display">
        <PipelineDisplay />
      </section>
      <section class="control-panel">
        <ControlPanel />
      </section>
      <section class="instruction-input">
        <InstructionInput />
      </section>
      <section class="register-file">
        <RegisterFile />
      </section>
      <section class="memory-display">
        <MemoryDisplay />
      </section>
      <HazardInfo />
    </main>
  </div>
</template>

<script setup>
import InstructionInput from '@/components/InstructionInput.vue'
import PipelineDisplay from '@/components/PipelineDisplay.vue'
import RegisterFile from '@/components/RegisterFile.vue'
import MemoryDisplay from '@/components/MemoryDisplay.vue'
import ControlPanel from './components/ControlPanel.vue'
import HazardInfo from './components/HazardInfo.vue'
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  gap: 16px;
}

.app-header {
  text-align: center;
  margin-bottom: 16px;
}

.app-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
  width: 100%;
  max-width: 1200px;
}

.pipeline-display {
  grid-column: span 2;
}

.control-panel,
.instruction-input,
.register-file,
.memory-display {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #f9f9f9;
}
</style>
