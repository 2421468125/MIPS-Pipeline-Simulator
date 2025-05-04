export default function instructionParser() {
  const INST_TYPE = {
    R: ['add', 'sub', 'and', 'or', 'xor', 'nor', 'slt', 'sltu'],
    I: ['addi', 'andi', 'ori', 'xori', 'slti', 'sltiu'],
    M: ['load', 'store'], //为了好解析指令多分两类
    B: ['beq', 'bne', 'blt', 'bgt', 'ble', 'bge', 'beqz', 'bnez'],
    J: ['j', 'jal'],
  }

  let getLabel = (instruction) => {
    let labels = {}
    let count = 0
    instruction.forEach((inst, index) => {
      if (inst.includes(':')) {
        const label = inst.split(':')[0].trim()
        labels[label] = count * 4
      } else {
        labels[inst] = count * 4
        count++
      }
    })
    return labels
  }
  // 返回array:[instruciton, instruction name, instruction type, rs, rt, rd, imm, addr]
  // 搞得简单一点，B和J都直接返回跳转PC地址，而非与目前PC的偏移量
  let parser = (instruction, labels) => {
    let arrays = []
    instruction.forEach((inst, index) => {
      inst = inst.trim()
      const array = inst.split(' ')
      let command = array[0]
      if (INST_TYPE.R.includes(command)) {
        let n1 = parseInt(array[1].slice(1), 10),
          n2 = parseInt(array[2].slice(1), 10),
          n3 = parseInt(array[3].slice(1), 10)
        if (
          array[1][0] != '$' ||
          array[2][0] != '$' ||
          array[3][0] != '$' ||
          isNaN(n1) ||
          isNaN(n2) ||
          isNaN(n3)
        ) {
          throw new Error(`Invalid instruction: ${inst}`)
        } else if (n1 < 0 || n1 > 31 || n2 < 0 || n2 > 31 || n3 < 0 || n3 > 31) {
          throw new Error(`Invalid register number: ${inst}`)
        }
        arrays.push([inst, command, 'r', n1, n2, n3, 0, 0])
      } else if (INST_TYPE.I.includes(command)) {
        let n1 = parseInt(array[1].slice(1), 10),
          n2 = parseInt(array[2].slice(1), 10),
          n3 = parseInt(array[3], 10)
        if (array[1][0] != '$' || array[2][0] != '$' || isNaN(n1) || isNaN(n2)) {
          throw new Error(`Invalid instruction: ${inst}`)
        } else if (n1 < 0 || n1 > 31 || n2 < 0 || n2 > 31) {
          throw new Error(`Invalid register number: ${inst}`)
        }
        arrays.push([inst, command, 'i', n1, n2, 0, n3, 0])
      } else if (INST_TYPE.B.includes(command)) {
        let n1 = parseInt(array[1].slice(1), 10)
        if (command == 'beqz' || command == 'bnez') {
          if (array[1][0] != '$' || isNaN(n1) || n1 < 0 || n1 > 31) {
            throw new Error(`Invalid instruction: ${inst}`)
          } else if (n1 < 0 || n1 > 31) {
            throw new Error(`Invalid register number: ${inst}`)
          }
          arrays.push([inst, command, 'b', 0, n1, 0, labels[array[2]], 0])
        } else {
          let n2 = parseInt(array[2].slice(1), 10)
          if (array[1][0] != '$' || array[2][0] != '$' || isNaN(n1) || isNaN(n2)) {
            throw new Error(`Invalid instruction: ${inst}`)
          } else if (n1 < 0 || n1 > 31 || n2 < 0 || n2 > 31) {
            throw new Error(`Invalid register number: ${inst}`)
          }
          arrays.push([inst, command, 'b', 0, n1, n2, labels[array[3]], 0])
        }
      } else if (INST_TYPE.M.includes(command)) {
        let match = array[2].match(/(-?\d+)\(\$(\d+)\)/)
        if (match) {
          let offset = parseInt(match[1], 10)
          let base = parseInt(match[2], 10)
          if (isNaN(offset) || isNaN(base) || base < 0 || base > 31) {
            throw new Error(`Invalid instruction: ${inst}`)
          }
          arrays.push([inst, command, 'm', parseInt(array[1].slice(1), 10), base, 0, offset, 0])
        }
      } else if (INST_TYPE.J.includes(command)) {
        let addr = labels[array[1]]
        if (addr == undefined) {
          throw new Error(`Invalid instruction: ${inst}`)
        }
        arrays.push([inst, command, 'j', 0, 0, 0, 0, addr])
      } else {
        if (labels[command.slice(0, command.length - 1)] == undefined)
          throw new Error(`Invalid instruction: ${inst}`)
      }
    })
    return arrays
  }

  return (instruction) => {
    let labels = getLabel(instruction)
    return parser(instruction, labels)
  }
}
