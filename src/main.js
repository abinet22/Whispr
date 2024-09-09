// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // Import Vue Router
import store from './store';
const app = createApp(App);
app.use(store); 
app.use(router);  // Use Vue Router
app.mount('#app');
