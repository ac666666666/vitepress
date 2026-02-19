# 组件通信全方案深度解析

[Vue.js 官方文档](https://cn.vuejs.org/)

Vue 组件通信是构建大型应用的基础。除了常见的 Props/Emit，还需要掌握跨层级、跨组件的通信技巧。本文将详细对比 Vue 2 和 Vue 3 在不同场景下的实现方式。

<VueCommunicationDemo />

## 1. 通信方式总览表

| 方式                  | 适用场景     | Vue 2 | Vue 3           | 复杂度 | 推荐指数   |
| :-------------------- | :----------- | :---- | :-------------- | :----- | :--------- |
| **Props / Emit**      | 父子         | ✅    | ✅              | 低     | ⭐⭐⭐⭐⭐ |
| **v-model**           | 父子 (双向)  | ✅    | ✅ (升级)       | 中     | ⭐⭐⭐⭐⭐ |
| **Ref / Expose**      | 父调子       | ✅    | ✅ (需显式暴露) | 低     | ⭐⭐⭐⭐   |
| **Provide / Inject**  | 祖先 -> 后代 | ✅    | ✅              | 中     | ⭐⭐⭐⭐   |
| **Attrs / Listeners** | 透传 (HOC)   | ✅    | ✅ (合并)       | 中     | ⭐⭐⭐     |
| **EventBus**          | 任意组件     | ✅    | ❌ (需第三方库) | 低     | ⭐⭐       |
| **Vuex / Pinia**      | 全局状态     | ✅    | ✅              | 高     | ⭐⭐⭐⭐⭐ |

---

## 2. Props / Emit (父子通信)

最基础的通信方式：父组件通过 `props` 向下传递数据，子组件通过 `emit` 向上发送事件。

### Vue 2 (Options API)

```javascript
// Child.vue
export default {
  props: {
    msg: { type: String, default: '' }
  },
  methods: {
    sendToParent() {
      this.$emit('update', 'New Message');
    }
  }
}

// Parent.vue
<template>
  <Child :msg="parentMsg" @update="handleUpdate" />
</template>
```

### Vue 3 (Script Setup)

```javascript
// Child.vue
<script setup>
// 1. 定义 Props
const props = defineProps({
  msg: { type: String, default: '' }
})

// 2. 定义 Emits
const emit = defineEmits(['update'])

const sendToParent = () => {
  emit('update', 'New Message')
}
</script>

// Parent.vue
<template>
  <Child :msg="parentMsg" @update="handleUpdate" />
</template>
```

---

## 3. v-model (双向绑定)

### Vue 2 (Options API)

Vue 2 中默认使用 `value` prop 和 `input` 事件。如果是 `.sync` 修饰符，则使用 `update:propName` 事件。

```javascript
// Child.vue
export default {
  // 自定义 v-model 属性名
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  methods: {
    toggle() {
      this.$emit('change', !this.checked);
    }
  }
}

// Parent.vue
<Child v-model="isChecked" />
```

### Vue 3 (Script Setup)

Vue 3 统一了 `v-model` 和 `.sync`，默认使用 `modelValue` prop 和 `update:modelValue` 事件。支持多个 `v-model`。

```javascript
// Child.vue
<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const updateValue = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

// Parent.vue
<Child v-model="searchText" />

// 多个 v-model 写法
// <Child v-model:title="pageTitle" v-model:content="pageContent" />
```

> **Vue 3.4+ 新特性**: `defineModel()` 宏大大简化了 v-model 的使用。
>
> ```javascript
> const model = defineModel();
> model.value = "new value";
> ```

---

## 4. Ref / Expose (父组件调用子组件方法)

### Vue 2 (Options API)

Vue 2 中子组件默认是**开放**的，父组件可以通过 `this.$refs.child` 访问子组件实例的所有属性和方法。

```javascript
// Child.vue
export default {
  methods: {
    validate() {
      console.log('Child validating...');
    }
  }
}

// Parent.vue
export default {
  mounted() {
    this.$refs.childRef.validate(); // 直接调用
  }
}
```

### Vue 3 (Script Setup)

Vue 3 `<script setup>` 中组件默认是**封闭**的。必须通过 `defineExpose` 显式暴露。

```javascript
// Child.vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
const validate = () => { console.log('Validating') }

// 显式暴露
defineExpose({
  count,
  validate
})
</script>

// Parent.vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = ref(null)

onMounted(() => {
  // 必须确保组件已挂载
  childRef.value?.validate()
})
</script>
```

---

## 5. Provide / Inject (跨层级通信)

适用于祖先组件向后代组件（无论多深）传递数据。

### Vue 2 (Options API)

```javascript
// Ancestor.vue
export default {
  provide() {
    return {
      theme: 'dark', // 非响应式
      user: this.user // 响应式对象需传入 this.xxx
    }
  },
  data() {
    return { user: { name: 'Alice' } }
  }
}

// Descendant.vue
export default {
  inject: ['theme', 'user'],
  mounted() {
    console.log(this.theme, this.user.name);
  }
}
```

### Vue 3 (Script Setup)

```javascript
// Ancestor.vue
<script setup>
import { provide, ref } from 'vue'

const theme = ref('dark')
// 提供响应式数据
provide('theme', theme)
provide('updateTheme', (val) => theme.value = val)
</script>

// Descendant.vue
<script setup>
import { inject } from 'vue'

const theme = inject('theme')
const updateTheme = inject('updateTheme')

// 修改 theme
updateTheme('light')
</script>
```

---

## 6. EventBus (任意组件通信)

### Vue 2 (Options API)

Vue 2 实例本身就是一个事件中心，通常创建一个空的 Vue 实例作为总线。

```javascript
// bus.js
import Vue from "vue";
export const EventBus = new Vue();

// ComponentA.vue (发送)
import { EventBus } from "./bus";
EventBus.$emit("global-event", "payload");

// ComponentB.vue (接收)
import { EventBus } from "./bus";
EventBus.$on("global-event", (msg) => {
  console.log(msg);
});
```

### Vue 3 (Script Setup)

Vue 3 移除了 `$on`, `$off`, `$once` 实例方法。需要使用第三方库（如 `mitt`）。

```javascript
// utils/mitt.js
import mitt from "mitt";
export const emitter = mitt();

// ComponentA.vue
import { emitter } from "./utils/mitt";
emitter.emit("foo", { a: "b" });

// ComponentB.vue
import { emitter } from "./utils/mitt";
import { onUnmounted } from "vue";

const handler = (e) => console.log(e);
emitter.on("foo", handler);

onUnmounted(() => {
  emitter.off("foo", handler); // 记得销毁
});
```

---

## 7. Attrs / Listeners (透传)

### Vue 2 (Options API)

- `$attrs`: 包含父作用域中不作为 prop 被识别 (且获取) 的 attribute 绑定 (class 和 style 除外)。
- `$listeners`: 包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。

```html
<!-- Wrapper.vue -->
<template>
  <ChildComponent v-bind="$attrs" v-on="$listeners" />
</template>
```

### Vue 3 (Script Setup)

Vue 3 中 `$listeners` 被移除，事件监听器现在是 `$attrs` 的一部分。

```javascript
// Wrapper.vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
// attrs 包含 class, style, id, 以及 @click 等事件
</script>

<template>
  <ChildComponent v-bind="$attrs" />
</template>
```
