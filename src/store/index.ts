import { createStore } from "vuex";
import MyItemModule from "./my_item";

const store = createStore({
    modules: {
        modules: MyItemModule
    },
    plugins: [],
});

export default store;