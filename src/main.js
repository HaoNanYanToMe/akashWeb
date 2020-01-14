import Vue from 'vue';
import ViewUI from 'view-design';
import VueRouter from 'vue-router';
import axios from 'axios';
import {
	routers,
	webRouter
} from './router';
import Util from './libs/util';
import App from './app.vue';
import global from './global'
import 'view-design/dist/styles/iview.css';
import https from './https'


Vue.use(VueRouter);
Vue.use(ViewUI);

Vue.prototype.$http = https
// 路由配置
const RouterConfig = {
	mode: 'history',
	base: global.app.publicPath,
	routes: routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
	ViewUI.LoadingBar.start();
	Util.title(to.meta.title);
	next();
});

router.afterEach((to, from, next) => {
	ViewUI.LoadingBar.finish();
	window.scrollTo(0, 0);
});

new Vue({
	el: '#app',
	router: router,
	render: h => h(App)
});
 