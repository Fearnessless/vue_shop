import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import Province from './components/city/Province.vue'
import City from './components/city/City.vue'
import Users from './components/user/Users.vue'
import UserAdd from './components/user/UserAdd.vue'
import Orders from './components/order/Orders.vue'
import OrderAdd from './components/order/OrderAdd.vue'
import Finance from './components/finance/Finance.vue'
import FinanceAdd from './components/finance/FinanceAdd.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    // 路由重定向
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/province', component: Province },
        { path: '/city', component: City },
        { path: '/users', component: Users },
        { path: '/userAdd', component: UserAdd },
        { path: '/orders', component: Orders },
        { path: '/orderAdd', component: OrderAdd },
        { path: '/finance', component: Finance },
        { path: '/financeAdd', component: FinanceAdd }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 表示将要访问的路径
  // from 表示从哪个路径跳转过来的
  // next 是一个函数，表示放行
  //      next() 放行    next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  else next()
})

export default router
