# Three.js 3D 开发详解

[Three.js 官方文档](https://threejs.org/docs/)

Three.js 是基于 WebGL 的 3D 引擎，它封装了底层的 WebGL API，让开发者能更容易地在网页上创建 3D 内容。

## 1. 核心概念与起步

### 1.1 三大件 (Scene, Camera, Renderer)

要渲染一个 3D 画面，必须具备：

1.  **Scene (场景)**: 也就是舞台，容纳所有物体。
2.  **Camera (相机)**: 也就是观众的眼睛。
    - `PerspectiveCamera` (透视): 近大远小，模拟人眼 (最常用)。
    - `OrthographicCamera` (正交): 远近一样大，用于工程图、UI。
3.  **Renderer (渲染器)**: 将场景和相机结合，计算出像素画面。

### 1.2 坐标系

Three.js 使用**右手坐标系**:

- x 轴: 向右
- y 轴: 向上
- z 轴: 向屏幕外 (指向你)

#### 代码演示: 最小 Demo

<ThreeDemo />

```javascript
import * as THREE from "three";

// 1. 创建场景
const scene = new THREE.Scene();

// 2. 创建相机 (FOV, 宽高比, 近平面, 远平面)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

// 3. 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true }); // 抗锯齿
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. 添加物体 (骨架 Geometry + 皮肤 Material = Mesh)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. 动画循环
function animate() {
  requestAnimationFrame(animate);

  // 让立方体转起来
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
```

---

## 2. 进阶功能

### 2.1 材质与光照

- **Basic**: 不受光照影响，没有阴影，性能最好。
- **Lambert**: 漫反射 (木头、纸)，需要光照。
- **Phong**: 镜面反射 (塑料、金属)，有高光。
- **Standard (PBR)**: 基于物理渲染，最真实 (现代游戏主流)。

```javascript
// 添加光源
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

// 使用 PBR 材质
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  roughness: 0.5, // 粗糙度
  metalness: 0.5, // 金属度
});
```

### 2.2 交互 (Raycaster)

如何在 3D 场景中点击物体？使用 **光线投射 (Raycaster)**。
原理：从相机位置向鼠标点击位置发射一条射线，检测射线穿过了哪些物体。

#### 代码演示: 点击变色

```javascript
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener("click", (event) => {
  // 1. 归一化鼠标坐标 (-1 到 +1)
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 2. 发射射线
  raycaster.setFromCamera(pointer, camera);

  // 3. 检测相交
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    // 选中第一个物体
    intersects[0].object.material.color.set(0xff0000);
  }
});
```

### 2.3 轨道控制器 (OrbitControls)

允许用户用鼠标旋转、缩放、平移相机。

```javascript
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 阻尼感 (惯性)

// 在 animate 中需要更新
function animate() {
  controls.update();
  renderer.render(scene, camera);
}
```

---

## 3. 性能优化 (重中之重)

### 3.1 实例化渲染 (InstancedMesh)

**场景**: 需要渲染 10,000 棵树或子弹。
**错误做法**: 循环 new 10,000 个 `Mesh`。会导致 Draw Call 爆炸，FPS 极低。
**正确做法**: 使用 `InstancedMesh`。GPU 一次绘制，性能提升百倍。

```javascript
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial();
const count = 10000;

// 创建一个实例化网格，包含 10000 个实例
const mesh = new THREE.InstancedMesh(geometry, material, count);

const matrix = new THREE.Matrix4();
for (let i = 0; i < count; i++) {
  // 设置每个实例的位置、旋转、缩放
  matrix.setPosition(
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
  );
  mesh.setMatrixAt(i, matrix);
}

scene.add(mesh);
```

### 3.2 资源销毁 (Dispose)

Three.js 不会自动释放显存。当删除物体时，必须手动释放。

```javascript
scene.remove(cube);
cube.geometry.dispose(); // 释放顶点数据
cube.material.dispose(); // 释放着色器程序
```

---

## 4. 面试常考题

### Q1: Three.js 和 WebGL 的关系？

- WebGL 是浏览器提供的底层 API，只能画点、线、三角形，且需要写复杂的 GLSL (着色器语言)。
- Three.js 是对 WebGL 的封装，提供了面向对象的 Scene, Camera, Mesh 等概念，极大降低了开发门槛。

### Q2: 什么是 Draw Call？如何优化？

- **Draw Call**: CPU 通知 GPU 进行一次绘制的命令。
- Draw Call 太多 (如几千次) 会导致 CPU 瓶颈。
- **优化**:
  1.  **合并网格 (Merge)**: 将不动的物体合并成一个大 Geometry。
  2.  **实例化 (Instancing)**: 相同的物体使用 `InstancedMesh`。
  3.  **纹理图集 (Texture Atlas)**: 多张小图合并为一张大图，减少纹理切换。

### Q3: 如何处理 3D 场景中的点击事件？

- DOM 事件无法直接作用于 3D 物体。
- 使用 `Raycaster` (光线投射)。将屏幕坐标转换为 3D 空间射线，检测相交。
