import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
const MemorySize = 1024

export const useMemoryStore = defineStore('memory', () => {
  const memory = ref(Array.from({ length: MemorySize }, () => 0))
  const memoryCount = {
    getMemoryValue: 0,
    setMemoryValue: 0,
  }

  const getMemoryValue = (index, digits = 4) => {
    if (index < 0 || index >= MemorySize - digits) return null
    let value = 0
    for (let i = 0; i < digits; i++) {
      value |= memory.value[index + i] << (i * 8)
    }
    memoryCount.getMemoryValue++
    return value
  }

  const setMemoryValue = (index, value, digits = 4) => {
    if (index < 0 || index >= MemorySize - digits) return null

    for (let i = 0; i < digits; i++) {
      memory.value[index + i] = value & 0xff
      value = value >> 8
    }
    memoryCount.setMemoryValue++
  }

  function resetMemory() {
    memory.value = Array.from({ length: MemorySize }, () => 0)
    memoryCount.getMemoryValue = 0
    memoryCount.setMemoryValue = 0
  }
  return { memory, memoryCount, getMemoryValue, setMemoryValue, resetMemory }
})
