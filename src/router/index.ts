import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'

import { useUserStore } from '@/stores/user'

declare module 'vue-router' {
  interface RouteMeta {
    /** 是否需要登录 */
    requiresAuth?: boolean
    /** 页面标题 */
    title?: string
  }
}

NProgress.configure({ showSpinner: false, trickleSpeed: 120 })

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 88 }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
          meta: { title: '首页' },
        },
        {
          path: 'topic/create',
          name: 'topic-create',
          component: () => import('@/views/TopicEditorView.vue'),
          meta: { requiresAuth: true, title: '发布话题' },
        },
        {
          path: 'topic/:id(\\d+)',
          name: 'topic-detail',
          component: () => import('@/views/TopicDetailView.vue'),
          meta: { title: '话题详情' },
        },
        {
          path: 'topic/:id(\\d+)/edit',
          name: 'topic-edit',
          component: () => import('@/views/TopicEditorView.vue'),
          meta: { requiresAuth: true, title: '编辑话题' },
        },
        {
          path: 'jobs',
          name: 'jobs',
          component: () => import('@/views/JobsView.vue'),
          meta: { title: '招聘专区' },
        },
        {
          path: 'rank',
          name: 'rank',
          component: () => import('@/views/RankView.vue'),
          meta: { title: '社区榜单' },
        },
        {
          path: 'user/:loginname',
          name: 'user-detail',
          component: () => import('@/views/UserDetailView.vue'),
          meta: { title: '用户主页' },
        },
        {
          path: 'messages',
          name: 'messages',
          component: () => import('@/views/MessagesView.vue'),
          meta: { requiresAuth: true, title: '消息中心' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
          meta: { requiresAuth: true, title: '个人设置' },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
          meta: { title: '登录' },
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/SignupView.vue'),
          meta: { title: '注册' },
        },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: () => import('@/views/ResetPasswordView.vue'),
          meta: { title: '找回密码' },
        },
        {
          path: 'activate',
          name: 'activate',
          component: () => import('@/views/ActivateView.vue'),
          meta: { title: '激活账号' },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: '页面不存在' },
    },
  ],
})

router.beforeEach((to) => {
  NProgress.start()
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLogin) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (userStore.isLogin && ['login', 'signup', 'reset-password'].includes(String(to.name))) {
    return { name: 'home' }
  }

  document.title = to.meta.title ? `${to.meta.title} · CNode 社区` : 'CNode 社区'
  return true
})

router.afterEach(() => {
  NProgress.done()
})

router.onError(() => {
  NProgress.done()
})

export default router
