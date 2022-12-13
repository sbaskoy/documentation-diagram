import { get } from "./app_axios";
export class MarkdownServices {
    static getMenuItems = () => {
        return get("/")
    }
    static getContent = (path: string) => {
        return get(`/${path}`)
    }
}