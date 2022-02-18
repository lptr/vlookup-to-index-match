import { createApp } from "vue";
import App from "./App.vue";
import VueGtag from "vue-gtag";

createApp(App)
  .use(VueGtag, {
    config: { id: "G-3FC267J0K7" },
  })
  .mount("#app");
