import global from './global.js'

export const webRouter = [{
		path: '/',
		meta: {
			title: global.app.tagTitle
		},
		alias: '/index',
		component: (resolve) => require(['./views/web/index.vue'], resolve)
	},
	{
		path: '/index2',
		meta: {
			title: global.app.tagTitle
		},
		component: (resolve) => require(['./views/web/index2.vue'], resolve)
	}
];


export const routers = [
	...webRouter
];
