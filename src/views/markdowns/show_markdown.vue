<template>
    <div>
        <LoadingIcon v-if="loading" />
        <div v-else>
            <Markdown v-if="content" :source="content" />
            <p class="text-red-500 text-center" v-else>can not load data</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MarkdownServices } from '../../services/markdown_services';
import LoadingIcon from '../../components/Icons/LoadingIcon.vue';
import Markdown from 'vue3-markdown-it';
import 'highlight.js/styles/monokai.css';
const route = useRoute();

const content = ref();
const loading = ref(false);

const getContent = async (path: string) => {
    loading.value = true;
    var res = await MarkdownServices.getContent(path.replace("_", "/"));
    if (res) {
        content.value = res.data;
        document.title = res.title;
    }
    loading.value = false;
}

watch(() => route.params, () => {
    console.log(route.params);
    getContent(route.params.path as string)
})

</script>
<style >

</style>