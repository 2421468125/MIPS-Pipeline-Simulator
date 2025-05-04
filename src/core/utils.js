import { useCodeStore, useHazardStore } from '@/stores/pipelineStore'
import { useRegisterStore } from '@/stores/registerStore'
import { useMemoryStore } from '@/stores/memoryStore'

export const getStatisticData = () => {
  const memoryCount = useMemoryStore().memoryCount
  const registerCount = useRegisterStore().registerCount
  const hazardCount = useHazardStore().hazardCount
  const time = useCodeStore().time
  const instrucitonState = useCodeStore().instructionState
  const instrcutionCount = instrucitonState.filter((item) => item[item.length - 1] !== 0).length
  return `程序执行时间：${time}，已完成指令：${instrcutionCount}, \n已进行内存读入：${memoryCount.getMemoryValue}次，内存写入：${memoryCount.setMemoryValue}次,\n寄存器读入：${registerCount.getRegValue}次，寄存器写入：${registerCount.setRegValue}次,\n数据冲突：${hazardCount.dataHazard}次，控制冲突：${hazardCount.controlHazard / 2}次`
}
