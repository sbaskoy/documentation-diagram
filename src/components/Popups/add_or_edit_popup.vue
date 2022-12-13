<template>
    <Teleport to="body">
        <div class="w-[40%] h-[80%] centered absolute border shadow-md p-4 flex flex-col gap-2 z-50  overflow-auto  bg-white"
            ref="target" @wheel.stop>
            <div class="w-full flex-center gap-3" ref="title">
                <h1 class="font-bold text-lg flex-1">* {{ props.item?.name ?? '' }} * {{ isEdit ? 'ögesini güncelle' :
                        'ögesinin altına ekle'
                }}</h1>
                <button class=" w-8 h-8 bg-gray-200 flex-center hover:bg-gray-400 rounded-md" @click="emit('onClose')">
                    <CloseIcon />
                </button>
            </div>
            <div class="flex-center gap-2">
                <input class="shadow-md flex-1 outline-none border focus:border-blue-300 rounded-sm h-9 p-1"
                    placeholder="Name" v-model="my_module.name" />
                <Vue3ColorPicker v-model:pureColor="my_module.bg_color" ref="colorPicker" />
            </div>
            <input class="shadow-md w-full outline-none border focus:border-blue-300 rounded-sm h-9 p-1"
                placeholder="Detail Url" v-model="my_module.detail_url" />
            <textarea class="shadow-md w-full outline-none border focus:border-blue-300 rounded-sm h-20 p-1"
                placeholder="Description" v-model="my_module.description"></textarea>

            <div class="w-full flex flex-col gap-2">
                <div class="flex-center gap-1">
                    <input ref="addTagInput"
                        class="shadow-md flex-1 outline-none border focus:border-blue-300 rounded-sm h-9 p-1"
                        placeholder="Add tag" @keypress.enter="addTag" />
                    <button class="w-9 h-9 bg-gray-200 flex-center hover:bg-gray-400 rounded-md" @click="addTag">
                        <PlusIcon />
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button v-for="tag in my_module.tags" class="rounded-md p-2 flex-center shadow-md border"
                        @click="() => deleteTag(tag)">
                        <p>{{ tag.name }}</p>
                    </button>
                </div>
            </div>

            <div class="w-full flex flex-col gap-2">
                <div class="flex-center gap-1">
                    <input ref="addDataBaseRelationInput"
                        class="shadow-md flex-1 outline-none border focus:border-blue-300 rounded-sm h-9 p-1"
                        placeholder="Add database relation" @keypress.enter="addDataBaseRelation" />
                    <button class="w-9 h-9 bg-gray-200 flex-center hover:bg-gray-400 rounded-md"
                        @click="addDataBaseRelation">
                        <PlusIcon />
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button v-for="name in my_module.database_relation"
                        class="rounded-md p-2 flex-center shadow-md border" @click="() => deleteDataBaseRelation(name)">
                        <p>{{ name }}</p>
                    </button>
                </div>
            </div>
            <div class="w-full flex flex-col gap-2">
                <div class="flex-center gap-1">
                    <input ref="parameterNameInput"
                        class="shadow-md flex-1 outline-none border focus:border-blue-300 rounded-sm h-9 p-1"
                        placeholder="Parameter Name" />
                    <input ref="parameterTypeInput"
                        class="shadow-md flex-1 outline-none border focus:border-blue-300 rounded-sm h-9 p-1"
                        placeholder="Parameter Type" @keypress.enter="addParameter" />

                    <button class="w-9 h-9 bg-gray-200 flex-center hover:bg-gray-400 rounded-md" @click="addParameter">
                        <PlusIcon />
                    </button>
                </div>
                <div class="flex flex-wrap gap-2">
                    <button v-for="parameter in my_module.parameters"
                        class="rounded-md p-2 flex-center shadow-md border" @click="() => deleteParameter(parameter)">
                        <code>{{ parameter.name }} => {{ parameter.type }}</code>
                    </button>
                </div>
            </div>
            <div class="w-full flex flex-col gap-2">
                <select_module @onItemSelect="(val) => addTrigger(val)" />
                <div class="flex flex-wrap gap-2">
                    <button v-for="trigger in my_module.triggers" class="rounded-md p-2 flex-center shadow-md border"
                        @click="() => deleteTrigger(trigger)">
                        <p>{{ trigger.name }} </p>
                    </button>
                </div>
            </div>

            <button class="bg-blue-500 text-white p-2 border-none rounded-md w-32 flex-center"
                :class="{ 'bg-gray-400': savingItem }" @click="savingItem ? null : saveItem()">
                <LoadingIcon v-if="savingItem" />
                <p v-else>{{ isEdit ? 'Update Item' : 'Add Sub Item' }}</p>
            </button>
        </div>
    </Teleport>
</template>
<script setup lang="ts">
import { onMounted, ref, Teleport } from 'vue';
import { IModule } from '../../models/IModule';
import { IParameter } from '../../models/IParameter';
import { ITag } from '../../models/ITag';
import { ModuleServices } from '../../services/module_services';
import CloseIcon from '../Icons/CloseIcon.vue';
import PlusIcon from '../Icons/PlusIcon.vue';
import LoadingIcon from '../Icons/LoadingIcon.vue'
import { useToast } from 'vue-toastification';
import select_module from '../Forms/select_module.vue'
import { computed } from '@vue/reactivity';
import { onClickOutSide, makeDraggable } from '../../utils/dom_helper';
interface Props {
    item?: IModule,
    isEdit?: boolean,
}

const props = defineProps<Props>();
const emit = defineEmits(["onClose", "topLevelModuleAdded", "onUpdated"]);

const toast = useToast();

const $my_module = ref<IModule>({
    name: 'New Sub Module'
});
const my_module = computed(() => {
    if (props.isEdit == true) {
        if (props.item) {
            return { ...props.item }
        }
    }
    return $my_module.value;
})


const savingItem = ref(false);

const target = ref<HTMLDivElement>();
const title = ref<HTMLDivElement>();
const colorPicker = ref<any>();

const addTagInput = ref<HTMLInputElement>();
const addDataBaseRelationInput = ref<HTMLInputElement>();
const parameterNameInput = ref<HTMLInputElement>();
const parameterTypeInput = ref<HTMLInputElement>();



const addTag = () => {
    var tag = addTagInput.value?.value;
    if (tag) {
        my_module.value.tags ??= [];
        if (!my_module.value.tags.some(i => i.name == tag)) {
            my_module.value.tags.push({ name: tag });
            addTagInput.value!.value = "";
        }
    }
}
const addDataBaseRelation = () => {
    var name = addDataBaseRelationInput.value?.value;
    if (name) {
        my_module.value.database_relation ??= [];
        if (!my_module.value.database_relation.some(i => i == name)) {
            my_module.value.database_relation.push(name);
            addDataBaseRelationInput.value!.value = "";
        }
    }
}
const addParameter = () => {
    var name = parameterNameInput.value?.value;
    var type = parameterTypeInput.value?.value;
    if (name && type) {
        my_module.value.parameters ??= [];
        if (!my_module.value.parameters.some(i => i.name == name)) {
            my_module.value.parameters.push({
                name, type
            });
            parameterNameInput.value!.value = "";
            parameterTypeInput.value!.value = "";
        }
    }
}
const addTrigger = (item: IModule) => {
    my_module.value.triggers ??= [];
    if (!my_module.value.triggers.some(i => i.module_id == item._id)) {
        my_module.value.triggers.push({
            module_id: item._id!,
            name: item.name
        });
    }

}
const deleteTag = (tag: ITag) => {
    my_module.value.tags = my_module.value.tags?.filter(i => i.name != tag.name);
}
const deleteDataBaseRelation = (name: string) => {
    my_module.value.database_relation = my_module.value.database_relation?.filter(i => i != name);
}
const deleteParameter = (parameter: IParameter) => {
    my_module.value.parameters = my_module.value.parameters?.filter(i => i.name != parameter.name);
}
const deleteTrigger = (trigger: IModule) => {
    my_module.value.triggers = my_module.value.triggers?.filter(i => i.module_id != trigger._id);
}

const update = async () => {
    savingItem.value = true;
    var res = await ModuleServices.updateModule(my_module.value._id!, my_module.value);
    if (res) {
        toast.success("Item updating");
        emit("onUpdated", my_module.value)
    }
    savingItem.value = false;
}

const saveItem = async () => {
    savingItem.value = true;
    if (props.isEdit == true) {
        update();
        return;
    }
    if (props.item) {
        var res = await ModuleServices.addSubItem(props.item._id!, my_module.value);
        if (res) {
            res.sub_items = [];
            props.item.sub_items?.push(res);
            toast.success("Sub item added");
        }
    } else {
        var res = await ModuleServices.saveModule({
            ...my_module.value,
            is_top_level: true
        });
        if (res) {
            emit("topLevelModuleAdded", res);
        }
    }
    savingItem.value = false;
}





onMounted(() => {
    onClickOutSide(target.value!, () => {
        emit('onClose');
    }, [".vc-colorpicker"])
    makeDraggable(title.value, target.value);
})

</script>