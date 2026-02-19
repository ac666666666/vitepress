<script setup>
import { ref, computed } from "vue";

const boxSizing = ref("content-box");
const width = ref(200);
const padding = ref(20);
const border = ref(10);
const margin = ref(20);

const totalWidth = computed(() => {
  if (boxSizing.value === "content-box") {
    return width.value + padding.value * 2 + border.value * 2;
  } else {
    return width.value; // In border-box, width includes padding and border
  }
});

const contentWidth = computed(() => {
  if (boxSizing.value === "content-box") {
    return width.value;
  } else {
    return Math.max(0, width.value - padding.value * 2 - border.value * 2);
  }
});

const boxStyle = computed(() => ({
  boxSizing: boxSizing.value,
  width: `${width.value}px`,
  padding: `${padding.value}px`,
  border: `${border.value}px solid #f56c6c`, // Red border
  margin: `${margin.value}px`,
  backgroundColor: "#409eff", // Blue content
  color: "white",
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative", // For overlay
}));

const containerStyle = computed(() => ({
  border: "2px dashed #909399",
  padding: "10px",
  display: "inline-block",
  backgroundColor: "#f4f4f5", // Grey margin area
}));
</script>

<template>
  <div class="demo-container">
    <div class="controls">
      <div class="control-group">
        <label>Box Sizing:</label>
        <select v-model="boxSizing">
          <option value="content-box">content-box (标准)</option>
          <option value="border-box">border-box (怪异/IE)</option>
        </select>
      </div>
      <div class="control-group">
        <label>Width (CSS设置): {{ width }}px</label>
        <input type="range" v-model.number="width" min="100" max="400" />
      </div>
      <div class="control-group">
        <label>Padding: {{ padding }}px</label>
        <input type="range" v-model.number="padding" min="0" max="50" />
      </div>
      <div class="control-group">
        <label>Border: {{ border }}px</label>
        <input type="range" v-model.number="border" min="0" max="20" />
      </div>
      <div class="control-group">
        <label>Margin: {{ margin }}px</label>
        <input type="range" v-model.number="margin" min="0" max="50" />
      </div>
    </div>

    <div class="visualization">
      <div class="info-panel">
        <p>
          <strong>CSS 设置:</strong> <code>width: {{ width }}px</code>
        </p>
        <p><strong>实际内容宽度 (Content):</strong> {{ contentWidth }}px</p>
        <p>
          <strong>元素总占用宽度 (OffsetWidth):</strong>
          {{ boxSizing === "content-box" ? totalWidth : width }}px (不含 Margin)
        </p>
        <p class="formula" v-if="boxSizing === 'content-box'">
          计算公式: width({{ width }}) + padding({{ padding }}*2) + border({{
            border
          }}*2) = {{ totalWidth }}
        </p>
        <p class="formula" v-else>
          计算公式: width({{ width }}) (包含了 padding 和 border)
        </p>
      </div>

      <div class="box-wrapper" :style="containerStyle">
        <span class="label margin-label">Margin ({{ margin }})</span>
        <div class="the-box" :style="boxStyle">
          <span class="content-text">Content<br />({{ contentWidth }}px)</span>
          <div
            class="padding-overlay"
            :style="{
              border: `${padding}px solid rgba(103, 194, 58, 0.3)`,
              top: `-${border}px`,
              left: `-${border}px`,
              right: `-${border}px`,
              bottom: `-${border}px`,
            }"
          >
            <span class="label padding-label" v-if="padding > 5"
              >Padding ({{ padding }})</span
            >
          </div>
          <span class="label border-label" v-if="border > 2"
            >Border ({{ border }})</span
          >
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.visualization {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.info-panel {
  background-color: var(--vp-c-bg);
  padding: 15px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  width: 100%;
}

.info-panel p {
  margin: 5px 0;
  font-size: 14px;
}
.formula {
  color: var(--vp-c-brand);
  font-weight: bold;
}

.box-wrapper {
  position: relative;
  transition: all 0.3s;
}

.the-box {
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.padding-overlay {
  position: absolute;
  pointer-events: none;
  box-sizing: border-box; /* Ensures border width is correct */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.label {
  position: absolute;
  font-size: 10px;
  color: #333;
  pointer-events: none;
}

.margin-label {
  top: -18px;
  left: 0;
  color: #909399;
  font-weight: bold;
}
.padding-label {
  top: -15px;
  color: #67c23a;
  font-weight: bold;
  width: 100%;
  text-align: center;
}
.border-label {
  top: -12px;
  right: -12px;
  color: #f56c6c;
  font-weight: bold;
  transform: translateX(100%);
}
.content-text {
  z-index: 1;
  font-size: 12px;
  line-height: 1.2;
}
</style>
