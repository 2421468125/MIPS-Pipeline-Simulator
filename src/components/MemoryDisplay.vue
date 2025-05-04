<template>
  <div>
    <div class="controls">
      <label>
        显示格式：
        <select v-model="displayMode">
          <option value="byte">单字节</option>
          <option value="word">4字节</option>
        </select>
      </label>
      <label>
        显示数量：
        <input type="number" v-model.number="displayCount" min="1" />
      </label>
      <label>
        搜索：
        <input type="number" v-model.number="searchValue" @input="handleSearch" />
      </label>
    </div>

    <div class="memory-grid">
      <div v-for="(value, index) in displayedMemory" :key="index" class="memory-cell">
        <div class="memory-offset">{{ getOffset(index) }}</div>
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMemoryStore } from '@/stores/memoryStore'

const memoryStore = useMemoryStore()

const displayMode = ref('byte') // 'byte' 或 'word'
const displayCount = ref(16) // 默认显示数量
const searchValue = ref(0) // 搜索值
const startIndex = ref(0) // 起始索引

// 处理搜索逻辑
const handleSearch = () => {
  const value = searchValue.value
  startIndex.value = Math.max(0, Math.floor(value / 4) * 4) // 找到比输入值小且能被4整除的数
}

// 计算显示的内存数据
const displayedMemory = computed(() => {
  const memory = memoryStore.memory
  const result = []
  for (let i = 0; i < displayCount.value; i++) {
    const index = startIndex.value + i * (displayMode.value === 'byte' ? 1 : 4)
    if (displayMode.value === 'byte') {
      result.push(memory[index] ?? 0)
    } else {
      result.push(memoryStore.getMemoryValue(index) ?? 0)
    }
  }
  return result
})

// 计算内存偏移量
const getOffset = (index) => {
  return `${(startIndex.value + index * (displayMode.value === 'byte' ? 1 : 4)).toString(10)}`
}
</script>

<style lang="scss" scoped>
.controls {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 0.5rem;
}

.memory-cell {
  margin-top: 4rem;
  position: relative;
  padding: 0.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  text-align: center;
  font-family: monospace;
}

.memory-offset {
  position: absolute;
  top: -1.5rem;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  color: #666;
}
</style>
