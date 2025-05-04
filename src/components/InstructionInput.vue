<template lang="">
  <div class="instruction-input">
    <h3>输入代码</h3>
    <Textarea
      v-model="inputCode"
      rows="10"
      cols="30"
      placeholder="请输入代码，每行一个MIPS指令"
      class="textarea"
    />
    <p v-if="!codeStore.isAvaliable" class="error-message">代码不合法，请检查</p>
    <Button label="提交" @click="submitCode" class="btn" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useCodeStore } from '@/stores/pipelineStore'

const inputCode = ref('')
const codeStore = useCodeStore()

const submitCode = () => {
  console.log('提交的代码:', inputCode.value)
  codeStore.setCode(inputCode.value)
}
</script>

<style scoped lang="scss">
h3 {
  margin-bottom: 1rem;
}

.instruction-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.textarea .btn {
  flex: 1;
  max-width: 500px;
}

.error-message {
  color: red;
  font-size: 1.5rem;
  margin-top: 0.5rem;
  text-align: center;
  width: 100%;
  max-width: 500px;
}
</style>
