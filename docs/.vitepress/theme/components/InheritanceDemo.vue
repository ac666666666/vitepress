<script setup>
import { ref, reactive } from 'vue'

const currentMode = ref('prototype') // 'prototype' | 'class'

// 模拟数据
const prototypeData = reactive({
  instance1: { name: 'Inst 1', colors: ['red'] },
  instance2: { name: 'Inst 2', colors: ['red'] },
  shared: true
})

const classData = reactive({
  instance1: { name: 'Inst 1', colors: ['red'] },
  instance2: { name: 'Inst 2', colors: ['red'] },
  shared: false
})

const addColor = (mode, instanceIdx) => {
  const color = '#' + Math.floor(Math.random()*16777215).toString(16)
  
  if (mode === 'prototype') {
    // 模拟原型链继承：引用类型被所有实例共享
    prototypeData.instance1.colors.push(color)
    // 注意：这里我们手动同步，为了演示效果。真实代码中是因为引用同一个数组
    if (prototypeData.shared) {
       // 实际上在原型链继承中，instance2.colors 和 instance1.colors 指向同一个内存地址
       // 这里为了在 Vue 中反应出来，我们手动 push 进去，或者直接让它们指向同一个引用
    }
  } else {
    // 模拟类继承：构造函数中初始化，每个实例独立
    if (instanceIdx === 1) classData.instance1.colors.push(color)
    else classData.instance2.colors.push(color)
  }
}

// 重新实现以更真实地模拟引用共享
const reset = () => {
  // 原型链模式：共享 colors
  const sharedColors = ['red', 'blue']
  prototypeData.instance1 = { name: '实例1', colors: sharedColors }
  prototypeData.instance2 = { name: '实例2', colors: sharedColors }
  
  // 类模式：独立 colors
  classData.instance1 = { name: '实例1', colors: ['red', 'blue'] }
  classData.instance2 = { name: '实例2', colors: ['red', 'blue'] }
}

reset()

const pushColor = (mode, instanceNum) => {
  const newColor = ['green', 'yellow', 'purple', 'orange'][Math.floor(Math.random() * 4)]
  
  if (mode === 'prototype') {
    // 模拟：修改 instance1 的 colors，instance2 也会变
    prototypeData.instance1.colors.push(newColor)
    // 因为它们共享引用，所以不用手动改 instance2，Vue 会因为引用相同而更新
  } else {
    // 类模式：独立
    if (instanceNum === 1) classData.instance1.colors.push(newColor)
    else classData.instance2.colors.push(newColor)
  }
}

</script>

<template>
  <div class="demo-container">
    <div class="tabs">
      <button 
        class="tab-btn" 
        :class="{ active: currentMode === 'prototype' }"
        @click="currentMode = 'prototype'"
      >
        场景1：原型链继承 (有坑)
      </button>
      <button 
        class="tab-btn" 
        :class="{ active: currentMode === 'class' }"
        @click="currentMode = 'class'"
      >
        场景2：Class / 组合继承 (推荐)
      </button>
    </div>

    <div class="content-area">
      <div v-if="currentMode === 'prototype'" class="description">
        <p class="warn">⚠️ 缺陷演示：父类的引用属性 (Array) 被所有子类实例共享！</p>
        <pre class="code-block">
function Parent() {
  this.colors = ['red', 'blue'];
}
function Child() {}
Child.prototype = new Parent(); // 继承

const instance1 = new Child();
const instance2 = new Child();
</pre>
      </div>
      <div v-else class="description">
        <p class="success">✅ 修复演示：每个实例都有自己的属性副本。</p>
        <pre class="code-block">
class Parent {
  constructor() {
    this.colors = ['red', 'blue'];
  }
}
class Child extends Parent {}

const instance1 = new Child();
const instance2 = new Child();
</pre>
      </div>

      <div class="interactive-area">
        <!-- 实例 1 -->
        <div class="instance-card">
          <div class="card-header">实例 1 (instance1)</div>
          <div class="data-view">
            colors: {{ currentMode === 'prototype' ? prototypeData.instance1.colors : classData.instance1.colors }}
          </div>
          <button class="action-btn" @click="pushColor(currentMode, 1)">
            👉 instance1.colors.push('new')
          </button>
        </div>

        <!-- 关联图标 -->
        <div class="relation-icon">
          <span v-if="currentMode === 'prototype'" title="引用共享">🔗 共享引用</span>
          <span v-else title="独立引用">⚡️ 互不影响</span>
        </div>

        <!-- 实例 2 -->
        <div class="instance-card">
          <div class="card-header">实例 2 (instance2)</div>
          <div class="data-view">
            colors: {{ currentMode === 'prototype' ? prototypeData.instance2.colors : classData.instance2.colors }}
          </div>
          <button class="action-btn" @click="pushColor(currentMode, 2)">
            👉 instance2.colors.push('new')
          </button>
        </div>
      </div>
      
      <div class="result-msg" v-if="currentMode === 'prototype'">
        👀 看！你只操作了 <strong>实例 1</strong>，但 <strong>实例 2</strong> 也跟着变了！这就是原型链继承的弊端。
      </div>
       <div class="result-msg" v-else>
        🎉 看！你操作 <strong>实例 1</strong>，<strong>实例 2</strong> 完全不受影响。
      </div>
      
      <button class="reset-btn" @click="reset">重置数据</button>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  margin: 20px 0;
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.tab-btn {
  flex: 1;
  padding: 12px;
  cursor: pointer;
  border: none;
  background: transparent;
  font-weight: bold;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.tab-btn.active {
  color: var(--vp-c-brand);
  border-bottom: 2px solid var(--vp-c-brand);
  background-color: var(--vp-c-bg-soft);
}

.content-area {
  padding: 20px;
}

.description {
  margin-bottom: 20px;
}

.warn { color: #f56c6c; font-weight: bold; margin-bottom: 8px; }
.success { color: #42b883; font-weight: bold; margin-bottom: 8px; }

.code-block {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
}

.interactive-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.instance-card {
  flex: 1;
  min-width: 200px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-header { font-weight: bold; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 5px; }

.data-view {
  background-color: #f4f4f5;
  padding: 8px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  color: #333;
  min-height: 40px;
}
.html.dark .data-view {
    background-color: #333;
    color: #eee;
}

.action-btn {
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.action-btn:hover { opacity: 0.9; }

.relation-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: var(--vp-c-text-2);
  width: 80px;
  text-align: center;
}

.result-msg {
  margin-top: 20px;
  padding: 10px;
  background-color: var(--vp-c-bg);
  border-left: 4px solid var(--vp-c-brand);
  font-size: 14px;
}

.reset-btn {
  margin-top: 20px;
  width: 100%;
  padding: 8px;
  background-color: transparent;
  border: 1px dashed var(--vp-c-divider);
  color: var(--vp-c-text-2);
  cursor: pointer;
  border-radius: 4px;
}
.reset-btn:hover { border-color: var(--vp-c-text-1); color: var(--vp-c-text-1); }
</style>
