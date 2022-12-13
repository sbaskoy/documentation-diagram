<template>
    <div class="shadow-md rounded-md p-2 border  w-auto  flex flex-col justify-center items-center module "
        :class="{ 'bg-green-100': (showAddPopup || showEditPopup || showMovePopup) }"
        :style="`${item.bg_color ? `background-color:${item.bg_color}`:''}`">
        <div class="w-full flex gap-2 items-center justify-center border-b py-1">
            <p class="text-base font-bold text-center">{{ item.name }}</p>
            <div class="flex-center gap-1">
                <template v-if="canEditable">
                    <IconButton v-tippy="{ content: 'Delete item and sub items' }" @click="deleteModule"
                        class="text-red-500">
                        <DeleteIcon />
                    </IconButton>
                    <IconButton v-tippy="{ content: 'Add sub item' }" class="text-green-500"
                        @click.stop="showAddPopup = !showAddPopup">
                        <PlusIcon />
                    </IconButton>
                    <IconButton v-tippy="{ content: 'Edit item' }" class="text-yellow-500"
                        @click.stop="showEditPopup = !showEditPopup">
                        <EditIcon />
                    </IconButton>
                    <IconButton v-tippy="{ content: 'Move this item' }" class="text-blue-500"
                        @click.stop="showMovePopup = !showMovePopup">
                        <MoveIcon />
                    </IconButton>
                </template>
                <IconButton v-tippy="{ content: !item.is_opened ? 'Open' : 'Close' }" class="relative"
                    @click.stop="toggleOpened">
                    <ArrowDownIcon v-if="!item.is_opened" />
                    <ArrowUpIcon v-else />
                    <div class="absolute -top-1 -right-1 bg-green-500 w-3 h-3 text-white rounded-full flex-center">
                        <p class="text-[8px] font-thin">{{ item.sub_items?.length ?? 0 }}</p>
                    </div>
                </IconButton>
                <IconButton v-tippy="{ content: !item.is_opened ? 'Open All' : 'Close All' }" @click.stop="toggleAll">
                    <ExpandIcon />
                </IconButton>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center w-full gap-2">
            <p class="text-sm font-thin text-center">{{ item.description }}</p>
            <button v-if="isDetails" class="text-sm hover:text-blue-500" @click="showDetail = !showDetail">detayları
                göster</button>
            <template v-if="showDetail">
                <template v-if="(item.tags?.length ?? 0) > 0">
                    <p>Etiketler</p>
                    <div class="flex flex-wrap gap-2 w-full">
                        <div v-for="tag in item.tags" class="rounded-md p-2 flex-center shadow-md border">
                            <p>{{ tag.name }}</p>
                        </div>
                    </div>
                </template>
                <template v-if="(item.parameters?.length ?? 0) > 0">
                    <p>Parametreler</p>
                    <div class="flex flex-wrap gap-2 w-full">
                        <div v-for="parameter in item.parameters" class="rounded-md p-2 flex-center shadow-md border">
                            <code>{{ parameter.name }} => {{ parameter.type }}</code>
                        </div>
                    </div>

                </template>
                <template v-if="(item.database_relation?.length ?? 0) > 0">
                    <p>Database </p>
                    <div class="flex flex-wrap gap-2">
                        <button v-for="name in item.database_relation"
                            class="rounded-md p-2 flex-center shadow-md border">
                            <p>{{ name }}</p>
                        </button>
                    </div>

                </template>
            </template>

        </div>
        <div v-if="item.is_opened && (item.sub_items?.length ?? 0) > 0" class="w-[1px] h-10 bg-gray-900"></div>
        <div v-if="item.is_opened" class="w-full flex flex-col justify-between items-center">
            <div v-if="item.is_opened && (item.sub_items?.length ?? 0) > 0" class="h-[1px] bg-gray-900"
                :style="`width:${(item.sub_items?.length ?? 0) > 1 ? '100%' : '1px'}`">
            </div>
            <div class=" flex gap-4 items-start justify-between w-full">
                <div v-for="i_module in item.sub_items" :key="i_module._id" class="flex flex-col items-center">
                    <div v-if="item.is_opened && (item.sub_items?.length ?? 0) > 0" class="w-[1px] h-10 bg-gray-900">
                    </div>
                    <module :item="i_module"
                        @item-deleted="(deletedItem) => myItemModule.deleteItem({ deletedItem, baseItem: item })"
                        :parent="item" :canEditable="canEditable" />
                </div>
            </div>
        </div>
    </div>
    <add_or_edit_popup v-if="showAddPopup && canEditable" :item="item" @on-close="showAddPopup = false" />
    <add_or_edit_popup v-if="showEditPopup && canEditable" :item="item" @on-close="showEditPopup = false"
        :is-edit="true" @on-updated="(newItem) => myItemModule.updateItem({ oldItem: item, newItem, parent })" />

    <move_popup :item="item" v-if="showMovePopup && canEditable" @on-close="showMovePopup = false" :parent="parent" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { IModule } from '../../../models/IModule';
import add_or_edit_popup from '../../../components/Popups/add_or_edit_popup.vue';
import move_popup from '../../../components/Popups/move_popup.vue';
import ArrowDownIcon from '../../../components/Icons/ArrowDownIcon.vue';

import ArrowUpIcon from '../../../components/Icons/ArrowUpIcon.vue';
import EditIcon from '../../../components/Icons/EditIcon.vue';
import PlusIcon from '../../../components/Icons/PlusIcon.vue';
import DeleteIcon from '../../../components/Icons/DeleteIcon.vue';
import MoveIcon from '../../../components/Icons/MoveIcon.vue';
import ExpandIcon from '../../../components/Icons/ExpandIcon.vue';
import IconButton from '../../../components/Buttons/IconButton.vue';
import { ModuleServices } from '../../../services/module_services';
import { useToast } from 'vue-toastification';
import { computed } from '@vue/reactivity';
import { getModule } from 'vuex-module-decorators';
import store from '../../../store';
import MyItemModule from '../../../store/my_item';
import { forEachAllSubItems } from '../../../utils/modules_helper';

interface Props {
    item: IModule,
    parent: IModule,
    canEditable: boolean,
}

const showAddPopup = ref(false);
const showEditPopup = ref(false);
const showMovePopup = ref(false);
const showDetail = ref(false);


const props = defineProps<Props>();
const emit = defineEmits(["itemDeleted"]);

const myItemModule = getModule(MyItemModule, store);
const toast = useToast();

const isDetails = computed(() => {
    return ((props.item.parameters?.length ?? 0) > 0) || ((props.item.tags?.length ?? 0) > 0) || ((props.item.database_relation?.length ?? 0) > 0)
})

const deleteModule = async () => {
    var res = await ModuleServices.deleteItem(props.item._id!)
    if (res) {
        toast.success("Item deleted");
        emit("itemDeleted", props.item)
    }
}
const toggleOpened = () => {
    props.item.is_opened = !props.item.is_opened;
    ModuleServices.updateModule(props.item._id!, props.item)
}

const toggleAll = () => {
    forEachAllSubItems(props.item, (item) => {
        if (item._id == props.item._id) {
            item.is_opened = !item.is_opened;
        } else {
            item.is_opened = props.item.is_opened;
        }
    });

}

</script>