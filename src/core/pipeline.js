import { useCodeStore, useHazardStore } from '@/stores/pipelineStore'
import { useRegisterStore } from '@/stores/registerStore'
import { useMemoryStore } from '@/stores/memoryStore'
import { getStatisticData } from './utils.js'
class PipelineStage {
  constructor(name) {
    this.name = name
    this.instruction = ['nop', 'add', 'r', 0, 0, 0, 0, 0]
    this.pc = 0
  }

  execute(instruction, pc) {
    this.instruction = instruction
    this.pc = pc
    if (instruction[0] === 'nop') return
    Pipeline.codeStore.setInstructionState(pc, this.name, Pipeline.codeStore.time)
  }

  flush() {
    this.instruction = ['nop', 'add', 'r', 0, 0, 0, 0, 0]
    this.pc = 0
  }
}

class InstuctionFetch extends PipelineStage {
  constructor() {
    super('IF')
  }

  execute(newExResult, newIdResult) {
    // 处理分支错误清洗
    if (newExResult.branch) {
      this.flush()
      Pipeline.HazardStore.setControlHazard(newExResult.result)
      return
    }

    const pc = Pipeline.registerStore.getPC()
    const instruction = Pipeline.codeStore.getInstructionByPC(pc)
    // 处理load delay slot
    if (
      Pipeline.HazardStore.forwardingOpen &&
      newIdResult.command === 'load' &&
      newIdResult.rs !== 0 &&
      (newIdResult.rs === instruction[4] || newIdResult.rs === instruction[5])
    ) {
      this.flush()
      Pipeline.HazardStore.setDataHazard(newIdResult.rs)
      console.log('Load delay slot, must stall one cycle')
      Pipeline.registerStore.setPC(Pipeline.registerStore.getPC() - 4)
      return
    }

    super.execute(instruction, pc)
    console.log(`Fetching instruction: ${instruction[0]}`)
  }

  setNewPC(exResult) {
    if (exResult.branch) {
      Pipeline.registerStore.setPC(exResult.result)
      return true
    } else if (Pipeline.codeStore.time > 1) {
      Pipeline.registerStore.setPC(Pipeline.registerStore.getPC() + 4)
      return false
    } else {
      return false
    }
  }
  flush() {
    super.flush()
  }
}

class InstructionDecode extends PipelineStage {
  constructor() {
    super('ID')
    this.rsValue = 0
    this.rtValue = 0
    this.rdValue = 0
    this.imm = 0
    this.addr = 0
  }

  execute(instruction, pc, newExResult) {
    // 处理分支错误清洗
    if (newExResult.branch === true) {
      this.flush()
      Pipeline.codeStore.resetInstructionState(pc)
      Pipeline.HazardStore.setControlHazard(newExResult.result)
      return
    }

    super.execute(instruction, pc)
    console.log(`Decodeing instruciton : ${instruction[0]}`)
    this.rsValue = Pipeline.registerStore.getRegValue(instruction[3])
    this.rtValue = Pipeline.registerStore.getRegValue(instruction[4])
    this.rdValue = Pipeline.registerStore.getRegValue(instruction[5])
    this.imm = instruction[6]
    this.addr = instruction[7]
    // 处理定向逻辑
    // if (oldExResult.rs !== 0 && (oldExResult.instType === 'r' || oldExResult.instType === 'i')) {
    //   if (this.instruction[4] === oldExResult.rs) {
    //     this.rtValue = oldExResult.result
    //     Pipeline.HazardStore.setDataHazard(this.instruction[4])
    //   } else if (this.instruction[5] === oldExResult.rs) {
    //     this.rdValue = oldExResult.result
    //     Pipeline.HazardStore.setDataHazard(this.instruction[5])
    //   }
    // }
    // if (newExResult.rs !== 0 && (newExResult.instType === 'r' || newExResult.instType === 'i')) {
    //   if (this.instruction[4] === newExResult.rs) {
    //     this.rtValue = newExResult.result
    //     Pipeline.HazardStore.setDataHazard(this.instruction[4])
    //   } else if (this.instruction[5] === newExResult.rs) {
    //     this.rdValue = newExResult.result
    //     Pipeline.HazardStore.setDataHazard(this.instruction[5])
    //   }
    // }
  }

  export() {
    return {
      rsValue: this.rsValue,
      rtValue: this.rtValue,
      rdValue: this.rdValue,
      imm: this.imm,
      addr: this.addr,
      command: this.instruction[1],
      rs: this.instruction[3],
    }
  }

  flush() {
    super.flush()
    this.rsValue = 0
    this.rtValue = 0
    this.rdValue = 0
    this.imm = 0
    this.addr = 0
  }
}

class Execute extends PipelineStage {
  constructor() {
    super('EX')
    this.result = 0
    this.branch = false
    this.rs = 0
    this.instType = ''
  }

  execute(instruction, pc, data, meMResult, exResult) {
    super.execute(instruction, pc)
    console.log(`Executing instruction: ${instruction[0]}`)
    this.rs = instruction[3]
    this.instType = instruction[2]
    this.branch = false
    // 处理定向逻辑
    if (
      Pipeline.HazardStore.forwardingOpen &&
      meMResult.rs !== 0 &&
      (meMResult.instType === 'r' || meMResult.instType === 'i' || meMResult.command === 'load')
    ) {
      if (this.instruction[4] === meMResult.rs) {
        data.rtValue = meMResult.result
        Pipeline.HazardStore.setDataHazard(this.instruction[4])
      } else if (this.instruction[5] === meMResult.rs) {
        data.rdValue = meMResult.result
        Pipeline.HazardStore.setDataHazard(this.instruction[5])
      }
    }
    if (
      Pipeline.HazardStore.forwardingOpen &&
      exResult.rs !== 0 &&
      (exResult.instType === 'r' || exResult.instType === 'i')
    ) {
      if (this.instruction[4] === exResult.rs) {
        data.rtValue = exResult.result
        Pipeline.HazardStore.setDataHazard(this.instruction[4])
      } else if (this.instruction[5] === exResult.rs) {
        data.rdValue = exResult.result
        Pipeline.HazardStore.setDataHazard(this.instruction[5])
      }
    }
    switch (instruction[1]) {
      case 'add':
        this.result = data.rtValue + data.rdValue
        break
      case 'sub':
        this.result = data.rtValue - data.rdValue
        break
      case 'mul':
        this.result = data.rtValue * data.rdValue
        break
      case 'div':
        this.result = Math.floor(data.rtValue / data.rdValue)
        break
      case 'and':
        this.result = data.rtValue & data.rdValue
        break
      case 'or':
        this.result = data.rtValue | data.rdValue
        break
      case 'xor':
        this.result = data.rtValue ^ data.rdValue
        break
      case 'nor':
        this.result = ~(data.rtValue | data.rdValue)
        break
      case 'slt':
        this.result = data.rtValue < data.rdValue ? 1 : 0
        break
      case 'addi':
      case 'load':
      case 'store':
        this.result = data.rtValue + data.imm
        break
      case 'andi':
        this.result = data.rtValue & data.imm
        break
      case 'ori':
        this.result = data.rtValue | data.imm
        break
      case 'oxri':
        this.result = data.rtValue ^ data.imm
        break
      case 'slti':
        this.result = data.rtValue < data.imm ? 1 : 0
        break
      case 'beq':
      case 'beqz':
        if (data.rsValue === data.rtValue) {
          this.result = data.imm
          this.branch = true
        }
      case 'bne':
      case 'bnez':
        if (data.rsValue !== data.rtValue) {
          this.result = data.imm
          this.branch = true
        }
        break
      case 'blt':
        if (data.rsValue < data.rtValue) {
          this.result = data.imm
          this.branch = true
        }
        break
      case 'bgt':
        if (data.rsValue > data.rtValue) {
          this.result = data.imm
          this.branch = true
        }
        break
      case 'ble':
        if (data.rsValue <= data.rtValue) {
          this.result = data.imm
          this.branch = true
        }
        break
      case 'bge':
        if (data.rsValue >= data.rtValue) {
          this.result = data.imm
          this.branch = true
        }
        break
      case 'j':
        this.result = data.addr
        this.branch = true
        break
      case 'jal':
        this.result = data.addr
        this.branch = true
        break
      default:
        console.log('Unknown instruction')
    }
  }

  export() {
    return {
      result: this.result,
      branch: this.branch,
      rs: this.rs,
      instType: this.instType,
    }
  }
  flush() {
    super.flush()
    this.result = 0
    this.branch = false
    this.rs = 0
    this.instType = ''
  }
}

class Memory extends PipelineStage {
  constructor() {
    super('MEM')
    this.result = 0
    this.rs = 0
    this.command = ''
  }

  execute(instruction, pc, data) {
    super.execute(instruction, pc)
    this.rs = instruction[3]
    this.command = instruction[1]
    console.log(`Memory instruction: ${instruction[0]}`)
    if (instruction[1] === 'load') {
      const value = Pipeline.memoryStore.getMemoryValue(data.result)
      this.result = value
    } else if (instruction[1] === 'store') {
      const value = Pipeline.registerStore.getRegValue(instruction[3])
      Pipeline.memoryStore.setMemoryValue(data.result, value)
    } else {
      this.result = data.result
    }
  }
  export() {
    return {
      result: this.result,
      rs: this.rs,
      command: this.command,
      instType: this.instruction[2],
    }
  }

  flush() {
    super.flush()
    this.result = 0
    this.rs = 0
    this.command = ''
  }
}

class WriteBack extends PipelineStage {
  constructor() {
    super('WB')
  }

  execute(instruction, pc, data) {
    super.execute(instruction, pc)
    console.log(`Writing back instruction: ${instruction[0]}`)
    if (instruction[2] === 'r' || instruction[2] === 'i') {
      Pipeline.registerStore.setRegValue(instruction[3], data.result)
    } else if (instruction[1] === 'load') {
      Pipeline.registerStore.setRegValue(instruction[3], data.result)
    } else if (instruction[1] === 'jal') {
      Pipeline.registerStore.setRegValue(31, pc + 4) // store return address in $ra
    }
  }
}

class Pipeline {
  static instance = null
  static codeStore = null
  static registerStore = null
  static memoryStore = null

  static HazardStore = null

  static initStores() {
    Pipeline.codeStore = useCodeStore()
    Pipeline.registerStore = useRegisterStore()
    Pipeline.memoryStore = useMemoryStore()
    Pipeline.HazardStore = useHazardStore()
  }

  constructor() {
    if (Pipeline.instance) {
      return Pipeline.instance
    }
    this.IF = new InstuctionFetch()
    this.ID = new InstructionDecode()
    this.EX = new Execute()
    this.MEM = new Memory()
    this.WB = new WriteBack()
    Pipeline.instance = this
  }

  static getInstance() {
    if (!Pipeline.instance) {
      Pipeline.initStores()
      Pipeline.instance = new Pipeline()
    }
    return Pipeline.instance
  }

  reset() {
    this.IF.flush()
    this.ID.flush()
    this.EX.flush()
    this.MEM.flush()
    this.WB.flush()
    Pipeline.codeStore.resetTime()
    Pipeline.codeStore.resetAllInstructionState()
    Pipeline.registerStore.resetRegister()
    Pipeline.memoryStore.resetMemory()
    Pipeline.HazardStore.resetHazardCount()
  }

  runOneCycle() {
    Pipeline.codeStore.incrementTime()
    console.log(`Cycle: ${Pipeline.codeStore.time}`)
    const memResult = this.MEM.export()
    const exResult = this.EX.export()
    const idResult = this.ID.export()
    this.WB.execute(this.MEM.instruction, this.MEM.pc, memResult)
    this.MEM.execute(this.EX.instruction, this.EX.pc, exResult)
    this.EX.execute(this.ID.instruction, this.ID.pc, idResult, memResult, exResult)
    const newExResult = this.EX.export()
    this.ID.execute(this.IF.instruction, this.IF.pc, newExResult)
    const newIdResult = this.ID.export()
    this.IF.setNewPC(exResult)
    this.IF.execute(newExResult, newIdResult)
    if (Pipeline.codeStore.isEnd(Pipeline.registerStore.getPC())) {
    }
  }

  runTillBreakpoint() {
    while (true) {
      this.runOneCycle()
      if (Pipeline.codeStore.isBreakpoint(Pipeline.registerStore.getPC())) {
        console.log('Hit breakpoint')
        break
      }
      if (Pipeline.codeStore.isEnd(Pipeline.registerStore.getPC())) {
        console.log('End of program')
        break
      }
    }
  }

  getStatistics() {
    return getStatisticData()
  }
}

export default Pipeline
