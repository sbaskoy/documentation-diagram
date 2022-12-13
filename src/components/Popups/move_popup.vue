<template>
    <Teleport to="body">
        <div class="w-[30%] h-[50%] centered absolute border shadow-md p-4 flex flex-col gap-2 z-50 bg-white overflow-auto"
            ref="target" @wheel.stop>
            <div class="w-full flex-center gap-3 " ref="title">
                <h1 class="font-bold text-lg flex-1">* {{ props.item?.name ?? '' }} * ögesini taşı</h1>
                <button class=" w-8 h-8 bg-gray-200 flex-center hover:bg-gray-400 rounded-md" @click="emit('onClose')">
                    <CloseIcon />
                </button>
            </div>
            <div class="w-full flex flex-col gap-2">
                <select_module @onItemSelect="(val) => selectedModule = val" :selected-module="selectedModule" />
            </div>
            <button class="bg-blue-500 text-white p-2 border-none rounded-md w-32 flex-center"
                :class="{ 'bg-gray-400': loading }" @click="loading ? null : moveItem()">
                <LoadingIcon v-if="loading" />
                <p v-else>Move</p>
            </button>
        </div>
    </Teleport>
</template>
<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { IModule } from '../../models/IModule';
import { ModuleServices } from '../../services/module_services';
import select_module from '../Forms/select_module.vue';
import LoadingIcon from '../Icons/LoadingIcon.vue'
import CloseIcon from '../Icons/CloseIcon.vue';
import { onClickOutSide, makeDraggable } from '../../utils/dom_helper';


interface Props {
    item: IModule,
    parent: IModule,
}

const props = defineProps<Props>();
const emit = defineEmits(["onClose"])

const toast = useToast();

const target = ref<HTMLDListElement>();
const title = ref<HTMLDListElement>();

const loading = ref(false);

const selectedModule = ref<IModule>();


const moveItem = async () => {
    loading.value = true;
    if (!selectedModule.value?._id) {
        toast.warning("Please select new item");
        return;
    }
    var res = await ModuleServices.moveItem({
        moved_id: props.item._id!,
        new_id: selectedModule.value!._id!
    })
    if (res) {
        selectedModule.value.sub_items ??= [];
        selectedModule.value.sub_items?.push(res);
        props.parent.sub_items = props.parent.sub_items?.filter(i => i._id != props.item._id);
        toast.success("Item moved");

    }
    loading.value = false;
}

onMounted(() => {
    onClickOutSide(target.value!, () => {
        emit('onClose');
    })
    makeDraggable(title.value, target.value)
})

</script>