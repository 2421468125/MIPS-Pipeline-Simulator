import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useRegisterStore = defineStore('register', () => {
  const register = ref(Array.from({ length: 32 }, () => 0))
  const pc = ref(0)
  const registerCount = {
    getRegValue: 0,
    setRegValue: 0,
  }

  const getRegValue = (index) => {
    if (index < 0 || index > 31) return null
    if (index !== 0) registerCount.getRegValue++
    return register.value[index]
  }

  const setRegValue = (index, value) => {
    if (index < 1 || index > 31) return null // $0 is read only
    registerCount.setRegValue++
    register.value[index] = value
  }

  const setPC = (value) => {
    pc.value = value
  }

  const getPC = () => {
    return pc.value
  }

  function resetRegister() {
    register.value = Array.from({ length: 32 }, () => 0)
    pc.value = 0
    registerCount.getRegValue = 0
    registerCount.setRegValue = 0
  }

  return { register, pc, registerCount, getRegValue, setRegValue, getPC, setPC, resetRegister }
})
