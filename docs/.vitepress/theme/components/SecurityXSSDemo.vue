<script setup>
import { ref } from "vue";

const userInput = ref('<script>alert("XSS")<' + "/script>");
const xssType = ref("reflected"); // 'reflected' | 'stored' | 'dom'
const renderedHtml = ref("");
const escapeHtml = (unsafe) => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(new RegExp("<", "g"), "&lt;")
    .replace(new RegExp(">", "g"), "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const simulateXSS = () => {
  if (xssType.value === "reflected") {
    // 模拟反射型 XSS：URL 参数直接回显
    renderedHtml.value = `欢迎回来, ${userInput.value}`;
  } else if (xssType.value === "stored") {
    // 模拟存储型 XSS：数据库内容直接渲染
    renderedHtml.value = `<div class="comment">${userInput.value}</div>`;
  } else if (xssType.value === "dom") {
    // 模拟 DOM 型 XSS：前端 JS 操作 DOM
    // 这里用纯文本展示逻辑，实际攻击会执行脚本
    renderedHtml.value = `document.getElementById('demo').innerHTML = '${userInput.value}'`;
  }
};

const simulateSafe = () => {
  const safeInput = escapeHtml(userInput.value);
  if (xssType.value === "reflected") {
    renderedHtml.value = `欢迎回来, ${safeInput}`;
  } else if (xssType.value === "stored") {
    renderedHtml.value = `<div class="comment">${safeInput}</div>`;
  } else if (xssType.value === "dom") {
    renderedHtml.value = `document.getElementById('demo').textContent = '${userInput.value}'`;
  }
};
</script>

<template>
  <div class="demo-container">
    <h3>XSS 攻击演示</h3>

    <div class="controls">
      <div class="control-group">
        <label>攻击类型:</label>
        <select v-model="xssType">
          <option value="reflected">反射型 (URL 参数回显)</option>
          <option value="stored">存储型 (数据库内容渲染)</option>
          <option value="dom">DOM 型 (前端 JS 操作)</option>
        </select>
      </div>

      <div class="control-group">
        <label>恶意输入:</label>
        <input v-model="userInput" class="input-code" />
      </div>

      <div class="actions">
        <button class="danger" @click="simulateXSS">模拟攻击 (无防护)</button>
        <button class="success" @click="simulateSafe">
          模拟防御 (转义/Safe API)
        </button>
      </div>
    </div>

    <div class="result-panel">
      <h4>浏览器渲染结果:</h4>
      <div class="render-box" v-html="renderedHtml"></div>

      <h4>实际 HTML 源码:</h4>
      <pre class="source-code">{{ renderedHtml }}</pre>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
}
.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}
.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.input-code {
  flex: 1;
  font-family: monospace;
  padding: 5px;
  border: 1px solid #ccc;
}
.actions {
  display: flex;
  gap: 10px;
}
button {
  padding: 8px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.danger {
  background: #f44336;
}
.success {
  background: #4caf50;
}

.result-panel {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
}
.render-box {
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 40px;
  margin-bottom: 10px;
}
.source-code {
  background: #2d2d2d;
  color: #d4d4d4;
  padding: 10px;
  border-radius: 4px;
  margin: 0;
  overflow-x: auto;
}
</style>
