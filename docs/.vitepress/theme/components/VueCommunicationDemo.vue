<script setup>
import { ref } from 'vue'

const parentMsg = ref('')
const childMsg = ref('')
const logs = ref([])

const handleChildEvent = (msg) => {
  logs.value.unshift(`Received from child: "${msg}" at ${new Date().toLocaleTimeString()}`)
}

// Child Component Logic (Inline for simplicity in demo)
const childInput = ref('')
const emitToParent = () => {
  if (!childInput.value) return
  handleChildEvent(childInput.value)
  childInput.value = ''
}
</script>

<template>
  <div class="demo-card">
    <div class="section parent">
      <h4>Parent Component</h4>
      <div class="input-group">
        <label>Pass to Child (Props):</label>
        <input v-model="parentMsg" placeholder="Type here..." />
      </div>
      <div class="logs">
        <div v-for="(log, i) in logs" :key="i" class="log-entry">{{ log }}</div>
      </div>
    </div>

    <div class="arrow">⬇️ Props / ⬆️ Events ($emit)</div>

    <div class="section child">
      <h4>Child Component</h4>
      <div class="display-prop">
        Received Prop: <span class="highlight">{{ parentMsg || '(empty)' }}</span>
      </div>
      <div class="input-group">
        <label>Send to Parent ($emit):</label>
        <div class="flex">
          <input v-model="childInput" placeholder="Type message..." @keyup.enter="emitToParent" />
          <button @click="emitToParent">Send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background: #f9f9f9;
}
.section {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
}
.parent { border-color: #3eaf7c; }
.child { border-color: #42b883; }
.arrow { text-align: center; margin: 10px 0; color: #666; font-weight: bold; }
.input-group { margin: 10px 0; }
.input-group label { display: block; margin-bottom: 4px; font-size: 0.9em; color: #666; }
input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.flex { display: flex; gap: 8px; }
button {
  padding: 6px 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.highlight {
  color: #e91e63;
  font-weight: bold;
  background: #fce4ec;
  padding: 2px 4px;
  border-radius: 3px;
}
.logs {
  margin-top: 10px;
  max-height: 60px;
  overflow-y: auto;
  font-size: 0.85em;
  color: #555;
  background: #f1f1f1;
  padding: 4px;
}
.log-entry { margin-bottom: 2px; }
</style>
