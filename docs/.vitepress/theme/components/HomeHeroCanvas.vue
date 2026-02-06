<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

// 鼠标位置
let mouseX = 0;
let mouseY = 0;

// 窗口中心（用于计算眼睛看向的角度）
let centerX = 0;
let centerY = 0;

// 表情状态
const isSad = ref(false);

// 气泡文案列表
const messages = [
  "欢迎访问AC网站",
  "Welcome to AC's site!",
  "今天也是充满希望的一天捏~",
  "Coding changes the world.",
  "别卷了，喝口水吧 ☕️",
  "404 Not Found? 并没有！",
  "Bug? 那是 Feature！",
  "摸摸我的头，会有好运哦！",
  "HTML 是世界上最好的语言！",
  "Hello World!",
  "CSS 其实很难...",
  "JavaScript 真好玩~",
  "今天天气真不错~",
  "你敲代码的样子真帅！",
  "不要忘记提交代码哦~",
  "Ctrl+C Ctrl+V 大法好",
  "记得多喝热水",
  "熬夜写代码会变秃哦",
  "PHP 是世界上最好的语言？",
  "VitePress 真香！",
];

const currentMessage = ref(messages[0]);

// 随机切换文案
const switchMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  // 确保不会连续随机到同一句
  if (messages[randomIndex] === currentMessage.value) {
    switchMessage();
  } else {
    currentMessage.value = messages[randomIndex];
  }
};

// 爱心粒子系统
class Heart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  alpha: number;
  text: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = -Math.random() * 2 - 1; // 向上飘
    this.size = Math.random() * 10 + 10;
    this.life = 1.0;
    this.alpha = 1.0;
    this.text = Math.random() > 0.8 ? "+1" : "❤️"; // 20% 概率出现 +1
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.01;
    this.alpha = this.life;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = `${this.size}px Arial`;
    ctx.fillStyle = this.text === "+1" ? "#ff4757" : "#ff6b81";
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

const hearts: Heart[] = [];

let messageInterval: number | null = null;

onMounted(() => {
  // 启动气泡轮播，每 5 秒切换一次
  messageInterval = window.setInterval(switchMessage, 5000);

  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 设置画布大小 (300x300 for the ball)
  const size = 300;
  // 为了高清屏，设置 2x 像素
  const dpr = window.devicePixelRatio || 1;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  ctx.scale(dpr, dpr);

  // 更新中心点坐标 (相对于视口)
  let canvasRect = canvas.getBoundingClientRect();
  const updateCenter = () => {
    canvasRect = canvas.getBoundingClientRect();
    centerX = canvasRect.left + canvasRect.width / 2;
    centerY = canvasRect.top + canvasRect.height / 2;
  };

  window.addEventListener("scroll", updateCenter);
  window.addEventListener("resize", updateCenter);
  // 初始化一次
  setTimeout(updateCenter, 100);

  // 颜色变量
  let hue = 0;

  // 动画循环
  const animate = () => {
    ctx.clearRect(0, 0, size, size);

    // 更新色相，实现自动变色
    hue = (hue + 0.5) % 360;

    // 1. 绘制身体 (渐变球体) - 更加晶莹剔透
    const bodyGradient = ctx.createRadialGradient(
      size * 0.3,
      size * 0.3,
      size * 0.1, // 光源位置
      size * 0.5,
      size * 0.5,
      size * 0.5 // 球体中心和半径
    );
    // 调整为更透明的玻璃质感，使用 HSLA 实现颜色渐变
    // 核心高光区，接近白色
    bodyGradient.addColorStop(0, `hsla(${hue}, 100%, 90%, 0.4)`);
    // 过渡区，颜色较浅
    bodyGradient.addColorStop(0.3, `hsla(${hue}, 90%, 80%, 0.3)`);
    // 边缘区，颜色变深
    bodyGradient.addColorStop(0.8, `hsla(${hue}, 80%, 60%, 0.4)`);
    // 轮廓区，颜色最深，增加对比度
    bodyGradient.addColorStop(1, `hsla(${hue}, 70%, 40%, 0.6)`);

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.fillStyle = bodyGradient;
    ctx.fill();

    // 添加内发光 (Backlight/Glow) - 模拟透光
    const innerGlow = ctx.createRadialGradient(
      size * 0.5,
      size * 0.5,
      size * 0.3,
      size * 0.5,
      size * 0.5,
      size * 0.5
    );
    innerGlow.addColorStop(0, "rgba(255, 255, 255, 0)");
    // 随着 hue 变化，内发光也带一点淡淡的颜色
    innerGlow.addColorStop(0.8, `hsla(${hue}, 80%, 80%, 0.1)`);
    innerGlow.addColorStop(1, `hsla(${hue}, 90%, 90%, 0.3)`);

    ctx.fillStyle = innerGlow;
    ctx.fill();

    // 边缘光 (Rim Light) - 更锐利
    ctx.shadowColor = `hsla(${hue}, 100%, 80%, 0.8)`;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = `hsla(${hue}, 100%, 90%, 0.5)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0; // 重置

    // 2. 计算眼睛移动
    // 限制眼睛移动范围
    const maxMove = 25;
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let moveX = 0;
    let moveY = 0;

    if (distance > 0) {
      // 归一化方向 * 移动距离 (距离越远移动越接近 maxMove)
      const moveDist = Math.min(distance / 20, maxMove);
      moveX = (dx / distance) * moveDist;
      moveY = (dy / distance) * moveDist;
    }

    // 3. 绘制眼睛 (胶囊状)
    // 表情调整：伤心时眼睛变扁，开心时眼睛变圆
    const baseEyeWidth = 24;
    const baseEyeHeight = 36;
    const eyeWidth = isSad.value ? 28 : baseEyeWidth;
    const eyeHeight = isSad.value ? 10 : baseEyeHeight; // 伤心时眼睛眯起来

    const eyeSpacing = 50; // 双眼间距
    const eyeYOffset = -10; // 眼睛垂直位置修正

    const leftEyeX = size / 2 - eyeSpacing / 2 + moveX;
    const leftEyeY = size / 2 + eyeYOffset + moveY + (isSad.value ? 10 : 0); // 伤心时眼睛下移

    const rightEyeX = size / 2 + eyeSpacing / 2 + moveX;
    const rightEyeY = size / 2 + eyeYOffset + moveY + (isSad.value ? 10 : 0);

    ctx.fillStyle = "#ffffff";

    // 左眼
    drawCapsule(ctx, leftEyeX, leftEyeY, eyeWidth, eyeHeight);
    // 右眼
    drawCapsule(ctx, rightEyeX, rightEyeY, eyeWidth, eyeHeight);

    // 绘制嘴巴
    ctx.beginPath();
    const mouthX = size / 2 + moveX;
    const mouthY = size / 2 + 25 + moveY;
    const mouthWidth = 20;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";

    if (isSad.value) {
      // 哭/伤心嘴型 (倒U型)
      ctx.arc(mouthX, mouthY + 10, mouthWidth / 2, Math.PI, 0);
    } else {
      // 微笑嘴型 (U型)
      ctx.arc(mouthX, mouthY, mouthWidth / 2, 0, Math.PI);
    }
    ctx.stroke();

    // 绘制腮红 (可爱表情)
    if (!isSad.value) {
      ctx.fillStyle = "rgba(255, 182, 193, 0.4)"; // 浅粉色
      // 左腮红
      ctx.beginPath();
      ctx.ellipse(leftEyeX - 15, leftEyeY + 25, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // 右腮红
      ctx.beginPath();
      ctx.ellipse(rightEyeX + 15, rightEyeY + 25, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. 绘制高光 (Glossy Reflection) - 更锐利，增加玻璃感
    const reflectionGradient = ctx.createLinearGradient(
      size * 0.2,
      size * 0.2,
      size * 0.4,
      size * 0.4
    );
    reflectionGradient.addColorStop(0, "rgba(255, 255, 255, 0.9)"); // 更亮
    reflectionGradient.addColorStop(1, "rgba(255, 255, 255, 0.1)");

    ctx.beginPath();
    ctx.ellipse(
      size * 0.35,
      size * 0.25,
      size * 0.12,
      size * 0.08,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = reflectionGradient;
    ctx.fill();

    // 底部反光 (Secondary Reflection)
    ctx.beginPath();
    ctx.arc(size * 0.65, size * 0.75, size * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fill();

    // 5. 渲染爱心粒子
    for (let i = hearts.length - 1; i >= 0; i--) {
      const heart = hearts[i];
      heart.update();
      heart.draw(ctx);
      if (heart.life <= 0) {
        hearts.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  };

  animate();

  // 抚摸逻辑
  let lastStrokeTime = 0;

  const checkAndGenerateHeart = (x: number, y: number) => {
    // 计算与球心的距离
    const dx = x - size / 2;
    const dy = y - size / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // 如果在球体半径内 (稍微留点余量)
    if (dist < size / 2 - 5) {
      // 节流，防止产生太多爱心
      const now = Date.now();
      if (now - lastStrokeTime > 30) {
        // 每 30ms 最多产生一个
        // 在位置生成爱心
        hearts.push(new Heart(x, y));
        lastStrokeTime = now;
        isSad.value = false; // 抚摸时变开心
        // 抚摸时有 5% 的概率切换文案，增加趣味性，避免太频繁
        if (Math.random() < 0.05) {
          switchMessage();
        }
      }
    }
  };

  const handleStroke = (e: MouseEvent) => {
    // 计算相对于 Canvas 的坐标 (考虑 dpr)
    const x = (e.clientX - canvasRect.left) * dpr;
    const y = (e.clientY - canvasRect.top) * dpr;
    checkAndGenerateHeart(x, y);
  };

  const handleTouch = (e: TouchEvent) => {
    // 防止滚动 (如果需要完全沉浸式体验，可以取消注释，但为了页面可用性暂时保留滚动)
    // e.preventDefault();

    const touch = e.touches[0];
    if (!touch) return;

    const x = (touch.clientX - canvasRect.left) * dpr;
    const y = (touch.clientY - canvasRect.top) * dpr;
    checkAndGenerateHeart(x, y);
  };

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // 鼠标移动时，如果不是真的离开了窗口（mouseleave会触发），则认为是开心的
    isSad.value = false;
  };

  const handleMouseLeave = () => {
    // 鼠标离开窗口，变伤心
    isSad.value = true;
  };

  const handleMouseEnter = () => {
    // 鼠标回到窗口，变开心
    isSad.value = false;
  };

  // 添加 Canvas 上的监听
  canvas.addEventListener("mousemove", handleStroke);
  canvas.addEventListener("touchstart", handleTouch, { passive: true });
  canvas.addEventListener("touchmove", handleTouch, { passive: true });

  window.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseleave", handleMouseLeave);
  document.addEventListener("mouseenter", handleMouseEnter);

  onUnmounted(() => {
    canvas.removeEventListener("mousemove", handleStroke);
    canvas.removeEventListener("touchstart", handleTouch);
    canvas.removeEventListener("touchmove", handleTouch);
    window.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseleave", handleMouseLeave);
    document.removeEventListener("mouseenter", handleMouseEnter);
    window.removeEventListener("scroll", updateCenter);
    window.removeEventListener("resize", updateCenter);
    if (messageInterval) {
      clearInterval(messageInterval);
    }
  });
});

function drawCapsule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, w / 2);
  ctx.fill();

  // 眼睛微光
  ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;
}
</script>

<template>
  <div class="canvas-container">
    <div class="speech-bubble" @click="switchMessage">{{ currentMessage }}</div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.canvas-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  margin-top: 80px; /* 进一步增加顶部间距，确保气泡完全显示 */
}

@media (min-width: 960px) {
  .canvas-container {
    margin-top: 0;
  }
}

canvas {
  width: 300px;
  height: 300px;
  cursor: pointer;
}

.speech-bubble {
  position: absolute;
  top: -60px; /* 调整气泡位置 */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  animation: float 3s ease-in-out infinite;
  z-index: 10;
}

/* 气泡小尾巴 */
.speech-bubble::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.9) transparent transparent transparent;
}

@keyframes float {
  0%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(-10px);
  }
}
</style>
