import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import instructionParser from '@/core/instructionParser'
export const useCodeStore = defineStore('code', () => {
  const code = ref('')
  const instructionState = ref([])
  const breakpoints = ref([])
  const time = ref(0)

  const parser = instructionParser()

  const codeList = computed(() => {
    return code.value
      .trim()
      .split('\n')
      .filter((line) => line !== '')
  })
  const codeCount = computed(() => {
    return instructions.value.length
  })
  const isAvaliable = computed(() => {
    try {
      parser(codeList.value)
      return true
    } catch (e) {
      console.log('code error', e)
      return false
    }
  })

  const instructions = computed(() => {
    if (!isAvaliable.value) return []
    return parser(codeList.value)
  })

  const getInstructionByPC = (pc) => {
    if (pc < 0 || pc / 4 >= instructions.value.length) return ['nop', 'add', 'r', 0, 0, 0, 0, 0]
    return instructions.value[pc / 4]
  }

  function isEnd(pc) {
    return pc / 4 >= instructions.value.length + 3
  }

  watch(
    () => code.value,
    (newCode) => {
      resetAllInstructionState()
      // test code
      // instructionState.value.forEach((inst, index) => {
      //   inst[1] = index + 1
      //   inst[2] = index + 2
      //   inst[3] = index + 3
      //   inst[4] = index + 4
      //   inst[5] = index + 5
      // })
    },
  )

  function setCode(str) {
    console.log('setCode', str)
    code.value = str.toLowerCase()
  }

  function testInstructionState() {
    setCode(
      `addi $0 $0 5
      addi $1 $0 10
      add $2 $0 $1
      load $3 0($2)
      store $3 4($2)`,
    )
  }

  function setInstructionState(pc, state, time) {
    let index = -1
    switch (state) {
      case 'IF':
        index = 1
        break
      case 'ID':
        index = 2
        break
      case 'EX':
        index = 3
        break
      case 'MEM':
        index = 4
        break
      case 'WB':
        index = 5
        break
      default:
        break
    }
    instructionState.value[pc / 4][index] = time
  }

  function resetInstructionState(pc) {
    if (pc < 0 || pc / 4 >= instructions.value.length) return
    instructionState.value[pc / 4] = [instructions.value[pc / 4][0], 0, 0, 0, 0, 0]
  }

  function resetAllInstructionState() {
    instructionState.value = instructions.value.map((inst, index) => [inst[0], 0, 0, 0, 0, 0])
  }
  function addBreakpoint(pc) {
    if (breakpoints.value.includes(pc)) return
    breakpoints.value.push(pc)
  }

  function removeBreakpoint(pc) {
    const index = breakpoints.value.indexOf(pc)
    if (index === -1) return
    breakpoints.value.splice(index, 1)
  }

  function clearBreakpoint() {
    breakpoints.value = []
  }
  function getBreakpoint() {
    return breakpoints.value
  }

  function isBreakpoint(pc) {
    if (breakpoints.value.includes(pc)) {
      return true
    }
    return false
  }

  function incrementTime() {
    time.value++
  }

  function resetTime() {
    time.value = 0
  }

  return {
    code,
    codeCount,
    codeList,
    isAvaliable,
    setCode,

    instructions,
    instructionState,
    getInstructionByPC,
    testInstructionState,
    setInstructionState,
    resetInstructionState,
    resetAllInstructionState,
    isEnd,

    breakpoints,
    addBreakpoint,
    removeBreakpoint,
    clearBreakpoint,
    getBreakpoint,
    isBreakpoint,

    time,
    incrementTime,
    resetTime,
  }
})

export const useHazardStore = defineStore('hazard', () => {
  const dataHazard = ref(0)
  const controlHazard = ref(0)
  const dataHazardRegister = ref([])
  const controlHazardPC = ref([])
  const forwardingOpen = ref(true)
  const hazardCount = {
    dataHazard: 0,
    controlHazard: 0,
  }

  function setDataHazard(register) {
    hazardCount.dataHazard++
    dataHazard.value++
    dataHazardRegister.value.push(register)
  }

  function setControlHazard(pc) {
    hazardCount.controlHazard++
    controlHazard.value++
    controlHazardPC.value.push(pc)
  }

  function clearDataHazard() {
    dataHazard.value = 0
    dataHazardRegister.value = []
  }

  function clearControlHazard() {
    controlHazard.value = 0
    controlHazardPC.value = []
  }

  function resetHazardCount() {
    hazardCount.dataHazard = 0
    hazardCount.controlHazard = 0
  }

  return {
    dataHazard,
    controlHazard,
    dataHazardRegister,
    controlHazardPC,
    hazardCount,
    resetHazardCount,
    setDataHazard,
    setControlHazard,
    clearDataHazard,
    clearControlHazard,

    forwardingOpen,
  }
})
