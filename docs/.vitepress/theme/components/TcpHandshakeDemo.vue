<script setup>
import { ref } from 'vue'

const currentStep = ref(0)
const steps = [
  { 
    title: '初始状态',
    client: 'CLOSED',
    server: 'LISTEN',
    packet: null
  },
  { 
    title: '第一次握手 (SYN)',
    client: 'SYN_SENT',
    server: 'LISTEN',
    packet: { type: 'SYN', seq: 100, ack: 0, from: 'Client', to: 'Server' }
  },
  { 
    title: '第二次握手 (SYN+ACK)',
    client: 'SYN_SENT',
    server: 'SYN_RCVD',
    packet: { type: 'SYN+ACK', seq: 200, ack: 101, from: 'Server', to: 'Client' }
  },
  { 
    title: '第三次握手 (ACK)',
    client: 'ESTABLISHED',
    server: 'SYN_RCVD',
    packet: { type: 'ACK', seq: 101, ack: 201, from: 'Client', to: 'Server' }
  },
  { 
    title: '连接建立',
    client: 'ESTABLISHED',
    server: 'ESTABLISHED',
    packet: null
  }
]

const nextStep = () => {
  if (currentStep.value < steps.length - 1) currentStep.value++
}

const reset = () => {
  currentStep.value = 0
}
</script>

<template>
  <div class="demo-container">
    <h3>TCP 三次握手过程演示</h3>
    
    <div class="network-diagram">
      <div class="node client" :class="{ active: steps[currentStep].client === 'ESTABLISHED' }">
        <div class="label">Client</div>
        <div class="state">{{ steps[currentStep].client }}</div>
      </div>

      <div class="connection">
        <div class="packet" 
             v-if="steps[currentStep].packet"
             :class="steps[currentStep].packet.from.toLowerCase()">
          <span class="type">{{ steps[currentStep].packet.type }}</span>
          <div class="details">
            SEQ={{ steps[currentStep].packet.seq }}<br>
            ACK={{ steps[currentStep].packet.ack }}
          </div>
        </div>
        <div class="line"></div>
      </div>

      <div class="node server" :class="{ active: steps[currentStep].server === 'ESTABLISHED' }">
        <div class="label">Server</div>
        <div class="state">{{ steps[currentStep].server }}</div>
      </div>
    </div>

    <div class="controls">
      <div class="step-info">
        <strong>当前步骤:</strong> {{ steps[currentStep].title }}
      </div>
      <div class="buttons">
        <button @click="reset" :disabled="currentStep === 0">重置</button>
        <button @click="nextStep" :disabled="currentStep === steps.length - 1" class="primary">
          {{ currentStep === steps.length - 1 ? '完成' : '下一步' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background: #f0f4f8;
}
.network-diagram {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0;
  height: 150px;
}
.node {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;
}
.node.active {
  border-color: #4caf50;
  background: #e8f5e9;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}
.label { font-weight: bold; margin-bottom: 5px; }
.state { font-size: 0.8em; color: #666; }

.connection {
  flex: 1;
  position: relative;
  height: 2px;
  background: #ccc;
  margin: 0 20px;
}
.packet {
  position: absolute;
  top: -60px;
  padding: 8px 12px;
  background: #2196f3;
  color: white;
  border-radius: 4px;
  font-size: 0.85em;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
}
.packet.client { left: 20%; animation: slideRight 0.5s forwards; }
.packet.server { right: 20%; animation: slideLeft 0.5s forwards; }

@keyframes slideRight { from { left: 0; opacity: 0; } to { left: 50%; opacity: 1; } }
@keyframes slideLeft { from { right: 0; opacity: 0; } to { right: 50%; opacity: 1; } }

.details { font-size: 0.8em; opacity: 0.9; margin-top: 2px; }

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 15px;
  border-radius: 8px;
}
button {
  padding: 8px 16px;
  margin-left: 10px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}
button.primary {
  background: #2196f3;
  color: white;
  border: none;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
