import Vue from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify';
import router from "./router";

// import the font-awesome capabilities
import './plugins/fontAwesome'

//  import base components
import './plugins/base'

// imprt vue-meta
import './plugins/meta'

// imprt vue-meta
import './plugins/fonts'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
