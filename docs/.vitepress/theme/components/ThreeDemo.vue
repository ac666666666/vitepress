<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const container = ref(null);
let renderer, scene, camera, controls, animationId;

const init = () => {
  if (!container.value) return;

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  // 1. Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // 2. Camera
  camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
  camera.position.set(0, 0, 2);

  // 3. Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.value.appendChild(renderer.domElement);

  // 4. Cube
  const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const material = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 5. Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Animation Loop
  const animate = (time) => {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    controls.update();
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
  };

  animate(0);
};

const handleResize = () => {
  if (!container.value || !camera || !renderer) return;

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onMounted(() => {
  // Use requestAnimationFrame to ensure DOM is ready and layout is stable
  requestAnimationFrame(() => {
    init();
    window.addEventListener("resize", handleResize);
  });
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div ref="container" class="three-container">
    <div class="overlay-text">Drag to Rotate | Scroll to Zoom</div>
  </div>
</template>

<style scoped>
.three-container {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  margin: 16px 0;
}

.overlay-text {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #333;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
  font-size: 14px;
  user-select: none;
}
</style>
