<script setup>
import { ref } from 'vue'

const list1 = ref([
  { id: 1, text: 'HTML' },
  { id: 2, text: 'CSS' },
  { id: 3, text: 'JavaScript' }
])

const list2 = ref([
  { id: 4, text: 'Vue' },
  { id: 5, text: 'React' }
])

const logs = ref([])
const draggedItem = ref(null)

const log = (msg) => {
  const time = new Date().toLocaleTimeString()
  logs.value.unshift(`[${time}] ${msg}`)
  if (logs.value.length > 20) logs.value.pop()
}

const onDragStart = (event, item, sourceList) => {
  draggedItem.value = { item, sourceList }
  event.dataTransfer.effectAllowed = 'move'
  // event.dataTransfer.setData('text/plain', JSON.stringify(item)) // Optional for simple internal moves
  log(`Drag Start: ${item.text}`)
  event.target.style.opacity = '0.5'
}

const onDragEnd = (event) => {
  event.target.style.opacity = '1'
  draggedItem.value = null
  log('Drag End')
}

const onDrop = (event, targetListId) => {
  const targetList = targetListId === 1 ? list1 : list2
  
  if (draggedItem.value) {
    const { item, sourceList } = draggedItem.value
    
    // Remove from source
    const sourceIndex = sourceList.value.findIndex(i => i.id === item.id)
    if (sourceIndex > -1) {
      sourceList.value.splice(sourceIndex, 1)
    }
    
    // Add to target
    targetList.value.push(item)
    log(`Dropped ${item.text} into List ${targetListId}`)
  }
}
</script>

<template>
  <div class="demo-container">
    <div class="lists-container">
      <div 
        class="drop-zone"
        @dragover.prevent
        @drop="onDrop($event, 1)"
      >
        <h3>List 1 (基础)</h3>
        <div 
          v-for="item in list1" 
          :key="item.id"
          class="draggable-item"
          draggable="true"
          @dragstart="onDragStart($event, item, list1)"
          @dragend="onDragEnd"
        >
          {{ item.text }}
        </div>
        <div v-if="list1.length === 0" class="placeholder">拖拽到这里</div>
      </div>

      <div 
        class="drop-zone"
        @dragover.prevent
        @drop="onDrop($event, 2)"
      >
        <h3>List 2 (框架)</h3>
        <div 
          v-for="item in list2" 
          :key="item.id"
          class="draggable-item"
          draggable="true"
          @dragstart="onDragStart($event, item, list2)"
          @dragend="onDragEnd"
        >
          {{ item.text }}
        </div>
        <div v-if="list2.length === 0" class="placeholder">拖拽到这里</div>
      </div>
    </div>

    <div class="logs-panel">
      <h4>Event Logs</h4>
      <div class="logs-content">
        <div v-for="(log, index) in logs" :key="index" class="log-item">{{ log }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  padding: 20px;
  margin: 20px 0;
}

.lists-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.drop-zone {
  flex: 1;
  background-color: var(--vp-c-bg);
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 15px;
  min-height: 200px;
  transition: border-color 0.2s;
}

.drop-zone:hover {
  border-color: var(--vp-c-brand);
}

h3 { margin-top: 0; margin-bottom: 15px; font-size: 16px; text-align: center; }

.draggable-item {
  background-color: var(--vp-c-brand);
  color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: grab;
  user-select: none;
  text-align: center;
}

.draggable-item:active { cursor: grabbing; }

.placeholder {
  color: var(--vp-c-text-3);
  text-align: center;
  margin-top: 50px;
  font-style: italic;
}

.logs-panel {
  background-color: #1e1e1e;
  border-radius: 6px;
  padding: 10px;
  color: #d4d4d4;
  font-family: monospace;
  font-size: 12px;
}

h4 { margin: 0 0 10px 0; color: #9cdcfe; }

.logs-content {
  height: 100px;
  overflow-y: auto;
}

.log-item { margin-bottom: 4px; border-bottom: 1px solid #333; padding-bottom: 2px; }
</style>
