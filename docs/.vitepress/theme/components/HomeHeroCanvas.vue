<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

// 鼠标位置
let mouseX = 0
let mouseY = 0

// 窗口中心（用于计算眼睛看向的角度）
let centerX = 0
let centerY = 0

// 表情状态
const isSad = ref(false)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画布大小 (300x300 for the ball)
  const size = 300
  // 为了高清屏，设置 2x 像素
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  ctx.scale(dpr, dpr)

  // 更新中心点坐标 (相对于视口)
  const updateCenter = () => {
    const rect = canvas.getBoundingClientRect()
    centerX = rect.left + rect.width / 2
    centerY = rect.top + rect.height / 2
  }
  
  window.addEventListener('scroll', updateCenter)
  window.addEventListener('resize', updateCenter)
  // 初始化一次
  setTimeout(updateCenter, 100)

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, size, size)

    // 1. 绘制身体 (蓝色渐变球体) - 更加晶莹剔透
    const bodyGradient = ctx.createRadialGradient(
      size * 0.3, size * 0.3, size * 0.1, // 光源位置
      size * 0.5, size * 0.5, size * 0.5  // 球体中心和半径
    )
    // 调整为更透明的玻璃质感
    bodyGradient.addColorStop(0, 'rgba(100, 220, 255, 0.4)')   // 高光区极透
    bodyGradient.addColorStop(0.3, 'rgba(65, 209, 255, 0.3)')  // 过渡区
    bodyGradient.addColorStop(0.8, 'rgba(45, 123, 253, 0.4)')  // 边缘稍深
    bodyGradient.addColorStop(1, 'rgba(20, 50, 150, 0.6)')     // 轮廓区

    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2)
    ctx.fillStyle = bodyGradient
    ctx.fill()
    
    // 添加内发光 (Backlight/Glow) - 模拟透光
    const innerGlow = ctx.createRadialGradient(
        size * 0.5, size * 0.5, size * 0.3,
        size * 0.5, size * 0.5, size * 0.5
    )
    innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0)')
    innerGlow.addColorStop(0.8, 'rgba(65, 209, 255, 0.1)')
    innerGlow.addColorStop(1, 'rgba(100, 220, 255, 0.3)')
    
    ctx.fillStyle = innerGlow
    ctx.fill()

    // 边缘光 (Rim Light) - 更锐利
    ctx.shadowColor = 'rgba(100, 220, 255, 0.8)'
    ctx.shadowBlur = 15
    ctx.strokeStyle = 'rgba(200, 240, 255, 0.5)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.shadowBlur = 0 // 重置

    // 2. 计算眼睛移动
    // 限制眼睛移动范围
    const maxMove = 25
    const dx = mouseX - centerX
    const dy = mouseY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    let moveX = 0
    let moveY = 0
    
    if (distance > 0) {
      // 归一化方向 * 移动距离 (距离越远移动越接近 maxMove)
      const moveDist = Math.min(distance / 20, maxMove)
      moveX = (dx / distance) * moveDist
      moveY = (dy / distance) * moveDist
    }

    // 3. 绘制眼睛 (胶囊状)
    // 表情调整：伤心时眼睛变扁，开心时眼睛变圆
    const baseEyeWidth = 24
    const baseEyeHeight = 36
    const eyeWidth = isSad.value ? 28 : baseEyeWidth
    const eyeHeight = isSad.value ? 10 : baseEyeHeight // 伤心时眼睛眯起来
    
    const eyeSpacing = 50 // 双眼间距
    const eyeYOffset = -10 // 眼睛垂直位置修正

    const leftEyeX = size / 2 - eyeSpacing / 2 + moveX
    const leftEyeY = size / 2 + eyeYOffset + moveY + (isSad.value ? 10 : 0) // 伤心时眼睛下移
    
    const rightEyeX = size / 2 + eyeSpacing / 2 + moveX
    const rightEyeY = size / 2 + eyeYOffset + moveY + (isSad.value ? 10 : 0)

    ctx.fillStyle = '#ffffff'
    
    // 左眼
    drawCapsule(ctx, leftEyeX, leftEyeY, eyeWidth, eyeHeight)
    // 右眼
    drawCapsule(ctx, rightEyeX, rightEyeY, eyeWidth, eyeHeight)

    // 绘制嘴巴
    ctx.beginPath()
    const mouthX = size / 2 + moveX
    const mouthY = size / 2 + 25 + moveY
    const mouthWidth = 20
    
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'

    if (isSad.value) {
        // 哭/伤心嘴型 (倒U型)
        ctx.arc(mouthX, mouthY + 10, mouthWidth / 2, Math.PI, 0)
    } else {
        // 微笑嘴型 (U型)
        ctx.arc(mouthX, mouthY, mouthWidth / 2, 0, Math.PI)
    }
    ctx.stroke()

    // 绘制腮红 (可爱表情)
    if (!isSad.value) {
        ctx.fillStyle = 'rgba(255, 182, 193, 0.4)' // 浅粉色
        // 左腮红
        ctx.beginPath()
        ctx.ellipse(leftEyeX - 15, leftEyeY + 25, 8, 5, 0, 0, Math.PI * 2)
        ctx.fill()
        // 右腮红
        ctx.beginPath()
        ctx.ellipse(rightEyeX + 15, rightEyeY + 25, 8, 5, 0, 0, Math.PI * 2)
        ctx.fill()
    }

    // 4. 绘制高光 (Glossy Reflection) - 更锐利，增加玻璃感
    const reflectionGradient = ctx.createLinearGradient(
      size * 0.2, size * 0.2, 
      size * 0.4, size * 0.4
    )
    reflectionGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)') // 更亮
    reflectionGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)')
    
    ctx.beginPath()
    ctx.ellipse(size * 0.35, size * 0.25, size * 0.12, size * 0.08, Math.PI / 4, 0, Math.PI * 2)
    ctx.fillStyle = reflectionGradient
    ctx.fill()
    
    // 底部反光 (Secondary Reflection)
    ctx.beginPath()
    ctx.arc(size * 0.65, size * 0.75, size * 0.05, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.fill()

    requestAnimationFrame(animate)
  }

  animate()

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
    // 鼠标移动时，如果不是真的离开了窗口（mouseleave会触发），则认为是开心的
    isSad.value = false
  }

  const handleMouseLeave = () => {
    // 鼠标离开窗口，变伤心
    isSad.value = true
  }

  const handleMouseEnter = () => {
    // 鼠标回到窗口，变开心
    isSad.value = false
  }

  window.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)
  document.addEventListener('mouseenter', handleMouseEnter)

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mouseenter', handleMouseEnter)
    window.removeEventListener('scroll', updateCenter)
    window.removeEventListener('resize', updateCenter)
  })
})

function drawCapsule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath()
  ctx.roundRect(x - w / 2, y - h / 2, w, h, w / 2)
  ctx.fill()
  
  // 眼睛微光
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'
  ctx.shadowBlur = 10
  ctx.fill()
  ctx.shadowBlur = 0
}
</script>

<template>
  <div class="hero-canvas-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.hero-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
</style>
