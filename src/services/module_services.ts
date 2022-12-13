
import { deleteMethod, get, post } from "./app_axios";
import { IModule } from './../models/IModule';

export class ModuleServices {
    static getAllModules = () => {
        return get("module/")
    }
    static getModule = (id: string) => {
        return get(`module/${id}`)
    }
    static saveModule = (module: IModule) => {
        var item = { ...module }
        delete item._id;
        return post(`module/`, item)
    }
    static updateModule = (id: string, module: IModule) => {
        var item = { ...module }
        delete item._id;
        
       
        return post(`module/${id}/update`, item)
    }
    static addSubItem = (id: string, module: IModule) => {
        var item = { ...module }
        delete item._id;
        return post(`module/${id}/add-sub-item`, item)
    }
    static deleteItem = (id: string) => {
        return deleteMethod(`module/${id}/delete`)
    }
    static moveItem = (data: { moved_id: string, new_id: string }) => {
        return post(`module/move`, {
            ...data
        })
    }
}