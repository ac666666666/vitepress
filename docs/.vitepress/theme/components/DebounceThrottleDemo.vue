<script setup>
import { ref } from 'vue'

const rawCount = ref(0)
const debounceCount = ref(0)
const throttleCount = ref(0)
const delay = ref(1000)

let debounceTimer = null
let throttleTimer = null
let lastTime = 0

// 模拟防抖函数
const debounce = (fn, delay) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    fn()
    debounceTimer = null
  }, delay)
}

// 模拟节流函数 (时间戳版 + 定时器版混合实现更精确，这里为了演示简单用时间戳)
const throttle = (fn, delay) => {
  const now = Date.now()
  if (now - lastTime >= delay) {
    fn()
    lastTime = now
  }
}

const handleInput = () => {
  rawCount.value++
  
  // 防抖调用
  debounce(() => {
    debounceCount.value++
  }, delay.value)
  
  // 节流调用
  throttle(() => {
    throttleCount.value++
  }, delay.value)
}

const reset = () => {
  rawCount.value = 0
  debounceCount.value = 0
  throttleCount.value = 0
  if (debounceTimer) clearTimeout(debounceTimer)
  lastTime = 0
}
</script>

<template>
  <div class="demo-container">
    <div class="controls">
      <label>延迟时间 (ms): </label>
      <input type="number" v-model="delay" step="100" min="100" class="delay-input">
      <button class="reset-btn" @click="reset">重置计数</button>
    </div>

    <div class="trigger-area" @mousemove="handleInput">
      <p class="trigger-text">在此区域快速移动鼠标</p>
      <p class="trigger-sub">Trigger Area (Mouse Move)</p>
    </div>

    <div class="stats-container">
      <div class="stat-box raw">
        <div class="stat-label">原始触发 (Raw)</div>
        <div class="stat-value">{{ rawCount }}</div>
        <div class="stat-desc">每次移动都触发</div>
      </div>

      <div class="stat-box debounce">
        <div class="stat-label">防抖 (Debounce)</div>
        <div class="stat-value">{{ debounceCount }}</div>
        <div class="stat-desc">停止移动 {{ delay }}ms 后执行一次</div>
      </div>

      <div class="stat-box throttle">
        <div class="stat-label">节流 (Throttle)</div>
        <div class="stat-value">{{ throttleCount }}</div>
        <div class="stat-desc">每 {{ delay }}ms 执行一次</div>
      </div>
    </div>
    
    <div class="visual-graph">
      <!-- 简单的可视化条，展示相对频率 -->
      <div class="bar-group">
        <div class="bar-label">Raw</div>
        <div class="bar-track">
          <div class="bar-fill raw-fill" :style="{ width: Math.min(rawCount * 2, 100) + '%' }"></div>
        </div>
      </div>
      <div class="bar-group">
        <div class="bar-label">Debounce</div>
        <div class="bar-track">
          <div class="bar-fill debounce-fill" :style="{ width: Math.min(debounceCount * 10, 100) + '%' }"></div>
        </div>
      </div>
      <div class="bar-group">
        <div class="bar-label">Throttle</div>
        <div class="bar-track">
          <div class="bar-fill throttle-fill" :style="{ width: Math.min(throttleCount * 10, 100) + '%' }"></div>
        </div>
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

.controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.delay-input {
  border: 1px solid var(--vp-c-divider);
  padding: 4px 8px;
  border-radius: 4px;
  width: 80px;
  background-color: var(--vp-c-bg);
}

.reset-btn {
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--vp-c-bg);
  margin-left: auto;
}

.trigger-area {
  height: 120px;
  background-color: var(--vp-c-bg);
  border: 2px dashed var(--vp-c-brand);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: crosshair;
  margin-bottom: 20px;
  transition: background-color 0.2s;
}

.trigger-area:hover {
  background-color: var(--vp-c-brand-dimm);
}

.trigger-text { font-weight: bold; font-size: 16px; margin: 0; }
.trigger-sub { font-size: 12px; color: var(--vp-c-text-2); margin: 5px 0 0 0; }

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-box {
  background-color: var(--vp-c-bg);
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
}

.stat-label { font-size: 14px; color: var(--vp-c-text-2); margin-bottom: 5px; }
.stat-value { font-size: 24px; font-weight: bold; font-family: monospace; }
.stat-desc { font-size: 12px; color: var(--vp-c-text-3); margin-top: 5px; }

.stat-box.raw .stat-value { color: #f56c6c; }
.stat-box.debounce .stat-value { color: #409eff; }
.stat-box.throttle .stat-value { color: #67c23a; }

.visual-graph {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 15px;
}

.bar-group {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.bar-label { width: 70px; font-size: 13px; color: var(--vp-c-text-2); }
.bar-track { flex: 1; height: 8px; background-color: var(--vp-c-divider); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; transition: width 0.2s; }
.raw-fill { background-color: #f56c6c; }
.debounce-fill { background-color: #409eff; }
.throttle-fill { background-color: #67c23a; }
</style>
