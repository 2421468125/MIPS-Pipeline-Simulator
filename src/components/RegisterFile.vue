<template>
  <div class="register-file">
    <div class="pc">PC: {{ pc }}</div>
    <div class="registers">
      <div v-for="(value, index) in register" :key="index" class="register">
        ${{ index }}: {{ value }}
      </div>
    </div>
    <button @click="incrementValues">测试按钮</button>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRegisterStore } from '@/stores/registerStore.js'
const registerStore = useRegisterStore()
const { register, pc } = storeToRefs(registerStore)
const { getRegValue, setPC, setRegValue } = registerStore

// 定义一个方法来增加 PC 和 $2 的值
const incrementValues = () => {
  setPC(pc.value + 4)
  setRegValue(2, getRegValue(2) + 4)
}
</script>

<style lang="scss" scoped>
.register-file {
  width: 400px;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.pc {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.registers {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 列布局 */
  gap: 10px;
}

.register {
  font-size: 14px;
  font-family: Arial, sans-serif;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
