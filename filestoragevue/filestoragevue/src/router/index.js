import Vue from 'vue'
import Router from 'vue-router'
import DirView from '@/components/DirView'
import FileView from '@/components/FileView'

Vue.use(Router)

export default new Router({
  routes: [
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
})
