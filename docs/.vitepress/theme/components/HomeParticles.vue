<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = window.innerWidth
  let height = window.innerHeight
  canvas.width = width
  canvas.height = height

  // 粒子颜色配置（匹配 Hero 渐变色：紫色、蓝色、青色）
  const colors = [
    { r: 189, g: 52, b: 254 }, // #bd34fe (Purple)
    { r: 65, g: 209, b: 255 }, // #41d1ff (Cyan)
    { r: 100, g: 108, b: 255 }, // #646cff (Brand Blue)
  ]

  class Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    baseSize: number
    colorRgb: { r: number, g: number, b: number }
    angle: number

    constructor() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.vx = (Math.random() - 0.5) * 1.5
      this.vy = (Math.random() - 0.5) * 1.5
      this.baseSize = Math.random() * 2.5 + 1.5 // 稍大一点的基础尺寸
      this.size = this.baseSize
      this.colorRgb = colors[Math.floor(Math.random() * colors.length)]
      this.angle = Math.random() * Math.PI * 2
    }

    update(mouseX: number, mouseY: number) {
      // 基础移动
      this.x += this.vx
      this.y += this.vy

      // 边界反弹
      if (this.x < 0 || this.x > width) this.vx *= -1
      if (this.y < 0 || this.y > height) this.vy *= -1

      // 鼠标交互：脉冲式呼吸效果
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // 鼠标附近粒子变大
      if (distance < 250) {
        const scale = 1 + (250 - distance) / 250
        this.size = this.baseSize * scale
      } else {
        this.size = this.baseSize
      }

      // 自身轻微脉冲
      this.angle += 0.05
      this.size += Math.sin(this.angle) * 0.2
    }

    draw() {
      if (!ctx) return
      ctx.beginPath()
      ctx.arc(this.x, this.y, Math.abs(this.size), 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${this.colorRgb.r}, ${this.colorRgb.g}, ${this.colorRgb.b}, 0.6)`
      
      // 优化：移除阴影，改用纯色填充以提升性能
      // ctx.shadowBlur = 15
      // ctx.shadowColor = `rgba(${this.colorRgb.r}, ${this.colorRgb.g}, ${this.colorRgb.b}, 0.8)`
      
      ctx.fill()
      // ctx.shadowBlur = 0 
    }
  }

  const particles: Particle[] = []
  // 减少粒子数量：100 -> 50
  const particleCount = 50 
  const connectionDistance = 160
  const mouseDistance = 250

  let mouse = { x: -1000, y: -1000 }

  function init() {
    particles.length = 0
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  function animate() {
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, width, height)
    
    // 移除 expensive 的混合模式
    // ctx.globalCompositeOperation = 'lighter'

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i]
      p.update(mouse.x, mouse.y)
      p.draw()

      // 鼠标连线 (更强更亮)
      let dx = mouse.x - p.x
      let dy = mouse.y - p.y
      let distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < mouseDistance) {
        ctx.beginPath()
        const alpha = 0.8 * (1 - distance / mouseDistance)
        ctx.strokeStyle = `rgba(${p.colorRgb.r}, ${p.colorRgb.g}, ${p.colorRgb.b}, ${alpha})`
        ctx.lineWidth = 1.5
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
        
        // 强引力：鼠标吸附效果
        const force = (mouseDistance - distance) / mouseDistance
        const attractionStrength = 0.08
        p.vx += (dx / distance) * force * attractionStrength
        p.vy += (dy / distance) * force * attractionStrength
        
        // 增加一点旋转动量，形成旋涡感
        p.vx += -(dy / distance) * force * 0.02
        p.vy += (dx / distance) * force * 0.02
      }

      // 粒子间连线
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j]
        let dx2 = p.x - p2.x
        let dy2 = p.y - p2.y
        // 优化：先比较平方和，避免不必要的开方
        let distSq = dx2 * dx2 + dy2 * dy2
        let connDistSq = connectionDistance * connectionDistance

        if (distSq < connDistSq) {
          ctx.beginPath()
          // 混合两个粒子的颜色
          const avgR = (p.colorRgb.r + p2.colorRgb.r) / 2
          const avgG = (p.colorRgb.g + p2.colorRgb.g) / 2
          const avgB = (p.colorRgb.b + p2.colorRgb.b) / 2
          
          let distance2 = Math.sqrt(distSq)
          const alpha = 0.2 * (1 - distance2 / connectionDistance)
          ctx.strokeStyle = `rgba(${avgR}, ${avgG}, ${avgB}, ${alpha})`
          ctx.lineWidth = 0.8
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      }
    }
    
    // 添加一点摩擦力防止速度过快
    particles.forEach(p => {
      p.vx *= 0.99
      p.vy *= 0.99
      // 保持最小速度，避免完全静止
      if (Math.abs(p.vx) < 0.2) p.vx *= 1.05
      if (Math.abs(p.vy) < 0.2) p.vy *= 1.05
    })

    requestAnimationFrame(animate)
  }

  function handleResize() {
    width = window.innerWidth
    height = window.innerHeight
    canvas!.width = width
    canvas!.height = height
    // 重新初始化位置，避免窗口变小时粒子卡在外面
    init() 
  }

  function handleMouseMove(e: MouseEvent) {
    mouse.x = e.clientX
    mouse.y = e.clientY
  }

  window.addEventListener('resize', handleResize)
  window.addEventListener('mousemove', handleMouseMove)

  init()
  animate()

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
  })
})
</script>

<template>
  <canvas ref="canvasRef" class="particles-bg"></canvas>
</template>

<style scoped>
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1; /* Behind content but visible */
  pointer-events: none; /* Let clicks pass through */
  background: transparent;
}
</style>
