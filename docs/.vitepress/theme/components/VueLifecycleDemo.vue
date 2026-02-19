<script setup>
import { ref, nextTick } from 'vue'
import VueLifecycleChild from './VueLifecycleChild.vue'

const showChild = ref(false)
const count = ref(0)
const logs = ref([])

const addLog = (msg) => {
  logs.value.push({
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString(),
    msg
  })
  
  nextTick(() => {
    const el = document.getElementById('lifecycle-logs')
    if (el) el.scrollTop = el.scrollHeight
  })
}

const clearLogs = () => {
  logs.value = []
}
</script>

<template>
  <div class="demo-card">
    <div class="controls">
      <button class="btn" @click="showChild = !showChild">
        {{ showChild ? 'Destroy Child' : 'Create Child' }}
      </button>
      <button class="btn" @click="count++" :disabled="!showChild">
        Update Prop ({{ count }})
      </button>
      <button class="btn secondary" @click="clearLogs">Clear Logs</button>
    </div>

    <div class="visualization">
      <div class="left-panel">
        <div v-if="!showChild" class="placeholder">
          Child component is not mounted
        </div>
        <VueLifecycleChild 
          v-else 
          :count="count" 
          @log="addLog"
        />
      </div>
      <div class="right-panel" id="lifecycle-logs">
        <div v-if="logs.length === 0" class="empty-logs">Logs will appear here...</div>
        <div v-for="log in logs" :key="log.id" class="log-item">
          <span class="time">[{{ log.time }}]</span>
          <span class="msg">{{ log.msg }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}
.controls {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #42b883;
  background: #42b883;
  color: white;
  cursor: pointer;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn.secondary {
  background: #f1f1f1;
  border-color: #ddd;
  color: #333;
}
.visualization {
  display: flex;
  gap: 16px;
  height: 200px;
}
.left-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  background: #fafafa;
}
.right-panel {
  flex: 1;
  border: 1px solid #333;
  background: #1e1e1e;
  color: #42b883;
  padding: 8px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
}
.log-item {
  margin-bottom: 4px;
  border-bottom: 1px solid #333;
}
.time {
  color: #888;
  margin-right: 8px;
}
.placeholder {
  color: #999;
}
.empty-logs {
  color: #555;
  text-align: center;
  margin-top: 20px;
}
</style>
