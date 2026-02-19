<script setup>
import { ref, computed } from "vue";

const currentType = ref("person"); // 'person' | 'array' | 'object' | 'null_obj'

// 模拟的构造函数
class Person {
  constructor(name) {
    this.name = name;
  }
  sayHello() {
    return `Hello, I'm ${this.name}`;
  }
}

// 获取原型链数据的函数
const getPrototypeChain = (type) => {
  let obj;
  let chain = [];

  if (type === "person") {
    obj = new Person("Alice");
  } else if (type === "array") {
    obj = [1, 2, 3];
  } else if (type === "object") {
    obj = { a: 1 };
  } else if (type === "null_obj") {
    obj = Object.create(null);
    obj.desc = "No Prototype";
  }

  let current = obj;

  // 第一层：实例本身
  chain.push({
    title: "实例 (Instance)",
    desc:
      type === "person"
        ? `Person { name: "${obj.name}" }`
        : type === "array"
        ? `Array [${obj.join(", ")}]`
        : type === "object"
        ? `Object { a: 1 }`
        : `Object (No Proto) { desc: ... }`,
    isEnd: false,
  });

  // 遍历原型链
  while (true) {
    const proto = Object.getPrototypeOf(current);
    if (!proto) {
      chain.push({
        title: "null",
        desc: "原型链终点 (End of Chain)",
        isEnd: true,
      });
      break;
    }

    let desc = "";
    if (proto === Person.prototype)
      desc = "Person.prototype (Custom Methods: sayHello)";
    else if (proto === Array.prototype)
      desc = "Array.prototype (Methods: push, map...)";
    else if (proto === Object.prototype)
      desc = "Object.prototype (Methods: toString, hasOwnProperty...)";
    else desc = "Unknown Prototype";

    chain.push({
      title: proto.constructor
        ? proto.constructor.name + ".prototype"
        : "Prototype",
      desc: desc,
      isEnd: false,
    });

    current = proto;
  }

  return chain;
};

const chainData = computed(() => getPrototypeChain(currentType.value));

const setType = (type) => {
  currentType.value = type;
};
</script>

<template>
  <div class="demo-container">
    <div class="controls">
      <button
        class="btn"
        :class="{ active: currentType === 'person' }"
        @click="setType('person')"
      >
        自定义对象 (Person)
      </button>
      <button
        class="btn"
        :class="{ active: currentType === 'array' }"
        @click="setType('array')"
      >
        数组 (Array)
      </button>
      <button
        class="btn"
        :class="{ active: currentType === 'object' }"
        @click="setType('object')"
      >
        普通对象 (Object)
      </button>
      <button
        class="btn"
        :class="{ active: currentType === 'null_obj' }"
        @click="setType('null_obj')"
      >
        无原型对象 (Object.create(null))
      </button>
    </div>

    <div class="chain-display">
      <div
        v-for="(node, index) in chainData"
        :key="index"
        class="chain-node-wrapper"
      >
        <!-- 节点 -->
        <div class="chain-node" :class="{ 'is-null': node.isEnd }">
          <div class="node-title">{{ node.title }}</div>
          <div class="node-desc">{{ node.desc }}</div>
        </div>

        <!-- 箭头 (如果是最后一个节点则不显示) -->
        <div v-if="!node.isEnd" class="arrow-container">
          <div class="arrow-line"></div>
          <div class="arrow-label">__proto__</div>
          <div class="arrow-head">▼</div>
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
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.btn.active {
  background-color: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.chain-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chain-node-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.chain-node {
  background-color: var(--vp-c-bg);
  border: 2px solid var(--vp-c-brand);
  border-radius: 8px;
  padding: 15px 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.chain-node:hover {
  transform: translateY(-2px);
}

.chain-node.is-null {
  border-color: #999;
  background-color: #f5f5f5;
  color: #666;
}

.html.dark .chain-node.is-null {
  background-color: #333;
  color: #aaa;
  border-color: #555;
}

.node-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 5px;
}

.node-desc {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.arrow-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 60px;
  justify-content: center;
  position: relative;
}

.arrow-line {
  width: 2px;
  height: 100%;
  background-color: var(--vp-c-divider);
}

.arrow-label {
  position: absolute;
  background-color: var(--vp-c-bg-soft);
  padding: 2px 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  border-radius: 4px;
}

.arrow-head {
  color: var(--vp-c-divider);
  font-size: 12px;
  margin-top: -8px; /* Slight overlap to connect */
}
</style>
