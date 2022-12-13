<template>
    <button v-if="canEditable" class="py-2 bg-blue-500 text-white rounded-md px-4 z-50"
        @click.stop="showAddPopup = !showAddPopup">En üste
        ekle</button>
    <div class="p-4 w-auto h-auto  fixed  bg-white " ref="zoomElement" id="pan-zoom"
        style="transform: matrix(1.00,0.00,0.00,1.00,10,10);">
        <div class="flex gap-4 items-start justify-start" v-if="modules" id="moduleList">
            <module v-for="my_module in modules" :key="my_module._id" :item="my_module"
                @item-deleted="(deletedItem) => myItemModule.deleteItem({ deletedItem, baseItem: my_module })"
                :parent="my_module" :canEditable="canEditable" />
        </div>
    </div>
    <add_or_edit_popup v-if="showAddPopup && canEditable" :show="showAddPopup" @on-close="showAddPopup = false"
        @top-level-module-added="(val) => myItemModule.pushItem(val)" />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import module from './components/module.vue';
import add_or_edit_popup from '../../components/Popups/add_or_edit_popup.vue';
import { renderer } from "../../utils/panzoom"
import { getModule } from 'vuex-module-decorators';
import MyItemModule from '../../store/my_item';
import store from '../../store';
import { computed } from '@vue/reactivity';
import { useRoute } from 'vue-router';


const route = useRoute();


const myItemModule = getModule(MyItemModule, store);

const modules = computed(() => myItemModule.items);
const canEditable = computed(() => route.name == "EditModule")



const showAddPopup = ref(false);

const zoomElement = ref<HTMLDivElement>();
var isMiddleDown = false;

onMounted(() => {
    myItemModule.getItems();

    const instance = renderer({ scaleSensitivity: 20, minScale: .1, maxScale: 30, element: document.getElementById("pan-zoom") });
    window.addEventListener("wheel", (event) => {
        event.preventDefault();
        instance.zoom({
            deltaScale: Math.sign(event.deltaY) > 0 ? -1 : 1,
            x: event.pageX,
            y: event.pageY
        });
    });
    zoomElement.value!.addEventListener("dblclick", () => {
        instance.panTo({
            originX: 0,
            originY: 0,
            scale: 1,
        });
    });
    window.addEventListener("mousedown", (e) => {
        isMiddleDown = e.which == 2
    });
    window!.addEventListener("mouseup", (e) => {
        isMiddleDown = false;
    });
    window.addEventListener("mousemove", (event) => {
        if (!event.ctrlKey) {
            if (!isMiddleDown) {
                return;
            }
        }
        event.preventDefault();
        instance.panBy({
            originX: event.movementX,
            originY: event.movementY
        });
    })
})



</script>