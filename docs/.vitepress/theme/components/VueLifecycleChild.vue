<script setup>
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, ref } from 'vue'

const props = defineProps(['count'])
const emit = defineEmits(['log'])

const log = (msg) => emit('log', msg)

// Creation hooks (setup runs before created)
log('setup() executed')

onBeforeMount(() => log('onBeforeMount: DOM not ready'))
onMounted(() => log('onMounted: DOM ready'))
onBeforeUpdate(() => log('onBeforeUpdate: Data changed, DOM not updated'))
onUpdated(() => log('onUpdated: DOM updated'))
onBeforeUnmount(() => log('onBeforeUnmount: Component about to unmount'))
onUnmounted(() => log('onUnmounted: Component unmounted'))
</script>

<template>
  <div class="child-box">
    <h4>Child Component</h4>
    <p>Props Count: {{ count }}</p>
    <p><i>Check the logs on the right -></i></p>
  </div>
</template>

<style scoped>
.child-box {
  border: 2px dashed #42b883;
  padding: 10px;
  background: #eafff5;
  border-radius: 4px;
}
</style>
