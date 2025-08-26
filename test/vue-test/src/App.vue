<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

function handleClick() {
  count.value++;
}

function simulateError() {
  throw new Error('这是一个模拟的错误用于测试监控');
}
</script>

<template>
  <div>
    <h3>测试</h3>
    <div @click="handleClick">点击计数: {{ count }}</div>
    <button @click="simulateError">模拟错误</button>
  </div>
</template>

<style scoped></style>
