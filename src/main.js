// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueScroller from 'vue-scroller'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import Toast from 'vue-easy-toast'

router.beforeEach((to, from, next) => {
  if (to.query.uid && to.query.token) {
    var uids = to.query.uid
    var tokens = to.query.token
    if (uids instanceof Array) {
      localStorage.setItem('uid', uids[uids.length - 1])
    } else {
      localStorage.setItem('uid', uids)
    }
    if (tokens instanceof Array) {
      localStorage.setItem('token', tokens[tokens.length - 1])
    } else {
      localStorage.setItem('token', tokens)
    }
  }
  next()
})

Vue.use(VueScroller)
Vue.use(VueAwesomeSwiper)
Vue.use(Toast)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

