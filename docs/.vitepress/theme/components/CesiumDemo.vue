<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const container = ref(null)
let viewer = null

onMounted(async () => {
  if (!container.value) return
  
  // Dynamic import to avoid SSR issues
  const Cesium = await import('cesium')
  // Import CSS
  await import('cesium/Build/Cesium/Widgets/widgets.css')

  // Use local Natural Earth texture to avoid API keys
  const imageryProvider = new Cesium.TileMapServiceImageryProvider({
    url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
  })

  viewer = new Cesium.Viewer(container.value, {
    imageryProvider: imageryProvider,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false
  })
  
  // Hide credit
  const credit = viewer.cesiumWidget.creditContainer
  credit.style.display = 'none'

  // Add a red box entity in Beijing
  const entity = viewer.entities.add({
    name: 'Beijing Box',
    position: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 10000.0),
    box: {
      dimensions: new Cesium.Cartesian3(10000.0, 10000.0, 10000.0),
      material: Cesium.Color.RED.withAlpha(0.6),
      outline: true,
      outlineColor: Cesium.Color.BLACK
    }
  })
  
  viewer.flyTo(entity, {
    duration: 3,
    offset: new Cesium.HeadingPitchRange(0, -0.5, 50000)
  })
})

onUnmounted(() => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
})
</script>

<template>
  <div class="cesium-wrapper">
    <div ref="container" class="cesium-container"></div>
    <div class="overlay-text">Cesium 3D Demo</div>
  </div>
</template>

<style scoped>
.cesium-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  margin: 16px 0;
}

.cesium-container {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
}

.overlay-text {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  pointer-events: none;
  font-size: 14px;
  z-index: 1;
}

/* Fix Cesium widget style pollution if any */
:deep(.cesium-widget) {
  width: 100%;
  height: 100%;
}
</style>
