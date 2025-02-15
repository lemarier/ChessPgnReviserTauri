import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import PrimeVue from 'primevue/config';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import App from "./App.vue";

import messages from "./i18n";

// https://stackoverflow.com/a/31135571/662618
function getLang() {
  if (navigator.languages != undefined) return navigator.languages[0];
  return navigator.language;
}

const locale = getLang();

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: "en",
  messages,
});

const app = createApp(App);

app.use(i18n);
app.use(PrimeVue);
app.component('Dialog', Dialog);
app.component('Button', Button);

app.mount("#app");
