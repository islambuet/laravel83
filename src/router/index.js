import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: () => import('@/components/home/Home.vue') },  
  { path: '/login',  component: () => import('@/components/login/Login.vue') },
  { path: '/register', component: () => import('@/components/register/Register.vue') },  
  { path: '/sys_module_task', component: () => import('@/components/sys_module_task/SysModuleTask.vue'),children:[{path: 'add'},{path: 'edit/:item_id'}]},
  { path: '/sys_user_group', component: () => import('@/components/sys_user_group/SysUserGroup.vue'),children:[{path: 'add'},{path: 'edit/:item_id'},{path: 'role/:item_id'}]},
  { path: '/setup_users', component: () => import('@/components/setup_users/SetupUsers.vue'),children:[{path: 'add'},{path: 'edit/:item_id'}]},
  { path: '*',name:'NotFound',component: function () {return import('@/components/not_found/NotFound.vue')}}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
