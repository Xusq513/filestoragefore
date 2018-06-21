// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import jquery from 'jquery'
import base from './base'
import './assets/css/bootstrap.min.css'  
import './assets/css/dashboard.css' 
 import './assets/css/tooltip.css'  
import './assets/js/bootstrap.min'  
import './assets/js/bootstrap-contextmenu' 
import Bus from './components/Bus'
import FileUpload from 'vue-upload-component'
//import VTooltip from 'v-tooltip'
import vDialog from 'v-dialogs';



//Vue.config.productionTip = false
Vue.use(base);
//Vue.use(VTooltip);
Vue.use(vDialog);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
