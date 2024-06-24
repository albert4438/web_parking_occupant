import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/parking_occupant/api';

createApp(App).use(router).mount('#app');


