<script setup>
import { ref, computed } from "vue";

const baseArray = ref([1, 2, 3, 4, 5]);
const currentArray = ref([...baseArray.value]);
const operationLog = ref([]);
const activeMethod = ref("");

// 重置
const reset = () => {
  currentArray.value = [...baseArray.value];
  operationLog.value = [];
  activeMethod.value = "";
};

// 记录日志
const log = (method, args, result, changed) => {
  const argsStr = args.map((a) => JSON.stringify(a)).join(", ");
  operationLog.value.unshift({
    id: Date.now(),
    method: `${method}(${argsStr})`,
    result: JSON.stringify(result),
    changed: changed ? "✅ 原数组改变" : "❌ 原数组未变",
    arraySnapshot: JSON.stringify(currentArray.value),
  });
};

// 演示方法
const methods = {
  push: () => {
    const val = Math.floor(Math.random() * 10);
    const res = currentArray.value.push(val);
    log("push", [val], res, true);
  },
  pop: () => {
    const res = currentArray.value.pop();
    log("pop", [], res, true);
  },
  shift: () => {
    const res = currentArray.value.shift();
    log("shift", [], res, true);
  },
  unshift: () => {
    const val = Math.floor(Math.random() * 10);
    const res = currentArray.value.unshift(val);
    log("unshift", [val], res, true);
  },
  splice: () => {
    // 随机删除一个元素
    if (currentArray.value.length === 0) return;
    const index = Math.floor(Math.random() * currentArray.value.length);
    const res = currentArray.value.splice(index, 1);
    log("splice", [index, 1], res, true);
  },
  sort: () => {
    const res = currentArray.value.sort((a, b) => b - a);
    log("sort", ["(a,b)=>b-a"], currentArray.value, true);
  },
  reverse: () => {
    const res = currentArray.value.reverse();
    log("reverse", [], currentArray.value, true);
  },
  // 不改变原数组
  map: () => {
    const newArr = currentArray.value.map((x) => x * 2);
    log("map", ["x=>x*2"], newArr, false);
  },
  filter: () => {
    const newArr = currentArray.value.filter((x) => x > 3);
    log("filter", ["x=>x>3"], newArr, false);
  },
  slice: () => {
    const newArr = currentArray.value.slice(1, 3);
    log("slice", [1, 3], newArr, false);
  },
  concat: () => {
    const newArr = currentArray.value.concat([8, 9]);
    log("concat", ["[8,9]"], newArr, false);
  },
  reduce: () => {
    const sum = currentArray.value.reduce((acc, cur) => acc + cur, 0);
    log("reduce", ["(a,b)=>a+b", 0], sum, false);
  },
};

const runMethod = (name) => {
  activeMethod.value = name;
  methods[name]();
};
</script>

<template>
  <div class="demo-container">
    <div class="current-state">
      <div class="label">当前数组 (Current Array):</div>
      <div class="array-box">
        <span v-if="currentArray.length === 0" class="empty">空数组 []</span>
        <transition-group name="list" tag="span">
          <span
            v-for="(item, index) in currentArray"
            :key="item + '-' + index"
            class="array-item"
          >
            {{ item }}
          </span>
        </transition-group>
      </div>
      <button class="reset-btn" @click="reset">重置</button>
    </div>

    <div class="methods-panel">
      <div class="group">
        <div class="group-title change">⚠️ 改变原数组 (Mutator)</div>
        <div class="buttons">
          <button @click="runMethod('push')">push(rand)</button>
          <button @click="runMethod('pop')">pop()</button>
          <button @click="runMethod('unshift')">unshift(rand)</button>
          <button @click="runMethod('shift')">shift()</button>
          <button @click="runMethod('splice')">splice(rand, 1)</button>
          <button @click="runMethod('sort')">sort(desc)</button>
          <button @click="runMethod('reverse')">reverse()</button>
        </div>
      </div>

      <div class="group">
        <div class="group-title no-change">
          ✅ 不改变原数组 (Accessor/Iteration)
        </div>
        <div class="buttons">
          <button @click="runMethod('map')">map(x*2)</button>
          <button @click="runMethod('filter')">filter(>3)</button>
          <button @click="runMethod('slice')">slice(1,3)</button>
          <button @click="runMethod('concat')">concat([8,9])</button>
          <button @click="runMethod('reduce')">reduce(sum)</button>
        </div>
      </div>
    </div>

    <div class="log-panel">
      <div class="log-title">操作日志 (Latest first)</div>
      <div class="log-list">
        <div v-for="log in operationLog" :key="log.id" class="log-item">
          <div class="log-header">
            <span class="method-name">{{ log.method }}</span>
            <span
              class="change-tag"
              :class="{
                yes: log.changed.includes('✅'),
                no: log.changed.includes('❌'),
              }"
            >
              {{ log.changed }}
            </span>
          </div>
          <div class="log-detail">
            <div>👉 返回值: {{ log.result }}</div>
            <div v-if="log.changed.includes('✅')">
              👉 操作后数组: {{ log.arraySnapshot }}
            </div>
          </div>
        </div>
        <div v-if="operationLog.length === 0" class="empty-log">
          暂无操作...
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

.current-state {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.label {
  font-weight: bold;
}

.array-box {
  background-color: var(--vp-c-bg);
  border: 2px solid var(--vp-c-brand);
  padding: 8px 15px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 16px;
  min-width: 150px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.array-item {
  display: inline-block;
  background-color: var(--vp-c-brand-dimm);
  padding: 2px 6px;
  border-radius: 4px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.reset-btn {
  margin-left: auto;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  background-color: var(--vp-c-bg);
}

.methods-panel {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.group-title {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.group-title.change {
  color: #f56c6c;
}
.group-title.no-change {
  color: #42b883;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.buttons button {
  padding: 6px 12px;
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.buttons button:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.log-panel {
  background-color: #1e1e1e;
  color: #d4d4d4;
  border-radius: 6px;
  padding: 15px;
  font-size: 13px;
  max-height: 300px;
  overflow-y: auto;
}

.log-title {
  color: #999;
  margin-bottom: 10px;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}

.log-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #333;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.method-name {
  color: #569cd6;
  font-weight: bold;
}

.change-tag {
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 3px;
}
.change-tag.yes {
  background-color: #4d2a2a;
  color: #ff9999;
}
.change-tag.no {
  background-color: #2a4d36;
  color: #99ffbb;
}

.log-detail {
  color: #bbb;
  margin-left: 10px;
}
.empty-log {
  color: #666;
  text-align: center;
  margin-top: 20px;
}
</style>
