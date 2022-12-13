
import { Module, Action, Mutation, VuexModule, getModule } from "vuex-module-decorators";
import { ModuleServices } from "../services/module_services";
import { findItem, getAllSubItemList } from "../utils/modules_helper";
import { IModule } from './../models/IModule';

@Module({ namespaced: true, name: 'modules' })
export default class MyItemModule extends VuexModule {
    private _items: IModule[] = [];
    private _loading: boolean = true;
    get items(): IModule[] {
        return this._items;
    }
    get loading(): boolean {
        return this._loading;
    }
    @Mutation
    setItems(items: IModule[]) {
        this._items = items;
    }
    @Mutation
    changeLoading(val: boolean) {
        this._loading = val;
    }
    @Mutation
    deleteItem({ deletedItem, baseItem }: { deletedItem: IModule, baseItem: IModule }) {
        if (deletedItem.is_top_level) {
            this._items = this._items.filter(i => i._id != deletedItem._id);
        } else {
            baseItem.sub_items = baseItem.sub_items?.filter(i => i._id != deletedItem._id);
        }
        //this._items = this._items.filter(i => i._id != item._id);
    }
    @Mutation
    pushItem(item: IModule) {
        this._items.push(item)
    }
    @Mutation
    updateItem({ oldItem, newItem, parent }: { oldItem: IModule, newItem: IModule, parent: IModule }) {
        var item =
            oldItem.is_top_level == true ?
                this._items.find(i => i._id == oldItem._id) as { [key: string]: any } :
                parent.sub_items?.find(i => i._id == oldItem._id) as { [key: string]: any };
        if (item) {
            Object.keys(newItem).forEach(key => {
                var val = (newItem as { [key: string]: any })[key];
                if (val) {
                    item[key] = val;
                }
            })
        }
    }
    @Action
    async getItems() {
        this.context.commit("changeLoading", true);
        var res = await ModuleServices.getAllModules()
        if (res) {
            this.context.commit("setItems", res);
        }
        this.context.commit("changeLoading", false);
    }
}