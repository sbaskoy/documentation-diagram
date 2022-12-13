<template>
    <div class="relative border shadow-md  p-2 rounded-sm" @click="showPopup = !showPopup">
        <p class="font-thin text-sm">{{ selectedModule?.name ?? 'Module seçiniz' }}</p>
        <div class="absolute w-full left-0 top-[100%] max-h-96 overflow-auto bg-white border py-1 flex flex-col gap-4"
            v-if="showPopup" @click.stop>
            <input class="shadow-md w-full outline-none border focus:border-blue-300 rounded-sm h-9 p-1"
                placeholder="Ara" v-model="filterText" />
            <div class="flex flex-col gap-3 items-start px-1">
                <button @click="() => onItemSelect(my_module)" class="border rounded-md p-1 hover:bg-slate-300 w-full"
                    v-for="my_module in filtered" :class="{ 'bg-blue-300': selectedModule?._id == my_module._id }"
                    :key="my_module._id">
                    <p class="font-thin text-base">{{ my_module.name }}</p>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import { getModule } from 'vuex-module-decorators';
import { IModule } from '../../models/IModule';
import store from '../../store';
import MyItemModule from '../../store/my_item';
import { getAllSubItemList } from '../../utils/modules_helper';

interface Props {
    selectedModule?: IModule
}
const props = defineProps<Props>();

const myItemModule = getModule(MyItemModule, store);

const emit = defineEmits(["onItemSelect"])

const showPopup = ref(false);
const filterText = ref('');

const modules = computed(() => {
    var $res = myItemModule.items;
    return getAllSubItemList($res);
})
const filtered = computed(() => {
    if (!filterText.value) return modules.value;
    return modules.value?.filter(i => i.name.includes(filterText.value))
})






const onItemSelect = (item: IModule) => {
    emit('onItemSelect', item);
    showPopup.value = false;
}
onMounted(() => {

})

</script>