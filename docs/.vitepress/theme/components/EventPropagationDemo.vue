<script setup>
import { ref, nextTick } from 'vue'

const logs = ref([])
const isBubbling = ref(true) // 默认开启冒泡
const isCapturing = ref(true) // 默认开启捕获
const stopPropagationAt = ref('') // 阻止传播的层级

const log = (msg, phase) => {
  logs.value.push({
    id: Date.now() + Math.random(),
    msg,
    phase: phase === 1 ? 'Capturing (捕获)' : (phase === 3 ? 'Bubbling (冒泡)' : 'Target (目标)')
  })
  // 自动滚动到底部
  nextTick(() => {
    const el = document.querySelector('.log-container')
    if (el) el.scrollTop = el.scrollHeight
  })
}

const clearLogs = () => {
  logs.value = []
}

const handleEvent = (e, name, isCapturePhase) => {
  const phase = e.eventPhase
  
  // 阻止传播逻辑
  if (stopPropagationAt.value === name) {
    e.stopPropagation()
    log(`🚫 在 [${name}] 阻止了传播!`, phase)
  }

  log(`触发: [${name}]`, phase)
}

// 模拟原生事件绑定 (Vue 的 @click.capture 等同于 addEventListener(..., true))
</script>

<template>
  <div class="demo-container">
    <div class="controls">
      <div class="control-group">
        <label>阻止传播 (e.stopPropagation):</label>
        <select v-model="stopPropagationAt">
          <option value="">不阻止</option>
          <option value="Grandparent">Grandparent (爷爷)</option>
          <option value="Parent">Parent (爸爸)</option>
          <option value="Child">Child (儿子)</option>
        </select>
      </div>
      <button class="clear-btn" @click="clearLogs">清空日志</button>
    </div>

    <div class="visual-area">
      <!-- Grandparent -->
      <div 
        class="box grandparent"
        @click.capture="handleEvent($event, 'Grandparent', true)"
        @click="handleEvent($event, 'Grandparent', false)"
      >
        Grandparent (爷爷)
        
        <!-- Parent -->
        <div 
          class="box parent"
          @click.capture="handleEvent($event, 'Parent', true)"
          @click="handleEvent($event, 'Parent', false)"
        >
          Parent (爸爸)
          
          <!-- Child -->
          <div 
            class="box child"
            @click.capture="handleEvent($event, 'Child', true)"
            @click="handleEvent($event, 'Child', false)"
          >
            Child (儿子) <br/>
            <span class="click-hint">(点击这里)</span>
          </div>
        </div>
      </div>
    </div>

    <div class="log-container">
      <div v-if="logs.length === 0" class="empty-log">点击上面的盒子查看事件传播过程...</div>
      <div v-for="item in logs" :key="item.id" class="log-item" :class="item.phase.split(' ')[0].toLowerCase()">
        <span class="phase-tag">{{ item.phase }}</span>
        <span class="msg">{{ item.msg }}</span>
      </div>
    </div>
    
    <div class="legend">
      <div class="legend-item"><span class="dot capturing"></span> 捕获阶段 (Capturing): 从外向内 (Window -> Target)</div>
      <div class="legend-item"><span class="dot target"></span> 目标阶段 (Target): 到达目标元素</div>
      <div class="legend-item"><span class="dot bubbling"></span> 冒泡阶段 (Bubbling): 从内向外 (Target -> Window)</div>
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

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.control-group select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.clear-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--vp-c-bg);
  font-size: 13px;
}

.visual-area {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.box {
  padding: 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.box:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.box:active {
  transform: scale(0.98);
}

.grandparent {
  background-color: #fef0f0;
  border-color: #f56c6c;
  color: #c45656;
  width: 100%;
  max-width: 400px;
}

.parent {
  background-color: #f0f9eb;
  border-color: #67c23a;
  color: #529b2e;
  margin-top: 10px;
  width: 80%;
}

.child {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #337ecc;
  margin-top: 10px;
  width: 80%;
}

.click-hint {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.7;
}

.log-container {
  height: 200px;
  overflow-y: auto;
  background-color: #1e1e1e;
  border-radius: 6px;
  padding: 10px;
  font-family: monospace;
  font-size: 13px;
  border: 1px solid #333;
}

.empty-log {
  color: #666;
  text-align: center;
  margin-top: 20px;
}

.log-item {
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid #333;
  align-items: center;
}

.phase-tag {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  min-width: 110px;
  text-align: center;
}

.capturing .phase-tag { background-color: #b8860b; color: #fff; } /* DarkGoldenRod */
.target .phase-tag { background-color: #cd5c5c; color: #fff; } /* IndianRed */
.bubbling .phase-tag { background-color: #2e8b57; color: #fff; } /* SeaGreen */

.msg { color: #d4d4d4; }

.legend {
  margin-top: 15px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot.capturing { background-color: #b8860b; }
.dot.target { background-color: #cd5c5c; }
.dot.bubbling { background-color: #2e8b57; }
</style>
