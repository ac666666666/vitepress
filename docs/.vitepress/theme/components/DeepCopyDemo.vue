<script setup>
import { ref, reactive, watch } from "vue";

const original = reactive({
  name: "小明",
  age: 18,
  info: {
    city: "北京",
    school: "北大",
  },
});

const copyResult = ref(null);
const copyType = ref(""); // 'shallow' | 'deep'

const doShallowCopy = () => {
  copyType.value = "shallow";
  // 浅拷贝：Object.assign 或 ...
  copyResult.value = { ...original };
};

const doDeepCopy = () => {
  copyType.value = "deep";
  // 深拷贝：简易版 JSON
  copyResult.value = JSON.parse(JSON.stringify(original));
};

const modifyCopy = () => {
  if (!copyResult.value) return;
  // 修改拷贝对象的嵌套属性
  copyResult.value.info.city = "上海";
  copyResult.value.name = "小红";
};

const reset = () => {
  original.name = "小明";
  original.info.city = "北京";
  copyResult.value = null;
  copyType.value = "";
};
</script>

<template>
  <div class="demo-container">
    <div class="controls">
      <button class="btn primary" @click="doShallowCopy">
        执行浅拷贝 (Spread)
      </button>
      <button class="btn primary" @click="doDeepCopy">执行深拷贝 (JSON)</button>
      <button class="btn danger" @click="reset">重置所有数据</button>
    </div>

    <div class="display-area">
      <!-- 原始对象 -->
      <div class="card original">
        <div class="card-header">原始对象 (Original)</div>
        <pre>{{ original }}</pre>
      </div>

      <!-- 箭头 -->
      <div class="arrow" v-if="copyResult">
        <span v-if="copyType === 'shallow'">浅拷贝 (引用)</span>
        <span v-else>深拷贝 (独立)</span>
        ➡️
      </div>

      <!-- 拷贝对象 -->
      <div class="card copy" v-if="copyResult">
        <div class="card-header">拷贝对象 (Copy)</div>
        <pre>{{ copyResult }}</pre>
        <div class="action">
          <p>👇 尝试修改拷贝对象的属性：</p>
          <button class="btn warning" @click="modifyCopy">
            修改 Copy 的 City 为 "上海"
          </button>
          <p class="hint" v-if="copyType === 'shallow'">
            ⚠️ 注意：修改嵌套属性 (info.city) 会影响原始对象！
          </p>
          <p class="hint" v-else>✅ 注意：修改嵌套属性不会影响原始对象。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  padding: 20px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  margin: 20px 0;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.display-area {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.card {
  flex: 1;
  min-width: 250px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 15px;
  transition: all 0.3s;
}

.card.original {
  border-color: #42b883;
}

.card.copy {
  border-color: #647eff;
}

.card-header {
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 5px;
}

pre {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 10px;
  border-radius: 4px;
  overflow: auto;
  font-size: 13px;
}

.arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  align-self: center;
}

.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
}

.btn.primary {
  background-color: var(--vp-c-brand);
  color: white;
}

.btn.danger {
  background-color: #f56c6c;
  color: white;
}

.btn.warning {
  background-color: #e6a23c;
  color: white;
  width: 100%;
  margin-top: 10px;
}

.hint {
  font-size: 12px;
  margin-top: 5px;
  color: #e6a23c;
}
</style>
