import { createApp } from 'vue'
import App from './App.vue'
import Toast from "vue-toastification";
import Vue3ColorPicker from "vue3-colorpicker";
import VueTippy from 'vue-tippy'


import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'
import "vue-toastification/dist/index.css";
import "./assets/tailwind.css"
import "vue3-colorpicker/style.css";


import router from './routes/index';
import store from './store';

const app = createApp(App)

app.use(router);
app.use(store);

app.use(Toast, {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
});

app.use(
    VueTippy,
    // optional
    {
        directive: 'tippy', // => v-tippy
        component: 'tippy', // => <tippy/>
        componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
        defaultProps: {
            placement: 'top',
            allowHTML: true,
            delay: [400, 200],
            animation: 'scale',
        },
    }
)

app.use(Vue3ColorPicker)

app.mount('#app')
