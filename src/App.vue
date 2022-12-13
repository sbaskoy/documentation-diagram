<template>
  <div class="flex-center h-10 gap-3">
    <router-link :to="{ name: 'Home' }" active-class="text-blue-500">
      <p class="hover:text-blue-500">Documentation</p>
    </router-link>
    <router-link :to="{ name: 'ShowDiagram' }" active-class="text-blue-500">
      <p class="hover:text-blue-500">Diagram</p>
    </router-link>
  </div>
  <router-view></router-view>
</template>
<script setup lang="ts">
</script>