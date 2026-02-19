<script setup>
import { ref } from 'vue'

const logs = ref([])
const isRunning = ref(false)

const addLog = (msg) => {
  logs.value.push(msg)
  // Auto scroll to bottom if needed, though simple push is reactive
}

const clearLogs = () => {
  logs.value = []
}

// 1. Natural Drift Test
const runDriftTest = () => {
  if (isRunning.value) return
  isRunning.value = true
  clearLogs()
  addLog('🚀 开始测试自然误差 (共5次)...')
  
  const start = Date.now()
  let count = 0
  
  const run = () => {
    count++
    const ideal = start + count * 1000
    const real = Date.now()
    const diff = real - ideal
    
    addLog(`第 ${count} 次: 误差 ${diff}ms`)
    
    if (count < 5) {
      setTimeout(run, 1000)
    } else {
      addLog('✅ 测试结束')
      isRunning.value = false
    }
  }
  
  setTimeout(run, 1000)
}

// 2. Blocking Test
const runBlockingTest = () => {
  if (isRunning.value) return
  isRunning.value = true
  clearLogs()
  addLog('🚀 开始测试阻塞误差...')
  addLog('设定 1000ms 后执行定时器...')
  
  const start = Date.now()
  
  setTimeout(() => {
    const end = Date.now()
    addLog(`⏰ 定时器执行! 实际耗时: ${end - start}ms (预期 1000ms)`)
    addLog('✅ 测试结束')
    isRunning.value = false
  }, 1000)
  
  // Use a small delay to let the UI update with the initial log before blocking
  setTimeout(() => {
    addLog('⚠️ 主线程开始阻塞 (模拟耗时任务 2000ms)...')
    addLog('页面可能会短暂卡顿，请耐心等待...')
    
    // Use requestAnimationFrame to ensure the UI renders the logs before we block
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const blockStart = Date.now()
            while (Date.now() - blockStart < 2000) {
              // Blocking loop
            }
            addLog('🎉 主线程耗时任务结束')
        })
    })
  }, 50)
}
</script>

<template>
  <div class="timeout-demo">
    <div class="controls">
      <button class="btn primary" @click="runDriftTest" :disabled="isRunning">
        测试自然误差
      </button>
      <button class="btn danger" @click="runBlockingTest" :disabled="isRunning">
        测试阻塞误差 (慎点)
      </button>
      <button class="btn" @click="clearLogs" :disabled="isRunning">
        清空日志
      </button>
    </div>
    
    <div class="console-window">
      <div class="console-header">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
        <span class="title">Console Output</span>
      </div>
      <div class="console-body">
        <div v-if="logs.length === 0" class="placeholder">点击上方按钮开始测试...</div>
        <div v-for="(log, index) in logs" :key="index" class="log-line">
          <span class="arrow">></span> {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeout-demo {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.primary {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.btn.primary:hover:not(:disabled) {
  background-color: var(--vp-c-brand-dark);
}

.btn.danger {
  background-color: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.btn.danger:hover:not(:disabled) {
  background-color: #c04040;
}

.console-window {
  background-color: #1e1e1e;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: 'Fira Code', monospace;
}

.console-header {
  background-color: #323233;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background-color: #ff5f56; }
.dot.yellow { background-color: #ffbd2e; }
.dot.green { background-color: #27c93f; }

.title {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}

.console-body {
  padding: 12px;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  color: #d4d4d4;
  font-size: 13px;
  line-height: 1.6;
}

.placeholder {
  color: #666;
  font-style: italic;
}

.log-line {
  border-bottom: 1px solid #2d2d2d;
  padding: 2px 0;
}

.arrow {
  color: #6a9955;
  margin-right: 5px;
}
</style>
