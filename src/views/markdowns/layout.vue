<template>
    <div class="flex gap-2 " v-if="menuItems">
        <div class="w-[15%] h-[calc(100vh-40px)] overflow-auto border-r border-r-gray-300 p-2  flex flex-col gap-2 ">
            <div v-for="menuItem in menuItems" class="flex flex-col gap-2">
                <h1 class="font-bold text-lg p-1"> {{ menuItem.name }} </h1>
                <div class="pl-4 flex flex-col gap-2" v-for="menu in menuItem.files">
                    <router-link :to="{ name: 'HomePath', params: { path: `${menuItem.path}_${menu}` } }" class="link"
                        active-class="bg-blue-200">
                        <div class="p-1 border rounded-sm hover:bg-gray-200">
                            <p>{{ menu }}</p>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <router-view name="markdown"></router-view>
    </div>
</template>
<script setup lang="ts">

import { onMounted, ref, watch } from "vue";
import { MarkdownServices } from "../../services/markdown_services";



const menuItems = ref();

const getHomeData = async () => {
    var res = await MarkdownServices.getMenuItems();
    if (res) {
        document.title = res.title;
        menuItems.value = res.menuItems;
    }

}
onMounted(() => {
    getHomeData();
})

</script>