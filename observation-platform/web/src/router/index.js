import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/views/Dashboard.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import AdminPanel from '@/views/AdminPanel.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/admin',
      name: 'AdminLogin',
      component: AdminLogin
    },
    {
      path: '/admin/panel',
      name: 'AdminPanel',
      component: AdminPanel,
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, _from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = localStorage.getItem('observation-token');
    if (!token) {
      next({ name: 'AdminLogin' });
      return;
    }
  }
  next();
});

export default router;
