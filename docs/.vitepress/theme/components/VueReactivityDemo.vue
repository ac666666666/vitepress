<script setup>
import { ref, reactive } from 'vue'

// Vue 2 Simulation
const vue2Data = reactive({
  list: ['Apple', 'Banana'],
  obj: { name: 'Vue 2' }
})
const vue2Logs = ref([])

// Vue 3 Simulation (Native)
const vue3Data = reactive({
  list: ['Apple', 'Banana'],
  obj: { name: 'Vue 3' }
})
const vue3Logs = ref([])

// Actions
const addProperty = (version) => {
  if (version === 2) {
    // Vue 2 limitation simulation: direct assignment doesn't trigger reactivity
    // We simulate this by NOT using Vue's set, but just JS assignment, 
    // and showing that the UI might not update if we were strictly in Vue 2.
    // However, since we are in Vue 3 actually, it WILL update. 
    // So we have to FAKE the limitation or explain it.
    // Better: Show the code difference.
    
    // Actually, let's just show the code comparison and "visualize" the Proxy trap.
  }
}

// Simple Reactivity Visualization
const targetObj = { count: 0 }
const proxyLogs = ref([])

const handler = {
  get(target, prop) {
    proxyLogs.value.unshift(`GET ${prop}`)
    return target[prop]
  },
  set(target, prop, value) {
    proxyLogs.value.unshift(`SET ${prop} = ${value}`)
    target[prop] = value
    return true
  }
}

const proxyObj = new Proxy(targetObj, handler)
const currentVal = ref(0)

const interact = (action) => {
  if (action === 'get') {
    const val = proxyObj.count
  } else if (action === 'set') {
    proxyObj.count++
    currentVal.value = proxyObj.count
  } else if (action === 'new') {
    proxyObj.newProp = 'Hello'
  }
}
</script>

<template>
  <div class="demo-card">
    <h3>Proxy Reactivity (Vue 3)</h3>
    <p>Interact with the object to see Proxy traps firing.</p>
    
    <div class="playground">
      <div class="object-view">
        <pre>const obj = new Proxy({ count: {{ currentVal }} }, handler)</pre>
        <div class="buttons">
          <button @click="interact('get')">Read (obj.count)</button>
          <button @click="interact('set')">Write (obj.count++)</button>
          <button @click="interact('new')">Add Prop (obj.newProp = 'Hello')</button>
        </div>
      </div>
      
      <div class="logs-view">
        <h4>Proxy Traps Log:</h4>
        <div v-for="(log, i) in proxyLogs" :key="i" class="log-entry">
          <span class="badge">TRAP</span> {{ log }}
        </div>
      </div>
    </div>
    
    <div class="info-box">
      <h4>Comparison</h4>
      <div class="comparison">
        <div class="col">
          <h5>Vue 2 (Object.defineProperty)</h5>
          <ul>
            <li>❌ Cannot detect property addition/deletion</li>
            <li>❌ Cannot detect array index changes</li>
            <li>⚠️ Requires <code>Vue.set</code> / <code>this.$set</code></li>
            <li>⚠️ Recursively traverses object on init (Performance cost)</li>
          </ul>
        </div>
        <div class="col">
          <h5>Vue 3 (Proxy)</h5>
          <ul>
            <li>✅ Detects all property changes</li>
            <li>✅ Detects array mutations</li>
            <li>✅ Lazy observation (Performance boost)</li>
            <li>⚠️ No IE11 support</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
}
.playground {
  display: flex;
  gap: 16px;
  margin: 16px 0;
}
.object-view {
  flex: 1;
  padding: 10px;
  background: #f4f4f4;
  border-radius: 4px;
}
.logs-view {
  flex: 1;
  background: #1e1e1e;
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  height: 150px;
  overflow-y: auto;
}
.buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}
button {
  padding: 6px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button:hover { background: #eee; }
.log-entry { font-size: 0.9em; margin-bottom: 4px; border-bottom: 1px solid #333; }
.badge { background: #e91e63; color: white; padding: 1px 4px; border-radius: 2px; font-size: 0.8em; }
.comparison { display: flex; gap: 16px; margin-top: 10px; }
.col { flex: 1; background: #fafafa; padding: 10px; border-radius: 4px; border: 1px solid #eee; }
h5 { margin: 0 0 8px 0; border-bottom: 2px solid #ddd; padding-bottom: 4px; }
ul { padding-left: 20px; margin: 0; }
li { margin-bottom: 4px; font-size: 0.9em; }
</style>
