# 数据可视化详解

[ECharts 官方文档](https://echarts.apache.org/zh/index.html)

前端数据可视化是将抽象的数据转化为直观的图表或图形的技术。

## 1. 核心技术选型：Canvas vs SVG

这是数据可视化最基础也是最重要的选择题。

| 特性         | Canvas (画布)                                           | SVG (可缩放矢量图形)                                        |
| :----------- | :------------------------------------------------------ | :---------------------------------------------------------- |
| **本质**     | **位图** (基于像素)。一个 HTML 标签 `<canvas>`。        | **矢量图** (基于 XML)。一堆 DOM 节点 (`<rect>`, `<path>`)。 |
| **渲染模式** | 立即模式 (Immediate Mode)。画完就忘，不知道画的是什么。 | 保留模式 (Retained Mode)。维护对象模型。                    |
| **事件处理** | **难**。需监听 Canvas 上的点击，计算坐标是否在图形内。  | **易**。直接给 DOM 节点绑定 `onclick`。                     |
| **性能**     | **数据量大时高性能** (10w+ 点)。开销在于重绘像素。      | **节点多时卡顿** (DOM 操作昂贵)。开销在于 DOM 维护。        |
| **缩放**     | 失真 (变模糊)。                                         | 不失真 (矢量)。                                             |
| **适用场景** | 游戏、热力图、粒子效果、超大数据量图表。                | 矢量图标、地图、常规报表 (柱状图/饼图)。                    |
| **代表库**   | ECharts (底层默认 Canvas, 可切 SVG), Chart.js           | D3.js, Highcharts                                           |

---

## 2. Canvas API 实战

```html
<canvas id="myCanvas" width="200" height="100"></canvas>
```

```javascript
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d"); // 获取 2D 上下文

// 1. 绘制矩形
ctx.fillStyle = "red";
ctx.fillRect(10, 10, 50, 50);

// 2. 绘制路径 (Path)
ctx.beginPath();
ctx.moveTo(70, 10);
ctx.lineTo(100, 50);
ctx.lineTo(70, 90);
ctx.strokeStyle = "blue";
ctx.stroke();

// 3. 动画 (清空 -> 重绘)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空
  // ... 更新坐标并绘制 ...
  requestAnimationFrame(draw);
}
```

---

## 3. SVG 实战

SVG 可以直接写在 HTML 中，像操作 div 一样操作它。

```html
<svg width="200" height="100" style="border:1px solid black">
  <!-- 矩形 -->
  <rect
    x="10"
    y="10"
    width="50"
    height="50"
    fill="red"
    onclick="alert('rect!')"
  />

  <!-- 圆形 -->
  <circle cx="100" cy="35" r="25" fill="blue" />

  <!-- 路径 -->
  <path d="M 150 10 L 180 50 L 150 90" stroke="green" fill="none" />
</svg>
```

---

## 4. 常用可视化库

### 4.1 ECharts 图表大全 (配置式)

百度开源，国内最流行。核心是**配置项 (Options)**。

#### (1) 基础柱状图 (Bar)

<EChartsDemo type="bar" />

```javascript
const option = {
  title: { text: "销量统计" },
  tooltip: {},
  xAxis: { data: ["衬衫", "羊毛衫", "雪纺衫"] },
  yAxis: {},
  series: [
    {
      name: "销量",
      type: "bar",
      data: [5, 20, 36],
    },
  ],
};
```

#### (2) 平滑折线图 (Line) + 区域填充

<EChartsDemo type="line" />

```javascript
const option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: { type: "value" },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      smooth: true, // 平滑曲线
      areaStyle: {}, // 区域填充颜色
    },
  ],
};
```

#### (3) 南丁格尔玫瑰图 (Pie)

<EChartsDemo type="pie" />

```javascript
const option = {
  series: [
    {
      name: "Nightingale Chart",
      type: "pie",
      radius: [50, 250],
      center: ["50%", "50%"],
      roseType: "area", // 玫瑰图模式
      itemStyle: { borderRadius: 8 },
      data: [
        { value: 40, name: "rose 1" },
        { value: 38, name: "rose 2" },
        { value: 32, name: "rose 3" },
        { value: 30, name: "rose 4" },
        { value: 28, name: "rose 5" },
      ],
    },
  ],
};
```

#### (4) 雷达图 (Radar) - 能力维度分析

<EChartsDemo type="radar" />

```javascript
const option = {
  radar: {
    indicator: [
      { name: "销售", max: 6500 },
      { name: "管理", max: 16000 },
      { name: "信息技术", max: 30000 },
      { name: "客服", max: 38000 },
      { name: "研发", max: 52000 },
    ],
  },
  series: [
    {
      type: "radar",
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000],
          name: "预算分配",
        },
      ],
    },
  ],
};
```

### 4.2 D3.js (数据驱动文档)

可视化界的 jQuery。

- **核心**: **Select (选择) -> Data (绑定数据) -> Enter/Update/Exit (处理数据变化)**。
- **优点**: 极其灵活，可以画出任何你能想到的形状。
- **缺点**: 学习曲线极其陡峭，不是现成的图表库，而是绘图工具库。

#### 演示: D3 数据绑定

```javascript
import * as d3 from "d3";

const data = [30, 86, 168, 281, 303];

d3.select(".chart")
  .selectAll("div") // 1. 选择所有 div (此时可能还没 div)
  .data(data) // 2. 绑定数据
  .enter() // 3. 进入 Enter 状态 (数据多于节点时)
  .append("div") // 4. 为每个数据追加 div
  .style("width", (d) => d + "px")
  .text((d) => d);
```

### 4.3 Cesium (3D GIS / 数字地球)

Cesium 是一个用于创建 3D 地球和 2D 地图的开源 JavaScript 库。

- **核心领域**: GIS (地理信息系统)、数字孪生、智慧城市、航空航天。
- **底层**: 基于 WebGL，但比 Three.js 更专注于地理坐标系 (WGS84)。
- **杀手锏**: **3D Tiles** (海量异构 3D 地理空间数据流标准)。

#### Cesium vs Three.js

| 特性         | Cesium                                       | Three.js                      |
| :----------- | :------------------------------------------- | :---------------------------- |
| **定位**     | 真实的地理空间 (地球是圆的)                  | 通用的 3D 场景 (世界是平的)   |
| **坐标系**   | WGS84 (经纬度, 高度)                         | 笛卡尔坐标系 (x, y, z)        |
| **数据加载** | 擅长加载海量 GIS 数据 (地形, 影像, 3D Tiles) | 擅长加载模型 (glTF, OBJ, FBX) |
| **适用场景** | 智慧城市, 轨迹回放, BIM + GIS                | 游戏, 汽车展示, 粒子特效      |

#### 演示: 初始化地球并添加实体

<CesiumDemo />

```javascript
// 1. 初始化 Viewer (挂载到 id="cesiumContainer" 的 div)
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrainProvider: Cesium.createWorldTerrain(), // 加载地形
  animation: false, // 隐藏动画控件
  timeline: false, // 隐藏时间轴
});

// 2. 添加一个点 (Entity)
const entity = viewer.entities.add({
  name: "Beijing",
  position: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 100000), // 经度, 纬度, 高度
  point: {
    pixelSize: 10,
    color: Cesium.Color.RED,
  },
  label: {
    text: "Beijing",
    font: "14pt monospace",
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  },
});

// 3. 相机飞向该点
viewer.zoomTo(entity);

// 4. 加载 3D Tiles (如建筑模型)
const tileset = viewer.scene.primitives.add(
  new Cesium.Cesium3DTileset({
    url: "http://localhost/tileset.json",
  }),
);
```

---

## 5. 面试常考题

### Q1: 如果要在页面上渲染 10 万个点，怎么做？

1.  **首选 WebGL (Three.js / Deck.gl)**: 利用 GPU 并行计算能力，性能最强。
2.  **次选 Canvas**: 相比 SVG，Canvas 少了 DOM 操作开销。使用 `requestAnimationFrame` 分批渲染或离屏渲染 (OffscreenCanvas)。
3.  **绝对不要用 SVG**: 10 万个 DOM 节点会直接卡死浏览器。

### Q2: 虚拟滚动 (Virtual Scroll) 在图表中的应用？

当数据量巨大 (如股票 K 线图) 时，只渲染当前视口可见范围内的数据点。当用户拖拽/缩放时，动态计算需要渲染的数据区间。ECharts 的 `dataZoom` 组件内部就使用了类似技术。

### Q3: Cesium 如何处理海量模型数据 (如整个城市的建筑)？

使用 **3D Tiles**。

- **分层细节 (HLOD)**: 远看是简单的方块，近看是精细的模型。
- **空间索引**: 只有在视野范围内的瓦片才会被请求和渲染。
- **流式加载**: 像视频流一样，边走边加载，不会一次性卡死。

### Q4: 移动端适配怎么做？

- **SVG**: 天然矢量，无损缩放。
- **Canvas**: 可能会模糊。解决方案是根据 `window.devicePixelRatio` 放大 Canvas 的 `width/height` 属性，然后用 CSS 缩小回原尺寸。
  ```javascript
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  ```
