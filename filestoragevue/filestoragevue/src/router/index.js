import Vue from 'vue'
import Router from 'vue-router'
import DirView from '@/components/DirView'
import FileView from '@/components/FileView'
import windowView from '@/components/windowView'
import login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
		{
			path: '/windowView',
			name: 'windowView',
			component: windowView,
			children:[
				{
					path: '/',
					name: 'DirView',
					component: DirView
				},
				{
					path: '/fileView',
					name: 'FileView',
					component: FileView
				}
			]
		},
		{
			path: '/',
			name: 'login',
			component: login
		}
  ]
})
