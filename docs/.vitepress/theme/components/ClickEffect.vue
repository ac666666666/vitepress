<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const clickEffect = (e: MouseEvent) => {
  const x = e.clientX
  const y = e.clientY
  
  // 创建一个包含表情的数组
  const emojis = ['✨', '🚀', '🌟', '💫', '🔥', '🎉', '💻', '🐛']
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
  
  const el = document.createElement('div')
  el.innerText = randomEmoji
  el.style.position = 'fixed'
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.style.transform = 'translate(-50%, -50%)'
  el.style.pointerEvents = 'none'
  el.style.zIndex = '9999'
  el.style.fontSize = '20px'
  el.style.transition = 'all 1s ease-out'
  el.style.opacity = '1'
  
  document.body.appendChild(el)
  
  // 动画效果
  requestAnimationFrame(() => {
    el.style.transform = `translate(-50%, -150%) scale(1.5)`
    el.style.opacity = '0'
  })
  
  // 清理元素
  setTimeout(() => {
    document.body.removeChild(el)
  }, 1000)
}

onMounted(() => {
  window.addEventListener('click', clickEffect)
})

onUnmounted(() => {
  window.removeEventListener('click', clickEffect)
})
</script>

<template>
  <div class="click-effect-container"></div>
</template>

<style scoped>
.click-effect-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 9999;
}
</style>
