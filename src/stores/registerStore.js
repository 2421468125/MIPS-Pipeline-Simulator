import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useRegisterStore = defineStore('register', () => {
  const register = ref(Array.from({ length: 32 }, () => 0))
  const pc = ref(0)

  const getRegValue = (index) => {
    if (index < 0 || index > 31) return null
    return register.value[index]
  }

  const setRegValue = (index, value) => {
    if (index < 1 || index > 31) return null // $0 is read only
    register.value[index] = value
  }

  const setPC = (value) => {
    pc.value = value
  }

  const getPC = () => {
    return pc.value
  }

  return { register, pc, getRegValue, setRegValue, getPC, setPC }
})
