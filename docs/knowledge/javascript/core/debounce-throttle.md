# 防抖 (Debounce) 与节流 (Throttle)

[MDN JavaScript 文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

<DebounceThrottleDemo />

## 1. 核心概念对比

| 特性         | 防抖 (Debounce)                                                            | 节流 (Throttle)                                           |
| :----------- | :------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **定义**     | 高频事件触发后，**等待** n 秒后执行。如果 n 秒内再次触发，则**重新计时**。 | 高频事件触发，但在 n 秒内**只执行一次**。                 |
| **比喻**     | **回城读条**：被打断了就得重新读条。                                       | **技能冷却**：放完技能后进入 CD，CD 转好前不能再放。      |
| **关键点**   | 最后一次触发有效。                                                         | 稀释执行频率。                                            |
| **适用场景** | 搜索框联想、窗口 Resize、按钮防重复提交。                                  | 滚动加载 (Scroll)、鼠标移动 (MouseMove)、视频进度条拖拽。 |

## 2. 防抖 (Debounce) 实现

### 2.1 基础版 (非立即执行)

最常见的版本，事件停止触发 n 秒后执行。

```javascript
function debounce(fn, delay) {
  let timer = null;

  return function (...args) {
    // 如果之前有定时器，清除它（打断读条）
    if (timer) clearTimeout(timer);

    // 重新开启定时器（重新读条）
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}
```

### 2.2 立即执行版

触发时立刻执行一次，然后等待 n 秒不触发才重置。适用于按钮防重复点击。

```javascript
function debounceImmediate(fn, delay, immediate = true) {
  let timer = null;

  return function (...args) {
    if (timer) clearTimeout(timer);

    if (immediate) {
      // 如果没有定时器，说明是第一次（或冷却好了）
      const callNow = !timer;
      timer = setTimeout(() => (timer = null), delay);
      if (callNow) fn.apply(this, args);
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}
```

## 3. 节流 (Throttle) 实现

### 3.1 时间戳版 (立即执行)

第一次触发会立刻执行，停止触发后不会再补一次。

```javascript
function throttle(fn, delay) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();
    // 如果距离上次执行超过了 delay
    if (now - lastTime >= delay) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
```

### 3.2 定时器版 (非立即执行)

第一次触发不会立刻执行，而是等 delay 结束。停止触发后通常会再执行一次（补刀）。

```javascript
function throttleTimer(fn, delay) {
  let timer = null;

  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    }
  };
}
```

### 3.3 完美版 (可配置)

结合时间戳和定时器，实现更精确的控制。

```javascript
function throttle(fn, delay) {
  let timer = null;
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();
    const remaining = delay - (now - lastTime);

    // 如果时间到了，或者系统时间被修改了
    if (remaining <= 0 || remaining > delay) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(this, args);
      lastTime = now;
    } else if (!timer) {
      // 只有在没有定时器时才设置，保证最后一次会被触发
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}
```

## 4. 应用场景实战

1.  **搜索框联想 (Search Autocomplete)**
    - **策略**: 防抖 (Debounce)
    - **原因**: 用户输入 `iphon` 时不需要搜索，只有停顿下来（输入 `iphone` 完成）才发送请求。节省服务器资源。

2.  **滚动加载 (Infinite Scroll)**
    - **策略**: 节流 (Throttle)
    - **原因**: 用户滚动到底部需要加载更多。滚动事件触发频率极高，如果不节流，一秒钟可能计算几百次位置，导致页面卡顿。

3.  **窗口调整 (Window Resize)**
    - **策略**: 防抖 (Debounce)
    - **原因**: 通常只需要在用户调整完窗口大小后，重新计算布局（如 ECharts重绘）。

4.  **按钮防重复提交**
    - **策略**: 防抖 (立即执行版)
    - **原因**: 点击第一下立刻提交，后续的疯狂点击在 n 秒内无效。
