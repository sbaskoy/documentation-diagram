import axios from "axios";

import { useToast } from "vue-toastification";
import { AxiosResponse } from './../../node_modules/axios/index.d';



export const removeUndefined = (payload: any) => {
    var keys = Object.keys(payload);
    keys.forEach((i: string) => {
        if (typeof payload[i] != "boolean") {
            if (payload[i] == undefined || payload[i] == '') {
                delete payload[i]
            }
            if (payload[i] == -1) {
                delete payload[i]
            }
        }
    })
    return payload;
}


const appAxios = axios.create({
    //baseURL: "http://localhost:1882"
    baseURL: "http://ganimuhendislik.com:1882"
})
export const post = async (path: string, data: any,): Promise<any | null> => {
    var toast = useToast();
    removeUndefined(data);
    try {
        var response: AxiosResponse = await appAxios.post(path, { ...data });
        if (response.status == 200) {
            return response.data;
        }
        return null;
    } catch (err: any) {
        var message = err?.response?.data?.message;
        if (message) {
            toast.error(message);
        } else {
            toast.error("Bir şeyler ters gitti. :(");
        }
        return null;
    }
}
export const deleteMethod = async (path: string): Promise<any | null> => {
    var toast = useToast();
    try {
        var response: AxiosResponse = await appAxios.delete(path);
        if (response.status == 200) {
            return response.data;
        }
        return null;
    } catch (err: any) {
        var message = err?.response?.data?.message;
        if (message) {
            toast.error(message);
        } else {
            toast.error("Bir şeyler ters gitti. :(");
        }
        return null;
    }
}
export const get = async (path: string): Promise<any | null> => {
    var toast = useToast();
    try {
        var response: AxiosResponse = await appAxios.get(path);
        if (response.status == 200) {
            return response.data;
        }
        return null;
    } catch (err: any) {
        var message = err?.response?.data?.message;
        if (message) {
            toast.error(message);
        } else {
            toast.error("Bir şeyler ters gitti. :(");
        }
        return null;
    }
}




export default appAxios;