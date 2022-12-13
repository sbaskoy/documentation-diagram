
import { IModule } from './../models/IModule';


export const findItem = (items: IModule[], id: string): IModule | undefined => {
    for (let item of items) {
        return findItemById(item, id);
    }
}

const findItemById = (module: IModule, id: string): IModule | undefined => {
    var len = module.sub_items?.length ?? 0;
    if (module._id == id) return module;
    while (len--) {
        var item = module.sub_items?.find(i => i._id == id);
        if (item) {
            return item;
        } else {
            return findItemById(module.sub_items![len], id)
        }
    }
    return;
}

const getSubItems = (module: IModule) => {
    var len = module.sub_items?.length ?? 0;
    var items: IModule[] = [module];
    while (len--) {
        items.push(...getSubItems(module.sub_items![len]));
    }
    return items;
}

export const getAllSubItemList = ($res: IModule[]) => {
    return $res.reduce((total: IModule[], item) => {
        return total.concat(getSubItems(item));
    }, []);
}

const reducer = (module: IModule, callback: (item: IModule) => void) => {
    var len = module.sub_items?.length ?? 0;
    callback(module)
    while (len--) {
        callback(module.sub_items![len]);
        reducer(module.sub_items![len], callback);
    }
}

export const forEachAllSubItems = (module: IModule, callback: (item: IModule) => void) => {
    callback(module);
    module.sub_items?.forEach(subItem => {
        reducer(subItem, callback);
    })
}

