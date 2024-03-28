import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.scss'
import App from './App.vue'
import router from "./router/index.ts";

// 全局Message
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import { ElMessage, ElMessageBox } from "element-plus";

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(router)
app.use(ElMessage)
app.use(ElMessageBox)
app.mount('#app')
