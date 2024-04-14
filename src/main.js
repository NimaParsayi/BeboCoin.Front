import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'swiper/css';
import '../node_modules/nprogress/nprogress.css'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';
import "vue-connect-wallet/dist/style.css";
import VueConnectWallet from "vue-connect-wallet";

createApp(App)
    .use(router)
    .use(ToastPlugin)
    .use(VueConnectWallet)
    .mount('#app')
