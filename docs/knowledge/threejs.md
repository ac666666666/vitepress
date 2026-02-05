# Three.js 基础与进阶

## 1. Three.js 三大要素
要渲染出一个 3D 场景，必须具备三个核心要素：

1.  **场景 (Scene)**：容器，容纳所有的 3D 物体、灯光等。
2.  **相机 (Camera)**：眼睛，决定了我们能看到什么。最常用的是透视相机 (`PerspectiveCamera`)。
3.  **渲染器 (Renderer)**：画笔，将场景和相机拍摄的画面渲染到 Canvas 上。

```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
```

## 2. 常见材质 (Material)

- **MeshBasicMaterial**：基础材质，不受光照影响，自带颜色。
- **MeshLambertMaterial**：漫反射材质，受光照影响，适合非金属表面（如木头、石头）。
- **MeshStandardMaterial**：PBR 物理材质，基于物理渲染，效果最逼真（需配置环境光）。

## 3. 性能优化技巧
- **复用 Geometry 和 Material**：不要在循环中创建几何体或材质。
- **使用 InstancedMesh**：当需要渲染大量相同的物体时（如森林、草地），使用实例化网格。
- **合并网格 (Merge Geometries)**：减少 Draw Call 次数。
- **及时 dispose**：当不再需要某个纹理或模型时，手动调用 `.dispose()` 释放显存。
