<template>
    <div class="bg-gray-400 w-[100vw] h-[100vh] overflow-hidden relative">
        <router-view name="modules"></router-view>
    </div>
</template>
<script setup lang="ts" >
import { onMounted } from 'vue';


onMounted(() => {
    document.body.style.overflow = "hidden";
})

</script>